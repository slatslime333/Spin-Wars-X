/* SPIN WARS X — X-RAIL SPEED CAP
 * Presentation-independent movement tuning.
 * Limits only the maximum speed while a Bey is actively riding X-Rail.
 * Does not change attack power, knockback, capture odds, or rail geometry.
 */
(function(global){
  "use strict";
  const ENGINE=global.SpinWarsXRailEngine;
  if(!ENGINE || typeof ENGINE.step!=="function") return;

  const MAX_RAIL_RIDE_SPEED=0.125;
  const originalStep=ENGINE.step;

  ENGINE.step=function(s,dt){
    if(s && s.railEngaged && Number.isFinite(s.railSpeed)){
      s.railSpeed=Math.min(MAX_RAIL_RIDE_SPEED,Math.max(0,s.railSpeed));
    }

    const result=originalStep.call(this,s,dt);

    if(s && s.railEngaged && Number.isFinite(s.railSpeed)){
      const speed=Math.hypot(Number(s.vx)||0,Number(s.vy)||0);
      if(speed>MAX_RAIL_RIDE_SPEED){
        const scale=MAX_RAIL_RIDE_SPEED/speed;
        s.vx*=scale;
        s.vy*=scale;
      }
      s.railSpeed=Math.min(MAX_RAIL_RIDE_SPEED,Math.hypot(Number(s.vx)||0,Number(s.vy)||0));
    }

    return result;
  };

  ENGINE.xrailSpeedCap=MAX_RAIL_RIDE_SPEED;
  ENGINE.version=(ENGINE.version||"")+"-speedcap-0.125";
})(typeof window!=="undefined"?window:globalThis);
