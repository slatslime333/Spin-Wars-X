/* SPIN WARS X — SANDBOX LAB
 * Garage + live bowl. No first-to-7. Finishes call out, then you rip again.
 */
(function(global){
"use strict";

const ANGLES=["Flat","Slight Tilt","Hard Tilt"];
const TECHNIQUES=["Center","X-Rail","Direct Clash","Drop Launch"];
const QUALITIES=["Horrible","Bad","Okay","Good","Perfect"];
const VS_MODES=[
    {id:"pve",label:"PLAYER VS CPU",short:"P v CPU"},
    {id:"pvp",label:"PLAYER VS PLAYER",short:"P v P"},
    {id:"cvc",label:"CPU VS CPU",short:"CPU v CPU"}
];

function clampVs(id,beys){
    const v=String(id||"pve");
    if(beys===1 && v==="pvp") return "pve";
    if(v==="pvp"||v==="cvc"||v==="pve") return v;
    return "pve";
}
function defaultLaunch(){
    return {angle:"Flat",technique:"Center",quality:"Okay",autoQuality:false};
}
function emptySide(){
    return {blade:null,ratchet:null,bit:null,launch:defaultLaunch()};
}
function ensure(){
    if(!Game.sandbox){
        Game.sandbox={
            beys:2,
            vs:"pve",
            infiniteCharges:true,
            autoRelaunch:true,
            player:emptySide(),
            cpu:emptySide()
        };
    }
    const s=Game.sandbox;
    s.beys=s.beys===1?1:2;
    s.vs=clampVs(s.vs,s.beys);
    s.player=s.player||emptySide();
    s.cpu=s.cpu||emptySide();
    s.player.launch=s.player.launch||defaultLaunch();
    s.cpu.launch=s.cpu.launch||defaultLaunch();
    if(s.infiniteCharges==null) s.infiniteCharges=true;
    if(s.autoRelaunch==null) s.autoRelaunch=true;
    return s;
}
function isActive(){return Game.mode==="sandbox";}
function isSolo(){return isActive() && ensure().beys===1;}
function vsMode(){return isActive()?ensure().vs:"pve";}
function sideIsHuman(side){
    if(!isActive()) return side==="player";
    const vs=ensure().vs;
    if(isSolo()) return vs!=="cvc";
    if(vs==="pvp") return true;
    if(vs==="cvc") return false;
    return side==="player";
}
function sideIsCpu(side){return !sideIsHuman(side);}
function labels(){
    if(!isActive()) return {player:"YOU",cpu:"CPU"};
    const s=ensure();
    if(s.beys===1){
        return s.vs==="cvc"
            ? {player:"CPU",cpu:"GHOST"}
            : {player:"YOU",cpu:"GHOST"};
    }
    if(s.vs==="pvp") return {player:"P1",cpu:"P2"};
    if(s.vs==="cvc") return {player:"CPU A",cpu:"CPU B"};
    return {player:"YOU",cpu:"CPU"};
}
function who(side){return labels()[side==="cpu"?"cpu":"player"];}

function pick(list){return list[Math.floor(Math.random()*list.length)];}
function fillRandom(side,avoid){
    const s=ensure()[side];
    const blades=typeof playableBlades==="function"?playableBlades():[];
    const rats=typeof RATCHETS!=="undefined"?RATCHETS:[];
    const bits=typeof selectableBits==="function"?selectableBits():[];
    s.blade=pick(blades.filter(b=>b && b.name!==avoid?.blade?.name))||pick(blades)||s.blade;
    s.ratchet=pick(rats.filter(r=>r && r.name!==avoid?.ratchet?.name))||pick(rats)||s.ratchet;
    s.bit=pick(bits.filter(b=>b && b.name!==avoid?.bit?.name))||pick(bits)||s.bit;
}
function fillIfEmpty(){
    const s=ensure();
    if(!s.player.blade||!s.player.ratchet||!s.player.bit) fillRandom("player",s.cpu);
    if(!s.cpu.blade||!s.cpu.ratchet||!s.cpu.bit) fillRandom("cpu",s.player);
}
function syncToGame(){
    const s=ensure();
    fillIfEmpty();
    Game.mode="sandbox";
    Game.quickMatch=false;
    Game.player=Game.player||{};
    Game.cpu=Game.cpu||{};
    const apply=(from,to)=>{
        to.blade=from.blade;
        to.ratchet=from.ratchet;
        to.bit=from.bit;
        to.spin=from.blade?.spin||"Right";
        const q=from.launch.autoQuality?null:from.launch.quality;
        to.launch={
            angle:from.launch.angle||"Flat",
            technique:from.launch.technique||"Center",
            quality:q,
            autoQuality:!!from.launch.autoQuality
        };
    };
    apply(s.player,Game.player);
    apply(s.cpu,Game.cpu);
    if(typeof syncComboStats==="function"){
        syncComboStats("player");
        syncComboStats("cpu");
    }
    if(sideIsCpu("player") && typeof getAutomaticLaunchPlan==="function"){
        const plan=getAutomaticLaunchPlan("player");
        Game.player.launch.technique=plan.technique;
        Game.player.launch.angle=plan.angle;
        if(s.player.launch.autoQuality || !s.player.launch.quality) Game.player.launch.quality=plan.quality;
    }
    if(sideIsCpu("cpu") && typeof getAutomaticLaunchPlan==="function"){
        Game.cpu.lockedLaunchPlan=null;
        const plan=getAutomaticLaunchPlan("cpu");
        Game.cpu.launch.technique=plan.technique;
        Game.cpu.launch.angle=plan.angle;
        if(s.cpu.launch.autoQuality || !s.cpu.launch.quality) Game.cpu.launch.quality=plan.quality;
        Game.cpu.lockedLaunchPlan={technique:plan.technique,angle:plan.angle,quality:Game.cpu.launch.quality};
    }else{
        Game.cpu.lockedLaunchPlan={
            technique:Game.cpu.launch.technique||"Center",
            angle:Game.cpu.launch.angle||"Flat",
            quality:Game.cpu.launch.quality||"Okay"
        };
    }
}

function comboOf(side){
    const pack=ensure()[side];
    if(!pack?.blade||!pack?.ratchet||!pack?.bit) return null;
    const raw=typeof calculateComboStats==="function"?calculateComboStats(pack.blade,pack.ratchet,pack.bit):null;
    return raw||{stats:{},ovr:60,meta:60};
}

function showLanding(){
    Game.mode="sandbox";
    Game.screen="sandboxLanding";
    ensure();
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home sandbox-landing">
        ${typeof homeBowlHTML==="function"?homeBowlHTML():""}
        ${typeof homeMarkHTML==="function"?homeMarkHTML({compact:true,kicker:"SANDBOX LAB",tag:"Build anything. Rip it. Finishes do not end the night."}):""}
        <nav class="home-doors rogue-doors" aria-label="Sandbox">
            <button class="home-door rip" id="sandboxOpenLab" type="button">
                <span class="home-door-kicker">GARAGE</span>
                <b>OPEN LAB</b>
                <small>1 Bey or 2. PvE, PvP, or CPU vs CPU.</small>
            </button>
            <button class="home-help" id="sandboxHelp" type="button">How the lab works</button>
        </nav>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.getElementById("sandboxOpenLab").onclick=()=>showLab();
    document.getElementById("sandboxHelp").onclick=()=>showHelp();
}

function showHelp(){
    Game.mode="sandbox";
    Game.screen="sandboxHelp";
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu rogue-help">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">SANDBOX</span>
                <h1>HOW THE LAB WORKS</h1>
                <p>Same stadium. No first to 7. Leave when you are done.</p>
            </div>
        </div>
        <section class="menu-card rogue-help-card">
            <p>Open Lab is the garage. Pick 1 Bey to watch a single kit spin, or 2 Beys to clash. Then pick who is driving: Player vs CPU, Player vs Player, or CPU vs CPU.</p>
            <p>Each side has its own blade, ratchet, and bit from the full garage. CHANGE opens a picker — filter by tier, tap a part, you are back on the lab. RANDOM rolls that side. SWAP SIDES flips the kits.</p>
            <p>Launches are set on the lab, not behind a quality ROLL. Technique, angle, and quality (or AUTO quality) for every human side. CPU sides pick like the live CPU brain. LET IT RIP dumps you in the bowl.</p>
            <p>A Spin, Over, or Xtreme prints who scored and how many points. The scoreboard counts for the session. It never ends the match. AUTO RELAUNCH rips the same kits again. LEAVE is the only exit.</p>
            <p>Player vs Player: P1 uses DASH / kit on the left (Space / E). P2 uses the right dock (Enter / Shift). CPU vs CPU is a watch mode — no combat buttons. Tap YOU or CPU in any live fight, including this lab, for a paused stat sheet.</p>
            <p>Infinite charges stay on unless you flip them off. Ability kits refill every relaunch either way.</p>
        </section>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showLanding()));
}

function launchSelect(side,key,options,value,autoKey){
    const s=ensure()[side].launch;
    const opts=options.map(v=>`<option value="${v}" ${s[key]===v?"selected":""}>${v}</option>`).join("");
    const extra=autoKey
        ? `<option value="AUTO" ${s[autoKey]?"selected":""}>AUTO</option>`
        : "";
    return `<label class="sandbox-field"><span>${key.toUpperCase()}</span>
        <select data-side="${side}" data-launch="${key}" data-auto="${autoKey||""}">${extra}${opts}</select>
    </label>`;
}

function garageColumn(side){
    const s=ensure();
    const pack=s[side];
    const combo=comboOf(side);
    const name=pack.blade?.name||"No blade";
    const parts=pack.ratchet&&pack.bit?`${pack.ratchet.name} · ${pack.bit.name}`:"Pick parts";
    const ovr=combo?Math.round(combo.ovr):"—";
    const sprite=typeof bladeSpritePath==="function"?bladeSpritePath(pack.blade):"";
    const hidden=s.beys===1 && side==="cpu";
    const driver=sideIsHuman(side)?"HUMAN":"CPU";
    const tag=who(side);
    return `<section class="sandbox-col ${side}${hidden?" is-ghost":""}" data-side="${side}">
        <header class="sandbox-col-head">
            <span class="sandbox-who">${tag}</span>
            <small>${driver}</small>
        </header>
        <div class="sandbox-kit">
            <div class="sandbox-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div class="sandbox-kit-copy">
                <h2>${name}</h2>
                <p>${parts}</p>
                <div class="vs-rating"><small>OVR</small><b>${ovr}</b></div>
            </div>
        </div>
        <div class="sandbox-part-btns">
            <button type="button" class="menu-btn gold" data-pick="${side}" data-part="blade">BLADE</button>
            <button type="button" class="menu-btn silver" data-pick="${side}" data-part="ratchet">RATCHET</button>
            <button type="button" class="menu-btn silver" data-pick="${side}" data-part="bit">BIT</button>
        </div>
        <div class="sandbox-launch">
            ${launchSelect(side,"technique",TECHNIQUES,pack.launch.technique)}
            ${launchSelect(side,"angle",ANGLES,pack.launch.angle)}
            ${launchSelect(side,"quality",QUALITIES,pack.launch.quality,"autoQuality")}
        </div>
        <div class="sandbox-part-btns">
            <button type="button" class="menu-btn silver" data-rand="${side}">RANDOM</button>
        </div>
    </section>`;
}

function showLab(){
    Game.mode="sandbox";
    Game.screen="sandboxLab";
    const s=ensure();
    fillIfEmpty();
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="sandbox-lab">
        ${typeof homeMarkHTML==="function"?homeMarkHTML({compact:true,kicker:"SANDBOX LAB",tag:"Kits, launches, then the bowl."}):""}
        <section class="sandbox-toolbar">
            <div class="sandbox-seg" role="group" aria-label="Bey count">
                <button type="button" class="sandbox-chip ${s.beys===1?"on":""}" data-beys="1">1 BEY</button>
                <button type="button" class="sandbox-chip ${s.beys===2?"on":""}" data-beys="2">2 BEYS</button>
            </div>
            <label class="sandbox-field sandbox-vs-field"><span>CONTROL</span>
                <select id="sandboxVs">
                    ${VS_MODES.map(m=>`<option value="${m.id}" ${s.vs===m.id?"selected":""} ${s.beys===1&&m.id==="pvp"?"disabled":""}>${m.label}</option>`).join("")}
                </select>
            </label>
        </section>
        <section class="sandbox-toggles">
            <label class="sandbox-check"><input type="checkbox" id="sandboxInfinite" ${s.infiniteCharges?"checked":""}> Infinite charges</label>
            <label class="sandbox-check"><input type="checkbox" id="sandboxAutoRip" ${s.autoRelaunch?"checked":""}> Auto relaunch</label>
        </section>
        <section class="sandbox-garages">
            ${garageColumn("player")}
            ${s.beys===2?`<div class="vs-stamp" aria-hidden="true">VS</div>`:""}
            ${garageColumn("cpu")}
        </section>
        <div class="sandbox-actions">
            <button type="button" class="menu-btn silver" id="sandboxSwap">SWAP SIDES</button>
            <button type="button" class="menu-btn silver" id="sandboxRandAll">RANDOM BOTH</button>
            <button type="button" class="rip-btn" id="sandboxRip">LET IT RIP</button>
        </div>
    </main>`;
    document.querySelector(".sandbox-lab")?.appendChild(createBackButton(()=>showLanding()));
    bindLab();
}

function bindLab(){
    const s=ensure();
    document.querySelectorAll("[data-beys]").forEach(btn=>{
        btn.onclick=()=>{
            s.beys=Number(btn.dataset.beys)===1?1:2;
            s.vs=clampVs(s.vs,s.beys);
            showLab();
        };
    });
    document.getElementById("sandboxVs")?.addEventListener("change",e=>{
        s.vs=clampVs(e.target.value,s.beys);
        showLab();
    });
    document.getElementById("sandboxInfinite")?.addEventListener("change",e=>{
        s.infiniteCharges=!!e.target.checked;
    });
    document.getElementById("sandboxAutoRip")?.addEventListener("change",e=>{
        s.autoRelaunch=!!e.target.checked;
    });
    document.querySelectorAll("[data-pick]").forEach(btn=>{
        btn.onclick=()=>openPicker(btn.dataset.pick,btn.dataset.part);
    });
    document.querySelectorAll("[data-rand]").forEach(btn=>{
        btn.onclick=()=>{
            const side=btn.dataset.rand;
            fillRandom(side,ensure()[side==="player"?"cpu":"player"]);
            showLab();
        };
    });
    document.querySelectorAll("select[data-launch]").forEach(sel=>{
        sel.onchange=()=>{
            const side=sel.dataset.side;
            const key=sel.dataset.launch;
            const launch=ensure()[side].launch;
            if(sel.dataset.auto && sel.value==="AUTO"){
                launch[sel.dataset.auto]=true;
                return;
            }
            if(sel.dataset.auto) launch[sel.dataset.auto]=false;
            launch[key]=sel.value;
        };
    });
    document.getElementById("sandboxSwap")?.addEventListener("click",()=>{
        const a=s.player, b=s.cpu;
        s.player=b; s.cpu=a;
        showLab();
    });
    document.getElementById("sandboxRandAll")?.addEventListener("click",()=>{
        fillRandom("player");
        fillRandom("cpu",s.player);
        showLab();
    });
    document.getElementById("sandboxRip")?.addEventListener("click",()=>rip());
}

function pickerPool(part,tier){
    if(part==="blade"){
        const all=typeof playableBlades==="function"?playableBlades():[];
        if(!tier||tier==="all") return all;
        return all.filter(b=>String(b.tier).toLowerCase()===tier);
    }
    if(part==="ratchet") return typeof RATCHETS!=="undefined"?RATCHETS:[];
    return typeof selectableBits==="function"?selectableBits():[];
}

function openPicker(side,part){
    const s=ensure();
    const overlay=document.createElement("div");
    overlay.className="sandbox-picker";
    overlay.id="sandboxPicker";
    const title=part.toUpperCase();
    const tierFilter=part==="blade"
        ? `<label class="sandbox-field"><span>TIER</span>
            <select id="sandboxPickerTier">
                <option value="all">ALL</option>
                <option value="bronze">BRONZE</option>
                <option value="silver">SILVER</option>
                <option value="gold">GOLD</option>
            </select>
           </label>`
        : "";
    overlay.innerHTML=`<div class="sandbox-picker-sheet">
        <header>
            <b>PICK ${title} · ${who(side)}</b>
            <button type="button" class="menu-btn silver" id="sandboxPickerClose">BACK</button>
        </header>
        ${tierFilter}
        <div class="sandbox-picker-grid" id="sandboxPickerGrid"></div>
    </div>`;
    document.body.appendChild(overlay);
    const render=()=>{
        const tier=document.getElementById("sandboxPickerTier")?.value||"all";
        const grid=document.getElementById("sandboxPickerGrid");
        const pool=pickerPool(part,tier);
        grid.innerHTML=pool.map((item,i)=>{
            const sprite=part==="blade"?(typeof bladeSpritePath==="function"?bladeSpritePath(item):"")
                :part==="bit"?(typeof bitSpritePath==="function"?bitSpritePath(item):"")
                :(typeof ratchetSpritePath==="function"?ratchetSpritePath(item):"");
            const sub=part==="blade"?`${item.type} · ${item.tier}`:part==="bit"?item.type:`${item.number}-SIDED · ${item.height}`;
            return `<button type="button" class="sandbox-pick-card" data-idx="${i}">
                ${sprite?`<img src="${sprite}" alt="">`:""}
                <strong>${item.name}</strong>
                <small>${sub}</small>
            </button>`;
        }).join("")||`<p class="sandbox-empty">Nothing in this filter.</p>`;
        grid.querySelectorAll("[data-idx]").forEach(btn=>{
            btn.onclick=()=>{
                const item=pool[Number(btn.dataset.idx)];
                if(!item) return;
                s[side][part]=item;
                overlay.remove();
                showLab();
            };
        });
    };
    document.getElementById("sandboxPickerClose").onclick=()=>overlay.remove();
    overlay.addEventListener("click",e=>{if(e.target===overlay) overlay.remove();});
    document.getElementById("sandboxPickerTier")?.addEventListener("change",render);
    render();
}

function rip(){
    const s=ensure();
    fillIfEmpty();
    syncToGame();
    Game.battle={score:{player:0,cpu:0},round:1,matchStarted:false};
    Game.player.launch.setupStage="launch";
    if(typeof SpinWarsAbilities!=="undefined") SpinWarsAbilities.resetMatch();
    if(typeof startNewBattle==="function") startNewBattle();
}

function decorateBattle(){
    if(!isActive()) return;
    const lab=labels();
    const pWho=document.querySelector(".battle-hud-player .battle-hud-top span");
    const cWho=document.querySelector(".battle-hud-cpu .battle-hud-top span");
    if(pWho) pWho.textContent=lab.player;
    if(cWho) cWho.textContent=lab.cpu;
    const ft=document.querySelector(".battle-score-ft");
    if(ft) ft.textContent=isSolo()?"SOLO · SANDBOX":`${VS_MODES.find(m=>m.id===ensure().vs)?.short||"LAB"} · SANDBOX`;
    const leave=document.getElementById("forfeitMatchBtn");
    if(leave) leave.textContent="LEAVE";
    if(isSolo()){
        document.querySelector(".battle-hud-cpu")?.classList.add("is-ghost");
        document.getElementById("newCpuBey")?.setAttribute("opacity","0");
        document.getElementById("newCpuBeySprite")?.style && (document.getElementById("newCpuBeySprite").style.display="none");
    }
}

function prepareGhost(c){
    if(!isSolo()||!c) return;
    c.sandboxGhost=true;
    c.x=0;
    c.y=3.4;
    c.vx=0;
    c.vy=0;
    c.rpm=1;
    c.railEngaged=false;
    c.launchComplete=true;
}

function skipGhostPhysics(s){return !!(s&&s.sandboxGhost);}

function finishCopy(winnerSide,finishType,points){
    const lab=labels();
    const scorer=lab[winnerSide==="cpu"?"cpu":"player"];
    const type=String(finishType||"Spin Finish").toUpperCase();
    const n=Number(points)||(finishType==="Xtreme"?3:finishType==="Over"?2:1);
    if(isSolo()){
        const fallen=winnerSide==="player"?lab.cpu:lab.player;
        if(lab.cpu==="GHOST" && winnerSide==="cpu"){
            return `SELF KO · ${type} · ${lab.player}`;
        }
        return `${fallen} DOWN · ${type}`;
    }
    return `${scorer} SCORES · ${type} +${n}`;
}

function afterFinish(winnerSide,finishType,points){
    const s=ensure();
    const line=finishCopy(winnerSide,finishType,points);
    const stadium=document.getElementById("newStadium");
    if(stadium){
        const note=document.createElement("div");
        note.className="sandbox-score-note";
        note.textContent=line;
        stadium.appendChild(note);
    }
    const ft=document.querySelector(".battle-score-ft");
    if(ft) ft.textContent=line;
    return s.autoRelaunch;
}

function relaunch(){
    const s=ensure();
    syncToGame();
    Game.battle=Game.battle||{score:{player:0,cpu:0},round:1};
    Game.battle.round=(Game.battle.round||0)+1;
    Game.battle.finished=false;
    Game.battle.matchFinished=false;
    NEW_BATTLE.finishPending=false;
    NEW_BATTLE.active=false;
    if(typeof resetKillCam==="function") resetKillCam();
    NEW_BATTLE.player=null;
    NEW_BATTLE.cpu=null;
    if(typeof SpinWarsAbilities!=="undefined" && SpinWarsAbilities.resetMatch){
        SpinWarsAbilities.resetMatch();
    }
    startNewBattle();
}

function leave(){
    if(NEW_BATTLE.raf) cancelAnimationFrame(NEW_BATTLE.raf);
    NEW_BATTLE.active=false;
    NEW_BATTLE.paused=false;
    NEW_BATTLE.finishPending=false;
    if(typeof endKillCam==="function") endKillCam();
    closeInspect();
    showLab();
}

function closeInspect(){
    document.getElementById("battleInspect")?.remove();
    document.body.classList.remove("battle-inspect-open");
    if(NEW_BATTLE) NEW_BATTLE.paused=false;
}

function inspectHTML(){
    const p=Game.player, c=Game.cpu;
    const lab=labels();
    const pPlate=Game.mode==="rogue"&&typeof SpinWarsRogue!=="undefined"?SpinWarsRogue.plateDecor("player"):null;
    const cPlate=Game.mode==="rogue"&&typeof SpinWarsRogue!=="undefined"?SpinWarsRogue.plateDecor("cpu"):null;
    const pCombo=pPlate||calculateComboStats(p.blade,p.ratchet,p.bit)||{};
    const cCombo=cPlate||calculateComboStats(c.blade,c.ratchet,c.bit)||{};
    const pCard=typeof createComboSummaryCard==="function"?createComboSummaryCard("player",{
        ...p,...pCombo,stats:pCombo.stats,ovr:pCombo.ovr,meta:pCombo.meta,
        statDelta:pCombo.delta,rogueMod:pCombo.mod,rogueStack:pPlate?pPlate.stackHTML:"",
        plateTier:pPlate?.plateTier,enhanced:pPlate?.enhanced,who:lab.player
    }):"";
    const cCard=isSolo()?"": (typeof createComboSummaryCard==="function"?createComboSummaryCard("cpu",{
        ...c,...cCombo,stats:cCombo.stats,ovr:cCombo.ovr,meta:cCombo.meta,
        statDelta:cCombo.delta,rogueMod:cCombo.mod,rogueStack:cPlate?cPlate.stackHTML:"",
        plateTier:cPlate?.plateTier,enhanced:cPlate?.enhanced,who:lab.cpu
    }):"");
    return `<div id="battleInspect" class="battle-inspect" role="dialog" aria-label="Bey stats">
        <button type="button" class="battle-inspect-scrim" aria-label="Close stats"></button>
        <div class="battle-inspect-sheet">
            <header>
                <b>STATS</b>
                <span>PAUSED</span>
                <button type="button" class="menu-btn silver" id="battleInspectClose">CLOSE</button>
            </header>
            <div class="battle-inspect-board">${pCard}${cCard}</div>
        </div>
    </div>`;
}

function openInspect(focus){
    if(document.getElementById("battleInspect")) closeInspect();
    NEW_BATTLE.paused=true;
    document.body.classList.add("battle-inspect-open");
    document.body.insertAdjacentHTML("beforeend",inspectHTML());
    if(focus==="cpu") document.querySelector("#battleInspect .vs-plate.them")?.classList.add("inspect-focus");
    else document.querySelector("#battleInspect .vs-plate.you")?.classList.add("inspect-focus");
    const close=()=>closeInspect();
    document.getElementById("battleInspectClose")?.addEventListener("click",close);
    document.querySelector(".battle-inspect-scrim")?.addEventListener("click",close);
}

function mountInspect(){
    closeInspect();
    const pCard=document.querySelector(".battle-hud-player");
    const cCard=document.querySelector(".battle-hud-cpu");
    const bind=(el,side)=>{
        if(!el) return;
        el.classList.add("is-inspect");
        el.setAttribute("role","button");
        el.tabIndex=0;
        const go=ev=>{
            ev.preventDefault();
            ev.stopPropagation();
            openInspect(side);
        };
        el.addEventListener("click",go);
        el.addEventListener("keydown",e=>{
            if(e.key==="Enter"||e.key===" ") go(e);
        });
    };
    bind(pCard.querySelector(".battle-hud-top"),"player");
    if(!isSolo()) bind(cCard.querySelector(".battle-hud-top"),"cpu");
    if(!window._swxInspectEsc){
        window._swxInspectEsc=true;
        window.addEventListener("keydown",e=>{
            if(e.key==="Escape" && document.getElementById("battleInspect")){
                e.preventDefault();
                closeInspect();
            }
        });
    }
}

global.SpinWarsSandbox={
    isActive,isSolo,vsMode,sideIsHuman,sideIsCpu,labels,who,
    showLanding,showLab,showHelp,rip,leave,relaunch,
    decorateBattle,prepareGhost,skipGhostPhysics,afterFinish,finishCopy,
    mountInspect,openInspect,closeInspect,
    ensure,syncToGame
};
})(typeof window!=="undefined"?window:globalThis);
