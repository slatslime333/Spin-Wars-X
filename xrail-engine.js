/*
 * SPIN WARS X — X-RAIL ENGINE
 * Version 3.0 — single physical rail model
 *
 * This file is the ONLY owner of X-Rail physics.
 *
 * The rail is a finite physical surface. A Bey can:
 *   1. miss it;
 *   2. touch it and bounce;
 *   3. touch it with the right momentum/orientation and capture;
 *   4. ride it counter-clockwise;
 *   5. leave through the X-Exit.
 *
 * Free-space movement remains owned by movement-engine.js/app.js.
 */
(function(global){
    "use strict";

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    /* Exact centerline used by renderNewBattle(). */
    const SVG_SEGMENTS=[
        [[44.8,10.3],[41.6,8.2],[37.2,7.2],[32.8,9.3]],
        [[32.8,9.3],[20.8,15.1],[14.0,29.0],[14.7,45.5]],
        [[14.7,45.5],[15.6,63.0],[29.6,76.8],[50.0,77.7]],
        [[50.0,77.7],[70.4,76.8],[84.4,63.0],[85.3,45.5]],
        [[85.3,45.5],[86.0,29.0],[79.2,15.1],[67.2,9.3]],
        [[67.2,9.3],[62.8,7.2],[58.4,8.2],[55.2,10.3]]
    ];

    function toGame(p){
        return {x:(p[0]-50)/39,y:(p[1]-46)/39};
    }

    function bezier(p0,p1,p2,p3,t){
        const u=1-t;
        const uu=u*u;
        const tt=t*t;
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
        const samplesPerCurve=48;

        for(const raw of SVG_SEGMENTS){
            const [a,b,c,d]=raw.map(toGame);

            for(let i=0;i<samplesPerCurve;i++){
                const t=i/samplesPerCurve;
                const p=bezier(a,b,c,d,t);
                const q=derivative(a,b,c,d,t);
                const len=Math.hypot(q.x,q.y);
                if(len<1e-9) continue;

                samples.push({
                    x:p.x,
                    y:p.y,
                    tx:q.x/len,
                    ty:q.y/len
                });
            }
        }

        const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame);
        const lp=last[3];
        const ld=derivative(...last,1);
        const llen=Math.hypot(ld.x,ld.y)||1;

        samples.push({
            x:lp.x,
            y:lp.y,
            tx:ld.x/llen,
            ty:ld.y/llen
        });

        const segments=[];
        let total=0;

        for(let i=0;i<samples.length-1;i++){
            const a=samples[i];
            const b=samples[i+1];
            const length=Math.hypot(b.x-a.x,b.y-a.y);
            if(length<1e-9) continue;

            segments.push({
                a,b,length,start:total
            });
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

        for(const segment of g.segments){
            const abx=segment.b.x-segment.a.x;
            const aby=segment.b.y-segment.a.y;
            const ab2=abx*abx+aby*aby;
            if(ab2<1e-12) continue;

            const t=clamp(
                ((x-segment.a.x)*abx+(y-segment.a.y)*aby)/ab2,
                0,1
            );

            const px=segment.a.x+abx*t;
            const py=segment.a.y+aby*t;
            const dx=x-px;
            const dy=y-py;
            const dist2=dx*dx+dy*dy;

            if(best && dist2>=best.dist2) continue;

            let tx=segment.a.tx+(segment.b.tx-segment.a.tx)*t;
            let ty=segment.a.ty+(segment.b.ty-segment.a.ty)*t;
            const tangentLength=Math.hypot(tx,ty);
            if(tangentLength<1e-9) continue;

            best={
                x:px,
                y:py,
                dist2,
                distance:segment.start+segment.length*t,
                tx:tx/tangentLength,
                ty:ty/tangentLength
            };
        }

        return best;
    }

    function clearRide(s){
        s.railEngaged=false;
        s.railGrip=0;
        s.railDirection=0;
        s.railSpeed=0;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s.railContactPoint=null;
    }

    function release(s,reason){
        if(!s) return false;

        const point=nearest(s.x,s.y);
        const speed=Math.hypot(s.vx,s.vy);

        clearRide(s);

        s.railExited=reason==="x-exit";
        s.railExitForce=reason==="x-exit" ? speed : 0;
        s.railExitRefractory=reason==="x-exit" ? 0.24 : 0.10;
        s.railCaptureCooldown=reason==="x-exit" ? 0.22 : 0.08;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.railExitRefractoryPoint={x:s.x,y:s.y};
        s.lastXRailExitReason=reason||"release";

        if(point) s.railDistance=point.distance;
        return true;
    }

    /*
     * Capture is deliberately simple.
     *
     * A good rail contact needs:
     *   - right spin (the authored rail only rides CCW);
     *   - actual inward momentum;
     *   - meaningful CCW tangential momentum;
     *   - a non-square impact;
     *   - a usable tilt.
     *
     * There is no random roll and no Bit/RPM meta formula here. Those can
     * influence the Bey's actual velocity/tilt before contact, which is the
     * physically cleaner place for them to matter.
     */
    function captureDecision(s,p){
        const speed=Math.hypot(s.vx,s.vy);
        if(!Number.isFinite(speed)||speed<0.006){
            return {ok:false,reason:"low-speed"};
        }

        if(s.spinDirection!==1){
            return {ok:false,reason:"wrong-spin"};
        }

        const distance=Math.sqrt(p.dist2);
        if(distance<1e-9){
            return {ok:false,reason:"invalid-contact"};
        }

        /* n points from the rail toward the Bey. */
        const nx=(s.x-p.x)/distance;
        const ny=(s.y-p.y)/distance;
        const normal=s.vx*nx+s.vy*ny;
        const inward=-normal;

        const tangent={x:p.tx,y:p.ty};
        const tangential=s.vx*tangent.x+s.vy*tangent.y;

        const approachRatio=inward/speed;
        const tangentRatio=tangential/speed;
        const tilt=Math.abs(Number(s.tiltLevel)||0);

        if(inward<=0.0010){
            return {ok:false,reason:"not-entering-rail"};
        }

        if(tangential<=0.0035||tangentRatio<0.18){
            return {ok:false,reason:"insufficient-ccw-momentum"};
        }

        /* A nearly square hit should rebound instead of locking on. */
        if(approachRatio>0.86){
            return {ok:false,reason:"too-direct"};
        }

        /*
         * Flat/low tilt is the natural capture region. A heavy lean makes
         * the Bey strike the rail rather than settle onto it.
         */
        if(tilt>0.40){
            return {ok:false,reason:"tilt-too-high"};
        }

        return {
            ok:true,
            nx,ny,
            tangent,
            inward,
            tangential,
            approachRatio,
            tangentRatio,
            grip:clamp(
                0.68+
                (1-clamp(tilt/0.40,0,1))*0.18+
                clamp(tangentRatio,0,1)*0.10,
                0.68,0.96
            )
        };
    }

    function engage(s){
        if(!s||s.railEngaged) return false;

        if((s.railExitRefractory||0)>0 ||
           (s.railCaptureCooldown||0)>0){
            return false;
        }

        const point=nearest(s.x,s.y);
        if(!point) return false;

        const radius=Number(s.radius)||0.124;
        const contactRadius=0.055+radius;
        if(Math.sqrt(point.dist2)>contactRadius){
            return false;
        }

        const decision=captureDecision(s,point);
        s.lastXRailResult=decision.reason;

        if(!decision.ok){
            return false;
        }

        /* Remove only the velocity directed into the rail. */
        const normal=s.vx*decision.nx+s.vy*decision.ny;
        if(normal<0){
            s.vx-=decision.nx*normal;
            s.vy-=decision.ny*normal;
        }

        const tangential=
            s.vx*decision.tangent.x+
            s.vy*decision.tangent.y;

        if(!Number.isFinite(tangential)||tangential<=0.002){
            s.lastXRailResult="lost-tangent-on-capture";
            return false;
        }

        s.railEngaged=true;
        s.railExited=false;
        s.railDirection=1;
        s.railGrip=decision.grip;
        s.railContactPoint={x:point.x,y:point.y};
        s.railDistance=point.distance;
        s.railSpeed=tangential;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s.railUses=(s.railUses||0)+1;
        s.lastXRailResult="capture";

        return true;
    }

    function bounce(s,point){
        if(!s||!point) return false;

        let nx=s.x-point.x;
        let ny=s.y-point.y;
        let length=Math.hypot(nx,ny);

        if(length<1e-9){
            nx=-point.ty;
            ny=point.tx;
            length=1;
        }

        nx/=length;
        ny/=length;

        const normal=s.vx*nx+s.vy*ny;

        if(normal<0){
            const restitution=0.42;
            const reflected=-normal*restitution;
            s.vx-=nx*normal;
            s.vy-=ny*normal;
            s.vx+=nx*reflected;
            s.vy+=ny*reflected;
        }else{
            const separation=0.0015;
            s.vx+=nx*separation;
            s.vy+=ny*separation;
        }

        const distance=Math.sqrt(point.dist2);
        const gap=Math.max(0.012,(Number(s.radius)||0.124)*0.90);
        if(distance<gap){
            const push=gap-distance;
            s.x+=nx*push;
            s.y+=ny*push;
        }

        s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);
        s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
        s.railCaptureCooldown=0.08;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.lastXRailResult="bounce";
        return true;
    }

    function contactSafety(s,point){
        return bounce(s,point);
    }

    function constraint(s,dt){
        if(!s?.railEngaged) return false;

        const g=buildGeometry();
        const point=nearest(s.x,s.y);
        if(!point){
            release(s,"no-geometry");
            return false;
        }

        const radius=Number(s.radius)||0.124;
        const contactLimit=0.055+radius+0.025;
        const distance=Math.sqrt(point.dist2);

        if(distance>contactLimit){
            release(s,"lost-contact");
            return false;
        }

        const tangent={x:point.tx,y:point.ty};
        let nx=s.x-point.x;
        let ny=s.y-point.y;
        let normalLength=Math.hypot(nx,ny);

        if(normalLength<1e-9){
            nx=-tangent.y;
            ny=tangent.x;
            normalLength=1;
        }else{
            nx/=normalLength;
            ny/=normalLength;
        }

        const tangential=s.vx*tangent.x+s.vy*tangent.y;
        if(!Number.isFinite(tangential)||tangential<=0.002){
            release(s,"lost-tangent");
            return false;
        }

        /*
         * Riding is a surface constraint. Remove normal velocity; preserve
         * the Bey's actual tangential momentum and apply only small surface
         * friction/acceleration.
         */
        const normal=s.vx*nx+s.vy*ny;
        if(normal!==0){
            s.vx-=nx*normal;
            s.vy-=ny*normal;
        }

        let railSpeed=tangential;
        const rpm=clamp(Number(s.rpm)||0,0,1);
        const grip=clamp(Number(s.railGrip)||0.70,0.55,0.96);
        const acceleration=(0.00014+0.00018*rpm+0.00010*grip)*dt*60;
        const friction=(0.00004+(1-rpm)*0.00005)*dt*60;

        railSpeed=Math.max(0.0025,railSpeed+acceleration-friction);

        /* Do not manufacture a second rail-speed target. */
        s.vx=tangent.x*railSpeed;
        s.vy=tangent.y*railSpeed;

        /* app.js returns early for riders, so integrate this constrained frame. */
        s.x+=s.vx*dt*60;
        s.y+=s.vy*dt*60;

        /* Keep the Bey at the physical contact shell without snapping it to path. */
        const after=nearest(s.x,s.y);
        if(after){
            const ax=s.x-after.x;
            const ay=s.y-after.y;
            const alen=Math.hypot(ax,ay);
            const targetGap=radius+0.012;

            if(alen>1e-9){
                const gapError=targetGap-alen;
                if(Math.abs(gapError)>0.0005){
                    const correction=clamp(gapError,-0.018,0.018);
                    s.x+=(ax/alen)*correction;
                    s.y+=(ay/alen)*correction;
                }
            }
        }

        s.railSpeed=railSpeed;
        s.railRideTime=(s.railRideTime||0)+dt;
        s.railTravelDistance=(s.railTravelDistance||0)+railSpeed*dt;
        s.railDistance=point.distance;
        s.railContactPoint={x:point.x,y:point.y};

        const endpoint=g.rightExit;
        const exitDistance=Math.hypot(
            s.x-endpoint.x,
            s.y-endpoint.y
        );

        if(
            exitDistance<=0.11+radius*0.5 ||
            point.distance>=g.total-0.035
        ){
            const inwardX=-endpoint.x;
            const inwardY=-endpoint.y;
            const inwardLength=Math.hypot(inwardX,inwardY)||1;
            const ix=inwardX/inwardLength;
            const iy=inwardY/inwardLength;
            const speed=Math.max(0.012,Math.hypot(s.vx,s.vy));

            /* Preserve most of the rider's momentum and angle it through exit. */
            const blend=0.28;
            let vx=(s.vx/speed)*(1-blend)+ix*blend;
            let vy=(s.vy/speed)*(1-blend)+iy*blend;
            const len=Math.hypot(vx,vy)||1;
            vx/=len;
            vy/=len;

            s.vx=vx*speed;
            s.vy=vy*speed;
            s.x=endpoint.x+ix*(radius+0.018);
            s.y=endpoint.y+iy*(radius+0.018);

            release(s,"x-exit");
            return false;
        }

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
            const active=constraint(s,dt);
            return {
                active,
                state:active?"riding":"release"
            };
        }

        if((s.railExitRefractory||0)>0){
            s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
        }
        if((s.railCaptureCooldown||0)>0){
            s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
        }

        const point=nearest(s.x,s.y);
        if(!point) return {active:false,state:"none"};

        const radius=Number(s.radius)||0.124;
        const contactRadius=0.055+radius;
        if(Math.sqrt(point.dist2)>contactRadius){
            return {active:false,state:"none"};
        }

        if(s.railExited||s.railExitRefractory>0||s.railCaptureCooldown>0){
            bounce(s,point);
            return {active:false,state:"bounce"};
        }

        if(engage(s)){
            return {active:true,state:"capture"};
        }

        bounce(s,point);
        return {active:false,state:"bounce"};
    }

    function inspect(s){
        if(!s) return null;
        const point=nearest(s.x,s.y);
        if(!point) return null;

        const distance=Math.sqrt(point.dist2)||1e-9;
        const nx=(s.x-point.x)/distance;
        const ny=(s.y-point.y)/distance;
        const speed=Math.hypot(s.vx,s.vy);
        const normal=s.vx*nx+s.vy*ny;
        const tangent=s.vx*point.tx+s.vy*point.ty;

        return {
            distance,
            speed,
            normal,
            tangent,
            approachRatio:-normal/Math.max(speed,0.0001),
            tangentRatio:tangent/Math.max(speed,0.0001),
            tilt:Number(s.tiltLevel)||0,
            spinDirection:s.spinDirection,
            engaged:!!s.railEngaged,
            result:s.lastXRailResult||null
        };
    }

    global.SpinWarsXRailEngine={
        version:"3.0-single-physical-model",
        geometry:buildGeometry,
        nearest,
        release,
        engage,
        contactSafety,
        constraint,
        step,
        inspect
    };

})(window);
