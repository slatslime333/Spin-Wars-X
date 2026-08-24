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
  return Math.max(0.74,Math.min(0.82,
    0.76+
    (1-center)*0.04+
    (move-0.80)*0.06+
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
  return Math.max(0.34,Math.min(0.46,
    0.36+
    move*0.10+
    (1-center)*0.05
  ));
}

function orbitRpmFactor(spin,kind){
  const s=Math.max(0.12,clamp01(spin));
  /*
    Attack stays on the rail ring through high/mid RPM and only walks
    in a decent amount once spin is actually falling off. The previous
    curve dumped them to mid-bowl by ~70%.
  */
  if(kind==="attack") return 0.58+0.42*Math.pow(s,1.12);
  if(kind==="hybrid") return 0.44+0.56*Math.pow(s,1.40);
  return 0.36+0.64*Math.pow(s,2.00);
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
    const rideShrink=Math.min(0.08,(Number(opts.railUses)||0)*0.035);
    home=Math.max(0.28,Math.min(0.82,attack-rideShrink));
    attackWeight=1;
  }else if(klass==="hybrid"){
    const mix=String(opts.bitName||"").toLowerCase()==="kick"?0.58:0.42;
    home=Math.max(0.22,Math.min(0.70,stable*(1-mix)+attack*mix));
    attackWeight=mix;
  }else if(klass==="gimmick"){
    const mix=0.14+0.72*gimmick;
    const openRpm=Math.max(rpm,0.50+0.50*gimmick);
    const attackOpen=attackOrbitBase(Math.max(movement,0.80),center,stab)*orbitRpmFactor(openRpm,"attack");
    home=Math.max(0.16,Math.min(0.54,stable*(1-mix)+attackOpen*mix));
    attackWeight=mix;
  }else{
    home=Math.max(0.16,Math.min(0.46,stable));
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
    slopeGain:0.055-0.012*attackWeight,
    radialFollow:0.12+0.04*attackWeight,
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
        (s.impactMomentumState||0)-dt*0.62,
        0,1
    );

const orbitSteeringAvailability=
    1-0.86*s.impactMomentumState;

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
const omega=orbit.omega;
const attackWeight=orbit.attackWeight;

/*
  Hold the circle you are actually on. Giving a center launch the
  outer-ring speed is what slammed Attack into the X-Rail and left
  stamina looking parked. Too wide and too fast: slow down so the
  bowl walks them in. Too tight: a little extra tangent to spiral out.
*/
const circleR=Math.max(0.07,rNow);
let targetOrbitSpeed;
if(circleR<preferredRadius){
    targetOrbitSpeed=Math.max(
        0.008,
        circleR*omega+(preferredRadius-circleR)*(0.004+0.010*attackWeight)
    );
}else{
    /*
      Stay on the home ring. Keeping r*omega outside home is what walked
      Attack into the wall. A short linger just outside home lets Attack
      hold width; far outside, drop to home speed so the bowl can walk in.
    */
    const over=Math.min(1,(circleR-preferredRadius)/0.14);
    const linger=(0.06+0.16*attackWeight)*(1-over);
    targetOrbitSpeed=Math.max(
        0.008,
        preferredRadius*omega*(1-linger)+circleR*omega*linger
    );
}

if((s.impactMomentumState||0)>0.18){
    /*
      A hit must not stall them down to cruise and then wind a new
      orbit. Keep the carried speed; only clip rocket launches.
    */
    const hitSpeed=Math.hypot(s.vx,s.vy);
    targetOrbitSpeed=Math.max(
        targetOrbitSpeed,
        Math.min(hitSpeed,0.090)
    );
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
  untouched.
*/
if(
    Math.hypot(s.vx,s.vy)<0.0028 &&
    rpm>0.22 &&
    !s.railEngaged &&
    (s.impactMomentumState||0)<0.12 &&
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
const impactHold=s.impactMomentumState||0;
const inImpact=impactHold>0.22;
const tangentFollow=inImpact?0.035:0.18;
const radialFollow=inImpact?0.03:orbit.radialFollow;
const follow=
    orbitSteeringAvailability*
    mobilityResponse*
    (0.85+control*0.15);
const tangentBlend=clamp(tangentFollow*follow,0,0.45);
const radialBlend=clamp(radialFollow*follow,0,0.28);

const currentTangent=s.vx*tangentX+s.vy*tangentY;
const currentRadial=s.vx*radialX+s.vy*radialY;
/*
  Soft bowl slope, not a magnet. Rim gravity is stronger so a wide
  lap still feels planted instead of floating onto the rail.
*/
const slopeGain=orbit.slopeGain;
let slope=(preferredRadius-rNow)*(inImpact?0.012:slopeGain);
/*
  Rim gravity used to start at 0.68, which yanked Attack off the
  X-Rail ring. Keep the rail-width lap; only plant harder near the wall.
*/
if(rNow>0.82){
    slope-=(rNow-0.82)*(0.10+0.10*(1-attackWeight));
}
if(rNow>0.90){
    slope-=(rNow-0.90)*0.22;
}
if(!inImpact && rNow>preferredRadius && currentRadial<-0.002){
    slope*=0.45;
}
const eulerLeak=(currentTangent*currentTangent)/Math.max(0.08,rNow);
const desiredRadialSpeed=clamp(slope,-0.012,0.005+0.007*attackWeight);
const newTangent=
    currentTangent+
    (targetOrbitSpeed-currentTangent)*
    tangentBlend;
const newRadial=inImpact
    ? currentRadial+(desiredRadialSpeed-currentRadial)*radialBlend*0.35
    : currentRadial+
      (desiredRadialSpeed-currentRadial)*
      radialBlend-
      eulerLeak*0.95;

/*
  Polar reconstruction rotates leftover knockback onto the orbit
  tangent — that is the post-hit sway. Keep cartesian flight while
  the hit is fresh, then ease orbit response back in.
*/
const polarMix=clamp((0.28-impactHold)/0.28,0,1);
if(polarMix>0.02){
    const polarX=tangentX*newTangent+radialX*newRadial;
    const polarY=tangentY*newTangent+radialY*newRadial;
    const carry=Math.hypot(s.vx,s.vy);
    const polarSp=Math.hypot(polarX,polarY)||0.0001;
    const keepSp=Math.max(polarSp, carry*(0.70+0.22*impactHold));
    const scale=keepSp/polarSp;
    s.vx=s.vx*(1-polarMix)+polarX*scale*polarMix;
    s.vy=s.vy*(1-polarMix)+polarY*scale*polarMix;
}

/*
  Planted dish. Knockback may still fly free, but the bowl keeps a
  grip so the Bey does not ice-skate or get bullied across the stadium.
  This is radial gravity only — it does not rewrite heading.
*/
if(polarMix<0.92 && rNow>0.08){
    const grip=1-polarMix;
    const bowl=clamp((rNow-preferredRadius)*0.007,-0.0020,0.008);
    const rim=rNow>0.64?(rNow-0.64)*0.09:0;
    const pull=(bowl+rim)*grip;
    s.vx-=radialX*pull;
    s.vy-=radialY*pull;
    const spd=Math.hypot(s.vx,s.vy);
    const cap=Math.max(0.086,targetOrbitSpeed*1.85);
    if(spd>cap){
        const bleed=Math.min(spd-cap,0.0010+0.0018*grip);
        s.vx-=(s.vx/spd)*bleed;
        s.vy-=(s.vy/spd)*bleed;
    }
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
if(impactHold<=0.16){
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
}

/*
  Final free-space spin-direction projection.
  All free-space forces are complete. This removes ONLY an
  opposite-spin tangential component; it does not add orbit speed.
  Skip while knockback owns the path — stripping the "wrong" tangent
  as the Bey flies is the post-hit wiggle.
*/
if(impactHold<=0.28){
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
    const inXtremeGate=s.y>=0.62 && Math.abs(s.x)<=0.22;
    const inPocketGate=s.y>=0.58 && Math.abs(s.x)>=0.50;
    const finishEscape=
        outward>0.012 &&
        radius>=0.72 &&
        radius<=1.08 &&
        (s.lastImpactForce||0)>=0.008 &&
        (s.impactMomentumState||0)>0.38 &&
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
          Hard impact:
          - reverse outward velocity
          - reduce it heavily
          - preserve only some tangent
          - create a recovery state
        */
        const wallImpactQuality=
            clamp(outward/0.045,0,2.2);

        const restitution=
            clamp(
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
            clamp(
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
    version:"1.2.4",
    step,
    homeOrbitRadius,
    orbitOmega,
    bitOrbitProfile
};

})(typeof window!=="undefined" ? window : globalThis);
