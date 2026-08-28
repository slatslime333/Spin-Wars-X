/* SPIN WARS X — ROGUE FINAL BALANCE PATCH
 * Final convergence pass layered after rogue-balance.js + rogue-shop-balance.js.
 * Quick Play is intentionally untouched.
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
    const r=run(),raw=comboStats(r?.blade,r?.ratchet,r?.bit),out={};
    STATS.forEach(k=>out[k]=round((Number(raw?.stats?.[k])||70)+(Number(r?.startScale?.[k])||0)+(Number(r?.bonuses?.[k])||0)));
    return out;
  }
  function cpuBaseStats(){
    const r=run(),raw=comboStats(r?.cpuBlade,r?.cpuRatchet,r?.cpuBit),out={};
    STATS.forEach(k=>out[k]=round((Number(raw?.stats?.[k])||70)+(Number(r?.cpuBonuses?.[k])||0)));
    return out;
  }
  function targetRatio(){
    const t=tier(),m=match();
    let ratio;
    if(t==="Bronze") ratio=m<=2?1.025:m<=5?1.005:m<=11?0.995:m<=17?0.985:1.075;
    else if(t==="Silver") ratio=m<=5?1:m<=11?1:m<=17?1.005:1.09;
    else ratio=m<=2?0.965:m<=5?0.985:m<=11?1.005:m<=17?1.025:1.105;
    if(m===6)ratio=t==="Bronze"?1.04:t==="Silver"?1.05:1.06;
    if(m===12)ratio=t==="Bronze"?1.05:t==="Silver"?1.065:1.08;
    if(m===18)ratio=t==="Bronze"?1.075:t==="Silver"?1.09:1.105;
    return ratio;
  }
  function applySoftConvergence(){
    const r=run();
    if(!r||!r.cpuBlade||!global.Game?.player||!global.Game?.cpu)return;
    const p=statsAvg(playerStats()),base=cpuBaseStats(),c=statsAvg(base),target=p*targetRatio();
    const delta=clamp((target-c)*0.48,-7,8),scale=empty();
    STATS.forEach(k=>scale[k]=round(clamp(delta+(Number(base[k])-c)*0.06,-7,8)));
    r.cpuScale=scale;
    r.cpuPowerTarget=target;
    const cEff={};
    STATS.forEach(k=>cEff[k]=round(base[k]+scale[k]));
    global.Game.cpu.stats=cEff;
    global.Game.cpu.comboOVR=round(statsAvg(cEff));
    if(typeof global.Game.cpu.comboMeta==="number"){
      const physical=Number(global.Game.cpu.comboMeta)||70;
      global.Game.cpu.comboMeta=round(clamp(physical*0.65+statsAvg(cEff)*0.35,40,99));
    }
  }
  function bossInfo(){
    const m=match();
    if(m===6)return {label:"MINI BOSS · TIER CHECK I",cls:"mini"};
    if(m===12)return {label:"MINI BOSS · TIER CHECK II",cls:"mini"};
    if(m===18)return {label:"FINAL BOSS",cls:"final"};
    return null;
  }

  /* Idempotent: never remove/reinsert the marker if it is already correct.
     This is important because the battle renderer changes the DOM frequently. */
  function installBossLabel(){
    const info=bossInfo();
    const existing=document.getElementById("rogueFinalBossTag");
    if(!info){ existing?.remove(); return; }

    const r=run(),name=String(r?.cpuBlade?.name||"").trim();
    if(!name)return;

    if(existing){
      const expectedClass="rogue-final-boss-tag rogue-final-boss-tag--"+info.cls;
      if(existing.className!==expectedClass||existing.textContent!==info.label){
        existing.className=expectedClass;
        existing.textContent=info.label;
      }
      return;
    }

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

  let scheduled=false;
  function scheduleLabel(){
    if(scheduled)return;
    scheduled=true;
    const later=()=>{scheduled=false;try{installBossLabel();}catch(_){} };
    if(global.requestAnimationFrame)global.requestAnimationFrame(later);else setTimeout(later,0);
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

  /* Observe renderer changes, but the callback is throttled and idempotent.
     It no longer causes a remove -> insert -> observer -> infinite mutation loop. */
  if(global.MutationObserver){
    const observer=new MutationObserver(()=>{if(bossInfo())scheduleLabel();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})(window);
