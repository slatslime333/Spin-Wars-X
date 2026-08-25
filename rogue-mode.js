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
    const type=String(blade?.type||"Balance");
    const prefer=
        type==="Attack"?["Rush","Point","Level","Kick","Flat"]:
        type==="Defense"?["Hexa","Ball","Wedge","Needle","Point"]:
        type==="Stamina"?["Ball","Orb","Needle","Hexa","Wedge"]:
        ["Point","Level","Hexa","Ball","Rush"];
    const bit=prefer.map(n=>bits.find(b=>b.name===n)).find(Boolean)||bits[0];
    const rats=RATCHETS.filter(r=>r.height===60);
    const want=type==="Attack"?1:type==="Defense"?9:type==="Stamina"?7:3;
    const ratchet=rats.find(r=>r.number===want)||rats.find(r=>r.number===7)||rats[0];
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

function playerEffective(){
    const r=run();
    if(!r) return emptyBonuses();
    const base=comboBase(r.blade,r.ratchet,r.bit);
    return mergeStats(base,r.bonuses);
}

function cpuEffective(){
    const r=run();
    if(!r) return emptyBonuses();
    const base=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    return mergeStats(base,r.cpuBonuses);
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

function generateCpu(){
    const r=run();
    const playerPow=powerOf(playerEffective());
    const match=r.matchIndex;
    const boss=!!BOSS_AT[match];
    let target=playerPow*(0.90+match*0.018);
    if(r.startingTier==="Bronze") target*=0.96;
    if(r.startingTier==="Gold") target*=1.04;
    if(r.cpuPowerTarget) target=r.cpuPowerTarget*0.62+target*0.38;
    if(boss) target=playerPow*(1.05+Math.random()*0.07);
    r.cpuPowerTarget=target;
    r.boss=boss;

    const blades=Object.values(BLADE_ENGINE);
    const wantTier=boss?"Gold":match>=4?"Silver":pick(["Bronze","Silver","Gold"]);
    const pool=blades.filter(b=>b.tier===wantTier);
    r.cpuBlade=pick(pool.length?pool:blades);
    const parts=starterParts(r.cpuBlade);
    r.cpuRatchet=pick(RATCHETS.filter(x=>x.height===60||x.height===70))||parts.ratchet;
    r.cpuBit=pick(selectableBits())||parts.bit;
    const base=comboBase(r.cpuBlade,r.cpuRatchet,r.cpuBit);
    const gap=target-powerOf(base);
    r.cpuBonuses=emptyBonuses();
    STATS.forEach(k=>{r.cpuBonuses[k]=round(clamp(gap*(0.72+Math.random()*0.56),-12,28));});
    if(boss && Math.random()<0.55){
        r.cpuModifier={id:pick(MODIFIERS).id};
    }else if(!boss && Math.random()<0.18){
        r.cpuModifier={id:pick(MODIFIERS).id};
    }else{
        r.cpuModifier=null;
    }
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
        let card=null;
        if(rarity==="common"){
            const stat=pick(STATS);
            card=makeStatCard("common",stat,2);
        }else if(rarity==="uncommon"){
            if(Math.random()<0.42){
                const up=focusedStat(r.blade);
                const down=pick(STATS.filter(s=>s!==up));
                card=makeStatCard("uncommon",up,4,down,-2);
            }else{
                card=makeStatCard("uncommon",Math.random()<0.55?focusedStat(r.blade):pick(STATS),3);
            }
        }else if(rarity==="rare"){
            card=makeReforgeCard(Math.random()<0.5?"bit":"ratchet");
        }else if(rarity==="legendary"){
            const pool=MODIFIERS.filter(m=>m.id!==r.activeModifier?.id);
            card=makeModifierCard(pick(pool.length?pool:MODIFIERS));
        }else{
            const tier=r.currentRogueTier;
            const type=tier==="Gold"||tier==="gold"?"final":tier==="Silver"||tier==="silver"?"evolve":"evolve";
            const roll=Math.random();
            card=makeEvolveCard(roll<0.45?"enhance":type==="final"?"final":"evolve");
        }
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

function vsNoteHTML(side){
    const r=run();
    if(!r) return "";
    if(side==="player"){
        const base=comboBase(r.blade,r.ratchet,r.bit);
        const now=playerEffective();
        const chips=STATS.filter(k=>now[k]!==base[k]).slice(0,4).map(k=>{
            const d=now[k]-base[k];
            const sign=d>0?"+":"";
            return `<span class="rogue-chip ${d>=0?"up":"down"}">${LABEL[k]} ${base[k]} → ${now[k]} ${sign}${d}</span>`;
        }).join("");
        const mod=r.activeModifier?modifierById(r.activeModifier.id):null;
        return `<div class="rogue-vs-note">${chips}${mod?`<span class="rogue-mod-pill">${mod.name}</span>`:""}</div>`;
    }
    const bonus=powerOf(r.cpuBonuses||emptyBonuses());
    const mod=r.cpuModifier?modifierById(r.cpuModifier.id):null;
    return `<div class="rogue-vs-note"><span class="rogue-chip">${bonus>=1?"SCALED BUILD":"STOCK PARTS"}</span>${mod?`<span class="rogue-mod-pill cpu">${mod.name}</span>`:""}</div>`;
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
            renderDevList();
            refreshAfterDebug();
        };
        box.appendChild(row);
    });
}

function showIntro(){
    Game.mode="rogue";
    Game.quickMatch=false;
    Game.screen="rogueIntro";
    Game.rogue=null;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="home rogue-intro">
        ${homeMarkHTML({tag:"Rogue · First to 7 · Build the Bey"})}
        <section class="menu-card rogue-intro-card">
            <p class="eyebrow">ROGUE RUN</p>
            <h2>KEEP THE BEY. CHANGE THE BUILD.</h2>
            <p>Pick a starting Bey. Each match is still first to 7 — Xtreme, Over, Spin. Win the match, take one of three upgrades. Lose the match, the run ends. Six matches. Bosses on 3 and 6.</p>
            <p>Bronze starters grow harder and roll better upgrades. Gold starts easier. Stats can climb past 99. Only one Rogue Modifier at a time.</p>
            <button class="rip-btn" id="rogueStartBtn" type="button">CHOOSE STARTING BEY</button>
        </section>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("rogueStartBtn").onclick=()=>{
        Game.mode="rogue";
        showBladeDraft();
        const p=document.querySelector(".selection-header p");
        if(p) p.textContent="ROGUE · STARTING BEY";
        const h=document.querySelector(".selection-header h1");
        if(h) h.textContent="STARTING BEY";
        const back=document.querySelector(".back-btn");
        if(back) back.onclick=()=>showIntro();
        mountDevButton();
    };
    mountDevButton();
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
        bonuses:emptyBonuses(),
        activeModifier:null,
        history:[],
        offers:[],
        lastResult:null,
        cpuPowerTarget:0,
        boss:false
    };
    Game.player.launch={angle:"Flat",technique:"Center"};
    Game.battle={score:{player:0,cpu:0},round:1};
    generateCpu();
    showComboCard();
}

function onStarterPicked(blade){
    beginRun(blade);
}

function decorateVs(root){
    if(!isActive()||!root) return;
    const banner=el(bannerHTML());
    root.insertBefore(banner,root.firstChild);
    const notes=root.querySelectorAll(".vs-plate");
    if(notes[0]) notes[0].insertAdjacentHTML("beforeend",vsNoteHTML("player"));
    if(notes[1]) notes[1].insertAdjacentHTML("beforeend",vsNoteHTML("cpu"));
    const back=root.querySelector(".back-btn");
    if(back) back.onclick=()=>showIntro();
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
}

function endRun(status){
    if(Game.rogue) Game.rogue.runStatus=status;
    document.getElementById("rogueDevBtn")?.remove();
    document.getElementById("rogueDevPanel")?.remove();
}

function showHub(){
    const r=run();
    Game.screen="rogueHub";
    const stats=playerEffective();
    const base=comboBase(r.blade,r.ratchet,r.bit);
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
}

function showUpgradeResult(){
    const r=run();
    const u=r.lastUpgrade||{};
    const card=u.card||{};
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
    setTimeout(()=>showResults(),200);
    return true;
}

global.SpinWarsRogue={
    isActive,run,liveBonus,onClash,battleCombo,playerEffective,
    showIntro,onStarterPicked,decorateVs,scoreboardLabel,onMatchOver,
    mountDevButton,endRun,MAX_MATCHES,BOSS_AT,MODIFIERS
};
})(typeof window!=="undefined"?window:globalThis);
