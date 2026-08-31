/* SPIN WARS X — ROGUE FINAL BALANCE PATCH
 * Final convergence pass layered after rogue-balance.js + rogue-shop-balance.js.
 * Quick Play is intentionally untouched.
 *
 * Design:
 * - Bronze: hard early -> player earns the advantage by late run.
 * - Silver: neutral throughout.
 * - Gold: player-favorable early -> CPU pressure rises into late run.
 * - All three tiers converge into the same general pre-final-boss power band.
 * - CPU retains its actual combo/upgrade identity; scaling is deliberately soft.
 * - CPU upgrade count remains the existing same/+1/+2 system.
 */
(function(global){
  "use strict";

  const STATS=["attack","knockback","defense","mobility","balance","stamina"];
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const round=n=>Math.round(Number(n)||0);
  const empty=()=>Object.fromEntries(STATS.map(k=>[k,0]));

  function run(){return global.SpinWarsRogue?.run?.()||null;}
  function tier(){
    const r=run();
    const t=String(r?.startingTier||"Silver").toLowerCase();
    return t==="bronze"?"Bronze":t==="gold"?"Gold":"Silver";
  }
  function match(){return Math.max(1,Number(run()?.matchIndex)||1);}
  function statsAvg(s){return STATS.reduce((a,k)=>a+(Number(s?.[k])||70),0)/STATS.length;}
  function comboStats(blade,ratchet,bit){
    try{return typeof global.calculateComboStats==="function"?global.calculateComboStats(blade,ratchet,bit)||{}:{};}catch(_){return {};}
  }
  function playerStats(){
    const r=run();
    const raw=comboStats(r?.blade,r?.ratchet,r?.bit);
    const out={};
    STATS.forEach(k=>out[k]=round((Number(raw?.stats?.[k])||70)+(Number(r?.startScale?.[k])||0)+(Number(r?.bonuses?.[k])||0)));
    return out;
  }
  function cpuBaseStats(){
    const r=run();
    const raw=comboStats(r?.cpuBlade,r?.cpuRatchet,r?.cpuBit);
    const out={};
    STATS.forEach(k=>out[k]=round((Number(raw?.stats?.[k])||70)+(Number(r?.cpuBonuses?.[k])||0)));
    return out;
  }

  /*
   * Target ratio is intentionally a CURVE, not a tier power ranking.
   * By match 17 every tier is in the same 0.99–1.03 neighborhood.
   * Bosses then create the intentional tier-step spike.
   */
  function targetRatio(){
    const t=tier(),m=match();
    let ratio;
    if(t==="Bronze"){
      ratio=m<=2?1.025:m<=5?1.005:m<=11?0.995:m<=17?0.985:1.075;
    }else if(t==="Silver"){
      ratio=m<=5?1.000:m<=11?1.000:m<=17?1.005:1.090;
    }else{
      ratio=m<=2?0.965:m<=5?0.985:m<=11?1.005:m<=17?1.025:1.105;
    }
    if(m===6)ratio=t==="Bronze"?1.040:t==="Silver"?1.050:1.060;
    if(m===12)ratio=t==="Bronze"?1.050:t==="Silver"?1.065:1.080;
    if(m===18)ratio=t==="Bronze"?1.075:t==="Silver"?1.090:1.105;
    return ratio;
  }

  function applySoftConvergence(){
    /* CPU scale is owned by rogue-mode.js generateCpu / fillCpuScale. */
    return;
  }

  function bossInfo(){
    const m=match();
    if(m===6)return {label:"MINI BOSS · TIER CHECK I",cls:"mini"};
    if(m===12)return {label:"MINI BOSS · TIER CHECK II",cls:"mini"};
    if(m===18)return {label:"FINAL BOSS",cls:"final"};
    return null;
  }

  function installBossLabel(){
    /* VS plates already mount .vs-boss-mark. Never strip/re-insert on
       MutationObserver ticks — that looped the tab. */
    if(document.querySelector(".vs-boss-mark")) return;
    if(document.getElementById("rogueFinalBossTag")) return;
    const info=bossInfo();
    if(!info)return;
    const r=run();
    const name=String(r?.cpuBlade?.name||"").trim();
    if(!name)return;
    const nodes=[...document.querySelectorAll("*")].filter(el=>el.children.length===0&&el.textContent.trim()===name);
    if(!nodes.length)return;
    const nameEl=nodes.find(el=>el.closest("article,section,[class*='card'],[class*='vs'],[class*='combo']"))||nodes[0];
    const card=nameEl.closest("article,section,[class*='vs-'],[class*='combo-'],[class*='vs_'],[class*='combo_']")||nameEl.parentElement||nameEl;
    if(!card)return;
    const tag=document.createElement("div");
    tag.id="rogueFinalBossTag";
    tag.className="rogue-final-boss-tag rogue-final-boss-tag--"+info.cls;
    tag.textContent=info.label;
    card.insertBefore(tag,card.firstChild);
  }

  function installStyle(){
    if(document.getElementById("rogueFinalBalanceStyle"))return;
    const s=document.createElement("style");
    s.id="rogueFinalBalanceStyle";
    s.textContent=`
      .rogue-final-boss-tag{display:flex;align-items:center;justify-content:center;width:max-content;max-width:100%;margin:0 auto 8px;padding:5px 11px;border:1px solid currentColor;border-radius:999px;font:800 11px/1.1 system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;position:relative;z-index:20;text-align:center}
      .rogue-final-boss-tag--final{font-size:12px;padding:6px 13px}
    `;
    document.head.appendChild(s);
  }

  function tick(){
    if(!run())return;
    try{applySoftConvergence();installBossLabel();}catch(_){/* never break the battle */}
  }

  installStyle();
  global.__rogueFinalBalanceInstalled=true;
  tick();
  setInterval(tick,250);
  global.addEventListener?.("load",tick);
  document.addEventListener?.("DOMContentLoaded",tick);

  /* Re-apply after UI changes so the boss marker survives combo-card renders. */
  if(global.MutationObserver){
    const observer=new MutationObserver(()=>{
      if(document.querySelector(".vs-boss-mark")||document.getElementById("rogueFinalBossTag")) return;
      if(bossInfo())installBossLabel();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})(window);
