/*
 * SPIN WARS X — X-RAIL ENGINE
 * Version: 2.0 physical foundation
 *
 * Ownership:
 *   - X-Rail geometry
 *   - rail contact
 *   - capture decision
 *   - rail riding constraint
 *   - rail release / X-Exit
 *
 * NOT owned here:
 *   - free-space movement
 *   - Bey-vs-Bey collision resolution
 *   - damage / finishes
 *   - UI / commentary
 *
 * The rail is a physical surface, not a second movement engine.
 * Position and velocity remain authoritative.
 */
(function(global){

    "use strict";

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    const GEOMETRY={
        controls:[
            {x:-0.133,y:-0.790},
            {x:-0.480,y:-0.660},
            {x:-0.760,y:-0.455},
            {x:-0.905,y:0.010},
            {x:-0.820,y:0.480},
            {x:-0.500,y:0.735},
            {x:0.000,y:0.805},
            {x:0.500,y:0.735},
            {x:0.820,y:0.480},
            {x:0.905,y:0.010},
            {x:0.760,y:-0.455},
            {x:0.480,y:-0.660},
            {x:0.133,y:-0.790}
        ],
        samples:[],
        segments:[],
        total:0
    };

    function catmull(p0,p1,p2,p3,t){
        const t2=t*t,t3=t2*t;
        return {
            x:0.5*((2*p1.x)+(-p0.x+p2.x)*t+
                (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+
                (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
            y:0.5*((2*p1.y)+(-p0.y+p2.y)*t+
                (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+
                (-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
        };
    }

    function derivative(p0,p1,p2,p3,t){
        const t2=t*t;
        return {
            x:0.5*((-p0.x+p2.x)+
                2*(2*p0.x-5*p1.x+4*p2.x-p3.x)*t+
                3*(-p0.x+3*p1.x-3*p2.x+p3.x)*t2),
            y:0.5*((-p0.y+p2.y)+
                2*(2*p0.y-5*p1.y+4*p2.y-p3.y)*t+
                3*(-p0.y+3*p1.y-3*p2.y+p3.y)*t2)
        };
    }

    function buildGeometry(){
        if(GEOMETRY.samples.length) return GEOMETRY;

        const controls=GEOMETRY.controls;
        const perSpan=28;

        for(let i=0;i<controls.length-1;i++){
            const p0=controls[Math.max(0,i-1)];
            const p1=controls[i];
            const p2=controls[i+1];
            const p3=controls[Math.min(controls.length-1,i+2)];

            for(let j=0;j<perSpan;j++){
                const t=j/perSpan;
                const p=catmull(p0,p1,p2,p3,t);
                const d=derivative(p0,p1,p2,p3,t);
                const dl=Math.hypot(d.x,d.y);

                if(!Number.isFinite(dl)||dl<1e-8) continue;

                GEOMETRY.samples.push({
                    x:p.x,y:p.y,
                    tx:d.x/dl,ty:d.y/dl
                });
            }
        }

        const last=controls[controls.length-1];
        const prev=controls[controls.length-2];
        const dl=Math.hypot(last.x-prev.x,last.y-prev.y)||1;

        GEOMETRY.samples.push({
            x:last.x,y:last.y,
            tx:(last.x-prev.x)/dl,
            ty:(last.y-prev.y)/dl
        });

        let total=0;

        for(let i=0;i<GEOMETRY.samples.length-1;i++){
            const a=GEOMETRY.samples[i];
            const b=GEOMETRY.samples[i+1];
            const length=Math.hypot(b.x-a.x,b.y-a.y);
            if(!Number.isFinite(length)||length<1e-8) continue;

            GEOMETRY.segments.push({
                a,b,length,start:total
            });
            total+=length;
        }

        GEOMETRY.total=total;
        return GEOMETRY;
    }

    function nearest(x,y){
        const g=buildGeometry();
        if(!Number.isFinite(x)||!Number.isFinite(y)) return null;

        let best=null;

        for(const seg of g.segments){
            const abx=seg.b.x-seg.a.x;
            const aby=seg.b.y-seg.a.y;
            const ab2=abx*abx+aby*aby;

            if(!Number.isFinite(ab2)||ab2<1e-10) continue;

            const t=clamp(
                ((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,
                0,1
            );

            const px=seg.a.x+abx*t;
            const py=seg.a.y+aby*t;
            const dx=x-px;
            const dy=y-py;
            const dist2=dx*dx+dy*dy;

            if(!best||dist2<best.dist2){
                let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t;
                let ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t;
                const tl=Math.hypot(tx,ty);

                if(!Number.isFinite(tl)||tl<1e-8) continue;

                best={
                    x:px,y:py,dist2,
                    distance:seg.start+seg.length*t,
                    tx:tx/tl,ty:ty/tl,
                    segment:seg,t
                };
            }
        }

        return best;
    }

    /*
     * The X-Rail is CCW-only.
     *
     * In this stadium coordinate system the authored left-top -> right-top
     * path is the CCW rail path. Spin direction is therefore NOT inverted
     * into a reverse rail. A left-spin Bey can strike the rail, but cannot
     * lock onto it.
     */
    function tangentAt(point){
        if(!point) return null;

        const tx=Number(point.tx);
        const ty=Number(point.ty);
        const len=Math.hypot(tx,ty);

        if(!Number.isFinite(len)||len<1e-8) return null;

        return {x:tx/len,y:ty/len};
    }

    function resetRideState(s){
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

        resetRideState(s);

        s.railExited=reason==="x-exit";
        s.railExitRefractory=reason==="x-exit"?0.30:0.16;
        s.railCaptureCooldown=reason==="x-exit"?0.38:0.20;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.railExitRefractoryPoint={x:s.x,y:s.y};
        s.lastXRailExitReason=reason||"release";

        if(point){
            s.railContactPoint={x:point.x,y:point.y};
            s.railDistance=point.distance;
        }

        return true;
    }

    function tiltCaptureFactor(tilt){
        /*
         * Flat/low tilt is the favorable rail-catching region.
         * As lean increases, capture rapidly becomes less plausible.
         * This is deliberately a simple physical gate, not a giant formula.
         */
        if(tilt>=0.38) return 0;
        if(tilt<=0.08) return 1;

        const t=(tilt-0.08)/(0.38-0.08);
        return 1-t*t*(3-2*t);
    }

    function evaluateCapture(s,point){
        if(!s||!point) return {capture:false,reason:"no-contact"};

        const speed=Math.hypot(s.vx,s.vy);
        const rpm=clamp(Number(s.rpm)||0,0,1);
        const stability=clamp(Number(s.stability)||0,0,1);
        const tilt=clamp(Math.abs(Number(s.tiltLevel)||0),0,1);

        if(!Number.isFinite(speed)||speed<0.006){
            return {capture:false,reason:"insufficient-speed"};
        }

        /* CCW only. */
        if(s.spinDirection!==1){
            return {capture:false,reason:"wrong-spin-direction"};
        }

        const dx=s.x-point.x;
        const dy=s.y-point.y;
        const distance=Math.hypot(dx,dy);

        if(!Number.isFinite(distance)||distance<1e-8){
            return {capture:false,reason:"invalid-contact-normal"};
        }

        const nx=dx/distance;
        const ny=dy/distance;
        const tangent=tangentAt(point);

        if(!tangent) return {capture:false,reason:"invalid-tangent"};

        const normal=s.vx*nx+s.vy*ny;
        const tangential=s.vx*tangent.x+s.vy*tangent.y;

        /*
         * Contact must have actual inward momentum and useful CCW tangent
         * momentum. Merely orbiting beside the rail is not capture.
         */
        const inward=-normal;
        const inwardRatio=inward/Math.max(speed,1e-6);
        const tangentRatio=tangential/Math.max(speed,1e-6);

        if(inward<=0.0012){
            return {capture:false,reason:"no-inward-contact"};
        }

        if(tangential<=0.0045||tangentRatio<0.18){
            return {capture:false,reason:"wrong-tangential-contact"};
        }

        /* Too-square / too-hard a hit should rebound rather than lock. */
        if(inwardRatio>0.82){
            return {capture:false,reason:"too-direct"};
        }

        const tiltFactor=tiltCaptureFactor(tilt);
        if(tiltFactor<=0){
            return {capture:false,reason:"tilt-too-high"};
        }

        /*
         * A moderate normal component is useful. Extremely weak contact is
         * a skim; extremely strong contact is a bounce.
         */
        const contactQuality=clamp(
            1-Math.abs(inwardRatio-0.42)/0.42,
            0,1
        );

        const rpmFactor=0.72+0.28*rpm;
        const stabilityFactor=0.72+0.28*stability;
        const deliberateFactor=
            s.launchPlan?.technique==="X-Rail" ? 1.08 : 1;

        const affinity=clamp(
            Number(
                s.bit?.xRailAffinity ??
                s.bit?.physics?.xRailAffinity ??
                s.xRailAffinity ??
                0.60
            ),
            0.35,1
        );

        const physicalScore=
            0.52*tiltFactor+
            0.20*clamp(tangentRatio,0,1)+
            0.14*contactQuality+
            0.08*rpmFactor+
            0.06*stabilityFactor;

        const chance=clamp(
            physicalScore*
            (0.82+0.18*affinity)*
            deliberateFactor,
            0,0.98
        );

        return {
            capture:Math.random()<chance,
            reason:"capture-roll",
            chance,
            grip:clamp(
                0.55+
                0.25*tiltFactor+
                0.12*contactQuality+
                0.08*affinity,
                0.55,0.98
            ),
            nx,ny,tangent,
            inward,tangential,
            tiltFactor
        };
    }

    function capture(s,point,decision){
        if(!decision?.capture) return false;

        const nx=decision.nx;
        const ny=decision.ny;

        /*
         * Remove only the velocity INTO the rail. Do not manufacture a
         * rail speed and do not move the Bey onto a spline point.
         */
        const normal=s.vx*nx+s.vy*ny;
        if(normal<0){
            s.vx-=nx*normal;
            s.vy-=ny*normal;
        }

        const tangentSpeed=
            s.vx*decision.tangent.x+
            s.vy*decision.tangent.y;

        if(!Number.isFinite(tangentSpeed)||tangentSpeed<=0.003){
            return false;
        }

        s.railEngaged=true;
        s.railExited=false;
        s.railDirection=1;
        s.railGrip=decision.grip;
        s.railContactPoint={x:point.x,y:point.y};
        s.railDistance=point.distance;
        s.railSpeed=tangentSpeed;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s.railUses=(s.railUses||0)+1;

        /* Resolve only true penetration. */
        const minimumGap=Math.max(0.014,(Number(s.radius)||0.020)*0.38);
        const distance=Math.hypot(s.x-point.x,s.y-point.y);

        if(distance<minimumGap){
            const push=minimumGap-distance;
            s.x+=nx*push;
            s.y+=ny*push;
        }

        return true;
    }

    function bounce(s,point){
        if(!s||!point) return false;

        const dx=s.x-point.x;
        const dy=s.y-point.y;
        const distance=Math.hypot(dx,dy);

        let nx,ny;
        if(distance<1e-8){
            const t=tangentAt(point)||{x:1,y:0};
            nx=-t.y;
            ny=t.x;
        }else{
            nx=dx/distance;
            ny=dy/distance;
        }

        const speed=Math.hypot(s.vx,s.vy);
        const normal=s.vx*nx+s.vy*ny;

        /*
         * If moving into the rail, reflect that component. If it is a graze,
         * add a small separation impulse so free-space movement doesn't
         * visually orbit on the rail without actually riding it.
         */
        if(normal<0){
            const restitution=clamp(
                0.35+Math.min(0.35,(-normal)/0.05),
                0.35,0.70
            );
            const reflected=-normal*restitution;
            s.vx-=nx*normal;
            s.vy-=ny*normal;
            s.vx+=nx*reflected;
            s.vy+=ny*reflected;
        }else{
            const separation=clamp(
                0.0015+speed*0.025,
                0.0015,0.005
            );
            s.vx+=nx*separation;
            s.vy+=ny*separation;
        }

        const radius=Number(s.radius)||0.020;
        const contactRadius=0.070+radius*0.48;
        const penetration=contactRadius-distance;

        if(penetration>0){
            const push=Math.min(0.018,penetration);
            s.x+=nx*push;
            s.y+=ny*push;
        }

        s.surfaceBounce=Math.max(s.surfaceBounce||0,0.20);
        s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.12);

        s.railCaptureCooldown=0.08;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};

        resetRideState(s);
        s.railExited=false;
        s.lastXRailContactResult="bounce";

        return true;
    }

    function checkExit(s,point){
        const g=buildGeometry();
        const radius=Number(s.radius)||0.020;

        /*
         * Physical opening is between the two top endpoints. A rider exits
         * when it reaches the final CCW endpoint and its actual position is
         * inside the opening lane.
         */
        const endpoint=g.samples[g.samples.length-1];
        const dx=s.x-endpoint.x;
        const dy=s.y-endpoint.y;
        const endpointDistance=Math.hypot(dx,dy);

        const inMouth=
            s.x>=-0.133-radius*0.7 &&
            s.x<= 0.133+radius*0.7 &&
            s.y<=-0.603+radius*0.8;

        return endpointDistance<=0.105+radius*0.9 || inMouth;
    }

    function step(s,dt,phase){
        if(!s) return {active:false,state:"none"};

        if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||
           !Number.isFinite(s.vx)||!Number.isFinite(s.vy)){
            throw new Error("X-Rail received non-finite Bey state.");
        }

        if(s.railEngaged){
            const point=nearest(s.x,s.y);

            if(!point){
                release(s,"invalid-geometry");
                return {active:false,state:"release"};
            }

            if(checkExit(s,point)){
                release(s,"x-exit");
                return {active:false,state:"exit"};
            }

            const radius=Number(s.radius)||0.020;
            const contactLimit=0.070+radius*0.60;
            const distance=Math.sqrt(Math.max(0,point.dist2));

            if(distance>contactLimit){
                release(s,"lost-contact");
                return {active:false,state:"release"};
            }

            const tangent=tangentAt(point);
            if(!tangent){
                release(s,"invalid-tangent");
                return {active:false,state:"release"};
            }

            let nx=s.x-point.x;
            let ny=s.y-point.y;
            let nl=Math.hypot(nx,ny);

            if(nl<1e-8){
                nx=-tangent.y;
                ny=tangent.x;
                nl=1;
            }else{
                nx/=nl;
                ny/=nl;
            }

            let vx=s.vx,vy=s.vy;
            const tangential=vx*tangent.x+vy*tangent.y;
            const normal=vx*nx+vy*ny;
            const speed=Math.hypot(vx,vy);

            if(!Number.isFinite(tangential)||!Number.isFinite(normal)){
                release(s,"invalid-velocity");
                return {active:false,state:"release"};
            }

            /*
             * If the rider has clearly developed outward velocity, it has
             * physically left the rail. Do not keep it attached.
             */
            if(normal>0.012 && normal/Math.max(speed,1e-6)>0.24){
                release(s,"outward-release");
                return {active:false,state:"release"};
            }

            let railSpeed=Math.max(0,tangential);

            /*
             * Surface constraint: remove only inward normal velocity.
             */
            if(normal<0){
                vx-=nx*normal;
                vy-=ny*normal;
            }

            const rpm=clamp(Number(s.rpm)||0,0,1);
            const tiltFactor=tiltCaptureFactor(
                clamp(Math.abs(Number(s.tiltLevel)||0),0,1)
            );

            /*
             * Small, gradual energy transfer from the rail. This is deliberately
             * simple: faster RPM and better grip accelerate more; acceleration
             * fades as speed rises.
             */
            const ceiling=
                0.078+
                0.042*rpm+
                0.018*(Number(s.railGrip)||0.60);

            const acceleration=
                0.028*
                (0.55+0.45*rpm)*
                (0.60+0.40*(Number(s.railGrip)||0.60))*
                Math.max(0,1-railSpeed/Math.max(ceiling,0.001))*
                (0.82+0.18*tiltFactor);

            railSpeed+=acceleration*dt*60;

            const friction=
                0.012+
                (1-rpm)*0.010;

            railSpeed=Math.max(
                0.003,
                railSpeed*(1-friction*dt*60)
            );

            if(railSpeed>ceiling) railSpeed=ceiling;

            vx=tangent.x*railSpeed;
            vy=tangent.y*railSpeed;

            s.vx=vx;
            s.vy=vy;
            s.railSpeed=railSpeed;
            s.railRideTime=(s.railRideTime||0)+dt;
            s.railTravelDistance=(s.railTravelDistance||0)+railSpeed*dt;
            s.railDistance=point.distance;
            s.railContactPoint={x:point.x,y:point.y};

            /* Never wrap. The geometry ends at the X-Exit. */
            if(s.railDistance>=g.total-0.025){
                release(s,"x-exit");
                return {active:false,state:"exit"};
            }

            s.lastXRailContactResult="riding";
            return {active:true,state:"riding"};
        }

        if(s.railExitRefractory>0){
            s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
        }

        if(s.railCaptureCooldown>0){
            s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
        }

        const point=nearest(s.x,s.y);
        if(!point) return {active:false,state:"none"};

        const radius=Number(s.radius)||0.020;
        const contactRadius=0.070+radius*0.48;

        if(Math.sqrt(point.dist2)>contactRadius){
            return {active:false,state:"none"};
        }

        if(s.railExited||s.railExitRefractory>0||
           s.railCaptureCooldown>0){
            bounce(s,point);
            return {active:false,state:"bounce"};
        }

        const decision=evaluateCapture(s,point);

        if(decision.capture && capture(s,point,decision)){
            s.lastXRailContactResult="capture";
            return {active:true,state:"capture"};
        }

        bounce(s,point);
        return {active:false,state:"bounce"};
    }

    global.SpinWarsXRailEngine={
        version:"2.0-physical-foundation",
        geometry:buildGeometry,
        nearest,
        tangentAt,
        evaluateCapture,
        step,
        release,
        bounce
    };

})(window);
