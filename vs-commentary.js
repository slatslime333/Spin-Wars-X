/*==================================
 VS SCREEN COMMENTARY
 Short booth color for the combo plates and live battle.
==================================*/

(function(global){
    const INTROS=[
        "Lights up — first to seven.",
        "Two Beys, one bowl.",
        "Stadium's live; don't overthink the plates.",
        "Welcome in — the X-Rail's quiet for now.",
        "Here we go: same sport, new mess.",
        "Crowd's in and the scoreboard's empty.",
        "Good evening from the bowl — somebody's leaving with seven."
    ];

    const ATTACK_BITS=new Set(["Flat","Low Flat","Rush","Low Rush","Kick","Quake"]);
    const TANK_BITS=new Set(["Ball","Orb","Hexa","Needle","Wedge"]);

    function pick(list){
        return list[Math.floor(Math.random()*list.length)];
    }
    function n(v){return Math.round(Number(v)||0);}
    function escapeHtml(s){
        return String(s||"").replace(/[&<>"']/g,ch=>({
            "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
        }[ch]));
    }

    function snapshot(side,combo,plate,label){
        const blade=side.blade||{};
        const ratchet=side.ratchet||{};
        const bit=side.bit||{};
        const stats=combo?.stats||side.stats||{};
        const ovr=n(combo?.ovr??side.comboOVR??70);
        const meta=n(combo?.meta??side.comboMeta??ovr);
        const bitName=bit.name||"that bit";
        const bladeType=blade.type||"Balance";
        const height=Number(ratchet.height)||60;
        const upgrades=(plate&&plate.stack)||[];
        const isPlayer=label==="player";
        return {
            who:isPlayer?"the player":"the CPU",
            whoCap:isPlayer?"The player":"The CPU",
            blade:blade.name||"that Bey",
            bladeType,
            tier:(blade.tier||"").toLowerCase(),
            ratchet:ratchet.name||`${ratchet.number||"?"}-${height}`,
            height,
            bit:bitName,
            bitType:bit.type||"Balance",
            attackBit:ATTACK_BITS.has(bitName),
            tankBit:TANK_BITS.has(bitName),
            ovr,
            meta,
            stats,
            mod:plate&&plate.mod,
            upgrades
        };
    }

    function mismatch(s){
        if(s.bladeType==="Attack"&&s.tankBit) return "tank-on-attack";
        if((s.bladeType==="Defense"||s.bladeType==="Stamina")&&s.attackBit) return "rush-on-tank";
        if(s.bladeType==="Attack"&&s.attackBit) return "full-send";
        if((s.bladeType==="Defense"||s.bladeType==="Stamina")&&s.tankBit) return "pure-tank";
        return "mixed";
    }

    function jobOf(s){
        const m=mismatch(s);
        if(m==="full-send"){
            return pick([
                `${s.blade} on ${s.bit} is here to hit something, not wait it out.`,
                `${s.blade} brought ${s.bit} — smash build, no mystery.`,
                `${s.whoCap}'s ${s.blade} wants the rail and a hole.`
            ]);
        }
        if(m==="pure-tank"){
            return pick([
                `${s.blade} on ${s.bit} is playing the long game: stay spinning, make them miss.`,
                `${s.blade} looks like a tank with ${s.bit} under it.`,
                `${s.whoCap} parked ${s.blade} in the middle of the bowl on purpose.`
            ]);
        }
        if(m==="tank-on-attack"){
            return pick([
                `${s.blade} is an attack blade on ${s.bit}, so it might sit still longer than you'd like.`,
                `${s.blade} with ${s.bit} is smash metal on tank feet.`,
                `Don't expect ${s.blade} to fly at the rail — that ${s.bit} wants to hold.`
            ]);
        }
        if(m==="rush-on-tank"){
            return pick([
                `${s.blade} is a tank blade on ${s.bit} — a runner in a heavy coat.`,
                `${s.bit} under ${s.blade} can get greedy.`,
                `${s.whoCap} put speed under ${s.blade}, for better or worse.`
            ]);
        }
        return pick([
            `${s.blade} on ${s.bit} is a mixed bag.`,
            `${s.blade} isn't shouting a plan — the first clash will.`
        ]);
    }

    function colorLine(s){
        const extra=[];
        if(s.mod){
            extra.push(`${s.blade} is running ${s.mod.name}. Watch for that once they rip.`);
            extra.push(`${s.whoCap} tagged ${s.blade} with ${s.mod.name}. That's the extra.`);
        }
        if(s.upgrades&&s.upgrades.length){
            const u=s.upgrades[0];
            extra.push(`${s.whoCap} brought ${u.title} in with ${s.blade}.`);
            extra.push(`${s.blade} isn't stock — ${u.title} is riding along.`);
        }
        if(s.tier==="gold"){
            extra.push(`${s.blade} is gold hardware the room already knows.`);
        }
        if(extra.length&&Math.random()<0.35) return pick(extra);
        return jobOf(s);
    }

    function matchupLine(p,c){
        if(p.blade===c.blade){
            return pick([
                `Same blade twice — ${p.blade} vs ${p.blade} — so the bits decide it.`,
                `Mirror match: twin ${p.blade}s, and somebody blinks first.`
            ]);
        }
        if(p.attackBit&&c.tankBit){
            return pick([
                `${p.blade} wants this over quick; ${c.blade} wants to still be spinning.`,
                `Player smash, CPU stall — oldest fight in the book.`,
                `${p.blade} hunts holes while ${c.blade} tries not to fall in one.`
            ]);
        }
        if(c.attackBit&&p.tankBit){
            return pick([
                `${c.blade} is the aggressor and ${p.blade} is the wall.`,
                `CPU came to punch; the player came to make those punches expensive.`,
                `${p.blade} holds, ${c.blade} charges.`
            ]);
        }
        if(p.attackBit&&c.attackBit){
            return pick([
                `Two attack bits — first contact might end a Bey.`,
                `${p.blade} and ${c.blade} both brought speed.`,
                `Nobody's here to grind; this is a collision sport tonight.`
            ]);
        }
        if(p.tankBit&&c.tankBit){
            return pick([
                `Two tanks, so this might go late unless somebody finds a hole anyway.`,
                `${p.blade} vs ${c.blade}, both planted.`,
                `Patience match until one shove wakes the room up.`
            ]);
        }
        return pick([
            `${p.blade} and ${c.blade} want different nights, same first-to-seven.`,
            `Different jobs: ${p.blade} vs ${c.blade}.`
        ]);
    }

    function winnerCall(p,c){
        const lean=(p.ovr-c.ovr)+((p.meta-c.meta)*0.35);
        const upset=Math.random()<0.18;
        let fav,dog,margin;
        if(Math.abs(lean)<3.5){
            return pick([
                `Toss-up — better launch wins the argument.`,
                `I wouldn't pick a side with a straight face.`,
                `Even on the plates; first clash is the real intro.`
            ]);
        }
        if(lean>0){fav=p;dog=c;margin=lean;}
        else{fav=c;dog=p;margin=-lean;}
        if(upset){
            return pick([
                `I'll take ${dog.blade} anyway — favorites blink.`,
                `Upset lean: ${dog.blade}.`,
                `${dog.blade} looks live if ${fav.blade} misses once.`
            ]);
        }
        if(margin>=10){
            return pick([
                `Nod to ${fav.blade}; ${dog.blade} has to steal it.`,
                `${fav.blade} is the pick, and ${dog.blade} needs a messy point.`,
                `I'm with ${fav.blade} until they prove me wrong.`
            ]);
        }
        return pick([
            `Slight edge ${fav.blade} — a bad rip still ruins that.`,
            `Hair toward ${fav.blade}, close enough to get weird.`,
            `Give me ${fav.blade} in a fight, not a sweep.`
        ]);
    }

    function buildCopy(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate){
        const p=snapshot(player,playerCombo,playerPlate,"player");
        const c=snapshot(cpu,cpuCombo,cpuPlate,"cpu");
        const intro=pick(INTROS);
        const body=Math.random()<0.55?matchupLine(p,c):colorLine(Math.random()<0.5?p:c);
        const beats=[intro,body];
        if(Math.random()<0.82) beats.push(winnerCall(p,c));
        lastPregame={p,c,call:beats[beats.length-1],at:Date.now()};
        return beats.join(" ");
    }

    function renderHTML(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate){
        const copy=buildCopy(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate);
        return `<aside class="vs-call" aria-live="polite">
            <div class="vs-call-kicker"><span>LIVE</span> COMMENTARY</div>
            <p class="vs-call-copy">${escapeHtml(copy)}</p>
        </aside>`;
    }

    /* ---------- live battle booth ---------- */

    let lastPregame=null;
    let liveCtx={score:{player:0,cpu:0},round:0,active:false,elapsed:0,lastImpact:null,player:null,cpu:null};
    const recent=[];
    const booth={
        line:"",
        holdUntil:0,
        priority:0,
        kind:"",
        setupKey:"",
        live:false,
        impactStamp:0,
        recoveryStamp:0,
        rail:{player:false,cpu:false},
        exitNoted:{player:0,cpu:0},
        predicted:false,
        lastFinish:null
    };

    function pickFresh(list){
        const pool=list.filter(s=>s&&!recent.includes(s));
        const line=pick(pool.length?pool:list);
        if(!line) return "";
        recent.push(line);
        if(recent.length>10) recent.shift();
        return line;
    }
    function bladeOf(s){return s?.blade?.name||"that Bey";}
    function qualityOf(s){return s?.launchQuality||s?.launchPlan?.quality||"";}
    function scorePair(){
        const sc=liveCtx.score||{player:0,cpu:0};
        return {player:Number(sc.player)||0,cpu:Number(sc.cpu)||0};
    }
    function isColdOpen(){
        const s=scorePair();
        return s.player+s.cpu===0;
    }
    function recentExit(s,now){
        if(!s||s.railEngaged) return false;
        if(s.lastXRailExitReason!=="x-exit") return false;
        const at=Number(s.railExitAt)||0;
        return at>0&&(now-at)<=1100;
    }
    function say(text,priority,hold,kind,now){
        if(!text) return;
        booth.line=text;
        booth.priority=priority;
        booth.holdUntil=(now||0)+hold;
        booth.kind=kind;
    }
    function paint(){
        const copy=typeof document!=="undefined"?document.getElementById("newCommentaryCopy"):null;
        if(copy&&copy.textContent!==booth.line) copy.textContent=booth.line;
    }

    function techName(t){
        if(t==="Direct Clash") return "clash";
        if(t==="Drop Launch") return "drop";
        if(t==="X-Rail") return "rail";
        return "center";
    }

    function setupCopy(){
        const sc=scorePair();
        const pName=lastPregame?.p?.blade||bladeOf(liveCtx.player);
        const cName=lastPregame?.c?.blade||bladeOf(liveCtx.cpu);
        const fin=booth.lastFinish;
        if(sc.player>=7||sc.cpu>=7){
            const w=sc.player>=7?pName:cName;
            return pickFresh([
                `That's seven. ${w} closes it.`,
                `Match. ${w} got there first.`,
                `Ballgame. ${w} takes it.`
            ]);
        }
        if(isColdOpen()){
            return pickFresh([
                `0–0. First rip of the night.`,
                `Empty board. ${pName} vs ${cName}. Let it rip.`,
                `Cold open. First launch writes the intro.`,
                `Nobody's scored. Pad's yours.`,
                `Scoreboard's quiet. Rip something.`
            ]);
        }
        const lead=sc.player-sc.cpu;
        const tied=lead===0;
        const abs=Math.abs(lead);
        const leader=lead>0?pName:cName;
        const trailer=lead>0?cName:pName;
        const series=[];
        if(fin){
            const how=fin.type==="Xtreme"?"Xtreme":fin.type==="Over"?"Over":"spin";
            series.push(
                `${how} for ${fin.winner}. We're ${sc.player}–${sc.cpu}. Next rip.`,
                `${fin.winner} just took a ${how}. ${sc.player}–${sc.cpu}.`,
                `${fin.loser} ate that ${how}. Board's ${sc.player}–${sc.cpu}.`
            );
        }
        if(tied){
            series.push(
                `Tied ${sc.player}–${sc.cpu}. New fight.`,
                `${sc.player} apiece. Don't get cute.`,
                `Knotted up. First to seven still doesn't care.`
            );
        }else if(abs>=5){
            series.push(
                `${leader} is running at ${sc.player}–${sc.cpu}. ${trailer} needs a hole.`,
                `Gap. ${sc.player}–${sc.cpu}. ${trailer} has to make a mess.`
            );
        }else if(Math.max(sc.player,sc.cpu)>=6){
            series.push(
                `Game point feel. ${sc.player}–${sc.cpu}.`,
                `${leader} is one away. ${trailer} is one save from staying alive.`
            );
        }else{
            series.push(
                `${sc.player}–${sc.cpu}. ${leader} leads.`,
                `Board says ${sc.player}–${sc.cpu}. Same Beys, new rip.`,
                `${leader} up. Not safe. Launch like seven still costs.`
            );
        }
        return pickFresh(series);
    }

    function openingLiveCopy(p,c){
        const pb=bladeOf(p), cb=bladeOf(c);
        const pt=p?.launchPlan?.technique||"Center";
        const ct=c?.launchPlan?.technique||"Center";
        const pq=qualityOf(p), cq=qualityOf(c);
        const lines=[];
        if(pq==="Perfect"&&cq==="Perfect"){
            lines.push(
                `Two Perfects. ${pb} and ${cb} both meant that.`,
                `Clean rips both ways. No excuses on the way in.`
            );
        }else if(pq==="Perfect"){
            lines.push(
                `Perfect from ${pb}. That's the one you wanted.`,
                `${pb} rips Perfect. ${cb} has to answer in the bowl.`
            );
        }else if(cq==="Perfect"){
            lines.push(
                `CPU Perfect on ${cb}. They didn't come in shy.`,
                `${cb} nails the rip. ${pb} still has to fight.`
            );
        }else if(pq==="Horrible"&&cq==="Horrible"){
            lines.push(
                `Two Horribles. This point's already a dare.`,
                `Both rips are a mess. Survive first, style later.`
            );
        }else if(pq==="Horrible"){
            lines.push(
                `Horrible from ${pb}. That's a dare.`,
                `${pb} sprayed it. Now they have to live with it.`
            );
        }else if(cq==="Horrible"){
            lines.push(
                `${cb}'s rip is a mess. If they live, I'll clap.`,
                `CPU Horrible on ${cb}. Gift, if ${pb} can take it.`
            );
        }
        if(pt===ct){
            const t=techName(pt);
            lines.push(
                `Both on ${t}. ${pb} and ${cb} picked the same fight.`,
                `Mirror launch: ${t} vs ${t}. First contact's coming.`
            );
            if(pt==="Direct Clash"){
                lines.push(`${pb} and ${cb} are going straight at each other.`);
            }
            if(pt==="X-Rail"){
                lines.push(`Both grabbed the rail. Race is on.`);
            }
            if(pt==="Drop Launch"){
                lines.push(`Double drop. Straight shots through the middle.`);
            }
        }else{
            lines.push(
                `${pb} ${techName(pt)}, ${cb} ${techName(ct)}. Different ideas, same point.`,
                `${pb} goes ${techName(pt)}. ${cb} answers ${techName(ct)}.`
            );
            if(pt==="Direct Clash"){
                lines.push(`${pb} picked a fight on the way in. ${cb} ${techName(ct)}s.`);
            }
            if(pt==="Drop Launch"){
                lines.push(`${pb} hangs and drops. ${cb} came in ${techName(ct)}.`);
            }
            if(pt==="X-Rail"){
                lines.push(`${pb} takes the rail out of the gate. ${cb} is ${techName(ct)}.`);
            }
            if(pt==="Center"){
                lines.push(`${pb} plants center. ${cb} went ${techName(ct)}.`);
            }
        }
        return pickFresh(lines);
    }

    function impactLine(p,c,imp,offRail){
        const pb=bladeOf(p), cb=bladeOf(c);
        if(offRail){
            return pickFresh([
                `Off the X-Exit into a clash. That one had extra.`,
                `${pb} and ${cb} meet coming off the ring.`,
                `Rail swing, then contact. That's the fun one.`
            ]);
        }
        if(imp.impactClass==="heavy"){
            return pickFresh([
                `Heavy clash. ${pb} and ${cb} both felt that.`,
                `Boom. That's a real hit.`,
                `${pb} walks into ${cb}. Neither liked it.`,
                `There it is. Honest contact.`
            ]);
        }
        return pickFresh([
            `They clip. Still in it.`,
            `${pb} finds ${cb}. Not a finish — yet.`,
            `Contact in the bowl.`,
            `Poke, not a knockout.`
        ]);
    }

    function railLine(s){
        const b=bladeOf(s);
        return pickFresh([
            `${b} hooks the X-Rail.`,
            `${b} is on the ring. Watch the exit.`,
            `Rail ride, ${b}.`,
            `${b} caught the X-Rail.`
        ]);
    }

    function exitLine(s){
        const b=bladeOf(s);
        return pickFresh([
            `${b} dumps off the X-Exit into the middle.`,
            `X-Exit, ${b}. Shot's coming in.`,
            `${b} leaves the rail. Speed still on it.`
        ]);
    }

    function recoveryLine(s){
        const b=bladeOf(s);
        return pickFresh([
            `${b} climbs out! That's a save.`,
            `RECOVERED. ${b} looked gone.`,
            `${b} refuses the pocket.`,
            `They don't stay down. ${b} is back.`
        ]);
    }

    function predictLine(p,c){
        const ahead=p.rpm>=c.rpm?p:c;
        const behind=ahead===p?c:p;
        const ab=bladeOf(ahead), bb=bladeOf(behind);
        return pickFresh([
            `${ab} has more spin left. ${bb} is fading.`,
            `If this ends now, it's ${ab}.`,
            `${bb} needs a hole, not another lap.`,
            `Late read: ${ab} unless somebody finds Over.`
        ]);
    }

    function finishCopy(winner,loser,type,matchOver,playerScore,cpuScore){
        const w=bladeOf(winner), l=bladeOf(loser);
        const xtreme=type==="Xtreme", over=type==="Over";
        const lines=xtreme?[
            `Xtreme! ${l} through the middle. ${w} takes three.`,
            `${l} falls in the Xtreme. That's the big one for ${w}.`,
            `Center hole. ${w} just punched the board.`
        ]:over?[
            `Over. ${w} puts ${l} out the side for two.`,
            `${l} can't hold the bowl. Over for ${w}.`,
            `Side pocket. Two for ${w}.`
        ]:[
            `Spin finish. ${w} outlasts ${l}. One point.`,
            `${l} dies first. ${w} is still humming.`,
            `${w} wins the grind.`
        ];
        let text=pickFresh(lines);
        if(matchOver){
            text+=" "+pickFresh([
                `That's the match. ${w} got to seven.`,
                `Ballgame. ${w} closes it ${playerScore}–${cpuScore}.`,
                `${w} just ended the night.`
            ]);
        }
        return text;
    }

    function resetMatch(){
        booth.line="";
        booth.holdUntil=0;
        booth.priority=0;
        booth.kind="";
        booth.setupKey="";
        booth.live=false;
        booth.impactStamp=0;
        booth.recoveryStamp=0;
        booth.rail={player:false,cpu:false};
        booth.exitNoted={player:0,cpu:0};
        booth.predicted=false;
        booth.lastFinish=null;
        recent.length=0;
    }

    function ensureSetupLine(){
        const sc=scorePair();
        const key=`setup:${sc.player}:${sc.cpu}:${liveCtx.round||0}`;
        if(booth.setupKey!==key){
            booth.setupKey=key;
            booth.live=false;
            booth.predicted=false;
            booth.rail={player:false,cpu:false};
            booth.line=setupCopy();
            booth.kind="setup";
            booth.priority=40;
            booth.holdUntil=Infinity;
        }
        return booth.line;
    }

    function beginLive(p,c,now){
        const t=now||(typeof performance!=="undefined"?performance.now():Date.now());
        booth.live=true;
        booth.setupKey="";
        booth.predicted=false;
        booth.rail={player:false,cpu:false};
        booth.exitNoted={player:0,cpu:0};
        booth.impactStamp=0;
        booth.recoveryStamp=0;
        const copy=openingLiveCopy(p,c);
        say(copy,90,2800,"opening",t);
        paint();
        return booth.line;
    }

    function adoptCtx(info){
        if(!info) return;
        if(info.score) liveCtx.score=info.score;
        if(info.round!=null) liveCtx.round=info.round;
        if(info.active!=null) liveCtx.active=!!info.active;
        if(info.elapsed!=null) liveCtx.elapsed=info.elapsed;
        if("lastImpact" in info) liveCtx.lastImpact=info.lastImpact;
        if(info.player) liveCtx.player=info.player;
        if(info.cpu) liveCtx.cpu=info.cpu;
    }

    function battleHudMarkup(info){
        adoptCtx(info);
        if(!liveCtx.active) ensureSetupLine();
        else if(!booth.live||!booth.line) beginLive(liveCtx.player,liveCtx.cpu);
        return `<aside class="battle-callout" id="newCommentary" aria-live="polite">
            <div class="vs-call-kicker"><span>LIVE</span> COMMENTARY</div>
            <p class="battle-callout-copy" id="newCommentaryCopy">${escapeHtml(booth.line||"")}</p>
        </aside>`;
    }

    function consider(p,c,now){
        if((p.recoveredFlashUntil||0)>now||(c.recoveredFlashUntil||0)>now){
            const s=(p.recoveredFlashUntil||0)>=(c.recoveredFlashUntil||0)?p:c;
            const stamp=s.recoveredFlashUntil||0;
            if(stamp&&stamp!==booth.recoveryStamp){
                return {text:recoveryLine(s),priority:92,hold:2300,kind:"recovery",stamp:"recovery",apply:()=>{booth.recoveryStamp=stamp;}};
            }
        }
        const imp=liveCtx.lastImpact;
        if(imp&&imp.time&&imp.time!==booth.impactStamp){
            const off=recentExit(p,now)||recentExit(c,now);
            if(imp.impactClass==="light"&&!off){
                return {text:null,priority:0,hold:0,kind:"skip",stamp:"impact",apply:()=>{booth.impactStamp=imp.time;}};
            }
            return {
                text:impactLine(p,c,imp,off),
                priority:off||imp.impactClass==="heavy"?86:54,
                hold:off||imp.impactClass==="heavy"?1800:1300,
                kind:"impact",
                stamp:"impact",
                apply:()=>{booth.impactStamp=imp.time;}
            };
        }
        const riders=[["player",p],["cpu",c]];
        for(const [side,s] of riders){
            if(s.railEngaged&&!booth.rail[side]){
                return {text:railLine(s),priority:72,hold:1700,kind:"rail",stamp:"rail-"+side,apply:()=>{booth.rail[side]=true;}};
            }
            if(!s.railEngaged) booth.rail[side]=false;
            if(recentExit(s,now)){
                const at=Number(s.railExitAt)||0;
                if(at&&at!==booth.exitNoted[side]){
                    return {text:exitLine(s),priority:74,hold:1600,kind:"exit",stamp:"exit-"+side,apply:()=>{booth.exitNoted[side]=at;}};
                }
            }
        }
        const elapsed=Number(liveCtx.elapsed)||0;
        if(!booth.predicted&&elapsed>5.2){
            const gap=Math.abs((p.rpm||0)-(c.rpm||0));
            const tired=Math.min(p.rpm||0,c.rpm||0);
            if(tired<0.40&&gap>0.14){
                booth.predicted=true;
                if(Math.random()<0.62){
                    return {text:predictLine(p,c),priority:48,hold:2000,kind:"predict",stamp:"predict",apply:()=>{}};
                }
            }
        }
        return null;
    }

    function tickBattle(p,c,now,info){
        if(!p||!c) return;
        adoptCtx(info);
        const t=now||0;
        if(!liveCtx.active){
            paint();
            return;
        }
        const ev=consider(p,c,t);
        if(ev){
            if(ev.kind==="skip"){
                if(typeof ev.apply==="function") ev.apply();
            }else if(ev.text&&(t>=booth.holdUntil||ev.priority>=booth.priority)){
                if(typeof ev.apply==="function") ev.apply();
                say(ev.text,ev.priority,ev.hold,ev.kind,t);
            }
        }
        paint();
    }

    function onKillCam(victim,other,now){
        const b=bladeOf(victim);
        const o=bladeOf(other);
        const text=pickFresh([
            `Wait — ${b} is headed for a hole.`,
            `Slow it down. ${o} just sent ${b} packing.`,
            `Pocket look. Don't blink.`,
            `${b} is flying like it doesn't live here.`
        ]);
        say(text,96,900,"killcam",now||0);
        paint();
        return text;
    }

    function onFinish(winner,loser,type,matchOver,playerScore,cpuScore){
        booth.lastFinish={
            winner:bladeOf(winner),
            loser:bladeOf(loser),
            type:type||"Spin Finish"
        };
        booth.live=false;
        booth.setupKey="";
        const text=finishCopy(winner,loser,type,matchOver,playerScore,cpuScore);
        say(text,100,4000,"finish",typeof performance!=="undefined"?performance.now():0);
        paint();
        const el=typeof document!=="undefined"?document.getElementById("newCommentaryCopy"):null;
        if(el) el.textContent=text;
        else{
            const fallback=typeof document!=="undefined"?document.getElementById("newCommentary"):null;
            if(fallback) fallback.textContent=text;
        }
        return text;
    }

    global.SpinWarsVsCall={
        INTROS,buildCopy,renderHTML,escapeHtml,
        resetMatch,battleHudMarkup,beginLive,tickBattle,onFinish,onKillCam,ensureSetupLine
    };
})(typeof window!=="undefined"?window:globalThis);
