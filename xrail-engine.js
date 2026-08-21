/* =========================================================
   SPIN WARS X — X-RAIL ENGINE / PHASE A
   ---------------------------------------------------------
   Phase A owns the physical decision-making for:
   - whether contact is a real rail catch
   - the quality of the catch
   - the initial rail grip/speed
   - rail ride acceleration / friction
   - release thresholds

   It does NOT move the Bey by itself. app.js remains the physics
   integrator for V105 so this can be introduced without replacing
   the stable V104 movement system all at once.
========================================================= */

(function(global){
  "use strict";

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const finite=(v,f)=>Number.isFinite(v)?v:f;

  function captureDecision(input){
    const {
      speed=0,
      rpm=0,
      stability=.6,
      control=.6,
      affinity=.5,
      movement=.6,
      approachRatio=0,
      tangentRatio=0,
      tangentSpeed=0,
      deliberate=false,
      recentKnockback=false
    }=input||{};

    const attackBit=movement>=.80;

    // Phase A principle:
    // contact alone never captures. A real catch needs BOTH a useful
    // inward approach and meaningful tangential momentum.
    const minimumRPM=deliberate
      ? .27
      : Math.max(.37+(1-affinity)*.18, attackBit?.46:0);

    if(rpm<minimumRPM) return {capture:false,reason:"low-rpm"};

    const highRPMApproach=rpm>=.72 && speed>=.0085;
    if(!highRPMApproach && speed<.012)
      return {capture:false,reason:"low-speed"};

    const physicsException=!deliberate && !attackBit && recentKnockback;

    const minApproach=deliberate
      ? .10+.08*(1-affinity)
      : physicsException
        ? .22+.14*(1-affinity)
        : .25+.16*(1-affinity);

    if(approachRatio<minApproach)
      return {capture:false,reason:"poor-approach"};

    const minTangent=deliberate
      ? .22+.10*(1-affinity)
      : physicsException
        ? .58-affinity*.12-movement*.02
        : .68-affinity*.10-movement*.02;

    const minTangentSpeed=deliberate
      ? .0065+.002*(1-affinity)
      : physicsException
        ? .0100-affinity*.001
        : .0115-affinity*.001;

    if(tangentSpeed<minTangentSpeed || tangentRatio<minTangent)
      return {capture:false,reason:"poor-tangent"};

    const approachQuality=clamp(approachRatio/.42,0,1);
    const tangentQuality=clamp(
      (tangentRatio-minTangent)/Math.max(.01,1-minTangent),0,1
    );
    const speedQuality=clamp((speed-.012)/.050,0,1);

    const alignmentBonus=
      clamp((rpm-.70)/.30,0,1)*
      clamp(tangentRatio/.72,0,1)*
      clamp(approachRatio/.42,0,1);

    const physicalScore=clamp(
      affinity*.30+
      tangentQuality*.27+
      approachQuality*.16+
      speedQuality*.08+
      rpm*.08+
      stability*.05+
      alignmentBonus*.06,
      0,1
    );

    const baseChance=deliberate
      ? .68+physicalScore*.20
      : attackBit
        ? .26+physicalScore*.38
        : physicsException
          ? .10+physicalScore*.28
          : .05+physicalScore*.18;

    const captureChance=clamp(
      baseChance+(Math.random()-.5)*.08,
      .18,.90
    );

    if(Math.random()>captureChance)
      return {capture:false,reason:"contact-not-caught",physicalScore,captureChance};

    const initialBoost=
      .010+
      affinity*.014+
      rpm*.008+
      physicalScore*.010;

    return {
      capture:true,
      physicalScore,
      captureChance,
      initialBoost,
      grip:clamp(.66+affinity*.18+physicalScore*.16,0,1)
    };
  }

  function rideParams(input){
    const {
      rpm=0,
      control=.6,
      affinity=.5,
      movement=.6,
      grip=.7
    }=input||{};

    const attackBit=movement>=.80;
    const railRpmPower=Math.pow(clamp(rpm,0,1),.82);

    const maxSpeed=clamp(
      .078+
      .092*railRpmPower+
      .025*affinity+
      .010*control,
      .090,.190
    );

    const acceleration=
      (
        .00155+
        .00210*railRpmPower+
        .00135*affinity
      )*
      (.76+.24*clamp(grip,0,1));

    // Slightly more drain than normal free spin, but deliberately modest.
    const friction=
      (
        .000010+
        (1-control)*.000008+
        (1-rpm)*.000010
      );

    const releaseRPM=attackBit
      ? .34
      : .24+(1-affinity)*.16;

    return {maxSpeed,acceleration,friction,releaseRPM};
  }

  global.SpinWarsXRailEngine={
    version:"phase-a",
    captureDecision,
    rideParams
  };

})(window);
