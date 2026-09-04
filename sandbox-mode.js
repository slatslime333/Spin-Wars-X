/* SPIN WARS X — SANDBOX LAB
 * Garage + live bowl. No first-to-7. Finishes call out, then you rip again.
 */
(function(global){
"use strict";

const ANGLES=["Flat","Slight Tilt","Hard Tilt"];
const TECHNIQUES=["Center","X-Rail","Direct Clash","Drop Launch"];
const QUALITIES=["Horrible","Bad","Okay","Good","Perfect"];
const VS_MODES=[
    {id:"pve",label:"PLAYER VS CPU",short:"P v CPU",kicker:"YOU DRIVE",blurb:"You launch one Bey. The CPU launches the other."},
    {id:"pvp",label:"PLAYER VS PLAYER",short:"P v P",kicker:"TWO DOCKS",blurb:"P1 left dock · Space / E. P2 right dock · Enter / Shift."},
    {id:"cvc",label:"CPU VS CPU",short:"CPU v CPU",kicker:"WATCH",blurb:"Both Beys on CPU brains. No combat buttons. Sit back."}
];
const KIT_PRESETS=[
    {id:"",label:"KIT PRESET"},
    {id:"attack",label:"ATTACK (Rush / Flat)"},
    {id:"tank",label:"TANK (Ball / Needle)"},
    {id:"stamina",label:"STAMINA (Orb / Hexa)"},
    {id:"balance",label:"BALANCE (Point / Level)"},
    {id:"gold",label:"GOLD BLADES"},
    {id:"random",label:"RANDOM KIT"}
];
const LAUNCH_PRESETS=[
    {id:"",label:"BOTH LAUNCHES"},
    {id:"Center",label:"BOTH CENTER"},
    {id:"X-Rail",label:"BOTH X-RAIL"},
    {id:"Direct Clash",label:"BOTH CLASH"},
    {id:"Drop Launch",label:"BOTH DROP"},
    {id:"mirror",label:"COPY LEFT → RIGHT"}
];

function clampVs(id,beys){
    const v=String(id||"pve");
    if(beys===1 && v==="pvp") return "pve";
    if(v==="pvp"||v==="cvc"||v==="pve") return v;
    return "pve";
}
function defaultLaunch(){
    return {angle:"Flat",technique:"Center",quality:"Okay",autoQuality:false,lock:false};
}
function emptySide(){
    return {blade:null,ratchet:null,bit:null,launch:defaultLaunch()};
}
function emptySession(){
    return {score:{player:0,cpu:0},log:[],round:0};
}
function ensure(){
    if(!Game.sandbox){
        Game.sandbox={
            beys:2,
            vs:"pve",
            infiniteCharges:true,
            autoRelaunch:true,
            player:emptySide(),
            cpu:emptySide(),
            session:emptySession()
        };
    }
    const s=Game.sandbox;
    s.beys=s.beys===1?1:2;
    s.vs=clampVs(s.vs,s.beys);
    s.player=s.player||emptySide();
    s.cpu=s.cpu||emptySide();
    s.player.launch=Object.assign(defaultLaunch(),s.player.launch||{});
    s.cpu.launch=Object.assign(defaultLaunch(),s.cpu.launch||{});
    s.session=s.session||emptySession();
    s.session.score=s.session.score||{player:0,cpu:0};
    s.session.log=Array.isArray(s.session.log)?s.session.log:[];
    if(s.infiniteCharges==null) s.infiniteCharges=true;
    if(s.autoRelaunch==null) s.autoRelaunch=true;
    return s;
}
function isActive(){return Game.mode==="sandbox";}
function isSolo(){return isActive() && ensure().beys===1;}
function vsMode(){return isActive()?ensure().vs:"pve";}
function vsMeta(id){return VS_MODES.find(m=>m.id===(id||ensure().vs))||VS_MODES[0];}
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

function pick(list){
    const src=Array.isArray(list)?list.filter(Boolean):[];
    if(!src.length) return null;
    return src[Math.floor(Math.random()*src.length)];
}
function fillRandom(side,avoid){
    const s=ensure()[side];
    const blades=typeof playableBlades==="function"?playableBlades():[];
    const rats=typeof RATCHETS!=="undefined"?RATCHETS:[];
    const bits=typeof selectableBits==="function"?selectableBits():[];
    s.blade=pick(blades.filter(b=>b && b.name!==avoid?.blade?.name))||pick(blades)||s.blade;
    s.ratchet=pick(rats.filter(r=>r && r.name!==avoid?.ratchet?.name))||pick(rats)||s.ratchet;
    s.bit=pick(bits.filter(b=>b && b.name!==avoid?.bit?.name))||pick(bits)||s.bit;
}
function applyKitPreset(side,kind){
    const pack=ensure()[side];
    const blades=typeof playableBlades==="function"?playableBlades():[];
    const rats=typeof RATCHETS!=="undefined"?RATCHETS:[];
    const bits=typeof selectableBits==="function"?selectableBits():[];
    const byType=(t)=>blades.filter(b=>String(b.type).toLowerCase()===t);
    const bitNames=(names)=>bits.filter(b=>names.includes(b.name));
    if(kind==="random"){ fillRandom(side,ensure()[side==="player"?"cpu":"player"]); return; }
    if(kind==="attack"){
        pack.blade=pick(byType("attack"))||pick(blades);
        pack.bit=pick(bitNames(["Rush","Low Rush","Flat","Low Flat"]))||pick(bits);
        pack.ratchet=pick(rats.filter(r=>r.height===60||r.height===70))||pick(rats);
        return;
    }
    if(kind==="tank"){
        pack.blade=pick(byType("defense"))||pick(blades);
        pack.bit=pick(bitNames(["Ball","Needle","Hexa","Wedge"]))||pick(bits);
        pack.ratchet=pick(rats.filter(r=>r.height===60))||pick(rats);
        return;
    }
    if(kind==="stamina"){
        pack.blade=pick(byType("stamina"))||pick(byType("balance"))||pick(blades);
        pack.bit=pick(bitNames(["Orb","Ball","Hexa","Needle"]))||pick(bits);
        pack.ratchet=pick(rats.filter(r=>r.height===60))||pick(rats);
        return;
    }
    if(kind==="balance"){
        pack.blade=pick(byType("balance"))||pick(blades);
        pack.bit=pick(bitNames(["Point","Level","Kick"]))||pick(bits);
        pack.ratchet=pick(rats.filter(r=>r.height===60||r.height===70))||pick(rats);
        return;
    }
    if(kind==="gold"){
        pack.blade=pick(blades.filter(b=>String(b.tier).toLowerCase()==="gold"))||pick(blades);
        pack.bit=pick(bits);
        pack.ratchet=pick(rats);
    }
}
function applyLaunchPreset(kind){
    const s=ensure();
    const set=(side,tech)=>{
        const L=s[side].launch;
        L.technique=tech;
        L.autoQuality=false;
        L.lock=true;
        if(!L.angle) L.angle="Flat";
        if(!L.quality) L.quality="Okay";
    };
    if(kind==="mirror"){
        s.cpu.launch=Object.assign(defaultLaunch(),s.player.launch,{lock:true});
        return;
    }
    if(TECHNIQUES.includes(kind)){
        set("player",kind);
        set("cpu",kind);
    }
}
function fillIfEmpty(){
    const s=ensure();
    if(!s.player.blade||!s.player.ratchet||!s.player.bit) fillRandom("player",s.cpu);
    if(!s.cpu.blade||!s.cpu.ratchet||!s.cpu.bit) fillRandom("cpu",s.player);
}
function applyLaunchToGame(from,to,cpuBrain){
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
    if(cpuBrain && !from.launch.lock && typeof getAutomaticLaunchPlan==="function"){
        const plan=getAutomaticLaunchPlan(to===Game.cpu?"cpu":"player");
        to.launch.technique=plan.technique;
        to.launch.angle=plan.angle;
        if(from.launch.autoQuality || !from.launch.quality) to.launch.quality=plan.quality;
    }
}
function syncToGame(){
    const s=ensure();
    fillIfEmpty();
    Game.mode="sandbox";
    Game.quickMatch=false;
    Game.player=Game.player||{};
    Game.cpu=Game.cpu||{};
    applyLaunchToGame(s.player,Game.player,sideIsCpu("player"));
    applyLaunchToGame(s.cpu,Game.cpu,sideIsCpu("cpu"));
    if(typeof syncComboStats==="function"){
        syncComboStats("player");
        syncComboStats("cpu");
    }
    Game.cpu.lockedLaunchPlan={
        technique:Game.cpu.launch.technique||"Center",
        angle:Game.cpu.launch.angle||"Flat",
        quality:Game.cpu.launch.quality||"Okay"
    };
}

function comboOf(side){
    const pack=ensure()[side];
    if(!pack?.blade||!pack?.ratchet||!pack?.bit) return null;
    const raw=typeof calculateComboStats==="function"?calculateComboStats(pack.blade,pack.ratchet,pack.bit):null;
    return raw||{stats:{},ovr:60,meta:60};
}

function statBox(stats,label,key){
    const n=Number(stats?.[key]);
    const value=Number.isFinite(n)?Math.round(n):"—";
    return `<span class="vs-stat"><small>${label}</small><span class="vs-stat-val"><b>${value}</b></span></span>`;
}

function kitStatHTML(combo){
    const stats=combo?.stats||{};
    return `<div class="vs-stat-groups sandbox-kit-stats" aria-label="Combo stats">
        <div class="vs-stat-group">
            <span class="vs-stat-group-label">HIT</span>
            <div class="vs-stats pair">
                ${statBox(stats,"ATK","attack")}${statBox(stats,"KB","knockback")}
            </div>
        </div>
        <div class="vs-stat-group">
            <span class="vs-stat-group-label">HOLD</span>
            <div class="vs-stats">
                ${statBox(stats,"DEF","defense")}${statBox(stats,"BAL","balance")}${statBox(stats,"BST","burst")}
            </div>
        </div>
        <div class="vs-stat-group">
            <span class="vs-stat-group-label">MOVE</span>
            <div class="vs-stats pair">
                ${statBox(stats,"MOB","mobility")}${statBox(stats,"STA","stamina")}
            </div>
        </div>
    </div>`;
}

function enterMode(vs){
    const s=ensure();
    if(vs==="pvp") s.beys=2;
    s.vs=clampVs(vs,s.beys);
    showLab();
}

function showLanding(){
    Game.mode="sandbox";
    Game.screen="sandboxLanding";
    const s=ensure();
    const logN=s.session.log.length;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="home sandbox-landing">
        ${typeof homeBowlHTML==="function"?homeBowlHTML():""}
        ${typeof homeMarkHTML==="function"?homeMarkHTML({compact:true,kicker:"SANDBOX LAB",tag:"Build anything. Rip it. Finishes do not end the night."}):""}
        <nav class="home-doors rogue-doors sandbox-landing-doors" aria-label="Sandbox">
            <div class="home-door-row">
                ${VS_MODES.map(m=>`<button class="home-door ${m.id==="cvc"?"play":"rip"}" type="button" data-enter-vs="${m.id}">
                    <span class="home-door-kicker">${m.kicker}</span>
                    <b>${m.label}</b>
                    <small>${m.blurb}</small>
                </button>`).slice(0,2).join("")}
            </div>
            <div class="home-door-row">
                <button class="home-door play" type="button" data-enter-vs="cvc">
                    <span class="home-door-kicker">${VS_MODES[2].kicker}</span>
                    <b>${VS_MODES[2].label}</b>
                    <small>${VS_MODES[2].blurb}</small>
                </button>
                <button class="home-door rip" id="sandboxOpenLab" type="button">
                    <span class="home-door-kicker">GARAGE</span>
                    <b>OPEN LAB</b>
                    <small>Keep ${vsMeta(s.vs).short}. Change kits, then rip.</small>
                </button>
            </div>
            <button class="home-help" id="sandboxSession" type="button">SESSION LOG${logN?` · ${logN}`:""}</button>
            <button class="home-help" id="sandboxHelp" type="button">How the lab works</button>
        </nav>
    </main>`;
    document.querySelector(".home")?.appendChild(createBackButton(()=>renderMainMenu()));
    document.querySelectorAll("[data-enter-vs]").forEach(btn=>{
        btn.onclick=()=>enterMode(btn.dataset.enterVs);
    });
    document.getElementById("sandboxOpenLab").onclick=()=>showLab();
    document.getElementById("sandboxSession").onclick=()=>showSession();
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
            <p><strong>Player vs CPU.</strong> You drive the left Bey. The CPU drives the right. Same dash / kit as a live fight.</p>
            <p><strong>Player vs Player.</strong> Two human docks. P1 is left (Space / E). P2 is right (Enter / Shift). Needs two Beys.</p>
            <p><strong>CPU vs CPU.</strong> Watch mode. Both brains run. Combat buttons hide. 1 Bey + CPU is a solo spin with the CPU piloting.</p>
            <p>OPEN LAB is the garage. 1 Bey watches a single kit. 2 Beys clash. Each side has the full blade / ratchet / bit pool. CHANGE opens a picker with tier, type, height filters. PRESETS roll an Attack, Tank, Stamina, Balance, or Gold kit. BOTH LAUNCHES sets Center, X-Rail, Clash, or Drop on both sides.</p>
            <p>Human sides use the launch dropdowns. CPU sides pick like the live CPU unless you tick LOCK LAUNCH. AUTO quality still rolls each rip.</p>
            <p>A Spin, Over, or Xtreme prints who scored and how many points. The session log keeps that list. It never ends the match. AUTO RELAUNCH rips the same kits again. LEAVE is the only exit.</p>
            <p>Infinite charges stay on unless you flip them off. Tap a name in any live fight, including this lab, for a paused stat sheet.</p>
        </section>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showLanding()));
}

function showSession(){
    Game.mode="sandbox";
    Game.screen="sandboxSession";
    const s=ensure();
    const lab=labels();
    const rows=s.session.log.length
        ? s.session.log.map(entry=>`<li><b>${entry.line}</b><small>${vsMeta(entry.vs).short}${entry.beys===1?" · SOLO":""}</small></li>`).join("")
        : `<li class="sandbox-empty-row">No finishes yet. Rip something.</li>`;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div>
    <main class="menu rogue-help sandbox-session">
        <div class="selection-header">
            <div class="selection-icon">X</div>
            <div>
                <span class="eyebrow">SANDBOX</span>
                <h1>SESSION LOG</h1>
                <p>Counts for the night. Never first to 7.</p>
            </div>
        </div>
        <section class="sandbox-session-score" aria-label="Session score">
            <div><small>${s.player.blade?.name||lab.player}</small><b>${s.session.score.player||0}</b></div>
            <span>VS</span>
            <div><small>${s.beys===1?"—":(s.cpu.blade?.name||lab.cpu)}</small><b>${s.session.score.cpu||0}</b></div>
        </section>
        <section class="menu-card rogue-help-card">
            <ol class="sandbox-log">${rows}</ol>
        </section>
        <div class="sandbox-actions">
            <button type="button" class="menu-btn silver" id="sandboxResetScore">RESET SCORE</button>
            <button type="button" class="rip-btn compact" id="sandboxSessionLab">BACK TO LAB</button>
        </div>
    </main>`;
    document.querySelector(".menu")?.appendChild(createBackButton(()=>showLanding()));
    document.getElementById("sandboxResetScore").onclick=()=>{
        s.session=emptySession();
        if(Game.battle?.score) Game.battle.score={player:0,cpu:0};
        showSession();
    };
    document.getElementById("sandboxSessionLab").onclick=()=>showLab();
}

function launchSelect(side,key,options,autoKey){
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
    const meta=combo&&Number.isFinite(Number(combo.meta))?Math.round(combo.meta):"—";
    const sprite=typeof bladeSpritePath==="function"?bladeSpritePath(pack.blade):"";
    const hidden=s.beys===1 && side==="cpu";
    const human=sideIsHuman(side);
    const driver=human?"HUMAN":"CPU";
    const tag=who(side);
    const lock=!!pack.launch.lock;
    return `<section class="sandbox-col ${side}${hidden?" is-ghost":""}${human?"":" is-cpu"}" data-side="${side}">
        <header class="sandbox-col-head">
            <span class="sandbox-who">${tag}</span>
            <small>${driver}</small>
        </header>
        <div class="sandbox-kit">
            <div class="sandbox-art">${sprite?`<img src="${sprite}" alt="">`:"<span></span>"}</div>
            <div class="sandbox-kit-copy">
                <h2>${name}</h2>
                <p>${parts}</p>
                <div class="vs-rating meta"><small>META</small><b>${meta}</b></div>
            </div>
        </div>
        ${kitStatHTML(combo)}
        <div class="sandbox-part-btns">
            <button type="button" class="menu-btn gold" data-pick="${side}" data-part="blade">BLADE</button>
            <button type="button" class="menu-btn silver" data-pick="${side}" data-part="ratchet">RATCHET</button>
            <button type="button" class="menu-btn silver" data-pick="${side}" data-part="bit">BIT</button>
        </div>
        <label class="sandbox-field"><span>KIT PRESET</span>
            <select data-kit-preset="${side}">
                ${KIT_PRESETS.map(p=>`<option value="${p.id}">${p.label}</option>`).join("")}
            </select>
        </label>
        <div class="sandbox-launch">
            ${launchSelect(side,"technique",TECHNIQUES)}
            ${launchSelect(side,"angle",ANGLES)}
            ${launchSelect(side,"quality",QUALITIES,"autoQuality")}
            ${human?"":`<label class="sandbox-check"><input type="checkbox" data-lock="${side}" ${lock?"checked":""}> Lock launch</label>`}
            ${human?"":lock?`<p class="sandbox-hint">CPU uses these dropdowns.</p>`:`<p class="sandbox-hint">CPU picks launch unless you lock it.</p>`}
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
    const lab=labels();
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background stadium"></div>
    <main class="sandbox-lab">
        <header class="sandbox-lab-head">
            <p class="home-kicker">SANDBOX LAB</p>
            <p class="sandbox-mode-blurb">${vsMeta(s.vs).blurb}</p>
        </header>
        <section class="sandbox-toolbar">
            <div class="sandbox-seg" role="group" aria-label="Bey count">
                <button type="button" class="sandbox-chip ${s.beys===1?"on":""}" data-beys="1">1 BEY</button>
                <button type="button" class="sandbox-chip ${s.beys===2?"on":""}" data-beys="2">2 BEYS</button>
            </div>
            <button type="button" class="rip-btn compact" id="sandboxRipTop">LET IT RIP</button>
        </section>
        <section class="sandbox-toolbar sandbox-vs-bar" aria-label="Who is driving">
            ${VS_MODES.map(m=>`<button type="button" class="sandbox-chip sandbox-vs-chip ${s.vs===m.id?"on":""}" data-vs="${m.id}" ${s.beys===1&&m.id==="pvp"?"disabled":""}>${m.label}</button>`).join("")}
        </section>
        <section class="sandbox-toggles">
            <label class="sandbox-check"><input type="checkbox" id="sandboxInfinite" ${s.infiniteCharges?"checked":""}> Infinite charges</label>
            <label class="sandbox-check"><input type="checkbox" id="sandboxAutoRip" ${s.autoRelaunch?"checked":""}> Auto relaunch</label>
            <label class="sandbox-field sandbox-tools-field"><span>BOTH LAUNCHES</span>
                <select id="sandboxLaunchPreset">
                    ${LAUNCH_PRESETS.map(p=>`<option value="${p.id}">${p.label}</option>`).join("")}
                </select>
            </label>
        </section>
        <button type="button" class="sandbox-session-bar" id="sandboxOpenSession">
            <span>${lab.player} ${s.session.score.player||0} · ${lab.cpu} ${s.session.score.cpu||0}</span>
            <small>${s.session.log.length?s.session.log[0].line:"SESSION · tap for log"}</small>
        </button>
        <section class="sandbox-garages">
            ${garageColumn("player")}
            ${s.beys===2?`<div class="vs-stamp" aria-hidden="true">VS</div>`:""}
            ${garageColumn("cpu")}
        </section>
        <p class="sandbox-foot-note">Scoring never ends the lab. LEAVE on the HUD is the only way out.</p>
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
    document.querySelectorAll("[data-vs]").forEach(btn=>{
        btn.onclick=()=>{
            if(btn.disabled) return;
            s.vs=clampVs(btn.dataset.vs,s.beys);
            showLab();
        };
    });
    document.getElementById("sandboxInfinite")?.addEventListener("change",e=>{
        s.infiniteCharges=!!e.target.checked;
    });
    document.getElementById("sandboxAutoRip")?.addEventListener("change",e=>{
        s.autoRelaunch=!!e.target.checked;
    });
    document.getElementById("sandboxLaunchPreset")?.addEventListener("change",e=>{
        const v=e.target.value;
        if(!v) return;
        applyLaunchPreset(v);
        showLab();
    });
    document.getElementById("sandboxOpenSession")?.addEventListener("click",()=>showSession());
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
    document.querySelectorAll("[data-kit-preset]").forEach(sel=>{
        sel.onchange=()=>{
            if(!sel.value) return;
            applyKitPreset(sel.dataset.kitPreset,sel.value);
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
    document.querySelectorAll("[data-lock]").forEach(box=>{
        box.onchange=()=>{
            ensure()[box.dataset.lock].launch.lock=!!box.checked;
            showLab();
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
    document.getElementById("sandboxRipTop")?.addEventListener("click",()=>rip());
}

function uniqueSorted(list){
    return [...new Set(list.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));
}
function pickerPool(part,filters){
    filters=filters||{};
    if(part==="blade"){
        let all=typeof playableBlades==="function"?playableBlades():[];
        if(filters.tier && filters.tier!=="all") all=all.filter(b=>String(b.tier).toLowerCase()===filters.tier);
        if(filters.type && filters.type!=="all") all=all.filter(b=>String(b.type).toLowerCase()===filters.type);
        return all;
    }
    if(part==="ratchet"){
        let all=typeof RATCHETS!=="undefined"?RATCHETS.slice():[];
        if(filters.height && filters.height!=="all") all=all.filter(r=>String(r.height)===String(filters.height));
        if(filters.sides && filters.sides!=="all") all=all.filter(r=>String(r.number)===String(filters.sides));
        return all;
    }
    let bits=typeof selectableBits==="function"?selectableBits():[];
    if(filters.type && filters.type!=="all") bits=bits.filter(b=>String(b.type).toLowerCase()===filters.type);
    return bits;
}
function pickerFilterBar(part){
    if(part==="blade"){
        return `<div class="sandbox-picker-filters">
            <label class="sandbox-field"><span>TIER</span>
                <select id="sandboxPickerTier">
                    <option value="all">ALL</option>
                    <option value="bronze">BRONZE</option>
                    <option value="silver">SILVER</option>
                    <option value="gold">GOLD</option>
                </select>
            </label>
            <label class="sandbox-field"><span>TYPE</span>
                <select id="sandboxPickerType">
                    <option value="all">ALL</option>
                    <option value="attack">ATTACK</option>
                    <option value="defense">DEFENSE</option>
                    <option value="stamina">STAMINA</option>
                    <option value="balance">BALANCE</option>
                </select>
            </label>
        </div>`;
    }
    if(part==="bit"){
        const types=uniqueSorted((typeof selectableBits==="function"?selectableBits():[]).map(b=>b.type));
        return `<div class="sandbox-picker-filters">
            <label class="sandbox-field"><span>TYPE</span>
                <select id="sandboxPickerType">
                    <option value="all">ALL</option>
                    ${types.map(t=>`<option value="${String(t).toLowerCase()}">${String(t).toUpperCase()}</option>`).join("")}
                </select>
            </label>
        </div>`;
    }
    const rats=typeof RATCHETS!=="undefined"?RATCHETS:[];
    const heights=uniqueSorted(rats.map(r=>r.height));
    const sides=uniqueSorted(rats.map(r=>r.number));
    return `<div class="sandbox-picker-filters">
        <label class="sandbox-field"><span>HEIGHT</span>
            <select id="sandboxPickerHeight">
                <option value="all">ALL</option>
                ${heights.map(h=>`<option value="${h}">${h}</option>`).join("")}
            </select>
        </label>
        <label class="sandbox-field"><span>SIDES</span>
            <select id="sandboxPickerSides">
                <option value="all">ALL</option>
                ${sides.map(n=>`<option value="${n}">${n}</option>`).join("")}
            </select>
        </label>
    </div>`;
}

function openPicker(side,part){
    const s=ensure();
    document.getElementById("sandboxPicker")?.remove();
    const overlay=document.createElement("div");
    overlay.className="sandbox-picker";
    overlay.id="sandboxPicker";
    const title=part.toUpperCase();
    overlay.innerHTML=`<div class="sandbox-picker-sheet">
        <header>
            <b>PICK ${title} · ${who(side)}</b>
            <button type="button" class="menu-btn silver" id="sandboxPickerClose">BACK</button>
        </header>
        ${pickerFilterBar(part)}
        <div class="sandbox-picker-grid" id="sandboxPickerGrid"></div>
    </div>`;
    document.body.appendChild(overlay);
    const readFilters=()=>({
        tier:document.getElementById("sandboxPickerTier")?.value||"all",
        type:document.getElementById("sandboxPickerType")?.value||"all",
        height:document.getElementById("sandboxPickerHeight")?.value||"all",
        sides:document.getElementById("sandboxPickerSides")?.value||"all"
    });
    const render=()=>{
        const grid=document.getElementById("sandboxPickerGrid");
        const pool=pickerPool(part,readFilters());
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
    overlay.querySelectorAll("select").forEach(sel=>sel.addEventListener("change",render));
    render();
}

function rip(){
    const s=ensure();
    fillIfEmpty();
    syncToGame();
    s.session.round=(s.session.round||0)+1;
    Game.battle={
        score:{player:s.session.score.player||0,cpu:s.session.score.cpu||0},
        round:s.session.round,
        matchStarted:false
    };
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
    if(ft) ft.textContent=isSolo()?"SOLO · SANDBOX":`${vsMeta().short} · SANDBOX`;
    const leave=document.getElementById("forfeitMatchBtn");
    if(leave) leave.textContent="LEAVE";
    if(isSolo()){
        document.querySelector(".battle-hud-cpu")?.classList.add("is-ghost");
        document.getElementById("newCpuBey")?.setAttribute("opacity","0");
        const spr=document.getElementById("newCpuBeySprite");
        if(spr) spr.style.display="none";
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
    const sc=Game.battle?.score||{player:0,cpu:0};
    s.session.score.player=sc.player||0;
    s.session.score.cpu=sc.cpu||0;
    const line=finishCopy(winnerSide,finishType,points);
    s.session.log.unshift({
        line,
        type:String(finishType||"Spin"),
        winner:winnerSide,
        points:Number(points)||1,
        vs:s.vs,
        beys:s.beys
    });
    if(s.session.log.length>40) s.session.log.length=40;
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
    Game.battle.score={player:s.session.score.player||0,cpu:s.session.score.cpu||0};
    Game.battle.round=(Game.battle.round||0)+1;
    s.session.round=Game.battle.round;
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
    showLanding,showLab,showHelp,showSession,rip,leave,relaunch,
    decorateBattle,prepareGhost,skipGhostPhysics,afterFinish,finishCopy,
    mountInspect,openInspect,closeInspect,
    ensure,syncToGame
};
})(typeof window!=="undefined"?window:globalThis);
