
/*========================================================
 SPIN WARS X — X-RAIL / MOVEMENT PHYSICS V6
 Replace the V5 anti-repeat rail behavior with physical contact.
 Append AFTER app_XRAIL_FIXED_V5.js.
========================================================*/

(function installXRailPhysicsV6(){

    const _oldLaunchState = window.newBattleLaunchState;

    window.newBattleLaunchState = function(side){
        const s = _oldLaunchState(side);

        // Rail access is no longer limited to one use.
        s.railUses = 0;
        s.railEngaged = false;
        s.railExitCooldown = 0;

        // Physical refractory state: prevents the Bey from immediately
        // recapturing the exact exit/contact point without being a timer lock.
        s.railExitRefractory = 0;
        s.railExitRefractoryPoint = null;

        // Wall/impact state.
        s.surfaceRecovery = 0;
        s.surfaceBounce = 0;

        return s;
    };

    function clamp(v,a,b){
        return Math.max(a,Math.min(b,v));
    }

    function speedOf(s){
        return Math.hypot(s.vx,s.vy);
    }

    function bitPhysics(s){
        return BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
    }

    function railDirection(s){
        return s.spinDirection || -1;
    }

    /*
      Rail capture is now a physical decision:

      CONTACT
        -> approach angle
        -> speed
        -> spin direction
        -> bit geometry/control
        -> tangential component
        -> capture OR bounce

      No random "you touched it, therefore ride it."
    */
    window.tryNewXRailEngagement = function(s){

        if(s.railEngaged) return true;

        const nearest = newXRailNearest(s.x,s.y);
        if(!nearest) return false;

        const distance = Math.sqrt(nearest.dist2);
        const bp = bitPhysics(s);
        const speed = speedOf(s);

        // Actual physical contact envelope.
        const contactRadius = 0.030 + s.radius * 0.24;
        if(distance > contactRadius) return false;

        if(speed < 0.004) return false;

        const dx = s.x - nearest.x;
        const dy = s.y - nearest.y;
        const len = Math.hypot(dx,dy) || 1;

        const nx = dx/len;
        const ny = dy/len;

        // Velocity toward the rail is negative along the outward normal.
        const normalVelocity = s.vx*nx + s.vy*ny;
        const approachSpeed = Math.max(0,-normalVelocity);

        // If the Bey is moving away from the rail, it already bounced.
        if(approachSpeed <= 0.0015) return false;

        const desiredTx = nearest.tx * railDirection(s);
        const desiredTy = nearest.ty * railDirection(s);

        const tangentVelocity = s.vx*desiredTx + s.vy*desiredTy;
        const absTangent = Math.abs(tangentVelocity);

        const approachRatio = approachSpeed / Math.max(speed,0.001);
        const tangentRatio = absTangent / Math.max(speed,0.001);

        /*
          Capture cone.

          A shallow/glancing impact with useful tangential velocity can
          latch onto the rail.

          A hard, square impact mostly moving into the rail should bounce.
        */
        const control = (bp.control || 60)/100;
        const movement = (bp.movement || 60)/100;
        const affinity = (bp.xRailAffinity || 50)/100;

        // Higher control gives a wider usable capture cone.
        const minTangentRatio =
            0.30 -
            control*0.08;

        const maxApproachRatio =
            0.82 +
            control*0.08;

        if(tangentVelocity <= 0) {
            // Wrong rail direction for this spin: physical bounce.
            return false;
        }

        if(tangentRatio < minTangentRatio ||
           approachRatio > maxApproachRatio){
            return false;
        }

        /*
          Speed matters, but more speed does NOT guarantee capture.
          Extremely fast square impacts are more likely to bounce.
        */
        const speedFactor = clamp(
            (speed-0.010)/0.040,
            0,1
        );

        const angleFactor = clamp(
            (tangentRatio-minTangentRatio) /
            Math.max(0.01,1-minTangentRatio),
            0,1
        );

        const attackBit = movement >= 0.80;

        const captureScore =
            0.32 +
            angleFactor*0.30 +
            control*0.14 +
            affinity*0.12 +
            speedFactor*0.12 -
            Math.max(0,approachRatio-0.62)*0.35;

        /*
          Small physical variance represents tiny differences in contact
          position/friction. It is not the mechanism deciding rail access.
        */
        const variance =
            (Math.random()-0.5) *
            (0.035 + (1-control)*0.025);

        const captureThreshold =
            clamp(captureScore + variance,0,1);

        if(captureThreshold < 0.50){
            return false;
        }

        const g = getNewXRailGeometry();

        s.railEngaged = true;
        s.railUses = (s.railUses || 0) + 1;

        s.railContactPoint = {
            x:nearest.x,
            y:nearest.y
        };

        s.railDistance = nearest.distance;
        s.railProgress =
            nearest.distance / g.total;

        /*
          Do not manufacture rail speed.

          The Bey enters with its existing physical speed. The rail can
          accelerate it after capture.
        */
        s.railSpeed = clamp(
            speed * (
                1.00 +
                movement*0.10 +
                affinity*0.06
            ),
            0.014,
            0.070
        );

        s.railRideTime = 0;
        s.railTravelDistance = 0;
        s.railLoops = 0;

        // Snap only to the actual contact point.
        s.x = nearest.x;
        s.y = nearest.y;

        // Remove only the normal component into the rail.
        // Tangential momentum survives.
        if(normalVelocity < 0){
            s.vx -= normalVelocity*nx;
            s.vy -= normalVelocity*ny;
        }

        return true;
    };


    /*
      Failed rail contact is a BOUNCE, not a missed event that lets the Bey
      continue through the rail.
    */
    function bounceOffRail(s,nearest){

        const dx = s.x-nearest.x;
        const dy = s.y-nearest.y;
        const len = Math.hypot(dx,dy) || 1;

        const nx = dx/len;
        const ny = dy/len;

        const outward = s.vx*nx + s.vy*ny;

        if(outward >= 0) return;

        const bp = bitPhysics(s);
        const balance = (s.stats?.balance || 70)/99;
        const control = (bp.control || 60)/100;

        // Low-friction attack tips lose more speed on a bad rail hit.
        const restitution =
            clamp(
                0.20 +
                balance*0.16 +
                control*0.10,
                0.18,
                0.44
            );

        // Reflect the component entering the wall.
        s.vx -= (1+restitution)*outward*nx;
        s.vy -= (1+restitution)*outward*ny;

        // Tangential friction at the rail contact.
        const tangentDamp =
            clamp(
                0.78 +
                control*0.10,
                0.74,
                0.90
            );

        const tx = -ny;
        const ty = nx;

        const tangent = s.vx*tx+s.vy*ty;
        const normal = s.vx*nx+s.vy*ny;

        s.vx = nx*normal + tx*tangent*tangentDamp;
        s.vy = ny*normal + ty*tangent*tangentDamp;

        // Separate the Bey from the rail.
        const push = 0.006 + s.radius*0.18;
        s.x = nearest.x + nx*push;
        s.y = nearest.y + ny*push;

        // A rail impact creates a new trajectory state.
        s.surfaceBounce = 0.16;
        s.surfaceRecovery = 0.10;

        const impactSpeed = Math.abs(outward);

        s.rpm = clamp(
            s.rpm -
            (0.0015 + impactSpeed*0.020),
            0,1
        );

        s.stability = clamp(
            s.stability -
            (0.003 + impactSpeed*0.035),
            0,1
        );
    }


    /*
      Rail ride:
      - rail accelerates from physical entry speed
      - RPM controls how long acceleration can continue
      - no artificial one-ride limit
      - exit happens when the Bey physically reaches the exit
    */
    window.updateNewXRailRide = function(s,dt){

        if(!s.railEngaged) return false;

        const g = getNewXRailGeometry();
        const direction = railDirection(s);
        const bp = bitPhysics(s);

        const movement = (bp.movement || 60)/100;
        const affinity = (bp.xRailAffinity || 50)/100;

        const rpm = clamp(s.rpm,0,1);
        const previousDistance = s.railDistance;

        s.railRideTime += dt;

        /*
          Acceleration is strongest when RPM is high and gradually disappears.
          The rail never creates infinite speed.
        */
        const acceleration =
            (
                0.0020 +
                movement*0.0030 +
                affinity*0.0020
            ) *
            (0.30 + rpm*0.70);

        const railDrag =
            0.0014 +
            (1-rpm)*0.0018;

        s.railSpeed = clamp(
            s.railSpeed +
            (acceleration-railDrag)*dt*60,
            0.012,
            0.082
        );

        const travel = s.railSpeed*dt*60;

        s.railDistance += direction*travel;
        s.railTravelDistance += Math.abs(travel);

        s.railProgress =
            (
                ((s.railDistance%g.total)+g.total)%g.total
            )/g.total;

        const point =
            newXRailPointAtDistance(s.railDistance);

        const tangentX = point.tx*direction;
        const tangentY = point.ty*direction;

        s.x = point.x;
        s.y = point.y;

        s.vx = tangentX*s.railSpeed;
        s.vy = tangentY*s.railSpeed;

        /*
          Rail drains spin according to actual speed and bit behavior.
        */
        const drain =
            (
                0.010 +
                s.railSpeed*0.040 +
                affinity*0.004
            ) *
            dt;

        s.rpm = clamp(s.rpm-drain,0,1);

        s.stability = clamp(
            s.stability -
            (
                0.0015 +
                s.railSpeed*0.018
            )*dt,
            0,1
        );

        /*
          Physical X Exit crossing.

          No maximum ride timer.
          No "one rail per battle" rule.
        */
        const crossed =
            newXRailCrossedExit(
                previousDistance,
                s.railDistance,
                direction
            );

        if(crossed && s.railTravelDistance>0.16){
            newXRailExit(s);
            return true;
        }

        // If spin is effectively gone, the Bey cannot keep riding.
        if(s.rpm<=0.001 || s.railSpeed<=0.012){
            newXRailExit(s);
            return true;
        }

        return true;
    };


    /*
      Exit keeps the actual rail momentum.

      We do NOT multiply it into an absurd velocity and we do NOT kill it
      with a magic 0.52 multiplier. The exit redirects the rail velocity
      into the stadium while preserving a controlled amount of tangent.
    */
    window.newXRailExit = function(s){

        const exit =
            newXRailPointAtDistance(
                getNewXRailGeometry().exitDistance
            );

        const bp = bitPhysics(s);
        const rpm = clamp(s.rpm,0,1);

        const exitSpeed = clamp(
            s.railSpeed *
            (
                0.92 +
                rpm*0.10
            ),
            0.018,
            0.078
        );

        const direction = railDirection(s);

        const tangentX = exit.tx*direction;
        const tangentY = exit.ty*direction;

        /*
          The X Exit redirects most energy inward, while preserving only
          a modest tangent component from the rail.
        */
        const tangentCarry =
            clamp(
                0.08 +
                (bp.control||60)/100*0.06,
                0.08,
                0.14
            );

        s.railEngaged = false;
        s.railExited = true;

        s.railRideTime = 0;
        s.railProgress = 0;
        s.railDistance = 0;
        s.railTravelDistance = 0;
        s.railLoops = 0;
        s.railContactPoint = null;

        /*
          No timed anti-repeat lock.

          The Bey simply has to move away from the exit/contact geometry
          before it can physically interact with the rail again.
        */
        s.railExitRefractory = 0.16;
        s.railExitRefractoryPoint = {
            x:exit.x,
            y:exit.y
        };

        s.x = exit.x;
        s.y = exit.y + 0.045;

        s.vx =
            tangentX*exitSpeed*tangentCarry;

        s.vy =
            exitSpeed +
            tangentY*exitSpeed*tangentCarry;

        // Exit costs spin because the rail ride transferred energy into speed.
        s.rpm = clamp(
            s.rpm -
            (
                0.018 +
                s.railSpeed*0.16
            ),
            0,1
        );

        s.stability = clamp(
            s.stability -
            0.012,
            0,1
        );

        s.surfaceRecovery = 0.12;
    };


    /*
      Normal movement is now force-based rather than orbit-based.

      Forces:
        1. existing launch / collision momentum
        2. spin/precession
        3. stadium slope
        4. controlled friction
        5. tiny physical disturbance

      RPM controls how strongly those forces remain active.
    */
    window.newPhysicsStep = function(s,dt){

        const stats = s.stats || {};
        const bp = bitPhysics(s);

        const rpm = clamp(s.rpm,0,1);
        const mobility = (stats.mobility||70)/100;
        const balance = (stats.balance||70)/99;
        const control = (bp.control||60)/100;
        const centerAffinity = (bp.centerAffinity||60)/100;
        const movement = (bp.movement||60)/100;

        if(s.surfaceRecovery>0){
            s.surfaceRecovery =
                Math.max(0,s.surfaceRecovery-dt);
        }

        if(s.surfaceBounce>0){
            s.surfaceBounce =
                Math.max(0,s.surfaceBounce-dt);
        }

        if(s.railExitRefractory>0){

            s.railExitRefractory =
                Math.max(0,s.railExitRefractory-dt);

            if(s.railExitRefractoryPoint){
                const dx =
                    s.x-s.railExitRefractoryPoint.x;
                const dy =
                    s.y-s.railExitRefractoryPoint.y;

                if(Math.hypot(dx,dy)>0.12){
                    s.railExitRefractory=0;
                    s.railExitRefractoryPoint=null;
                }
            }
        }

        if(s.railEngaged){
            updateNewXRailRide(s,dt);
            return;
        }

        /*
          Surface contact first.
        */
        const nearest = newXRailNearest(s.x,s.y);

        if(nearest){
            const railDistance =
                Math.sqrt(nearest.dist2);

            const contactRadius =
                0.030+s.radius*0.24;

            if(
                railDistance<=contactRadius &&
                s.railExitRefractory<=0
            ){

                if(!tryNewXRailEngagement(s)){
                    bounceOffRail(s,nearest);
                }

                if(s.railEngaged) return;
            }
        }

        /*
          Existing velocity moves the Bey.
          We intentionally DO NOT inject a permanent orbital speed.
        */
        s.x += s.vx*dt*60;
        s.y += s.vy*dt*60;

        /*
          The X Exit is a physical opening only for a Bey that is actually
          transitioning from the rail. Normal free movement cannot simply
          phase through the mouth.
        */
        {
            const exitPoint =
                newXRailPointAtDistance(
                    getNewXRailGeometry().exitDistance
                );

            const exitDx = s.x-exitPoint.x;
            const exitDy = s.y-exitPoint.y;
            const exitDist = Math.hypot(exitDx,exitDy);

            if(
                exitDist < 0.105 &&
                s.y < exitPoint.y+0.040 &&
                s.vy < 0
            ){
                s.y = exitPoint.y+0.040;
                s.vy = -s.vy*0.22;
                s.surfaceRecovery = 0.14;
                s.rpm = clamp(s.rpm-0.0015,0,1);
            }
        }

        /*
          Spin/precession is an acceleration, not a circular path.
          Its influence fades smoothly with RPM.
        */
        const r = Math.hypot(s.x,s.y);

        if(r>0.02 && rpm>0.01){

            const invR = 1/r;

            const spinSign =
                s.spinDirection===-1 ? 1 : -1;

            const tangentX =
                s.y*invR*spinSign;

            const tangentY =
                -s.x*invR*spinSign;

            const spinForce =
                (
                    0.00014 +
                    movement*0.00030
                ) *
                Math.pow(rpm,1.20) *
                (
                    0.55 +
                    control*0.45
                );

            s.vx +=
                tangentX*spinForce*dt*60;

            s.vy +=
                tangentY*spinForce*dt*60;
        }

        /*
          Stadium slope gently favors the center.
          It becomes more relevant as spin falls because the Bey has less
          self-generated lateral movement.
        */
        if(r>0.015){

            const slopeForce =
                (
                    0.00024 +
                    centerAffinity*0.00042
                ) *
                (
                    0.55 +
                    (1-rpm)*0.55
                );

            s.vx -= s.x*slopeForce*dt*60;
            s.vy -= s.y*slopeForce*dt*60;
        }

        /*
          Physical friction.

          This is the major correction for the "too much momentum forever"
          problem. Velocity decays independently of RPM.
        */
        const baseFriction =
            0.982 +
            control*0.008 -
            movement*0.004;

        const rpmFrictionBonus =
            0.004*rpm;

        const friction =
            clamp(
                baseFriction+rpmFrictionBonus,
                0.972,
                0.992
            );

        const frictionStep =
            Math.pow(
                friction,
                dt*60
            );

        s.vx *= frictionStep;
        s.vy *= frictionStep;

        /*
          Low RPM reduces movement amplitude rather than changing spin
          direction. No reverse-spin behavior is possible.
        */
        const lowRpm =
            clamp((0.48-rpm)/0.48,0,1);

        if(lowRpm>0){

            const lateralDamp =
                Math.pow(
                    0.988,
                    lowRpm*dt*60
                );

            const rNow =
                Math.hypot(s.x,s.y);

            if(rNow>0.08){

                const ix=s.x/rNow;
                const iy=s.y/rNow;

                const radialVelocity =
                    s.vx*ix+s.vy*iy;

                const tvx =
                    s.vx-ix*radialVelocity;

                const tvy =
                    s.vy-iy*radialVelocity;

                s.vx =
                    ix*radialVelocity+
                    tvx*lateralDamp;

                s.vy =
                    iy*radialVelocity+
                    tvy*lateralDamp;
            }
        }

        /*
          Small physical disturbance.

          It is deliberately tiny. It breaks perfectly mathematical paths
          without becoming visible RNG movement.
        */
        const disturbance =
            (
                0.000012 +
                (1-control)*0.000025
            ) *
            (
                0.35 +
                (1-rpm)*0.65
            );

        s.vx +=
            (Math.random()-0.5)*
            disturbance*dt*60;

        s.vy +=
            (Math.random()-0.5)*
            disturbance*dt*60;

        /*
          Outer stadium wall.

          A hard wall hit destroys the old trajectory instead of simply
          reflecting an orbit and allowing the same orbit to continue.
        */
        const radius =
            Math.hypot(s.x,s.y);

        const wall=0.93;

        if(radius>wall){

            const nx=s.x/(radius||1);
            const ny=s.y/(radius||1);

            const outward =
                s.vx*nx+s.vy*ny;

            s.x=nx*(wall-0.002);
            s.y=ny*(wall-0.002);

            if(outward>0){

                const tangentX=-ny;
                const tangentY=nx;

                const tangent =
                    s.vx*tangentX+
                    s.vy*tangentY;

                /*
                  Hard impact:
                  - reverse outward velocity
                  - reduce it heavily
                  - preserve only some tangent
                  - create a recovery state
                */
                const restitution =
                    clamp(
                        0.16+
                        balance*0.16+
                        control*0.08,
                        0.16,
                        0.40
                    );

                const tangentRetention =
                    clamp(
                        0.52+
                        control*0.16,
                        0.52,
                        0.70
                    );

                const bouncedNormal =
                    -outward*restitution;

                s.vx =
                    nx*bouncedNormal+
                    tangentX*tangent*tangentRetention;

                s.vy =
                    ny*bouncedNormal+
                    tangentY*tangent*tangentRetention;

                s.surfaceRecovery=0.20;

                s.rpm=clamp(
                    s.rpm-
                    (0.002+
                     outward*0.025),
                    0,1
                );

                s.stability=clamp(
                    s.stability-
                    (0.004+
                     outward*0.040),
                    0,1
                );
            }
        }

        /*
          Movement drains RPM.
          RPM is spin energy, NOT a direct velocity multiplier.
        */
        const speed =
            Math.hypot(s.vx,s.vy);

        const bitDrain =
            bp.spinDrain || 1;

        const movementDrain =
            (
                0.00016+
                movement*0.00024+
                speed*0.00042
            ) *
            bitDrain *
            (0.65+rpm*0.35);

        const tiltDrain =
            s.launchRpmLossMultiplier||1;

        s.rpm =
            clamp(
                s.rpm-
                movementDrain*
                tiltDrain*
                dt*60,
                0,1
            );

        /*
          Stability:
          healthy spin can recover a little;
          speed and impacts consume it.
        */
        const recovery =
            (bp.recovery||60)/100;

        s.stability =
            clamp(
                s.stability+
                0.00024*
                recovery*
                rpm*
                dt*60 -
                (
                    0.00008+
                    speed*0.0011+
                    (1-rpm)*0.00030
                )*
                dt*60,
                0,1
            );
    };


    /*
      The old V5 exit barrier was a timed/scripted protection layer.
      Replace it with a narrow physical wall around the sides of the exit.
      The exit itself is handled by the rail, not by a global cooldown.
    */
    window.enforceXRailExitBarrier = function(s){

        if(s.railEngaged) return;

        const exit =
            newXRailPointAtDistance(
                getNewXRailGeometry().exitDistance
            );

        const ax=Math.abs(s.x);

        const halfWidth=0.133;
        const edgeY=-0.790;
        const apexY=exit.y;

        /*
          Only block the two physical side walls of the X Exit.
          Do not create a blanket "you cannot approach here" zone.
        */
        if(ax>=halfWidth) return;

        const boundaryY =
            apexY-
            (
                Math.abs(edgeY-apexY)*
                (1-ax/halfWidth)
            );

        const clearance =
            s.radius*0.72;

        if(s.y<boundaryY+clearance){

            s.y=boundaryY+clearance;

            if(s.vy<0){

                s.vy =
                    -s.vy*0.20;

                s.surfaceRecovery=0.12;
            }
        }
    };

})();
