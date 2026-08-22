/*
 * Spin Wars X — X-Rail Engine
 * Version 1 — extracted from the current V109-era app baseline.
 *
 * Ownership:
 *   X-Rail geometry, contact/capture, rail constraint, release and exit.
 *
 * This file deliberately does NOT own free-space movement, collisions,
 * scoring, UI, or battle state creation. It uses the game's existing
 * physics helpers at runtime instead of creating another movement engine.
 */
(function(global){
"use strict";

function capture(input) {
        input=input||{};

        const speed=Number(input.speed)||0;
        const rpm=clamp(Number(input.rpm)||0,0,1);
        const approach=clamp(Number(input.approachRatio)||0,0,1);
        const tangent=clamp(Number(input.tangentRatio)||0,0,1);
        const tangentSpeed=Number(input.tangentSpeed)||0;
        const normalSpeed=Math.max(0,Number(input.normalSpeed)||0);
        const normalRatio=clamp(Number(input.normalRatio)||0,0,1);
        const outwardSpeed=Math.max(0,Number(input.outwardSpeed)||0);
        const affinity=clamp(Number(input.affinity)||0,0,1);
        const stability=clamp(Number(input.stability)||0,0,1);
        const deliberate=input.deliberate===true;
        const attackBit=input.attackBit===true;
        const recentKnockback=input.recentKnockback===true;
        const impactForce=Math.max(0,Number(input.impactForce)||0);

        const rpmFloor=deliberate?0.22:(attackBit?0.34:0.38);
        if(rpm<rpmFloor) return {capture:false,reason:"low-rpm"};

        const speedFloor=deliberate?0.008:(attackBit?0.014:0.016);
        if(speed<speedFloor) return {capture:false,reason:"low-speed"};

        /*
          X-RAIL IS A SURFACE, NOT A TRACK.
          A Bey must actually enter the rail from the outside with useful
          tangential momentum. Simply travelling alongside the rail is a
          graze and must remain a graze.
        */
        const tangentFloor=
            deliberate ? 0.24 :
            (attackBit ? 0.40 : 0.46);

        const tangentSpeedFloor=
            deliberate ? 0.0050 :
            (attackBit ? 0.009 : 0.011);

        if(tangent<tangentFloor || tangentSpeed<tangentSpeedFloor){
            return {capture:false,reason:"insufficient-tangent"};
        }

        /*
          A successful capture needs a real inward contact impulse. This is
          the key distinction between a physical rail catch and a Bey that
          merely happens to orbit near the green rail.
        */
        const minimumApproachRatio=deliberate?0.10:0.16;
        const minimumApproachSpeed=deliberate?0.0045:0.0065;

        if(
            approach<minimumApproachRatio ||
            Number(input.approachSpeed||0)<minimumApproachSpeed
        ){
            return {capture:false,reason:"no-real-rail-approach"};
        }

        /*
          Moving away from the rail cannot create a capture.
        */
        if(outwardSpeed>0.0035){
            return {capture:false,reason:"moving-away-from-rail"};
        }

        /*
          Too much normal energy is a wall hit, not a rail catch.
          A very shallow, highly tangential high-speed contact is allowed;
          a square/high-energy hit rebounds through the surface-contact path.
        */
        const maxNormalRatio=deliberate?0.56:0.48;

        if(normalRatio>maxNormalRatio){
            return {capture:false,reason:"too-much-normal-impact"};
        }

        const highEnergyContact=
            speed>0.040 &&
            normalRatio>0.34 &&
            tangent<0.78;

        if(highEnergyContact){
            return {capture:false,reason:"high-energy-bounce"};
        }

        /*
          A fresh Bey-to-Bey impact gets an additional physical rejection
          test before RNG. A hard impact cannot magically become a rail ride.
        */
        if(
            recentKnockback &&
            (
                normalRatio>0.42 ||
                normalSpeed>0.009 ||
                impactForce>0.0060
            ) &&
            tangent<0.74
        ){
            return {capture:false,reason:"hard-impact-no-catch"};
        }

        const approachQuality=clamp(
            (approach-minimumApproachRatio)/
            Math.max(0.01,1-minimumApproachRatio),
            0,1
        );

        const tangentQuality=clamp(
            (tangent-tangentFloor)/
            Math.max(0.01,1-tangentFloor),
            0,1
        );

        const speedQuality=clamp(
            (speed-speedFloor)/0.045,
            0,
            1
        );

        const normalQuality=1-clamp(
            normalRatio/maxNormalRatio,
            0,
            1
        );

        const score=clamp(
            approachQuality*0.22+
            tangentQuality*0.34+
            speedQuality*0.13+
            normalQuality*0.17+
            affinity*0.06+
            stability*0.05+
            rpm*0.03,
            0,1
        );

        /*
          RNG is a small uncertainty around a physical result, not the
          mechanism that creates the rail ride.
        */
        const baseChance=deliberate
            ? 0.55+score*0.25
            : 0.05+
              score*0.55+
              (attackBit?0.04:0);

        const chance=clamp(
            baseChance+(Math.random()-0.5)*0.025,
            0.05,
            0.82
        );

        if(Math.random()>chance){
            return {
                capture:false,
                reason:"marginal-contact",
                score,
                chance
            };
        }

        return {
            capture:true,
            score,
            chance,
            grip:clamp(
                0.52+
                affinity*0.14+
                score*0.24+
                rpm*0.04,
                0.46,
                0.92
            )
        };
    }

function railClamp(value,min,max){
    return Math.max(min,Math.min(max,value));
}

function getNewXRailGeometry(){
    if(NEW_BATTLE.railGeometry) return NEW_BATTLE.railGeometry;

    /*
      V72 X-RAIL: FINITE TOP-EXIT TRACK
      -----------------------------------
      The Spin Wars X battle orientation places the X-Rail at the TOP of the
      player's view. The two endpoints form the X-Exit gap. The rail runs
      down both sides and around the lower bowl before returning to the
      opposite top endpoint.

      Stored path direction is LEFT -> RIGHT around the lower bowl.
      Right-spin travels the stored path to the right-side X-Exit; left-spin
      travels the exact reverse.

      There is NO wrap-around. Reaching the appropriate top endpoint launches
      the Bey inward toward the center. Normal battle physics then determines
      whether that launch later produces an Xtreme or Over finish.
    */
    const controls=[
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
    ];

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

    const samples=[];
    const samplesPerSpan=28;

    for(let i=0;i<controls.length-1;i++){
        const p0=controls[Math.max(0,i-1)];
        const p1=controls[i];
        const p2=controls[i+1];
        const p3=controls[Math.min(controls.length-1,i+2)];

        for(let j=0;j<samplesPerSpan;j++){
            const t=j/samplesPerSpan;
            const point=catmull(p0,p1,p2,p3,t);
            const d=derivative(p0,p1,p2,p3,t);
            const dl=Math.hypot(d.x,d.y)||1;

            samples.push({
                x:point.x,
                y:point.y,
                tx:d.x/dl,
                ty:d.y/dl
            });
        }
    }

    const last=controls[controls.length-1];
    const prev=controls[controls.length-2];
    const dl=Math.hypot(last.x-prev.x,last.y-prev.y)||1;

    samples.push({
        x:last.x,
        y:last.y,
        tx:(last.x-prev.x)/dl,
        ty:(last.y-prev.y)/dl
    });

    const segments=[];
    let total=0;

    for(let i=0;i<samples.length-1;i++){
        const a=samples[i];
        const b=samples[i+1];
        const length=Math.hypot(b.x-a.x,b.y-a.y);

        if(length<0.000001) continue;

        segments.push({a,b,length,start:total});
        total+=length;
    }

    NEW_BATTLE.railGeometry={
        controls,
        samples,
        segments,
        total,
        startDistance:0,
        endDistance:total,
        leftExit:samples[0],
        rightExit:samples[samples.length-1],
        exitGap:{
            leftX:-0.133,
            rightX:0.133,
            y:-0.790
        },
        type:"top-open-accelerator-track-v72"
    };

    return NEW_BATTLE.railGeometry;
}

function newXRailNearest(x,y){
    const g=getNewXRailGeometry();
    let best=null;

    for(const seg of g.segments){
        const abx=seg.b.x-seg.a.x;
        const aby=seg.b.y-seg.a.y;
        const ab2=abx*abx+aby*aby||1;

        const t=newBattleClamp(
            (
                (x-seg.a.x)*abx+
                (y-seg.a.y)*aby
            )/ab2,
            0,1
        );

        const px=seg.a.x+abx*t;
        const py=seg.a.y+aby*t;

        const dx=x-px;
        const dy=y-py;
        const dist2=dx*dx+dy*dy;

        if(!best || dist2<best.dist2){
            let tx=
                seg.a.tx+
                (seg.b.tx-seg.a.tx)*t;

            let ty=
                seg.a.ty+
                (seg.b.ty-seg.a.ty)*t;

            const tl=Math.hypot(tx,ty)||1;

            best={
                x:px,
                y:py,
                dist2,
                distance:seg.start+seg.length*t,
                tx:tx/tl,
                ty:ty/tl,
                segment:seg,
                t
            };
        }
    }

    return best;
}

function newXRailTangentAtPoint(point, direction, x, y){
    /*
      AUTHORITATIVE GAMEPLAY DIRECTION
      --------------------------------
      The authored rail path is the physical track from the LEFT top
      endpoint, down around the stadium, to the RIGHT top endpoint.

      For Spin Wars X, a RIGHT-spin Bey rides that authored path: LEFT ->
      RIGHT -> TOP X-EXIT. A LEFT-spin Bey rides the exact reverse.

      We intentionally do NOT infer direction from the Bey's current
      velocity or from screen-space angular math. The track's authored
      direction is the source of truth.
    */
    let tx=point?.tx||0;
    let ty=point?.ty||0;
    const len=Math.hypot(tx,ty)||1;
    tx/=len;
    ty/=len;
    const dir=direction>=0 ? 1 : -1;
    return {x:tx*dir,y:ty*dir};
}

function railDirection(s){
    /*
      The authored rail path is LEFT endpoint -> down the left side ->
      around the lower bowl -> up the right side -> RIGHT endpoint.

      That path is the game's counter-clockwise orbit in screen coordinates.

      RIGHT spin MUST use +1 (left endpoint to right endpoint).
      LEFT spin MUST use -1 (the exact reverse).
    */
    return s?.spinDirection===-1 ? -1 : 1;
}

function isBottomFinishCorridor(s){
    return !!s && s.y>0.70;
}

function newXRailRelease(s,direction,reason="release"){
    if(!s) return false;

    const point=newXRailNearest(s.x,s.y);
    const dir=direction||railDirection(s);

    s.railEngaged=false;
    s.railGrip=0;
    s.railDirection=0;
    s.railSpeed=0;
    s.railTravelDistance=0;
    s.railRideTime=0;
    s.railContactPoint=
        point
            ? {x:point.x,y:point.y}
            : null;
    s.railExited=false;
    s.railExitForce=0;

    s.railExitRefractory=0.18;

    // Prevent immediate X-rail -> X-exit -> X-rail loops.
    const chainCount=Math.max(1,s.railChainCount||1);
    s.railChainLock=Math.min(2.20,0.70+0.45*(chainCount-1));
    s.railCaptureCooldown=Math.max(0.42,s.railChainLock);
    s.railCaptureCooldownPoint={x:s.x,y:s.y};
    s.railExitRefractoryPoint={
        x:s.x,
        y:s.y
    };

    /*
      Release away from the rail surface, but preserve most of the
      Bey's existing velocity. We do NOT invent a new orbit here.
    */
    if(point){
        const dx=s.x-point.x;
        const dy=s.y-point.y;
        const len=Math.hypot(dx,dy)||1;

        const outwardX=dx/len;
        const outwardY=dy/len;

        const outward=
            s.vx*outwardX+
            s.vy*outwardY;

        if(outward<0.002){
            s.vx+=outwardX*(0.002-outward);
            s.vy+=outwardY*(0.002-outward);
        }

        const separation=0.012+s.radius*0.10;
        s.x=point.x+outwardX*separation;
        s.y=point.y+outwardY*separation;
    }

    s.surfaceBounce=0.10;
    s.surfaceRecovery=0.10;
    s.motionPhase+=0.35+Math.random()*0.25;

    return reason;
}

function tryNewXRailEngagement(s){
    if(
        !s ||
        s.railEngaged ||
        (s.railExitRefractory||0)>0 ||
        (s.railCaptureCooldown||0)>0 ||
        (s.railChainLock||0)>0
    ){
        return false;
    }

    if(!window.SpinWarsXRailEngine){
        throw new Error("X-Rail Phase A engine failed to load");
    }

    const nearest=newXRailNearest(s.x,s.y);
    if(!nearest) return false;

    const bp=bitPhysics(s);
    const speed=speedOf(s);
    const rpm=newBattleClamp(s.rpm,0,1);
    const stability=newBattleClamp(s.stability||0,0,1);
    const affinity=(bp.xRailAffinity||50)/100;
    const movement=(bp.movement||60)/100;
    const attackBit=movement>=0.80;
    const deliberateXRail=s.launchPlan?.technique==="X-Rail";

    const dx=s.x-nearest.x;
    const dy=s.y-nearest.y;
    const distance=Math.hypot(dx,dy)||0.0001;

    /*
      ROOT FIX:
      The old system measured rail approach from the stadium center.
      That is wrong for a curved wall. Approach is now measured against
      the ACTUAL local rail normal at the contact point.
    */
    const normalX=dx/distance;
    const normalY=dy/distance;

    const contactRadius=
        0.072+
        s.radius*0.48+
        (deliberateXRail ? 0.020 : 0);

    if(distance>contactRadius){
        return false;
    }

    const direction=railDirection(s);

    const railTangent=newXRailTangentAtPoint(
        nearest,
        direction,
        nearest.x,
        nearest.y
    );

    const tangent=
        s.vx*railTangent.x+
        s.vy*railTangent.y;

    /*
      Positive approach means the Bey is moving INTO the rail.
      Positive tangent means it is moving in the rail's authored direction.
    */
    const approachSpeed=
        Math.max(
            0,
            -(s.vx*normalX+s.vy*normalY)
        );

    const outwardSpeed=
        Math.max(
            0,
            s.vx*normalX+s.vy*normalY
        );

    const approachRatio=
        approachSpeed/
        Math.max(speed,0.0001);

    const tangentRatio=
        Math.max(0,tangent)/
        Math.max(speed,0.0001);

    const normalSpeed=
        Math.abs(s.vx*normalX+s.vy*normalY);

    const normalRatio=
        normalSpeed/
        Math.max(speed,0.0001);

    const recentKnockback=
        (performance.now()-(s.lastImpactAt||0))<=420 &&
        (s.lastKnockback||0)>=0.010;

    const decision=window.SpinWarsXRailEngine.capture({
        speed,
        rpm,
        approachRatio,
        approachSpeed,
        tangentRatio,
        tangentSpeed:tangent,
        normalSpeed,
        normalRatio,
        outwardSpeed,
        affinity,
        stability,
        deliberate:deliberateXRail,
        attackBit,
        recentKnockback,
        impactForce:Number(s.lastImpactForce)||0
    });

    if(!decision.capture){
        return false;
    }

    /*
      CAPTURE -> RIDING CONTRACT
      --------------------------
      Capture does not manufacture a new velocity and does not snap the
      Bey onto the spline. We only remove the component that is driving
      INTO the rail. The Bey keeps the tangential momentum it actually
      brought to the contact.
    */
    /*
      Capture is a state transition, not a velocity teleport.
      Remove only the component that is actually driving INTO the rail.
      Keep the tangential momentum and any small legitimate outward
      component. The rail constraint will handle the next frame.
    */
    const currentNormal=
        s.vx*normalX+s.vy*normalY;

    if(currentNormal<0){
        s.vx-=normalX*currentNormal;
        s.vy-=normalY*currentNormal;
    }

    const tangentAfter=
        s.vx*railTangent.x+
        s.vy*railTangent.y;

    const outwardAfter=
        s.vx*normalX+
        s.vy*normalY;

    if(
        !Number.isFinite(tangentAfter) ||
        !Number.isFinite(outwardAfter) ||
        tangentAfter<=0
    ){
        return false;
    }

    const capturedSpeed=tangentAfter;

    s.railEngaged=true;
    s.railExited=false;
    s.railExitRefractory=0;
    s.railDirection=direction;
    s.railDirectionName=
        direction>0
            ? "RIGHT_SPIN_CCW_PATH"
            : "LEFT_SPIN_CW_PATH";

    s.railGrip=Number.isFinite(decision.grip)
        ? decision.grip
        : 0.50;
    s.railContactPoint={x:nearest.x,y:nearest.y};
    s.railDistance=nearest.distance;
    s.railTravelDistance=0;
    s.railRideTime=0;
    s.railSpeed=capturedSpeed;
    s.railUses=(s.railUses||0)+1;
    s.railChainCount=(s.railChainCount||0)+1;

    /*
      Resolve only true penetration. A successful capture does not move the
      Bey onto a mathematical rail point; its existing position remains
      authoritative.
    */
    const minimumGap=Math.max(0.018,s.radius*0.42);
    if(distance<minimumGap){
        const push=minimumGap-distance;
        s.x+=normalX*push;
        s.y+=normalY*push;
    }

    return true;
}

function newXRailExit(s,reason){
    if(!s) return false;

    const g=getNewXRailGeometry();
    const direction=railDirection(s);
    const endpoint=direction>0 ? g.rightExit : g.leftExit;

    // Preserve the Bey's actual current momentum.
    let vx=Number(s.vx)||0;
    let vy=Number(s.vy)||0;

    const speed=Math.hypot(vx,vy);
    if(speed<0.003){
        const t=newXRailTangentAtPoint(
            newXRailNearest(endpoint.x,endpoint.y)
        );
        vx=t.x*direction*0.012;
        vy=t.y*direction*0.012;
    }

    /*
      Bias the velocity through the physical X-Exit opening rather than
      assigning a canned launch speed.
    */
    const toExitX=endpoint.x-s.x;
    const toExitY=endpoint.y-s.y;
    const len=Math.hypot(toExitX,toExitY);

    if(len>0.0001){
        const ex=toExitX/len;
        const ey=toExitY/len;
        const outward=Math.max(0,vx*ex+vy*ey);
        const exitBias=0.12;

        vx+=ex*exitBias;
        vy+=ey*exitBias;

        // Do not turn a weak exit into an absurd launch.
        const maxExit=Math.max(0.035,speed*1.18+0.012);
        const newSpeed=Math.hypot(vx,vy);

        if(newSpeed>maxExit){
            vx*=maxExit/newSpeed;
            vy*=maxExit/newSpeed;
        }
    }

    s.vx=vx;
    s.vy=vy;

    // Move the Bey just beyond the exit boundary so it cannot immediately
    // recapture the same rail.
    if(len>0.0001){
        const push=0.040+((Number(s.radius)||0.020)*0.55);
        s.x+=toExitX/len*push;
        s.y+=toExitY/len*push;
    }

    s.railEngaged=false;
    s.railExited=true;
    s.railExitRefractory=0.30;
    s.railCaptureCooldown=0.42;
    s.railAwayTime=0;
    s.railDistance=direction>0 ? g.total : 0;
    s.railSpeed=0;
    s.railRideTime=0;
    s.railTravelDistance=0;

    if(reason) s.lastXRailExitReason=reason;

    return true;
}

function applyXRailContactSafety(s,nearest,incomingNormal){
    if(!s || !nearest) return false;

    const distance=Math.sqrt(
        Math.max(0,nearest.dist2)
    );

    const contactRadius=
        0.072+
        s.radius*0.48;

    if(!Number.isFinite(distance) || distance>contactRadius){
        return false;
    }

    /*
      Failed capture is a real rail-surface contact. The Bey does not get
      magnetically flattened against the rail. A component travelling into
      the rail is reflected with finite restitution; tangential momentum is
      only lightly reduced by surface friction.
    */
    const dx=s.x-nearest.x;
    const dy=s.y-nearest.y;
    const len=Math.hypot(dx,dy);

    if(!Number.isFinite(len) || len<0.00001){
        return false;
    }

    const nx=dx/len;
    const ny=dy/len;

    const normalVelocity=
        s.vx*nx+
        s.vy*ny;

    if(!Number.isFinite(normalVelocity)){
        return false;
    }

    const impactNormal=Math.max(0,-normalVelocity);
    const speed=Math.hypot(s.vx,s.vy);

    if(normalVelocity<0){
        /*
          Faster/stronger normal contact rebounds more. This is a physical
          response, not a random rail-eject chance.
        */
        const restitution=railClamp(
            0.34+
            railClamp(impactNormal/0.024,0,1)*0.34+
            railClamp((speed-0.022)/0.045,0,1)*0.12,
            0.34,
            0.80
        );

        const normalAfter=impactNormal*restitution;
        s.vx-=nx*normalVelocity;
        s.vy-=ny*normalVelocity;
        s.vx+=nx*normalAfter;
        s.vy+=ny*normalAfter;

        /*
          Let the existing movement engine respect the rebound for a short
          physical recovery window instead of immediately steering back to
          its preferred orbit.
        */
        s.impactMomentumState=Math.max(
            s.impactMomentumState||0,
            railClamp(impactNormal/0.028,0,0.82)
        );

        s.surfaceBounce=Math.max(
            s.surfaceBounce||0,
            railClamp(0.18+impactNormal/0.035*0.30,0.18,0.55)
        );
        s.surfaceRecovery=Math.max(
            s.surfaceRecovery||0,
            0.12
        );

        if(impactNormal>0.004){
            s.railCaptureCooldown=Math.max(
                s.railCaptureCooldown||0,
                0.16
            );
            s.railCaptureCooldownPoint={x:s.x,y:s.y};
        }
    }

    /*
      If the contact point is slightly embedded in the rail, resolve only
      the penetration. Never pull a Bey inward to a target spline gap.
    */
    const minimumGap=Math.max(0.018,s.radius*0.42);
    if(distance<minimumGap){
        const push=minimumGap-distance;
        s.x+=nx*push;
        s.y+=ny*push;
    }

    s.railEngaged=false;
    s.railGrip=0;
    s.railSpeed=0;
    s.railContactPoint={
        x:nearest.x,
        y:nearest.y
    };

    return true;
}

function applyXRailConstraint(s,dt){
    if(!s?.railEngaged) return false;

    const g=getNewXRailGeometry();
    const nearest=newXRailNearest(s.x,s.y);
    if(!nearest){
        newXRailExit(s,"rail-geometry");
        return false;
    }

    const direction=railDirection(s);
    const railDist=nearest.distance;
    const radius=Number(s.radius);

    if(!Number.isFinite(radius) || radius<=0){
        newXRailExit(s,"invalid-radius");
        return false;
    }

    const contactLimit=0.070+radius*0.60;

    /*
      PHYSICAL RAIL CONSTRAINT

      Position and velocity remain authoritative. The rail supplies a local
      surface tangent/normal constraint; it does not place the Bey on a
      spline or maintain a second movement speed.
    */
    if(!Number.isFinite(railDist) || railDist>contactLimit){
        newXRailExit(s,"lost-contact");
        return false;
    }

    /*
      newXRailTangentAtPoint() already returns the tangent in the Bey's
      authored travel direction. Do not apply direction a second time.
    */
    const tangent=newXRailTangentAtPoint(
        nearest,
        direction,
        s.x,
        s.y
    );

    let tx=Number(tangent?.x);
    let ty=Number(tangent?.y);
    const tangentLength=Math.hypot(tx,ty);

    if(
        !Number.isFinite(tx) ||
        !Number.isFinite(ty) ||
        !Number.isFinite(tangentLength) ||
        tangentLength<0.00001
    ){
        newXRailExit(s,"invalid-tangent");
        return false;
    }

    tx/=tangentLength;
    ty/=tangentLength;

    /*
      Rail normal points from the rail toward the Bey.
    */
    let nx=s.x-nearest.x;
    let ny=s.y-nearest.y;
    let nl=Math.hypot(nx,ny);

    if(!Number.isFinite(nl)){
        newXRailExit(s,"invalid-normal");
        return false;
    }

    if(nl<0.00001){
        nx=-ty;
        ny=tx;
        nl=1;
    }else{
        nx/=nl;
        ny/=nl;
    }

    let vx=Number(s.vx);
    let vy=Number(s.vy);

    if(!Number.isFinite(vx) || !Number.isFinite(vy)){
        newXRailExit(s,"invalid-velocity");
        return false;
    }

    /*
      Decompose the ACTUAL velocity into rail tangent and rail normal.
      Positive normal velocity is away from the rail and is allowed to
      continue. Negative normal velocity is velocity into the rail and is
      removed by the surface constraint.
    */
    let tangentialSpeed=vx*tx+vy*ty;
    const normalSpeed=vx*nx+vy*ny;

    if(
        !Number.isFinite(tangentialSpeed) ||
        !Number.isFinite(normalSpeed)
    ){
        newXRailExit(s,"invalid-velocity-components");
        return false;
    }

    /*
      Riding is not a permanent attachment. A meaningful outward velocity
      means the Bey is leaving the rail; release the constraint and let normal
      movement take over rather than continuing the orbit around the track.
    */
    const escapeThreshold=
        0.010+
        (1-railClamp(Number(s.railGrip)||0.55,0,1))*0.004;

    const outwardRatio=
        normalSpeed/
        Math.max(Math.hypot(vx,vy),0.0001);

    if(
        normalSpeed>escapeThreshold &&
        outwardRatio>0.22
    ){
        newXRailExit(s,"outward-release");
        return false;
    }

    if(tangentialSpeed<0.004){
        newXRailExit(s,"lost-tangent");
        return false;
    }

    if(normalSpeed<0){
        vx-=nx*normalSpeed;
        vy-=ny*normalSpeed;
    }

    /*
      Rail friction acts along the rail. It does not erase radial/outward
      momentum and does not manufacture a target velocity.
    */
    const rpmN=railClamp(Number(s.rpm),0,1);
    const affinity=railClamp(
        Number(s.railAffinity ?? s.xRailAffinity ?? 0.5),
        0,
        1
    );

    const contactQuality=railClamp(
        1-(railDist/contactLimit),
        0,
        1
    );

    const grip=railClamp(
        0.62+
        affinity*0.16+
        contactQuality*0.12+
        rpmN*0.10,
        0.55,
        0.98
    );

    const friction=railClamp(
        0.012+
        (1-rpmN)*0.012,
        0.010,
        0.026
    );

    tangentialSpeed*=
        Math.max(0,1-friction*dt*60);

    /*
      Gradual rail acceleration.

      This is force-like acceleration, not a snap to a canned speed.
      Attack-oriented Bits receive stronger rail drive through their
      physical acceleration property.
    */
    const bp=bitPhysics(s);
    const bitAcceleration=railClamp(
        Number(bp?.acceleration ?? 60)/100,
        0,
        1
    );
    const movement=railClamp(
        Number(bp?.movement ?? 60)/100,
        0,
        1
    );

    const attackBit=movement>=0.80;
    const accelerationBase=
        0.010+
        bitAcceleration*0.010+
        (attackBit?0.004:0);

    const railCeiling=
        0.060+
        rpmN*0.036+
        grip*0.020+
        bitAcceleration*0.010;

    const speedRoom=Math.max(0,railCeiling-tangentialSpeed);

    const acceleration=
        accelerationBase*
        (0.55+grip*0.45)*
        (0.45+rpmN*0.55)*
        (0.35+contactQuality*0.65)*
        (0.35+Math.min(1,speedRoom/0.040)*0.65);

    tangentialSpeed+=acceleration*dt;
    tangentialSpeed=Math.min(
        railCeiling,
        Math.max(0.004,tangentialSpeed)
    );

    if(!Number.isFinite(tangentialSpeed)){
        newXRailExit(s,"invalid-rail-speed");
        return false;
    }

    /*
      Reconstruct actual velocity from:
        - tangential momentum after friction/rail drive
        - any legitimate outward normal momentum

      This keeps the rail physically connected to the Bey rather than
      replacing the Bey with a spline-following controller.
    */
    const outwardNormal=Math.max(0,normalSpeed);

    s.vx=tx*tangentialSpeed+nx*outwardNormal;
    s.vy=ty*tangentialSpeed+ny*outwardNormal;

    if(!Number.isFinite(s.vx) || !Number.isFinite(s.vy)){
        newXRailExit(s,"invalid-reconstructed-velocity");
        return false;
    }

    /*
      Resolve only actual penetration. Do not continuously pull the Bey toward
      the rail; that was one of the mechanisms that made the old system look
      like an orbiting track/conveyor.
    */
    const minimumGap=Math.max(0.018,radius*0.42);
    if(railDist<minimumGap){
        const correction=Math.min(
            0.012,
            minimumGap-railDist
        );
        s.x+=nx*correction;
        s.y+=ny*correction;
    }

    const projected=newXRailNearest(s.x,s.y);
    if(projected){
        s.railDistance=projected.distance;
    }

    s.railGrip=grip;
    s.railSpeed=
        Math.abs(s.vx*tx+s.vy*ty);
    s.railRideTime=(s.railRideTime||0)+dt;
    s.railTravelDistance=
        (s.railTravelDistance||0)+s.railSpeed*dt;

    /*
      PHYSICAL X-EXIT

      The finite rail ends at a spatial exit region. We release the rail
      while preserving the velocity just calculated.
    */
    const endpoint=
        direction>0 ? g.rightExit : g.leftExit;

    const ex=s.x-endpoint.x;
    const ey=s.y-endpoint.y;
    const exitDistance=Math.hypot(ex,ey);

    const exitRadius=0.115+radius*0.90;

    if(
        exitDistance<=exitRadius ||
        (direction>0 && s.railDistance>=g.total-0.050) ||
        (direction<0 && s.railDistance<=0.050)
    ){
        newXRailExit(s,"x-exit");
        return false;
    }

    /*
      Hard safety only. This is not the normal exit mechanism.
    */
    if(
        s.railTravelDistance>g.total*1.15 ||
        s.railRideTime>2.20
    ){
        newXRailExit(s,"rail-safety");
        return false;
    }

    return true;
}

// Public X-Rail API.
// The implementation above remains private to this module.
global.SpinWarsXRailEngine={
    version:"1-extracted",
    capture,
    geometry:getNewXRailGeometry,
    nearest:newXRailNearest,
    tangentAt:newXRailTangentAtPoint,
    direction:railDirection,
    isBottomFinishCorridor,
    release:newXRailRelease,
    engage:tryNewXRailEngagement,
    exit:newXRailExit,
    contactSafety:applyXRailContactSafety,
    constraint:applyXRailConstraint
};

})(window);
