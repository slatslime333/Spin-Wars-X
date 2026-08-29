/* SPIN WARS X — ATTACK MOVEMENT TUNING V1
   Movement feel only. No attack/knockback/stat changes.
   Loaded after movement-engine.js; wraps the exported orbit helpers.

   Full-spin Attack stays wide (X-Rail is the job). Extra inward walk
   and slower omega only kick in as RPM falls below 80%.
*/
(function(global){
  "use strict";
  const M=global.SpinWarsMovementEngine;
  if(!M) return;
  const originalProfile=M.bitOrbitProfile;
  const originalOmega=M.orbitOmega;
  if(typeof originalProfile!=="function") return;

  function isAttackBit(o){
    const type=String(o.bitType||"").toLowerCase();
    const name=String(o.bitName||"").toLowerCase();
    return type==="attack" || ["flat","low flat","rush","low rush","taper"].includes(name);
  }

  function tiredFrom80(rpm){
    const r=Math.max(0,Math.min(1,Number(rpm)||0));
    return Math.max(0,(0.80-r)/0.80);
  }

  M.bitOrbitProfile=function(opts){
    const o=Object.assign({},opts||{});
    if(!isAttackBit(o)) return originalProfile(o);
    const p=originalProfile(o);
    const tired=tiredFrom80(o.rpm);
    p.home=Math.max(0.22,p.home*(1-0.05*tired));
    p.omega*=(1-0.08*tired);
    return p;
  };

  if(typeof originalOmega==="function"){
    M.orbitOmega=function(movement,rpm,opts){
      const o=Object.assign({},opts||{});
      const v=originalOmega(movement,rpm,o);
      return isAttackBit(o) ? v*(1-0.08*tiredFrom80(rpm)) : v;
    };
  }
})(typeof window!=="undefined" ? window : globalThis);
