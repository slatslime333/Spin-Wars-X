/* SPIN WARS X — ROGUE BALANCE PASS
 * Keeps Quick Play untouched. Patches Rogue progression after rogue-mode.js loads.
 */
(function(global){
"use strict";

const STATS=["attack","knockback","defense","mobility","balance","stamina"];
const LABEL={attack:"ATK",knockback:"KB",defense:"DEF",mobility:"MOB",balance:"BAL",stamina:"STA"};
const R=()=>global.SpinWarsRogue?.run?.()||null;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rnd=n=>Math.round(Number(n)||0);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const empty=()=>Object.fromEntries(STATS.map(k=>[k,0]));

function normTier(){
    const r=R();
    const t=String(r?.startingTier||"Silver").toLowerCase();
    return t==="bronze"?"Bronze":t==="gold"?"Gold":"Silver";
}
function match(){return Number(R()?.matchIndex)||1;}
function bossLevel(m=match()){
    if(m===6)return "mini1";
    if(m===12)return "mini2";
    if(m===18)return "final";
    return "";
}
function isBoss(){return !!bossLevel();}

/* Rogue Meta is the same V57 combo score as Quick Play, plus a small
 * shop/form delta from rogueDisplayMeta. Height is a real physical hit.
 * Do not damp 80 vs 70 or blend META with upgraded OVR.
 */
function rawCombo(blade,ratchet,bit){
    try{return typeof global.calculateComboStats==="function"?global.calculateComboStats(blade,ratchet,bit):null;}catch(_e){return null;}
}
function avgStats(stats){return STATS.reduce((s,k)=>s+(Number(stats?.[k])||70),0)/STATS.length;}
function rogueMeta(side){
    const fn=global.SpinWarsRogue?.rogueDisplayMeta;
    if(typeof fn==="function") return fn(side);
    const r=R(); if(!r)return 70;
    const cpu=side==="cpu";
    const raw=rawCombo(cpu?r.cpuBlade:r.blade,cpu?r.cpuRatchet:r.ratchet,cpu?r.cpuBit:r.bit);
    return clamp(rnd(Number(raw?.meta)||avgStats(raw?.stats)),40,99);
}
function playerEffectiveStats(){
    const r=R(); if(!r)return empty();
    const raw=rawCombo(r.blade,r.ratchet,r.bit);
    const out={};
    STATS.forEach(k=>out[k]=rnd((Number(raw?.stats?.[k])||70)+(Number(r.startScale?.[k])||0)+(Number(r.bonuses?.[k])||0)));
    return out;
}
function cpuEffectiveStats(){
    const r=R(); if(!r)return empty();
    const raw=rawCombo(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    const out={};
    STATS.forEach(k=>out[k]=rnd((Number(raw?.stats?.[k])||70)+(Number(r.cpuScale?.[k])||0)+(Number(r.cpuBonuses?.[k])||0)));
    return out;
}

/* Tier curve: all tiers remain difficult. Only the location of the pressure changes. */
function cpuTargetRatio(){
    const t=normTier(),m=match();
    let ratio;
    if(t==="Bronze"){
        // Hard opening, then the player's successful build earns the advantage.
        ratio=m<=2?1.025:m<=5?1.005:m<=11?0.985:m<=17?0.965:1.075;
    }else if(t==="Silver"){
        // Neutral curve: neither side gets a permanent handicap.
        ratio=m<=5?1.000:m<=11?1.005:m<=17?1.015:1.085;
    }else{
        // Gold starts with a player advantage, then reverses into the hardest finish.
        ratio=m<=2?0.965:m<=5?0.985:m<=11?1.005:m<=17?1.035:1.105;
    }
    if(m===6) ratio=t==="Bronze"?1.045:t==="Silver"?1.055:1.065;
    if(m===12) ratio=t==="Bronze"?1.060:t==="Silver"?1.075:1.090;
    if(m===18) ratio=t==="Bronze"?1.075:t==="Silver"?1.090:1.105;
    return ratio;
}

function shopWeights(t,m){
    // Premium upgrades are intentionally more common than the old 9% Rare / 4% Legendary base.
    let w={common:50,uncommon:28,rare:14,legendary:7,evolve:1};
    if(t==="Bronze"){
        w.rare+=m>=3?3:0;
        w.legendary+=m>=6?2:0;
        w.evolve+=m>=6?1:0;
    }else if(t==="Silver"){
        w.rare+=2;
        w.legendary+=m>=6?1:0;
        w.evolve+=m>=6?1:0;
    }else{
        w.common+=m>=6?5:0;
        w.uncommon+=m>=6?2:0;
        w.rare-=m>=6?1:0;
        w.legendary-=m>=12?1:0;
        w.evolve+=m<6?1:0;
    }
    if(m>=12&&t!=="Gold") w.rare+=2;
    if(m>=18){w.legendary+=2;w.rare+=1;}
    Object.keys(w).forEach(k=>w[k]=Math.max(0,w[k]));
    return w;
}
function rarity(){
    const w=shopWeights(normTier(),match());
    const total=Object.values(w).reduce((a,b)=>a+b,0);
    let x=Math.random()*total;
    for(const k of ["common","uncommon","rare","legendary","evolve"]){x-=w[k];if(x<0)return k;}
    return "common";
}
function focused(blade){
    const t=String(blade?.type||"Balance");
    if(t==="Attack")return pick(["attack","knockback","mobility"]);
    if(t==="Defense")return pick(["defense","balance","stamina"]);
    if(t==="Stamina")return pick(["stamina","balance","defense"]);
    return pick(STATS);
}
function addBonus(obj,k,n){obj[k]=(Number(obj[k])||0)+n;}
function applyCpuUpgrade(card){
    const r=R();
    if(card.kind==="stat"){
        addBonus(r.cpuBonuses,card.stat,card.amount);
        if(card.downStat)addBonus(r.cpuBonuses,card.downStat,card.downAmt);
        if(card.secondStat)addBonus(r.cpuBonuses,card.secondStat,card.secondAmt);
    }else if(card.kind==="modifier"){
        r.cpuModifier={id:card.modifierId};
    }else if(card.kind==="reforge"){
        if(card.part==="bit"){
            const bits=(typeof global.selectableBits==="function"?global.selectableBits():[]).filter(b=>b.name!==r.cpuBit?.name);
            if(bits.length)r.cpuBit=pick(bits);
        }else{
            const rats=(global.RATCHETS||[]).filter(x=>x.name!==r.cpuRatchet?.name);
            if(rats.length)r.cpuRatchet=pick(rats);
        }
    }else if(card.kind==="evolve"){
        STATS.forEach(k=>addBonus(r.cpuBonuses,k,2));
    }
    r.cpuHistory.push(card);
}
function randomCpuUpgrade(){
    const r=R(), blade=r.cpuBlade, rar=rarity();
    if(rar==="common")return {rarity:rar,kind:"stat",stat:Math.random()<0.65?focused(blade):pick(STATS),amount:2,title:"CPU SHOP · COMMON"};
    if(rar==="uncommon"){
        const up=focused(blade),down=pick(STATS.filter(x=>x!==up));
        return {rarity:rar,kind:"stat",stat:up,amount:3,downStat:down,downAmt:-1,title:"CPU SHOP · UNCOMMON"};
    }
    if(rar==="rare"){
        const roll=Math.random();
        if(roll<0.22)return {rarity:rar,kind:"reforge",part:Math.random()<0.5?"bit":"ratchet",title:"CPU SHOP · REFORGE"};
        if(roll<0.44){const a=focused(blade),b=pick(STATS.filter(x=>x!==a));return {rarity:rar,kind:"stat",stat:a,amount:2,secondStat:b,secondAmt:2,title:"CPU SHOP · RARE PAIR"};}
        return {rarity:rar,kind:"stat",stat:Math.random()<0.75?focused(blade):pick(STATS),amount:4,title:"CPU SHOP · RARE"};
    }
    if(rar==="legendary"){
        const mods=global.SpinWarsRogue?.MODIFIERS||[];
        const current=r.cpuModifier?.id;
        const pool=mods.filter(x=>x.id!==current);
        return {rarity:rar,kind:"modifier",modifierId:(pick(pool.length?pool:mods)||{}).id,title:"CPU SHOP · LEGENDARY"};
    }
    return {rarity:"evolve",kind:"evolve",title:"CPU SHOP · EVOLUTION"};
}
function desiredCpuUpgradeCount(){
    const r=R(); if(!r)return 0;
    const playerCount=Math.max((r.history||[]).length,match()-1);
    const t=normTier();
    let lead=0;
    if(match()>=2)lead=1;
    if(match()>=6)lead=2;
    if(t==="Silver"&&match()<6)lead=1;
    if(t==="Gold"&&match()<=2)lead=1;
    return Math.max(0,playerCount+Math.min(2,lead));
}
function rebuildCpuStack(){
    const r=R();if(!r)return;
    r.cpuBonuses=empty();r.cpuHistory=[];r.cpuModifier=null;r.cpuAbilityId=null;
    const n=desiredCpuUpgradeCount();
    for(let i=0;i<n;i++)applyCpuUpgrade(randomCpuUpgrade());
}
function scaleCpuWithoutFlattening(){
    const r=R();if(!r)return;
    const raw=rawCombo(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    const base={};STATS.forEach(k=>base[k]=rnd((Number(raw?.stats?.[k])||70)+(Number(r.cpuBonuses?.[k])||0)));
    const p=avgStats(playerEffectiveStats());
    const c=avgStats(base);
    const target=p*cpuTargetRatio();
    const delta=clamp((target-c)*0.48,-8,10);
    r.cpuScale=empty();
    STATS.forEach(k=>{
        // Apply only a fraction of the needed average correction so the CPU's actual combo identity survives.
        const identityBias=(Number(base[k])-c)*0.08;
        r.cpuScale[k]=rnd(clamp(delta+identityBias,-8,10));
    });
    r.cpuPowerTarget=target;
}
function rebalanceCpu(){
    const r=R();if(!r||!r.cpuBlade)return;
    /* Stacks and scale are owned by rogue-mode.js generateCpu. */
}
function sync(){
    const r=R();if(!r)return;
    rebalanceCpu();
    const p=playerEffectiveStats(),c=cpuEffectiveStats();
    Game.player.stats=p;Game.cpu.stats=c;
    Game.player.comboOVR=rnd(avgStats(p));Game.cpu.comboOVR=rnd(avgStats(c));
    Game.player.comboMeta=rogueMeta("player");Game.cpu.comboMeta=rogueMeta("cpu");
    Game.player.blade=Object.assign({},r.blade||{},r.abilityId?{abilityId:r.abilityId}:{});
    Game.player.ratchet=r.ratchet;Game.player.bit=r.bit;
    Game.cpu.blade=Object.assign({},r.cpuBlade||{},r.cpuAbilityId?{abilityId:r.cpuAbilityId}:{});
    Game.cpu.ratchet=r.cpuRatchet;Game.cpu.bit=r.cpuBit;
    r._rogueBalanceMeta={player:Game.player.comboMeta,cpu:Game.cpu.comboMeta};
}

function bossLabel(){
    const b=bossLevel();
    if(!b)return "";
    if(b==="final")return "FINAL BOSS";
    return b==="mini1"?"MINI BOSS · TIER CHECK I":"MINI BOSS · TIER CHECK II";
}
function injectBossTag(){
    const r=R();if(!r||!isBoss())return;
    const name=r.cpuBlade?.name;if(!name)return;
    document.getElementById("rogueComboBossTag")?.remove();
    const exact=[...document.querySelectorAll("*")].filter(e=>e.children.length===0&&e.textContent.trim()===name);
    let nameEl=exact.find(e=>{const p=e.closest("article,section,[class*='card'],[class*='vs'],[class*='combo']");return !!p;})||exact[0];
    if(!nameEl)return;
    let card=nameEl.closest("article,section,[class*='vs-'],[class*='combo-'],[class*='vs_'],[class*='combo_']")||nameEl.parentElement;
    if(!card)card=nameEl;
    const tag=document.createElement("div");
    tag.id="rogueComboBossTag";tag.className="rogue-combo-boss-tag";tag.textContent=bossLabel();
    card.insertBefore(tag,card.firstChild);
}
function installStyle(){
    if(document.getElementById("rogueBalanceStyle"))return;
    const s=document.createElement("style");s.id="rogueBalanceStyle";
    s.textContent=`.rogue-combo-boss-tag{display:inline-flex;align-items:center;justify-content:center;margin:0 auto 8px;padding:5px 10px;border:1px solid currentColor;border-radius:999px;font:800 11px/1.1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;position:relative;z-index:4}.rogue-combo-boss-tag+*{margin-top:0}`;
    document.head.appendChild(s);
}
function patch(){
    if(!global.SpinWarsRogue||global.__rogueBalancePatched)return;
    global.__rogueBalancePatched=true;
    installStyle();
    const originalShow=global.showComboCard;
    if(typeof originalShow==="function"){
        global.showComboCard=function(){
            const out=originalShow.apply(this,arguments);
            if(R()){
                sync();
                requestAnimationFrame(()=>injectBossTag());
            }
            return out;
        };
    }
    const originalStarter=global.SpinWarsRogue.onStarterPicked;
    if(typeof originalStarter==="function"){
        global.SpinWarsRogue.onStarterPicked=function(){
            const out=originalStarter.apply(this,arguments);
            sync();
            return out;
        };
    }
    const originalDecorate=global.SpinWarsRogue.decorateVs;
    if(typeof originalDecorate==="function"){
        global.SpinWarsRogue.decorateVs=function(root){
            const out=originalDecorate.call(this,root);
            sync();
            requestAnimationFrame(()=>injectBossTag());
            return out;
        };
    }
    const originalOnOver=global.SpinWarsRogue.onMatchOver;
    if(typeof originalOnOver==="function"){
        global.SpinWarsRogue.onMatchOver=function(){
            sync();
            return originalOnOver.apply(this,arguments);
        };
    }
    sync();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",patch,{once:true});
else patch();
})(window);
