/* SPIN WARS X — ROGUE LITE (Phase 1)
 * Pack/collection roguelite hub. Separate account from Campaign (rogue-run.js).
 * Live nights reuse SpinWarsRogue with loop:"lite".
 */
(function(global){
"use strict";

const C=()=>global.SpinWarsRogueLiteConfig||{};
const ACCOUNT_KEY="spinWarsX.rogueLite.account.v1";
const LIVE_KEY="spinWarsX.rogueLite.v1";
const RUNS_KEY="spinWarsX.rogueLite.runs.v1";
const COOKIE_KEY="swx_rogue_lite";
const STATS=["attack","knockback","defense","mobility","balance","stamina","burst"];
const LABEL={
    attack:"ATK",knockback:"KB",defense:"DEF",
    mobility:"MOB",balance:"BAL",stamina:"STA",burst:"BST"
};

function cfg(){return C();}
function rules(){return cfg().rules||{finalMatch:30,bossAt:{10:"mini",20:"mini",30:"final"},label:"ROGUE"};}
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

function blades(){return typeof BLADE_ENGINE!=="undefined"?BLADE_ENGINE:{};}
function ratchets(){return typeof RATCHETS!=="undefined"?RATCHETS:[];}
function bits(){return typeof BIT_ENGINE!=="undefined"?BIT_ENGINE:{};}
function bladeById(id){
    const eng=blades();
    if(id&&eng[id]) return eng[id];
    return Object.values(eng).find(b=>b&&(b.id===id||b.name===id))||null;
}
function bladeIdOf(blade){
    const eng=blades();
    return Object.keys(eng).find(k=>eng[k]===blade)||blade?.id||"";
}
function ratchetByName(name){return ratchets().find(r=>r&&r.name===name)||null;}
function bitByName(name){
    return Object.values(bits()).find(b=>b&&b.name===name)||null;
}
function playablePool(tier){
    return Object.entries(blades()).filter(([,b])=>{
        if(!b||b.hidden||b.rogueBoss) return false;
        if(tier&&String(b.tier)!==String(tier)) return false;
        return true;
    }).map(([id,b])=>({id,blade:b}));
}

function emptyCollection(){return {};}
function defaultAccount(){
    return {
        v:1,
        money:0,
        starterGranted:false,
        collection:emptyCollection(),
        goldRentals:{},
        modCharges:0,
        runTempMods:[],
        runTempParts:[],
        boughtPacks:0
    };
}

function bladeEntry(acc,id){
    acc.collection=acc.collection||{};
    if(!acc.collection[id]){
        acc.collection[id]={copies:0,awakening:{1:false,2:false,3:false}};
    }
    const e=acc.collection[id];
    e.awakening=e.awakening||{1:false,2:false,3:false};
    e.copies=Math.max(0,Number(e.copies)||0);
    return e;
}

function normalizeAccount(raw){
    const acc=Object.assign(defaultAccount(),raw||{});
    acc.collection=acc.collection||emptyCollection();
    acc.goldRentals=acc.goldRentals||{};
    acc.money=Math.max(0,Number(acc.money)||0);
    acc.runTempParts=Array.isArray(acc.runTempParts)?acc.runTempParts:[];
    acc.runTempMods=Array.isArray(acc.runTempMods)?acc.runTempMods.filter(m=>m&&m.id):[];
    /* Legacy pick-any charges → rolled mods from the pool (one each). */
    const legacy=Math.max(0,Number(acc.modCharges)||0);
    if(legacy>0){
        const used=acc.runTempMods.map(m=>m.id);
        for(let i=0;i<legacy;i++){
            const rolled=rollTempMod(used);
            if(rolled){
                acc.runTempMods.push(rolled);
                used.push(rolled.id);
            }
        }
        acc.modCharges=0;
    }else{
        acc.modCharges=0;
    }
    acc.starterGranted=!!acc.starterGranted;
    Object.keys(acc.collection).forEach(id=>bladeEntry(acc,id));
    return acc;
}

function loadAccount(){
    try{
        const raw=JSON.parse(localStorage.getItem(ACCOUNT_KEY)||"null");
        if(raw&&raw.v===1){
            const hadCharges=Math.max(0,Number(raw.modCharges)||0)>0;
            const acc=normalizeAccount(raw);
            if(hadCharges) saveAccount(acc);
            return acc;
        }
    }catch(_e){}
    return normalizeAccount(null);
}
function saveAccount(acc){
    try{localStorage.setItem(ACCOUNT_KEY,JSON.stringify(acc));}catch(_e){}
    Game.rogueLiteAccount=acc;
    return acc;
}
function account(){
    if(!Game.rogueLiteAccount) Game.rogueLiteAccount=loadAccount();
    return Game.rogueLiteAccount;
}
function persistAccount(){return saveAccount(account());}

function addMoney(n){
    const acc=account();
    acc.money=Math.max(0,round((Number(acc.money)||0)+(Number(n)||0)));
    persistAccount();
    return acc.money;
}
function trySpend(cost){
    const acc=account();
    const c=Math.max(0,round(cost));
    if(acc.money<c) return false;
    acc.money-=c;
    persistAccount();
    return true;
}

function ownedBladeIds(){
    const acc=account();
    return Object.keys(acc.collection||{}).filter(id=>(Number(acc.collection[id]?.copies)||0)>0);
}

function permanentBladeIds(){
    return ownedBladeIds().filter(id=>{
        const b=bladeById(id);
        const tier=String(b?.tier||"");
        return tier==="Bronze"||tier==="Silver";
    });
}

function activeGoldIds(){
    const acc=account();
    return Object.keys(acc.goldRentals||{}).filter(id=>{
        const g=acc.goldRentals[id];
        return g&&(Number(g.runsLeft)||0)>0&&bladeById(id);
    });
}

function draftBladePool(){
    const ids=new Set([...permanentBladeIds(),...activeGoldIds()]);
    return [...ids].map(id=>({id,blade:bladeById(id)})).filter(x=>x.blade);
}

function copiesOf(id){return Number(bladeEntry(account(),id).copies)||0;}

function awakeningProgress(id){
    const copies=copiesOf(id);
    const th=cfg().AWAKENING_THRESHOLDS||{1:5,2:10,3:15};
    const entry=bladeEntry(account(),id);
    return {
        copies,
        max:th[3]||15,
        levels:{
            1:{need:th[1]||5,unlocked:copies>=(th[1]||5),claimed:!!entry.awakening[1]},
            2:{need:th[2]||10,unlocked:copies>=(th[2]||10),claimed:!!entry.awakening[2]},
            3:{need:th[3]||15,unlocked:copies>=(th[3]||15),claimed:!!entry.awakening[3]}
        }
    };
}

function highestClaimedAwakening(id){
    const e=bladeEntry(account(),id);
    if(e.awakening[3]) return 3;
    if(e.awakening[2]) return 2;
    if(e.awakening[1]) return 1;
    return 0;
}

function claimAwakening(id,level){
    const prog=awakeningProgress(id);
    const lv=Number(level)||0;
    if(!prog.levels[lv]||!prog.levels[lv].unlocked) return {ok:false,why:"locked"};
    const e=bladeEntry(account(),id);
    e.awakening[lv]=true;
    persistAccount();
    return {ok:true,level:lv};
}

function autoClaimReadyAwakenings(id){
    const prog=awakeningProgress(id);
    [1,2,3].forEach(lv=>{
        if(prog.levels[lv].unlocked&&!prog.levels[lv].claimed) claimAwakening(id,lv);
    });
}

/** Grant a blade into collection. Gold goes to rentals. Returns reveal info. */
function grantBlade(id,opts){
    opts=opts||{};
    const blade=bladeById(id);
    if(!blade) return null;
    const tier=String(blade.tier||"Bronze");
    const acc=account();
    if(tier==="Gold"){
        const runs=Number(opts.runs)||cfg().GOLD_DEFAULT_RUNS||2;
        const cur=acc.goldRentals[id]||{runsLeft:0,extendCount:0};
        const wasActive=(Number(cur.runsLeft)||0)>0;
        if(wasActive){
            cur.runsLeft=(Number(cur.runsLeft)||0)+1;
            persistAccount();
            return {id,blade,tier,kind:"gold-extend",runsLeft:cur.runsLeft,duplicate:true};
        }
        cur.runsLeft=runs;
        acc.goldRentals[id]=cur;
        const e=bladeEntry(acc,id);
        e.copies=Math.max(e.copies,1);
        persistAccount();
        return {id,blade,tier,kind:"gold-new",runsLeft:cur.runsLeft,duplicate:false};
    }
    const e=bladeEntry(acc,id);
    const dup=e.copies>0;
    e.copies+=1;
    persistAccount();
    return {id,blade,tier,kind:dup?"duplicate":"new",copies:e.copies,duplicate:dup};
}

function grantStarterCollection(){
    const acc=account();
    if(acc.starterGranted) return [];
    const needB=cfg().STARTER_GRANT?.bronze||3;
    const needS=cfg().STARTER_GRANT?.silver||2;
    const bronze=shuffle(playablePool("Bronze"));
    const silver=shuffle(playablePool("Silver"));
    const picks=[];
    bronze.slice(0,needB).forEach(x=>picks.push(x.id));
    silver.slice(0,needS).forEach(x=>picks.push(x.id));
    const granted=picks.map(id=>grantBlade(id)).filter(Boolean);
    acc.starterGranted=true;
    if((Number(acc.money)||0)<=0) acc.money=cfg().STARTING_MONEY||80;
    persistAccount();
    return granted;
}

function ensureAccountReady(){
    const acc=account();
    if(!acc.starterGranted) grantStarterCollection();
    else if((Number(acc.money)||0)<=0 && ownedBladeIds().length===0){
        acc.money=cfg().STARTING_MONEY||80;
        persistAccount();
    }
    return acc;
}

function sellDuplicate(id){
    const blade=bladeById(id);
    if(!blade) return {ok:false,why:"missing"};
    const tier=String(blade.tier||"Bronze");
    if(tier==="Gold") return {ok:false,why:"gold"};
    const e=bladeEntry(account(),id);
    if(e.copies<=1) return {ok:false,why:"last"};
    e.copies-=1;
    const pay=Number(cfg().SELL?.[tier])||18;
    addMoney(pay);
    return {ok:true,money:pay,copies:e.copies};
}

function extendGold(){
    /* Paid Gold extend removed — rentals last their pack runs only. */
    return {ok:false,why:"removed"};
}

function consumeGoldRun(id){
    const acc=account();
    const g=acc.goldRentals[id];
    if(!g) return;
    g.runsLeft=Math.max(0,(Number(g.runsLeft)||0)-1);
    persistAccount();
}

/* ---------- Pack rolls (all granted) ---------- */
function rollTierBlade(tierPrefer,fallbackOdds){
    const prefer=playablePool(tierPrefer);
    if(fallbackOdds&&fallbackOdds.tier&&chance(fallbackOdds.p)){
        const alt=playablePool(fallbackOdds.tier);
        if(alt.length) return pick(alt).id;
    }
    if(!prefer.length){
        const any=playablePool(null);
        return any.length?pick(any).id:null;
    }
    return pick(prefer).id;
}
function chance(p){
    if(typeof cfg().chance==="function") return cfg().chance(p);
    return Math.random()<Number(p);
}

function openBeyPack(packId){
    const pack=cfg().packById?cfg().packById(packId):cfg().PACKS?.[packId];
    if(!pack||pack.family!=="bey") return {ok:false,why:"pack"};
    if(!trySpend(pack.price)) return {ok:false,why:"money"};
    const odds=cfg().odds||{};
    const ids=[];
    if(packId==="bey_bronze"){
        ids.push(rollTierBlade("Bronze"));
    }else if(packId==="bey_bronze_rare"){
        ids.push(rollTierBlade("Bronze",{tier:"Silver",p:odds.bronzeBeySilver||0.04}));
        ids.push(rollTierBlade("Bronze",{tier:"Silver",p:odds.bronzeBeySilver||0.04}));
    }else if(packId==="bey_bronze_premium"){
        for(let i=0;i<3;i++) ids.push(rollTierBlade("Bronze",{tier:"Silver",p:odds.bronzeBeySilver||0.04}));
    }else if(packId==="bey_silver"){
        ids.push(rollTierBlade("Silver",{tier:"Bronze",p:odds.silverBeyBronze||0.06}));
        ids.push(rollTierBlade("Silver",{tier:"Bronze",p:odds.silverBeyBronze||0.06}));
    }else if(packId==="bey_silver_rare"){
        for(let i=0;i<3;i++) ids.push(rollTierBlade("Silver"));
    }else if(packId==="bey_gold"){
        ids.push(rollTierBlade("Gold"));
    }else if(packId==="bey_gold_rare"){
        ids.push(rollTierBlade("Gold"));
        ids.push(chance(odds.rareGoldFlexGold||0.08)?rollTierBlade("Gold"):rollTierBlade("Silver"));
        ids.push(rollTierBlade("Bronze"));
        ids.push(rollTierBlade("Bronze"));
    }else if(packId==="bey_gold_premium"){
        ids.push(rollTierBlade("Gold"));
        ids.push(chance(odds.premiumFlexGold||0.72)?rollTierBlade("Gold"):rollTierBlade("Silver"));
        const thirdGold=chance(odds.premiumThirdGold||0.28);
        ids.push(thirdGold||chance(odds.premiumFlexGold||0.72)?rollTierBlade("Gold"):rollTierBlade("Silver"));
        ids.push(rollTierBlade("Silver"));
        ids.push(rollTierBlade("Bronze"));
    }
    const granted=ids.filter(Boolean).map(id=>grantBlade(id)).filter(Boolean);
    account().boughtPacks=(Number(account().boughtPacks)||0)+1;
    persistAccount();
    return {ok:true,pack,granted};
}

function heightFromBias(packTier){
    if(packTier==="Gold") return 60;
    if(packTier==="Silver"){
        if(chance(0.06)) return 80;
        return chance(0.55)?60:70;
    }
    // Bronze
    if(chance(0.22)) return chance(0.5)?60:70;
    return pick([60,70,80]);
}

function rollTempPart(packTier){
    const wantBit=packTier==="Gold"?0.62:packTier==="Silver"?0.38:0.18;
    if(chance(wantBit)){
        const pool=(typeof selectableBits==="function"?selectableBits():Object.values(bits()))
            .filter(b=>b&&b.name&&b.name!=="Taper"&&b.name!=="High Needle"&&b.name!=="Elevate");
        const bit=pick(pool);
        return bit?{kind:"bit",name:bit.name}:null;
    }
    const h=heightFromBias(packTier);
    const nums=packTier==="Gold"?[1,3,4,5,6,7,9]:[1,3,4,5,6,7,9];
    const name=`${pick(nums)}-${h}`;
    const rat=ratchetByName(name)||{name,number:Number(name.split("-")[0]),height:h};
    return {kind:"ratchet",name:rat.name};
}

function openPartPack(packId){
    const pack=cfg().packById?cfg().packById(packId):cfg().PACKS?.[packId];
    if(!pack||pack.family!=="part") return {ok:false,why:"pack"};
    if(!trySpend(pack.price)) return {ok:false,why:"money"};
    const count=packId==="part_gold"?3:packId==="part_silver"?2:1;
    const parts=[];
    for(let i=0;i<count;i++){
        const p=rollTempPart(pack.tier);
        if(p) parts.push(p);
    }
    const acc=account();
    acc.runTempParts=(acc.runTempParts||[]).concat(parts);
    persistAccount();
    return {ok:true,pack,parts};
}

function modifierPool(){
    return (typeof SpinWarsRogue!=="undefined"&&Array.isArray(SpinWarsRogue.MODIFIERS))
        ? SpinWarsRogue.MODIFIERS
        : [];
}

/** One random mod from the live pool. Prefer unused ids within a pack open. */
function rollTempMod(excludeIds){
    const all=modifierPool();
    if(!all.length) return null;
    const ban=new Set(excludeIds||[]);
    const fresh=all.filter(m=>m&&m.id&&!ban.has(m.id));
    const src=fresh.length?fresh:all;
    const m=pick(src);
    if(!m||!m.id) return null;
    return {id:m.id,name:m.name,tag:m.tag||"",blurb:m.blurb||""};
}

function openModPack(){
    const pack=cfg().PACKS?.mod_pack;
    if(!pack) return {ok:false,why:"pack"};
    if(!trySpend(pack.price)) return {ok:false,why:"money"};
    const count=2;
    const mods=[];
    const used=[];
    for(let i=0;i<count;i++){
        const m=rollTempMod(used);
        if(m){
            mods.push(m);
            used.push(m.id);
        }
    }
    const acc=account();
    acc.runTempMods=(acc.runTempMods||[]).concat(mods);
    persistAccount();
    return {ok:true,pack,mods};
}

function openPack(packId){
    const pack=cfg().PACKS?.[packId];
    if(!pack) return {ok:false,why:"pack"};
    if(pack.family==="bey") return openBeyPack(packId);
    if(pack.family==="part") return openPartPack(packId);
    if(pack.family==="mod") return openModPack();
    return {ok:false,why:"pack"};
}

/* ---------- Build draft ---------- */
function randomKitForBlade(blade){
    if(typeof SpinWarsRogue!=="undefined" && typeof SpinWarsRogue.pickCommittedParts==="function"){
        return SpinWarsRogue.pickCommittedParts(blade);
    }
    const role=String(blade?.type||"Balance");
    const bitPool=role==="Attack"
        ?["Rush","Flat","Low Flat","Kick"]
        :role==="Defense"?["Needle","Hexa","Ball","Orb"]
        :["Ball","Orb","Point","Level","Needle"];
    const bitName=pick(bitPool);
    const bit=bitByName(bitName)||{name:bitName};
    const height=role==="Attack"?pick([60,70]):60;
    const num=pick(role==="Attack"?[1,3,4,5]:[5,6,7,9]);
    const ratchet=ratchetByName(`${num}-${height}`)||{name:`${num}-${height}`,number:num,height};
    return {ratchet,bit};
}

function makeBuildCard(bladeId){
    const blade=bladeById(bladeId);
    if(!blade) return null;
    const parts=randomKitForBlade(blade);
    const combo=typeof calculateComboStats==="function"
        ? calculateComboStats(blade,parts.ratchet,parts.bit)
        : null;
    const preview=typeof SpinWarsRogue!=="undefined" && SpinWarsRogue.previewRunCombo
        ? SpinWarsRogue.previewRunCombo(blade,parts.ratchet,parts.bit)
        : combo;
    return {
        bladeId,
        blade,
        ratchet:parts.ratchet,
        bit:parts.bit,
        combo:preview||combo,
        awakeningAvailable:highestClaimedAwakening(bladeId)>0,
        awakeningLevel:highestClaimedAwakening(bladeId),
        goldRuns:String(blade.tier)==="Gold"?(Number(account().goldRentals[bladeId]?.runsLeft)||0):0
    };
}

function rollThreeBuilds(fromBladeId){
    if(fromBladeId){
        return [0,1,2].map(()=>makeBuildCard(fromBladeId)).filter(Boolean);
    }
    const pool=draftBladePool();
    if(!pool.length) return [];
    const picks=[];
    const bag=shuffle(pool);
    for(let i=0;i<3;i++){
        const src=bag[i%bag.length];
        const card=makeBuildCard(src.id);
        if(card) picks.push(card);
    }
    while(picks.length<3 && pool.length){
        const card=makeBuildCard(pick(pool).id);
        if(card) picks.push(card);
        else break;
    }
    return picks.slice(0,3);
}

function awakeningBonuses(blade,level){
    const lv=Number(level)||0;
    const role=String(blade?.type||"Balance");
    const b={attack:0,knockback:0,defense:0,mobility:0,balance:0,stamina:0,burst:0};
    if(lv<=0) return b;
    // Phase 3: slightly stronger role identity so Awakening feels worth claiming.
    const amp=lv===1?1:lv===2?2:3.5;
    if(role==="Attack"){
        b.knockback=Math.round(2.5*amp);b.attack=Math.round(1.5*amp);b.mobility=Math.round(1.2*amp);
    }else if(role==="Defense"){
        b.defense=Math.round(2.5*amp);b.balance=Math.round(2.2*amp);b.stamina=Math.round(1.2*amp);
    }else if(role==="Stamina"){
        b.stamina=Math.round(2.5*amp);b.balance=Math.round(2.2*amp);b.defense=Math.round(1.2*amp);
    }else{
        b.attack=Math.round(1.2*amp);b.defense=Math.round(1.2*amp);b.stamina=Math.round(1.2*amp);b.balance=Math.round(1.2*amp);b.knockback=Math.round(amp);
    }
    return b;
}

/* ---------- Live run bridge ---------- */
function clearLive(){
    try{localStorage.removeItem(LIVE_KEY);}catch(_e){}
    try{
        document.cookie=`${COOKIE_KEY}=;path=/;max-age=0`;
    }catch(_e){}
}
function hasLive(){
    try{
        const raw=JSON.parse(localStorage.getItem(LIVE_KEY)||"null");
        return !!(raw&&raw.rogue&&raw.rogue.loop==="lite");
    }catch(_e){return false;}
}
function peekLive(){
    try{
        const raw=JSON.parse(localStorage.getItem(LIVE_KEY)||"null");
        if(!raw||!raw.rogue) return null;
        return {match:raw.rogue.matchIndex,blade:raw.rogue.bladeName,score:raw.battle?.score};
    }catch(_e){return null;}
}
function persistLive(){
    if(typeof SpinWarsRogue==="undefined"||!Game.rogue||Game.rogue.loop!=="lite") return false;
    const data=SpinWarsRogue.buildSave?.();
    if(!data) return false;
    data.rogue.loop="lite";
    try{localStorage.setItem(LIVE_KEY,JSON.stringify(data));}catch(_e){return false;}
    return true;
}
function resumeLive(){
    try{
        const raw=JSON.parse(localStorage.getItem(LIVE_KEY)||"null");
        if(!raw||!raw.rogue) return false;
        raw.rogue.loop="lite";
        if(typeof SpinWarsRogue?.hydrateAndResume==="function"){
            return !!SpinWarsRogue.hydrateAndResume(raw);
        }
    }catch(_e){}
    return false;
}

function onNightOver(win,matchIndex,isShark){
    const r=Game.rogue;
    if(!r||r.loop!=="lite") return;
    const endless=(Number(matchIndex)||1)>(cfg().FINAL_MATCH||30);
    const money=typeof cfg().nightMoney==="function"
        ? cfg().nightMoney(win,matchIndex,{shark:!!isShark,endless})
        : (win?20:8);
    let pay=money;
    if(r?.earnBoost) pay=Math.round(pay*1.35);
    addMoney(pay);
    r.lastPayout={exp:0,money:pay,match:Number(matchIndex)||0,boosted:!!r.earnBoost};
    r.runEarn=r.runEarn||{exp:0,money:0};
    r.runEarn.money=(Number(r.runEarn.money)||0)+pay;
    persistLive();
    return {money,exp:0};
}

function archiveAndClear(status){
    try{
        const list=JSON.parse(localStorage.getItem(RUNS_KEY)||"[]");
        const r=Game.rogue;
        if(r){
            list.unshift({
                at:Date.now(),
                status:status||r.runStatus||"ended",
                blade:r.blade?.name||"",
                match:r.matchIndex||1,
                earn:r.runEarn||null
            });
            localStorage.setItem(RUNS_KEY,JSON.stringify(list.slice(0,40)));
        }
    }catch(_e){}
    clearLive();
    // Keep unused temp parts / rolled mods across runs.
    persistAccount();
}

function afterRunHome(status){
    archiveAndClear(status);
    Game.rogue=null;
    Game.mode="rogue-lite";
    showHub();
}

function beginBuild(build,useAwakening,extra){
    extra=extra||{};
    if(!build||!global.SpinWarsRogue?.beginFromLoadout) return false;
    const cost=cfg().RUN_COST||40;
    if(account().money>=cost) trySpend(cost);
    let blade=build.blade;
    let ratchet=build.ratchet;
    let bit=build.bit;
    const id=build.bladeId||bladeIdOf(blade);
    if(extra.tempPart){
        const p=extra.tempPart;
        if(p.kind==="bit"){
            const b=bitByName(p.name);
            if(b) bit=b;
        }else if(p.kind==="ratchet"){
            const r=ratchetByName(p.name)||{name:p.name};
            ratchet=r;
        }
        const acc=account();
        const ix=(acc.runTempParts||[]).findIndex(x=>x&&x.kind===p.kind&&x.name===p.name);
        if(ix>=0) acc.runTempParts.splice(ix,1);
        persistAccount();
    }
    if(String(blade.tier)==="Gold") consumeGoldRun(id);
    const awLv=useAwakening?highestClaimedAwakening(id):0;
    let modId=extra.modifierId||null;
    if(modId){
        const acc=account();
        const ix=(acc.runTempMods||[]).findIndex(m=>m&&m.id===modId);
        if(ix>=0){
            acc.runTempMods.splice(ix,1);
            persistAccount();
        }else{
            modId=null;
        }
    }
    const opts={
        loop:"lite",
        awakeningLevel:awLv,
        awakeningBonus:awakeningBonuses(blade,awLv),
        modifierId:modId
    };
    SpinWarsRogue.beginFromLoadout(blade,ratchet,bit,opts);
    if(Game.rogue){
        Game.rogue.loop="lite";
        Game.rogue.awakeningLevel=awLv;
        Game.rogue.awakeningBonus=opts.awakeningBonus;
        if(awLv>0){
            Game.rogue.runChip=Object.assign({},Game.rogue.runChip||{},opts.awakeningBonus);
        }
    }
    Game._rlDraft=null;
    Game._rlRunOpts=null;
    return true;
}

/* ---------- UI ---------- */
function bowl(){
    return typeof homeBowlHTML==="function"?homeBowlHTML():`<div class="home-bowl" aria-hidden="true"></div>`;
}
function brandMark(tag,opts){
    opts=opts||{};
    return typeof homeMarkHTML==="function"
        ? homeMarkHTML({tag:tag||"",compact:!!opts.compact,kicker:opts.kicker||"X STADIUM"})
        : `<header class="home-mark"><b>SPIN WARS X</b></header>`;
}
/** Compact screen title — pick/collection flows (not the full wordmark). */
function mark(title,tag){
    return `<header class="rl-flow-head">
        <div class="rl-inv-title">
            ${tag?`<span class="eyebrow">${tag}</span>`:""}
            <b>${title}</b>
        </div>
    </header>`;
}
function bladeAbilityLabel(blade){
    const kitId=typeof SpinWarsAbilities!=="undefined"&&SpinWarsAbilities.kitId
        ? SpinWarsAbilities.kitId(blade):null;
    if(kitId&&SpinWarsAbilities.kitMeta) return SpinWarsAbilities.kitMeta(kitId)?.name||"";
    return "";
}

function hudStrip(){
    const acc=account();
    const owned=ownedBladeIds().length;
    const golds=activeGoldIds().length;
    const temps=(acc.runTempParts||[]).length;
    const mods=(acc.runTempMods||[]).length;
    return `<section class="rl-hud">
        <div class="rl-hud-money"><small>MONEY</small><b>$${acc.money}</b></div>
        <div class="rl-hud-col"><small>COLLECTION</small><b>${owned}</b></div>
        <div class="rl-hud-col"><small>GOLD / TEMP</small><b>${golds} / ${temps}</b></div>
        <div class="rl-hud-col"><small>MODS</small><b>${mods}</b></div>
    </section>`;
}

function showHub(){
    ensureAccountReady();
    Game.mode="rogue-lite";
    Game.quickMatch=false;
    Game.screen="rogueLiteHub";
    const acc=account();
    const cost=cfg().RUN_COST||40;
    const canAfford=acc.money>=cost;
    const live=hasLive();
    const peek=live?peekLive():null;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-hub">
        ${bowl()}
        ${brandMark("PACK · BUILD · NIGHT")}
        ${hudStrip()}
        <p class="rl-lede">Random builds from your blades. Packs grow the pool. Awakening is optional when a ready Bey is drafted.</p>
        <nav class="rl-doors" aria-label="Rogue hub">
            ${live?`<button class="home-door rip swx-hero" id="rlContinue" type="button">
                <span class="home-door-kicker">LIVE</span>
                <b>CONTINUE</b>
                <small class="swx-state">Match ${peek?.match||"?"} · ${peek?.blade||""}</small>
            </button>`:""}
            <button class="home-door rip ${live?"":"swx-hero"}" id="rlStart" type="button">
                <span class="home-door-kicker">ENTRY $${cost}</span>
                <b>START RUN</b>
                <small class="swx-state">${canAfford?`$${acc.money} on hand`:`Broke — still playable`}</small>
            </button>
            <button class="home-door play" id="rlMarket" type="button">
                <span class="home-door-kicker">SPEND</span>
                <b>MARKETPLACE</b>
            </button>
            <button class="home-door play" id="rlCollection" type="button">
                <span class="home-door-kicker">OWNED</span>
                <b>COLLECTION</b>
            </button>
            <button class="home-door play" id="rlHelp" type="button">
                <span class="home-door-kicker">HOW</span>
                <b>ROGUE HELP</b>
            </button>
        </nav>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("rlContinue")?.addEventListener("click",()=>{
        if(!resumeLive()) showHub();
    });
    document.getElementById("rlStart")?.addEventListener("click",()=>showStartFlow());
    document.getElementById("rlMarket")?.addEventListener("click",()=>showMarket());
    document.getElementById("rlCollection")?.addEventListener("click",()=>showCollection());
    document.getElementById("rlHelp")?.addEventListener("click",()=>showHelp());
    mountDev();
}

function showHelp(){
    Game.screen="rogueLiteHelp";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-help">
        ${mark("ROGUE","HELP")}
        <section class="menu-card">
            <h2>What this is</h2>
            <p>Rogue is a pack-and-build night. You collect blades, draft three random kits, pick one, then climb 30 matches. Ratchets and bits are never permanent here — only blades (and temp part packs).</p>
        </section>
        <section class="menu-card">
            <h2>Packs</h2>
            <p>Bey packs grant every revealed blade. Part packs give temporary ratchet/bit cards for a later run start. Modifier packs roll random mods from the Rogue pool — you keep those cards and pick one when a night begins.</p>
        </section>
        <section class="menu-card">
            <h2>Awakening</h2>
            <p>Duplicates fill 5 / 10 / 15. Claimed Awakening can turn on when that Bey is drafted. Decline and it stays for later. Enhance / Evolve mid-run are different.</p>
        </section>
        <section class="menu-card">
            <h2>Gold</h2>
            <p>Gold blades are rentals. Pack Gold starts with ${cfg().GOLD_DEFAULT_RUNS||2} runs — they expire when those runs are spent. Shark Scale stays a boss — not a pack drop.</p>
        </section>
        <section class="menu-card">
            <h2>Difficulty</h2>
            <p>Nights 1–5 stay farmable on a starter kit. Later matches and bosses squeeze harder. A deeper blade collection raises CPU pressure — Awakening, Gold, temp parts, and modifiers are how you answer it.</p>
        </section>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    mountDev();
}

function invFilterIds(filter){
    const f=String(filter||"all");
    return ownedBladeIds().filter(id=>{
        const t=String(bladeById(id)?.tier||"");
        if(f==="all") return true;
        return t===f;
    }).sort((a,b)=>{
        const ta=String(bladeById(a)?.tier||"");
        const tb=String(bladeById(b)?.tier||"");
        const rank={Gold:0,Silver:1,Bronze:2};
        const ra=rank[ta]??9, rb=rank[tb]??9;
        if(ra!==rb) return ra-rb;
        return String(bladeById(a)?.name||"").localeCompare(String(bladeById(b)?.name||""));
    });
}

function beyRatingsHTML(blade){
    const stats=typeof bladeCardStats==="function"?bladeCardStats(blade):(blade?.card||{});
    const power=typeof comboPowerPoints==="function"?comboPowerPoints(stats):null;
    const ovr=stats.ovr ?? blade?.card?.ovr ?? "—";
    if(typeof comboRatingBadgesHTML==="function"){
        return comboRatingBadgesHTML({power,ovr},stats)
            .replace(">POWER<",">POWER PTS<")
            .replace(">OVR<",">OVERALL<");
    }
    return `<div class="vs-ratings">
      <div class="vs-rating power"><small>POWER PTS</small><b>${power??"—"}</b></div>
      <div class="vs-rating meta"><small>OVERALL</small><b>${ovr}</b></div>
    </div>`;
}

function beyStatBarsHTML(blade){
    const stats=typeof bladeCardStats==="function"?bladeCardStats(blade):(blade?.card||{});
    if(typeof comboStatGroupsHTML==="function") return comboStatGroupsHTML(stats);
    return "";
}

function inventoryCardHTML(id){
    const b=bladeById(id);
    if(!b) return "";
    const tier=String(b.tier||"Bronze");
    const art=typeof bladeSpritePath==="function"?bladeSpritePath(b):"";
    const prog=awakeningProgress(id);
    const aw=highestClaimedAwakening(id);
    const gold=tier==="Gold"?account().goldRentals[id]:null;
    const ability=bladeAbilityLabel(b);
    return `<button type="button" class="rl-inv-card tier-${tier.toLowerCase()}" data-inv="${id}">
        <div class="rl-inv-art">${art?`<img src="${art}" alt="">`:"<span></span>"}</div>
        <div class="rl-inv-copy">
            <span class="rl-inv-chip">${tier.toUpperCase()}${ability?` · ${ability}`:""}${aw?` · AW${aw}`:""}</span>
            <b>${b.name}</b>
            <small class="rl-inv-meta">Dup ${prog.copies}/${prog.max}${gold?` · ${gold.runsLeft} runs`:""}</small>
            ${beyRatingsHTML(b)}
            <div class="rl-inv-stats">${beyStatBarsHTML(b)}</div>
        </div>
    </button>`;
}

function inventoryPartCardHTML(p,idx){
    const isBit=p.kind==="bit";
    const art=isBit
        ?(typeof bitSpritePath==="function"?bitSpritePath(bitByName(p.name)||{name:p.name}):"")
        :(typeof ratchetSpritePath==="function"?ratchetSpritePath(ratchetByName(p.name)||{name:p.name}):"");
    return `<article class="rl-inv-card rl-inv-part" data-temp-part="${idx}">
        <div class="rl-inv-art">${art?`<img src="${art}" alt="">`:"<span></span>"}</div>
        <div class="rl-inv-copy">
            <span class="rl-inv-chip">${isBit?"BIT":"RATCHET"} · TEMP</span>
            <b>${p.name}</b>
            <small class="rl-inv-meta">Ready for next run</small>
        </div>
    </article>`;
}

function inventoryModCardHTML(m,idx){
    return `<article class="rl-inv-card rl-inv-mod" data-temp-mod="${idx}">
        <div class="rl-inv-art rl-inv-mod-glyph">◈</div>
        <div class="rl-inv-copy">
            <span class="rl-inv-chip">${m.tag||"MOD"} · TEMP</span>
            <b>${m.name||m.id}</b>
            <small class="rl-inv-meta">${m.blurb||"Rolled modifier"}</small>
        </div>
    </article>`;
}

function showCollection(){
    ensureAccountReady();
    Game.screen="rogueLiteCollection";
    const filter=Game._rlCollectionFilter||"all";
    const ids=invFilterIds(filter);
    const temps=account().runTempParts||[];
    const mods=account().runTempMods||[];
    const app=document.getElementById("app");
    const options=["all","Bronze","Silver","Gold"].map(v=>{
        const label=v==="all"?"ALL":v.toUpperCase();
        return `<option value="${v}" ${filter===v?"selected":""}>${label}</option>`;
    }).join("");
    const cards=ids.map(inventoryCardHTML).join("")||`<p class="rl-empty">No blades in this filter.</p>`;
    const partSec=temps.length
        ? `<section class="rl-inv-sec">
            <h2 class="rl-inv-sec-h">TEMP PARTS · ${temps.length}</h2>
            <div class="rl-inv-grid rl-inv-grid-parts">${temps.map(inventoryPartCardHTML).join("")}</div>
           </section>`
        : "";
    const modSec=mods.length
        ? `<section class="rl-inv-sec">
            <h2 class="rl-inv-sec-h">MODIFIERS · ${mods.length}</h2>
            <div class="rl-inv-grid rl-inv-grid-mods">${mods.map(inventoryModCardHTML).join("")}</div>
           </section>`
        : "";
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-collection rl-inv-screen">
        <header class="rl-inv-head">
            <div class="rl-inv-title">
                <span class="eyebrow">INVENTORY</span>
                <b>COLLECTION</b>
            </div>
            <label class="rl-inv-filter">
                <span>FILTER</span>
                <select id="rlInvFilter">${options}</select>
            </label>
        </header>
        ${hudStrip()}
        <div class="rl-inv-scroll">
            <section class="rl-inv-sec">
                <h2 class="rl-inv-sec-h">BLADES · ${ids.length}</h2>
                <div class="rl-inv-grid">${cards}</div>
            </section>
            ${partSec}
            ${modSec}
        </div>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    document.getElementById("rlInvFilter").onchange=(e)=>{
        Game._rlCollectionFilter=e.target.value||"all";
        showCollection();
    };
    document.querySelectorAll("[data-inv]").forEach(btn=>{
        btn.onclick=()=>showCollectionDetail(btn.getAttribute("data-inv"));
    });
    mountDev();
}

function showCollectionDetail(id){
    ensureAccountReady();
    Game.screen="rogueLiteCollectionDetail";
    const b=bladeById(id);
    if(!b){ showCollection(); return; }
    const tier=String(b.tier||"Bronze");
    const art=typeof bladeSpritePath==="function"?bladeSpritePath(b):"";
    const prog=awakeningProgress(id);
    const aw=highestClaimedAwakening(id);
    const gold=tier==="Gold"?account().goldRentals[id]:null;
    const ability=typeof SpinWarsAbilities!=="undefined"&&SpinWarsAbilities.abilityChipHTML
        ? SpinWarsAbilities.abilityChipHTML(b)
        : "";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-collection rl-inv-screen">
        <header class="rl-inv-head">
            <div class="rl-inv-title">
                <span class="eyebrow">${tier.toUpperCase()}</span>
                <b>${b.name}</b>
            </div>
        </header>
        ${hudStrip()}
        <article class="rl-bey-detail tier-${tier.toLowerCase()}">
            <div class="rl-bey-art">${art?`<img src="${art}" alt="">`:"<span></span>"}</div>
            ${beyRatingsHTML(b)}
            ${ability}
            <div class="rl-inv-stats">${beyStatBarsHTML(b)}</div>
            <div class="rl-aw-row">
                ${[1,2,3].map(lv=>{
                    const L=prog.levels[lv];
                    if(L.claimed) return `<span class="rl-aw on">LV${lv} READY</span>`;
                    if(L.unlocked) return `<button type="button" class="rl-aw claim" data-aw="${id}:${lv}">CLAIM LV${lv}</button>`;
                    return `<span class="rl-aw">LV${lv} · ${L.need}</span>`;
                }).join("")}
            </div>
            <small class="rl-detail-dup">Duplicates ${prog.copies} / ${prog.max}${gold?` · ${gold.runsLeft} RUNS LEFT`:""}</small>
            ${tier!=="Gold"&&prog.copies>1
                ?`<button type="button" class="menu-btn silver" id="rlSellBey">SELL DUP · $${cfg().SELL?.[tier]||0}</button>`
                :""}
        </article>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showCollection()));
    document.getElementById("rlSellBey")?.addEventListener("click",()=>{
        sellDuplicate(id);
        showCollectionDetail(id);
    });
    document.querySelectorAll("[data-aw]").forEach(btn=>{
        btn.onclick=()=>{
            const [bid,lv]=String(btn.getAttribute("data-aw")||"").split(":");
            claimAwakening(bid,Number(lv));
            showCollectionDetail(bid);
        };
    });
    mountDev();
}

function showMarket(){
    ensureAccountReady();
    Game.screen="rogueLiteMarket";
    const packs=(typeof cfg().packList==="function"?cfg().packList():Object.values(cfg().PACKS||{}));
    const beys=packs.filter(p=>p.family==="bey");
    const parts=packs.filter(p=>p.family==="part");
    const mods=packs.filter(p=>p.family==="mod");
    const money=account().money;
    const temps=account().runTempParts||[];
    const app=document.getElementById("app");
    const section=(title,list)=>`<section class="rl-market-sec">
        <h2 class="rl-market-h">${title}</h2>
        <div class="rl-pack-grid">
            ${list.map(p=>{
                const can=money>=p.price;
                return `<article class="rl-pack-card tier-${String(p.tier||"").toLowerCase()}">
                    <div class="rl-pack-foil" aria-hidden="true"></div>
                    <span class="eyebrow">${p.tier}</span>
                    <b>${p.name}</b>
                    <p>${p.blurb}</p>
                    <button type="button" class="rip-btn rl-buy" data-pack="${p.id}" ${can?"":"disabled"}>$${p.price}</button>
                </article>`;
            }).join("")}
        </div>
    </section>`;
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-market">
        ${mark("MARKETPLACE","OPEN PACKS")}
        ${hudStrip()}
        <p class="rl-lede">Tap a pack. Tear it open. Cards flip one by one.${temps.length?` · ${temps.length} temp part${temps.length>1?"s":""} ready.`:""}${(account().runTempMods||[]).length?` · ${(account().runTempMods||[]).length} mod${(account().runTempMods||[]).length>1?"s":""} ready.`:""}</p>
        ${section("BEY PACKS",beys)}
        ${section("PART PACKS",parts)}
        ${section("MODIFIERS",mods)}
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    document.querySelectorAll("[data-pack]").forEach(btn=>{
        btn.onclick=()=>buyAndOpenPack(btn.getAttribute("data-pack"));
    });
    mountDev();
}

function buyAndOpenPack(packId){
    const out=openPack(packId);
    if(!out.ok){
        showMarket();
        return;
    }
    showPackTheater(out);
}

function tradingBeyCardHTML(g,idx){
    const b=g.blade;
    const tier=String(b.tier||"Bronze");
    const art=typeof bladeSpritePath==="function"?bladeSpritePath(b):"";
    const prog=awakeningProgress(g.id);
    let stamp="NEW";
    if(g.kind==="duplicate"||g.duplicate) stamp=`DUP ${prog.copies}/${prog.max}`;
    if(g.kind==="gold-new") stamp=`${g.runsLeft} RUNS`;
    if(g.kind==="gold-extend") stamp=`+1 RUN · ${g.runsLeft}`;
    const ability=bladeAbilityLabel(b);
    return `<article class="rl-trade-card rl-trade-bey tier-${tier.toLowerCase()}" data-card-i="${idx}" aria-hidden="true">
        <div class="rl-tc-back" aria-hidden="true"><span>${tier}</span></div>
        <div class="rl-tc-face">
            <span class="rl-tc-stamp">${stamp}</span>
            <div class="rl-tc-art">${art?`<img src="${art}" alt="">`:"<span></span>"}</div>
            <span class="rl-inv-chip">${tier}${ability?` · ${ability}`:""}</span>
            <b>${b.name}</b>
            ${beyRatingsHTML(b)}
            <div class="rl-inv-stats">${beyStatBarsHTML(b)}</div>
        </div>
    </article>`;
}

function tradingPartCardHTML(p,idx){
    const isBit=p.kind==="bit";
    const art=isBit
        ?(typeof bitSpritePath==="function"?bitSpritePath(bitByName(p.name)||{name:p.name}):"")
        :(typeof ratchetSpritePath==="function"?ratchetSpritePath(ratchetByName(p.name)||{name:p.name}):"");
    return `<article class="rl-trade-card tier-part" data-card-i="${idx}" aria-hidden="true">
        <div class="rl-tc-back" aria-hidden="true"><span>PART</span></div>
        <div class="rl-tc-face">
            <span class="rl-tc-stamp">TEMP</span>
            <div class="rl-tc-art">${art?`<img src="${art}" alt="">`:"<span></span>"}</div>
            <span class="eyebrow">${isBit?"BIT":"RATCHET"}</span>
            <b>${p.name}</b>
            <small class="rl-tc-ovr">THIS RUN</small>
        </div>
    </article>`;
}

function tradingModCardHTML(mod,idx){
    const name=mod?.name||"MODIFIER";
    const tag=mod?.tag||"TEMP";
    const blurb=mod?.blurb||"Rolled from the Rogue modifier pool.";
    return `<article class="rl-trade-card tier-gold" data-card-i="${idx}" aria-hidden="true">
        <div class="rl-tc-back" aria-hidden="true"><span>MOD</span></div>
        <div class="rl-tc-face">
            <span class="rl-tc-stamp">TEMP</span>
            <div class="rl-tc-art rl-tc-mod">◈</div>
            <span class="eyebrow">${tag}</span>
            <b>${name}</b>
            <small class="rl-tc-ovr">RUN START</small>
            <p class="rl-tc-blurb">${blurb}</p>
        </div>
    </article>`;
}

function showPackTheater(out){
    Game.screen="rogueLitePackOpen";
    const pack=out.pack;
    const tier=String(pack.tier||"Bronze").toLowerCase();
    let cardsHTML="";
    let n=0;
    if(out.granted&&out.granted.length){
        cardsHTML=out.granted.map((g,i)=>tradingBeyCardHTML(g,i)).join("");
        n=out.granted.length;
    }else if(out.parts&&out.parts.length){
        cardsHTML=out.parts.map((p,i)=>tradingPartCardHTML(p,i)).join("");
        n=out.parts.length;
    }else if(out.mods&&out.mods.length){
        cardsHTML=out.mods.map((m,i)=>tradingModCardHTML(m,i)).join("");
        n=out.mods.length;
    }
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-open" id="rlOpenMain">
        <p class="rl-open-title">${pack.name}</p>
        <div class="rl-open-stage" id="rlOpenStage">
            <button type="button" class="rl-pack-shell tier-${tier}" id="rlPackShell" aria-label="Open pack">
                <span class="rl-pack-band">${pack.tier}</span>
                <span class="rl-pack-logo">SPIN WARS</span>
                <span class="rl-pack-x">X</span>
                <span class="rl-pack-cta">TAP TO OPEN</span>
            </button>
            <div class="rl-card-rail" id="rlCardRail" hidden>${cardsHTML}</div>
        </div>
        <p class="rl-open-hint" id="rlOpenHint">Tear the pack.</p>
        <button class="rip-btn" id="rlOpenDone" type="button" hidden>DONE</button>
    </main>`;
    const main=document.getElementById("rlOpenMain");
    const shell=document.getElementById("rlPackShell");
    const rail=document.getElementById("rlCardRail");
    const stage=document.getElementById("rlOpenStage");
    const hint=document.getElementById("rlOpenHint");
    const done=document.getElementById("rlOpenDone");
    let opened=false;
    let revealed=0;
    const snapToCard=(card)=>{
        if(!card||!rail) return;
        requestAnimationFrame(()=>{
            const left=card.offsetLeft-(rail.clientWidth-card.clientWidth)/2;
            rail.scrollTo({left:Math.max(0,left),behavior:"smooth"});
        });
    };
    const revealNext=()=>{
        const card=rail.querySelector(`[data-card-i="${revealed}"]`);
        if(!card){
            done.hidden=false;
            hint.textContent=n>1?`All ${n} cards revealed.`:"Card revealed.";
            return;
        }
        card.setAttribute("aria-hidden","false");
        card.classList.add("deal","flip");
        revealed+=1;
        snapToCard(card);
        hint.textContent=revealed<n?`Card ${revealed} of ${n} — tap anywhere for next`:`Card ${revealed} of ${n}`;
        if(revealed>=n){
            done.hidden=false;
        }
    };
    const startReveal=()=>{
        if(opened){
            if(revealed<n) revealNext();
            return;
        }
        opened=true;
        main?.classList.add("is-revealing");
        shell.classList.add("ripping");
        hint.textContent="…";
        window.setTimeout(()=>{
            shell.hidden=true;
            shell.classList.add("rl-pack-gone");
            rail.hidden=false;
            revealNext();
        },520);
    };
    const onAdvance=(e)=>{
        if(e.target.closest && e.target.closest("#rlOpenDone,.back-btn,#rlDevBtn,.rogue-dev-panel")) return;
        if(!opened) startReveal();
        else if(revealed<n) revealNext();
    };
    shell.onclick=(e)=>{ e.stopPropagation(); startReveal(); };
    main.onclick=onAdvance;
    done.onclick=(e)=>{ e.stopPropagation(); showMarket(); };
    mountDev();
}

function showStartFlow(){
    ensureAccountReady();
    Game._rlRunOpts={tempPart:null,modifierId:null};
    const golds=activeGoldIds();
    if(golds.length){
        showGoldCommit(golds);
        return;
    }
    showBuildDraft(null);
}

function showGoldCommit(golds){
    Game.screen="rogueLiteGoldCommit";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-gold rl-flow-screen">
        ${mark("GOLD RENTAL","OPTIONAL")}
        <p class="rl-lede rl-lede-tight">Commit a Gold to force three kits on that Bey — or draft from your pool.</p>
        <div class="rl-pick-list">
            ${golds.map(id=>{
                const b=bladeById(id);
                const g=account().goldRentals[id];
                const art=typeof bladeSpritePath==="function"?bladeSpritePath(b):"";
                const ability=bladeAbilityLabel(b);
                return `<button type="button" class="rl-pick-row tier-gold" data-gold="${id}">
                    <div class="rl-pick-art">${art?`<img src="${art}" alt="">`:""}</div>
                    <div class="rl-pick-copy">
                        <span class="rl-inv-chip">GOLD${ability?` · ${ability}`:""}</span>
                        <b>${b.name}</b>
                        <small class="rl-inv-meta">${g.runsLeft} RUNS LEFT</small>
                        ${beyRatingsHTML(b)}
                        <div class="rl-inv-stats">${beyStatBarsHTML(b)}</div>
                    </div>
                </button>`;
            }).join("")}
        </div>
        <button class="rip-btn" id="rlSkipGold" type="button">DRAFT FROM COLLECTION</button>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    document.getElementById("rlSkipGold").onclick=()=>showBuildDraft(null);
    document.querySelectorAll("[data-gold]").forEach(btn=>{
        btn.onclick=()=>showBuildDraft(btn.getAttribute("data-gold"));
    });
}

function buildCardHTML(build,idx){
    const c=build.combo;
    const art=typeof bladeSpritePath==="function"?bladeSpritePath(build.blade):"";
    const ratArt=typeof ratchetSpritePath==="function"?ratchetSpritePath(build.ratchet):"";
    const bitArt=typeof bitSpritePath==="function"?bitSpritePath(build.bit):"";
    const tier=String(build.blade.tier||"");
    const ability=bladeAbilityLabel(build.blade);
    const badges=c&&typeof comboRatingBadgesHTML==="function"
        ? comboRatingBadgesHTML(c,c.stats)
            .replace(">POWER<",">POWER PTS<")
            .replace(">OVR<",">OVERALL<")
        : "";
    const bars=c&&typeof comboStatGroupsHTML==="function"
        ? `<div class="rl-inv-stats">${comboStatGroupsHTML(c.stats||c)}</div>`
        : "";
    const aw=build.awakeningAvailable
        ? `<span class="rl-aw-badge">AWAKENING ${build.awakeningLevel}</span>`
        : "";
    return `<button type="button" class="rl-build-card tier-${tier.toLowerCase()}" data-build="${idx}">
        ${aw}
        <div class="rl-build-arts">
            <div class="rl-bey-art">${art?`<img src="${art}" alt="">`:""}</div>
            <div class="rl-part-art">${ratArt?`<img src="${ratArt}" alt="">`:""}</div>
            <div class="rl-part-art">${bitArt?`<img src="${bitArt}" alt="">`:""}</div>
        </div>
        <span class="rl-inv-chip">BUILD ${String.fromCharCode(65+idx)} · ${tier.toUpperCase()}${ability?` · ${ability}`:""}</span>
        <b>${build.blade.name}</b>
        <small>${build.ratchet.name} · ${build.bit.name}</small>
        ${badges}
        ${bars}
    </button>`;
}

function showBuildDraft(goldId){
    const builds=rollThreeBuilds(goldId);
    Game._rlDraft={builds,goldId};
    Game.screen="rogueLiteDraft";
    const app=document.getElementById("app");
    if(!builds.length){
        app.innerHTML=`<div class="background stadium"></div>
        <main class="home"><p class="rl-lede">No blades in your pool. Open packs first.</p>
        <button class="rip-btn" id="rlBackHub" type="button">HUB</button></main>`;
        document.getElementById("rlBackHub").onclick=()=>showHub();
        return;
    }
    const cost=cfg().RUN_COST||40;
    const temps=(account().runTempParts||[]).length;
    const mods=(account().runTempMods||[]).length;
    const sideNote=[temps?`${temps} temp part${temps>1?"s":""}`:"",mods?`${mods} mod${mods>1?"s":""}`:""].filter(Boolean).join(" · ");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-draft rl-flow-screen">
        ${mark("CHOOSE YOUR BUILD",`ENTRY $${cost}`)}
        <p class="rl-lede rl-lede-tight">Pick one kit. Ratchet and bit are rolled.${sideNote?` Then optional ${sideNote}.`:""}${account().money<cost?" Entry waived while broke.":""}</p>
        <div class="rl-build-row">
            ${builds.map((b,i)=>buildCardHTML(b,i)).join("")}
        </div>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    document.querySelectorAll("[data-build]").forEach(btn=>{
        btn.onclick=()=>onBuildPicked(Number(btn.getAttribute("data-build")));
    });
}

function onBuildPicked(idx){
    const draft=Game._rlDraft;
    const build=draft?.builds?.[idx];
    if(!build) return;
    Game._rlRunOpts=Game._rlRunOpts||{tempPart:null,modifierId:null};
    Game._rlRunOpts.build=build;
    const aw=highestClaimedAwakening(build.bladeId);
    if(aw>0){
        showAwakeningPrompt(build,aw);
        return;
    }
    continueAfterAwakening(build,false);
}

function showAwakeningPrompt(build,level){
    Game.screen="rogueLiteAwaken";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-awaken rl-flow-screen">
        ${mark("AWAKENING",`LV.${level}`)}
        <p class="rl-lede"><b>${build.blade.name}</b> has Awakening ready. Use it for this run only? Declining keeps it for later.</p>
        <div class="rl-awaken-actions">
            <button class="rip-btn" id="rlAwYes" type="button">USE AWAKENING</button>
            <button class="menu-btn silver" id="rlAwNo" type="button">NOT THIS RUN</button>
        </div>
    </main>`;
    document.getElementById("rlAwYes").onclick=()=>continueAfterAwakening(build,true);
    document.getElementById("rlAwNo").onclick=()=>continueAfterAwakening(build,false);
}

function continueAfterAwakening(build,useAwakening){
    Game._rlRunOpts=Game._rlRunOpts||{};
    Game._rlRunOpts.build=build;
    Game._rlRunOpts.useAwakening=!!useAwakening;
    const temps=account().runTempParts||[];
    if(temps.length){
        showTempPartPick(build,useAwakening);
        return;
    }
    continueAfterTemp(build,useAwakening,null);
}

function showTempPartPick(build,useAwakening){
    Game.screen="rogueLiteTempPart";
    const temps=account().runTempParts||[];
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-temp rl-flow-screen">
        ${mark("TEMP PART","OPTIONAL")}
        <p class="rl-lede rl-lede-tight">Slot one temporary part into <b>${build.blade.name}</b>, or skip.</p>
        <div class="rl-pick-list">
            ${temps.map((p,i)=>{
                const art=p.kind==="bit"
                    ?(typeof bitSpritePath==="function"?bitSpritePath(bitByName(p.name)||{name:p.name}):"")
                    :(typeof ratchetSpritePath==="function"?ratchetSpritePath(ratchetByName(p.name)||{name:p.name}):"");
                return `<button type="button" class="rl-pick-row" data-temp="${i}">
                    <div class="rl-pick-art">${art?`<img src="${art}" alt="">`:""}</div>
                    <div class="rl-pick-copy">
                        <span class="rl-inv-chip">${String(p.kind||"PART").toUpperCase()} · TEMP</span>
                        <b>${p.name}</b>
                    </div>
                </button>`;
            }).join("")}
        </div>
        <button class="menu-btn silver" id="rlTempSkip" type="button">SKIP</button>
    </main>`;
    document.getElementById("rlTempSkip").onclick=()=>continueAfterTemp(build,useAwakening,null);
    document.querySelectorAll("[data-temp]").forEach(btn=>{
        btn.onclick=()=>{
            const p=temps[Number(btn.getAttribute("data-temp"))];
            continueAfterTemp(build,useAwakening,p||null);
        };
    });
}

function continueAfterTemp(build,useAwakening,tempPart){
    Game._rlRunOpts.tempPart=tempPart||null;
    if((account().runTempMods||[]).length>0){
        showModifierPick(build,useAwakening,tempPart);
        return;
    }
    beginBuild(build,useAwakening,{tempPart,modifierId:null});
}

function showModifierPick(build,useAwakening,tempPart){
    Game.screen="rogueLiteModPick";
    const owned=(account().runTempMods||[]).slice();
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-lite-mod rl-flow-screen">
        ${mark("MODIFIER",`${owned.length} READY`)}
        <p class="rl-lede rl-lede-tight">Pick one rolled mod for this run, or skip to keep them.</p>
        <div class="rl-pick-list rl-mod-list">
            ${owned.map((m,i)=>`<button type="button" class="rl-pick-row rl-mod-card" data-mod-i="${i}" data-mod="${m.id}">
                <div class="rl-pick-art rl-inv-mod-glyph">◈</div>
                <div class="rl-pick-copy">
                    <span class="rl-inv-chip">${m.tag||"MOD"}</span>
                    <b>${m.name||m.id}</b>
                    <small class="rl-inv-meta">${m.blurb||""}</small>
                </div>
            </button>`).join("")}
        </div>
        <button class="menu-btn silver" id="rlModSkip" type="button">NO MODIFIER</button>
    </main>`;
    document.getElementById("rlModSkip").onclick=()=>beginBuild(build,useAwakening,{tempPart,modifierId:null});
    document.querySelectorAll("[data-mod]").forEach(btn=>{
        btn.onclick=()=>beginBuild(build,useAwakening,{tempPart,modifierId:btn.getAttribute("data-mod")});
    });
}

function bootFromHome(){
    ensureAccountReady();
    showHub();
}

function mountDev(){
    document.getElementById("rlDevBtn")?.remove();
    document.getElementById("rogueDevBtn")?.remove();
    const btn=document.createElement("button");
    btn.id="rlDevBtn";
    btn.type="button";
    btn.className="rogue-dev-btn";
    btn.textContent="DEV";
    btn.onclick=()=>toggleDev();
    document.body.appendChild(btn);
}

function toggleDev(){
    const existing=document.getElementById("rlDevPanel");
    if(existing){
        existing.remove();
        document.body.classList.remove("rogue-dev-open");
        return;
    }
    const acc=account();
    const owned=ownedBladeIds().length;
    const panel=document.createElement("aside");
    panel.id="rlDevPanel";
    panel.className="rogue-dev-panel";
    panel.innerHTML=`<header><b>ROGUE LITE DEV</b><button type="button" id="rlDevClose">✕</button></header>
        <p class="rogue-dev-copy">Cheats write the Rogue Lite account only — Campaign Track stays untouched.</p>
        <p class="rogue-dev-stats">$${acc.money} · ${owned} blades · ${(acc.runTempMods||[]).length} mods · ${(acc.runTempParts||[]).length} temps</p>
        <div class="rogue-dev-actions">
            <button type="button" class="menu-btn silver" data-rl="mon100">+100 MONEY</button>
            <button type="button" class="menu-btn silver" data-rl="mon500">+500 MONEY</button>
            <button type="button" class="menu-btn gold" data-rl="maxmon">MAX MONEY</button>
            <button type="button" class="menu-btn silver" data-rl="grantB">+RANDOM BRONZE</button>
            <button type="button" class="menu-btn silver" data-rl="grantS">+RANDOM SILVER</button>
            <button type="button" class="menu-btn gold" data-rl="grantG">+RANDOM GOLD</button>
            <button type="button" class="menu-btn gold" data-rl="allBS">OWN ALL B/S</button>
            <button type="button" class="menu-btn silver" data-rl="dup5">+5 DUPES (FIRST)</button>
            <button type="button" class="menu-btn silver" data-rl="claimAw">CLAIM AWAKENING</button>
            <button type="button" class="menu-btn silver" data-rl="mod">+2 RANDOM MODS</button>
            <button type="button" class="menu-btn silver" data-rl="parts">+TEMP PARTS</button>
            <button type="button" class="menu-btn silver" data-rl="packB">OPEN BRONZE PACK</button>
            <button type="button" class="menu-btn gold" data-rl="packPrem">OPEN PREMIUM GOLD</button>
            <button type="button" class="menu-btn gold" data-rl="packMod">OPEN MOD PACK</button>
            <button type="button" class="menu-btn silver" data-rl="n10">SKIP TO 10</button>
            <button type="button" class="menu-btn silver" data-rl="n20">SKIP TO 20</button>
            <button type="button" class="menu-btn silver" data-rl="n29">SKIP TO 29</button>
            <button type="button" class="menu-btn gold" data-rl="shark">FINAL BOSS</button>
            <button type="button" class="menu-btn gold" data-rl="win">WIN NIGHT</button>
            <button type="button" class="menu-btn silver" data-rl="reset">RESET ACCOUNT</button>
        </div>`;
    document.body.appendChild(panel);
    document.body.classList.add("rogue-dev-open");
    const close=()=>{panel.remove();document.body.classList.remove("rogue-dev-open");};
    document.getElementById("rlDevClose").onclick=close;
    panel.querySelectorAll("[data-rl]").forEach(btn=>{
        btn.onclick=()=>{devAct(btn.getAttribute("data-rl"));close();};
    });
}

function ensureLiteLiveForJump(){
    if(Game.rogue&&Game.rogue.loop==="lite") return true;
    const pool=draftBladePool();
    if(!pool.length||!global.SpinWarsRogue?.beginFromLoadout) return false;
    const card=makeBuildCard(pool[0].id);
    if(!card) return false;
    beginBuild(card,false,{});
    return !!(Game.rogue&&Game.rogue.loop==="lite");
}

function grantAllBronzeSilver(){
    playablePool("Bronze").forEach(x=>{
        const e=bladeEntry(account(),x.id);
        if(e.copies<1) grantBlade(x.id);
    });
    playablePool("Silver").forEach(x=>{
        const e=bladeEntry(account(),x.id);
        if(e.copies<1) grantBlade(x.id);
    });
}

function fillFirstAwakening(){
    const id=ownedBladeIds()[0];
    if(!id) return;
    const e=bladeEntry(account(),id);
    e.copies=Math.max(e.copies,15);
    e.awakening={1:true,2:true,3:true};
    persistAccount();
}

function claimAllReady(){
    ownedBladeIds().forEach(id=>{
        const prog=awakeningProgress(id);
        [1,2,3].forEach(lv=>{
            if(prog.levels[lv].unlocked) claimAwakening(id,lv);
        });
    });
}

function awakenLiveBey(){
    const r=Game.rogue;
    if(!r||r.loop!=="lite"||!r.blade) return;
    const id=bladeIdOf(r.blade);
    if(!id) return;
    const e=bladeEntry(account(),id);
    e.copies=Math.max(e.copies,15);
    e.awakening={1:true,2:true,3:true};
    persistAccount();
    const lv=3;
    r.awakeningLevel=lv;
    r.awakeningBonus=awakeningBonuses(r.blade,lv);
    r.runChip=Object.assign({},r.runChip||{},r.awakeningBonus);
}

function clearLiveAwakening(){
    const r=Game.rogue;
    if(!r||r.loop!=="lite") return;
    r.awakeningLevel=0;
    r.awakeningBonus={attack:0,knockback:0,defense:0,mobility:0,balance:0,stamina:0,burst:0};
    // strip prior awakening from runChip by rebuilding from empty + keep non-awake? simplest: zero runChip awakening keys
    r.runChip=r.runChip||{};
    STATS.forEach(k=>{r.runChip[k]=0;});
}

function refreshLiteScreen(){
    const s=Game.screen||"";
    if(s==="rogueLiteHub") showHub();
    else if(s==="rogueLiteMarket") showMarket();
    else if(s==="rogueLiteCollection"||s==="rogueLiteCollectionList") showCollection();
    else if(s==="rogueLiteCollectionDetail"){
        const ids=invFilterIds(Game._rlCollectionFilter||"all");
        const id=ids[0];
        if(id) showCollectionDetail(id);
        else showCollection();
    }
    else if(s==="rogueLiteHelp") showHelp();
    else showHub();
}

function devAct(id,opts){
    opts=opts||{};
    ensureAccountReady();
    const acc=account();
    if(id==="mon100") addMoney(100);
    else if(id==="mon500") addMoney(500);
    else if(id==="maxmon"){acc.money=9999;persistAccount();}
    else if(id==="grantB"){
        const p=playablePool("Bronze");
        if(p.length) grantBlade(pick(p).id);
    }else if(id==="grantS"){
        const p=playablePool("Silver");
        if(p.length) grantBlade(pick(p).id);
    }else if(id==="grantG"){
        const p=playablePool("Gold");
        if(p.length) grantBlade(pick(p).id);
    }else if(id==="allBS") grantAllBronzeSilver();
    else if(id==="dup5"){
        const bid=ownedBladeIds()[0];
        if(bid){for(let i=0;i<5;i++) grantBlade(bid);}
    }else if(id==="claimAw") claimAllReady();
    else if(id==="mod"){
        const used=(acc.runTempMods||[]).map(m=>m.id);
        const add=[];
        for(let i=0;i<2;i++){
            const m=rollTempMod(used);
            if(m){ add.push(m); used.push(m.id); }
        }
        acc.runTempMods=(acc.runTempMods||[]).concat(add);
        persistAccount();
    }
    else if(id==="parts"){
        acc.runTempParts=(acc.runTempParts||[]).concat([
            rollTempPart("Silver"),
            rollTempPart("Gold")
        ].filter(Boolean));
        persistAccount();
    }else if(id==="packB"){
        acc.money=Math.max(acc.money,(cfg().PACKS?.bey_bronze?.price||120));
        persistAccount();
        const out=openPack("bey_bronze");
        if(out.ok){showPackTheater(out);return;}
    }else if(id==="packPrem"){
        acc.money=Math.max(acc.money,(cfg().PACKS?.bey_gold_premium?.price||780));
        persistAccount();
        const out=openPack("bey_gold_premium");
        if(out.ok){showPackTheater(out);return;}
    }else if(id==="packMod"){
        acc.money=Math.max(acc.money,(cfg().PACKS?.mod_pack?.price||340));
        persistAccount();
        const out=openPack("mod_pack");
        if(out.ok){showPackTheater(out);return;}
    }else if(id==="awake"){awakenLiveBey();return;}
    else if(id==="clearaw"){clearLiveAwakening();return;}
    else if(id==="reset"){
        clearLive();
        Game.rogueLiteAccount=normalizeAccount(null);
        persistAccount();
        ensureAccountReady();
        showHub();
        return;
    }else if(id==="n10"||id==="n20"||id==="n29"){
        const n=id==="n10"?10:id==="n20"?20:29;
        if(ensureLiteLiveForJump()) SpinWarsRogue.jumpToMatch(n);
        return;
    }else if(id==="shark"){
        if(ensureLiteLiveForJump()) SpinWarsRogue.jumpToFinalBoss();
        return;
    }else if(id==="win"){
        if(Game.rogue&&Game.rogue.loop==="lite"&&typeof SpinWarsRogue.onMatchOver==="function"){
            SpinWarsRogue.onMatchOver("player",7,0,"dev");
        }
        return;
    }
    if(!opts.live) refreshLiteScreen();
}

global.SpinWarsRogueLite={
    showHub:bootFromHome,
    showMarket,showCollection,showHelp,
    persistLive,hasLive,peekLive,resumeLive,clearLive,
    onNightOver,afterRunHome,archiveAndClear,
    account,ensureAccountReady,openPack,grantBlade,
    awakeningProgress,highestClaimedAwakening,devAct,mountDev,
    rules:rules(),
    FINAL_MATCH:30,
    BOSS_AT:{10:"mini",20:"mini",30:"final"},
    ACCOUNT_KEY,LIVE_KEY
};
})(typeof window!=="undefined"?window:globalThis);
