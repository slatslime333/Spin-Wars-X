/*
=========================================================
SPIN WARS X — MOVEMENT ENGINE
Version 1.0 — extracted from V99.6
=========================================================

Owns the V99.6 free-space movement model only.
app.js continues to own battle orchestration, rail capture/constraint,
collisions, damage, finishes, and decisions.
*/

(function(global){
"use strict";

function step(s,dt){

/*
  MOVEMENT CORE — V99 REBUILD
  ----------------------------
  ONE free-space movement model for every Bit.

  The previous V98 movement stack had several independent systems
  writing to vx/vy: attack drive, precession force, non-attack orbit,
  center equalization and low-RPM damping. Those systems could fight
  each other in the same frame.

  V99 reduces this to one physical response:

    current momentum
         +
    Bit/stadium movement tendency
         -> desired local velocity
         -> gradual velocity response
         -> position integration

  The orbit is therefore the RESULT of the Bey carrying velocity
  around the stadium. No position is placed on a circle and no
  separate Attack/Non-Attack movement engine exists.
*/

/*
  A real collision owns the Bey's trajectory briefly. Orbit response
  fades back in as the impact momentum dissipates.
*/
s.impactMomentumState=
    newBattleClamp(
        (s.impactMomentumState||0)-dt*2.75,
        0,1
    );

const orbitSteeringAvailability=
    1-0.78*s.impactMomentumState;

const rNow=Math.hypot(s.x,s.y);
const mobilityResponse=
    0.55+0.45*newBattleClamp(mobility,0,1);

/*
  Natural orbit radius.

  CenterAffinity is a physical Bit property:
    Ball / Orb / Needle / Hexa -> tight
    Flat / Rush / Kick          -> wider

  Attack Bits receive only a continuous movement contribution from
  their Bit movement value. There is no separate attack controller.
  RPM contracts the radius smoothly as spin energy falls.
*/
const baseOrbitRadius=
    0.155+
    (1-centerAffinity)*0.39+
    (movement*0.055)+
    ((1-bitStability)*0.025);

/*
  RPM ORBIT TIGHTENING — V99.1
  -----------------------------
  V99's orbit model is working; the remaining issue is that the
  preferred radius stayed too wide for too long.

  We deliberately make the radius contraction noticeable around
  80% RPM rather than waiting until the Bey is nearly dying.

  100 RPM  -> full natural radius
  90 RPM   -> slight but visible contraction
  80 RPM   -> clear contraction
  70 RPM   -> much tighter
  50 RPM   -> strongly centered

  Attack Bits still remain wider because their BASE radius is larger.
  Non-Attack Bits therefore tighten sooner visually without needing
  a separate movement engine.
*/
/*
  BIT-SPECIFIC RPM TIGHTENING — V99.2
  ----------------------------------
  V99.1 correctly made the orbit tighten earlier, but it still used
  one RPM curve for every Bit.

  That is not how the movement should feel.

  Non-Attack Bits have a strong center preference, so their orbit
  should start collapsing toward center earlier in the spin-down.

  Attack Bits retain a wider aggressive orbit longer, but they should
  ALSO visibly tighten before they get very low on RPM.

  These are continuous curves, not "at 80% switch" rules.
*/
const isAttackMovement =
    movement>=0.80;

/*
  V99.3 — STRONGER, MORE VISIBLE RPM TIGHTENING
  -----------------------------------------------
  V99.2 was directionally correct, but the radius difference was not
  large enough to be obvious during gameplay.

  We now deliberately use different contraction profiles:

  ATTACK:
    100% = full wide orbit
     90% = clearly tighter
     80% = substantially tighter, but still wide/aggressive
     70% = tight aggressive orbit
     60% = considerably tighter again

  NON-ATTACK:
    100% = normal controlled orbit
     90% = noticeably tighter
     80% = strongly centered
     70% = very close to center
     60% = essentially stable-center movement

  The curve is still continuous. There is no hard RPM switch.
*/
/*
  V99.4 — NON-ATTACK LOW-RPM CENTER STABILIZATION
  ------------------------------------------------
  Attack movement is now considered good and is left unchanged.

  Non-Attack Bits were still visibly too wide around ~80 RPM. Their
  orbit now contracts much more aggressively through the 90→75 RPM
  region while 100 RPM remains unchanged.

  Target feel:
    100% = normal natural orbit
     90% = beginning to tighten
     80% = MUCH tighter / strongly center-stable
     70% = very tight
     60% = near-center stability

  This remains continuous; there is no hard 80-RPM switch.
*/
let rpmRadiusFactor;

if(movement>=0.80){
    /*
      ATTACK — V99.3 LOCKED
      Do not alter attack movement in this pass.
    */
    const rpmTightenFloor=0.28;
    const rpmTightenPower=1.55;

    const rpmTightenT=
        newBattleClamp(
            (rpm-rpmTightenFloor)/
            (1-rpmTightenFloor),
            0,
            1
        );

    rpmRadiusFactor=
        Math.pow(rpmTightenT,rpmTightenPower);
}else{
    /*
      NON-ATTACK — V99.4
      Much stronger contraction around the 80% RPM region.
    */
    /*
      V99.5 — stronger Non-Attack stabilization.

      The previous curve was still leaving too much lateral orbit at
      ~80 RPM. We want the transition to center to be unmistakable
      while preserving the normal high-RPM orbit.

      Approximate remaining radius:
        100 RPM = 100%
         90 RPM = ~70%
         85 RPM = ~55%
         80 RPM = ~40%
         75 RPM = ~30%
         70 RPM = ~23%
         60 RPM = ~16%

      This does NOT change the actual velocity model; it only changes
      the natural orbit-radius target used by the existing movement
      response.
    */
    const nonAttackT=
        newBattleClamp(
            (rpm-0.55)/(1-0.55),
            0,
            1
        );

    rpmRadiusFactor=
        0.12+
        0.88*Math.pow(nonAttackT,3.10);
}

const preferredRadius=
    newBattleClamp(
        baseOrbitRadius*rpmRadiusFactor,
        0.145,
        0.58
    );

/*
  The Bit's natural travel speed comes from the physical speed target
  already established above. Mobility changes how quickly the Bey can
  respond to the movement tendency; it is not a second speed source.
*/
const orbitSpeedFraction=
    0.42+
    0.24*movement+
    0.10*(1-centerAffinity);

/*
  V99.6 — ROOT FIX FOR NON-ATTACK ORBIT WIDTH
  --------------------------------------------
  The previous versions changed preferredRadius, but the Bey was
  still being given nearly the same tangential target speed.

  That is why the visual orbit barely changed.

  An orbital path is approximately:
      radius ≈ tangential speed / turning rate

  So changing ONLY the radius target is not enough. Non-Attack Bits
  must also lose tangential travel speed as their RPM falls.

  Attack remains untouched.

  At 100% RPM the factor is 1.0.
  As Non-Attack preferred radius contracts, its tangential target
  speed contracts with it. This makes the orbit physically converge
  instead of merely telling the radial controller where the Bey
  should be.
*/
let orbitSpeedTightness=1.0;

if(movement<0.80){
    /*
      Keep a small amount of movement at low RPM so the Bey does not
      become a frozen dot. The majority of the contraction comes from
      the same radius factor already used above.
    */
    orbitSpeedTightness=
        0.34+
        0.66*rpmRadiusFactor;
}

const targetOrbitSpeed=
    physicalSpeedTarget*
    orbitSpeedFraction*
    (0.72+0.28*s.movementEnergy)*
    orbitSpeedTightness;

/*
  Authoritative direction convention:
  RIGHT spin = counter-clockwise.
  LEFT spin  = clockwise.

  This is the same helper used by X-Rail and post-impact direction
  protection. No other CW/CCW calculation is permitted here.
*/
let radialX,radialY;

if(rNow>0.045){
    radialX=s.x/rNow;
    radialY=s.y/rNow;
}else{
    /*
      At exact center there is no usable position vector. The Bey's
      persistent phase only chooses the initial contact direction.
      Once it leaves center, the real position becomes authoritative.
    */
    const seedAngle=
        Number.isFinite(s.nonAttackOrbitAngle)
            ? s.nonAttackOrbitAngle
            : (s.motionPhase||0);

    radialX=Math.cos(seedAngle);
    radialY=Math.sin(seedAngle);
}

const spinTangent=
    getSpinOrbitTangent(
        radialX,
        radialY,
        s.spinDirection
    );

const tangentX=spinTangent.x;
const tangentY=spinTangent.y;

/*
  CENTER-LAUNCH START
  -------------------
  A Center launch begins with almost no translational velocity. A
  Bit/stadium contact response must therefore establish a small
  initial velocity. This changes velocity only; position remains
  untouched.
*/
if(
    Math.hypot(s.vx,s.vy)<0.0028 &&
    rpm>0.22 &&
    !s.railEngaged &&
    !(s.surfaceRecovery>0 && s.lastImpactForce>0.006)
){
    const seedStrength=
        targetOrbitSpeed*
        0.70*
        mobilityResponse;

    s.vx+=tangentX*seedStrength;
    s.vy+=tangentY*seedStrength;
}

/*
  LOCAL VELOCITY RESPONSE
  ------------------------
  Instead of adding a permanent tangent acceleration, calculate the
  local velocity a healthy Bit wants from its current radius and spin.

  Radial velocity is derived from the radius error. Tangential velocity
  comes from the Bit's natural movement speed. We then blend the CURRENT
  velocity toward that local physical response.

  This gives us a real curved trajectory while preserving momentum and
  allowing collisions to take control immediately after impact.
*/
const desiredRadialSpeed=
    newBattleClamp(
        (preferredRadius-rNow)*0.42,
        -0.028,
        0.028
    );

const desiredVX=
    tangentX*targetOrbitSpeed+
    radialX*desiredRadialSpeed;

const desiredVY=
    tangentY*targetOrbitSpeed+
    radialY*desiredRadialSpeed;

const responseRate=
    (
        0.055+
        control*0.030+
        bitPrecession*0.010+
        movement*0.008
    )*
    (0.45+0.55*rpm)*
    mobilityResponse;

const responseAmount=newBattleClamp(
    responseRate*dt*60*orbitSteeringAvailability,
    0,
    0.13
);

s.vx+=(desiredVX-s.vx)*responseAmount;
s.vy+=(desiredVY-s.vy)*responseAmount;

/*
  LOW RPM
  -------
  No hard "stop orbiting" switch. As RPM falls, target speed and
  preferred radius have already contracted. A small additional
  lateral damping prevents a dying Bey from retaining an attack-like
  sweep while preserving radial momentum after impacts.
*/
if(rpm<0.52){
    const lowRpm=
        newBattleClamp(
            (0.52-rpm)/0.52,
            0,
            1
        );

    const lateralDamp=Math.pow(
        0.972-0.008*bitStability,
        lowRpm*dt*60
    );

    const currentR=Math.hypot(s.x,s.y);
    if(currentR>0.045){
        const ix=s.x/currentR;
        const iy=s.y/currentR;
        const rv=s.vx*ix+s.vy*iy;
        const tvx=s.vx-ix*rv;
        const tvy=s.vy-iy*rv;

        s.vx=ix*rv+tvx*lateralDamp;
        s.vy=iy*rv+tvy*lateralDamp;
    }
}

/*
  Phase is only a tiny contact/precession state. It does not define
  the Bey's position or path.
*/
s.motionPhase +=
    dt*(0.72+rpm*1.20+movement*0.42);
s.motionPhase2 +=
    dt*(0.28+(1-rpm)*0.62);

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
  Final free-space spin-direction projection.
  All free-space forces are complete. This removes ONLY an
  opposite-spin tangential component; it does not add orbit speed.
*/
enforcePostImpactSpinDirection(s);

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

        /*
          Use the authoritative spin-direction tangent. The old
          (-ny, nx) tangent is always clockwise in screen coordinates
          and could inject a clockwise component into a right-spin Bey
          after a wall impact.
        */
        const spinTangent=
            getSpinOrbitTangent(
                s.x,
                s.y,
                s.spinDirection
            );

        const tangentX=spinTangent.x;
        const tangentY=spinTangent.y;

        const tangent=Math.max(
            0,
            s.vx*tangentX+
            s.vy*tangentY
        );

        /*
          Hard impact:
          - reverse outward velocity
          - reduce it heavily
          - preserve only some tangent
          - create a recovery state
        */
        const wallImpactQuality=
            newBattleClamp(outward/0.045,0,2.2);

        const restitution=
            newBattleClamp(
                0.12+
                balance*0.10+
                control*0.045+
                wallImpactQuality*0.035+
                ((s.mass||1)-1)*0.025,
                0.12,0.34
            );

        // Wall friction makes the impact feel planted instead of
        // turning a hard strike into a long floating glide.
        const tangentRetention =
            newBattleClamp(
                0.38+
                control*0.12,
                0.38,
                0.52
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
        s.tiltLevel=newBattleClamp(
            (s.tiltLevel||0)+0.06+outward*0.25,
            0,1
        );
        s.motionPhase+=0.45+Math.random()*0.40;

        s.rpm=newBattleClamp(
            s.rpm-
            (0.002+
             outward*0.025),
            0,1
        );

        s.stability=newBattleClamp(
            s.stability-
            (0.004+
             outward*0.040),
            0,1
        );
        s.axisStability=newBattleClamp(
            (s.axisStability||0.70)-
            (0.015+outward*0.08),
            0.15,1
        );
        s.movementEnergy=newBattleClamp(
            (s.movementEnergy||1)-
            (0.018+outward*0.18),
            0.18,1
        );

        /*
          Apply the existing one-shot direction contract immediately
          after a wall impact. This is not a per-frame controller.
        */
        enforcePostImpactSpinDirection(s);
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
    newBattleClamp(
        s.rpm-
        (
            movementDrain*
            tiltDrain/
            staminaEfficiency
        )*
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

const staminaRecovery=0.78+stamina*0.34;

s.stability =
    newBattleClamp(
        s.stability+
        0.00024*
        recovery*
        staminaRecovery*
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

s.axisStability=
    newBattleClamp(
        (s.axisStability||0.70)+
        (
            bitStability*0.00020*rpm*recovery -
            (1-bitStability)*0.00010 -
            (1-rpm)*0.00016
        )*
        dt*60,
        0.15,1
    );

}

global.SpinWarsMovementEngine = {
    version:"1.0.0",
    step
};

})(typeof window!=="undefined" ? window : globalThis);
