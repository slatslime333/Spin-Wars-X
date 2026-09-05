/* SPIN WARS X — ROGUE RUN
 * Account hub + Track + Garage. Live nights reuse SpinWarsRogue (loop:"run").
 */
(function(global){
"use strict";

const C=()=>global.SpinWarsRogueRunConfig||{};
const ACCOUNT_KEY="spinWarsX.rogueRun.account.v1";
const LIVE_KEY="spinWarsX.rogueRun.v1";
const RUNS_KEY="spinWarsX.rogueRun.runs.v1";
const COOKIE_KEY="swx_rogue_run";
const STATS=["attack","knockback","defense","mobility","balance","stamina","burst"];
const LABEL={
    attack:"ATK",knockback:"KB",defense:"DEF",
    mobility:"MOB",balance:"BAL",stamina:"STA",burst:"BST"
};
const GROUPS=[
    {id:"HIT",keys:[["ATK","attack"],["KB","knockback"]]},
    {id:"HOLD",keys:[["DEF","defense"],["BAL","balance"],["BST","burst"]]},
    {id:"MOVE",keys:[["MOB","mobility"],["STA","stamina"]]}
];

function cfg(){return C();}
function rules(){return cfg().rules||{finalMatch:30,bossAt:{10:"mini",20:"mini",30:"final"}};}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function round(n){return Math.round(Number(n)||0);}
function pick(list){return list[Math.floor(Math.random()*list.length)];}

function blades(){return typeof BLADE_ENGINE!=="undefined"?BLADE_ENGINE:{};}
function ratchets(){return typeof RATCHETS!=="undefined"?RATCHETS:[];}
function bits(){return typeof BIT_ENGINE!=="undefined"?BIT_ENGINE:{};}
function bladeById(id){
    const eng=blades();
    if(id&&eng[id]) return eng[id];
    return Object.values(eng).find(b=>b&&(b.id===id||b.name===id))||null;
}
function bladeByName(name){
    return Object.values(blades()).find(b=>b&&b.name===name)||null;
}
function ratchetByName(name){
    return ratchets().find(r=>r&&r.name===name)||null;
}
function bitByName(name){
    return Object.values(bits()).find(b=>b&&b.name===name)||null;
}
function playableBlades(){
    return Object.values(blades()).filter(b=>b&&!b.hidden);
}

function emptyOwned(){
    return {blades:{},ratchets:{},bits:{}};
}

function defaultAccount(){
    return {
        v:1,
        level:1,
        exp:0,
        money:0,
        starterId:null,
        loadout:{bladeId:null,ratchet:"5-80",bit:"Needle"},
        owned:emptyOwned(),
        boughtRows:[]
    };
}

function grantStarterKit(acc,starterId){
    const id=starterId||cfg().STARTER_BLADES[0];
    acc.starterId=id;
    acc.loadout.bladeId=id;
    acc.owned=acc.owned||emptyOwned();
    acc.owned.blades[id]=true;
    (cfg().STARTER_RATCHETS||[]).forEach(n=>{acc.owned.ratchets[n]=true;});
    (cfg().STARTER_BITS||[]).forEach(n=>{acc.owned.bits[n]=true;});
    if(!acc.loadout.ratchet) acc.loadout.ratchet="5-80";
    if(!acc.loadout.bit) acc.loadout.bit="Needle";
}

function normalizeAccount(raw){
    const acc=Object.assign(defaultAccount(),raw||{});
    acc.owned=acc.owned||emptyOwned();
    acc.owned.blades=acc.owned.blades||{};
    acc.owned.ratchets=acc.owned.ratchets||{};
    acc.owned.bits=acc.owned.bits||{};
    acc.boughtRows=Array.isArray(acc.boughtRows)?acc.boughtRows:[];
    acc.level=clamp(Number(acc.level)||1,1,cfg().MAX_LEVEL||25);
    acc.exp=Math.max(0,Number(acc.exp)||0);
    acc.money=Math.max(0,Number(acc.money)||0);
    if(acc.starterId) grantStarterKit(acc,acc.starterId);
    return acc;
}

function loadAccount(){
    try{
        const raw=JSON.parse(localStorage.getItem(ACCOUNT_KEY)||"null");
        if(raw&&raw.v===1) return normalizeAccount(raw);
    }catch(_e){}
    return normalizeAccount(null);
}

function saveAccount(acc){
    try{localStorage.setItem(ACCOUNT_KEY,JSON.stringify(acc));}catch(_e){}
    Game.rogueRunAccount=acc;
    return acc;
}

function account(){
    if(!Game.rogueRunAccount) Game.rogueRunAccount=loadAccount();
    return Game.rogueRunAccount;
}

function persistAccount(){saveAccount(account());}

function expToNext(acc){
    const need=typeof cfg().levelNeed==="function"?cfg().levelNeed(acc.level):80;
    return need;
}

function addExp(n){
    const acc=account();
    let left=Math.max(0,round(n));
    while(left>0 && acc.level<(cfg().MAX_LEVEL||25)){
        const need=expToNext(acc);
        if(acc.exp+left>=need){
            left-=(need-acc.exp);
            acc.level+=1;
            acc.exp=0;
        }else{
            acc.exp+=left;
            left=0;
        }
    }
    if(acc.level>=(cfg().MAX_LEVEL||25)) acc.exp=0;
    persistAccount();
    return acc;
}

function addMoney(n){
    const acc=account();
    acc.money=Math.max(0,round((Number(acc.money)||0)+(Number(n)||0)));
    persistAccount();
    return acc;
}

function ownsBlade(id){return !!(account().owned.blades[id]);}
function ownsRatchet(name){return !!(account().owned.ratchets[name]);}
function ownsBit(name){return !!(account().owned.bits[name]);}

function otherStarterId(acc){
    const ids=cfg().STARTER_BLADES||[];
    return ids.find(id=>id!==acc.starterId)||ids[0];
}

function grantPart(part){
    const acc=account();
    if(!part) return;
    if(part.kind==="blade"||part.id){
        const id=part.id||part.bladeId;
        if(id) acc.owned.blades[id]=true;
    }else if(part.kind==="ratchet"||part.name&&String(part.name).includes("-")){
        acc.owned.ratchets[part.name]=true;
    }else if(part.kind==="bit"||part.name){
        acc.owned.bits[part.name]=true;
    }
}

function resolveRowParts(row,acc){
    if(!row) return [];
    if(row.kind==="other-starter"){
        return [{kind:"blade",id:otherStarterId(acc||account())}];
    }
    if(row.kind==="bundle") return (row.parts||[]).slice();
    if(row.kind==="blade") return [{kind:"blade",id:row.id}];
    return [{kind:row.kind,name:row.name}];
}

function rowOwned(row,acc){
    acc=acc||account();
    if((acc.boughtRows||[]).includes(row.n)) return true;
    return resolveRowParts(row,acc).every(p=>{
        if(p.kind==="blade") return ownsBlade(p.id);
        if(p.kind==="ratchet") return ownsRatchet(p.name);
        return ownsBit(p.name);
    });
}

function buyRow(row){
    const acc=account();
    if(!row||rowOwned(row,acc)) return {ok:false,why:"owned"};
    if(acc.level<row.level) return {ok:false,why:"level"};
    if(acc.money<row.price) return {ok:false,why:"money"};
    acc.money-=row.price;
    acc.boughtRows.push(row.n);
    resolveRowParts(row,acc).forEach(grantPart);
    persistAccount();
    return {ok:true};
}

function loadoutParts(){
    const acc=account();
    const blade=bladeById(acc.loadout.bladeId)||bladeById(acc.starterId);
    const ratchet=ratchetByName(acc.loadout.ratchet)||ratchetByName("5-80");
    const bit=bitByName(acc.loadout.bit)||bitByName("Needle");
    return {blade,ratchet,bit};
}

function comboOfLoadout(){
    const p=loadoutParts();
    if(!p.blade||!p.ratchet||!p.bit||typeof calculateComboStats!=="function") return null;
    return calculateComboStats(p.blade,p.ratchet,p.bit);
}

function statBarRow(label,value,delta){
    const max=cfg().STAT_MAX||99;
    const n=Number(value);
    const shown=Number.isFinite(n)?round(n):0;
    const pct=clamp(shown/max*100,0,100);
    const tint=delta>0?" up":delta<0?" down":"";
    const mark=delta?`<i>${delta>0?"+":""}${delta}</i>`:"";
    return `<div class="rr-stat${tint}">
        <span class="rr-stat-lab">${label}</span>
        <span class="rr-stat-num"><b>${Number.isFinite(n)?shown:"—"}</b>${mark}</span>
        <span class="rr-stat-rail" aria-hidden="true">
            <span class="rr-stat-fill" style="width:${pct}%"></span>
        </span>
    </div>`;
}

function statGroupsHTML(stats,delta){
    stats=stats||{};
    delta=delta||{};
    return `<div class="rr-stat-groups" aria-label="Combo stats">
        ${GROUPS.map(g=>`<div class="rr-stat-group">
            <span class="rr-stat-group-label">${g.id}</span>
            <div class="rr-stat-rows ${g.keys.length===2?"pair":""}">
                ${g.keys.map(([lab,key])=>statBarRow(lab,stats[key],Number(delta[key])||0)).join("")}
            </div>
        </div>`).join("")}
    </div>`;
}

function useStatBars(){
    return !!(global.Game&&Game.rogue&&Game.rogue.loop==="run");
}

function persistLive(){
    const R=global.SpinWarsRogue;
    if(!R||typeof R.buildSave!=="function") return false;
    if(!Game.rogue||Game.rogue.loop!=="run") return false;
    const data=R.buildSave();
    if(!data||!data.rogue) return false;
    data.rogue.loop="run";
    data.rogue.runChip=Game.rogue.runChip||{};
    let json="";
    try{json=JSON.stringify(data);}catch(_e){return false;}
    try{localStorage.setItem(LIVE_KEY,json);}catch(_e){}
    try{
        const encoded=encodeURIComponent(json.length>3500?JSON.stringify({v:1,has:1}):json);
        document.cookie=`${COOKIE_KEY}=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
    }catch(_e){}
    return true;
}

function loadLive(){
    try{
        const raw=JSON.parse(localStorage.getItem(LIVE_KEY)||"null");
        if(raw&&raw.v===1&&raw.rogue&&raw.rogue.bladeName) return raw;
    }catch(_e){}
    return null;
}

function peekLive(){
    const data=loadLive();
    if(!data) return null;
    return {
        match:data.rogue.matchIndex,
        blade:data.rogue.bladeName,
        score:data.battle?.score,
        screen:data.screen
    };
}

function clearLive(){
    try{localStorage.removeItem(LIVE_KEY);}catch(_e){}
    try{document.cookie=`${COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;}catch(_e){}
}

function hasLive(){return !!peekLive();}

function loadArchive(){
    try{
        const raw=JSON.parse(localStorage.getItem(RUNS_KEY)||"[]");
        return Array.isArray(raw)?raw.filter(e=>e&&(e.status==="won"||e.status==="lost")):[];
    }catch(_e){return [];}
}

function saveArchive(list){
    try{localStorage.setItem(RUNS_KEY,JSON.stringify((list||[]).slice(0,40)));}catch(_e){}
}

function archiveAndClear(status){
    const r=Game.rogue;
    if(r&&(status==="won"||status==="lost")){
        const stats=typeof global.SpinWarsRogue?.playerEffective==="function"
            ? SpinWarsRogue.playerEffective()
            : {};
        const ovr=round(Object.values(stats).reduce((a,b)=>a+(Number(b)||0),0)/Math.max(1,Object.keys(stats).length));
        const sb=typeof SpinWarsScoreboard!=="undefined"?SpinWarsScoreboard.exportRun():null;
        const entry={
            id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            endedAt:Date.now(),
            status,
            bladeName:r.blade?.name,
            ratchetName:r.ratchet?.name||"",
            bitName:r.bit?.name||"",
            matchIndex:r.matchIndex||1,
            stats,ovr,
            lastScore:r.lastResult||null,
            scoreboard:sb,
            finalScore:typeof SpinWarsScoreboard!=="undefined"?SpinWarsScoreboard.runFinal():0
        };
        const list=loadArchive();
        list.unshift(entry);
        saveArchive(list);
    }
    clearLive();
}

function onNightOver(win,matchIndex,isShark){
    const endless=Number(matchIndex)>(cfg().FINAL_MATCH||30);
    const money=cfg().nightMoney(win,matchIndex,{shark:!!isShark,endless});
    const exp=cfg().nightExp(win,matchIndex,{shark:!!isShark,endless});
    addMoney(money);
    addExp(exp);
    persistLive();
    return {money,exp};
}

function onRunPartSwap(kind,part){
    const r=Game.rogue;
    if(!r||r.loop!=="run") return;
    r.runChip=r.runChip||{};
    let key="balance";
    if(kind==="bit"){
        const t=String(part?.type||"");
        if(t==="Attack") key="attack";
        else if(t==="Defense") key="defense";
        else if(t==="Stamina") key="stamina";
        else key="balance";
    }
    r.runChip[key]=(Number(r.runChip[key])||0)+1;
    if(typeof SpinWarsRogue?.playerEffective==="function"){
        /* chip is read from runChip on the next plate/battle tick */
    }
}

function backHTML(fn){
    const host=document.querySelector(".home, .menu, .rr-shell");
    if(host&&typeof createBackButton==="function") host.appendChild(createBackButton(fn));
}

function mark(kicker,tag){
    return typeof homeMarkHTML==="function"
        ? homeMarkHTML({compact:true,kicker,tag})
        : `<header><p>${kicker}</p><h1>${tag}</h1></header>`;
}

function bowl(){
    return typeof homeBowlHTML==="function"?homeBowlHTML():"";
}

function showFork(){
    Game.mode=null;
    Game.screen="rogueFork";
    document.getElementById("rrDevBtn")?.remove();
    document.getElementById("rrDevPanel")?.remove();
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-landing">
        ${bowl()}
        ${mark("ROGUE","")}
        <nav class="home-doors rogue-doors" aria-label="Rogue modes">
            <button class="home-door rip swx-hero" id="rrForkRun" type="button">
                <span class="home-door-kicker">NIGHT</span>
                <b>ROGUE RUN</b>
                <span class="swx-hero-mark">PRIMARY</span>
            </button>
            <button class="home-door play" id="rrForkTier" type="button">
                <span class="home-door-kicker">CLASSIC</span>
                <b>TIER ROGUE</b>
            </button>
        </nav>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("rrForkRun").onclick=()=>showHub();
    document.getElementById("rrForkTier").onclick=()=>SpinWarsRogue.showLanding();
}

function hudStrip(){
    const acc=account();
    const need=expToNext(acc);
    const pct=need?clamp(acc.exp/need*100,0,100):100;
    return `<section class="rr-hud">
        <div class="rr-hud-lv"><small>LV</small><b>${acc.level}</b></div>
        <div class="rr-hud-exp">
            <span>EXP ${acc.level>=(cfg().MAX_LEVEL||25)?"MAX":`${acc.exp} / ${need}`}</span>
            <span class="rr-stat-rail"><span class="rr-stat-fill" style="width:${pct}%"></span></span>
        </div>
        <div class="rr-hud-money"><small>MONEY</small><b>${acc.money}</b></div>
    </section>`;
}

function loadoutCard(){
    const parts=loadoutParts();
    const combo=comboOfLoadout();
    const sprite=parts.blade&&typeof bladeSpritePath==="function"?bladeSpritePath(parts.blade):"";
    if(!parts.blade){
        return `<section class="menu-card rr-loadout empty"><p>Pick a starter blade to open the locker.</p></section>`;
    }
    return `<section class="menu-card rr-loadout">
        <div class="rr-loadout-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
        <div class="rr-loadout-copy">
            <span class="eyebrow">${String(parts.blade.tier||"").toUpperCase()}</span>
            <b>${parts.blade.name}</b>
            <small>${parts.ratchet.name} · ${parts.bit.name}</small>
            <div class="vs-ratings">
                <div class="vs-rating"><small>OVR</small><b>${combo?.ovr||"—"}</b></div>
                <div class="vs-rating meta"><small>META</small><b>${combo?.meta||"—"}</b></div>
            </div>
            ${statGroupsHTML(combo?.stats||{})}
        </div>
    </section>`;
}

function showHub(){
    Game.mode="rogue-run";
    Game.quickMatch=false;
    Game.screen="rogueRunHub";
    const acc=account();
    const live=peekLive();
    const past=loadArchive();
    const app=document.getElementById("app");
    if(!acc.starterId){
        showStarterPick();
        return;
    }
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rr-shell rr-hub">
        ${bowl()}
        ${mark("ROGUE RUN","")}
        ${hudStrip()}
        ${loadoutCard()}
        <nav class="home-doors rogue-doors rr-doors" aria-label="Rogue Run">
            ${live?`<button class="home-door rip swx-hero" id="rrContinue" type="button">
                <span class="home-door-kicker">SAVE</span>
                <b>CONTINUE</b>
                <small class="swx-state">N${live.match||1} · ${live.blade}${live.score?` · ${live.score.player}-${live.score.cpu}`:""}</small>
            </button>`:`<button class="home-door rip swx-hero" id="rrPlay" type="button">
                <span class="home-door-kicker">NIGHT</span>
                <b>PLAY</b>
            </button>`}
            ${live?`<button class="home-door play" id="rrNew" type="button">
                <span class="home-door-kicker">RESET</span>
                <b>NEW RUN</b>
            </button>`:""}
            <div class="home-door-row">
                <button class="home-door play" id="rrGarage" type="button">
                    <span class="home-door-kicker">KIT</span>
                    <b>GARAGE</b>
                </button>
                <button class="home-door play" id="rrTrack" type="button">
                    <span class="home-door-kicker">UNLOCKS</span>
                    <b>TRACK</b>
                </button>
            </div>
            <button class="home-door rogue" id="rrBoard" type="button">
                <span class="home-door-kicker">HISTORY</span>
                <b>SCOREBOARD</b>
                <small class="swx-state">${past.length?`${past.length} RUN${past.length===1?"":"S"}`:"EMPTY"}</small>
            </button>
            <button class="home-help" id="rrHelp" type="button">HOW</button>
        </nav>
        <div id="rrConfirm" hidden></div>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showFork()));
    document.getElementById("rrPlay")?.addEventListener("click",()=>showPlayConfirm(false));
    document.getElementById("rrContinue")?.addEventListener("click",()=>resumeLive());
    document.getElementById("rrNew")?.addEventListener("click",()=>confirmNewRun());
    document.getElementById("rrGarage")?.addEventListener("click",()=>showGarage());
    document.getElementById("rrTrack")?.addEventListener("click",()=>showTrack());
    document.getElementById("rrBoard")?.addEventListener("click",()=>showBoard());
    document.getElementById("rrHelp")?.addEventListener("click",()=>showHelp());
    mountDev();
}

function showStarterPick(){
    Game.mode="rogue-run";
    Game.screen="rogueRunStarter";
    const ids=cfg().STARTER_BLADES||[];
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="menu rr-shell">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">ROGUE RUN</span>
                <h1>PICK A STARTER</h1>
                <p>Shelter Drake or Knight Shield. You always get 5-80, 4-80, Needle, and Flat.</p>
            </div>
        </div>
        <div class="rr-starter-row">
            ${ids.map(id=>{
                const b=bladeById(id);
                const sprite=b&&typeof bladeSpritePath==="function"?bladeSpritePath(b):"";
                return `<button class="home-door rip rr-starter" type="button" data-starter="${id}">
                    <span class="rr-starter-art">${sprite?`<img src="${sprite}" alt="">`:""}</span>
                    <b>${b?b.name:id}</b>
                    <small>${b?b.type+" · "+b.tier:"Bronze"}</small>
                </button>`;
            }).join("")}
        </div>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showFork()));
    document.querySelectorAll("[data-starter]").forEach(btn=>{
        btn.onclick=()=>{
            const acc=account();
            grantStarterKit(acc,btn.getAttribute("data-starter"));
            persistAccount();
            showHub();
        };
    });
    mountDev();
}

function confirmNewRun(){
    const box=document.getElementById("rrConfirm");
    const live=peekLive();
    if(!box){clearLive();showPlayConfirm(false);return;}
    box.hidden=false;
    box.innerHTML=`<section class="menu-card rogue-intro-card">
        <p class="eyebrow">REPLACE SAVE</p>
        <h2>START A NEW RUN?</h2>
        <p>This wipes Night ${live?.match||1} · ${live?.blade||"the live Bey"}. The locker stays.</p>
        <button class="rip-btn" id="rrNewGo" type="button">START NEW RUN</button>
        <button class="menu-btn silver" id="rrNewNo" type="button">BACK</button>
    </section>`;
    document.getElementById("rrNewGo").onclick=()=>{clearLive();showPlayConfirm(false);};
    document.getElementById("rrNewNo").onclick=()=>{box.hidden=true;box.innerHTML="";};
}

function showPlayConfirm(){
    const acc=account();
    if(!acc.starterId){showStarterPick();return;}
    const parts=loadoutParts();
    if(!parts.blade||!parts.ratchet||!parts.bit){showGarage();return;}
    Game.screen="rogueRunPlay";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="menu rr-shell">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">LET IT RIP</span>
                <h1>THIS BEY GOES IN</h1>
                <p>Optional: randomize ratchet and bit from what you own for +${cfg().RANDOMIZE_BONUS||5} money. No take-backs.</p>
            </div>
        </div>
        ${loadoutCard()}
        <button class="rip-btn" id="rrRip" type="button">PLAY</button>
        <button class="menu-btn silver" id="rrRand" type="button">RANDOMIZE RATCHET · BIT (+${cfg().RANDOMIZE_BONUS||5})</button>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showHub()));
    document.getElementById("rrRip").onclick=()=>beginRun(false);
    document.getElementById("rrRand").onclick=()=>beginRun(true);
    mountDev();
}

function ownedRatchets(){
    return ratchets().filter(r=>ownsRatchet(r.name));
}
function ownedBits(){
    const list=typeof selectableBits==="function"?selectableBits():Object.values(bits());
    return list.filter(b=>ownsBit(b.name));
}
function ownedBlades(){
    const eng=blades();
    return playableBlades().filter(b=>{
        const id=Object.keys(eng).find(k=>eng[k]===b);
        return id&&ownsBlade(id);
    });
}

function beginRun(randomize){
    const acc=account();
    if(randomize){
        const rats=ownedRatchets();
        const bits=ownedBits();
        if(rats.length) acc.loadout.ratchet=pick(rats).name;
        if(bits.length) acc.loadout.bit=pick(bits).name;
        addMoney(cfg().RANDOMIZE_BONUS||5);
        persistAccount();
    }
    const parts=loadoutParts();
    if(!parts.blade||!global.SpinWarsRogue?.beginFromLoadout){
        showHub();
        return;
    }
    SpinWarsRogue.beginFromLoadout(parts.blade,parts.ratchet,parts.bit,{loop:"run"});
}

function resumeLive(){
    const data=loadLive();
    const R=global.SpinWarsRogue;
    if(!data||!R||typeof R.hydrateAndResume!=="function"){
        showHub();
        return false;
    }
    data.rogue.loop="run";
    return R.hydrateAndResume(data);
}

function showGarage(){
    Game.mode="rogue-run";
    Game.screen="rogueRunGarage";
    const live=hasLive();
    const acc=account();
    const blades=ownedBlades();
    const rats=ownedRatchets();
    const bits=ownedBits();
    const app=document.getElementById("app");
    const chip=(kind,name,on)=>{
        return `<button type="button" class="rr-part ${on?"on":""}" data-kind="${kind}" data-name="${name}">${name}</button>`;
    };
    app.innerHTML=`<div class="background stadium"></div>
    <main class="menu rr-shell rr-garage">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">GARAGE</span>
                <h1>EQUIP A KIT</h1>
                <p>${live?"A night is live. This loadout is for the next run — the current night keeps its Bey.":"Tap a part you own. The hub Bey is what PLAY uses."}</p>
            </div>
        </div>
        ${hudStrip()}
        ${loadoutCard()}
        <p class="home-leagues-label">BLADES</p>
        <div class="rr-part-row">${blades.map(b=>{
            const id=Object.keys(BLADE_ENGINE).find(k=>BLADE_ENGINE[k]===b);
            return chip("blade",id,acc.loadout.bladeId===id);
        }).join("")||"<p class='rr-empty'>No blades yet.</p>"}</div>
        <p class="home-leagues-label">RATCHETS</p>
        <div class="rr-part-row">${rats.map(r=>chip("ratchet",r.name,acc.loadout.ratchet===r.name)).join("")}</div>
        <p class="home-leagues-label">BITS</p>
        <div class="rr-part-row">${bits.map(b=>chip("bit",b.name,acc.loadout.bit===b.name)).join("")}</div>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showHub()));
    document.querySelectorAll(".rr-part").forEach(btn=>{
        btn.onclick=()=>{
            const kind=btn.getAttribute("data-kind");
            const name=btn.getAttribute("data-name");
            const a=account();
            if(kind==="blade") a.loadout.bladeId=name;
            if(kind==="ratchet") a.loadout.ratchet=name;
            if(kind==="bit") a.loadout.bit=name;
            persistAccount();
            showGarage();
        };
    });
    document.querySelectorAll(".rr-part").forEach(btn=>{
        if(btn.getAttribute("data-kind")==="blade"){
            const b=bladeById(btn.getAttribute("data-name"));
            if(b) btn.textContent=b.name;
        }
    });
    mountDev();
}

function partLabel(part){
    if(!part) return "?";
    if(part.kind==="blade") return (bladeById(part.id)||{}).name||part.id;
    return part.name||"?";
}

function showTrack(focusN){
    Game.mode="rogue-run";
    Game.screen="rogueRunTrack";
    const acc=account();
    const rows=cfg().TRACK||[];
    const focus=rows.find(r=>r.n===Number(focusN))||rows.find(r=>!rowOwned(r,acc)&&acc.level>=r.level)||rows[0];
    const parts=resolveRowParts(focus,acc);
    const previewBlade=parts.find(p=>p.kind==="blade");
    const preview=previewBlade?bladeById(previewBlade.id):loadoutParts().blade;
    const combo=preview&&loadoutParts().ratchet&&loadoutParts().bit&&typeof calculateComboStats==="function"
        ? calculateComboStats(preview,loadoutParts().ratchet,loadoutParts().bit)
        : comboOfLoadout();
    const sprite=preview&&typeof bladeSpritePath==="function"?bladeSpritePath(preview):"";
    const canBuy=!rowOwned(focus,acc)&&acc.level>=focus.level&&acc.money>=focus.price;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="menu rr-shell rr-track">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">TRACK</span>
                <h1>UNLOCK ORDER</h1>
                <p>Scroll the pass. Level gates the row. Money buys it. Shark Scale is not for sale.</p>
            </div>
        </div>
        ${hudStrip()}
        <section class="menu-card rr-track-inspect">
            <div class="rr-loadout-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div>
                <span class="eyebrow">${rowOwned(focus,acc)?"OWNED":acc.level>=focus.level?"FOR SALE":"LOCKED"}</span>
                <b>${parts.map(partLabel).join(" · ")}</b>
                <small>Row ${focus.n} · LV ${focus.level} · ${focus.price} money</small>
                ${statGroupsHTML(combo?.stats||{})}
                <button class="rip-btn" id="rrBuy" type="button" ${canBuy?"":"disabled"}>${rowOwned(focus,acc)?"OWNED":acc.level<focus.level?`NEED LV ${focus.level}`:acc.money<focus.price?"NEED MONEY":"BUY"}</button>
            </div>
        </section>
        <div class="rr-track-list" id="rrTrackList">
            ${rows.map(row=>{
                const owned=rowOwned(row,acc);
                const locked=acc.level<row.level;
                const names=resolveRowParts(row,acc).map(partLabel).join(" · ");
                return `<button type="button" class="rr-track-row ${owned?"owned":""} ${locked?"locked":""} ${row.n===focus.n?"on":""}" data-row="${row.n}">
                    <span class="rr-track-n">${row.n}</span>
                    <span class="rr-track-copy"><b>${names}</b><small>${owned?"OWNED":`LV ${row.level} · ${row.price}`}</small></span>
                </button>`;
            }).join("")}
        </div>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showHub()));
    document.querySelectorAll("[data-row]").forEach(btn=>{
        btn.onclick=()=>showTrack(btn.getAttribute("data-row"));
    });
    document.getElementById("rrBuy")?.addEventListener("click",()=>{
        const out=buyRow(focus);
        if(out.ok) showTrack(focus.n);
    });
    const on=document.querySelector(".rr-track-row.on");
    if(on) on.scrollIntoView({block:"center"});
    mountDev();
}

function showBoard(){
    Game.mode="rogue-run";
    Game.screen="rogueRunBoard";
    const past=loadArchive();
    const body=past.length
        ? past.map(e=>`<button type="button" class="rogue-run-row ${e.status}" data-run-id="${e.id}">
            <span class="rogue-run-row-kicker">${e.status==="won"?"WON":"LOST"} · Night ${e.matchIndex||1}</span>
            <b>${e.bladeName||"Bey"} · ${e.ratchetName||"?"} · ${e.bitName||"?"}</b>
            <small>OVR ${e.ovr||"—"} · ${Number(e.finalScore)||0} pts</small>
        </button>`).join("")
        : `<p class="rogue-run-empty">No finished runs yet. Win or lose a Rogue Run and it shows here.</p>`;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home rogue-landing rogue-run-board">
        ${bowl()}
        ${mark("ROGUE RUN","RUN SCOREBOARD")}
        <section class="rogue-run-history">${body}</section>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>showHub()));
    document.querySelectorAll("[data-run-id]").forEach(btn=>{
        btn.onclick=()=>{
            const entry=loadArchive().find(e=>String(e.id)===btn.getAttribute("data-run-id"));
            if(!entry||typeof SpinWarsScoreboard==="undefined") return;
            Game._viewingArchive=true;
            SpinWarsScoreboard.showRunSummary({
                run:entry.scoreboard||{},
                bladeName:entry.bladeName,
                status:entry.status,
                onHome:()=>{Game._viewingArchive=false;showBoard();}
            });
        };
    });
    mountDev();
}

function showHelp(){
    Game.mode="rogue-run";
    Game.screen="rogueRunHelp";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu rogue-help">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">ROGUE RUN</span>
                <h1>HOW THIS LOCKER WORKS</h1>
                <p>Same stadium as Tier Rogue. Longer night. Your collection is the paycheck.</p>
            </div>
        </div>
        <section class="menu-card rogue-help-card">
            <p><strong>EXP</strong> only levels the account. <strong>Money</strong> only buys Track rows. They never swap jobs.</p>
            <p>Garage equips what you own. Track is the full unlock order — locked rows still show name, level, and price. PLAY snapshots the hub Bey. A night is first to 7, shop cards after a win, same as Tier Rogue.</p>
            <p>Minis at 10 and 20. Shark Scale at 30. Then endless. Mid-run reforges stay on that night only and add a small +1 chip. They do not rewrite the Garage.</p>
            <p>Nights 26–29 can roll any face. The fight power is the night, not the sticker tier. PC: Space dashes, M pops the kit. Those hints only print on a pointer desktop.</p>
        </section>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showHub()));
    mountDev();
}

function mountDev(){
    document.getElementById("rrDevBtn")?.remove();
    const btn=document.createElement("button");
    btn.id="rrDevBtn";
    btn.type="button";
    btn.className="rogue-dev-btn";
    btn.textContent="DEV";
    btn.onclick=()=>toggleDev();
    document.body.appendChild(btn);
}

function toggleDev(){
    const existing=document.getElementById("rrDevPanel");
    if(existing){
        existing.remove();
        document.body.classList.remove("rogue-dev-open");
        return;
    }
    const acc=account();
    const panel=document.createElement("aside");
    panel.id="rrDevPanel";
    panel.className="rogue-dev-panel";
    panel.innerHTML=`<header><b>ROGUE RUN DEV</b><button type="button" id="rrDevClose">✕</button></header>
        <p class="rogue-dev-copy">Account cheats write the real locker save. Run skips reuse the live night engine.</p>
        <p class="rogue-dev-stats">LV ${acc.level} · EXP ${acc.exp} · $${acc.money}</p>
        <div class="rogue-dev-actions">
            <button type="button" class="menu-btn silver" data-rr="exp100">+100 EXP</button>
            <button type="button" class="menu-btn silver" data-rr="exp500">+500 EXP</button>
            <button type="button" class="menu-btn gold" data-rr="maxlv">MAX LEVEL</button>
            <button type="button" class="menu-btn silver" data-rr="mon100">+100 MONEY</button>
            <button type="button" class="menu-btn silver" data-rr="mon500">+500 MONEY</button>
            <button type="button" class="menu-btn gold" data-rr="maxmon">MAX MONEY</button>
            <button type="button" class="menu-btn silver" data-rr="next">UNLOCK NEXT</button>
            <button type="button" class="menu-btn gold" data-rr="all">UNLOCK ALL</button>
            <button type="button" class="menu-btn silver" data-rr="n29">SKIP TO 29</button>
            <button type="button" class="menu-btn gold" data-rr="shark">FINAL BOSS</button>
            <button type="button" class="menu-btn gold" data-rr="win">WIN NIGHT</button>
            <button type="button" class="menu-btn silver" data-rr="reset">RESET ACCOUNT</button>
        </div>`;
    document.body.appendChild(panel);
    document.body.classList.add("rogue-dev-open");
    const close=()=>{panel.remove();document.body.classList.remove("rogue-dev-open");};
    document.getElementById("rrDevClose").onclick=close;
    panel.querySelectorAll("[data-rr]").forEach(btn=>{
        btn.onclick=()=>{devAct(btn.getAttribute("data-rr"));close();};
    });
}

function unlockAll(){
    const acc=account();
    if(!acc.starterId) grantStarterKit(acc,cfg().STARTER_BLADES[0]);
    (cfg().TRACK||[]).forEach(row=>{
        if(!rowOwned(row,acc)){
            acc.boughtRows.push(row.n);
            resolveRowParts(row,acc).forEach(grantPart);
        }
    });
    persistAccount();
}

function unlockNext(){
    const acc=account();
    const row=(cfg().TRACK||[]).find(r=>!rowOwned(r,acc));
    if(!row) return;
    acc.level=Math.max(acc.level,row.level);
    acc.boughtRows.push(row.n);
    resolveRowParts(row,acc).forEach(grantPart);
    persistAccount();
}

function ensureLiveForJump(){
    if(Game.rogue&&Game.rogue.loop==="run") return true;
    const parts=loadoutParts();
    if(!parts.blade||!global.SpinWarsRogue?.beginFromLoadout) return false;
    SpinWarsRogue.beginFromLoadout(parts.blade,parts.ratchet,parts.bit,{loop:"run"});
    return true;
}

function devAct(id){
    const acc=account();
    if(id==="exp100") addExp(100);
    else if(id==="exp500") addExp(500);
    else if(id==="maxlv"){
        acc.level=cfg().MAX_LEVEL||25;
        acc.exp=0;
        persistAccount();
    }else if(id==="mon100") addMoney(100);
    else if(id==="mon500") addMoney(500);
    else if(id==="maxmon"){acc.money=9999;persistAccount();}
    else if(id==="next") unlockNext();
    else if(id==="all") unlockAll();
    else if(id==="reset"){
        clearLive();
        Game.rogueRunAccount=normalizeAccount(null);
        persistAccount();
        showStarterPick();
        return;
    }else if(id==="n29"){
        if(ensureLiveForJump()) SpinWarsRogue.jumpToMatch(29);
        return;
    }else if(id==="shark"){
        if(ensureLiveForJump()) SpinWarsRogue.jumpToFinalBoss();
        return;
    }else if(id==="win"){
        if(Game.rogue&&Game.rogue.loop==="run"&&typeof SpinWarsRogue.onMatchOver==="function"){
            SpinWarsRogue.onMatchOver("player",7,0,"dev");
        }
        return;
    }
    if(Game.screen==="rogueRunHub") showHub();
    else if(Game.screen==="rogueRunGarage") showGarage();
    else if(Game.screen==="rogueRunTrack") showTrack();
    else if(Game.screen==="rogueRunStarter") showStarterPick();
    else showHub();
}

function afterRunHome(status){
    archiveAndClear(status);
    Game.rogue=null;
    showHub();
}

global.SpinWarsRogueRun={
    showFork,showHub,showGarage,showTrack,showHelp,showBoard,
    persistLive,hasLive,peekLive,resumeLive,clearLive,
    onNightOver,onRunPartSwap,archiveAndClear,afterRunHome,
    statGroupsHTML,useStatBars,account,loadoutParts,
    rules:rules(),
    FINAL_MATCH:30,
    BOSS_AT:{10:"mini",20:"mini",30:"final"}
};
})(typeof window!=="undefined"?window:globalThis);
