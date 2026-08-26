/* SPIN WARS X — ROGUE MODE
 * Progression around the live battle engine. First to 7 per match.
 * Six matches in a run. Bosses on 3 and 6. Lose a match, run over.
 */
(function(global){
"use strict";

const STATS=["attack","knockback","defense","mobility","balance","stamina"];
const LABEL={
    attack:"ATK",knockback:"KB",defense:"DEF",
    mobility:"MOB",balance:"BAL",stamina:"STA"
};
const MAX_MATCHES=6;
const BOSS_AT={3:true,6:true};

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
    const blades=Object.values(BLADE_ENGINE||{}).filter(b=>String(b.tier)==="Bronze");
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

function tierPressureCount(){
    const t=String(run()?.startingTier||"");
    if(t==="Bronze") return 1+Math.floor(Math.random()*3);
    if(t==="Silver") return 1+Math.floor(Math.random()*2);
    return 1;
}

function grantCpuPressure(n){
    const r=run();
    for(let i=0;i<n;i++){
        const focus=focusedStat(r.cpuBlade);
        const card=Math.random()<0.72
            ? makeStatCard("common",focus,2)
            : makeOfferCard("uncommon",r.cpuBlade,r.cpuModifier?.id);
        applyCpuCard(card);
    }
}

function makeOfferCard(rarity,blade,modifierId){
    const r=run();
    if(rarity==="common"){
        return makeStatCard("common",pick(STATS),2);
    }
    if(rarity==="uncommon"){
        if(Math.random()<0.42){
            const up=focusedStat(blade||r?.blade);
            const down=pick(STATS.filter(s=>s!==up));
            return makeStatCard("uncommon",up,4,down,-2);
        }
        return makeStatCard("uncommon",Math.random()<0.55?focusedStat(blade||r?.blade):pick(STATS),3);
    }
    if(rarity==="rare"){
        return makeReforgeCard(Math.random()<0.5?"bit":"ratchet");
    }
    if(rarity==="legendary"){
        const pool=MODIFIERS.filter(m=>m.id!==modifierId);
        return makeModifierCard(pick(pool.length?pool:MODIFIERS));
    }
    const tier=r?.currentRogueTier;
    const type=tier==="Gold"||tier==="gold"?"final":"evolve";
    const roll=Math.random();
    return makeEvolveCard(roll<0.45?"enhance":type==="final"?"final":"evolve");
}

function applyCpuCard(card){
    const r=run();
    if(!r||!card) return;
    if(card.kind==="stat"){
        r.cpuBonuses[card.stat]=(r.cpuBonuses[card.stat]||0)+card.amount;
        if(card.downStat) r.cpuBonuses[card.downStat]=(r.cpuBonuses[card.downStat]||0)+card.downAmt;
    }else if(card.kind==="modifier"){
        r.cpuModifier={id:card.modifierId};
    }else if(card.kind==="evolve"){
        const bump=card.evolve==="final"?8:card.evolve==="evolve"?6:4;
        STATS.forEach(k=>{r.cpuBonuses[k]=(r.cpuBonuses[k]||0)+bump;});
        const type=String(r.cpuBlade?.type||"");
        if(type==="Attack"){r.cpuBonuses.attack+=2;r.cpuBonuses.knockback+=2;}
        if(type==="Defense"){r.cpuBonuses.defense+=2;r.cpuBonuses.balance+=2;}
        if(type==="Stamina"){r.cpuBonuses.stamina+=3;}
    }else if(card.kind==="reforge"){
        if(card.part==="bit"){
            const opts=selectableBits().filter(b=>b.name!==r.cpuBit?.name);
            if(opts.length) r.cpuBit=pick(opts);
        }else{
            const opts=(typeof RATCHETS!=="undefined"?RATCHETS:[]).filter(x=>x.name!==r.cpuRatchet?.name);
            if(opts.length) r.cpuRatchet=pick(opts);
        }
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
    for(let i=0;i<n;i++){
        const card=makeOfferCard(
            rarityRoll(r.matchIndex,r.startingTier),
            r.cpuBlade,
            r.cpuModifier?.id
        );
        applyCpuCard(card);
    }
    grantCpuPressure(tierPressureCount());
}

function battleCombo(side){
    const stats=side==="cpu"?cpuEffective():playerEffective();
    const ovr=round(Object.values(stats).reduce((a,b)=>a+b,0)/7);
    return {stats,ovr,meta:ovr,compatibility:80,physical:{}};
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
    Game.player.blade=r.blade;
    Game.player.ratchet=r.ratchet;
    Game.player.bit=r.bit;
    Game.player.spin=r.blade?.spin||"Right";
    const p=battleCombo("player");
    Game.player.stats=p.stats;
    Game.player.comboOVR=p.ovr;
    Game.player.comboMeta=p.meta;
    Game.cpu.blade=r.cpuBlade;
    Game.cpu.ratchet=r.cpuRatchet;
    Game.cpu.bit=r.cpuBit;
    Game.cpu.spin=r.cpuBlade?.spin||"Right";
    const c=battleCombo("cpu");
    Game.cpu.stats=c.stats;
    Game.cpu.comboOVR=c.ovr;
    Game.cpu.comboMeta=c.meta;
}

function cpuPowerTarget(playerPow,match,boss){
    const r=run();
    const tier=String(r.startingTier||"");
    const growth=tier==="Bronze"?0.022:tier==="Silver"?0.020:0.018;
    let target=playerPow*(0.90+match*growth);
    if(tier==="Bronze") target*=1.03;
    else if(tier==="Silver") target*=1.025;
    else target*=1.04;
    if(r.cpuPowerTarget) target=r.cpuPowerTarget*0.62+target*0.38;
    if(boss){
        let bump=1.05+Math.random()*0.07;
        if(tier==="Bronze") bump=1.08+Math.random()*0.07;
        else if(tier==="Silver") bump=1.06+Math.random()*0.07;
        target=playerPow*bump;
    }
    return target;
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

function generateCpu(){
    const r=run();
    const playerPow=powerOf(playerEffective());
    const match=r.matchIndex;
    const boss=!!BOSS_AT[match];
    r.boss=boss;
    r.cpuPowerTarget=cpuPowerTarget(playerPow,match,boss);

    const blades=Object.values(BLADE_ENGINE);
    const wantTier=boss?"Gold":match>=4?"Silver":pick(["Bronze","Silver","Gold"]);
    const pool=blades.filter(b=>b.tier===wantTier);
    r.cpuBlade=pick(pool.length?pool:blades);
    const parts=starterParts(r.cpuBlade);
    r.cpuRatchet=pick(RATCHETS.filter(x=>x.height===60||x.height===70))||parts.ratchet;
    r.cpuBit=pick(selectableBits())||parts.bit;
    grantCpuStack();
    fillCpuScale(r.cpuPowerTarget);
    syncLoadout();
}

function rarityRoll(match,tier){
    let common=62,uncommon=24,rare=9,legendary=4,evolve=1;
    if(tier==="Bronze"){rare+=3;legendary+=1;evolve+=1.2;}
    if(tier==="Gold"){common+=8;rare-=2;evolve-=0.4;}
    if(match>=3){legendary+=1.5;evolve+=0.6;rare+=1;}
    if(match>=5){legendary+=1;evolve+=1.2;}
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
        enhance:{title:"ENHANCED TIER",body:"Keep this Bey's identity. Every stat gets a real bump."},
        evolve:{title:"TIER EVOLUTION",body:"Step the Rogue tier up. Build bonuses stay."},
        final:{title:"FINAL EVOLUTION",body:"Peak form. Identity stays. Power jumps."}
    };
    const m=map[type];
    return {
        id:"evo-"+type+"-"+Math.random().toString(16).slice(2),
        rarity:"evolve",kind:"evolve",evolve:type,
        title:m.title,kicker:"EVOLVE",body:m.body
    };
}

function generateOffers(){
    const r=run();
    const cards=[];
    const used=new Set();
    let guard=0;
    while(cards.length<3 && guard++<24){
        const rarity=rarityRoll(r.matchIndex,r.startingTier);
        const card=makeOfferCard(rarity,r.blade,r.activeModifier?.id);
        const key=card.kind+card.title+card.stat;
        if(used.has(key)) continue;
        used.add(key);
        cards.push(card);
    }
    while(cards.length<3){
        cards.push(makeStatCard("common",pick(STATS),2));
    }
    r.offers=cards;
}

function applyStatCard(card){
    const r=run();
    const before={...playerEffective()};
    r.bonuses[card.stat]=(r.bonuses[card.stat]||0)+card.amount;
    if(card.downStat) r.bonuses[card.downStat]=(r.bonuses[card.downStat]||0)+card.downAmt;
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
    const bump=card.evolve==="final"?8:card.evolve==="evolve"?6:4;
    STATS.forEach(k=>{r.bonuses[k]=(r.bonuses[k]||0)+bump;});
    if(card.evolve==="evolve" || card.evolve==="final"){
        const t=String(r.currentRogueTier||r.startingTier);
        if(t==="Bronze"||t==="bronze") r.currentRogueTier="Silver";
        else r.currentRogueTier="Gold";
    }
    if(card.evolve==="final") r.currentRogueTier="Gold";
    const type=String(r.blade?.type||"");
    if(type==="Attack"){r.bonuses.attack+=2;r.bonuses.knockback+=2;}
    if(type==="Defense"){r.bonuses.defense+=2;r.bonuses.balance+=2;}
    if(type==="Stamina"){r.bonuses.stamina+=3;}
    return {before,after:{...playerEffective()},card,tier:r.currentRogueTier};
}

function applyDebugCard(card){
    if(card.kind==="stat") applyStatCard(card);
    if(card.kind==="modifier") applyModifierCard(card);
    if(card.kind==="evolve") applyEvolveCard(card);
    if(card.kind==="reforge") return "reforge";
    return "ok";
}

function allCatalog(){
    const list=[];
    STATS.forEach(stat=>{
        list.push(makeStatCard("common",stat,2));
        list.push(makeStatCard("uncommon",stat,3));
    });
    list.push(makeStatCard("uncommon","attack",4,"defense",-2));
    list.push(makeStatCard("uncommon","stamina",4,"attack",-2));
    list.push(makeStatCard("uncommon","knockback",4,"mobility",-2));
    list.push(makeReforgeCard("bit"));
    list.push(makeReforgeCard("ratchet"));
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
    if(card.kind==="evolve") return `${name} stays itself — the Rogue tier just jumped.`;
    if(card.kind==="reforge") return `New ${card.part}. The stadium will feel it.`;
    return "Build updated.";
}

function el(html){
    const d=document.createElement("div");
    d.innerHTML=html.trim();
    return d.firstElementChild;
}

function bannerHTML(){
    const r=run();
    if(!r) return "";
    const boss=BOSS_AT[r.matchIndex]?" — BOSS":"";
    return `<p class="rogue-round-banner">ROGUE MATCH ${r.matchIndex} / ${MAX_MATCHES}${boss}</p>`;
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
    return {stats,ovr,meta:ovr,delta,mod,stack,stackHTML:upgradeStackHTML(stack)};
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
            boxes.push({kicker:"EVOLVE",title:card.title||"EVOLVE",rarity:"evolve"});
        }
        if(card.kind==="reforge"){
            boxes.push({kicker:"REFORGE",title:card.title||"REFORGE",rarity:"rare"});
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
        renderDevList();
        refreshAfterDebug();
    };
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
        part:card.part,modifierId:card.modifierId,evolve:card.evolve
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
    return u;
}

function persistScreen(){
    const s=Game.screen;
    if(s==="battle"||s==="comboCheck") return s==="battle"?"battle":"comboCheck";
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
            round:Number(Game.battle?.round)||1
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
            cpuPowerTarget:r.cpuPowerTarget||0,
            boss:!!r.boss,
            cpuBladeName:r.cpuBlade?.name,
            cpuRatchetName:r.cpuRatchet?.name,
            cpuBitName:r.cpuBit?.name,
            cpuScale:{...emptyBonuses(),...(r.cpuScale||{})},
            cpuBonuses:{...emptyBonuses(),...(r.cpuBonuses||{})},
            cpuHistory:(r.cpuHistory||[]).map(packCard),
            cpuModifier:packModifier(r.cpuModifier)
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
        currentRogueTier:raw.currentRogueTier||blade.tier||"Silver",
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
        round:Number(data.battle?.round)||1
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    syncLoadout();
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
    else if(screen==="rogueWin") showRunWin();
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
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-landing">
        <div class="home-ring" aria-hidden="true"></div>
        ${homeMarkHTML({tag:"Rogue · First to 7 · Build the Bey"})}
        <nav class="home-leagues" aria-label="Rogue">
            <p class="home-leagues-label">ROGUE RUN</p>
            <button class="home-league quick" id="rogueNewGame" type="button">
                <span class="home-league-rank">01</span>
                <span class="home-league-copy"><b>NEW GAME</b><small>Pick a starting Bey</small></span>
                <span class="home-league-go">START</span>
            </button>
            <button class="home-league ${canContinue?"custom":"locked"}" id="rogueContinue" type="button" ${canContinue?"":"disabled aria-disabled=\"true\""}>
                <span class="home-league-rank">02</span>
                <span class="home-league-copy"><b>CONTINUE</b><small>${continueNote}</small></span>
                <span class="home-league-go ${canContinue?"":"lock"}">${canContinue?"RESUME":"LOCKED"}</span>
            </button>
            <button class="home-league silver" id="rogueHelp" type="button">
                <span class="home-league-rank">03</span>
                <span class="home-league-copy"><b>HELP</b><small>How a run works</small></span>
                <span class="home-league-go">READ</span>
            </button>
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
                <p>Same stadium. One Bey. Six matches.</p>
            </div>
        </div>
        <section class="menu-card rogue-help-card">
            <p>You pick a starting Bey. Bit and ratchet are random. Each match is first to 7 — Xtreme, Over, Spin — on the same battle screen as Quick Play. Win the match, take one upgrade. Lose the match, the run is over. Matches 3 and 6 are bosses.</p>
            <p>Bronze starters have the harder road and better rolls. Silver and Gold open a step above Bronze, not a full tier ahead — their opening stats sit a bit closer to Bronze, but an Attack Bey still hits like Attack and a tank still tanks. Gold is still the easier start. Stats can climb past 99. Only one Rogue Modifier at a time. Close the browser and Continue puts you back. If you left mid-battle, the round restarts with the score you had.</p>
            <p>CPU power is scaled to yours, but those hidden numbers stay plain on the VS plates and keep the CPU Bey's shape. Green and red only mark upgrades — stat bumps, bit/ratchet reforge, evolve, enhance, and modifiers. Each stat upgrade also gets its own box so you can see the stack (ATK +2, then ATK +4). After every match the CPU takes the same number of upgrades you have locked in, plus extra pressure from your starting tier: Bronze CPUs walk in with 1–3 extras, Silver 1–2, Gold 1.</p>
        </section>
        <p class="home-leagues-label">UPGRADES</p>
        <div class="rogue-offers rogue-help-offers">
            <article class="rogue-offer common"><span class="rogue-offer-kicker">COMMON</span><strong>+2 STAT</strong><small>One number goes up. No catch.</small></article>
            <article class="rogue-offer uncommon"><span class="rogue-offer-kicker">UNCOMMON</span><strong>+3 OR A TRADE</strong><small>A cleaner bump, or more of one stat for less of another.</small></article>
            <article class="rogue-offer rare"><span class="rogue-offer-kicker">RARE</span><strong>BIT / RATCHET REFORGE</strong><small>Three parts. Pick one. The rest of the combo stays. The stadium will feel it.</small></article>
            <article class="rogue-offer legendary"><span class="rogue-offer-kicker">LEGENDARY</span><strong>ROGUE MODIFIER</strong><small>A condition in battle — late RPM, the X-Rail, opening seconds. Equipping a new one drops the old one.</small></article>
            <article class="rogue-offer evolve"><span class="rogue-offer-kicker">EVOLVE</span><strong>KEEP THE BEY</strong><small>The identity stays. The whole build jumps. Bronze can step up a tier.</small></article>
        </div>
        <section class="menu-card rogue-help-card">
            <p class="eyebrow">MODIFIERS</p>
            <p>Last Stand and Final Spin wake up when the RPM is gone. Berserker and First Blood hit while you are still healthy. Rail Rush and X-Exit Swing want the ring. Pin Lock and Anchor plant in the bowl. Glass Cannon hits harder and dies faster. Heavy Contact and Counterweight answer a real clash.</p>
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
        currentRogueTier:blade.tier||"Silver",
        blade,ratchet:parts.ratchet,bit:parts.bit,
        starterBlade:blade,starterRatchet:parts.ratchet,starterBit:parts.bit,
        startScale:makeStartScale(blade,parts.ratchet,parts.bit),
        bonuses:emptyBonuses(),
        activeModifier:null,
        history:[],
        offers:[],
        lastResult:null,
        cpuPowerTarget:0,
        cpuHistory:[],
        boss:false
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.battle={score:{player:0,cpu:0},round:1};
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
    const boss=BOSS_AT[r.matchIndex]?"BOSS · ":"";
    return `${boss}MATCH ${r.matchIndex}/${MAX_MATCHES} · first to 7`;
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
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-results">
        ${homeMarkHTML({tag:win?"MATCH CLEAR":"RUN OVER"})}
        <p class="win-name">${win?"MATCH WON":"RUN OVER"}</p>
        <p class="win-score">${res.playerScore} — ${res.cpuScore}</p>
        <p class="rogue-result-copy">${res.commentary||""}</p>
        <button class="rip-btn" id="rogueResultsGo" type="button">${win?(r.matchIndex>=MAX_MATCHES?"CLAIM THE RUN":"OPEN HUB"):"BACK TO TITLE"}</button>
    </main>`;
    document.getElementById("rogueResultsGo").onclick=()=>{
        if(!win){endRun("lost");renderMainMenu();return;}
        if(r.matchIndex>=MAX_MATCHES){showRunWin();return;}
        generateOffers();
        showHub();
    };
    mountDevButton();
    persist();
}

function showRunWin(){
    const r=run();
    r.runStatus="won";
    Game.screen="rogueWin";
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
                <h1>MATCH ${r.matchIndex} / ${MAX_MATCHES} CLEAR</h1>
                <p>${r.blade.name} · ${r.ratchet.name} · ${r.bit.name}</p>
            </div>
        </div>
        <section class="menu-card rogue-build">
            <div class="rogue-build-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div>
                <b>${r.blade.name}</b>
                <small>${r.currentRogueTier.toUpperCase()} TIER</small>
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
    Game.battle={score:{player:0,cpu:0},round:1};
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.cpu.lockedLaunchPlan=null;
    generateCpu();
    showComboCard();
    persist();
}

function onMatchOver(winner,playerScore,cpuScore,finishType){
    const r=run();
    if(!r) return false;
    r.lastResult={
        winner,playerScore,cpuScore,finishType,
        commentary:winner==="player"
            ? `${r.blade.name} takes the match ${playerScore}–${cpuScore}.`
            : `${Game.cpu.blade?.name||"CPU"} ends the run ${cpuScore}–${playerScore}.`
    };
    Game.battle=Game.battle||{};
    Game.battle.score={player:playerScore,cpu:cpuScore};
    setTimeout(()=>showResults(),200);
    persist();
    return true;
}

global.SpinWarsRogue={
    isActive,run,liveBonus,onClash,battleCombo,playerEffective,
    showIntro,showLanding,onStarterPicked,decorateVs,scoreboardLabel,onMatchOver,
    mountDevButton,endRun,persist,hasSave,plateDecor,MAX_MATCHES,BOSS_AT,MODIFIERS,
    playerUpgradeCount
};
if(typeof window!=="undefined"){
    window.addEventListener("beforeunload",()=>{
        try{persist();}catch(_e){}
    });
}
})(typeof window!=="undefined"?window:globalThis);
