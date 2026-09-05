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

/*
  Phone Low Power Mode is the feel target: one 60Hz tick.
  Blend/cut values are authored per 1/60s frame. Convert so a
  different dt does not snap or plant harder.
*/
function frameScale(dt){
  return Math.max(0,Number(dt)||0)*60;
}
function frameBlend(perFrameAt60,dt){
  const k=clamp01(perFrameAt60);
  const t=frameScale(dt);
  if(k<=0||t<=0) return 0;
  if(Math.abs(t-1)<1e-9) return k;
  return 1-Math.pow(1-k,t);
}

function bitOrbitClass(bitName,bitType,movement){
  const name=String(bitName||"").toLowerCase();
  const type=String(bitType||"").toLowerCase();
  if(name==="kick") return "hybrid";
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
  return Math.max(0.72,Math.min(0.78,
    0.74+
    (1-center)*0.03+
    (move-0.80)*0.04+
    (1-stab)*0.015
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
  const raw=clamp01(spin);
  /*
    Attack stays wide at full spin so they can still kiss and ride
    the X-Rail. The drop-off is the nerf, not the opening ring.
    By 80% RPM they are still Attack-wide (can hook) but a bit
    inside a fresh launch. By 50% RPM they sit under the
    X-Rail/X-Exit so laps miss the ring. By the last 20% RPM they
    pull into a tight ring like Non-Attack, with leftover width.
  */
  if(kind==="attack"){
    const s=Math.max(0.12,raw);
    if(s>=0.80) return 0.90+0.10*((s-0.80)/0.20);
    if(s>=0.50) return 0.70+0.20*((s-0.50)/0.30);
    if(s>=0.20) return 0.32+0.38*((s-0.20)/0.30);
    return 0.22+0.10*(s/0.20);
  }
  if(kind==="hybrid"){
    const s=Math.max(0.08,raw);
    if(s>=0.30) return 0.16+0.84*((s-0.30)/0.70);
    return 0.08+0.08*(s/0.30);
  }
  /*
    Non-Attack: full/mid spin is an inner ring. By 30% RPM they sit
    on the center pin so two tanks actually meet.
  */
  if(raw>=0.30) return 0.06+0.52*((raw-0.30)/0.70);
  return 0.035+0.025*(raw/0.30);
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
    const floor=rpm>=0.22?0.26:0.14;
    home=Math.max(floor,Math.min(0.78,attack-rideShrink));
    attackWeight=1;
  }else if(klass==="hybrid"){
    const mix=String(opts.bitName||"").toLowerCase()==="kick"?0.58:0.42;
    const floor=rpm>=0.30?0.16:0.07;
    home=Math.max(floor,Math.min(0.70,stable*(1-mix)+attack*mix));
    attackWeight=mix;
  }else if(klass==="gimmick"){
    const mix=0.14+0.72*gimmick;
    const attackOpen=attackOrbitBase(Math.max(movement,0.80),center,stab)*orbitRpmFactor(rpm,"attack");
    home=Math.max(0.05,Math.min(0.38,stable*(1-mix)+attackOpen*mix));
    attackWeight=mix;
  }else{
    home=Math.max(0.045,Math.min(0.28,stable));
    attackWeight=0.08;
  }
  /*
    By 30% RPM every Non-Attack bit occupies the center so two tired
    tanks clash instead of circling past each other.
  */
  if(klass!=="attack"){
    const tight=klass==="hybrid"?0.08:0.055;
    if(rpm<=0.30){
      home=Math.min(home, tight+(klass==="gimmick"?0.025:0.012));
    }else if(rpm<0.55){
      const fade=(0.55-rpm)/0.25;
      home=home*(1-fade)+Math.min(home,tight+0.02)*fade;
    }
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
    0.50+0.56*clamp(mobilityStat/100,0,1);

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
let preferredRadius=orbit.home;
const attackWeight=orbit.attackWeight;
const attackLike=attackWeight>=0.70;
/*
  Existing bit traits decide how planted a settle feels. Ball/Orb
  (high friction, high center, low movement) still sit heavier than
  Point/Level. This is not a second knock layer.
*/
let plant=clamp(
    bitFriction*0.40+
    centerAffinity*0.35+
    (1-clamp(movement,0,1))*0.25,
    0,1
);
/*
  Ball was rubber-banding smashes back to the pin. Keep the short
  stamina ring; ease the glue so a real knock can travel.
*/
const bitNameNow=String(ctx.bitName||s.bitName||(s.bit&&s.bit.name)||"").toLowerCase();
if(bitNameNow==="ball") plant*=0.82;
/*
  A real collision owns the trajectory briefly. Attack sheds hit-stun
  a little faster so it can re-hook the rail. Non-Attack keeps the
  shove longer so the ring cannot rubber-band them back first.
*/
s.impactMomentumState=
    clamp(
        (s.impactMomentumState||0)-dt*(attackLike?0.72:0.48),
        0,1
    );
const orbitSteeringAvailability=clamp(
    1-(attackLike?1.05:1.32)*s.impactMomentumState,
    attackLike?0.18:0.07,
    1
);

if((s.centerLaunchWindup||0)>0){
    s.centerLaunchWindup=Math.max(0,(s.centerLaunchWindup||0)-dt);
}
const centerWinding=
    (s.centerLaunchWindup||0)>0 &&
    s.launchPlan &&
    s.launchPlan.technique==="Center";
/*
  Non-Attack Center starts a bit wide (under the X-Rail), then walks
  in. Ball stays shorter/tighter than Point. Never mix out to rail.
*/
if(!attackLike && centerWinding){
    const open=Math.min(0.50, 0.36+0.14*(1-plant));
    const wind=clamp((s.centerLaunchWindup||0)/1.55, 0, 1);
    preferredRadius=preferredRadius*(1-wind)+open*wind;
}

/*
  Speed is owned by launch + RPM (physicalSpeedTarget), not by a
  scripted r*omega ring. Home radius is only a soft radial tendency.
*/
const orbitSpeedFraction=
    (attackLike ? 0.62 : 0.38)+
    0.28*movement+
    0.10*(1-centerAffinity);
const orbitSpeedTightness=attackLike
    ? clamp(0.60+0.40*(preferredRadius/0.76),0.60,1)
    : Math.min(1,0.34+0.66*Math.max(0.12,preferredRadius/0.52));
let targetOrbitSpeed=
    physicalSpeedTarget*
    orbitSpeedFraction*
    (0.72+0.28*(s.movementEnergy||1))*
    orbitSpeedTightness;
const windingHome=preferredRadius;
if(centerWinding && !attackLike){
    /*
      A Center launch starts in the middle. Giving a stamina/defense
      Bit a full ring speed there slings it out to the X-Rail like
      Attack. Grow speed with current radius so it winds into its
      own home ring, then tightens.
    */
    const ring=Math.max(0.16, Math.min(preferredRadius, 0.48));
    targetOrbitSpeed*=clamp(rNow/ring, 0.22, 1);
}else if(attackLike){
    const ring=Math.max(0.28,preferredRadius);
    if(rNow>ring) targetOrbitSpeed*=clamp(ring/rNow, rpm<0.80?0.42:0.50, 1);
    else targetOrbitSpeed*=clamp(rNow/ring,0.52,1);
}

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
        (centerWinding?(attackLike?0.18:0.10):0.70)*
        mobilityResponse*
        frameScale(dt);

    s.vx+=tangentX*seedStrength;
    s.vy+=tangentY*seedStrength;
}

/*
  LOCAL VELOCITY RESPONSE — cartesian blend, not polar rewrite.
  Nudge current vx/vy toward a desired tangent+radial. After a hit,
  orbitSteeringAvailability starves this so knockback keeps flying.
*/
const impactHold=s.impactMomentumState||0;
const steerRadius=windingHome;
const outsideHome=rNow>preferredRadius+(attackLike?0.025:0.02);
const tiredCenter=!attackLike && rpm<=0.35;
const radialGain=attackLike
    ? (outsideHome?(rpm<0.20?0.34:rpm<0.80?0.26:0.22):0.14)
    : (tiredCenter && outsideHome ? 0.36 : (0.16+0.06*plant));
const windingOutwardCap=attackLike
    ? 0.006
    : (rNow>=steerRadius-0.01 ? 0.0008 : 0.0034);
const desiredRadialSpeed=
    clamp(
        (steerRadius-rNow)*radialGain,
        attackLike ? (outsideHome ? -0.026 : -0.014) : (outsideHome ? (tiredCenter?-0.038:-0.022) : -0.012),
        centerWinding
            ? windingOutwardCap
            : (attackLike ? 0.006 : 0.016)
    );
const desiredVX=
    tangentX*targetOrbitSpeed+
    radialX*desiredRadialSpeed;
const desiredVY=
    tangentY*targetOrbitSpeed+
    radialY*desiredRadialSpeed;
const responseRate=
    (
        (attackLike ? 0.022 : 0.010)+
        control*(attackLike?0.014:0.006)+
        bitPrecession*0.006+
        movement*0.004
    )*
    (0.42+0.58*(tiredCenter?Math.max(rpm,0.58):rpm))*
    mobilityResponse;
/*
  Do not compass-lock Non-Attack onto a perfect ring. After a hit,
  yield completely so a smash can travel toward Over/Xtreme. Settle
  is a walk-in, not a rubber band.
*/
const outsideSnap=attackLike
    ? 1.85
    : (impactHold>0.12 ? 1.0 : (tiredCenter && outsideHome ? 1.70 : (1.10+0.18*plant)));
const responseK60=clamp(
    responseRate*Math.max(attackLike?0.05:0.04,orbitSteeringAvailability)*
    (centerWinding?(attackLike?1.55:0.88):1)*
    (outsideHome?outsideSnap:1),
    0,
    attackLike
        ? (centerWinding?0.070:(outsideHome?0.078:0.048))
        : (centerWinding?0.040:(outsideHome?(tiredCenter?0.080:0.052):0.022))
);
const responseAmount=frameBlend(responseK60,dt);
s.vx+=(desiredVX-s.vx)*responseAmount;
s.vy+=(desiredVY-s.vy)*responseAmount;

if(
    rNow>preferredRadius*(attackLike?1.06:1.04) &&
    !s.railEngaged &&
    (attackLike ? impactHold<0.18 : true)
){
    const outward=s.vx*radialX+s.vy*radialY;
    if(outward>0){
        const cut=clamp(
            (rNow/Math.max(0.12,preferredRadius)-(attackLike?1.06:1.04))*(attackLike?2.2:2.2),
            0,
            attackLike
                ? 0.58
                : (impactHold>0.20 ? (0.07+0.04*plant) : (0.36+0.12*plant))
        );
        const frameCut=frameBlend(cut,dt);
        s.vx-=radialX*outward*frameCut;
        s.vy-=radialY*outward*frameCut;
    }
}

/*
  Planted stadium. Soft bowl pull toward the home ring so a bounce
  settles back into orbit instead of skating, without rewriting heading.
  After a hit the bowl eases off so knockback can actually move them.
*/
if(rNow>0.08 && !(s.xrailExitRampActive) && (s.railExitRefractory||0)<=0){
    const bowlGain=attackLike
        ? (impactHold>0.12?0.0018:(outsideHome?0.022:0.0032))
        : (impactHold>0.12?0.0010:(0.0024+0.0010*plant));
    let bowl=(rNow-preferredRadius)*bowlGain;
    if(attackLike && outsideHome) bowl=Math.max(bowl,0.0034);
    bowl=clamp(
        bowl,
        attackLike?-0.0010:-0.0012,
        attackLike
            ? (outsideHome?0.012:0.0036)
            : (outsideHome?(0.0042+0.0016*plant):0.0030)
    );
    const frameBowl=bowl*frameScale(dt);
    s.vx-=radialX*frameBowl;
    s.vy-=radialY*frameBowl;
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
        (1-attackWeight)*0.000070
    ) *
    (
        0.55 +
        (1-rpm)*0.45
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
      Finish openings are the three painted holes. A real outward
      smash in that hole's wedge can leave the bowl; the rest of
      the rim stays solid.
    */
    const mouth=
        global.SpinWarsXRailEngine &&
        typeof global.SpinWarsXRailEngine.inMouthCorridor==="function"
            ? global.SpinWarsXRailEngine.inMouthCorridor(s.x,s.y)
            : null;
    const finishEscape=
        !!mouth &&
        outward>0.0048 &&
        radius>=0.68 &&
        radius<=1.08 &&
        (s.lastImpactForce||0)>=0.020 &&
        (s.impactMomentumState||0)>0.22;

    if(finishEscape){
        s.finishLipContact={
            zone:mouth.id||"Over",
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
                0.32+
                balance*0.22+
                control*0.06+
                wallImpactQuality*0.04+
                ((s.mass||1)-1)*0.02,
                0.34,0.58
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
    (0.94+Math.pow(1-rpm,1.4)*0.42);

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

const staminaRecovery=0.70+stamina*0.48;

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
    version:"1.4.6",
    step,
    homeOrbitRadius,
    orbitOmega,
    bitOrbitProfile,
    frameScale,
    frameBlend
};

})(typeof window!=="undefined" ? window : globalThis);
