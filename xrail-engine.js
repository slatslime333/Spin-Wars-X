/*
 * SPIN WARS X — X-RAIL ENGINE
 * Version 4.0 — impact capture / physical exit
 *
 * One owner. No spline riding, no scripted exit path, no random capture.
 *
 * Model:
 *   FREE -> actual crossing/contact -> BOUNCE or CAPTURE -> RIDE -> EXIT -> FREE
 *
 * The rail is a physical surface. It does not attract Beys from a distance.
 * A successful catch is an impact event, not prolonged proximity.
 */
(function(global){
    "use strict";

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    /* Exact centerline used by the current SVG stadium rail. */
    const SVG_SEGMENTS=[
        [[44.8,10.3],[41.6,8.2],[37.2,7.2],[32.8,9.3]],
        [[32.8,9.3],[20.8,15.1],[14.0,29.0],[14.7,45.5]],
        [[14.7,45.5],[15.6,63.0],[29.6,76.8],[50.0,77.7]],
        [[50.0,77.7],[70.4,76.8],[84.4,63.0],[85.3,45.5]],
        [[85.3,45.5],[86.0,29.0],[79.2,15.1],[67.2,9.3]],
        [[67.2,9.3],[62.8,7.2],[58.4,8.2],[55.2,10.3]]
    ];

    function toGame(p){ return {x:(p[0]-50)/39,y:(p[1]-46)/39}; }
    function bezier(p0,p1,p2,p3,t){
        const u=1-t,uu=u*u,tt=t*t;
        return {x:uu*u*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+tt*t*p3.x,
                y:uu*u*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+tt*t*p3.y};
    }
    function derivative(p0,p1,p2,p3,t){
        const u=1-t;
        return {x:3*u*u*(p1.x-p0.x)+6*u*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x),
                y:3*u*u*(p1.y-p0.y)+6*u*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y)};
    }

    let geometry=null;
    function buildGeometry(){
        if(geometry) return geometry;
        const samples=[];
        const perCurve=56;
        for(const raw of SVG_SEGMENTS){
            const [a,b,c,d]=raw.map(toGame);
            for(let i=0;i<perCurve;i++){
                const t=i/perCurve;
                const p=bezier(a,b,c,d,t);
                const q=derivative(a,b,c,d,t);
                const len=Math.hypot(q.x,q.y);
                if(len<1e-9) continue;
                samples.push({x:p.x,y:p.y,tx:q.x/len,ty:q.y/len});
            }
        }
        const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame);
        const q=derivative(...last,1);
        const len=Math.hypot(q.x,q.y)||1;
        samples.push({x:last[3].x,y:last[3].y,tx:q.x/len,ty:q.y/len});

        const segments=[]; let total=0;
        for(let i=0;i<samples.length-1;i++){
            const a=samples[i],b=samples[i+1];
            const length=Math.hypot(b.x-a.x,b.y-a.y);
            if(length<1e-9) continue;
            segments.push({a,b,length,start:total});
            total+=length;
        }
        geometry={samples,segments,total,leftExit:samples[0],rightExit:samples[samples.length-1]};
        return geometry;
    }

    function nearest(x,y){
        const g=buildGeometry();
        if(!Number.isFinite(x)||!Number.isFinite(y)) return null;
        let best=null;
        for(const seg of g.segments){
            const abx=seg.b.x-seg.a.x, aby=seg.b.y-seg.a.y;
            const ab2=abx*abx+aby*aby;
            if(ab2<1e-12) continue;
            const t=clamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
            const px=seg.a.x+abx*t, py=seg.a.y+aby*t;
            const dx=x-px,dy=y-py,dist2=dx*dx+dy*dy;
            if(best&&dist2>=best.dist2) continue;
            let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t;
            let ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t;
            const tl=Math.hypot(tx,ty);
            if(tl<1e-9) continue;
            best={x:px,y:py,dist2,distance:seg.start+seg.length*t,tx:tx/tl,ty:ty/tl};
        }
        return best;
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
        const distance=Math.sqrt(Math.max(0,p.dist2));
        if(distance<1e-8) return null;
        const nx=(s.x-p.x)/distance, ny=(s.y-p.y)/distance;
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

    function captureDecision(s,p,previousDistance){
        const c=getContact(s,p);
        if(!c||c.speed<0.008) return {ok:false,reason:"low-speed",contact:c};
        if(s.spinDirection!==1) return {ok:false,reason:"wrong-spin",contact:c};

        /* The Bey must actually be entering the rail, not merely orbiting beside it. */
        const crossedSinceLastFrame=
            Number.isFinite(previousDistance) &&
            previousDistance-c.distance>=0.0035;

        if(c.inward<0.0090 && !crossedSinceLastFrame){
            return {ok:false,reason:"no-rail-impact",contact:c};
        }
        if(c.inward<0.0070){
            return {ok:false,reason:"weak-impact",contact:c};
        }
        if(c.tangential<0.0080 || c.tangentRatio<0.30){
            return {ok:false,reason:"insufficient-ccw-momentum",contact:c};
        }
        if(c.approachRatio>0.82){
            return {ok:false,reason:"too-direct",contact:c};
        }
        if(c.tilt>0.30){
            return {ok:false,reason:"tilt-too-high",contact:c};
        }

        return {
            ok:true,contact:c,
            grip:clamp(0.70+(1-c.tilt)*0.16+c.tangentRatio*0.10,0.70,0.96)
        };
    }

    function engage(s,previousDistance){
        if(!s||s.railEngaged) return false;
        if((s.railExitRefractory||0)>0 || (s.railCaptureCooldown||0)>0) return false;

        const p=nearest(s.x,s.y);
        if(!p) return false;
        const radius=Number(s.radius)||0.124;
        const contactRadius=radius+0.010; // rail centerline + thin physical rail
        if(Math.sqrt(p.dist2)>contactRadius) return false;

        const decision=captureDecision(s,p,previousDistance);
        s.lastXRailResult=decision.reason;
        if(!decision.ok) return false;

        /* Remove only inward normal velocity. Never manufacture a path velocity. */
        const c=decision.contact;
        if(c.normal<0){
            s.vx-=c.nx*c.normal;
            s.vy-=c.ny*c.normal;
        }
        const tangential=s.vx*p.tx+s.vy*p.ty;
        if(!Number.isFinite(tangential)||tangential<=0.004){
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
        s.railUses=(s.railUses||0)+1;
        s.lastXRailResult="capture";
        return true;
    }

    function bounce(s,p){
        if(!s||!p) return false;
        let nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
        if(len<1e-9){nx=-p.ty;ny=p.tx;len=1;}
        nx/=len;ny/=len;
        const normal=s.vx*nx+s.vy*ny;
        if(normal<0){
            const restitution=0.46;
            const reflected=-normal*restitution;
            s.vx-=nx*normal; s.vy-=ny*normal;
            s.vx+=nx*reflected; s.vy+=ny*reflected;
        }
        const d=Math.sqrt(p.dist2);
        const gap=(Number(s.radius)||0.124)+0.006;
        if(d<gap){const push=gap-d;s.x+=nx*push;s.y+=ny*push;}
        s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);
        s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
        s.railCaptureCooldown=0.10;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.lastXRailResult="bounce";
        return true;
    }

    function contactSafety(s,p){return bounce(s,p);}

    function riderStep(s,dt){
        const g=buildGeometry();
        const p=nearest(s.x,s.y);
        if(!p){release(s,"no-geometry");return false;}

        const radius=Number(s.radius)||0.124;
        const distance=Math.sqrt(p.dist2);
        const contactLimit=radius+0.028;
        if(distance>contactLimit){release(s,"lost-contact");return false;}

        const lastDistance=s._xrailLastDistance;
        if(Number.isFinite(lastDistance) && p.distance<lastDistance-0.030){
            release(s,"lost-forward-progress");
            return false;
        }

        /*
         * X-EXIT: the final rail point is the mouth. There is no canned exit
         * position or exit trajectory. If the Bey reaches the final throat
         * while moving in the authored CCW direction, rail authority ends.
         * Its current x/y/vx/vy are preserved exactly.
         */
        const exitDistance=0.20;
        const exitPoint=g.rightExit;
        const endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
        const exitForward=s.vx*exitPoint.tx+s.vy*exitPoint.ty;
        const nearExit=p.distance>=g.total-exitDistance;
        const centerX=-exitPoint.x;
        const centerY=-exitPoint.y;
        const centerLen=Math.hypot(centerX,centerY)||1;
        const centerDot=(s.vx*(centerX/centerLen)+s.vy*(centerY/centerLen)) /
            Math.max(Math.hypot(s.vx,s.vy),0.0001);

        if(nearExit && endpointDistance<=0.24 && exitForward>0.006 && centerDot>0.45){
            /*
             * The rider is already moving through the real opening. Release
             * exactly where it is and preserve its current velocity. The
             * following normal-movement step carries it into the stadium.
             */
            release(s,"x-exit");
            s.lastXRailResult="x-exit";
            return false;
        }

        const tx=p.tx,ty=p.ty;
        let nx=s.x-p.x,ny=s.y-p.y,nlen=Math.hypot(nx,ny);
        if(nlen<1e-9){nx=-ty;ny=tx;nlen=1;} else {nx/=nlen;ny/=nlen;}

        const tangentSpeed=s.vx*tx+s.vy*ty;
        if(!Number.isFinite(tangentSpeed)||tangentSpeed<=0.0025){
            release(s,"lost-tangent");return false;
        }

        /*
         * A rail rider can only travel in the authored CCW tangent direction.
         * The rail removes the normal component of velocity; it does not
         * invent a new speed or steer the Bey toward a canned path.
         */
        const rpm=clamp(Number(s.rpm)||0,0,1);
        const grip=clamp(Number(s.railGrip)||0.72,0.65,0.96);
        const friction=(0.000035+(1-rpm)*0.000055)*dt*60;
        const railAssist=(0.00002+0.00008*rpm*grip)*dt*60;
        const railSpeed=Math.max(0.0025,tangentSpeed-friction+railAssist);

        s.vx=tx*railSpeed;
        s.vy=ty*railSpeed;

        /* Rail riders are integrated here because app.js skips free movement for them. */
        s.x+=s.vx*dt*60;
        s.y+=s.vy*dt*60;

        /* Tiny normal correction keeps contact with the physical rail surface. */
        const after=nearest(s.x,s.y);
        if(after){
            const ax=s.x-after.x,ay=s.y-after.y,alen=Math.hypot(ax,ay);
            const targetGap=radius+0.006;
            if(alen>1e-9){
                const correction=clamp(targetGap-alen,-0.010,0.010);
                s.x+=(ax/alen)*correction;
                s.y+=(ay/alen)*correction;
            }
            s.railDistance=after.distance;
            s.railContactPoint={x:after.x,y:after.y};
            s._xrailLastDistance=after.distance;
        }

        s.railSpeed=Math.hypot(s.vx,s.vy);
        s.railRideTime=(s.railRideTime||0)+dt;
        s.railTravelDistance=(s.railTravelDistance||0)+s.railSpeed*dt;
        s.lastXRailResult="riding";
        return true;
    }

    function step(s,dt){
        if(!s) return {active:false,state:"none"};
        if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||!Number.isFinite(s.vx)||!Number.isFinite(s.vy)){
            throw new Error("X-Rail received non-finite Bey state.");
        }

        if(s.railEngaged){
            return {active:riderStep(s,dt),state:s.railEngaged?"riding":"release"};
        }

        if((s.railExitRefractory||0)>0) s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
        if((s.railCaptureCooldown||0)>0) s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);

        const p=nearest(s.x,s.y);
        if(!p){s._xrailLastDistance=null;return {active:false,state:"none"};}
        const distance=Math.sqrt(p.dist2);
        const radius=Number(s.radius)||0.124;
        const contactRadius=radius+0.010;

        if(!Number.isFinite(s._xrailLastDistance)) s._xrailLastDistance=distance;
        const previousDistance=s._xrailLastDistance;
        s._xrailLastDistance=distance;

        if(distance>contactRadius) return {active:false,state:"none"};

        if(s.railExited||s.railExitRefractory>0||s.railCaptureCooldown>0){
            bounce(s,p);
            return {active:false,state:"bounce"};
        }

        if(engage(s,previousDistance)) return {active:false,state:"capture"};
        bounce(s,p);
        return {active:false,state:"bounce"};
    }

    function inspect(s){
        if(!s) return null;
        const p=nearest(s.x,s.y); if(!p) return null;
        const c=getContact(s,p);
        return c?{
            distance:c.distance,speed:c.speed,normal:c.normal,inward:c.inward,
            tangential:c.tangential,approachRatio:c.approachRatio,
            tangentRatio:c.tangentRatio,tilt:c.tilt,
            previousDistance:s._xrailLastDistance??null,
            progress:p.distance,total:buildGeometry().total,
            engaged:!!s.railEngaged,result:s.lastXRailResult||null
        }:null;
    }

    global.SpinWarsXRailEngine={
        version:"4.0-impact-capture-physical-exit",
        geometry:buildGeometry,
        nearest,
        release,
        engage,
        contactSafety,
        step,
        inspect
    };
})(window);
