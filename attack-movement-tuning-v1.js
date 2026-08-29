/* SPIN WARS X — ATTACK MOVEMENT TUNING V1
   Movement feel only. No attack/knockback/stat changes.
   Loaded after movement-engine.js; wraps the exported orbit helpers.
*/
(function(global){
  "use strict";
  const M=global.SpinWarsMovement;
  if(!M) return;
  const originalProfile=M.bitOrbitProfile;
  const originalOmega=M.orbitOmega;
  if(typeof originalProfile!=="function") return;

  M.bitOrbitProfile=function(opts){
    const o=Object.assign({},opts||{});
    const type=String(o.bitType||"").toLowerCase();
    const name=String(o.bitName||"").toLowerCase();
    const attack=type==="attack" || ["flat","low flat","rush","low rush","taper"].includes(name);
    if(!attack) return originalProfile(o);

    const p=originalProfile(o);
    /* Narrow the high-RPM attack ring by ~7% and soften the low-RPM floor. */
    const rpm=Math.max(0,Math.min(1,Number(o.rpm)||0));
    const highRpm=0.35+0.65*rpm;
    p.home=Math.max(0.22,p.home*(1-0.07*highRpm));
    /* Keep the aggressive feel, but reduce the orbital angular drive ~6%. */
    p.omega*=0.94;
    p.radialFollow*=0.92;
    return p;
  };

  if(typeof originalOmega==="function"){
    M.orbitOmega=function(movement,rpm,opts){
      const o=Object.assign({},opts||{});
      const type=String(o.bitType||"").toLowerCase();
      const name=String(o.bitName||"").toLowerCase();
      const attack=type==="attack" || ["flat","low flat","rush","low rush","taper"].includes(name);
      const v=originalOmega(movement,rpm,o);
      return attack ? v*0.94 : v;
    };
  }
})(window);
