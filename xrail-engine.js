/*
 * SPIN WARS X — X-RAIL ENGINE
 * Version 4.1 — physical rail contact / authored SVG path
 *
 * The gameplay rail is the exact centerline drawn by renderNewBattle().
 * FREE -> swept contact -> BOUNCE or CAPTURE -> RIDE -> X-EXIT -> FREE
 */
(function(global){
    "use strict";

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    /* EXACT SVG CENTERLINE FROM THE LIVE STADIUM. */
    const SVG_SEGMENTS=[
        [[44.8,10.3],[41.6,8.2],[37.2,7.2],[32.8,9.3]],
        [[32.8,9.3],[20.8,15.1],[14.0,29.0],[14.7,45.5]],
        [[14.7,45.5],[15.6,63.0],[29.6,76.8],[50.0,77.7]],
        [[50.0,77.7],[70.4,76.8],[84.4,63.0],[85.3,45.5]],
        [[85.3,45.5],[86.0,29.0],[79.2,15.1],[67.2,9.3]],
        [[67.2,9.3],[62.8,7.2],[58.4,8.2],[55.2,10.3]]
    ];

    /* SVG uses 100x100; gameplay uses x/y centered at 50/46 and scaled by 39. */
    const SVG_SCALE=39;
    const RAIL_STROKE_WIDTH=2.1;
    const RAIL_HALF_WIDTH=RAIL_STROKE_WIDTH/(2*SVG_SCALE);
    const CONTACT_EPSILON=0.004;
    const DEFAULT_BEY_RADIUS=0.124;

    function toGame(p){
        return {x:(p[0]-50)/SVG_SCALE,y:(p[1]-46)/SVG_SCALE};
    }

    function bezier(p0,p1,p2,p3,t){
        const u=1-t,uu=u*u,tt=t*t;
        return {
            x:uu*u*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+tt*t*p3.x,
            y:uu*u*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+tt*t*p3.y
        };
    }

    function derivative(p0,p1,p2,p3,t){
        const u=1-t;
        return {
            x:3*u*u*(p1.x-p0.x)+6*u*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x),
            y:3*u*u*(p1.y-p0.y)+6*u*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y)
        };
    }

    let geometry=null;

    function buildGeometry(){
        if(geometry) return geometry;

        const samples=[];
        const perCurve=72;

        for(const raw of SVG_SEGMENTS){
            const [a,b,c,d]=raw.map(toGame);
            for(let i=0;i<perCurve;i++){
                const t=i/perCurve;
                const p=bezier(a,b,c,d,t);
                const q=derivative(a,b,c,d,t);
                const len=Math.hypot(q.x,q.y);
                if(len<1e-9) continue;
                samples.push({
                    x:p.x,y:p.y,
                    tx:q.x/len,ty:q.y/len
                });
            }
        }

        const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame);
        const q=derivative(...last,1);
        const len=Math.hypot(q.x,q.y)||1;
        samples.push({
            x:last[3].x,y:last[3].y,
            tx:q.x/len,ty:q.y/len
        });

        const segments=[];
        let total=0;
        for(let i=0;i<samples.length-1;i++){
            const a=samples[i],b=samples[i+1];
            const length=Math.hypot(b.x-a.x,b.y-a.y);
            if(length<1e-9) continue;
            segments.push({a,b,length,start:total});
            total+=length;
        }

        geometry={
            samples,
            segments,
            total,
            leftExit:samples[0],
            rightExit:samples[samples.length-1]
        };
        return geometry;
    }

    function nearest(x,y){
        const g=buildGeometry();
        if(!Number.isFinite(x)||!Number.isFinite(y)) return null;

        let best=null;
        for(const seg of g.segments){
            const abx=seg.b.x-seg.a.x;
            const aby=seg.b.y-seg.a.y;
            const ab2=abx*abx+aby*aby;
            if(ab2<1e-12) continue;

            const t=clamp(
                ((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,
                0,1
            );
            const px=seg.a.x+abx*t;
            const py=seg.a.y+aby*t;
            const dx=x-px,dy=y-py;
            const dist2=dx*dx+dy*dy;
            if(best&&dist2>=best.dist2) continue;

            let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t;
            let ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t;
            const tl=Math.hypot(tx,ty);
            if(tl<1e-9) continue;

            best={
                x:px,y:py,
                dist2,
                distance:seg.start+seg.length*t,
                tx:tx/tl,ty:ty/tl
            };
        }
        return best;
    }

    function tangentAt(point,direction=1){
        if(!point) return null;
        const sign=direction<0?-1:1;
        return {x:point.tx*sign,y:point.ty*sign};
    }

    function beyRadius(s){
        const r=Number(s?.radius);
        return Number.isFinite(r)&&r>0 ? r : DEFAULT_BEY_RADIUS;
    }

    function contactRadius(s){
        /* Match the rendered Bey circle + the visible SVG rail stroke. */
        return beyRadius(s)+RAIL_HALF_WIDTH+CONTACT_EPSILON;
    }

    function setContactDebug(s,p,distance,kind){
        s.railContacting=true;
        s.railContactDistance=distance;
        s.railContactPoint=p ? {x:p.x,y:p.y} : null;
        s.lastXRailContactType=kind||"contact";
    }

    function clearContactDebug(s){
        s.railContacting=false;
        s.railContactDistance=null;
        s.lastXRailContactType=null;
    }

    function resetRide(s){
        s.railEngaged=false;
        s.railGrip=0;
        s.railDirection=0;
        s.railSpeed=0;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s.railContactPoint=null;
        s._xrailLastDistance=null;
        clearContactDebug(s);
    }

    function release(s,reason){
        if(!s) return false;
        const p=nearest(s.x,s.y);
        resetRide(s);
        s.railExited=reason==="x-exit";
        s.railExitForce=reason==="x-exit"?Math.hypot(s.vx,s.vy):0;
        s.railExitRefractory=reason==="x-exit"?0.22:0.08;
        s.railCaptureCooldown=reason==="x-exit"?0.16:0.08;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.railExitRefractoryPoint={x:s.x,y:s.y};
        s.lastXRailExitReason=reason||"release";
        if(p) s.railDistance=p.distance;
        return true;
    }

    function getContact(s,p){
        if(!s||!p) return null;
        const distance=Math.sqrt(Math.max(0,p.dist2));
        if(!Number.isFinite(distance)) return null;

        let nx=s.x-p.x,ny=s.y-p.y;
        const nlen=Math.hypot(nx,ny);
        if(nlen<1e-8){
            nx=-p.ty;
            ny=p.tx;
        }else{
            nx/=nlen;
            ny/=nlen;
        }

        const speed=Math.hypot(s.vx,s.vy);
        const normal=s.vx*nx+s.vy*ny;
        const inward=-normal;
        const tangential=s.vx*p.tx+s.vy*p.ty;

        return {
            distance,nx,ny,speed,normal,inward,tangential,
            approachRatio:inward/Math.max(speed,0.0001),
            tangentRatio:tangential/Math.max(speed,0.0001),
            tilt:Math.abs(Number(s.tiltLevel)||0)
        };
    }

    function sweptRailContact(s){
        if(!s) return null;

        const x0=Number.isFinite(s._xrailPrevX)?s._xrailPrevX:s.x;
        const y0=Number.isFinite(s._xrailPrevY)?s._xrailPrevY:s.y;
        const x1=s.x,y1=s.y;
        const dx=x1-x0,dy=y1-y0;
        const travel=Math.hypot(dx,dy);
        const radius=contactRadius(s);
        const samples=Math.max(4,Math.min(24,Math.ceil(travel/0.006)));

        let best=null;
        for(let i=0;i<=samples;i++){
            const u=i/samples;
            const x=x0+dx*u;
            const y=y0+dy*u;
            const p=nearest(x,y);
            if(!p) continue;

            const distance=Math.sqrt(Math.max(0,p.dist2));
            if(distance>radius) continue;

            if(!best||distance<best.distance){
                best={...p,distance,u};
            }
        }

        if(!best) return null;

        const previousDistance=Number.isFinite(s._xrailPrevDistance)
            ? s._xrailPrevDistance
            : Infinity;

        const entering=
            previousDistance>radius+CONTACT_EPSILON &&
            best.distance<=radius+CONTACT_EPSILON;

        /* Evaluate velocity at the actual contact point, not just at the end of the frame. */
        const cx=x0+(x1-x0)*best.u;
        const cy=y0+(y1-y0)*best.u;
        let nx=cx-best.x,ny=cy-best.y;
        const nlen=Math.hypot(nx,ny);
        if(nlen<1e-8){nx=-best.ty;ny=best.tx;}
        else {nx/=nlen;ny/=nlen;}

        const inward=-(s.vx*nx+s.vy*ny);
        const movingInto=inward>0.0018;
        const impact=entering||movingInto;

        return {
            ...best,
            impact,
            entering,
            inward,
            previousDistance,
            contactX:cx,
            contactY:cy
        };
    }


    function capture(input){
        input=input||{};
        const speed=Number(input.speed)||0;
        const rpm=clamp01(input.rpm);
        const approach=clamp(Number(input.approachRatio)||0,0,1);
        const tangent=clamp(Number(input.tangentRatio)||0,0,1);
        const tangentSpeed=Number(input.tangentSpeed)||0;
        const affinity=clamp(Number(input.affinity)||0,0,1);
        const stability=clamp(Number(input.stability)||0,0,1);
        const deliberate=input.deliberate===true;
        const attackBit=input.attackBit===true;

        const rpmFloor=deliberate?0.22:(attackBit?0.34:0.38);
        const speedFloor=deliberate?0.006:(attackBit?0.012:0.014);
        const tangentFloor=deliberate?0.16:(attackBit?0.30:0.36);
        const tangentSpeedFloor=deliberate?0.0045:(attackBit?0.008:0.010);
        const approachFloor=deliberate?0.035:0.065;

        if(rpm<rpmFloor)return{capture:false,reason:"low-rpm"};
        if(speed<speedFloor)return{capture:false,reason:"low-speed"};
        if(tangent<tangentFloor||tangentSpeed<tangentSpeedFloor)
            return{capture:false,reason:"insufficient-tangent"};
        if(approach<approachFloor&&tangent<Math.min(0.60,tangentFloor+0.14))
            return{capture:false,reason:"insufficient-approach"};

        const approachQuality=clamp(approach/0.32,0,1);
        const tangentQuality=clamp((tangent-tangentFloor)/Math.max(0.01,1-tangentFloor),0,1);
        const speedQuality=clamp((speed-speedFloor)/0.045,0,1);
        const score=clamp(
            approachQuality*0.16+tangentQuality*0.38+speedQuality*0.18+
            affinity*0.12+stability*0.10+rpm*0.06,0,1
        );
        const baseChance=deliberate?0.92:0.22+score*0.70+(attackBit?0.05:0);
        const chance=clamp(baseChance+(Math.random()-0.5)*0.035,0.18,0.96);
        if(Math.random()>chance)return{capture:false,reason:"marginal-contact",score,chance};
        return{
            capture:true,score,chance,
            grip:clamp(0.58+affinity*0.16+score*0.22+rpm*0.04,0.50,0.96),
            initialBoost:0
        };
    }

    function captureDecision(s,p,contact){
        const c=getContact(s,p);
        if(!c||c.speed<0.007) return {ok:false,reason:"low-speed",contact:c};
        if(s.spinDirection!==1) return {ok:false,reason:"wrong-spin",contact:c};
        if(!contact?.impact) return {ok:false,reason:"no-rail-impact",contact:c};

        /* Deliberate physical catch: enough inward impact + enough authored-path momentum. */
        if(c.inward<0.0048) return {ok:false,reason:"weak-impact",contact:c};
        if(c.tangential<0.0055 || c.tangentRatio<0.20){
            return {ok:false,reason:"insufficient-ccw-momentum",contact:c};
        }
        if(c.approachRatio>0.93) return {ok:false,reason:"too-direct",contact:c};
        if(c.tilt>0.38) return {ok:false,reason:"tilt-too-high",contact:c};

        return {
            ok:true,
            contact:c,
            grip:clamp(
                0.72+(1-c.tilt)*0.14+c.tangentRatio*0.10,
                0.72,0.96
            )
        };
    }

    function engage(s,contact){
        if(!s||s.railEngaged||!contact?.impact) return false;
        if((s.railExitRefractory||0)>0||(s.railCaptureCooldown||0)>0) return false;

        const p=contact;
        const decision=captureDecision(s,p,contact);
        s.lastXRailResult=decision.reason||"rejected";
        setContactDebug(s,p,p.distance,"impact");
        if(!decision.ok) return false;

        const c=decision.contact;
        if(c.normal<0){
            s.vx-=c.nx*c.normal;
            s.vy-=c.ny*c.normal;
        }

        const tangential=s.vx*p.tx+s.vy*p.ty;
        if(!Number.isFinite(tangential)||tangential<=0.0035){
            s.lastXRailResult="capture-lost-tangent";
            return false;
        }

        s.railEngaged=true;
        s.railExited=false;
        s.railDirection=1;
        s.railGrip=decision.grip;
        s.railContactPoint={x:p.x,y:p.y};
        s.railDistance=p.distance;
        s.railSpeed=tangential;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s._xrailLastDistance=p.distance;
        s._xrailPrevDistance=p.distance;
        s.railUses=(s.railUses||0)+1;
        s.lastXRailResult="capture";

        /* Put the rendered Bey exactly one contact radius from the rendered rail centerline. */
        const gap=contactRadius(s);
        const nx=s.x-p.x,ny=s.y-p.y;
        const len=Math.hypot(nx,ny);
        if(p.distance<gap&&len>1e-8){
            const push=gap-p.distance;
            s.x+=(nx/len)*push;
            s.y+=(ny/len)*push;
        }

        return true;
    }

    function bounce(s,p){
        if(!s||!p) return false;

        let nx=s.x-p.x,ny=s.y-p.y;
        const len=Math.hypot(nx,ny);
        if(len<1e-9){nx=-p.ty;ny=p.tx;}
        else {nx/=len;ny/=len;}

        const normal=s.vx*nx+s.vy*ny;
        setContactDebug(s,p,Math.sqrt(Math.max(0,p.dist2)),"surface");

        if(normal<0){
            const restitution=0.46;
            const reflected=-normal*restitution;
            s.vx-=nx*normal;
            s.vy-=ny*normal;
            s.vx+=nx*reflected;
            s.vy+=ny*reflected;

            const gap=contactRadius(s);
            const d=Math.sqrt(Math.max(0,p.dist2));
            if(d<gap){
                const push=gap-d;
                s.x+=nx*push;
                s.y+=ny*push;
            }

            s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);
            s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
            s.railCaptureCooldown=0.10;
            s.railCaptureCooldownPoint={x:s.x,y:s.y};
            s.lastXRailResult="bounce";
            return true;
        }

        s.lastXRailResult="near-rail-no-impact";
        return false;
    }

    function contactSafety(s,p){ return bounce(s,p); }


    /*
     * PHASE 2 — X-EXIT GEOMETRY
     * The exit is a physical centerward ramp, not a target point.
     * The launch cone is deliberately narrow: variation is allowed, but
     * corner-directed launches are not.
     */
    function exitHeading(s,endpoint){
        const cx=-endpoint.x,cy=-endpoint.y;
        const clen=Math.hypot(cx,cy)||1;
        const centerX=cx/clen,centerY=cy/clen;
        const speed=Math.max(Math.hypot(s.vx,s.vy),0.012);
        let vx=s.vx/speed,vy=s.vy/speed;

        const angle=Math.atan2(
            centerX*vy-centerY*vx,
            centerX*vx+centerY*vy
        );

        const quality=clamp(
            0.42+
            0.28*clamp01(s.rpm)+
            0.22*clamp(Number(s.railGrip)||0.70,0.50,1)+
            0.08*clamp((Number(s.railRideTime)||0)/1.2,0,1),
            0,1
        );

        const maxAngle=24*Math.PI/180;
        const retained=clamp(
            angle*(0.28+0.18*(1-quality)),
            -maxAngle,maxAngle
        );

        const ca=Math.cos(retained),sa=Math.sin(retained);
        const x=centerX*ca-centerY*sa;
        const y=centerX*sa+centerY*ca;
        const exitSpeed=clamp(
            speed*(0.97+0.04*quality+0.03*clamp01(s.rpm)),
            0.012,0.125
        );

        return {
            x,y,
            speed:exitSpeed,
            quality,
            angleDeg:retained*180/Math.PI
        };
    }

    function exitSurfaceHit(s){
        if(!s||s.railEngaged||s.railExited)return false;
        const g=buildGeometry();
        const radius=beyRadius(s)+0.035;
        const length=0.23;

        for(const endpoint of [g.leftExit,g.rightExit]){
            const cx=-endpoint.x,cy=-endpoint.y;
            const clen=Math.hypot(cx,cy)||1;
            const ix=cx/clen,iy=cy/clen;
            const ex=endpoint.x+ix*length,ey=endpoint.y+iy*length;
            const sx=ex-endpoint.x,sy=ey-endpoint.y,sl2=sx*sx+sy*sy||1;
            const t=clamp(((s.x-endpoint.x)*sx+(s.y-endpoint.y)*sy)/sl2,0,1);
            const px=endpoint.x+sx*t,py=endpoint.y+sy*t;
            let nx=s.x-px,ny=s.y-py,nl=Math.hypot(nx,ny);
            const dist=nl;
            if(dist>radius)continue;
            if(nl<1e-8){nx=-ix;ny=-iy;}else{nx/=nl;ny/=nl;}
            const incoming=s.vx*nx+s.vy*ny;
            const speed=Math.hypot(s.vx,s.vy);
            if(incoming>=-0.0015||speed<0.004)continue;

            let vx=s.vx/speed,vy=s.vy/speed;
            const angle=Math.atan2(ix*vy-iy*vx,ix*vx+iy*vy);
            const maxAngle=28*Math.PI/180;
            const a=clamp(angle,-maxAngle,maxAngle);
            const ca=Math.cos(a),sa=Math.sin(a);
            const outX=ix*ca-iy*sa,outY=ix*sa+iy*ca;
            const retained=speed*0.94;
            s.vx=outX*retained;s.vy=outY*retained;
            const penetration=Math.max(0,radius-dist);
            s.x+=nx*(penetration+0.004);s.y+=ny*(penetration+0.004);
            s.surfaceBounce=Math.max(s.surfaceBounce||0,0.08);
            s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.08);
            s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,0.42);
            s.lastXRailResult="x-exit-surface";
            s.xrailExitSurfaceHit=true;
            s.xrailExitSurfaceAngleDeg=a*180/Math.PI;
            return true;
        }
        return false;
    }

    function riderStep(s,dt){
        const g=buildGeometry();
        const p=nearest(s.x,s.y);
        if(!p){release(s,"no-geometry");return false;}

        const radius=beyRadius(s);
        const distance=Math.sqrt(Math.max(0,p.dist2));
        const contactLimit=radius+RAIL_HALF_WIDTH+0.012;
        if(distance>contactLimit){
            release(s,"lost-contact");
            return false;
        }

        const lastDistance=s._xrailLastDistance;
        if(Number.isFinite(lastDistance)&&p.distance<lastDistance-0.040){
            release(s,"lost-forward-progress");
            return false;
        }

        /* Right-spin follows the authored centerline from left endpoint to right endpoint. */
        const exitPoint=g.rightExit;
        const endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
        const nearExit=p.distance>=g.total-0.22;
        const exitForward=s.vx*exitPoint.tx+s.vy*exitPoint.ty;
        const speed=Math.hypot(s.vx,s.vy);
        const centerX=-exitPoint.x,centerY=-exitPoint.y;
        const centerLen=Math.hypot(centerX,centerY)||1;
        const centerDot=(s.vx*(centerX/centerLen)+s.vy*(centerY/centerLen))/Math.max(speed,0.0001);

        if(nearExit&&endpointDistance<=0.28&&exitForward>0.004&&centerDot>0.25){
            const heading=exitHeading(s,exitPoint);
            s.vx=heading.x*heading.speed;
            s.vy=heading.y*heading.speed;
            s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,0.88);
            s.xrailExitJustOccurred=true;
            s.xrailExitQuality=heading.quality;
            s.xrailExitAngleDeg=heading.angleDeg;
            s.railExitVector={x:heading.x,y:heading.y};
            s.railExitForce=heading.speed;
            release(s,"x-exit");
            s.vx=heading.x*heading.speed;
            s.vy=heading.y*heading.speed;
            s.lastXRailResult="x-exit";
            return false;
        }

        const tx=p.tx,ty=p.ty;
        const tangentSpeed=s.vx*tx+s.vy*ty;
        if(!Number.isFinite(tangentSpeed)||tangentSpeed<=0.0020){
            release(s,"lost-tangent");
            return false;
        }

        /*
         * Rail = constraint, not conveyor.
         * Preserve tangential momentum and add only gradual energy transfer.
         */
        const rpm=clamp(Number(s.rpm)||0,0,1);
        const grip=clamp(Number(s.railGrip)||0.75,0.65,0.96);
        const ceiling=
            0.050+
            0.045*rpm+
            0.018*grip;
        const acceleration=
            (0.00065+0.00135*rpm*grip)*dt*60;
        const friction=
            (0.00010+(1-rpm)*0.00011)*dt*60;
        const targetSpeed=Math.min(ceiling,tangentSpeed+acceleration-friction);
        const railSpeed=Math.max(0.0020,targetSpeed);

        s.vx=tx*railSpeed;
        s.vy=ty*railSpeed;
        s.x+=s.vx*dt*60;
        s.y+=s.vy*dt*60;

        const after=nearest(s.x,s.y);
        if(after){
            const ax=s.x-after.x,ay=s.y-after.y;
            const alen=Math.hypot(ax,ay);
            const targetGap=radius+RAIL_HALF_WIDTH+0.006;
            if(alen>1e-9){
                const correction=clamp(targetGap-alen,-0.014,0.014);
                s.x+=(ax/alen)*correction;
                s.y+=(ay/alen)*correction;
            }
            s.railDistance=after.distance;
            s.railContactPoint={x:after.x,y:after.y};
            s._xrailLastDistance=after.distance;
            setContactDebug(s,after,Math.sqrt(Math.max(0,after.dist2)),"riding");
        }

        s.railSpeed=Math.hypot(s.vx,s.vy);
        s.railRideTime=(s.railRideTime||0)+dt;
        s.railTravelDistance=(s.railTravelDistance||0)+s.railSpeed*dt;
        s.lastXRailResult="riding";
        return true;
    }

    function step(s,dt){
        if(!s) return {active:false,state:"none"};
        if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||
           !Number.isFinite(s.vx)||!Number.isFinite(s.vy)){
            throw new Error("X-Rail received non-finite Bey state.");
        }

        if(s.railEngaged){
            const active=riderStep(s,dt);
            s._xrailPrevX=s.x;
            s._xrailPrevY=s.y;
            s._xrailPrevDistance=Number.isFinite(s.railDistance)
                ? s.railDistance
                : s._xrailPrevDistance;
            return {active,state:s.railEngaged?"riding":"release"};
        }

        if((s.railExitRefractory||0)>0){
            s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
        }
        if((s.railCaptureCooldown||0)>0){
            s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
        }

        if(!Number.isFinite(s._xrailPrevX)){
            s._xrailPrevX=s.x;
            s._xrailPrevY=s.y;
        }

        if(exitSurfaceHit(s)){
            s._xrailPrevX=s.x;
            s._xrailPrevY=s.y;
            const p=nearest(s.x,s.y);
            s._xrailPrevDistance=p?Math.sqrt(Math.max(0,p.dist2)):Infinity;
            return {active:false,state:"exit-surface"};
        }

        const swept=sweptRailContact(s);
        if(swept?.impact){
            if(s.railExited||s.railExitRefractory>0||s.railCaptureCooldown>0){
                bounce(s,swept);
            }else if(!engage(s,swept)){
                bounce(s,swept);
            }
        }else if(swept){
            setContactDebug(s,swept,swept.distance,"near");
        }else{
            clearContactDebug(s);
        }

        s._xrailPrevX=s.x;
        s._xrailPrevY=s.y;
        const p=nearest(s.x,s.y);
        s._xrailPrevDistance=p
            ? Math.sqrt(Math.max(0,p.dist2))
            : Infinity;

        return {
            active:false,
            state:s.railEngaged?"capture":"free"
        };
    }

    function inspect(s){
        if(!s) return null;
        const p=nearest(s.x,s.y);
        if(!p) return null;
        const c=getContact(s,p);
        const swept=sweptRailContact(s);
        return {
            distance:c?.distance??null,
            contactRadius:contactRadius(s),
            speed:c?.speed??null,
            normal:c?.normal??null,
            inward:c?.inward??null,
            tangential:c?.tangential??null,
            approachRatio:c?.approachRatio??null,
            tangentRatio:c?.tangentRatio??null,
            tilt:c?.tilt??null,
            previousDistance:s._xrailPrevDistance??null,
            sweptImpact:!!swept?.impact,
            sweptEntering:!!swept?.entering,
            sweptDistance:swept?.distance??null,
            progress:p.distance,
            total:buildGeometry().total,
            engaged:!!s.railEngaged,
            contacting:!!s.railContacting,
            result:s.lastXRailResult||null
        };
    }

    global.SpinWarsXRailEngine={
        version:"4.2-phase2-exit-physics",
        geometry:buildGeometry,
        nearest,
        tangentAt,
        capture,
        release,
        engage,
        bounce,
        contactSafety,
        step,
        inspect,
        exitSurfaceHit
    };
})(window);
