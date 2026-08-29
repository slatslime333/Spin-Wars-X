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
    const bit=bits.find(b=>b.name==="Orb")||{name:"Orb"};
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
    if(match<=1) return 0;
    if(match===2) return Math.random()<0.45?1:0;
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
     blurb:"After 10s: +6 ATK, +4 BAL. Early fight sits -2 MOB.",
     live(s,key){
         const t=Number(NEW_BATTLE?.elapsed)||0;
         if(t<10){
             if(key==="mobility") return -2;
             return 0;
         }
         if(key==="attack") return 6;
         if(key==="balance") return 4;
         return 0;
     }},
    {id:"psyshock",name:"PSYSHOCK",tag:"KNOCK",
     blurb:"First 5s: +5 KB. Hits cycle 60% knock, then the held 40% dumps on the next clash, then it resets.",
     live(s,key){
         if(key!=="knockback") return 0;
         const t=Number(NEW_BATTLE?.elapsed)||0;
         return t<=5?5:0;
     }}
];

function modifierById(id){return MODIFIERS.find(m=>m.id===id)||null;}

function liveBonus(s,key){
    const r=run();
    if(!r||!s) return 0;
    const side=s===NEW_BATTLE?.cpu?"cpu":"player";
    const mod=side==="cpu"?r.cpuModifier:r.activeModifier;
    if(!mod) return 0;
    const def=modifierById(mod.id);
    if(!def||typeof def.live!=="function") return 0;
    return def.live(s,key)||0;
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
    if(!s.roguePsyshockArmed){
        s.roguePsyshockStored=intended*0.4;
        s.roguePsyshockArmed=true;
        return intended*0.6;
    }
    const dumped=intended+(Number(s.roguePsyshockStored)||0);
    s.roguePsyshockStored=0;
    s.roguePsyshockArmed=false;
    return dumped;
}

function onClash(p,c,pDealt,cDealt){
    if(!isActive()||!p||!c) return;
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
    return mergeStats(mergeStats(base,r.startScale),r.bonuses);
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

function cpuStackLead(){
    const t=String(run()?.startingTier||"");
    const roll=Math.random();
    if(t==="Bronze"){
        if(roll<0.18) return 0;
        if(roll<0.58) return 1;
        return 2;
    }
    if(t==="Silver"){
        if(roll<0.24) return 0;
        if(roll<0.74) return 1;
        return 2;
    }
    if(roll<0.32) return 0;
    if(roll<0.82) return 1;
    return 2;
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

function makeOfferCard(rarity,blade,modifierId,opts){
    const r=run();
    const forCpu=!!opts?.forCpu;
    if(rarity==="common"){
        return makeCommonCard(blade||r?.blade,forCpu);
    }
    if(rarity==="uncommon"){
        const up=Math.random()<0.62?focusedStat(blade||r?.blade):pick(STATS);
        const down=pick(STATS.filter(s=>s!==up));
        if(Math.random()<0.42){
            return makeStatCard("uncommon",up,4,down,-2);
        }
        return makeStatCard("uncommon",up,3,down,-1);
    }
    if(rarity==="rare"){
        const roll=Math.random();
        if(roll<0.16) return makeAbilitySwapCard(blade||r?.blade, forCpu?r?.cpuAbilityId:r?.abilityId);
        if(roll<0.58) return makeReforgeCard(Math.random()<0.5?"bit":"ratchet");
        if(roll<0.79){
            const peak=peakStat(forCpu?cpuEffective():playerEffective());
            const card=makeStatCard("rare",Math.random()<0.7?focusedStat(blade||r?.blade):peak,4);
            card.body=`Peak. +4 ${LABEL[card.stat]}. No catch.`;
            return card;
        }
        const a=focusedStat(blade||r?.blade);
        const b=pick(STATS.filter(s=>s!==a));
        return makeDualStatCard(a,2,b,2);
    }
    if(rarity==="legendary"){
        const pool=MODIFIERS.filter(m=>m.id!==modifierId);
        return makeModifierCard(pick(pool.length?pool:MODIFIERS));
    }
    if(forCpu) return makeOfferCard("uncommon",blade,modifierId,{forCpu:true});
    const form=nextFormCard();
    if(form) return form;
    return makeOfferCard("uncommon",blade,modifierId);
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
        const committed=pickCommittedParts(r.cpuBlade,{
            bitName:r.cpuBit?.name,
            ratchetName:r.cpuRatchet?.name
        });
        if(card.part==="bit") r.cpuBit=committed.bit||r.cpuBit;
        else r.cpuRatchet=committed.ratchet||r.cpuRatchet;
    }else if(card.kind==="ability-swap"){
        const pickId=pick(card.choices&&card.choices.length?card.choices:["hurricane"]);
        r.cpuAbilityId=pickId;
    }
    r.cpuHistory=r.cpuHistory||[];
    r.cpuHistory.push(card);
}

function grantCpuStack(){
    const r=run();
    const n=playerUpgradeCount();
    r.cpuBonuses=emptyBonuses();
    r.cpuHistory=[];
    r.cpuModifier=null;
    r.cpuAbilityId=null;
    for(let i=0;i<n;i++){
        const card=makeOfferCard(
            rarityRoll(r.matchIndex,r.startingTier),
            r.cpuBlade,
            r.cpuModifier?.id,
            {forCpu:true}
        );
        applyCpuCard(card);
    }
    grantCpuPressure(cpuStackLead()+bossExtraStacks());
}

function bossExtraStacks(){
    const m=Number(run()?.matchIndex)||1;
    if(m===6) return 2;
    if(m===12) return 3;
    if(m===18) return 4;
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
    if(start==="Gold") return false;
    if(start==="Bronze") return true;
    return formTier()==="Silver";
}
function canEvolve(){
    const r=run();
    if(!r||inEndless()) return false;
    const start=startTier();
    const form=formTier();
    if(start==="Bronze") return false;
    if(start==="Silver") return form==="Bronze";
    return form!=="Gold";
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
    const roll=Math.random();
    let band;
    if(roll<0.14) band=0.94+Math.random()*0.04;
    else if(roll<0.40) band=0.99+Math.random()*0.03;
    else band=1.04+Math.random()*0.06;
    if(tier==="Gold" && band<1.00) band=0.99+Math.random()*0.04;
    if(tier==="Bronze" && band<1.00 && Math.random()<0.45) band+=0.04;
    if(boss){
        if(match===18) band=Math.max(band,1.05+Math.random()*0.02);
        else if(match===12) band=Math.max(band,1.03+Math.random()*0.015);
        else band=Math.max(band,1.02+Math.random()*0.012);
    }
    return playerPow*band;
}

function fillCpuScale(target){
    const r=run();
    const base=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    const stacked=mergeStats(base,r.cpuBonuses);
    const pow=powerOf(stacked)||70;
    const factor=target/pow;
    r.cpuScale=emptyBonuses();
    STATS.forEach(k=>{
        const have=Number(stacked[k])||70;
        const want=have*factor;
        r.cpuScale[k]=round(clamp(want-have,-14,30));
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
    fillCpuScale(r.cpuPowerTarget);
    syncLoadout();
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
        rarity:"rare",kind:"reforge",part:kind,
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
            body:"One and done. +4 on your best 3 stats, +3 on the rest. Later upgrades get +1 extra. Permanent honeycomb on the plate."
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
    const cards=[];
    const used=new Set();
    let guard=0;
    while(cards.length<3 && guard++<28){
        const rarity=rarityRoll(r.matchIndex,r.startingTier);
        const card=makeOfferCard(rarity,r.blade,r.activeModifier?.id);
        const key=card.kind+card.title+(card.stat||"")+(card.evolve||"");
        if(used.has(key)) continue;
        used.add(key);
        cards.push(card);
    }
    while(cards.length<3){
        cards.push(makeCommonCard(r.blade,false));
    }
    injectFormPity(cards);
    r.offers=cards.slice(0,3);
    const hasForm=r.offers.some(c=>c.kind==="evolve");
    r.hubsWithoutForm=hasForm?0:(Number(r.hubsWithoutForm)||0)+1;
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
    STATS.forEach(k=>{bumps[k]=top.has(k)?4:3;});
    return bumps;
}

function applyStatCard(card){
    const r=run();
    const before={...playerEffective()};
    const extra=r.enhanced&&Number(card.amount)>0?1:0;
    r.bonuses[card.stat]=(r.bonuses[card.stat]||0)+card.amount+extra;
    if(card.downStat) r.bonuses[card.downStat]=(r.bonuses[card.downStat]||0)+card.downAmt;
    if(card.secondStat){
        const extra2=r.enhanced&&Number(card.secondAmt)>0?1:0;
        r.bonuses[card.secondStat]=(r.bonuses[card.secondStat]||0)+card.secondAmt+extra2;
    }
    const after={...playerEffective()};
    return {before,after,card};
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
    return "ok";
}

function allCatalog(){
    const r=run();
    const list=[];
    STATS.forEach(stat=>{
        list.push(makeStatCard("common",stat,2));
        list.push(makeStatCard("uncommon",stat,3,pick(STATS.filter(s=>s!==stat)),-1));
    });
    list.push(makeStatCard("uncommon","attack",3,"defense",-1));
    list.push(makeStatCard("uncommon","stamina",3,"attack",-1));
    list.push(makeDualStatCard("attack",2,"knockback",2));
    list.push(makeStatCard("rare","attack",4));
    list.push(makeReforgeCard("bit"));
    list.push(makeReforgeCard("ratchet"));
    list.push(makeAbilitySwapCard(r?.blade, r?.abilityId));
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
        bossMark:mark||""
    };
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
    if(existing){existing.remove();return;}
    const panel=el(`<aside id="rogueDevPanel" class="rogue-dev-panel">
        <header><b>ROGUE DEV</b><button type="button" id="rogueDevClose">✕</button></header>
        <p class="rogue-dev-copy">${run()?"Add or strip upgrades on the current Bey. Live battle reads these stats.":"Pick a starting Bey first, then every upgrade and modifier is addable here."}</p>
        <div class="rogue-dev-list" id="rogueDevList"></div>
        <div class="rogue-dev-actions">
            <button type="button" class="menu-btn silver" id="rogueDevJump17">MATCH 17</button>
            <button type="button" class="menu-btn gold" id="rogueDevFinal">FINAL BOSS</button>
            <button type="button" class="menu-btn silver" id="rogueDevOmen">OMEN</button>
            <button type="button" class="menu-btn silver" id="rogueDevClear">CLEAR BONUSES</button>
            <button type="button" class="menu-btn gold" id="rogueDevWin">FORCE MATCH WIN</button>
            <button type="button" class="menu-btn silver" id="rogueDevLose">FORCE MATCH LOSS</button>
        </div>
    </aside>`);
    document.body.appendChild(panel);
    document.getElementById("rogueDevClose").onclick=()=>panel.remove();
    document.getElementById("rogueDevClear").onclick=()=>{
        const r=run();
        if(!r) return;
        r.bonuses=emptyBonuses();
        r.activeModifier=null;
        r.history=[];
        r.enhanced=false;
        r.currentRogueTier="Bronze";
        r.startScale=makeStartScale(r.starterBlade||r.blade,r.starterRatchet||r.ratchet,r.starterBit||r.bit);
        renderDevList();
        refreshAfterDebug();
    };
    document.getElementById("rogueDevJump17")?.addEventListener("click",()=>{
        const r=run();
        if(!r) return;
        r.matchIndex=17;
        panel.remove();
        generateOffers();
        showHub();
    });
    document.getElementById("rogueDevOmen")?.addEventListener("click",()=>{
        if(!run()) return;
        panel.remove();
        const hold=Game.screen;
        paintSharkOmen();
        window.setTimeout(()=>{
            if(Game.screen!=="rogueOmen") return;
            if(hold==="rogueHub") showHub();
            else if(hold==="comboCheck") showComboCard();
            else showLanding();
        },6000);
    });
    document.getElementById("rogueDevFinal")?.addEventListener("click",()=>{
        const r=run();
        if(!r) return;
        r.matchIndex=18;
        panel.remove();
        generateCpu();
        showComboCard();
    });
    document.getElementById("rogueDevWin").onclick=()=>{
        if(!run()) return;
        panel.remove();
        stopLiveBattle();
        onMatchOver("player",7,Math.min(6,Game.battle?.score?.cpu||0),"Spin Finish");
    };
    document.getElementById("rogueDevLose").onclick=()=>{
        if(!run()) return;
        panel.remove();
        stopLiveBattle();
        onMatchOver("cpu",Math.min(6,Game.battle?.score?.player||0),7,"Spin Finish");
    };
    renderDevList();
}

function stopLiveBattle(){
    if(typeof NEW_BATTLE==="undefined" || !NEW_BATTLE) return;
    NEW_BATTLE.active=false;
    NEW_BATTLE.finishPending=true;
    if(NEW_BATTLE.raf) cancelAnimationFrame(NEW_BATTLE.raf);
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
const COOKIE_KEY="swx_rogue";

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
    if(s==="rogueRunSummary") return "rogueWin";
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
            hubsWithoutForm:Number(r.hubsWithoutForm)||0,
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
        cpuModifier:raw.cpuModifier||null
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
    const save=peekSave();
    const canContinue=!!save && save.blade;
    const continueNote=canContinue
        ? `Match ${save.match||1} · ${save.blade}${save.score?` · ${save.score.player}-${save.score.cpu}`:""}`
        : "No run saved";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-landing">
        ${homeBowlHTML()}
        ${homeMarkHTML({compact:true,kicker:"ROGUE RUN",tag:"One Bey. Eighteen matches. Then the dark."})}
        <nav class="home-doors rogue-doors" aria-label="Rogue">
            <button class="home-door rip" id="rogueNewGame" type="button">
                <span class="home-door-kicker">NEW RUN</span>
                <b>NEW GAME</b>
                <small>Pick a starting Bey</small>
            </button>
            <button class="home-door ${canContinue?"rogue":"locked"}" id="rogueContinue" type="button" ${canContinue?"":"disabled aria-disabled=\"true\""}>
                <span class="home-door-kicker">SAVE</span>
                <b>CONTINUE</b>
                <small>${continueNote}</small>
                ${canContinue?"":"<span class=\"home-door-lock\">LOCKED</span>"}
            </button>
            <button class="home-help" id="rogueHelp" type="button">How a run works</button>
        </nav>
        <div id="rogueNewConfirm" hidden></div>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("rogueNewGame").onclick=()=>requestNewGame();
    document.getElementById("rogueContinue").onclick=()=>{
        if(!canContinue) return;
        resumeSave();
    };
    document.getElementById("rogueHelp").onclick=()=>showHelp();
    mountDevButton();
}

function requestNewGame(){
    if(!hasSave()){
        startBladePick();
        return;
    }
    const save=peekSave();
    const box=document.getElementById("rogueNewConfirm");
    if(!box){startBladePick();return;}
    box.hidden=false;
    box.innerHTML=`<section class="menu-card rogue-intro-card">
        <p class="eyebrow">REPLACE SAVE</p>
        <h2>START A NEW RUN?</h2>
        <p>This wipes Match ${save.match||1} · ${save.blade}. The old file is gone once you pick a Bey.</p>
        <button class="rip-btn" id="rogueNewConfirmGo" type="button">START NEW GAME</button>
        <button class="menu-btn silver" id="rogueNewConfirmNo" type="button">BACK</button>
    </section>`;
    document.getElementById("rogueNewConfirmGo").onclick=()=>startBladePick();
    document.getElementById("rogueNewConfirmNo").onclick=()=>{box.hidden=true;box.innerHTML="";};
}

function startBladePick(){
    Game.mode="rogue";
    showBladeDraft();
    const p=document.querySelector(".selection-header p");
    if(p) p.textContent="ROGUE · STARTING BEY";
    const h=document.querySelector(".selection-header h1");
    if(h) h.textContent="STARTING BEY";
    const back=document.querySelector(".back-btn");
    if(back) back.onclick=()=>showLanding();
    mountDevButton();
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
            <p>Pick one Bey to start. Your bit and ratchet are random. Every fight is first to 7. Win the match, choose one upgrade. Lose, and the run is over.</p>
            <p>A run is 18 matches. Matches 6 and 12 are mini bosses. The last match is a secret. Beat it and the night keeps going.</p>
            <p>Blade cards show luck only in Rogue: Bronze A, Silver B, Gold C. Bronze starts weaker, but the shop gets kinder later. Gold starts stronger; the shop stays thinner because Gold can evolve.</p>
            <p>Bronze cannot evolve. After enough wins it can Enhance once — a honeycomb look and a big stat bump. Silver starts in Bronze form, can grow into Silver, then Enhance. Gold starts in Bronze form and can climb all the way to Gold.</p>
            <p>The CPU grows with you. After each match it gets as many upgrades as you have, plus a little extra based on your starter. Mini bosses show extra boxes. Close the app and hit Continue to pick up where you left off.</p>
        </section>
        <p class="home-leagues-label">UPGRADES</p>
        <div class="rogue-offers rogue-help-offers">
            <article class="rogue-offer common"><span class="rogue-offer-kicker">COMMON</span><strong>+2 TO A STAT</strong><small>A small bump. It might hit your type, your weakest line, or a random one.</small></article>
            <article class="rogue-offer uncommon"><span class="rogue-offer-kicker">UNCOMMON</span><strong>A BIGGER BUMP WITH A COST</strong><small>You gain more on one line, and lose a little on another. There is no free +3.</small></article>
            <article class="rogue-offer rare"><span class="rogue-offer-kicker">RARE</span><strong>REFORGE · SWAP · PEAK · PAIR</strong><small>Swap your bit or ratchet, rarely swap your ability (two kits, BACK to keep yours), push one stat hard, or take two smaller bumps.</small></article>
            <article class="rogue-offer legendary"><span class="rogue-offer-kicker">LEGENDARY</span><strong>ROGUE MODIFIER</strong><small>A special rule for the rest of the run. Picking a new one replaces the old one.</small></article>
            <article class="rogue-offer evolve"><span class="rogue-offer-kicker">FORM</span><strong>ENHANCE OR EVOLVE</strong><small>Bronze enhances once. Silver can evolve, then enhance. Gold can evolve up to Gold.</small></article>
        </div>
        <section class="menu-card rogue-help-card">
            <p class="eyebrow">MODIFIERS</p>
            <p>Last Stand and Final Spin kick in when you are almost out of spin. Berserker and First Blood hit harder while you are still healthy. Psyshock stores some of each clash and dumps it on the next one. Rail Rush and X-Exit Swing want the ring. Pin Lock and Anchor keep you in the middle. Glass Cannon hits harder and dies faster. Heavy Contact and Counterweight answer a real clash.</p>
        </section>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showLanding()));
    mountDevButton();
}

function showIntro(){
    showLanding();
}

function beginRun(blade){
    const parts=starterParts(blade);
    Game.rogue={
        runStatus:"running",
        matchIndex:1,
        startingBeyId:blade.name,
        startingTier:blade.tier||"Silver",
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
        cpuPowerTarget:0,
        cpuHistory:[],
        boss:false
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof SpinWarsScoreboard!=="undefined") SpinWarsScoreboard.beginRun();
    generateCpu();
    showComboCard();
    persist();
}

function onStarterPicked(blade){
    beginRun(blade);
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
    const goHub=()=>{generateOffers();showHub();};
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
    document.getElementById("rogueDevBtn")?.remove();
    document.getElementById("rogueDevPanel")?.remove();
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
    <main class="menu rogue-hub">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">ROGUE RUN</span>
                <h1>${r.matchIndex>FINAL_MATCH?`ENDLESS ${r.matchIndex} CLEAR`:`MATCH ${r.matchIndex} / ${FINAL_MATCH} CLEAR`}</h1>
                <p>${r.blade.name} · ${r.ratchet.name} · ${r.bit.name}</p>
            </div>
        </div>
        <section class="menu-card rogue-build ${r.enhanced?"enhanced":""} ${"tier-"+String(r.currentRogueTier||"bronze").toLowerCase()}">
            <div class="rogue-build-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div>
                <b>${r.blade.name}</b>
                <small>${String(r.currentRogueTier||"Bronze").toUpperCase()} FORM${r.enhanced?" · ENHANCED":""}</small>
                <div class="rogue-statline">${STATS.map(k=>{
                    const d=stats[k]-base[k];
                    return `<span>${LABEL[k]} <b>${stats[k]}</b>${d?`<i class="${d>0?"up":"down"}">${d>0?"+":""}${d}</i>`:""}</span>`;
                }).join("")}</div>
                ${mod?`<p class="rogue-mod-line">${mod.name} · ${mod.blurb}</p>`:"<p class=\"rogue-mod-line\">No Rogue Modifier</p>"}
                ${upgradeStackHTML(upgradeStack("player"))}
            </div>
        </section>
        <p class="home-leagues-label">CHOOSE ONE UPGRADE</p>
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
    const isBit=card.part==="bit";
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
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-results">
        ${homeMarkHTML({tag:"UPGRADE LOCKED"})}
        <p class="win-name">${card.title||"UPGRADE"}</p>
        ${body}
        <p class="rogue-result-copy">${commentaryFor(u)}</p>
        <button class="rip-btn" id="rogueContinue" type="button">CONTINUE</button>
    </main>`;
    document.getElementById("rogueContinue").onclick=advanceMatch;
    mountDevButton();
    persist();
}

function advanceMatch(){
    const r=run();
    r.matchIndex+=1;
    r.offers=[];
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
    paintSharkOmen();
    persist();
    const go=()=>{
        if(Game.screen!=="rogueOmen") return;
        generateCpu();
        showComboCard();
        persist();
    };
    window.setTimeout(go,6000);
}

function onMatchOver(winner,playerScore,cpuScore,finishType,opts){
    const r=run();
    if(!r) return false;
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

global.SpinWarsRogue={
    isActive,run,liveBonus,onClash,battleCombo,playerEffective,
    showIntro,showLanding,onStarterPicked,decorateVs,scoreboardLabel,onMatchOver,showResults,
    mountDevButton,endRun,persist,hasSave,plateDecor,MAX_MATCHES,BOSS_AT,MODIFIERS,
    playerUpgradeCount,applyPsyshockKnock,FINAL_MATCH,generateCpu
};
if(typeof window!=="undefined"){
    window.addEventListener("beforeunload",()=>{
        try{persist();}catch(_e){}
    });
}
})(typeof window!=="undefined"?window:globalThis);
