/* SPIN WARS X — ROGUE MODE
 * Progression around the live battle engine. First to 7 per match.
 * Eighteen matches. Minis 6/12. Shark Scale at 18. Then endless.
 */
(function(global){
"use strict";

const STATS=["attack","knockback","defense","mobility","balance","stamina"];
const LABEL={
    attack:"ATK",knockback:"KB",defense:"DEF",
    mobility:"MOB",balance:"BAL",stamina:"STA"
};
const FINAL_MATCH=18;
const MAX_MATCHES=FINAL_MATCH;
const BOSS_AT={6:"mini",12:"mini",18:"final"};

function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function round(n){return Math.round(Number(n)||0);}
function pick(list){return list[Math.floor(Math.random()*list.length)];}
function shuffle(list){
    const a=list.slice();
    for(let i=a.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const t=a[i];a[i]=a[j];a[j]=t;
    }
    return a;
}
function emptyBonuses(){
    const o={};STATS.forEach(k=>o[k]=0);return o;
}
function isActive(){
    return Game.mode==="rogue" && Game.rogue && Game.rogue.runStatus==="running";
}
function run(){return Game.rogue||null;}

function comboBase(blade,ratchet,bit){
    const raw=calculateComboStats(blade,ratchet,bit);
    return raw?{...raw.stats}:emptyBonuses();
}

function partsMeta(blade,ratchet,bit){
    const raw=typeof calculateComboStats==="function"?calculateComboStats(blade,ratchet,bit):null;
    return Number(raw?.meta)||70;
}

function formMetaAdj(form,enhanced){
    const f=String(form||"Bronze");
    let n=f==="Gold"?0:f==="Silver"?-5:-10;
    if(enhanced) n+=3;
    return n;
}

function stackMetaBonus(bonuses,blade){
    const b=bonuses||{};
    const role=String(blade?.type||"Balance");
    let focus=0;
    if(role==="Attack"){
        focus=(Number(b.attack)||0)+(Number(b.knockback)||0)+(Number(b.mobility)||0)*0.7;
    }else if(role==="Defense"){
        focus=(Number(b.defense)||0)+(Number(b.balance)||0)*0.7+(Number(b.stamina)||0)*0.7;
    }else if(role==="Stamina"){
        focus=(Number(b.stamina)||0)+(Number(b.balance)||0)*0.7+(Number(b.defense)||0)*0.5;
    }else{
        focus=["attack","knockback","defense","mobility","balance","stamina"]
            .reduce((s,k)=>s+(Number(b[k])||0),0)*0.45;
    }
    return clamp(Math.round(6*(1-Math.exp(-Math.max(0,focus)/14))),0,14);
}

function rogueDisplayMeta(side){
    const r=run();
    if(!r) return 70;
    const blade=side==="cpu"?r.cpuBlade:r.blade;
    const ratchet=side==="cpu"?r.cpuRatchet:r.ratchet;
    const bit=side==="cpu"?r.cpuBit:r.bit;
    const bonuses=side==="cpu"?r.cpuBonuses:r.bonuses;
    let meta=partsMeta(blade,ratchet,bit);
    if(side==="cpu"){
        if(r.cpuEnhanced) meta+=3;
    }else{
        meta+=formMetaAdj(r.currentRogueTier,r.enhanced);
    }
    meta+=stackMetaBonus(bonuses,blade);
    return clamp(round(meta),40,99);
}

function sharkBossParts(){
    const ratchet=(typeof RATCHETS!=="undefined"&&RATCHETS.find(x=>x.name==="1-60"))
        ||{name:"1-60",number:1,height:60};
    const bits=typeof selectableBits==="function"?selectableBits():[];
    const fromList=bits.find(b=>b.name==="Ball");
    const fromEngine=(typeof BIT_ENGINE!=="undefined")
        ?(BIT_ENGINE.ball||Object.values(BIT_ENGINE).find(b=>b&&b.name==="Ball"))
        :null;
    const bit=fromList||fromEngine||{name:"Ball"};
    return {ratchet,bit};
}

function claimSharkScale(){
    const r=run();
    const shark=sharkScaleBlade();
    if(!r||!shark) return false;
    const parts=sharkBossParts();
    r.blade=shark;
    r.ratchet=parts.ratchet;
    r.bit=parts.bit;
    r.currentRogueTier="Gold";
    r.claimedShark=true;
    r.startScale=emptyBonuses();
    syncLoadout();
    persist();
    return true;
}

function mergeStats(base,bonuses){
    const out={};
    const keys=["attack","knockback","defense","mobility","balance","stamina","burst"];
    for(const k of keys){
        out[k]=round((Number(base[k])||70)+(Number(bonuses?.[k])||0));
    }
    return out;
}

function powerOf(stats){
    return STATS.reduce((s,k)=>s+(Number(stats[k])||70),0)/STATS.length;
}

function starterParts(blade){
    const bits=selectableBits();
    const bit=pick(bits.length?bits:[{name:"Point"}]);
    const rats=typeof RATCHETS!=="undefined"?RATCHETS:[];
    const ratchet=pick(rats.length?rats:[{name:"3-60",number:3,height:60}]);
    return {ratchet,bit};
}

function bladeRole(blade){
    const t=String(blade?.type||"Balance");
    if(t==="Attack"||t==="Defense"||t==="Stamina") return t;
    const c=blade?.card||{};
    const atk=(Number(c.attack)||70)+(Number(c.knockback)||70);
    const hold=(Number(c.defense)||70)+(Number(c.stamina)||70);
    if(atk>=hold+8) return "Attack";
    if(hold>=atk+8) return "Stamina";
    return "Balance";
}

function bitCompatScore(blade,bit){
    const table=blade?.compatibility?.bits||{};
    const name=String(bit?.name||"");
    const compact=name.replace(/\s+/g,"");
    const n=Number(table[name]??table[compact]);
    return Number.isFinite(n)?n:50;
}

function heightCompatScore(blade,height){
    const n=Number(blade?.compatibility?.heights?.[height]);
    if(Number.isFinite(n)) return n;
    return height===60?78:height===70?62:42;
}

function roleBitNames(role){
    if(role==="Attack") return ["Rush","Low Rush","Flat","Low Flat","Kick","Quake"];
    if(role==="Defense") return ["Needle","Hexa","Wedge","Ball","Orb","Point"];
    if(role==="Stamina") return ["Ball","Orb","Needle","Hexa","Point","Level"];
    return ["Point","Level","Hexa","Kick","Ball"];
}

function roleRatchetNumbers(role){
    if(role==="Attack") return [1,3,4,5];
    if(role==="Stamina") return [7,9,6,5];
    if(role==="Defense") return [9,7,6,5];
    return [3,5,7,9];
}

function pickFromTop(scored){
    const pool=scored.slice(0,Math.min(4,scored.length));
    return pick(pool.length?pool:scored);
}

function pickCommittedParts(blade,exclude){
    const role=bladeRole(blade);
    const bits=(typeof selectableBits==="function"?selectableBits():[])
        .filter(b=>roleBitNames(role).includes(b.name));
    const skipBit=exclude?.bitName;
    const scored=bits
        .filter(b=>!skipBit||b.name!==skipBit)
        .map(b=>({item:b,score:bitCompatScore(blade,b)}))
        .sort((a,c)=>c.score-a.score);
    const good=scored.filter(x=>x.score>=70);
    const bit=(pickFromTop(good.length?good:scored)||{}).item
        || bits[0]
        || {name:"Point"};

    const heightRows=[60,70,80].map(h=>({h,score:heightCompatScore(blade,h)}));
    let heights=heightRows.filter(x=>x.score>=72).map(x=>x.h);
    if(role!=="Attack") heights=heights.filter(h=>h!==80);
    if(!heights.length) heights=[60];
    if(role!=="Attack" && heights.includes(60) && Math.random()<0.82) heights=[60];
    else if(role==="Attack" && heights.includes(60) && Math.random()<0.55) heights=[60,70].filter(h=>heights.includes(h));
    const height=pick(heights)||60;

    const nums=roleRatchetNumbers(role);
    const rats=(typeof RATCHETS!=="undefined"?RATCHETS:[])
        .filter(r=>Number(r.height)===height && nums.includes(Number(r.number)))
        .filter(r=>!exclude?.ratchetName||r.name!==exclude.ratchetName);
    const fallback=(typeof RATCHETS!=="undefined"?RATCHETS:[])
        .filter(r=>Number(r.height)===height);
    const ratchet=pick(rats.length?rats:fallback)||{name:`3-${height}`,number:3,height};
    return {ratchet,bit,role};
}

function cpuCompetence(match){
    const t=String(run()?.startingTier||"");
    if(match<=1) return 0;
    if(match===2) return Math.random()<0.45?1:0;
    // Bronze match 3 is still often committed, not a guaranteed role kit yet.
    if(t==="Bronze" && match===3) return Math.random()<0.55?1:0;
    return 1;
}

const MODIFIERS=[
    {id:"last_stand",name:"LAST STAND",tag:"LATE",
     blurb:"Under 40% RPM: +8 DEF and +5 KB. Healthy spin sits -3 MOB.",
     live(s,key){
         const rpm=Number(s?.rpm)||0;
         if(rpm<0.40){
             if(key==="defense") return 8;
             if(key==="knockback") return 5;
         }else if(key==="mobility") return -3;
         return 0;
     }},
    {id:"berserker",name:"BERSERKER",tag:"HIGH RPM",
     blurb:"Above 70% RPM: +7 ATK and +5 KB. Below 35% RPM: -6 DEF.",
     live(s,key){
         const rpm=Number(s?.rpm)||0;
         if(rpm>=0.70){
             if(key==="attack") return 7;
             if(key==="knockback") return 5;
         }
         if(rpm<0.35 && key==="defense") return -6;
         return 0;
     }},
    {id:"rail_rush",name:"RAIL RUSH",tag:"X-RAIL",
     blurb:"While riding the X-Rail, or just after an X-Exit: +8 ATK.",
     live(s,key){
         if(key!=="attack") return 0;
         if(s?.railEngaged || s?.xrailExitRampActive) return 8;
         if(s?.lastXRailExitReason==="x-exit" && (s.railExitRefractory||0)>0) return 8;
         return 0;
     }},
    {id:"final_spin",name:"FINAL SPIN",tag:"STAMINA",
     blurb:"Under 28% RPM stamina holds harder (+10 STA). Early fight -3 ATK.",
     live(s,key){
         const rpm=Number(s?.rpm)||0;
         if(rpm<0.28 && key==="stamina") return 10;
         if(rpm>0.62 && key==="attack") return -3;
         return 0;
     }},
    {id:"heavy_contact",name:"HEAVY CONTACT",tag:"CLASH",
     blurb:"After a heavy hit, the next clash hits +7 KB and -4 MOB.",
     live(s,key){
         if(!s?.rogueHeavyArmed) return 0;
         if(key==="knockback") return 7;
         if(key==="mobility") return -4;
         return 0;
     }},
    {id:"counterweight",name:"COUNTERWEIGHT",tag:"ANSWER",
     blurb:"After taking real knock, your next hit answers with +8 KB.",
     live(s,key){
         if(key==="knockback" && s?.rogueCounterArmed) return 8;
         return 0;
     }},
    {id:"pin_lock",name:"PIN LOCK",tag:"CENTER",
     blurb:"Inside the inner bowl: +6 BAL and +4 DEF. Wide laps: -3 ATK.",
     live(s,key){
         const r=Math.hypot(Number(s?.x)||0,Number(s?.y)||0);
         if(r<0.42){
             if(key==="balance") return 6;
             if(key==="defense") return 4;
         }
         if(r>0.72 && key==="attack") return -3;
         return 0;
     }},
    {id:"x_exit_swing",name:"X-EXIT SWING",tag:"EXIT",
     blurb:"A fresh X-Exit swing: +6 KB. Miss the rail and sit -2 STA.",
     live(s,key){
         const swing=s && !s.railEngaged && s.lastXRailExitReason==="x-exit" &&
             (Number(s.railExitAt)>0) && (performance.now()-s.railExitAt)<=1000;
         if(swing && key==="knockback") return 6;
         return 0;
     }},
    {id:"endurance",name:"ENDURANCE",tag:"LONG FIGHT",
     blurb:"First 8s: -4 ATK. After that: +8 STA and +3 DEF.",
     live(s,key){
         const t=Number(NEW_BATTLE?.elapsed)||0;
         if(t<8){
             if(key==="attack") return -4;
             return 0;
         }
         if(key==="stamina") return 8;
         if(key==="defense") return 3;
         return 0;
     }},
    {id:"glass_cannon",name:"GLASS CANNON",tag:"RISK",
     blurb:"+9 ATK and +6 KB always. -8 DEF and -5 BAL.",
     live(s,key){
         if(key==="attack") return 9;
         if(key==="knockback") return 6;
         if(key==="defense") return -8;
         if(key==="balance") return -5;
         return 0;
     }},
    {id:"anchor",name:"ANCHOR",tag:"TANK",
     blurb:"+7 DEF and +5 STA. -5 MOB. Tired spin still plants.",
     live(s,key){
         if(key==="defense") return 7;
         if(key==="stamina") return 5;
         if(key==="mobility") return -5;
         return 0;
     }},
    {id:"first_blood",name:"FIRST BLOOD",tag:"OPENING",
     blurb:"First 5s: +8 KB and +4 ATK. After that the bonus is gone.",
     live(s,key){
         const t=Number(NEW_BATTLE?.elapsed)||0;
         if(t>5) return 0;
         if(key==="knockback") return 8;
         if(key==="attack") return 4;
         return 0;
     }},
    {id:"late_bloom",name:"LATE BLOOM",tag:"CLOCK",
     blurb:"After 7.5s: +6 ATK and +4 BAL. Early fight sits -2 MOB.",
     live(s,key){
         const t=Number(NEW_BATTLE?.elapsed)||0;
         if(t<7.5){
             if(key==="mobility") return -2;
             return 0;
         }
         if(key==="attack") return 6;
         if(key==="balance") return 4;
         return 0;
     }},
    {id:"psyshock",name:"PSYSHOCK",tag:"KNOCK",
     blurb:"First 5s: +5 KB. First hit deals 60% knockback, second hit deals 160% knockback.",
     live(s,key){
         if(key!=="knockback") return 0;
         const t=Number(NEW_BATTLE?.elapsed)||0;
         return t<=5?5:0;
     }},
    {id:"vampire",name:"VAMPIRE",tag:"DRAIN",
     blurb:"10% chance to steal 1–2 RPM from the opponent each hit.",
     live(){ return 0; }}
];

function modifierById(id){return MODIFIERS.find(m=>m.id===id)||null;}

function liveBonus(s,key){
    const r=run();
    if(!r||!s) return 0;
    const side=s===NEW_BATTLE?.cpu?"cpu":"player";
    let n=0;
    const mod=side==="cpu"?r.cpuModifier:r.activeModifier;
    if(mod){
        const def=modifierById(mod.id);
        if(def&&typeof def.live==="function") n+=def.live(s,key)||0;
    }
    if(side==="player" && key==="knockback"){
        const pct=Number(r.hellsChainPct)||0;
        if(pct>0) n+=Math.round((Number(s.stats?.knockback)||70)*pct);
    }
    return n;
}

function hasMod(s,id){
    const r=run();
    if(!r||!s) return false;
    const packed=s===NEW_BATTLE?.cpu?r.cpuModifier:r.activeModifier;
    return packed?.id===id;
}

function applyPsyshockKnock(s,knock){
    const intended=Number(knock)||0;
    if(!isActive()||!s||!hasMod(s,"psyshock")) return intended;
    s.roguePsyshockHits=(Number(s.roguePsyshockHits)||0)+1;
    if(s.roguePsyshockHits%2===1) return intended*0.6;
    return intended*1.6;
}

function onClash(p,c,pDealt,cDealt){
    if(!isActive()||!p||!c) return;
    const r=run();
    const pHit=Number(pDealt)||0;
    const cHit=Number(cDealt)||0;
    if(p.rogueHeavyArmed) p.rogueHeavyArmed=false;
    else if(cHit>=0.038) p.rogueHeavyArmed=true;
    if(c.rogueHeavyArmed) c.rogueHeavyArmed=false;
    else if(pHit>=0.038) c.rogueHeavyArmed=true;
    if(p.rogueCounterArmed && pHit>=0.02) p.rogueCounterArmed=false;
    else if(cHit>=0.022) p.rogueCounterArmed=true;
    if(c.rogueCounterArmed && cHit>=0.02) c.rogueCounterArmed=false;
    else if(pHit>=0.022) c.rogueCounterArmed=true;
    tickHellsChain(pHit);
    tickVampire(p,c,pHit,cHit);
    if((r.consumables?.forceField||0)>0 && !p.rogueForceFieldUsed && NEW_BATTLE?.lastImpact?.heavy){
        p.rogueForceFieldUsed=true;
        if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.forceFieldStorm){
            SpinWarsAbilities.forceFieldStorm(p);
        }
    }
}

function stealRpm(from,to,lo,hi){
    if(!from||!to) return;
    const steal=lo+Math.random()*(hi-lo);
    const took=Math.min(steal, Math.max(0,Number(from.rpm)||0));
    from.rpm=Math.max(0,(Number(from.rpm)||0)-took);
    to.rpm=Math.min(1,(Number(to.rpm)||0)+took);
}

function tickVampire(p,c,pHit,cHit){
    if(hasMod(p,"vampire") && pHit>=0.012 && Math.random()<0.10) stealRpm(c,p,0.01,0.02);
    if(hasMod(c,"vampire") && cHit>=0.012 && Math.random()<0.10) stealRpm(p,c,0.01,0.02);
}

function tickHellsChain(pHit){
    const r=run();
    if(!r || (r.consumables?.hellsChain||0)<=0) return;
    if(pHit<0.012) return;
    const now=performance.now();
    const last=Number(r.hellsChainLastAt)||0;
    if(last && (now-last)<=1700){
        r.hellsChainPct=Math.min(0.70,(Number(r.hellsChainPct)||0)+0.10);
    }else if(last && (now-last)>1700){
        r.hellsChainPct=0;
    }
    r.hellsChainLastAt=now;
}

function bronzeBand(){
    const blades=Object.values(BLADE_ENGINE||{}).filter(b=>String(b.tier)==="Bronze"&&!b.hidden);
    const ratchet=(typeof RATCHETS!=="undefined"&&RATCHETS.find(x=>x.name==="3-60"))||{name:"3-60",number:3,height:60};
    const bits=typeof selectableBits==="function"?selectableBits():[];
    const bit=bits.find(x=>x.name==="Point")||bits[0]||{name:"Point"};
    const acc=emptyBonuses();
    const pool=blades.length?blades:Object.values(BLADE_ENGINE||{});
    let n=0;
    pool.forEach(blade=>{
        const s=comboBase(blade,ratchet,bit);
        n++;
        STATS.forEach(k=>{acc[k]+=(Number(s[k])||70);});
    });
    const count=Math.max(1,n);
    STATS.forEach(k=>{acc[k]=acc[k]/count;});
    return acc;
}

function makeStartScale(blade,ratchet,bit){
    const scale=emptyBonuses();
    const tier=String(blade?.tier||"");
    if(tier==="Bronze"||!blade) return scale;
    const band=bronzeBand();
    const mine=comboBase(blade,ratchet,bit);
    // Silver/Gold sit a step above Bronze, not a full-tier jump.
    // Keep the shape: only pull highs down, leave dump stats dump.
    const lead=tier==="Gold"?2.2:1.0;
    STATS.forEach(k=>{
        const target=(Number(band[k])||70)+lead;
        const have=Number(mine[k])||70;
        if(have>target) scale[k]=round((target-have)*0.93);
    });
    return scale;
}

function playerEffective(){
    const r=run();
    if(!r) return emptyBonuses();
    const base=comboBase(r.blade,r.ratchet,r.bit);
    const merged=mergeStats(mergeStats(base,r.startScale),r.bonuses);
    const temp=r.matchBuffs||{};
    if((Number(temp.burst2)||0)>0 && temp.burst2Stat){
        merged[temp.burst2Stat]=round((Number(merged[temp.burst2Stat])||70)+2);
    }
    return merged;
}

function cpuEffective(){
    const r=run();
    if(!r) return emptyBonuses();
    const base=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    return mergeStats(mergeStats(base,r.cpuScale),r.cpuBonuses);
}

function playerPlateBase(){
    const r=run();
    if(!r) return emptyBonuses();
    const parts=comboBase(
        r.starterBlade||r.blade,
        r.starterRatchet||r.ratchet,
        r.starterBit||r.bit
    );
    return mergeStats(parts,r.startScale);
}

function cpuPlateBase(){
    const r=run();
    if(!r) return emptyBonuses();
    const parts=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    return mergeStats(parts,r.cpuScale);
}

function playerUpgradeCount(){
    const r=run();
    if(!r) return 0;
    const fromHist=(r.history||[]).length;
    const fromMatch=Math.max(0,(r.matchIndex||1)-1);
    return Math.max(fromHist,fromMatch);
}

function cardGivesCpuPower(card){
    const k=card?.kind;
    return k==="stat"||k==="modifier"||k==="evolve"||k==="blessed";
}

function cpuStackPlan(){
    const r=run();
    const hist=r?.history||[];
    const matchPad=Math.max(0,(Number(r?.matchIndex)||1)-1);
    const powerN=hist.filter(cardGivesCpuPower).length;
    const toyN=Math.max(0, hist.length-powerN);
    const padN=Math.max(0, matchPad-hist.length);
    return {powerN,toyN,padN};
}

function cpuNightMix(tier,match,boss){
    const t=String(tier||"");
    const m=Math.max(1,Number(match)||1);
    if(boss){
        if(t==="Bronze") return {easy:0.18,even:0.52,hard:0.30};
        if(t==="Gold") return {easy:0.12,even:0.48,hard:0.40};
        return {easy:0.16,even:0.50,hard:0.34};
    }
    if(t==="Bronze"){
        if(m<=5) return {easy:0.18,even:0.57,hard:0.25};
        if(m<=12) return {easy:0.24,even:0.56,hard:0.20};
        return {easy:0.30,even:0.55,hard:0.15};
    }
    if(t==="Gold"){
        if(m<=5) return {easy:0.28,even:0.54,hard:0.18};
        if(m<=12) return {easy:0.16,even:0.52,hard:0.32};
        return {easy:0.12,even:0.50,hard:0.38};
    }
    if(m<=5) return {easy:0.20,even:0.50,hard:0.30};
    if(m<=12) return {easy:0.20,even:0.52,hard:0.28};
    return {easy:0.22,even:0.53,hard:0.25};
}

function cpuNightRoll(){
    const r=run();
    const mix=cpuNightMix(r?.startingTier, r?.matchIndex, !!BOSS_AT[Number(r?.matchIndex)||0]);
    const x=Math.random();
    if(x<mix.easy) return "easy";
    if(x<mix.easy+mix.even) return "even";
    return "hard";
}

function cpuStackLead(){
    const r=run();
    const t=String(r?.startingTier||"");
    const m=Math.max(1,Number(r?.matchIndex)||1);
    const night=r?.cpuNight||"even";
    let even=0.40, plus1=0.40, plus2=0.18, plus3=0.02;
    if(t==="Bronze"){
        if(m<=5){ even=0.55; plus1=0.32; plus2=0.13; plus3=0; }
        else if(m<=12){ even=0.58; plus1=0.32; plus2=0.10; plus3=0; }
        else { even=0.68; plus1=0.26; plus2=0.06; plus3=0; }
    }else if(t==="Silver"){
        if(m<=5){ even=0.28; plus1=0.50; plus2=0.20; plus3=0.02; }
        else if(m<=12){ even=0.22; plus1=0.48; plus2=0.26; plus3=0.04; }
        else { even=0.20; plus1=0.46; plus2=0.28; plus3=0.06; }
    }else{
        if(m<=5){ even=0.48; plus1=0.42; plus2=0.10; plus3=0; }
        else if(m<=12){ even=0.16; plus1=0.42; plus2=0.32; plus3=0.10; }
        else { even=0.12; plus1=0.40; plus2=0.36; plus3=0.12; }
    }
    if(night==="easy"){
        even+=0.18; plus1-=0.06; plus2-=0.08; plus3-=0.04;
    }else if(night==="hard"){
        even-=0.16; plus1-=0.04; plus2+=0.12; plus3+=0.08;
    }
    even=Math.max(0.08,even);
    plus1=Math.max(0.10,plus1);
    plus2=Math.max(0,plus2);
    plus3=Math.max(0,plus3);
    const total=even+plus1+plus2+plus3;
    let roll=Math.random()*total;
    if((roll-=even)<0) return 0;
    if((roll-=plus1)<0) return 1;
    if((roll-=plus2)<0) return 2;
    return 3;
}

function grantCpuPressure(n){
    const r=run();
    for(let i=0;i<n;i++){
        const focus=focusedStat(r.cpuBlade);
        const card=Math.random()<0.72
            ? makeStatCard("common",focus,2)
            : makeOfferCard("uncommon",r.cpuBlade,r.cpuModifier?.id,{forCpu:true});
        applyCpuCard(card);
    }
}

function makeCommonCard(blade,forCpu){
    const stats=forCpu?cpuEffective():playerEffective();
    const roll=Math.random();
    let stat,body;
    if(roll<0.34){
        stat=focusedStat(blade);
        body=`Type lean. +2 where this Bey wants it.`;
    }else if(roll<0.67){
        stat=lowestStat(stats);
        body=`Patch the low line. +2 ${LABEL[stat]}.`;
    }else{
        stat=pick(STATS);
        body=`Wild +2. Safe growth.`;
    }
    const card=makeStatCard("common",stat,2);
    card.body=body;
    return card;
}

function makeDualStatCard(a,aAmt,b,bAmt){
    return {
        id:"stat-dual-"+Math.random().toString(16).slice(2),
        rarity:"rare",kind:"stat",stat:a,amount:aAmt,secondStat:b,secondAmt:bAmt,
        title:`${LABEL[a]} +${aAmt}  ·  ${LABEL[b]} +${bAmt}`,
        kicker:"RARE",
        body:`Two lines move. +${aAmt} ${LABEL[a]} and +${bAmt} ${LABEL[b]}.`
    };
}

const CONSUMABLE_KEYS=["zombie","luckyLaunch","forceField","pocketSave","hellsChain","comeback"];
const CONSUMABLE_META={
    zombie:{name:"ZOMBIE",games:3,shopCd:2,rarity:"uncommon",
        body:"For the next 3 games, once per point, if your Bey is spin finished only, respawn with 5 RPM where it was finished."},
    luckyLaunch:{name:"LUCKY LAUNCH",games:3,shopCd:2,rarity:"uncommon",
        body:"For the next 3 games, every launch for you is 1 tier higher than chosen."},
    forceField:{name:"FORCE FIELD",games:2,shopCd:2,rarity:"uncommon",
        body:"For the next 2 games, the first big impact triggers Hurricane on you once for 1.3 seconds every round."},
    pocketSave:{name:"POCKET SAVE",games:1,shopCd:2,rarity:"uncommon",
        body:"For the next Xtreme scored on you, it converts to 1 point."},
    hellsChain:{name:"HELLS CHAIN",games:4,shopCd:2,rarity:"rare",
        body:"For the next 4 games, if you hit the opponent in 1.7 second successions, gain 10% knockback (stack max 70%)."},
    comeback:{name:"COMEBACK SPIN",games:4,shopCd:2,rarity:"rare",
        body:"For the next 4 games, when your RPM becomes 30, you get one small burst of movement and 5 RPM recovery."}
};
const TRADEOFFS=[
    ["attack",3,"stamina",-1],
    ["knockback",3,"stamina",-1],
    ["defense",3,"stamina",-1],
    ["mobility",3,"knockback",-1],
    ["balance",3,"mobility",-1],
    ["stamina",3,"balance",-1],
    ["attack",3,"defense",-1],
    ["stamina",3,"attack",-1]
];

function emptyConsumables(){
    const o={}; CONSUMABLE_KEYS.forEach(k=>o[k]=0); return o;
}
function ensureRunShape(r){
    if(!r) return r;
    r.consumables={...emptyConsumables(),...(r.consumables||{})};
    r.shopCooldown=r.shopCooldown||{};
    r.matchBuffs=Object.assign({burst2:0,burst2Stat:null,dashHaste:false}, r.matchBuffs||{});
    r.abilityBonus=Number(r.abilityBonus)||0;
    r.blessed=!!r.blessed;
    r.hellsChainPct=Number(r.hellsChainPct)||0;
    r.hellsChainLastAt=Number(r.hellsChainLastAt)||0;
    return r;
}

function makePlus2Minus1Card(){
    const up=pick(STATS);
    const down=pick(STATS.filter(s=>s!==up));
    const card=makeStatCard("common",up,2,down,-1);
    card.shopId="plus2minus1";
    card.body=`+2 ${LABEL[up]}, −1 ${LABEL[down]}.`;
    return card;
}
function makeBurst2Card(){
    const a=pick(STATS);
    const b=pick(STATS.filter(s=>s!==a))||a;
    return {
        id:"burst2-"+Math.random().toString(16).slice(2),
        rarity:"common",kind:"stat",shopId:"burst2",
        stat:a,amount:3,tempStat:b,tempAmt:2,tempGames:2,
        title:`${LABEL[a]} +3 · ${LABEL[b]} +2 FOR 2 GAMES`,
        kicker:"COMMON",
        body:`+3 ${LABEL[a]} now. +2 ${LABEL[b]} for the next 2 games. Can't stack.`
    };
}
function makeConsumableCard(id){
    const meta=CONSUMABLE_META[id];
    return {
        id:"cons-"+id+"-"+Math.random().toString(16).slice(2),
        rarity:meta.rarity,kind:"consumable",shopId:id,consumable:id,games:meta.games,
        title:meta.name,kicker:meta.rarity.toUpperCase(),body:meta.body
    };
}
function makeDashHasteCard(){
    return {
        id:"dash-haste-"+Math.random().toString(16).slice(2),
        rarity:"rare",kind:"dash-haste",shopId:"dashHaste",
        title:"15% DASH COOLDOWN",kicker:"RARE",
        body:"Dash cooldown is 15% faster for the rest of this game."
    };
}
function makeAbilityChargeCard(){
    return {
        id:"ability-charge-"+Math.random().toString(16).slice(2),
        rarity:"rare",kind:"ability-charge",shopId:"abilityCharge",
        title:"+1 ABILITY CHARGE",kicker:"RARE",
        body:"+1 ability charge for the rest of the run. Permanent."
    };
}
function makeBlessedCard(){
    return {
        id:"blessed-"+Math.random().toString(16).slice(2),
        rarity:"legendary",kind:"blessed",shopId:"blessed",
        title:"BLESSED",kicker:"LEGENDARY",
        body:"After every game get +2 in a random stat. Permanent."
    };
}
function makePlus1Plus1Card(){
    const a=pick(STATS);
    const b=pick(STATS.filter(s=>s!==a))||a;
    const card=makeDualStatCard(a,1,b,1);
    card.shopId="plus1plus1";
    card.title=`${LABEL[a]} +1 · ${LABEL[b]} +1`;
    card.body="Random stat +1 · random stat +1.";
    return card;
}
function makePlus3Card(){
    const stat=pick(STATS);
    const card=makeStatCard("rare",stat,3);
    card.shopId="plus3";
    card.body="Random stat +3. Clean bump.";
    return card;
}
function shopBlocked(id){
    const r=run();
    if(!r||!id) return false;
    if((Number(r.shopCooldown?.[id])||0)>0) return true;
    if(id==="burst2") return (Number(r.matchBuffs?.burst2)||0)>0;
    if(CONSUMABLE_KEYS.includes(id)) return (Number(r.consumables?.[id])||0)>0;
    if(id==="blessed") return !!r.blessed;
    if(id==="dashHaste") return !!r.matchBuffs?.dashHaste;
    if(id==="abilityCharge") return (Number(r.abilityBonus)||0)>=1;
    return false;
}
function cardKey(card){
    return card.shopId||(card.kind+card.title+(card.stat||"")+(card.evolve||"")+(card.modifierId||"")+(card.part||""));
}

function makeOfferCard(rarity,blade,modifierId,opts){
    const r=run();
    const forCpu=!!opts?.forCpu;
    if(forCpu) return makeCpuOfferCard(rarity,blade,modifierId);
    if(rarity==="common"){
        const pool=[makePlus2Minus1Card(),makeBurst2Card()].filter(c=>!shopBlocked(c.shopId));
        return pool.length?pick(pool):makePlus2Minus1Card();
    }
    if(rarity==="uncommon"){
        const cons=["zombie","luckyLaunch","forceField","pocketSave"]
            .filter(id=>!shopBlocked(id))
            .map(makeConsumableCard);
        const trades=TRADEOFFS.map(([a,aa,b,ba])=>makeStatCard("uncommon",a,aa,b,ba));
        const pool=cons.concat(trades);
        return pool.length?pick(pool):makePlus2Minus1Card();
    }
    if(rarity==="rare"){
        const pool=[];
        if(!shopBlocked("hellsChain")) pool.push(makeConsumableCard("hellsChain"));
        if(!shopBlocked("comeback")) pool.push(makeConsumableCard("comeback"));
        if(!shopBlocked("dashHaste")) pool.push(makeDashHasteCard());
        if(!shopBlocked("abilityCharge")) pool.push(makeAbilityChargeCard());
        pool.push(makePlus1Plus1Card());
        pool.push(makePlus3Card());
        pool.push(makeReforgeCard("bit"));
        pool.push(makeReforgeCard("ratchet"));
        pool.push(makeAbilitySwapCard(blade||r?.blade, r?.abilityId));
        return pool.length?pick(pool):makePlus2Minus1Card();
    }
    if(rarity==="legendary"){
        const pool=[];
        if(!shopBlocked("blessed")) pool.push(makeBlessedCard());
        const mods=MODIFIERS.filter(m=>m.id!==modifierId);
        (mods.length?mods:MODIFIERS).forEach(m=>pool.push(makeModifierCard(m)));
        return pick(pool.length?pool:[makeBlessedCard()]);
    }
    const form=nextFormCard();
    if(form) return form;
    return makeOfferCard("uncommon",blade,modifierId);
}

function makeCpuOfferCard(rarity,blade,modifierId){
    if(rarity==="common") return makeCommonCard(blade,true);
    if(rarity==="uncommon"){
        const row=pick(TRADEOFFS);
        return makeStatCard("uncommon",row[0],row[1],row[2],row[3]);
    }
    if(rarity==="rare"){
        const roll=Math.random();
        if(roll<0.28 && Number(run()?.matchIndex)!==18){
            return makeReforgeCard(Math.random()<0.5?"bit":"ratchet");
        }
        if(roll<0.58) return makePlus1Plus1Card();
        return makePlus3Card();
    }
    if(rarity==="legendary"){
        const pool=MODIFIERS.filter(m=>m.id!==modifierId);
        return makeModifierCard(pick(pool.length?pool:MODIFIERS));
    }
    return makeOfferCard("uncommon",blade,modifierId,{forCpu:true});
}

function applyCpuCard(card){
    const r=run();
    if(!r||!card) return;
    if(card.kind==="stat"){
        r.cpuBonuses[card.stat]=(r.cpuBonuses[card.stat]||0)+card.amount;
        if(card.downStat) r.cpuBonuses[card.downStat]=(r.cpuBonuses[card.downStat]||0)+card.downAmt;
        if(card.secondStat) r.cpuBonuses[card.secondStat]=(r.cpuBonuses[card.secondStat]||0)+card.secondAmt;
    }else if(card.kind==="modifier"){
        r.cpuModifier={id:card.modifierId};
    }else if(card.kind==="evolve"){
        STATS.forEach(k=>{r.cpuBonuses[k]=(r.cpuBonuses[k]||0)+2;});
    }else if(card.kind==="reforge"){
        if(Number(r.matchIndex)!==18){
            const committed=pickCommittedParts(r.cpuBlade,{
                bitName:r.cpuBit?.name,
                ratchetName:r.cpuRatchet?.name
            });
            if(card.part==="bit") r.cpuBit=committed.bit||r.cpuBit;
            else r.cpuRatchet=committed.ratchet||r.cpuRatchet;
        }
    }else if(card.kind==="ability-swap"){
        const pickId=pick(card.choices&&card.choices.length?card.choices:["hurricane"]);
        r.cpuAbilityId=pickId;
    }
    r.cpuHistory=r.cpuHistory||[];
    r.cpuHistory.push(card);
}

function grantCpuStack(){
    const r=run();
    const plan=cpuStackPlan();
    r.cpuBonuses=emptyBonuses();
    r.cpuHistory=[];
    r.cpuModifier=null;
    r.cpuAbilityId=null;
    for(let i=0;i<plan.powerN;i++){
        const card=makeOfferCard(
            rarityRoll(r.matchIndex,r.startingTier),
            r.cpuBlade,
            r.cpuModifier?.id,
            {forCpu:true}
        );
        applyCpuCard(card);
    }
    const weakN=plan.toyN+plan.padN;
    for(let i=0;i<weakN;i++){
        const focus=focusedStat(r.cpuBlade);
        applyCpuCard(makeStatCard("common",focus,1));
    }
    grantCpuPressure(cpuStackLead()+bossExtraStacks());
}

function bossExtraStacks(){
    const m=Number(run()?.matchIndex)||1;
    if(m===6) return 2;
    if(m===12) return 3;
    if(m===18) return 3;
    if(m>FINAL_MATCH) return 1+Math.min(3,Math.floor((m-FINAL_MATCH)/4));
    return 0;
}

function battleCombo(side){
    const stats=side==="cpu"?cpuEffective():playerEffective();
    const ovr=round(Object.values(stats).reduce((a,b)=>a+b,0)/7);
    return {stats,ovr,meta:rogueDisplayMeta(side),compatibility:80,physical:{}};
}

function applyLiveToBattle(){
    if(!NEW_BATTLE?.player || !isActive()) return;
    NEW_BATTLE.player.stats=playerEffective();
    NEW_BATTLE.cpu.stats=cpuEffective();
}

function refreshAfterDebug(){
    applyLiveToBattle();
    persist();
    if(Game.screen==="rogueHub") showHub();
    else if(Game.screen==="comboCheck") showComboCard();
}

function syncLoadout(){
    const r=run();
    if(!r) return;
    if(Number(r.matchIndex)===18||r.finalBoss) lockSharkKit();
    Game.player.blade=Object.assign({}, r.blade||{}, r.abilityId?{abilityId:r.abilityId}:{});
    Game.player.ratchet=r.ratchet;
    Game.player.bit=r.bit;
    Game.player.spin=r.blade?.spin||"Right";
    const p=battleCombo("player");
    Game.player.stats=p.stats;
    Game.player.comboOVR=p.ovr;
    Game.player.comboMeta=p.meta;
    Game.cpu.blade=Object.assign({}, r.cpuBlade||{}, r.cpuAbilityId?{abilityId:r.cpuAbilityId}:{});
    Game.cpu.ratchet=r.cpuRatchet;
    Game.cpu.bit=r.cpuBit;
    Game.cpu.spin=r.cpuBlade?.spin||"Right";
    const c=battleCombo("cpu");
    Game.cpu.stats=c.stats;
    Game.cpu.comboOVR=c.ovr;
    Game.cpu.comboMeta=c.meta;
}

function startTier(){
    const t=String(run()?.startingTier||"");
    if(t==="Bronze"||t==="bronze") return "Bronze";
    if(t==="Gold"||t==="gold") return "Gold";
    return "Silver";
}
function formTier(){
    const t=String(run()?.currentRogueTier||"Bronze");
    if(t==="Gold"||t==="gold") return "Gold";
    if(t==="Silver"||t==="silver") return "Silver";
    return "Bronze";
}
function inEndless(){
    return (Number(run()?.matchIndex)||1)>FINAL_MATCH;
}
function canEnhance(){
    const r=run();
    if(!r||r.enhanced||inEndless()) return false;
    const start=startTier();
    const m=Number(r.matchIndex)||1;
    if(start==="Gold") return false;
    if(start==="Bronze") return m>=5;
    return formTier()==="Silver" && m>=8;
}
function canEvolve(){
    const r=run();
    if(!r||inEndless()) return false;
    const start=startTier();
    const form=formTier();
    const m=Number(r.matchIndex)||1;
    if(start==="Bronze") return false;
    if(start==="Silver") return form==="Bronze" && m>=3;
    if(form==="Bronze") return m>=3;
    if(form==="Silver") return m>=9;
    return false;
}
function nextFormCard(){
    if(canEvolve()){
        return makeEvolveCard(startTier()==="Gold"&&formTier()==="Silver"?"final":"evolve");
    }
    if(canEnhance()) return makeEvolveCard("enhance");
    return null;
}
function lowestStat(stats){
    let best=STATS[0], n=1e9;
    STATS.forEach(k=>{
        const v=Number(stats?.[k])||70;
        if(v<n){n=v;best=k;}
    });
    return best;
}
function peakStat(stats){
    let best=STATS[0], n=-1e9;
    STATS.forEach(k=>{
        const v=Number(stats?.[k])||70;
        if(v>n){n=v;best=k;}
    });
    return best;
}

function cpuPowerTarget(playerPow,match,boss){
    const r=run();
    const tier=String(r.startingTier||"");
    const night=r.cpuNight||cpuNightRoll();
    r.cpuNight=night;
    let band;
    if(boss){
        if(match===18) band=1.08;
        else if(match===12) band=1.055;
        else band=1.04;
        if(night==="easy") band-=0.015;
        if(night==="hard") band+=0.015;
    }else if(night==="easy") band=0.94+Math.random()*0.04;
    else if(night==="even") band=0.99+Math.random()*0.03;
    else band=1.03+Math.random()*0.04;
    if(!boss){
        if(tier==="Gold" && match<=2 && night!=="hard") band=Math.min(band,0.98);
        // Bronze open stays spicy on even nights. Hard nights already sit above 1.00 — don't stack both.
        if(tier==="Bronze" && match<=2 && night==="even") band=Math.min(1.06,band+0.02);
        if(tier==="Bronze" && match>=13){
            if(night==="easy") band=Math.min(band,0.96);
            else if(night==="even") band=Math.min(band,0.99);
            else band=Math.min(band,1.04);
        }
        band=clamp(band,0.93,1.08);
    }
    return playerPow*band;
}

function fillCpuScale(target){
    const r=run();
    const base=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    const stacked=mergeStats(base,r.cpuBonuses);
    const pow=powerOf(stacked)||70;
    const gap=(target-pow);
    const delta=clamp(gap*0.48,-7,8);
    r.cpuScale=emptyBonuses();
    STATS.forEach(k=>{
        const have=Number(stacked[k])||70;
        const identity=(have-pow)*0.06;
        r.cpuScale[k]=round(clamp(delta+identity,-7,8));
    });
}

function playableBlades(){
    return Object.values(BLADE_ENGINE||{}).filter(b=>b&&!b.hidden);
}
function sharkScaleBlade(){
    return (typeof BLADE_ENGINE!=="undefined"&&BLADE_ENGINE.shark_scale)||
        Object.values(BLADE_ENGINE||{}).find(b=>b.name==="Shark Scale")||null;
}
function cpuLane(match){
    if(match===18) return "final";
    if(match<=5) return "Bronze";
    if(match<=11) return "Silver";
    if(match===12) return "Gold";
    return "Gold";
}
function generateCpu(){
    const r=run();
    r.cpuNight=cpuNightRoll();
    const playerPow=powerOf(playerEffective());
    const match=r.matchIndex;
    const boss=!!BOSS_AT[match];
    r.boss=boss;
    r.finalBoss=match===18;
    r.cpuPowerTarget=cpuPowerTarget(playerPow,match,boss);

    if(match===18){
        r.cpuBlade=sharkScaleBlade()||pick(playableBlades());
        const parts=sharkBossParts();
        r.cpuRatchet=parts.ratchet;
        r.cpuBit=parts.bit;
    }else{
        const blades=playableBlades();
        let wantTier=cpuLane(match);
        if(match>FINAL_MATCH && Math.random()<0.28) wantTier="Silver";
        const pool=blades.filter(b=>b.tier===wantTier);
        r.cpuBlade=pick(pool.length?pool:blades);
        const parts=cpuCompetence(match)
            ? pickCommittedParts(r.cpuBlade)
            : starterParts(r.cpuBlade);
        r.cpuRatchet=parts.ratchet;
        r.cpuBit=parts.bit;
    }
    grantCpuStack();
    if(match===18) lockSharkKit();
    fillCpuScale(r.cpuPowerTarget);
    syncLoadout();
}

function lockSharkKit(){
    const r=run();
    if(!r) return;
    const parts=sharkBossParts();
    r.cpuRatchet=parts.ratchet;
    r.cpuBit=parts.bit;
}

function rarityRoll(match,tier){
    const t=String(tier||"");
    let common=62,uncommon=24,rare=9,legendary=4,evolve=1;
    if(t==="Bronze"){rare+=3;legendary+=1;evolve+=1.2;}
    if(t==="Gold"){common+=8;rare-=2;legendary-=0.5;evolve-=0.4;}
    if(match>=3){
        if(t==="Bronze"){rare+=2;legendary+=2;evolve+=1;}
        else if(t==="Gold"){common+=4;uncommon+=1;}
        else {rare+=1;legendary+=1.5;evolve+=0.6;}
    }
    if(match>=6){
        if(t==="Bronze"){rare+=2;legendary+=2;evolve+=1.8;}
        else if(t==="Gold"){common+=3;uncommon+=1;legendary+=0.4;}
        else {rare+=1;legendary+=1;evolve+=1.2;}
    }
    if(match>=12 && t==="Bronze"){rare+=1;legendary+=1;evolve+=0.8;}
    if(inEndless()) evolve=0;
    if(run()?.enhanced){rare+=2;legendary+=1.5;common=Math.max(8,common-3);}
    const total=common+uncommon+rare+legendary+evolve;
    let roll=Math.random()*total;
    if((roll-=common)<0) return "common";
    if((roll-=uncommon)<0) return "uncommon";
    if((roll-=rare)<0) return "rare";
    if((roll-=legendary)<0) return "legendary";
    return "evolve";
}

function focusedStat(blade){
    const t=String(blade?.type||"");
    if(t==="Attack") return pick(["attack","knockback","mobility"]);
    if(t==="Defense") return pick(["defense","balance","stamina"]);
    if(t==="Stamina") return pick(["stamina","balance","defense"]);
    return pick(STATS);
}

function makeStatCard(rarity,stat,amount,downStat,downAmt){
    const title=downStat
        ? `${LABEL[stat]} ${amount>0?"+":""}${amount}  /  ${LABEL[downStat]} ${downAmt}`
        : `${LABEL[stat]} ${amount>0?"+":""}${amount}`;
    return {
        id:"stat-"+stat+"-"+amount+"-"+Math.random().toString(16).slice(2),
        rarity,kind:"stat",stat,amount,downStat,downAmt:downAmt||0,
        title,kicker:rarity.toUpperCase(),
        body:downStat
            ? `Tradeoff. ${LABEL[stat]} climbs, ${LABEL[downStat]} pays.`
            : `Clean ${LABEL[stat]} bump. Safe growth.`
    };
}

function makeReforgeCard(kind){
    const part=kind==="bit"?"BIT":"RATCHET";
    return {
        id:"reforge-"+kind+"-"+Math.random().toString(16).slice(2),
        rarity:"rare",kind:"reforge",part:kind,shopId:"reforge-"+kind,
        title:part+" REFORGE",kicker:"RARE",
        body:`Offer three ${part.toLowerCase()}s. Pick one. Physics change with the part.`
    };
}

function makeModifierCard(mod){
    return {
        id:"mod-"+mod.id+"-"+Math.random().toString(16).slice(2),
        rarity:"legendary",kind:"modifier",modifierId:mod.id,
        title:mod.name,kicker:"LEGENDARY",
        body:mod.blurb+" Only one modifier can be active."
    };
}

function makeEvolveCard(type){
    const map={
        enhance:{
            title:"ENHANCED TIER",
            kicker:"ENHANCE",
            body:"One and done. +5 on your best 3 stats, +3 on the rest. Later upgrades get +1 extra. Permanent honeycomb on the plate. Slightly better shop luck."
        },
        evolve:{
            title:"TIER EVOLUTION",
            kicker:"EVOLVE",
            body:"The Bey stays itself. Form steps up. Shop bonuses stay. Plate retints."
        },
        final:{
            title:"GOLD FORM",
            kicker:"EVOLVE",
            body:"Peak form. The bronze nerf falls off. This is Gold's late paycheck."
        }
    };
    const m=map[type]||map.evolve;
    return {
        id:"evo-"+type+"-"+Math.random().toString(16).slice(2),
        rarity:"evolve",kind:"evolve",evolve:type,
        title:m.title,kicker:m.kicker||"EVOLVE",body:m.body
    };
}

function currentAbilityId(blade,override){
    if(override && typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.META?.[override]) return override;
    if(typeof SpinWarsAbilities==="undefined") return null;
    return SpinWarsAbilities.KITS?.[blade?.name]||null;
}

function pickAbilityChoices(blade,override){
    const meta=(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.META)||{};
    const cur=currentAbilityId(blade,override);
    const pool=Object.keys(meta).filter(id=>id!==cur);
    return shuffle(pool).slice(0,2);
}

function makeAbilitySwapCard(blade,override){
    const choices=pickAbilityChoices(blade,override);
    return {
        id:"ability-swap-"+Math.random().toString(16).slice(2),
        rarity:"rare",kind:"ability-swap",choices,
        title:"ABILITY SWAP",kicker:"RARE",
        body:"See two kits from the pool. Pick one, or back out and keep yours."
    };
}

function generateOffers(){
    const r=run();
    ensureRunShape(r);
    const cards=[];
    const used=new Set();
    let guard=0;
    while(cards.length<3 && guard++<36){
        const rarity=rarityRoll(r.matchIndex,r.startingTier);
        const card=makeOfferCard(rarity,r.blade,r.activeModifier?.id);
        if(!card) continue;
        const key=cardKey(card);
        if(used.has(key)) continue;
        if(shopBlocked(card.shopId)) continue;
        used.add(key);
        cards.push(card);
    }
    while(cards.length<3){
        const fill=makePlus2Minus1Card();
        const key=cardKey(fill);
        if(used.has(key)){ cards.push(fill); break; }
        used.add(key);
        cards.push(fill);
    }
    injectFormPity(cards);
    if(r.shopGuarantee==="rare-or-legendary"){
        const g=Math.random()<0.55?"rare":"legendary";
        const guaranteed=makeOfferCard(g,r.blade,r.activeModifier?.id);
        if(guaranteed && guaranteed.kind!=="evolve"){
            const idx=cards.findIndex(c=>c.kind!=="evolve");
            cards[idx>=0?idx:0]=guaranteed;
            r._lockedOffer=guaranteed;
        }
        r.shopGuarantee=null;
    }
    r.offers=cards.slice(0,3);
    if(nextFormCard()){
        const hasForm=r.offers.some(c=>c.kind==="evolve");
        r.hubsWithoutForm=hasForm?0:(Number(r.hubsWithoutForm)||0)+1;
    }
}

function injectFormPity(cards){
    const r=run();
    const need=nextFormCard();
    if(!need||!cards) return;
    if(cards.some(c=>c.kind==="evolve")) return;
    const hard=r.matchIndex===6||r.matchIndex===12;
    const soft=(Number(r.hubsWithoutForm)||0)>=4;
    if(!hard && !soft) return;
    cards[cards.length?cards.length-1:0]=need;
}

function enhanceBumps(stats){
    const ranked=STATS.slice().sort((a,b)=>{
        const d=(Number(stats[b])||0)-(Number(stats[a])||0);
        return d||STATS.indexOf(a)-STATS.indexOf(b);
    });
    const top=new Set(ranked.slice(0,3));
    const bumps={};
    STATS.forEach(k=>{bumps[k]=top.has(k)?5:3;});
    return bumps;
}

function applyStatCard(card){
    const r=run();
    ensureRunShape(r);
    const before={...playerEffective()};
    const extra=r.enhanced&&Number(card.amount)>0?1:0;
    r.bonuses[card.stat]=(r.bonuses[card.stat]||0)+card.amount+extra;
    if(card.downStat) r.bonuses[card.downStat]=(r.bonuses[card.downStat]||0)+card.downAmt;
    if(card.secondStat){
        const extra2=r.enhanced&&Number(card.secondAmt)>0?1:0;
        r.bonuses[card.secondStat]=(r.bonuses[card.secondStat]||0)+card.secondAmt+extra2;
    }
    if(card.tempStat && card.tempGames){
        r.matchBuffs.burst2=Number(card.tempGames)||2;
        r.matchBuffs.burst2Stat=card.tempStat;
    }
    const after={...playerEffective()};
    return {before,after,card};
}

function applyConsumableCard(card){
    const r=run();
    ensureRunShape(r);
    const before={...playerEffective()};
    const id=card.consumable||card.shopId;
    r.consumables[id]=Number(card.games)||CONSUMABLE_META[id]?.games||1;
    return {before,after:{...playerEffective()},card};
}
function applyBlessedCard(card){
    const r=run();
    ensureRunShape(r);
    const before={...playerEffective()};
    r.blessed=true;
    return {before,after:{...playerEffective()},card};
}
function applyDashHasteCard(card){
    const r=run();
    ensureRunShape(r);
    const before={...playerEffective()};
    r.matchBuffs.dashHaste=true;
    return {before,after:{...playerEffective()},card};
}
function applyAbilityChargeCard(card){
    const r=run();
    ensureRunShape(r);
    const before={...playerEffective()};
    r.abilityBonus=(Number(r.abilityBonus)||0)+1;
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.grantCharge && NEW_BATTLE?.active){
        SpinWarsAbilities.grantCharge("player");
    }
    return {before,after:{...playerEffective()},card};
}

function applyModifierCard(card){
    const r=run();
    const lost=r.activeModifier?modifierById(r.activeModifier.id):null;
    r.activeModifier={id:card.modifierId};
    return {lost,now:modifierById(card.modifierId),card};
}

function applyEvolveCard(card){
    const r=run();
    const before={...playerEffective()};
    if(card.evolve==="enhance"){
        if(r.enhanced) return {before,after:{...playerEffective()},card,tier:r.currentRogueTier};
        const bumps=enhanceBumps(before);
        STATS.forEach(k=>{r.bonuses[k]=(r.bonuses[k]||0)+bumps[k];});
        r.enhanced=true;
        return {before,after:{...playerEffective()},card,tier:r.currentRogueTier,enhanced:true};
    }
    if(card.evolve==="evolve"){
        r.currentRogueTier="Silver";
        if(startTier()==="Gold"){
            STATS.forEach(k=>{r.startScale[k]=round((Number(r.startScale[k])||0)*0.5);});
        }else{
            r.startScale=emptyBonuses();
        }
    }
    if(card.evolve==="final"){
        r.currentRogueTier="Gold";
        r.startScale=emptyBonuses();
    }
    return {before,after:{...playerEffective()},card,tier:r.currentRogueTier};
}

function applyDebugCard(card){
    if(card.kind==="stat") applyStatCard(card);
    if(card.kind==="modifier") applyModifierCard(card);
    if(card.kind==="evolve") applyEvolveCard(card);
    if(card.kind==="reforge") return "reforge";
    if(card.kind==="ability-swap") return "ability-swap";
    if(card.kind==="consumable") applyConsumableCard(card);
    if(card.kind==="blessed") applyBlessedCard(card);
    if(card.kind==="dash-haste") applyDashHasteCard(card);
    if(card.kind==="ability-charge") applyAbilityChargeCard(card);
    return "ok";
}

function allCatalog(){
    const r=run();
    const list=[];
    list.push(makePlus2Minus1Card());
    list.push(makeBurst2Card());
    CONSUMABLE_KEYS.forEach(id=>list.push(makeConsumableCard(id)));
    TRADEOFFS.forEach(([a,aa,b,ba])=>list.push(makeStatCard("uncommon",a,aa,b,ba)));
    list.push(makeDashHasteCard());
    list.push(makeAbilityChargeCard());
    list.push(makePlus1Plus1Card());
    list.push(makePlus3Card());
    list.push(makeReforgeCard("bit"));
    list.push(makeReforgeCard("ratchet"));
    list.push(makeAbilitySwapCard(r?.blade, r?.abilityId));
    list.push(makeBlessedCard());
    MODIFIERS.forEach(m=>list.push(makeModifierCard(m)));
    list.push(makeEvolveCard("enhance"));
    list.push(makeEvolveCard("evolve"));
    list.push(makeEvolveCard("final"));
    return list;
}

function commentaryFor(result){
    const r=run();
    const name=r.blade?.name||"This Bey";
    const card=result.card;
    if(card.kind==="stat"){
        if(card.downStat) return `${name} leans into ${LABEL[card.stat]} and gives up ${LABEL[card.downStat]}.`;
        if(card.stat==="stamina") return `${name} is going to hold spin longer.`;
        if(card.stat==="defense"||card.stat==="balance") return `${name} is getting harder to move.`;
        if(card.stat==="attack"||card.stat==="knockback") return `${name} is hitting with more weight.`;
        return `${name} picked up more ${LABEL[card.stat]}.`;
    }
    if(card.kind==="modifier"){
        if(result.lost) return `${result.now.name} replaces ${result.lost.name}. One identity at a time.`;
        return `${result.now.name} is live. Watch the condition in battle.`;
    }
    if(card.kind==="evolve"){
        if(card.evolve==="enhance") return `${name} is Enhanced. Best lines jump, and every later bump is a little fatter.`;
        if(card.evolve==="final") return `${name} hits Gold form. The shop was the tax. This is the paycheck.`;
        return `${name} stays itself — the plate just stepped up a form.`;
    }
    if(card.kind==="reforge") return `New ${card.part}. The stadium will feel it.`;
    if(card.kind==="ability-swap") return `${name} takes ${result.abilityName||"a new kit"}. The old one is gone.`;
    if(card.kind==="consumable") return `${name} pockets ${card.title}. ${card.games||CONSUMABLE_META[card.consumable]?.games||1} games.`;
    if(card.kind==="blessed") return `${name} is Blessed. After every match a random stat climbs +2.`;
    if(card.kind==="dash-haste") return `${name} dashes 15% sooner this game.`;
    if(card.kind==="ability-charge") return `${name} carries an extra ability charge for the rest of the run.`;
    return "Build updated.";
}

function el(html){
    const d=document.createElement("div");
    d.innerHTML=html.trim();
    return d.firstElementChild;
}

function matchBannerText(){
    const r=run();
    if(!r) return "";
    const m=r.matchIndex;
    if(m===18) return "ROGUE · FINAL BOSS";
    if(m===6||m===12) return `ROGUE MATCH ${m} / ${FINAL_MATCH} — BOSS`;
    if(m>FINAL_MATCH) return `ROGUE ENDLESS ${m}`;
    return `ROGUE MATCH ${m} / ${FINAL_MATCH}`;
}
function bannerHTML(){
    if(!run()) return "";
    return `<p class="rogue-round-banner">${matchBannerText()}</p>`;
}

function previewModifier(side){
    const r=run();
    const out=emptyBonuses();
    const packed=side==="cpu"?r?.cpuModifier:r?.activeModifier;
    const def=packed?modifierById(packed.id):null;
    if(!def||typeof def.live!=="function") return out;
    const stub={
        rpm:1,x:0,y:0.22,railEngaged:false,
        rogueHeavyArmed:false,rogueCounterArmed:false
    };
    STATS.forEach(k=>{out[k]=def.live(stub,k)||0;});
    return out;
}

function plateDecor(side){
    const r=run();
    if(!r) return null;
    if(side==="cpu" && (Number(r.matchIndex)===18||r.finalBoss)) lockSharkKit();
    const blade=side==="cpu"?r.cpuBlade:r.blade;
    const ratchet=side==="cpu"?r.cpuRatchet:r.ratchet;
    const bit=side==="cpu"?r.cpuBit:r.bit;
    const tintBase=side==="cpu"?cpuPlateBase():playerPlateBase();
    const merged=side==="cpu"?cpuEffective():playerEffective();
    const live=previewModifier(side);
    const stats={};
    const delta={};
    const keys=["attack","knockback","defense","mobility","balance","stamina","burst"];
    keys.forEach(k=>{
        const shown=round((Number(merged[k])||70)+(Number(live[k])||0));
        stats[k]=shown;
        delta[k]=shown-(Number(tintBase[k])||70);
    });
    const ovr=round(Object.values(stats).reduce((a,b)=>a+b,0)/keys.length);
    const packed=side==="cpu"?r.cpuModifier:r.activeModifier;
    const mod=packed?modifierById(packed.id):null;
    const stack=upgradeStack(side);
    const mark=side==="cpu"?(r.finalBoss||r.matchIndex===18?"final":(r.matchIndex===6||r.matchIndex===12?"mini":"")):"";
    const plateTier=side==="cpu"?(r.cpuBlade?.tier||blade?.tier):(r.currentRogueTier||"Bronze");
    return {
        stats,ovr,meta:rogueDisplayMeta(side),delta,mod,stack,stackHTML:upgradeStackHTML(stack),
        enhanced:side==="cpu"?!!r.cpuEnhanced:!!r.enhanced,
        plateTier,
        bossMark:mark||"",
        pressure:side==="cpu"?fightPressureLine():"",
        pressureKind:side==="cpu"?fightPressureKind():""
    };
}

function fightPressureKind(){
    const r=run();
    if(!r) return "";
    if(r.finalBoss||r.matchIndex===18) return "final";
    return r.cpuNight||"even";
}

function fightPressureLine(){
    const r=run();
    if(!r) return "";
    if(r.finalBoss||r.matchIndex===18) return "A dark presence.";
    if(r.cpuNight==="easy") return "You've got this.";
    if(r.cpuNight==="hard") return "They're ahead.";
    return "Even fight.";
}

function bonusStackBoxes(bonuses){
    const boxes=[];
    STATS.forEach(k=>{
        const n=round(Number(bonuses?.[k])||0);
        if(!n) return;
        boxes.push({
            kicker:"UPGRADE",
            title:`${LABEL[k]} ${n>0?"+":""}${n}`,
            down:n<0
        });
    });
    return boxes;
}

function upgradeStack(side){
    const r=run();
    if(!r) return [];
    const bonuses=side==="cpu"?r.cpuBonuses:r.bonuses;
    const hist=side==="cpu"?r.cpuHistory:r.history;
    const boxes=bonusStackBoxes(bonuses);
    const seen={};
    (hist||[]).forEach(card=>{
        if(!card) return;
        if(card.kind==="evolve" && !seen[card.evolve||card.title]){
            seen[card.evolve||card.title]=true;
            boxes.push({
                kicker:card.evolve==="enhance"?"ENHANCE":"EVOLVE",
                title:card.title||"EVOLVE",
                rarity:"evolve"
            });
        }
        if(card.kind==="reforge"){
            boxes.push({kicker:"REFORGE",title:card.title||"REFORGE",rarity:"rare"});
        }
        if(card.kind==="ability-swap"){
            boxes.push({kicker:"ABILITY",title:card.title||"ABILITY SWAP",rarity:"rare"});
        }
    });
    if(side!=="cpu"){
        CONSUMABLE_KEYS.forEach(id=>{
            const n=Number(r.consumables?.[id])||0;
            if(n>0){
                boxes.push({
                    kicker:"LEFT",
                    title:`${CONSUMABLE_META[id].name} ${n} LEFT`,
                    rarity:CONSUMABLE_META[id].rarity
                });
            }
        });
        if((Number(r.matchBuffs?.burst2)||0)>0 && r.matchBuffs.burst2Stat){
            boxes.push({
                kicker:"TEMP",
                title:`${LABEL[r.matchBuffs.burst2Stat]} +2 · ${r.matchBuffs.burst2} LEFT`
            });
        }
        if(r.matchBuffs?.dashHaste){
            boxes.push({kicker:"MATCH",title:"15% DASH CD",rarity:"rare"});
        }
        if(r.blessed){
            boxes.push({kicker:"PERMANENT",title:"BLESSED",rarity:"legendary"});
        }
        if((Number(r.abilityBonus)||0)>0){
            boxes.push({kicker:"PERMANENT",title:`ABILITY +${r.abilityBonus}`,rarity:"rare"});
        }
    }
    return boxes;
}

function upgradeStackHTML(stack){
    if(!stack||!stack.length) return "";
    return `<div class="vs-upgrade-stack">${stack.map(b=>
        `<div class="vs-upgrade-box${b.down?" down":" up"}${b.rarity?" "+b.rarity:""}"><small>${b.kicker}</small><b>${b.title}</b></div>`
    ).join("")}</div>`;
}

function mountDevButton(){
    document.getElementById("rogueDevBtn")?.remove();
    if(Game.mode!=="rogue") return;
    const btn=document.createElement("button");
    btn.id="rogueDevBtn";
    btn.type="button";
    btn.className="rogue-dev-btn";
    btn.textContent="DEV";
    btn.onclick=()=>toggleDev();
    document.body.appendChild(btn);
}

function toggleDev(){
    const existing=document.getElementById("rogueDevPanel");
    if(existing){
        existing.remove();
        document.body.classList.remove("rogue-dev-open");
        return;
    }
    const panel=el(`<aside id="rogueDevPanel" class="rogue-dev-panel">
        <header><b>ROGUE DEV</b><button type="button" id="rogueDevClose">✕</button></header>
        <p class="rogue-dev-copy">${run()?"Add or strip upgrades on the current Bey. Live battle reads these stats.":"Pick a starting Bey first, then every upgrade and modifier is addable here."}</p>
        <div class="rogue-dev-list" id="rogueDevList"></div>
        <details class="rogue-dev-scene">
            <summary>SCENE SKIP</summary>
            <div class="rogue-dev-actions">
                <button type="button" class="menu-btn silver" id="rogueDevJump17">MATCH 17</button>
                <button type="button" class="menu-btn gold" id="rogueDevFinal">FINAL BOSS</button>
                <button type="button" class="menu-btn silver" id="rogueDevOmen">OMEN</button>
                <button type="button" class="menu-btn gold" id="rogueDevWin">WIN ROUND</button>
                <button type="button" class="menu-btn silver" id="rogueDevLose">FORCE MATCH LOSS</button>
                <button type="button" class="menu-btn silver" id="rogueDevClear">CLEAR BONUSES</button>
            </div>
        </details>
        <details class="rogue-dev-scene">
            <summary>GAME CONDITIONS</summary>
            <div class="rogue-dev-actions" id="rogueDevScenes"></div>
        </details>
    </aside>`);
    document.body.appendChild(panel);
    document.body.classList.add("rogue-dev-open");
    const closeDev=()=>{
        panel.remove();
        document.body.classList.remove("rogue-dev-open");
    };
    document.getElementById("rogueDevClose").onclick=closeDev;
    document.getElementById("rogueDevClear").onclick=()=>{
        const r=run();
        if(!r) return;
        r.bonuses=emptyBonuses();
        r.activeModifier=null;
        r.history=[];
        r.enhanced=false;
        r.currentRogueTier="Bronze";
        r.startScale=makeStartScale(r.starterBlade||r.blade,r.starterRatchet||r.ratchet,r.starterBit||r.bit);
        r.consumables=emptyConsumables();
        r.shopCooldown={};
        r.matchBuffs={burst2:0,burst2Stat:null,dashHaste:false};
        r.abilityBonus=0;
        r.blessed=false;
        r.hellsChainPct=0;
        renderDevList();
        refreshAfterDebug();
    };
    document.getElementById("rogueDevJump17")?.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        closeDev();
        jumpToMatch(17);
    });
    document.getElementById("rogueDevOmen")?.addEventListener("click",()=>{
        closeDev();
        jumpToFinalBoss({omen:true});
    });
    document.getElementById("rogueDevFinal")?.addEventListener("click",()=>{
        closeDev();
        jumpToFinalBoss({omen:false});
    });
    document.getElementById("rogueDevWin").onclick=()=>{
        if(!run()) return;
        closeDev();
        if(typeof devAwardSpinRound==="function"){
            devAwardSpinRound("player");
            return;
        }
        stopLiveBattle();
        Game.battle=Game.battle||{score:{player:0,cpu:0}};
        Game.battle.score=Game.battle.score||{player:0,cpu:0};
        Game.battle.score.player=(Number(Game.battle.score.player)||0)+1;
        if(typeof SpinWarsScoreboard!=="undefined" && SpinWarsScoreboard.onFinish){
            SpinWarsScoreboard.onFinish("player","Spin Finish",null);
        }
        const p=Game.battle.score.player;
        const c=Number(Game.battle.score.cpu)||0;
        if(p>=7) onMatchOver("player",p,c,"Spin Finish");
        else persist();
    };
    document.getElementById("rogueDevLose").onclick=()=>{
        if(!run()) return;
        closeDev();
        stopLiveBattle();
        onMatchOver("cpu",Math.min(6,Game.battle?.score?.player||0),7,"Spin Finish");
    };
    const sceneBox=document.getElementById("rogueDevScenes");
    if(sceneBox){
        const names={
            "rookie-tuner":"ROOKIE TUNER","parts-dealer":"PARTS DEALER","rival":"RIVAL",
            "shortcut":"SHORTCUT","coin-flip":"COIN FLIP","shop-secret":"SHOP SECRET",
            "double-or-nothing":"DOUBLE OR NOTHING","autograph":"AUTOGRAPH","clearance":"CLEARANCE",
            "bathroom":"WET TILE","salvage":"SALVAGE","lube":"LUBE","stadium-crew":"STADIUM CREW",
            "coupon":"COUPON"
        };
        SCENARIO_IDS.forEach(id=>{
            const btn=el(`<button type="button" class="menu-btn silver">${names[id]||id}</button>`);
            btn.onclick=()=>{
                const live=run();
                if(!live) return;
                closeDev();
                live._scenarioDone=true;
                showScenario(id);
            };
            sceneBox.appendChild(btn);
        });
    }
    renderDevList();
}

function stopLiveBattle(){
    if(typeof NEW_BATTLE==="undefined" || !NEW_BATTLE) return;
    NEW_BATTLE.active=false;
    NEW_BATTLE.finishPending=true;
    if(NEW_BATTLE.raf) cancelAnimationFrame(NEW_BATTLE.raf);
}

function createRun(blade,ratchet,bit){
    const parts=(ratchet&&bit)?{ratchet,bit}:starterParts(blade);
    const startTier=String(Game.selection?.rogueTier||blade.tier||"Silver");
    Game.mode="rogue";
    Game.rogue={
        runStatus:"running",
        matchIndex:1,
        startingBeyId:blade.name,
        startingTier:startTier,
        currentRogueTier:"Bronze",
        enhanced:false,
        hubsWithoutForm:0,
        blade,ratchet:parts.ratchet,bit:parts.bit,
        starterBlade:blade,starterRatchet:parts.ratchet,starterBit:parts.bit,
        startScale:makeStartScale(blade,parts.ratchet,parts.bit),
        bonuses:emptyBonuses(),
        activeModifier:null,
        history:[],
        offers:[],
        lastResult:null,
        abilityId:null,
        pendingAbilitySwap:null,
        claimedShark:false,
        cpuNight:null,
        cpuPowerTarget:0,
        cpuHistory:[],
        boss:false,
        shopRounds:1,
        skipShop:false,
        shopGuarantee:null,
        consumables:emptyConsumables(),
        shopCooldown:{},
        matchBuffs:{burst2:0,burst2Stat:null,dashHaste:false},
        abilityBonus:0,
        blessed:false,
        hellsChainPct:0,
        hellsChainLastAt:0,
        perfectLaunchMatches:0,
        flavorCall:null,
        _scenarioDone:false
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof SpinWarsScoreboard!=="undefined") SpinWarsScoreboard.beginRun();
    return Game.rogue;
}

function ensureRun(){
    if(run()?.blade) return run();
    const blade=pick(playableBlades());
    if(!blade) return null;
    return createRun(blade);
}

function jumpToMatch(index){
    stopLiveBattle();
    const r=ensureRun();
    if(!r) return;
    const n=Math.max(1,Math.min(Number(index)||1,FINAL_MATCH));
    r.matchIndex=n;
    r._omenHandoff=false;
    r.offers=[];
    r.skipShop=false;
    r.shopRounds=1;
    r._scenarioDone=false;
    Game.mode="rogue";
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof SpinWarsScoreboard!=="undefined") SpinWarsScoreboard.beginMatch();
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    generateCpu();
    showComboCard();
    persist();
}

function jumpToFinalBoss(opts){
    opts=opts||{};
    stopLiveBattle();
    const r=ensureRun();
    if(!r) return;
    r.matchIndex=18;
    r._omenHandoff=false;
    Game.mode="rogue";
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof SpinWarsScoreboard!=="undefined") SpinWarsScoreboard.beginMatch();
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    if(opts.omen){
        showSharkOmen();
        return;
    }
    generateCpu();
    showComboCard();
    persist();
}

function handoffOmen(){
    const r=run();
    if(!r) return false;
    if(Game.screen!=="rogueOmen") return false;
    if(r._omenHandoff) return false;
    r._omenHandoff=true;
    r.matchIndex=18;
    generateCpu();
    showComboCard();
    persist();
    return true;
}

function renderDevList(){
    const box=document.getElementById("rogueDevList");
    if(!box) return;
    const r=run();
    if(!r){
        box.innerHTML=`<p class="rogue-dev-stats">NO RUN · choose a starting Bey</p>`;
        allCatalog().forEach(card=>{
            const row=el(`<div class="rogue-dev-row ${card.rarity}">
                <div><b>${card.title}</b><small>${card.kicker}</small><p>${card.body}</p></div>
            </div>`);
            box.appendChild(row);
        });
        return;
    }
    const stats=playerEffective();
    box.innerHTML=`<p class="rogue-dev-stats">${STATS.map(k=>`${LABEL[k]} ${stats[k]}`).join(" · ")}</p>
        <p class="rogue-dev-stats">MOD ${r.activeModifier?modifierById(r.activeModifier.id).name:"NONE"}</p>`;
    allCatalog().forEach(card=>{
        const row=el(`<div class="rogue-dev-row ${card.rarity}">
            <div><b>${card.title}</b><small>${card.kicker}</small><p>${card.body}</p></div>
            <button type="button" class="menu-btn gold">ADD</button>
        </div>`);
        row.querySelector("button").onclick=()=>{
            if(card.kind==="reforge"){
                document.getElementById("rogueDevPanel")?.remove();
                openReforge(card,true);
                return;
            }
            if(card.kind==="ability-swap"){
                document.getElementById("rogueDevPanel")?.remove();
                openAbilitySwap(card,true);
                return;
            }
            applyDebugCard(card);
            if(card.kind!=="reforge") r.history.push(card);
            renderDevList();
            refreshAfterDebug();
        };
        box.appendChild(row);
    });
}

function bladeByName(name){
    return Object.values(BLADE_ENGINE).find(b=>b.name===name)||null;
}
function ratchetByName(name){
    return (typeof RATCHETS!=="undefined"?RATCHETS:[]).find(r=>r.name===name)||null;
}
function bitByName(name){
    return (selectableBits().find(b=>b.name===name))||null;
}

const SAVE_KEY="spinWarsX.rogue.v1";
const RUNS_KEY="spinWarsX.rogue.runs.v1";
const COOKIE_KEY="swx_rogue";
const RUN_ARCHIVE_CAP=12;

function packModifier(mod){
    if(!mod) return null;
    return {id:mod.id};
}
function packCard(card){
    if(!card) return null;
    return {
        id:card.id,rarity:card.rarity,kind:card.kind,stat:card.stat,
        amount:card.amount,downStat:card.downStat,downAmt:card.downAmt,
        title:card.title,kicker:card.kicker,body:card.body,
        part:card.part,modifierId:card.modifierId,evolve:card.evolve,
        secondStat:card.secondStat,secondAmt:card.secondAmt,
        tempStat:card.tempStat,tempAmt:card.tempAmt,tempGames:card.tempGames,
        shopId:card.shopId,consumable:card.consumable,games:card.games,
        choices:card.choices,abilityId:card.abilityId
    };
}
function packUpgrade(u){
    if(!u) return null;
    return {
        card:packCard(u.card),
        before:u.before||null,
        after:u.after||null,
        partName:u.part?.name||null,
        partKind:u.card?.part||null,
        abilityId:u.abilityId||null,
        abilityName:u.abilityName||null,
        lostId:u.lost?.id||null,
        nowId:u.now?.id||null,
        tier:u.tier||null
    };
}
function unpackUpgrade(raw){
    if(!raw) return null;
    const u={
        card:raw.card||null,
        before:raw.before||null,
        after:raw.after||null,
        tier:raw.tier||null
    };
    if(raw.partName){
        u.part=raw.partKind==="ratchet"?ratchetByName(raw.partName):bitByName(raw.partName);
    }
    if(raw.lostId) u.lost=modifierById(raw.lostId);
    if(raw.nowId) u.now=modifierById(raw.nowId);
    if(raw.abilityId) u.abilityId=raw.abilityId;
    if(raw.abilityName) u.abilityName=raw.abilityName;
    return u;
}

function persistScreen(){
    const s=Game.screen;
    if(s==="battle"||s==="comboCheck") return s==="battle"?"battle":"comboCheck";
    if(s==="matchSummary") return run()?.lastResult?"rogueResults":"comboCheck";
    if(s==="rogueScenario") return run()?.lastResult?"rogueResults":"comboCheck";
    if(s==="rogueRunSummary") return "rogueWin";
    if(s==="rogueRunHistory") return "rogueLanding";
    return s||"comboCheck";
}

function buildSave(){
    const r=run();
    if(!r||r.runStatus==="lost"||!r.blade) return null;
    return {
        v:1,
        savedAt:Date.now(),
        screen:persistScreen(),
        battle:{
            score:{
                player:Number(Game.battle?.score?.player)||0,
                cpu:Number(Game.battle?.score?.cpu)||0
            },
            round:Number(Game.battle?.round)||1,
            matchStarted:!!Game.battle?.matchStarted,
            abilityCharges:Game.battle?.abilityCharges||null
        },
        rogue:{
            runStatus:r.runStatus||"running",
            matchIndex:r.matchIndex||1,
            startingBeyId:r.startingBeyId||r.blade?.name,
            startingTier:r.startingTier,
            currentRogueTier:r.currentRogueTier,
            bladeName:r.blade?.name,
            ratchetName:r.ratchet?.name,
            bitName:r.bit?.name,
            starterBladeName:(r.starterBlade||r.blade)?.name,
            starterRatchetName:(r.starterRatchet||r.ratchet)?.name,
            starterBitName:(r.starterBit||r.bit)?.name,
            startScale:{...emptyBonuses(),...(r.startScale||{})},
            bonuses:{...emptyBonuses(),...(r.bonuses||{})},
            activeModifier:packModifier(r.activeModifier),
            history:(r.history||[]).map(packCard),
            offers:(r.offers||[]).map(packCard),
            lastResult:r.lastResult||null,
            lastUpgrade:packUpgrade(r.lastUpgrade),
            pendingReforge:packCard(r.pendingReforge),
            pendingAbilitySwap:packCard(r.pendingAbilitySwap),
            abilityId:r.abilityId||null,
            cpuAbilityId:r.cpuAbilityId||null,
            cpuPowerTarget:r.cpuPowerTarget||0,
            boss:!!r.boss,
            cpuBladeName:r.cpuBlade?.name,
            cpuRatchetName:r.cpuRatchet?.name,
            cpuBitName:r.cpuBit?.name,
            cpuScale:{...emptyBonuses(),...(r.cpuScale||{})},
            cpuBonuses:{...emptyBonuses(),...(r.cpuBonuses||{})},
            cpuHistory:(r.cpuHistory||[]).map(packCard),
            cpuModifier:packModifier(r.cpuModifier),
            enhanced:!!r.enhanced,
            claimedShark:!!r.claimedShark,
            cpuNight:r.cpuNight||null,
            hubsWithoutForm:Number(r.hubsWithoutForm)||0,
            shopRounds:Number(r.shopRounds)||1,
            skipShop:!!r.skipShop,
            shopGuarantee:r.shopGuarantee||null,
            consumables:{...emptyConsumables(),...(r.consumables||{})},
            shopCooldown:{...(r.shopCooldown||{})},
            matchBuffs:{
                burst2:Number(r.matchBuffs?.burst2)||0,
                burst2Stat:r.matchBuffs?.burst2Stat||null,
                dashHaste:!!r.matchBuffs?.dashHaste
            },
            abilityBonus:Number(r.abilityBonus)||0,
            blessed:!!r.blessed,
            hellsChainPct:Number(r.hellsChainPct)||0,
            perfectLaunchMatches:Number(r.perfectLaunchMatches)||0,
            flavorCall:r.flavorCall||null,
            scoreboardRun:typeof SpinWarsScoreboard!=="undefined"?SpinWarsScoreboard.exportRun():(r.scoreboardRun||null)
        }
    };
}

function writeCookie(value){
    try{
        const encoded=encodeURIComponent(value);
        const payload=encoded.length>3500
            ? encodeURIComponent(JSON.stringify({v:1,has:1}))
            : encoded;
        document.cookie=`${COOKIE_KEY}=${payload}; path=/; max-age=31536000; SameSite=Lax`;
    }catch(_e){}
}
function readCookie(){
    try{
        const parts=document.cookie.split(";");
        for(const part of parts){
            const p=part.trim();
            if(!p.startsWith(COOKIE_KEY+"=")) continue;
            return decodeURIComponent(p.slice(COOKIE_KEY.length+1));
        }
    }catch(_e){}
    return "";
}
function persist(){
    if(Game._viewingArchive) return false;
    const data=buildSave();
    if(!data) return false;
    let json="";
    try{json=JSON.stringify(data);}catch(_e){return false;}
    try{localStorage.setItem(SAVE_KEY,json);}catch(_e){}
    writeCookie(json);
    return true;
}
function loadRaw(){
    let text="";
    try{text=localStorage.getItem(SAVE_KEY)||"";}catch(_e){}
    if(!text) text=readCookie();
    if(!text) return null;
    try{
        const data=JSON.parse(text);
        if(!data||data.v!==1||!data.rogue||!data.rogue.bladeName) return null;
        return data;
    }catch(_e){return null;}
}
function hasSave(){return !!loadRaw();}
function peekSave(){
    const data=loadRaw();
    if(!data) return null;
    return {
        match:data.rogue.matchIndex,
        blade:data.rogue.bladeName,
        score:data.battle?.score,
        screen:data.screen
    };
}
function clearSave(){
    try{localStorage.removeItem(SAVE_KEY);}catch(_e){}
    try{document.cookie=`${COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;}catch(_e){}
}

function loadRunArchive(){
    try{
        const raw=JSON.parse(localStorage.getItem(RUNS_KEY)||"[]");
        return Array.isArray(raw)?raw.filter(e=>e&&(e.status==="won"||e.status==="lost")):[];
    }catch(_e){return [];}
}

function saveRunArchive(list){
    try{localStorage.setItem(RUNS_KEY,JSON.stringify((list||[]).slice(0,RUN_ARCHIVE_CAP)));}catch(_e){}
}

function archiveFinishedRun(status){
    if(status!=="won" && status!=="lost") return;
    const r=run();
    if(!r||!r.blade) return;
    const stats=playerEffective();
    const ovr=round(Object.values(stats).reduce((a,b)=>a+b,0)/STATS.length);
    const sb=typeof SpinWarsScoreboard!=="undefined"?SpinWarsScoreboard.exportRun():null;
    const final=typeof SpinWarsScoreboard!=="undefined"?SpinWarsScoreboard.runFinal():0;
    const entry={
        id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
        endedAt:Date.now(),
        status,
        bladeName:r.blade.name,
        ratchetName:r.ratchet?.name||"",
        bitName:r.bit?.name||"",
        startingBeyId:r.startingBeyId||r.blade.name,
        startingTier:r.startingTier||"",
        matchIndex:r.matchIndex||1,
        stats,
        ovr,
        lastScore:r.lastResult||null,
        scoreboard:sb,
        finalScore:final
    };
    const list=loadRunArchive();
    list.unshift(entry);
    saveRunArchive(list);
}

function runHistoryRowHTML(e){
    const combo=`${e.bladeName||"Bey"} · ${e.ratchetName||"?"} · ${e.bitName||"?"}`;
    const st=e.status==="won"?"WON":"LOST";
    const match=e.status==="won"?`Match ${e.matchIndex||18}`:`Fell at ${e.matchIndex||1}`;
    const statLine=e.stats
        ? STATS.map(k=>`${LABEL[k]} ${e.stats[k]}`).join(" · ")
        : "";
    return `<button type="button" class="rogue-run-row ${e.status}" data-run-id="${e.id}">
        <span class="rogue-run-row-kicker">${st} · ${match}</span>
        <b>${combo}</b>
        <small>OVR ${e.ovr||"—"} · ${Number(e.finalScore)||0} pts</small>
        ${statLine?`<small class="rogue-run-stats">${statLine}</small>`:""}
    </button>`;
}

function bindRunHistoryRows(root){
    (root||document).querySelectorAll(".rogue-run-row").forEach(btn=>{
        btn.onclick=()=>openArchivedRun(btn.getAttribute("data-run-id"));
    });
}

function showRunHistory(){
    Game.mode="rogue";
    Game.quickMatch=false;
    Game.screen="rogueRunHistory";
    Game._viewingArchive=false;
    const past=loadRunArchive();
    const body=past.length
        ? past.map(runHistoryRowHTML).join("")
        : `<p class="rogue-run-empty">No finished runs yet. Win or lose a Rogue run and it shows here.</p>`;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-landing rogue-run-board">
        ${homeBowlHTML()}
        ${homeMarkHTML({compact:true,kicker:"ROGUE RUN",tag:"RUN SCOREBOARD"})}
        <section class="rogue-run-history" aria-label="Finished runs">
            ${body}
        </section>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showLanding()));
    bindRunHistoryRows();
    mountDevButton();
}

function openArchivedRun(id){
    const entry=loadRunArchive().find(e=>String(e.id)===String(id));
    if(!entry) return;
    Game._viewingArchive=true;
    if(typeof SpinWarsScoreboard!=="undefined" && SpinWarsScoreboard.showRunSummary){
        SpinWarsScoreboard.showRunSummary({
            run:entry.scoreboard||{},
            bladeName:entry.bladeName,
            status:entry.status,
            onHome:()=>{Game._viewingArchive=false;showRunHistory();}
        });
        return;
    }
    Game._viewingArchive=false;
}

function hydrate(data){
    const raw=data.rogue;
    const blade=bladeByName(raw.bladeName);
    const ratchet=ratchetByName(raw.ratchetName);
    const bit=bitByName(raw.bitName);
    if(!blade||!ratchet||!bit) return false;
    Game.mode="rogue";
    Game.quickMatch=false;
    Game.rogue={
        runStatus:raw.runStatus||"running",
        matchIndex:raw.matchIndex||1,
        startingBeyId:raw.startingBeyId||blade.name,
        startingTier:raw.startingTier||blade.tier||"Silver",
        currentRogueTier:raw.currentRogueTier||"Bronze",
        enhanced:!!raw.enhanced,
        claimedShark:!!raw.claimedShark,
        cpuNight:raw.cpuNight||null,
        hubsWithoutForm:Number(raw.hubsWithoutForm)||0,
        blade,ratchet,bit,
        starterBlade:bladeByName(raw.starterBladeName)||blade,
        starterRatchet:ratchetByName(raw.starterRatchetName)||ratchet,
        starterBit:bitByName(raw.starterBitName)||bit,
        startScale:{...emptyBonuses(),...(raw.startScale||{})},
        bonuses:{...emptyBonuses(),...(raw.bonuses||{})},
        activeModifier:raw.activeModifier||null,
        history:(raw.history||[]).map(c=>c),
        offers:(raw.offers||[]).map(c=>c),
        lastResult:raw.lastResult||null,
        lastUpgrade:unpackUpgrade(raw.lastUpgrade),
        pendingReforge:raw.pendingReforge||null,
        pendingAbilitySwap:raw.pendingAbilitySwap||null,
        abilityId:raw.abilityId||null,
        cpuAbilityId:raw.cpuAbilityId||null,
        cpuPowerTarget:raw.cpuPowerTarget||0,
        boss:!!raw.boss,
        cpuBlade:bladeByName(raw.cpuBladeName),
        cpuRatchet:ratchetByName(raw.cpuRatchetName),
        cpuBit:bitByName(raw.cpuBitName),
        cpuScale:{...emptyBonuses(),...(raw.cpuScale||(!raw.cpuScale && raw.cpuBonuses?raw.cpuBonuses:{}))},
        cpuBonuses:{...emptyBonuses(),...(raw.cpuScale?raw.cpuBonuses:{})},
        cpuHistory:(raw.cpuHistory||[]).map(c=>c),
        cpuModifier:raw.cpuModifier||null,
        shopRounds:Number(raw.shopRounds)||1,
        skipShop:!!raw.skipShop,
        shopGuarantee:raw.shopGuarantee||null,
        consumables:{...emptyConsumables(),...(raw.consumables||{})},
        shopCooldown:{...(raw.shopCooldown||{})},
        matchBuffs:{
            burst2:Number(raw.matchBuffs?.burst2)||0,
            burst2Stat:raw.matchBuffs?.burst2Stat||null,
            dashHaste:!!raw.matchBuffs?.dashHaste
        },
        abilityBonus:Number(raw.abilityBonus)||0,
        blessed:!!raw.blessed,
        hellsChainPct:Number(raw.hellsChainPct)||0,
        hellsChainLastAt:0,
        perfectLaunchMatches:Number(raw.perfectLaunchMatches)||0,
        flavorCall:raw.flavorCall||null,
        _scenarioDone:false
    };
    if(raw.enhanced===undefined && !(raw.history||[]).some(c=>c&&c.kind==="evolve")){
        Game.rogue.currentRogueTier="Bronze";
    }
    if(!raw.startScale){
        Game.rogue.startScale=makeStartScale(
            Game.rogue.starterBlade,
            Game.rogue.starterRatchet,
            Game.rogue.starterBit
        );
    }
    if(!Game.rogue.cpuBlade||!Game.rogue.cpuRatchet||!Game.rogue.cpuBit){
        generateCpu();
    }
    Game.battle={
        score:{
            player:Number(data.battle?.score?.player)||0,
            cpu:Number(data.battle?.score?.cpu)||0
        },
        round:Number(data.battle?.round)||1,
        matchStarted:!!data.battle?.matchStarted,
        abilityCharges:data.battle?.abilityCharges||null
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    syncLoadout();
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.restoreCharges){
        SpinWarsAbilities.restoreCharges();
    }
    if(typeof SpinWarsScoreboard!=="undefined" && raw.scoreboardRun){
        SpinWarsScoreboard.importRun(raw.scoreboardRun);
    }
    return true;
}

function resumeSave(){
    const data=loadRaw();
    if(!data||!hydrate(data)) return false;
    const screen=data.screen;
    if(screen==="rogueHub") showHub();
    else if(screen==="rogueResults") showResults();
    else if(screen==="rogueUpgrade") showUpgradeResult();
    else if(screen==="rogueReforge" && run().pendingReforge) openReforge(run().pendingReforge,false);
    else if(screen==="rogueAbilitySwap" && run().pendingAbilitySwap) openAbilitySwap(run().pendingAbilitySwap,false);
    else if(screen==="rogueWin") showRunWin();
    else if(screen==="rogueOmen"){
        generateCpu();
        showComboCard();
    }
    else{
        Game.player.launch={angle:"Flat",technique:"Center",setupStage:"quality"};
        showComboCard();
    }
    return true;
}

function showLanding(){
    Game.mode="rogue";
    Game.quickMatch=false;
    Game.screen="rogueLanding";
    Game._viewingArchive=false;
    const save=peekSave();
    const canContinue=!!save && save.blade;
    const continueNote=canContinue
        ? `Match ${save.match||1} · ${save.blade}${save.score?` · ${save.score.player}-${save.score.cpu}`:""}`
        : "No run saved";
    const past=loadRunArchive();
    const boardNote=past.length
        ? `${past.length} finished run${past.length===1?"":"s"}`
        : "No finished runs yet";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home attract rogue-landing">
        <p class="attract-kicker">ROGUE RUN</p>
        <h1 class="attract-title compact">SPIN WARS<span>X</span></h1>
        <p class="attract-tag">One Bey. Eighteen matches. Then the dark.</p>
        <nav class="mode-rail" aria-label="Rogue">
            <button class="mode-tile is-rogue" id="rogueNewGame" type="button">
                <span class="mode-no">NEW</span>
                <span class="mode-copy"><small>NEW RUN</small><b>NEW GAME</b><em>Pick a tier. Build a combo.</em></span>
            </button>
            <button class="mode-tile ${canContinue?"is-play":"is-locked"}" id="rogueContinue" type="button" ${canContinue?"":"disabled aria-disabled=\"true\""}>
                <span class="mode-no">SAVE</span>
                <span class="mode-copy"><small>SAVE</small><b>CONTINUE</b><em>${continueNote}</em></span>
                ${canContinue?"":"<span class=\"mode-lock\">LOCKED</span>"}
            </button>
            <button class="mode-tile" id="rogueScoreboard" type="button">
                <span class="mode-no">LOG</span>
                <span class="mode-copy"><small>HISTORY</small><b>RUN SCOREBOARD</b><em>${boardNote}</em></span>
            </button>
            <button class="mode-help" id="rogueHelp" type="button">How a run works</button>
        </nav>
        <div id="rogueNewConfirm" hidden></div>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("rogueNewGame").onclick=()=>requestNewGame();
    document.getElementById("rogueContinue").onclick=()=>{
        if(!canContinue) return;
        resumeSave();
    };
    document.getElementById("rogueScoreboard").onclick=()=>showRunHistory();
    document.getElementById("rogueHelp").onclick=()=>showHelp();
    mountDevButton();
}

function requestNewGame(){
    if(!hasSave()){
        showTierPick();
        return;
    }
    const save=peekSave();
    const box=document.getElementById("rogueNewConfirm");
    if(!box){showTierPick();return;}
    box.hidden=false;
    box.innerHTML=`<section class="menu-card rogue-intro-card">
        <p class="eyebrow">REPLACE SAVE</p>
        <h2>START A NEW RUN?</h2>
        <p>This wipes Match ${save.match||1} · ${save.blade}. The old file is gone once you pick a Bey.</p>
        <button class="rip-btn" id="rogueNewConfirmGo" type="button">START NEW GAME</button>
        <button class="menu-btn silver" id="rogueNewConfirmNo" type="button">BACK</button>
    </section>`;
    document.getElementById("rogueNewConfirmGo").onclick=()=>showTierPick();
    document.getElementById("rogueNewConfirmNo").onclick=()=>{box.hidden=true;box.innerHTML="";};
}

function showTierPick(){
    Game.mode="rogue";
    Game.screen="rogueTier";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home attract rogue-landing">
        <p class="attract-kicker">NEW RUN</p>
        <h1 class="attract-title compact">SPIN WARS<span>X</span></h1>
        <p class="attract-tag">Pick a tier. Then three blades, three ratchets, three bits.</p>
        <nav class="mode-rail" aria-label="Starting tier">
            <button class="mode-tile is-bronze" type="button" data-tier="Bronze">
                <span class="mode-copy"><small>TIER</small><b>BRONZE</b><em>Hard early, easier late. Enhance after 5. No evolve.</em></span>
            </button>
            <button class="mode-tile is-silver" type="button" data-tier="Silver">
                <span class="mode-copy"><small>TIER</small><b>SILVER</b><em>Middle path. Evolve, then Enhance.</em></span>
            </button>
            <button class="mode-tile is-gold" type="button" data-tier="Gold">
                <span class="mode-copy"><small>TIER</small><b>GOLD</b><em>Easy start, hard late. Climb Bronze → Silver → Gold.</em></span>
            </button>
        </nav>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showLanding()));
    document.querySelectorAll("[data-tier]").forEach(btn=>{
        btn.onclick=()=>startRogueDraft(btn.dataset.tier);
    });
    mountDevButton();
}

function startRogueDraft(tier){
    Game.mode="rogue";
    const t=String(tier||"Bronze");
    const blades=playableBlades().filter(b=>b && !b.hidden && String(b.tier)===t);
    const bladePool=shuffle(blades).slice(0,3);
    const ratchetPool=shuffle(typeof RATCHETS!=="undefined"?RATCHETS.slice():[]).slice(0,3);
    const bitPool=shuffle(
        typeof selectableBits==="function"?selectableBits():[]
    ).slice(0,3);
    Game.selection=Game.selection||{};
    Game.selection.rogueTier=t;
    Game.selection.bladePool=bladePool;
    Game.selection.bladePage=0;
    Game.selection.ratchetPool=ratchetPool;
    Game.selection.bitPool=bitPool;
    if(typeof renderBladeDraft==="function") renderBladeDraft();
    else if(typeof showBladeDraft==="function") showBladeDraft();
    mountDevButton();
}

function startBladePick(){
    showTierPick();
}

function showHelp(){
    Game.screen="rogueHelp";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu rogue-help">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">ROGUE</span>
                <h1>HOW A RUN WORKS</h1>
                <p>Same stadium. One Bey. Eighteen matches, then endless.</p>
            </div>
        </div>
        <section class="menu-card rogue-help-card">
            <p>Pick a tier. Then three blades, three ratchets, three bits — same as Quick Play. Every fight is first to 7. Win the match, choose one upgrade. Lose, and the run is over.</p>
            <p>A run is 18 matches, then the night keeps going. Matches 6 and 12 are minis. Match 18 is Shark Scale on 1-60 Ball. Beat it and you can take that Bey or keep yours, then endless starts.</p>
            <p>New Game: Bronze / Silver / Gold, then three blades from that tier, three ratchets, three bits. Every Bey opens in Bronze form. Silver and Gold keep their shape — highs get pulled toward Bronze, dump stats stay dump. Bronze is a hard start you can leave, then a kinder shop and kinder nights as you snowball. Gold opens gentler and squeezes later. Silver sits in the middle.</p>
            <p>Bronze cannot evolve. After match 5 it can Enhance once — honeycomb, +5 on your best 3, +3 on the rest. Silver can evolve after a few wins, then Enhance. Gold can climb Bronze → Silver → Gold. Form cards wait for those windows. BACK keeps your current form.</p>
            <p>The CPU takes a real card for each stat upgrade you locked in, rolled not copied. Toys (Zombie, reforge, kit swap) and skipped shops give the CPU a weaker +1 instead of a full card, plus a little extra that depends on your starter and the night. Some opponents are easy. Some are ahead. Bronze stays a fight early and eases off later; Gold is the reverse. Mini bosses add extra stacks. Close the app and hit Continue to pick up where you left off.</p>
        </section>
        <p class="home-leagues-label">UPGRADES</p>
        <div class="rogue-offers rogue-help-offers">
            <article class="rogue-offer common"><span class="rogue-offer-kicker">COMMON</span><strong>+2 / −1 · BURST</strong><small>+2 a random stat and −1 another, or +3 now plus +2 for the next 2 games. Commons always cost something.</small></article>
            <article class="rogue-offer uncommon"><span class="rogue-offer-kicker">UNCOMMON</span><strong>TRADEOFFS · CONSUMABLES</strong><small>ATK/KB/DEF/MOB/BAL/STA swaps, plus Zombie (once per point on a spin finish), Lucky Launch, Force Field, and Pocket Save. Remaining uses print on the VS plate.</small></article>
            <article class="rogue-offer rare"><span class="rogue-offer-kicker">RARE</span><strong>GROWTH · REFORGE · TOYS</strong><small>Clean +3 or +1 · +1, plus bit/ratchet reforge, ability swap, Hells Chain, Comeback Spin, dash cooldown, or an extra charge. Rare is the clean bump.</small></article>
            <article class="rogue-offer legendary"><span class="rogue-offer-kicker">LEGENDARY</span><strong>BLESSED · MODIFIERS</strong><small>Blessed stacks forever. Other modifiers replace each other. Vampire and Psyshock live here too. Gold sees this table less.</small></article>
            <article class="rogue-offer evolve"><span class="rogue-offer-kicker">FORM</span><strong>ENHANCE OR EVOLVE</strong><small>That is the real paycheck. Enhance is +5 / +3. Silver evolves then enhances. Gold climbs to Gold form. Toys do not replace this.</small></article>
        </div>
        <section class="menu-card rogue-help-card">
            <p class="eyebrow">MODIFIERS</p>
            <p>Last Stand and Final Spin kick in when you are almost out of spin. Berserker and First Blood hit harder while you are still healthy. Psyshock hits 60% then 160%. Vampire can steal a sliver of RPM. Blessed is a permanent after-match bump and does not replace a modifier. Rail Rush and X-Exit Swing want the ring. Pin Lock and Anchor keep you in the middle. Glass Cannon hits harder and dies faster. Heavy Contact and Counterweight answer a real clash.</p>
        </section>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showLanding()));
    mountDevButton();
}

function showIntro(){
    showLanding();
}

function beginRun(blade,ratchet,bit){
    createRun(blade,ratchet,bit);
    generateCpu();
    showComboCard();
    persist();
}

function onStarterPicked(blade,ratchet,bit){
    beginRun(blade, ratchet||Game.player?.ratchet, bit||Game.player?.bit);
}

function decorateVs(root){
    if(!isActive()||!root) return;
    const banner=el(bannerHTML());
    root.insertBefore(banner,root.firstChild);
    const back=root.querySelector(".back-btn");
    if(back) back.onclick=()=>{persist();showLanding();};
    const btn=document.getElementById("battleButton");
    if(btn) btn.textContent="LET IT RIP";
    mountDevButton();
}

function scoreboardLabel(){
    const r=run();
    if(!r) return "first to 7";
    const m=r.matchIndex;
    if(m===18) return "FINAL BOSS · first to 7";
    if(m===6||m===12) return `BOSS · MATCH ${m}/${FINAL_MATCH} · first to 7`;
    if(m>FINAL_MATCH) return `ENDLESS ${m} · first to 7`;
    return `MATCH ${m}/${FINAL_MATCH} · first to 7`;
}

const SCENARIO_CHANCE=0.10;
const SCENARIO_IDS=[
    "rookie-tuner","parts-dealer","rival","shortcut","coin-flip",
    "shop-secret","double-or-nothing","autograph","clearance","bathroom",
    "salvage","lube","stadium-crew","coupon"
];

function applyFlatBonus(map){
    const r=run();
    if(!r) return;
    r.bonuses=r.bonuses||emptyBonuses();
    Object.keys(map||{}).forEach(k=>{
        r.bonuses[k]=(Number(r.bonuses[k])||0)+(Number(map[k])||0);
    });
    syncLoadout();
}
function applyPercentBonus(stat,pct){
    const r=run();
    if(!r) return;
    const cur=Number(playerEffective()[stat])||70;
    const d=Math.max(1,round(Math.abs(cur)*Math.abs(pct)));
    applyFlatBonus({[stat]:pct>=0?d:-d});
    return d;
}
function grantRandomRatchet(){
    const r=run();
    if(!r) return null;
    const pool=(typeof RATCHETS!=="undefined"?RATCHETS:[]).filter(x=>x&&x.name!==r.ratchet?.name);
    const next=pick(pool.length?pool:(typeof RATCHETS!=="undefined"?RATCHETS:[]));
    if(!next) return null;
    r.ratchet=next;
    syncLoadout();
    persist();
    return next;
}
function grantRandomUpgrade(){
    const r=run();
    if(!r) return null;
    let card=null;
    let guard=0;
    while(guard++<16){
        const rolled=makeOfferCard(rarityRoll(r.matchIndex,r.startingTier),r.blade,r.activeModifier?.id);
        if(!rolled) continue;
        if(rolled.kind==="reforge"||rolled.kind==="ability-swap") continue;
        if(rolled.kind==="consumable"||rolled.kind==="blessed"||rolled.kind==="dash-haste"||rolled.kind==="ability-charge") continue;
        if(rolled.shopId==="burst2") continue;
        if(rolled.kind==="evolve"){
            const need=nextFormCard();
            if(!need||rolled.evolve!==need.evolve) continue;
        }
        card=rolled;
        break;
    }
    if(!card) card=makePlus2Minus1Card();
    if(card.kind==="stat") applyStatCard(card);
    else if(card.kind==="modifier") applyModifierCard(card);
    else if(card.kind==="evolve") applyEvolveCard(card);
    r.history=r.history||[];
    r.history.push(card);
    syncLoadout();
    persist();
    return card;
}
function setFlavorCall(line){
    const r=run();
    if(!r) return;
    r.flavorCall=line||null;
}
function skipNextMatchAsWin(){
    const r=run();
    const next=(Number(r.matchIndex)||1)+1;
    if(next===6||next===12||next===18) return false;
    r.matchIndex=next;
    return true;
}
function enterShop(){
    const r=run();
    if(!r) return;
    const rounds=Number(r.shopRounds);
    if(r.skipShop || (Number.isFinite(rounds)&&rounds<=0)){
        r.skipShop=false;
        r.shopRounds=1;
        advanceMatch();
        return;
    }
    if(!Number.isFinite(rounds)||rounds<1) r.shopRounds=1;
    generateOffers();
    showHub();
}
function openShopOrScenario(opts){
    opts=opts||{};
    const r=run();
    if(!r) return;
    const forceId=opts.forceId;
    const roll=opts.roll!==false && !r._scenarioDone && Math.random()<SCENARIO_CHANCE;
    if(forceId || roll){
        r._scenarioDone=true;
        const id=forceId && SCENARIO_IDS.includes(forceId)?forceId:pick(SCENARIO_IDS);
        showScenario(id);
        return;
    }
    enterShop();
}

function scenarioCopy(){
    const r=run();
    const you=r?.blade?.name||"your Bey";
    const foe=r?.cpuBlade?.name||Game.cpu?.blade?.name||"your next opponent";
    return {
        "rookie-tuner":{
            title:"THE ROOKIE TUNER",
            kicker:"SIDELINE",
            body:`A kid with a toolkit jogs up, out of breath. "I can tune ${you}. Won't even charge you."`,
            choices:[
                {id:"accept",label:"ACCEPT",odds:[
                    {p:"40%",text:"+5% Knockback, +5% Stamina, +1 Mobility"},
                    {p:"60%",text:"−2 Defense, −2 Balance, +1 Attack"}
                ]},
                {id:"deny",label:"DENY"}
            ]
        },
        "parts-dealer":{
            title:"THE PARTS DEALER",
            kicker:"SIDELINE",
            body:"A dealer pops a case on the bench and slides a part toward you. \"Been saving this for someone special.\" You are not sure it is legal — or even good.",
            choices:[
                {id:"take",label:"TAKE THE PART",odds:[
                    {p:"50%",text:"+3 Attack, +2 Knockback"},
                    {p:"50%",text:"−3 Stamina, −2 Balance"}
                ]},
                {id:"leave",label:"WALK AWAY"}
            ]
        },
        "rival":{
            title:"RIVAL ENCOUNTER",
            kicker:"HALLWAY",
            body:`${foe} walks past you. A few words. That is all it takes.`,
            choices:[
                {id:"talk",label:"TRASH TALK"},
                {id:"quiet",label:"STAY QUIET"}
            ]
        },
        "shortcut":{
            title:"THE SHORTCUT",
            kicker:"ARENA",
            body:"You spot a side hall that dumps you at the next arena. Security is looking the other way.",
            choices:[
                {id:"take",label:"TAKE THE SHORTCUT",odds:[
                    {text:"Skip the next match as a win. Random upgrade. −2 Stamina."}
                ]},
                {id:"long",label:"TAKE THE LONG ROUTE"}
            ]
        },
        "coin-flip":{
            title:"THE COIN FLIP",
            kicker:"SIDELINE",
            body:"A stranger parks a coin on the table and grins. \"Heads or tails. Your call.\"",
            choices:[
                {id:"heads",label:"HEADS"},
                {id:"tails",label:"TAILS"},
                {id:"kick",label:"KICK ROCKS"}
            ]
        },
        "shop-secret":{
            title:"SHOPKEEPER'S SECRET",
            kicker:"SHOP",
            body:"The shopkeeper pulls you aside and keeps their voice down. \"Next shipment is loaded. I'm putting something real in your box.\""
        },
        "double-or-nothing":{
            title:"DOUBLE OR NOTHING",
            kicker:"SIDELINE",
            body:"A gambler clocks you from the last fight. \"You've been winning. Let's see if your luck holds.\"",
            choices:[
                {id:"bet",label:"TAKE THE BET",odds:[
                    {p:"55%",text:"Two shop upgrades"},
                    {p:"45%",text:"Lose this shop"}
                ]},
                {id:"leave",label:"WALK AWAY"}
            ]
        },
        "autograph":{
            title:"THE AUTOGRAPH",
            kicker:"CROWD",
            body:"A kid spots you from the last battle, Bey in both hands. \"Will you sign it?\"",
            choices:[
                {id:"sign",label:"SIGN HIS BEY"},
                {id:"kick",label:"KICK ROCKS"}
            ]
        },
        "clearance":{
            title:"CLEARANCE BIN",
            kicker:"SHOP",
            body:"A forgotten box of old parts sits in the corner, sticker peeling off. Nobody is watching it."
        },
        "bathroom":{
            title:"WET TILE",
            kicker:"HALLWAY",
            body:"You slip coming out of the bathroom. The hallway saw it. You feel it in your stance."
        },
        "salvage":{
            title:"SALVAGED PARTS",
            kicker:"STADIUM",
            body:"A scratched Bey part is sitting near the stadium. It might still have some life left in it.",
            choices:[
                {id:"use",label:"USE IT",odds:[
                    {p:"50%",text:"−1 Defense, +2 Stamina, plus a random ratchet"},
                    {p:"50%",text:"−2 Balance, −1 Knockback, plus a random ratchet"}
                ]},
                {id:"leave",label:"LEAVE IT"}
            ]
        },
        "lube":{
            title:"EXPERIMENTAL LUBE",
            kicker:"PIT",
            body:"A technician holds out a vial. \"Experimental lubricant. Totally safe. Probably.\"",
            choices:[
                {id:"try",label:"TRY IT",odds:[
                    {p:"50%",text:"+3 Stamina"},
                    {p:"30%",text:"+2 Mobility, +1 Stamina, −2 Defense"},
                    {p:"20%",text:"−2 Stamina"}
                ]},
                {id:"leave",label:"PASS"}
            ]
        },
        "stadium-crew":{
            title:"STADIUM CREW",
            kicker:"ARENA",
            body:"The crew is making last-minute tweaks. One worker nods at you. \"Give us a hand?\"",
            choices:[
                {id:"help",label:"HELP THEM",odds:[
                    {text:"Skip this shop. Next 2 matches, every launch is Perfect."}
                ]},
                {id:"leave",label:"LEAVE THEM TO IT"}
            ]
        },
        "coupon":{
            title:"COUPON",
            kicker:"SHOP",
            body:"You find a crumpled coupon under the bench. Two shops. No fine print you can actually read."
        }
    };
}

function resolveScenario(id,choice){
    const r=run();
    const you=r?.blade?.name||"your Bey";
    const foe=r?.cpuBlade?.name||Game.cpu?.blade?.name||"your next opponent";
    const pctLabel=(stat,d,sign)=>`${sign}${d} ${LABEL[stat]}`;
    if(id==="rookie-tuner"){
        if(choice!=="accept") return {body:"You wave him off. He shrugs and jogs toward someone louder."};
        if(Math.random()<0.40){
            const kb=applyPercentBonus("knockback",0.05);
            const sta=applyPercentBonus("stamina",0.05);
            applyFlatBonus({mobility:1});
            return {body:`He actually knows what he is doing. ${you} picks up ${pctLabel("knockback",kb,"+") }, ${pctLabel("stamina",sta,"+")}, and +1 MOB.`};
        }
        applyFlatBonus({defense:-2,balance:-2,attack:1});
        return {body:`He tightens the wrong screw. ${you} loses 2 DEF and 2 BAL, but the extra bite is real: +1 ATK.`};
    }
    if(id==="parts-dealer"){
        if(choice!=="take") return {body:"You keep walking. The case snaps shut behind you."};
        if(Math.random()<0.50){
            applyFlatBonus({attack:3,knockback:2});
            return {body:`The part seats clean. ${you} hits harder: +3 ATK, +2 KB.`};
        }
        applyFlatBonus({stamina:-3,balance:-2});
        return {body:"The part was junk with a fresh coat. −3 STA, −2 BAL. The dealer is already gone."};
    }
    if(id==="rival"){
        if(choice==="talk"){
            const line=pick([
                `${foe}: "Talk now. The bowl does not care."`,
                `${foe}: "Cute. Try that at seven."`,
                `${foe}: "Save it for the X-Rail."`
            ]);
            setFlavorCall(`Pre-rip heat: you got in ${foe}'s ear. ${line}`);
            return {body:line,close:true};
        }
        const line=pick([
            `${foe}: "Quiet already? I have not even launched."`,
            `${foe}: "Yeah, keep walking. I'll talk for both of us."`,
            `${foe}: "Don't blink in there. I won't."`
        ]);
        setFlavorCall(`Pre-rip heat: ${foe} talked at you in the hall and you let it ride. ${line}`);
        return {body:line,close:true};
    }
    if(id==="shortcut"){
        if(choice!=="take") return {body:"You stay on the main concourse. The next fight waits like it should."};
        applyFlatBonus({stamina:-2});
        const card=grantRandomUpgrade();
        const skipped=skipNextMatchAsWin();
        r.skipShop=true;
        return {body:skipped
            ? `The hall dumps you past the next card. ${you} takes a random upgrade${card?` (${card.title})`:""} and loses 2 STA. That match is in the books as a win.`
            : `The hall does not skip a boss. ${you} still gets a random upgrade${card?` (${card.title})`:""}, loses 2 STA, and skips this shop.`};
    }
    if(id==="coin-flip"){
        if(choice==="kick") return {body:"You tell them to kick rocks. The coin stays on the table."};
        const stat=pick(STATS);
        if(choice==="heads"){
            const d=applyPercentBonus(stat,0.05);
            return {body:`Heads. ${you} takes ${pctLabel(stat,d,"+")}.`};
        }
        const d=applyPercentBonus(stat,-0.05);
        return {body:`Tails. ${you} drops ${pctLabel(stat,d,"−")}.`};
    }
    if(id==="shop-secret"){
        r.shopGuarantee="rare-or-legendary";
        return {body:"The next shop has one guaranteed Rare or Legendary sitting in the box."};
    }
    if(id==="double-or-nothing"){
        if(choice!=="bet") return {body:"You keep your shop. The gambler finds another mark."};
        if(Math.random()<0.55){
            r.shopRounds=2;
            return {body:"Luck holds. You get two shops this time."};
        }
        r.shopRounds=0;
        return {body:"The bet dies on the table. No shop this time."};
    }
    if(id==="autograph"){
        if(choice==="sign"){
            const line=pick([
                `"No way — ${you} on my Bey. I'm never washing this."`,
                `"I knew you were cool. Wait until the next fight."`,
                `"I'm telling everybody. Don't lose now."`
            ]);
            setFlavorCall(`A kid in the stands is holding a Bey you signed. ${line}`);
            return {body:`The kid lights up. ${line}`,close:true};
        }
        const line=pick([
            `"Why you being a jerk? I just wanted a name on it."`,
            `"Fine. I'll cheer for the other Bey."`,
            `"Okay rude. I'm still watching though."`
        ]);
        setFlavorCall(`That kid you brushed off is still on the rail. ${line}`);
        return {body:line,close:true};
    }
    if(id==="clearance"){
        const a=grantRandomUpgrade();
        const b=grantRandomUpgrade();
        r.shopRounds=0;
        return {body:`Two dusty upgrades come out of the box${a||b?`: ${[a,b].filter(Boolean).map(c=>c.title).join(" · ")}`:""}. No shop after this.`};
    }
    if(id==="bathroom"){
        applyFlatBonus({defense:-1,balance:-1});
        return {body:`Embarrassing, and it shows. ${you} is −1 DEF and −1 BAL walking in.`};
    }
    if(id==="salvage"){
        if(choice!=="use") return {body:"You leave it. Someone else's problem."};
        const rat=grantRandomRatchet();
        const ratLine=rat?` New ratchet: ${rat.name}.`:"";
        if(Math.random()<0.50){
            applyFlatBonus({defense:-1,stamina:2});
            return {body:`It seats. ${you} is −1 DEF, +2 STA.${ratLine}`};
        }
        applyFlatBonus({balance:-2,knockback:-1});
        return {body:`It seats crooked. ${you} is −2 BAL, −1 KB.${ratLine}`};
    }
    if(id==="lube"){
        if(choice!=="try") return {body:"You pass. The technician looks almost relieved."};
        const roll=Math.random();
        if(roll<0.50){
            applyFlatBonus({stamina:3});
            return {body:`Smooth as advertised. ${you} is +3 STA.`};
        }
        if(roll<0.80){
            applyFlatBonus({mobility:2,stamina:1,defense:-2});
            return {body:`It runs slick and a little loose. ${you} is +2 MOB, +1 STA, −2 DEF.`};
        }
        applyFlatBonus({stamina:-2});
        return {body:`The vial was a bad idea. ${you} is −2 STA.`};
    }
    if(id==="stadium-crew"){
        if(choice!=="help") return {body:"You leave them to it. The bowl stays a mystery."};
        r.skipShop=true;
        r.perfectLaunchMatches=2;
        return {body:"You learn the angles and quirks of the stadium. No shop this time, but the next 2 matches every launch lands Perfect — roll does not matter."};
    }
    if(id==="coupon"){
        r.shopRounds=2;
        return {body:"The clerk squints at the coupon and shrugs. Two shops."};
    }
    return {body:"Nothing happens."};
}

function scenarioOddsHTML(choice){
    const rows=choice?.odds;
    if(!rows||!rows.length) return "";
    return `<ul class="rogue-scenario-odds">${rows.map(row=>{
        const chance=row.p?`<b>${row.p}</b>`:"";
        return `<li>${chance}<span>${row.text||""}</span></li>`;
    }).join("")}</ul>`;
}

function showScenario(id){
    const r=run();
    if(!r) return enterShop();
    const pack=scenarioCopy()[id]||scenarioCopy()["coupon"];
    Game.screen="rogueScenario";
    const app=document.getElementById("app");
    const choices=pack.choices||[];
    const btns=choices.length
        ? choices.map(c=>`<div class="rogue-scenario-choice">
            <button class="menu-btn ${c.id==="kick"||c.id==="leave"||c.id==="deny"||c.id==="long"?"silver":"gold"}" type="button" data-scene-choice="${c.id}">${c.label}</button>
            ${scenarioOddsHTML(c)}
          </div>`).join("")
        : `<button class="rip-btn" type="button" data-scene-choice="ok">CONTINUE</button>`;
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-scenario">
        ${homeMarkHTML({tag:pack.kicker||"SIDELINE"})}
        <p class="win-name">${pack.title}</p>
        <p class="rogue-result-copy" id="sceneBody">${pack.body}</p>
        <p class="rogue-scenario-result" id="sceneResult" hidden></p>
        <div class="rogue-scenario-actions" id="sceneActions">${btns}</div>
    </main>`;
    const finish=(choice)=>{
        const out=resolveScenario(id,choice);
        const result=document.getElementById("sceneResult");
        const actions=document.getElementById("sceneActions");
        if(result){
            result.hidden=false;
            result.textContent=out.body||"";
        }
        if(actions){
            actions.innerHTML=`<button class="rip-btn" type="button" id="sceneDone">${out.close?"CLOSE":"CONTINUE"}</button>`;
            document.getElementById("sceneDone").onclick=()=>enterShop();
        }
        persist();
    };
    app.querySelectorAll("[data-scene-choice]").forEach(btn=>{
        btn.onclick=()=>finish(btn.getAttribute("data-scene-choice"));
    });
    mountDevButton();
    persist();
}

function showResults(){
    const r=run();
    const res=r.lastResult;
    if(!res){
        showComboCard();
        return;
    }
    Game.screen="rogueResults";
    const win=res.winner==="player";
    const offerClaim=win && r.matchIndex===18 && !r.claimedShark && !!sharkScaleBlade();
    const app=document.getElementById("app");
    const actions=offerClaim
        ? `<p class="rogue-result-copy">Take the fallen Bey for the rest of the night, or keep the one that beat it.</p>
        <button class="rip-btn" id="rogueClaimShark" type="button">CLAIM SHARK SCALE</button>
        <button class="menu-btn silver" id="rogueKeepBey" type="button">KEEP ${r.blade.name}</button>`
        : `<button class="rip-btn" id="rogueResultsGo" type="button">${win?"OPEN HUB":"BACK TO TITLE"}</button>`;
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-results">
        ${homeMarkHTML({tag:win?(r.matchIndex===18?"FINAL BOSS DOWN":(r.matchIndex===6||r.matchIndex===12?"BOSS CLEAR":"MATCH CLEAR")):"RUN OVER"})}
        <p class="win-name">${win?(r.matchIndex===18?"THE PRESENCE FALLS":"MATCH WON"):"RUN OVER"}</p>
        <p class="win-score">${res.playerScore} — ${res.cpuScore}</p>
        <p class="rogue-result-copy">${res.commentary||""}</p>
        ${actions}
    </main>`;
    const goHub=()=>{openShopOrScenario();};
    document.getElementById("rogueResultsGo")?.addEventListener("click",()=>{
        if(!win){
            if(typeof SpinWarsScoreboard!=="undefined" && SpinWarsScoreboard.showRunSummary){
                SpinWarsScoreboard.showRunSummary({
                    onHome:()=>{endRun("lost");renderMainMenu();}
                });
                return;
            }
            endRun("lost");renderMainMenu();return;
        }
        goHub();
    });
    document.getElementById("rogueClaimShark")?.addEventListener("click",()=>{
        claimSharkScale();
        goHub();
    });
    document.getElementById("rogueKeepBey")?.addEventListener("click",goHub);
    mountDevButton();
    persist();
}

function showRunWin(){
    const r=run();
    r.runStatus="won";
    Game.screen="rogueWin";
    if(typeof SpinWarsScoreboard!=="undefined" && SpinWarsScoreboard.showRunSummary){
        SpinWarsScoreboard.showRunSummary({
            onHome:()=>{endRun("won");renderMainMenu();}
        });
        persist();
        return;
    }
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="home home-win">
        ${homeMarkHTML({compact:true,tag:"ROGUE COMPLETE"})}
        <p class="win-name">${r.blade.name}</p>
        <p class="win-score">6 — 0 RUN</p>
        <p class="rogue-result-copy">The Bey you started is not the Bey that finished.</p>
        <button class="rip-btn" id="rogueWinHome" type="button">TITLE</button>
    </main>`;
    document.getElementById("rogueWinHome").onclick=()=>{endRun("won");renderMainMenu();};
    persist();
}

function endRun(status){
    if(Game.rogue) Game.rogue.runStatus=status;
    if(status==="won"||status==="lost") archiveFinishedRun(status);
    document.getElementById("rogueDevBtn")?.remove();
    document.getElementById("rogueDevPanel")?.remove();
    document.body.classList.remove("rogue-dev-open");
    if(status==="won"||status==="lost") clearSave();
}

function showHub(){
    const r=run();
    Game.screen="rogueHub";
    const stats=playerEffective();
    const base=playerPlateBase();
    const sprite=bladeSpritePath(r.blade);
    const mod=r.activeModifier?modifierById(r.activeModifier.id):null;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="garage rogue-hub">
        <header class="garage-head">
            <div class="garage-title">
                <span class="eyebrow">ROGUE RUN</span>
                <h1>${r.matchIndex>FINAL_MATCH?`ENDLESS ${r.matchIndex}`:`MATCH ${r.matchIndex} / ${FINAL_MATCH}`}</h1>
                <p>Win. Pick one upgrade. Keep building.</p>
            </div>
        </header>
        <section class="rogue-build ${r.enhanced?"enhanced":""} ${"tier-"+String(r.currentRogueTier||"bronze").toLowerCase()}">
            <div class="rogue-build-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div class="rogue-build-copy">
                <b>${r.blade.name}</b>
                <small>${r.ratchet.name} · ${r.bit.name} · ${String(r.currentRogueTier||"Bronze").toUpperCase()}${r.enhanced?" · ENHANCED":""}</small>
                <div class="stat-grid rogue-stat-grid">${STATS.map(k=>{
                    const d=stats[k]-base[k];
                    return `<span class="mini-stat"><span>${LABEL[k]}</span><b>${stats[k]}${d?`<i class="${d>0?"up":"down"}">${d>0?"+":""}${d}</i>`:""}</b></span>`;
                }).join("")}</div>
                ${mod?`<details class="vs-full rogue-mod-drop"><summary>${mod.name}</summary><p class="rogue-mod-line">${mod.blurb}</p></details>`:"<p class=\"rogue-mod-line\">No modifier</p>"}
                ${upgradeStackHTML(upgradeStack("player"))}
            </div>
        </section>
        <p class="home-leagues-label">CHOOSE ONE</p>
        <div class="rogue-offers" id="rogueOffers"></div>
    </main>`;
    const box=document.getElementById("rogueOffers");
    (r.offers||[]).forEach((card,i)=>{
        const btn=el(`<button type="button" class="rogue-offer ${card.rarity}">
            <span class="rogue-offer-kicker">${card.kicker}</span>
            <strong>${card.title}</strong>
            <small>${card.body}</small>
        </button>`);
        btn.onclick=()=>chooseOffer(i);
        box.appendChild(btn);
    });
    mountDevButton();
    persist();
}

function chooseOffer(index){
    const r=run();
    const card=r.offers[index];
    if(!card) return;
    if(card.kind==="reforge"){openReforge(card,false);return;}
    if(card.kind==="ability-swap"){openAbilitySwap(card,false);return;}
    let result;
    if(card.kind==="stat") result=applyStatCard(card);
    else if(card.kind==="modifier") result=applyModifierCard(card);
    else if(card.kind==="evolve") result=applyEvolveCard(card);
    else if(card.kind==="consumable") result=applyConsumableCard(card);
    else if(card.kind==="blessed") result=applyBlessedCard(card);
    else if(card.kind==="dash-haste") result=applyDashHasteCard(card);
    else if(card.kind==="ability-charge") result=applyAbilityChargeCard(card);
    else result=applyEvolveCard(card);
    result.card=card;
    r.lastUpgrade=result;
    r.history.push(card);
    showUpgradeResult();
}

function openReforge(card,fromDev){
    const r=run();
    const returnScreen=Game.screen;
    r.pendingReforge=packCard(card);
    Game.screen="rogueReforge";
    const isBit=card.part==="bit" || /^BIT\b/i.test(String(card.title||""));
    const pool=isBit
        ? shuffle(selectableBits().filter(b=>b.name!==r.bit.name)).slice(0,3)
        : shuffle(RATCHETS.filter(x=>x.name!==r.ratchet.name)).slice(0,3);
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu selection-screen">
        <div class="selection-header"><div class="selection-icon">⚙</div>
        <div><span class="eyebrow">RARE REFORGE</span><h1>PICK ${isBit?"BIT":"RATCHET"}</h1>
        <p>Three options. The rest of the combo stays.</p></div></div>
        <section class="menu-card selection-card" id="reforgeBox"></section>
    </main>`;
    const box=document.getElementById("reforgeBox");
    pool.forEach(part=>{
        const node=isBit?bitCard(part):ratchetCard(part);
        node.onclick=()=>{
            const before={...playerEffective()};
            if(isBit) r.bit=part; else r.ratchet=part;
            syncLoadout();
            r.pendingReforge=null;
            r.lastUpgrade={card,before,after:{...playerEffective()},part};
            r.history.push(card);
            if(fromDev){
                if(returnScreen==="comboCheck") showComboCard();
                else if(r.offers && r.offers.length) showHub();
                else showComboCard();
                toggleDev();
                return;
            }
            showUpgradeResult();
        };
        box.appendChild(node);
    });
    mountDevButton();
    persist();
}

function openAbilitySwap(card,fromDev){
    const r=run();
    r.pendingAbilitySwap=packCard(card);
    Game.screen="rogueAbilitySwap";
    const meta=(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.META)||{};
    const choices=(card.choices||[]).filter(id=>meta[id]).slice(0,2);
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu selection-screen">
        <div class="selection-header"><div class="selection-icon">✦</div>
        <div><span class="eyebrow">RARE SWAP</span><h1>PICK AN ABILITY</h1>
        <p>Two kits. Back keeps the one you have.</p></div></div>
        <section class="menu-card ability-swap-box" id="abilitySwapBox"></section>
        <button type="button" class="menu-btn silver" id="abilitySwapBack">BACK</button>
    </main>`;
    const box=document.getElementById("abilitySwapBox");
    choices.forEach(id=>{
        const kit=meta[id];
        const btn=el(`<button type="button" class="rogue-offer rare">
            <span class="rogue-offer-kicker">${kit.active?"ACTIVE":"PASSIVE"}</span>
            <strong>${kit.name}</strong>
            <small>${kit.blurb}</small>
        </button>`);
        btn.onclick=()=>{
            r.abilityId=id;
            syncLoadout();
            r.pendingAbilitySwap=null;
            r.lastUpgrade={card,abilityId:id,abilityName:kit.name};
            r.history.push(card);
            if(fromDev){
                showComboCard();
                toggleDev();
                return;
            }
            showUpgradeResult();
        };
        box.appendChild(btn);
    });
    document.getElementById("abilitySwapBack").onclick=()=>{
        r.pendingAbilitySwap=null;
        if(fromDev){
            if(r.offers && r.offers.length) showHub();
            else showComboCard();
            toggleDev();
            return;
        }
        showHub();
    };
    mountDevButton();
    persist();
}

function showUpgradeResult(){
    const r=run();
    const u=r.lastUpgrade||{};
    const card=u.card||{};
    if(!card.kind){
        if(r.offers&&r.offers.length) showHub();
        else showComboCard();
        return;
    }
    Game.screen="rogueUpgrade";
    let body="";
    if(u.before&&u.after){
        body=`<div class="rogue-deltas">${STATS.map(k=>{
            const a=u.before[k],b=u.after[k];
            if(a===b) return "";
            const d=b-a;
            return `<div class="rogue-delta ${d>=0?"up":"down"}"><small>${LABEL[k]}</small><b>${a} → ${b}</b><i>${d>0?"+":""}${d}</i></div>`;
        }).join("")}</div>`;
    }
    if(card.kind==="reforge"&&u.part){
        body=`<p class="rogue-part-swap">${card.part==="bit"?"BIT":"RATCHET"} → ${u.part.name}</p>`+body;
    }
    if(card.kind==="modifier"){
        body=`<p class="rogue-mod-line">${u.lost?`LOST ${u.lost.name} · `:""}EQUIPPED ${u.now?.name||""}</p><p>${u.now?.blurb||""}</p>`+body;
    }
    if(card.kind==="ability-swap"){
        body=`<p class="rogue-part-swap">ABILITY → ${u.abilityName||u.abilityId||""}</p>`+body;
    }
    if(card.kind==="consumable"){
        body=`<p class="rogue-mod-line">${card.title} · ${card.games||CONSUMABLE_META[card.consumable]?.games||1} GAMES</p><p>${card.body||""}</p>`+body;
    }
    if(card.kind==="blessed"||card.kind==="dash-haste"||card.kind==="ability-charge"){
        body=`<p class="rogue-mod-line">${card.title}</p><p>${card.body||""}</p>`+body;
    }
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-results">
        ${homeMarkHTML({tag:"UPGRADE LOCKED"})}
        <p class="win-name">${card.title||"UPGRADE"}</p>
        ${body}
        <p class="rogue-result-copy">${commentaryFor(u)}</p>
        <button class="rip-btn" id="rogueContinue" type="button">CONTINUE</button>
    </main>`;
    document.getElementById("rogueContinue").onclick=()=>{
        const r=run();
        if((Number(r?.shopRounds)||1)>1){
            r.shopRounds=Number(r.shopRounds)-1;
            generateOffers();
            showHub();
            return;
        }
        r.shopRounds=1;
        advanceMatch();
    };
    mountDevButton();
    persist();
}

function advanceMatch(){
    const r=run();
    r.matchIndex+=1;
    r.offers=[];
    r._scenarioDone=false;
    r.skipShop=false;
    if(!Number.isFinite(Number(r.shopRounds)) || Number(r.shopRounds)<1) r.shopRounds=1;
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof SpinWarsScoreboard!=="undefined") SpinWarsScoreboard.beginMatch();
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    if(r.matchIndex===18){
        showSharkOmen();
        return;
    }
    generateCpu();
    showComboCard();
    persist();
}

function paintSharkOmen(){
    Game.screen="rogueOmen";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background omen-bg"></div>
    <main class="rogue-omen" id="rogueOmen">
        <div class="omen-storm" aria-hidden="true">
            <svg class="omen-bolt b1" viewBox="0 0 48 140"><polygon points="28,0 16,52 30,52 12,140 36,68 22,68"/></svg>
            <svg class="omen-bolt b2" viewBox="0 0 48 140"><polygon points="20,0 34,48 20,48 40,140 14,72 28,72"/></svg>
            <svg class="omen-bolt b3" viewBox="0 0 48 140"><polygon points="24,0 18,44 32,44 10,140 30,64 16,64"/></svg>
            <svg class="omen-bolt b4" viewBox="0 0 48 140"><polygon points="26,0 14,58 26,58 8,128 34,74 20,74"/></svg>
        </div>
        <div class="omen-figure" aria-hidden="true">
            <div class="omen-circle"></div>
            <div class="omen-soul"></div>
            <span class="omen-eye left"></span>
            <span class="omen-eye right"></span>
        </div>
        <p class="omen-line">a dark presence watches you</p>
    </main>`;
}

function showSharkOmen(){
    const r=run();
    if(r){
        r.matchIndex=18;
        r._omenHandoff=false;
    }
    paintSharkOmen();
    persist();
    window.setTimeout(()=>{
        handoffOmen();
    },6000);
}

function onMatchOver(winner,playerScore,cpuScore,finishType,opts){
    const r=run();
    if(!r) return false;
    if(!(opts&&opts.silent)){
        if(winner==="player" && Number(r.perfectLaunchMatches)>0){
            r.perfectLaunchMatches=Math.max(0,(Number(r.perfectLaunchMatches)||0)-1);
        }
        if(r.flavorCall) r.flavorCall=null;
        tickAfterMatch(winner);
    }
    r.lastResult={
        winner,playerScore,cpuScore,finishType,
        commentary:winner==="player"
            ? (r.matchIndex===18
                ? `${r.blade.name} puts Shark Scale down ${playerScore}–${cpuScore}. The night does not end.`
                : `${r.blade.name} takes the match ${playerScore}–${cpuScore}.`)
            : `${Game.cpu.blade?.name||"CPU"} ends the run ${cpuScore}–${playerScore}.`
    };
    Game.battle=Game.battle||{};
    Game.battle.score={player:playerScore,cpu:cpuScore};
    persist();
    if(opts&&opts.silent) return true;
    setTimeout(()=>showResults(),200);
    return true;
}

function tickAfterMatch(winner){
    const r=run();
    if(!r) return;
    ensureRunShape(r);
    if(winner==="player" && r.blessed){
        const k=pick(STATS);
        r.bonuses[k]=(r.bonuses[k]||0)+2;
    }
    const cd=r.shopCooldown;
    Object.keys(cd).forEach(k=>{
        cd[k]=(Number(cd[k])||0)-1;
        if(cd[k]<=0) delete cd[k];
    });
    const expired=[];
    CONSUMABLE_KEYS.forEach(id=>{
        if((Number(r.consumables[id])||0)>0){
            r.consumables[id]--;
            if(r.consumables[id]<=0){
                r.consumables[id]=0;
                expired.push(id);
            }
        }
    });
    if((Number(r.matchBuffs.burst2)||0)>0){
        r.matchBuffs.burst2--;
        if(r.matchBuffs.burst2<=0){
            r.matchBuffs.burst2=0;
            r.matchBuffs.burst2Stat=null;
            expired.push("burst2");
        }
    }
    if(r.matchBuffs.dashHaste) r.matchBuffs.dashHaste=false;
    expired.forEach(id=>{
        const n=id==="burst2"?2:(CONSUMABLE_META[id]?.shopCd||2);
        cd[id]=n;
    });
    r.hellsChainPct=0;
    r.hellsChainLastAt=0;
}

function expireConsumable(id){
    const r=run();
    if(!r) return;
    ensureRunShape(r);
    r.consumables[id]=0;
    const n=CONSUMABLE_META[id]?.shopCd||2;
    r.shopCooldown[id]=Math.max(Number(r.shopCooldown[id])||0, n);
}

function luckyLaunchBump(quality){
    if(!isActive() || (Number(run()?.consumables?.luckyLaunch)||0)<=0) return quality;
    const tiers=["Horrible","Bad","Okay","Good","Perfect"];
    const i=tiers.indexOf(quality);
    if(i<0) return quality;
    return tiers[Math.min(i+1, tiers.length-1)];
}

function dashHasteActive(){
    return isActive() && !!run()?.matchBuffs?.dashHaste;
}

function tryZombieRespawn(){
    if(!isActive()) return false;
    const r=run();
    if((Number(r?.consumables?.zombie)||0)<=0) return false;
    const p=NEW_BATTLE?.player;
    const c=NEW_BATTLE?.cpu;
    if(!p||!c) return false;
    if(p.rogueZombieUsed) return false;
    if((Number(p.rpm)||0)>0.001) return false;
    if((Number(c.rpm)||0)<=0.001) return false;
    p.rogueZombieUsed=true;
    p.rpm=0.05;
    p.vx=(Number(p.vx)||0)*0.35;
    p.vy=(Number(p.vy)||0)*0.35;
    NEW_BATTLE.active=true;
    NEW_BATTLE.finishPending=false;
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.popup){
        SpinWarsAbilities.popup("ZOMBIE");
    }
    if(typeof newBattleFrame==="function"){
        NEW_BATTLE.last=performance.now();
        NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);
    }
    persist();
    return true;
}

function tryPocketSave(){
    if(!isActive()) return false;
    const r=run();
    if((Number(r?.consumables?.pocketSave)||0)<=0) return false;
    expireConsumable("pocketSave");
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.popup){
        SpinWarsAbilities.popup("POCKET SAVE");
    }
    persist();
    return true;
}

function tickPoint(p,c){
    if(!isActive()||!p) return;
    const r=run();
    if((Number(r?.consumables?.comeback)||0)<=0) return;
    if(p.rogueComebackUsed) return;
    if((Number(p.rpm)||0)>0.30 || (Number(p.rpm)||0)<=0.001) return;
    p.rogueComebackUsed=true;
    p.rpm=Math.min(1,(Number(p.rpm)||0)+0.05);
    const sp=Math.hypot(Number(p.vx)||0,Number(p.vy)||0);
    if(sp>0.002){
        p.vx+= (p.vx/sp)*0.028;
        p.vy+= (p.vy/sp)*0.028;
    }else{
        const ang=Math.atan2(p.y||0,p.x||0)+Math.PI/2;
        p.vx+=Math.cos(ang)*0.028;
        p.vy+=Math.sin(ang)*0.028;
    }
    p.impactMomentumState=Math.max(p.impactMomentumState||0,0.38);
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.popup){
        SpinWarsAbilities.popup("COMEBACK SPIN");
    }
}

function perfectLaunchesActive(){
    return isActive() && Number(run()?.perfectLaunchMatches)>0;
}
function flavorCallLine(){
    return (isActive() && run()?.flavorCall) || "";
}

global.SpinWarsRogue={
    isActive,run,liveBonus,onClash,battleCombo,playerEffective,
    showIntro,showLanding,showTierPick,onStarterPicked,decorateVs,scoreboardLabel,onMatchOver,showResults,
    mountDevButton,endRun,persist,hasSave,plateDecor,MAX_MATCHES,BOSS_AT,MODIFIERS,
    playerUpgradeCount,cpuNightMix,cpuStackPlan,cpuCompetence,applyPsyshockKnock,FINAL_MATCH,generateCpu,handoffOmen,jumpToFinalBoss,
    perfectLaunchesActive,flavorCallLine,openShopOrScenario,makeOfferCard,
    luckyLaunchBump,dashHasteActive,tryZombieRespawn,tryPocketSave,tickPoint
};
if(typeof window!=="undefined"){
    window.addEventListener("beforeunload",()=>{
        try{persist();}catch(_e){}
    });
}
})(typeof window!=="undefined"?window:globalThis);
