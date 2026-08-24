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

function clamp01(v){
  return Math.max(0,Math.min(1,Number(v)||0));
}

function bitOrbitClass(bitName,bitType,movement){
  const name=String(bitName||"").toLowerCase();
  const type=String(bitType||"").toLowerCase();
  if(name==="kick"||name==="taper") return "hybrid";
  if(name==="point"||name==="level") return "gimmick";
  if(type==="attack") return "attack";
  if(type==="defense"||type==="stamina"||type==="balance") return "stable";
  return (Number(movement)||0)>=0.80?"attack":"stable";
}

function attackOrbitBase(movement,centerAffinity,bitStability){
  const move=clamp01(movement);
  const center=clamp01(centerAffinity);
  const stab=clamp01(bitStability);
  /*
    High-RPM Attack lives on the X-Rail ring. They should be wide enough
    to kiss the rail, not parked in the mid bowl. RPM contraction — not
    this base — is what walks them in after the opening laps.
  */
  return Math.max(0.76,Math.min(0.84,
    0.78+
    (1-center)*0.04+
    (move-0.80)*0.05+
    (1-stab)*0.02
  ));
}

function stableOrbitBase(movement,centerAffinity){
  const move=clamp01(movement);
  const center=clamp01(centerAffinity);
  /*
    A real launch circle — smaller than Attack, not a parked center pin.
    RPM contraction (not this base) is what walks them in.
  */
  return Math.max(0.28,Math.min(0.40,
    0.30+
    move*0.08+
    (1-center)*0.04
  ));
}

function orbitRpmFactor(spin,kind){
  const s=Math.max(0.12,clamp01(spin));
  /*
    Attack is rail-wide at full spin. By ~65% RPM it should already sit
    inside the rail ring — a little tighter, not still rail-wide — so
    tired Attack bits cannot cruise the X-Rail all match.
  */
  if(kind==="attack") return 0.40+0.60*Math.pow(s,1.70);
  if(kind==="hybrid") return 0.42+0.58*Math.pow(s,1.45);
  /*
    Non-Attack stays a little wider through high RPM, then drops hard
    into a tight center so two stamina Beys can actually meet.
  */
  return 0.08+0.70*Math.pow(s,1.20);
}

function bitOrbitProfile(opts){
  opts=opts||{};
  const movement=Number.isFinite(opts.movement)?opts.movement:0.60;
  const center=Number.isFinite(opts.centerAffinity)?opts.centerAffinity:0.60;
  const stab=Number.isFinite(opts.bitStability)?opts.bitStability:0.60;
  const rpm=clamp01(opts.rpm);
  const gimmick=clamp01(opts.attackGimmick);
  const klass=bitOrbitClass(opts.bitName,opts.bitType,movement);
  const attack=attackOrbitBase(Math.max(movement,0.80),center,stab)*orbitRpmFactor(rpm,"attack");
  const stable=stableOrbitBase(movement,center)*orbitRpmFactor(rpm,"stable");
  let home;
  let attackWeight;

  if(klass==="attack"){
    const rideShrink=Math.min(0.05,(Number(opts.railUses)||0)*0.018);
    home=Math.max(0.30,Math.min(0.84,attack-rideShrink));
    attackWeight=1;
  }else if(klass==="hybrid"){
    const mix=String(opts.bitName||"").toLowerCase()==="kick"?0.58:0.42;
    home=Math.max(0.22,Math.min(0.70,stable*(1-mix)+attack*mix));
    attackWeight=mix;
  }else if(klass==="gimmick"){
    const mix=0.14+0.72*gimmick;
    const openRpm=Math.max(rpm,0.50+0.50*gimmick);
    const attackOpen=attackOrbitBase(Math.max(movement,0.80),center,stab)*orbitRpmFactor(openRpm,"attack");
    home=Math.max(0.12,Math.min(0.38,stable*(1-mix)+attackOpen*mix));
    attackWeight=mix;
  }else{
    home=Math.max(0.06,Math.min(0.36,stable));
    attackWeight=0.08;
  }

  const omega=
    (0.062*(1-attackWeight)+0.090*attackWeight)*
    (0.60+0.40*rpm);

  return {
    class:klass,
    attackWeight,
    home,
    omega,
    slopeGain:0.032-0.006*attackWeight,
    radialFollow:0.07+0.03*attackWeight,
    radialBleed:0.988-0.008*attackWeight
  };
}

function homeOrbitRadius(movement,centerAffinity,bitStability,rpm,opts){
  return bitOrbitProfile(Object.assign({
    movement,centerAffinity,bitStability,rpm
  },opts||{})).home;
}

function orbitOmega(movement,rpm,opts){
  return bitOrbitProfile(Object.assign({
    movement,rpm
  },opts||{})).omega;
}

function step(s,dt,ctx){
/*
  MODULE BOUNDARY:
  movement-engine.js has its own scope. Every value originating in
  app.js is supplied through ctx. It must never read an app.js local.
*/
ctx=ctx||{};
const clamp=ctx.clamp;
const getSpinTangent=ctx.getSpinOrbitTangent;
const enforceDirection=ctx.enforcePostImpactSpinDirection;

if(
  typeof clamp!=="function" ||
  typeof getSpinTangent!=="function" ||
  typeof enforceDirection!=="function"
){
  throw new Error("Movement engine missing physics context");
}

const rpm=Number.isFinite(ctx.rpm) ? ctx.rpm : newBattleClampLocal(s.rpm,0,1);
const centerAffinity=Number.isFinite(ctx.centerAffinity) ? ctx.centerAffinity : 0.60;
const movement=Number.isFinite(ctx.movement) ? ctx.movement : 0.60;
const bitStability=Number.isFinite(ctx.bitStability) ? ctx.bitStability : 0.60;
const balance=Number.isFinite(ctx.balance) ? ctx.balance : 0.70;
const control=Number.isFinite(ctx.control) ? ctx.control : 0.60;
const stamina=Number.isFinite(ctx.stamina) ? ctx.stamina : 0.70;
const bitPrecession=Number.isFinite(ctx.bitPrecession) ? ctx.bitPrecession : 0.50;
const bitFriction=Number.isFinite(ctx.bitFriction) ? ctx.bitFriction : 0.60;
const bp=ctx.bp||{};
const physicalSpeedTarget=Number.isFinite(ctx.physicalSpeedTarget)
  ? ctx.physicalSpeedTarget
  : 0.025;

const staminaEfficiency=Number.isFinite(ctx.staminaEfficiency)
  ? ctx.staminaEfficiency
  : 1;

function newBattleClampLocal(v,a,b){return Math.max(a,Math.min(b,v));}


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
    clamp(
        (s.impactMomentumState||0)-dt*0.72,
        0,1
    );

const rNow=Math.hypot(s.x,s.y);

/*
  MOVEMENT ENGINE OWNERSHIP:
  mobility belongs to the Bey state/stat sheet. It is NOT a local
  variable from app.js, because this file runs in its own function
  scope. Reading it directly used to cause:
      ReferenceError: mobility is not defined
  on the first physics frame.
*/
const mobilityStat=
    Number(
        s.mobility ??
        (s.stats && s.stats.mobility) ??
        70
    );

const mobilityResponse=
    0.55+0.45*clamp(mobilityStat/100,0,1);

const orbit=bitOrbitProfile({
    movement,
    centerAffinity,
    bitStability,
    rpm,
    bitName:ctx.bitName||s.bitName||(s.bit&&s.bit.name)||"",
    bitType:ctx.bitType||s.bitType||(s.bit&&s.bit.type)||"",
    attackGimmick:Number.isFinite(ctx.attackGimmick)
        ? ctx.attackGimmick
        : (Number(s.dynamicBitAggression)||0),
    railUses:Number(s.railUses)||0
});
const preferredRadius=orbit.home;
const attackWeight=orbit.attackWeight;
const attackLike=attackWeight>=0.70;
const orbitSteeringAvailability=clamp(
    1-(attackLike?1.05:1.10)*s.impactMomentumState,
    attackLike?0.18:0.22,
    1
);

/*
  Speed is owned by launch + RPM (physicalSpeedTarget), not by a
  scripted r*omega ring. Home radius is only a soft radial tendency.
*/
const orbitSpeedFraction=
    (attackLike ? 0.62 : 0.38)+
    0.28*movement+
    0.10*(1-centerAffinity);
const orbitSpeedTightness=attackLike
    ? 1
    : 0.34+0.66*Math.max(0.12,preferredRadius/0.52);
const targetOrbitSpeed=
    physicalSpeedTarget*
    orbitSpeedFraction*
    (0.72+0.28*(s.movementEnergy||1))*
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
    getSpinTangent(
        radialX,
        radialY,
        s.spinDirection
    );

const tangentX=spinTangent.x;
const tangentY=spinTangent.y;

if((s.centerLaunchWindup||0)>0){
    s.centerLaunchWindup=Math.max(0,(s.centerLaunchWindup||0)-dt);
}
const centerWinding=
    (s.centerLaunchWindup||0)>0 &&
    s.launchPlan &&
    s.launchPlan.technique==="Center";

/*
  CENTER-LAUNCH START
  -------------------
  A Center launch begins with almost no translational velocity. A
  Bit/stadium contact response must therefore establish a small
  initial velocity. This changes velocity only; position remains
  untouched. During wind-up, feed the orbit gradually so they curve
  into the ring instead of getting thrown on a random heading.
*/
if(
    Math.hypot(s.vx,s.vy)<0.0028 &&
    rpm>0.22 &&
    !s.railEngaged &&
    (s.impactMomentumState||0)<0.12 &&
    (s.railExitRefractory||0)<=0 &&
    !(s.surfaceRecovery>0 && s.lastImpactForce>0.006)
){
    const seedStrength=
        targetOrbitSpeed*
        (centerWinding?0.18:0.70)*
        mobilityResponse;

    s.vx+=tangentX*seedStrength;
    s.vy+=tangentY*seedStrength;
}

/*
  LOCAL VELOCITY RESPONSE — cartesian blend, not polar rewrite.
  Nudge current vx/vy toward a desired tangent+radial. After a hit,
  orbitSteeringAvailability starves this so knockback keeps flying.
*/
const impactHold=s.impactMomentumState||0;
const radialGain=attackLike ? 0.14 : 0.26;
const desiredRadialSpeed=
    clamp(
        (preferredRadius-rNow)*radialGain,
        attackLike ? -0.014 : -0.020,
        centerWinding
            ? (attackLike ? 0.006 : 0.005)
            : (attackLike ? 0.014 : 0.016)
    );
const desiredVX=
    tangentX*targetOrbitSpeed+
    radialX*desiredRadialSpeed;
const desiredVY=
    tangentY*targetOrbitSpeed+
    radialY*desiredRadialSpeed;
const responseRate=
    (
        (attackLike ? 0.022 : 0.018)+
        control*0.014+
        bitPrecession*0.006+
        movement*0.004
    )*
    (0.42+0.58*rpm)*
    mobilityResponse;
const responseAmount=clamp(
    responseRate*dt*60*Math.max(attackLike?0.05:0.04,orbitSteeringAvailability)*
    (centerWinding?1.55:1),
    0,
    attackLike ? (centerWinding?0.070:0.048) : (centerWinding?0.074:0.056)
);
s.vx+=(desiredVX-s.vx)*responseAmount;
s.vy+=(desiredVY-s.vy)*responseAmount;

/*
  Planted stadium. Soft bowl pull toward the home ring so a bounce
  settles back into orbit instead of skating, without rewriting heading.
  After a hit the bowl eases off so knockback can actually move them.
*/
if(rNow>0.08 && !(s.xrailExitRampActive) && (s.railExitRefractory||0)<=0){
    const bowlGain=attackLike
        ? (impactHold>0.12?0.0018:0.0032)
        : (impactHold>0.12?0.0022:0.0042);
    const bowl=clamp(
        (rNow-preferredRadius)*bowlGain,
        attackLike?-0.0010:-0.0014,
        attackLike?0.0036:0.0044
    );
    s.vx-=radialX*bowl;
    s.vy-=radialY*bowl;
}

/*
  LOW RPM
  -------
  No hard "stop orbiting" switch. As RPM falls, target speed and
  preferred radius have already contracted. A small additional
  lateral damping prevents a dying Bey from retaining an attack-like
  sweep while preserving radial momentum after impacts.
*/
/*
  Non-Attack Bits can shed leftover sweep as they die.
  Attack Bits keep their tangent — only a near-dead Attack bit
  gets a light trim, never enough to collapse the orbit into a line.
*/
if(rpm<0.52 && attackWeight<0.70 && (s.impactMomentumState||0)<0.18){
    const lowRpm=
        clamp(
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
}else if(rpm<0.18 && attackWeight>=0.70){
    const dying=clamp((0.18-rpm)/0.18,0,1);
    const currentR=Math.hypot(s.x,s.y);
    if(currentR>0.045){
        const ix=s.x/currentR;
        const iy=s.y/currentR;
        const rv=s.vx*ix+s.vy*iy;
        const tvx=s.vx-ix*rv;
        const tvy=s.vy-iy*rv;
        const damp=Math.pow(0.988, dying*dt*60);
        s.vx=ix*rv+tvx*damp;
        s.vy=iy*rv+tvy*damp;
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
if(impactHold<=0.16 && !centerWinding){
const disturbance =
    (
        0.000026 +
        (1-control)*0.000040 +
        (1-attackWeight)*0.000018
    ) *
    (
        0.45 +
        (1-rpm)*0.55
    );

s.vx +=
    (Math.random()-0.5)*
    disturbance*dt*60;

s.vy +=
    (Math.random()-0.5)*
    disturbance*dt*60;
}

/*
  Final free-space spin-direction projection.
  All free-space forces are complete. This removes ONLY an
  opposite-spin tangential component; it does not add orbit speed.
  Skip while knockback owns the path — stripping the "wrong" tangent
  as the Bey flies is the post-hit wiggle.
*/
if(impactHold<=0.10){
    enforceDirection(s);
}

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

    /*
      Finish openings sit on the lower rim. A real outward knock that
      reaches that lip can leave the bowl; a normal orbit still bounces.
    */
    const inXtremeGate=s.y>=0.58 && Math.abs(s.x)<=0.26;
    const inPocketGate=s.y>=0.54 && Math.abs(s.x)>=0.50;
    const finishEscape=
        outward>0.0054 &&
        radius>=0.68 &&
        radius<=1.08 &&
        (s.lastImpactForce||0)>=0.0046 &&
        (s.impactMomentumState||0)>0.22 &&
        (inXtremeGate||inPocketGate);

    if(finishEscape){
        s.finishLipContact={
            zone:inXtremeGate?"Xtreme":"Over",
            speed:Math.hypot(s.vx,s.vy),
            outward,
            force:s.lastImpactForce||0
        };
    }else{
    s.x=nx*(wall-0.002);
    s.y=ny*(wall-0.002);

    if(outward>0){
        const incomingWall=Math.hypot(s.vx,s.vy);

        /*
          Use the authoritative spin-direction tangent. The old
          (-ny, nx) tangent is always clockwise in screen coordinates
          and could inject a clockwise component into a right-spin Bey
          after a wall impact.
        */
        const spinTangent=
            getSpinTangent(
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
          Bounce off the wall. Keep most of the speed so this is not a
          dead stop that then snaps back onto an orbit.
        */
        const wallImpactQuality=
            clamp(outward/0.045,0,2.2);

        const restitution=
            clamp(
                0.36+
                balance*0.12+
                control*0.06+
                wallImpactQuality*0.04+
                ((s.mass||1)-1)*0.02,
                0.34,0.56
            );

        const tangentRetention =
            clamp(
                0.70+
                control*0.14,
                0.70,
                0.88
            );

        const bouncedNormal =
            -outward*restitution;

        s.vx =
            nx*bouncedNormal+
            tangentX*tangent*tangentRetention;

        s.vy =
            ny*bouncedNormal+
            tangentY*tangent*tangentRetention;

        const bouncedSpeed=Math.hypot(s.vx,s.vy);
        const wallFloor=Math.max(0.022,incomingWall*0.62);
        if(bouncedSpeed<wallFloor){
            const boost=wallFloor/Math.max(bouncedSpeed,1e-8);
            s.vx*=boost;
            s.vy*=boost;
        }
        s.impactMomentumState=Math.max(s.impactMomentumState||0,0.42);

        s.surfaceRecovery=0.20;
        s.tiltLevel=clamp(
            (s.tiltLevel||0)+0.06+outward*0.25,
            0,1
        );
        s.motionPhase+=0.45+Math.random()*0.40;

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
        s.axisStability=clamp(
            (s.axisStability||0.70)-
            (0.015+outward*0.08),
            0.15,1
        );
        s.movementEnergy=clamp(
            (s.movementEnergy||1)-
            (0.018+outward*0.18),
            0.18,1
        );

        /*
          Apply the existing one-shot direction contract immediately
          after a wall impact. This is not a per-frame controller.
        */
        enforceDirection(s);
    }
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
    clamp(
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
    clamp(
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
    version:"1.3.3",
    step,
    homeOrbitRadius,
    orbitOmega,
    bitOrbitProfile
};

})(typeof window!=="undefined" ? window : globalThis);
