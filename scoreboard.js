/*==================================
 SPIN WARS X — MATCH / ROGUE SCOREBOARD
 Presentation only. Records events that already happen.
 Tune SCORE.* without rewriting the UI.
==================================*/
(function(global){
    const SCORE={
        SPIN_FINISH:200,
        OVER_FINISH:350,
        XTREME_FINISH:500,
        BIG_IMPACT:50,
        BIG_IMPACT_MIN_HUD:8,
        RPM_DAMAGE_PER_POINT:10,
        HUD_RPM_SCALE:100,
        XRAIL_SPIN:75,
        XRAIL_OVER:125,
        XRAIL_XTREME:200,
        MUL_NORMAL:1,
        MUL_STRONG:1.25,
        MUL_EXCEPTIONAL:1.50,
        MUL_ELITE:2,
        BOSS_BRONZE:250,
        BOSS_SILVER:500,
        BOSS_GOLD:750,
        BOSS_FINAL:1500,
        RAIL_SEQ_MS:2200,
        CLUTCH_RPM:0.22,
        COMEBACK_LEAD:3
    };

    function blankSide(){
        return {
            rpmDamage:0,
            hits:0,
            bigImpacts:0,
            spin:0,
            over:0,
            xtreme:0,
            dashes:0,
            xrailDashes:0,
            xrailRides:0,
            abilityDamage:0,
            peakRpm:0,
            biggestImpact:0,
            xrailSpin:0,
            xrailOver:0,
            xrailXtreme:0,
            bestMul:SCORE.MUL_NORMAL,
            bestChain:"",
            xtremeWithBigRail:0
        };
    }
    function blankPoint(){
        return {
            player:{big:false,rail:false},
            cpu:{big:false,rail:false}
        };
    }

    const state={
        match:null,
        point:null,
        lastImpactAt:0,
        railUntil:{player:0,cpu:0},
        wasRail:{player:false,cpu:false},
        lastEvent:null,
        maxCpuLead:0,
        maxPlayerLead:0,
        run:null
    };

    function nowMs(){return (typeof performance!=="undefined"&&performance.now)?performance.now():Date.now();}
    function hudRpm(v){return Math.max(0,Math.round((Number(v)||0)*SCORE.HUD_RPM_SCALE));}
    function commas(n){
        const s=String(Math.round(Number(n)||0));
        return s.replace(/\B(?=(\d{3})+(?!\d))/g,",");
    }
    function pts(n){return (n>0?"+":"")+commas(n)+" pts";}

    function ensureMatch(){
        if(!state.match) beginMatch();
        return state.match;
    }

    function beginMatch(){
        state.match={player:blankSide(),cpu:blankSide(),absorbed:false};
        state.point=blankPoint();
        state.lastImpactAt=0;
        state.railUntil={player:0,cpu:0};
        state.wasRail={player:false,cpu:false};
        state.lastEvent=null;
        state.maxCpuLead=0;
        state.maxPlayerLead=0;
    }
    function beginPoint(){
        ensureMatch();
        state.point=blankPoint();
        state.wasRail={player:false,cpu:false};
    }
    function emptyRun(){
        return {
            battlesWon:0,
            battles:0,
            rpmDamage:0,
            spin:0,
            over:0,
            xtreme:0,
            bigImpacts:0,
            dashes:0,
            xrailDashes:0,
            xrailRides:0,
            abilityDamage:0,
            peakRpm:0,
            biggestImpact:0,
            battleScores:[],
            bossBonus:0
        };
    }
    function beginRun(){
        state.run=emptyRun();
        beginMatch();
    }

    function sideOf(id){return state.match[id];}

    function markRail(side){
        const t=nowMs();
        state.railUntil[side]=t+SCORE.RAIL_SEQ_MS;
        if(state.point) state.point[side].rail=true;
    }
    function railHot(side){
        return nowMs()< (state.railUntil[side]||0);
    }

    function noteEvent(side,label){
        state.lastEvent={side,label};
    }

    function addDamage(dealer,amount,isBig){
        if(amount<=0) return;
        const s=sideOf(dealer);
        s.rpmDamage+=amount;
        s.hits+=1;
        if(amount>s.biggestImpact) s.biggestImpact=amount;
        if(isBig){
            s.bigImpacts+=1;
            if(state.point) state.point[dealer].big=true;
            noteEvent(dealer,`${commas(amount)} RPM Damage (Big Impact)`);
        }else{
            noteEvent(dealer,`${commas(amount)} RPM Damage`);
        }
    }
    function addAbilityDamage(dealer,amount){
        if(amount<=0) return;
        const s=sideOf(dealer);
        s.abilityDamage=(Number(s.abilityDamage)||0)+amount;
        noteEvent(dealer,`${commas(amount)} Ability Damage`);
    }

    function onDash(side,bey){
        ensureMatch();
        const s=sideOf(side);
        s.dashes+=1;
        const onSeq=railHot(side)||!!bey?.railEngaged||!!bey?.xrailExitRampActive;
        if(onSeq) s.xrailDashes+=1;
    }

    function observe(p,c,battle){
        ensureMatch();
        if(!p||!c) return;
        const t=nowMs();
        const pr=Number(p.rpm)||0;
        const cr=Number(c.rpm)||0;
        if(pr>state.match.player.peakRpm) state.match.player.peakRpm=pr;
        if(cr>state.match.cpu.peakRpm) state.match.cpu.peakRpm=cr;

        const pRail=!!p.railEngaged;
        const cRail=!!c.railEngaged;
        if(pRail && !state.wasRail.player){
            markRail("player");
            state.match.player.xrailRides=(Number(state.match.player.xrailRides)||0)+1;
        }
        if(cRail && !state.wasRail.cpu){
            markRail("cpu");
            state.match.cpu.xrailRides=(Number(state.match.cpu.xrailRides)||0)+1;
        }
        if(!pRail && state.wasRail.player) markRail("player");
        if(!cRail && state.wasRail.cpu) markRail("cpu");
        state.wasRail.player=pRail;
        state.wasRail.cpu=cRail;

        const imp=battle?.lastImpact;
        const at=Number(imp?.time)||0;
        if(imp && at && at!==state.lastImpactAt){
            state.lastImpactAt=at;
            const ability=!!imp.fromAbility;
            const heavy=imp.impactClass==="heavy"||imp.heavy;
            const pLost=hudRpm(imp.playerRpmLoss);
            const cLost=hudRpm(imp.cpuRpmLoss);
            if(ability){
                if(cLost>0) addAbilityDamage("player",cLost);
                if(pLost>0) addAbilityDamage("cpu",pLost);
            }else{
                if(cLost>0) addDamage("player",cLost,heavy && cLost>=SCORE.BIG_IMPACT_MIN_HUD);
                if(pLost>0) addDamage("cpu",pLost,heavy && pLost>=SCORE.BIG_IMPACT_MIN_HUD);
            }
        }

        const score=global.Game?.battle?.score;
        if(score){
            const d=(Number(score.cpu)||0)-(Number(score.player)||0);
            if(d>state.maxCpuLead) state.maxCpuLead=d;
            if(-d>state.maxPlayerLead) state.maxPlayerLead=-d;
        }
    }

    function finishPts(type){
        if(type==="Xtreme") return SCORE.XTREME_FINISH;
        if(type==="Over") return SCORE.OVER_FINISH;
        return SCORE.SPIN_FINISH;
    }
    function xrailBonus(type){
        if(type==="Xtreme") return SCORE.XRAIL_XTREME;
        if(type==="Over") return SCORE.XRAIL_OVER;
        return SCORE.XRAIL_SPIN;
    }

    function onFinish(winnerSide,finishType,winnerBey){
        ensureMatch();
        const s=sideOf(winnerSide);
        const type=finishType==="Xtreme"?"Xtreme":finishType==="Over"?"Over":"Spin Finish";
        if(type==="Xtreme") s.xtreme+=1;
        else if(type==="Over") s.over+=1;
        else s.spin+=1;

        const pt=state.point&&state.point[winnerSide];
        const rail=!!(pt&&pt.rail) || railHot(winnerSide) || !!(winnerBey&&(winnerBey.railEngaged||winnerBey.xrailExitRampActive));
        if(rail){
            if(type==="Xtreme") s.xrailXtreme+=1;
            else if(type==="Over") s.xrailOver+=1;
            else s.xrailSpin+=1;
        }
        const big=!!(pt&&pt.big);
        let mul=SCORE.MUL_NORMAL;
        let chain="";
        if(big && rail && type==="Xtreme"){
            s.xtremeWithBigRail+=1;
            mul=s.xtremeWithBigRail>=2?SCORE.MUL_ELITE:SCORE.MUL_EXCEPTIONAL;
            chain="Big Impact → X-Rail → Xtreme Finish";
        }else if(big && rail){
            mul=SCORE.MUL_EXCEPTIONAL;
            chain=`Big Impact → X-Rail → ${type}`;
        }else if(rail){
            mul=SCORE.MUL_STRONG;
            chain=`X-Rail → ${type}`;
        }else if(big){
            mul=SCORE.MUL_STRONG;
            chain=`Big Impact → ${type}`;
        }
        if(mul>s.bestMul){
            s.bestMul=mul;
            s.bestChain=chain;
        }else if(mul===s.bestMul && chain && !s.bestChain){
            s.bestChain=chain;
        }
        noteEvent(winnerSide, type==="Spin Finish"?"Spin Finish":type+" Finish");
        state.lastWinnerRpm=Number(winnerBey?.rpm)||0;
        state.point=blankPoint();
    }

    function rpmPts(damage){
        return Math.floor(Math.max(0,Number(damage)||0)/SCORE.RPM_DAMAGE_PER_POINT);
    }
    function baseScore(s){
        return rpmPts(s.rpmDamage)
            + rpmPts(s.abilityDamage)
            + s.bigImpacts*SCORE.BIG_IMPACT
            + s.spin*SCORE.SPIN_FINISH
            + s.over*SCORE.OVER_FINISH
            + s.xtreme*SCORE.XTREME_FINISH;
    }
    function dmgPerHit(s){
        if(!s.hits) return 0;
        return Math.round((s.rpmDamage/s.hits)*10)/10;
    }

    function breakdown(s){
        const ability=Number(s.abilityDamage)||0;
        const rides=Number(s.xrailRides)||0;
        const rows=[
            {key:"rpm",name:"RPM Damage",stat:`${commas(s.rpmDamage)} damage`,pts:rpmPts(s.rpmDamage),score:true},
            {key:"ability",name:"Ability Damage",stat:`${commas(ability)} damage`,pts:rpmPts(ability),score:true},
            {key:"big",name:"Big Impacts",stat:String(s.bigImpacts),pts:s.bigImpacts*SCORE.BIG_IMPACT,score:true},
            {key:"spin",name:"Spin Finishes",stat:String(s.spin),pts:s.spin*SCORE.SPIN_FINISH,score:true},
            {key:"over",name:"Over Finishes",stat:String(s.over),pts:s.over*SCORE.OVER_FINISH,score:true},
            {key:"xtreme",name:"Xtreme Finishes",stat:String(s.xtreme),pts:s.xtreme*SCORE.XTREME_FINISH,score:true},
            {key:"xride",name:"X-Rail Rides",stat:String(rides),pts:0,score:false},
            {key:"dash",name:"Dashes Used",stat:String(s.dashes),pts:0,score:false}
        ];
        return rows.filter(r=>!r.hide);
    }

    function qualityFromScore(n){
        if(n>=88) return "Perfect";
        if(n>=70) return "Good";
        if(n>=48) return "Okay";
        if(n>=28) return "Bad";
        return "Horrible";
    }
    function gameQuality(winner,pScore,cScore,pT){
        const pts=Number(pT?.final)||0;
        const ps=Number(pScore)||0;
        const cs=Number(cScore)||0;
        let q=0;
        if(winner==="player"){
            q=42+(ps-cs)*8;
            q+=Math.min(28, pts/55);
            if(cs===0) q+=6;
        }else{
            q=6+ps*7;
            q+=Math.min(16, pts/90);
        }
        return qualityFromScore(q);
    }

    function victoryLabel(winner,pScore,cScore,winnerRpm){
        if(winner==="player" && cScore===0) return "DOMINANT VICTORY";
        if(winner==="cpu" && pScore===0) return "DOMINANT VICTORY";
        if(winner==="player" && state.maxCpuLead>=SCORE.COMEBACK_LEAD) return "COMEBACK VICTORY";
        if(winner==="cpu" && state.maxPlayerLead>=SCORE.COMEBACK_LEAD) return "COMEBACK VICTORY";
        if((Number(winnerRpm)||1)<SCORE.CLUTCH_RPM) return "CLUTCH VICTORY";
        if(Math.abs(pScore-cScore)<=1 && Math.max(pScore,cScore)>=7) return "CLUTCH VICTORY";
        return "";
    }

    function tally(s){
        const base=baseScore(s);
        const mul=s.bestMul||SCORE.MUL_NORMAL;
        return {base,mul,final:Math.round(base*mul)};
    }

    function names(){
        const g=global.Game||{};
        return {
            player:g.player?.blade?.name||"YOU",
            cpu:g.cpu?.blade?.name||"CPU"
        };
    }

    function packMatch(){
        ensureMatch();
        const p=state.match.player;
        const c=state.match.cpu;
        const pT=tally(p);
        const cT=tally(c);
        const highlight=pT.mul>=cT.mul
            ? {side:"player",mul:p.bestMul,chain:p.bestChain}
            : {side:"cpu",mul:c.bestMul,chain:c.bestChain};
        return {player:p,cpu:c,pT,cT,highlight};
    }

    function absorbIntoRun(winner,pT){
        if(!state.run) state.run=emptyRun();
        if(state.match && state.match.absorbed) return 0;
        if(state.match) state.match.absorbed=true;
        const p=state.match.player;
        state.run.battles+=1;
        if(winner==="player") state.run.battlesWon+=1;
        state.run.rpmDamage+=p.rpmDamage;
        state.run.spin+=p.spin;
        state.run.over+=p.over;
        state.run.xtreme+=p.xtreme;
        state.run.bigImpacts+=p.bigImpacts;
        state.run.dashes+=p.dashes;
        state.run.xrailDashes+=p.xrailDashes;
        state.run.xrailRides=(Number(state.run.xrailRides)||0)+(Number(p.xrailRides)||0);
        state.run.abilityDamage=(Number(state.run.abilityDamage)||0)+(Number(p.abilityDamage)||0);
        if(p.peakRpm>state.run.peakRpm) state.run.peakRpm=p.peakRpm;
        if(p.biggestImpact>state.run.biggestImpact) state.run.biggestImpact=p.biggestImpact;
        state.run.battleScores.push(pT.final);
        const idx=Number(global.Game?.rogue?.matchIndex)||0;
        const R=global.SpinWarsRogue;
        let bonus=0;
        if(winner==="player"){
            if(R&&typeof R.isSharkNight==="function"&&R.isSharkNight(idx)) bonus=SCORE.BOSS_FINAL;
            else if(R&&typeof R.isMiniNight==="function"&&R.isMiniNight(idx)){
                bonus=idx<=Math.ceil((R.finalMatch?.()||18)/2)?SCORE.BOSS_BRONZE:SCORE.BOSS_SILVER;
            }else if(idx===6) bonus=SCORE.BOSS_BRONZE;
            else if(idx===12) bonus=SCORE.BOSS_SILVER;
            else if(idx===18) bonus=SCORE.BOSS_FINAL;
        }
        state.run.bossBonus+=bonus;
        return bonus;
    }
    function runFinal(){
        const r=state.run;
        if(!r) return 0;
        const battles=(r.battleScores||[]).reduce((a,b)=>a+b,0);
        return battles+r.bossBonus;
    }

    function exportRun(){
        return state.run?JSON.parse(JSON.stringify(state.run)):null;
    }
    function importRun(raw){
        if(!raw||typeof raw!=="object") return;
        state.run=raw;
    }

    function colHTML(label,blade,s,t){
        const rows=breakdown(s).map(r=>`<li class="${r.score?"is-score":"is-stat"}">
            <span class="sb-row-name">${r.name}</span>
            <span class="sb-row-stat">${r.stat}</span>
            <span class="sb-row-pts">${r.score?pts(r.pts):"+0 pts"}</span>
        </li>`).join("");
        return `<article class="sb-col">
            <header>
                <small>${label}</small>
                <h2>${blade}</h2>
            </header>
            <ul class="sb-rows">${rows}</ul>
            <p class="sb-base">Base ${commas(t.base)} · ×${t.mul.toFixed(2)}</p>
            <p class="sb-final">${commas(t.final)}</p>
        </article>`;
    }

    function showMatchSummary(opts){
        opts=opts||{};
        const packed=packMatch();
        const n=names();
        const winner=opts.matchWinner||"player";
        const pScore=opts.playerScore||0;
        const cScore=opts.cpuScore||0;
        const tag=victoryLabel(winner,pScore,cScore,state.lastWinnerRpm);
        const hl=packed.highlight;
        const chain=hl.chain
            ? `<section class="sb-chain">
                <p class="sb-kicker">FINISH CHAIN</p>
                <p class="sb-chain-line">${hl.chain}</p>
                <p class="sb-mul">×${hl.mul.toFixed(2)}</p>
               </section>`
            : `<section class="sb-chain sb-chain-quiet">
                <p class="sb-kicker">FINISH CHAIN</p>
                <p class="sb-chain-line">No scoring sequence</p>
                <p class="sb-mul">×${SCORE.MUL_NORMAL.toFixed(2)}</p>
               </section>`;
        const quality=gameQuality(winner,pScore,cScore,packed.pT);
        const boss=opts.rogue?absorbIntoRun(winner,packed.pT)||0:0;
        if(opts.rogue && typeof global.SpinWarsRogue!=="undefined" && SpinWarsRogue.persist){
            SpinWarsRogue.persist();
        }
        const records=`<section class="sb-records">
            <div><small>Damage / Hit</small><b>${dmgPerHit(state.match.player)}</b><i>${dmgPerHit(state.match.cpu)}</i></div>
        </section>`;
        const app=document.getElementById("app");
        if(!app) return packed;
        if(global.Game) global.Game.screen="matchSummary";
        const mark=typeof homeMarkHTML==="function"?homeMarkHTML({compact:true,tag:"MATCH SUMMARY"}):"";
        const next=opts.rogue
            ? `<button class="rip-btn" id="sbContinue" type="button">CONTINUE</button>`
            : `<button class="rip-btn" id="sbContinue" type="button">CONTINUE</button>
               <button class="menu-btn silver" id="sbRematch" type="button">REMATCH</button>
               <button class="menu-btn" id="sbExit" type="button">EXIT</button>`;
        app.innerHTML=`<div class="background"></div>
        <main class="sb-screen">
            ${mark}
            ${tag?`<p class="sb-tag">${tag}</p>`:""}
            <p class="sb-board">${pScore} — ${cScore}</p>
            ${chain}
            <div class="sb-grid">
                ${colHTML("YOU",n.player,state.match.player,packed.pT)}
                ${colHTML("CPU",n.cpu,state.match.cpu,packed.cT)}
            </div>
            ${records}
            <p class="sb-quality"><span>GAME QUALITY</span><b>${quality}</b></p>
            ${boss?`<p class="sb-boss">Rogue boss bonus +${commas(boss)}</p>`:""}
            <div class="sb-actions">${next}</div>
        </main>`;
        document.getElementById("sbContinue")?.addEventListener("click",()=>{
            if(typeof opts.onContinue==="function") opts.onContinue();
        });
        document.getElementById("sbRematch")?.addEventListener("click",()=>{
            if(typeof opts.onRematch==="function") opts.onRematch();
        });
        document.getElementById("sbExit")?.addEventListener("click",()=>{
            if(typeof opts.onExit==="function") opts.onExit();
        });
        return packed;
    }

    function showRunSummary(opts){
        opts=opts||{};
        const r=opts.run||state.run||{battleScores:[],battlesWon:0,battles:0,rpmDamage:0,spin:0,over:0,xtreme:0,bigImpacts:0,dashes:0,xrailRides:0,abilityDamage:0,peakRpm:0,bossBonus:0};
        const battles=(r.battleScores||[]).reduce((a,b)=>a+b,0);
        const final=battles+(Number(r.bossBonus)||0);
        const blade=opts.bladeName||global.Game?.rogue?.blade?.name||global.Game?.player?.blade?.name||"RUN";
        const status=opts.status==="won"?"WON":opts.status==="lost"?"LOST":"";
        if(global.Game) global.Game.screen="rogueRunSummary";
        const app=document.getElementById("app");
        const mark=typeof homeMarkHTML==="function"?homeMarkHTML({compact:true,tag:status==="WON"?"ROGUE RUN WON":status==="LOST"?"ROGUE RUN LOST":"ROGUE RUN COMPLETE"}):"";
        app.innerHTML=`<div class="background"></div>
        <main class="sb-screen sb-run">
            ${mark}
            <p class="win-name">${blade}</p>
            <p class="sb-kicker">FINAL SCORE</p>
            <p class="sb-final sb-run-final">${commas(final)}</p>
            <ul class="sb-run-stats">
                <li>Battles Won <b>${r.battlesWon||0}</b></li>
                <li>Total RPM Damage <b>${commas(r.rpmDamage)}</b></li>
                <li>Ability Damage <b>${commas(r.abilityDamage)}</b></li>
                <li>Spin Finishes <b>${r.spin||0}</b></li>
                <li>Over Finishes <b>${r.over||0}</b></li>
                <li>Xtreme Finishes <b>${r.xtreme||0}</b></li>
                <li>Big Impacts <b>${r.bigImpacts||0}</b></li>
                <li>Dashes <b>${r.dashes||0}</b></li>
                <li>X-Rail Rides <b>${r.xrailRides||0}</b></li>
                <li>Boss Bonuses <b>${pts(r.bossBonus)}</b></li>
            </ul>
            <button class="rip-btn" id="sbRunHome" type="button">TITLE</button>
        </main>`;
        document.getElementById("sbRunHome")?.addEventListener("click",()=>{
            if(typeof opts.onHome==="function") opts.onHome();
            else if(typeof renderMainMenu==="function") renderMainMenu();
        });
    }

    global.SpinWarsScoreboard={
        SCORE, beginMatch, beginPoint, beginRun,
        observe, onDash, onFinish,
        showMatchSummary, showRunSummary,
        packMatch, tally, baseScore, breakdown, gameQuality, exportRun, importRun, runFinal
    };
    if(typeof document!=="undefined"){
        document.addEventListener("DOMContentLoaded",()=>{
            if(!/[?&]sb=preview/.test(String(location.search||""))) return;
            setTimeout(()=>{
                const g=global.Game;
                if(g){
                    g.player=g.player||{};
                    g.cpu=g.cpu||{};
                    g.player.blade={name:"Leon Crest"};
                    g.cpu.blade={name:"Phoenix Wing"};
                }
                beginMatch();
                Object.assign(state.match.player,{
                    rpmDamage:1240,hits:29,bigImpacts:4,spin:1,over:0,xtreme:1,
                    dashes:7,xrailRides:5,abilityDamage:180,peakRpm:0.97,
                    bestMul:SCORE.MUL_EXCEPTIONAL,
                    bestChain:"Big Impact → X-Rail → Xtreme Finish"
                });
                Object.assign(state.match.cpu,{
                    rpmDamage:860,hits:22,bigImpacts:2,spin:1,over:1,xtreme:0,
                    dashes:4,xrailRides:2,abilityDamage:40,peakRpm:0.88,
                    bestMul:SCORE.MUL_STRONG,bestChain:"X-Rail → Over"
                });
                state.maxCpuLead=3;
                showMatchSummary({
                    matchWinner:"player",playerScore:7,cpuScore:3,rogue:false,
                    onContinue:()=>typeof renderMainMenu==="function"&&renderMainMenu(),
                    onRematch:()=>typeof renderMainMenu==="function"&&renderMainMenu(),
                    onExit:()=>typeof renderMainMenu==="function"&&renderMainMenu()
                });
            },160);
        });
    }
})(typeof window!=="undefined"?window:globalThis);
