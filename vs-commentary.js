/*==================================
 VS SCREEN COMMENTARY
 Sports-booth color for the combo plates.
==================================*/

(function(global){
    const INTROS=[
        "Welcome, ladies and gentlemen, for this exciting match.",
        "The stadium lights are up, the X-Rail is humming — we are live.",
        "Folks, settle in. This one has that first-to-seven smell already.",
        "Good evening from the bowl. Two builds walk in, only one walks out with seven.",
        "Here we go. Crowds on their feet, Beys on the plates — let's talk about what we're looking at."
    ];

    const STAT_TALK={
        attack:{hot:"attack",cold:"attack",punch:"that hit power"},
        knockback:{hot:"knock",cold:"knock",punch:"the shove on contact"},
        defense:{hot:"defense",cold:"defense",punch:"how it eats a clash"},
        mobility:{hot:"mobility",cold:"mobility",punch:"how quick it answers a launch"},
        balance:{hot:"balance",cold:"balance",punch:"how it holds its feet after a hit"},
        stamina:{hot:"stamina",cold:"stamina",punch:"the spin it can actually keep"}
    };

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
        const entries=["attack","knockback","defense","mobility","balance","stamina"].map(k=>({
            key:k,val:n(stats[k])
        }));
        entries.sort((a,b)=>b.val-a.val);
        const bitName=bit.name||"that bit";
        const bladeType=blade.type||"Balance";
        const bitType=bit.type||"Balance";
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
            bitType,
            attackBit:ATTACK_BITS.has(bitName),
            tankBit:TANK_BITS.has(bitName),
            ovr,
            meta,
            top:entries[0],
            second:entries[1],
            bottom:entries[entries.length-1],
            stats,
            fit:combo?.compatibility,
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

    function heightTake(s){
        if(s.height===80){
            return pick([
                `That ${s.ratchet} is standing tall — more bite, less forgiveness if it gets stood up.`,
                `They're on an 80 with the ${s.ratchet}. That's a statement. You either land the hit or you eat the wobble.`,
                `I like the nerve of the ${s.ratchet}. High ratchet, high drama.`
            ]);
        }
        if(s.height===70){
            return pick([
                `The ${s.ratchet} sits in that middle height — not hiding, not gambling the whole night on an 80.`,
                `${s.ratchet} is a compromise height. Some people call that smart. Some people call that scared. We'll see.`
            ]);
        }
        return pick([
            `${s.ratchet} keeps it low and planted. That's the "I plan to still be spinning" ratchet.`,
            `They're on ${s.ratchet}. Low, tight, not trying to win the beauty contest.`
        ]);
    }

    function likeLines(s){
        const lines=[];
        const talk=STAT_TALK[s.top.key]||STAT_TALK.attack;
        if(s.top.val>=82){
            lines.push(
                `Look at ${s.blade} — ${talk.punch} is sitting at ${s.top.val}. That's not a rumor, that's on the card.`,
                `I like ${s.blade} here. ${s.top.val} ${talk.hot}? That's the kind of number you build a night around.`,
                `${s.blade} brought ${talk.hot} and didn't apologize. ${s.top.val} is loud.`
            );
        }else if(s.top.val>=74){
            lines.push(
                `${s.blade} isn't a highlight-reel monster, but that ${talk.hot} at ${s.top.val} is honest.`,
                `There's a clean read on ${s.blade}: the ${talk.hot} is the part of the build that actually showed up.`
            );
        }
        const m=mismatch(s);
        if(m==="full-send"){
            lines.push(
                `${s.blade} on ${s.bit} — that's an attack blade that actually got an attack bit. Finally, someone who means it.`,
                `I love this ${s.bit} under ${s.blade}. They're not here to orbit politely. They're here to make a mess.`
            );
        }
        if(m==="pure-tank"){
            lines.push(
                `${s.blade} with ${s.bit} is the old-school read: sit in the bowl, keep spinning, make the other kid miss.`,
                `That's a tank that knows it's a tank. ${s.bit} under ${s.blade} — if this thing is still moving late, somebody's in trouble.`
            );
        }
        if(s.tier==="gold"){
            lines.push(
                `${s.blade} is gold-tier hardware. You don't bring that to a first-to-seven unless you want the room to notice.`,
                `Gold blade on the plate. ${s.blade} has that "we've seen this clip before" energy.`
            );
        }
        if(s.ovr>=88){
            lines.push(`${s.blade}'s sitting in the high eighties on OVR. On paper, that's a favorite walking in like it owns the rent.`);
        }
        if(s.mod){
            lines.push(`And they've got ${s.mod.name} hanging on the build. That's not flavor text — that's a different night.`);
        }
        if(s.upgrades&&s.upgrades.length){
            const u=s.upgrades[0];
            lines.push(`${s.whoCap}'s carrying ${u.title} into this. That's the kind of extra that shows up in the third or fourth point, not the first launch.`);
        }
        if(s.stats.stamina>=84){
            lines.push(`${s.blade} can actually stay alive. ${n(s.stats.stamina)} stamina — that's a Bey that makes you earn the finish.`);
        }
        if(s.stats.knockback>=84){
            lines.push(`The knock on ${s.blade} is real. ${n(s.stats.knockback)} — if they catch you clean, you're going for a walk.`);
        }
        if(!lines.length){
            lines.push(`There's a shape I like on ${s.blade}. Nothing gaudy, just a Bey that looks like it was put together on purpose.`);
        }
        return lines;
    }

    function dislikeLines(s){
        const lines=[];
        const talk=STAT_TALK[s.bottom.key]||STAT_TALK.stamina;
        if(s.bottom.val<=62){
            lines.push(
                `I'm not sold on the ${talk.cold} though. ${s.bottom.val} on ${s.blade} is the hole you hide until someone finds it.`,
                `Here's my problem with ${s.blade}: the ${talk.cold} is a ${s.bottom.val}. That's the part of the broadcast where I start frowning.`
            );
        }else if(s.bottom.val<=70){
            lines.push(
                `${s.blade} is leaving ${talk.cold} on the table at ${s.bottom.val}. Not a disaster. Not a flex either.`,
                `If I'm picking nits — and that's the job — ${s.blade}'s ${talk.cold} is the soft spot.`
            );
        }
        const m=mismatch(s);
        if(m==="tank-on-attack"){
            lines.push(
                `I do not love ${s.bit} under ${s.blade}. That's an attack blade they dressed like a librarian.`,
                `${s.blade} on ${s.bit}? That's a smash artist they asked to sit still. I get the idea. I don't have to like it.`
            );
        }
        if(m==="rush-on-tank"){
            lines.push(
                `${s.bit} on ${s.blade} is spicy in a way that can get you hurt. Tanks that sprint still have to stop.`,
                `Putting ${s.bit} under a ${s.bladeType.toLowerCase()} blade is a gamble. Either it's genius or it's a self-KO waiting for an invitation.`
            );
        }
        if(s.height===80&&s.tankBit){
            lines.push(`Tall ratchet, tank bit — ${s.blade} is asking the stadium to be polite. Stadiums are not polite.`);
        }
        if(s.ovr<=72){
            lines.push(`The OVR on ${s.blade} isn't scaring anybody. That's a "win the launches" Bey, not a "win the spreadsheet" Bey.`);
        }
        if(s.stats.defense<=60&&s.attackBit){
            lines.push(`${s.blade} is going to feel every clash. That defense number is not a shield, it's a suggestion.`);
        }
        if(!lines.length){
            lines.push(`It's not a perfect plate. ${s.blade} still has to prove it in the bowl, not on the graphic.`);
        }
        return lines;
    }

    function matchupLine(p,c){
        if(p.blade===c.blade){
            return pick([
                `Same blade on both sides. ${p.blade} versus ${p.blade}. That's a mirror and somebody's about to blink.`,
                `We've got twin ${p.blade}s. The parts under them are the whole story now.`
            ]);
        }
        if(p.attackBit&&c.tankBit){
            return pick([
                `Classic night: ${p.blade} wants to end this early, ${c.blade} wants to still be there when the gas runs out.`,
                `${p.whoCap} came to smash. ${c.whoCap} came to make them miss. That's the whole sport in one sentence.`
            ]);
        }
        if(c.attackBit&&p.tankBit){
            return pick([
                `${c.blade} is the dog that wants the rail. ${p.blade} is the wall. We'll find out if the wall holds.`,
                `CPU's looking to punch holes. The player's looking to make those punches expensive.`
            ]);
        }
        if(p.attackBit&&c.attackBit){
            return pick([
                `Two attack bits. Don't blink on the first contact — somebody's leaving through a painted hole or climbing out looking embarrassed.`,
                `This is not a stamina seminar. Both sides brought knives.`
            ]);
        }
        if(p.tankBit&&c.tankBit){
            return pick([
                `Two tanks. Late fight is going to look like two stubborn coins arguing in the middle of the bowl.`,
                `Nobody here is in a hurry. That's dangerous in its own way — first real knock still decides a lot.`
            ]);
        }
        return pick([
            `Different jobs, same stadium. ${p.blade} and ${c.blade} are not trying to win this the same way.`,
            `On paper it's a style fight. In the bowl it's still first to seven.`
        ]);
    }

    function winnerCall(p,c){
        const lean=(p.ovr-c.ovr)+((p.meta-c.meta)*0.35);
        const upset=Math.random()<0.18;
        let fav,dog,margin;
        if(Math.abs(lean)<3.5){
            return pick([
                `If you're asking me who wins? I'm not picking a side with a straight face. This is a coin in a hurricane.`,
                `Prediction? Toss-up. The better launch is going to look like genius and the worse one is going to look like a mistake.`,
                `I could talk myself into either Bey. That's usually when the night gets weird.`,
                `Call it even. Whoever misses the first real clash is buying dinner.`
            ]);
        }
        if(lean>0){fav=p;dog=c;margin=lean;}
        else{fav=c;dog=p;margin=-lean;}
        if(upset){
            return pick([
                `Everybody in the building is leaning ${fav.blade}. I'm not. ${dog.blade} has that "wrong on paper, right in the bowl" look.`,
                `I'll take the dog. ${dog.blade} against ${fav.blade} — if the favorite blinks once, this flips.`,
                `Upset watch: ${dog.who} on ${dog.blade}. Don't say I didn't tell you when the graphic looks silly.`
            ]);
        }
        if(margin>=10){
            return pick([
                `If I have to put a name on it, it's ${fav.blade}. ${dog.blade} has to steal this, not win it clean.`,
                `${fav.whoCap}'s ${fav.blade} is the pick. Not because the sport is fair — because the other plate has more holes.`,
                `I'm riding with ${fav.blade}. ${dog.blade} can make noise. I don't think it makes seven first.`
            ]);
        }
        return pick([
            `Slight nod to ${fav.blade}. It's close enough that a bad launch still ruins my prediction, and I accept that.`,
            `I'll take ${fav.who} by a hair. ${fav.blade} just looks a little more like a plan.`,
            `Edge: ${fav.blade}. ${dog.blade} is live if this turns into a scramble, but right now I'm not jumping off the favorite.`,
            `Give me ${fav.blade} in a fight, not a sweep. ${dog.blade} can absolutely make me eat this.`
        ]);
    }

    function buildCopy(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate){
        const p=snapshot(player,playerCombo,playerPlate,"player");
        const c=snapshot(cpu,cpuCombo,cpuPlate,"cpu");
        const intro=pick(INTROS);
        const playerTake=Math.random()<0.55?pick(likeLines(p)):pick(dislikeLines(p));
        const cpuTake=Math.random()<0.55?pick(likeLines(c)):pick(dislikeLines(c));
        const extra=Math.random()<0.5
            ?heightTake(Math.random()<0.5?p:c)
            :matchupLine(p,c);
        const call=winnerCall(p,c);
        lastPregame={p,c,call,at:Date.now()};
        return [intro,playerTake,cpuTake,extra,call].join(" ");
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

    function setupCopy(){
        const sc=scorePair();
        const pName=lastPregame?.p?.blade||bladeOf(liveCtx.player);
        const cName=lastPregame?.c?.blade||bladeOf(liveCtx.cpu);
        const fin=booth.lastFinish;
        if(sc.player>=7||sc.cpu>=7){
            const w=sc.player>=7?pName:cName;
            return pickFresh([
                `That's seven. ${w} closes it. Lights can come down whenever they want.`,
                `Match. ${w} got there first. Everything else was just the road.`
            ]);
        }
        if(isColdOpen()){
            return pickFresh([
                `First launch of the night. We're 0-0. Nothing's happened yet — this is still a theory until somebody rips.`,
                `0-0. Plates are done talking. Now we find out if ${pName} and ${cName} look like that in the bowl.`,
                `Nobody's scored. First to seven starts with a rip, not a graphic. Let's see who actually shows up.`,
                `Cold open. I already said my piece on the way in. Launch decides if I look smart or loud.`,
                `We're still at zero. Don't overthink the pad — the first contact is going to rewrite whatever I just said.`,
                lastPregame?.call
                    ? `0-0, first rip. For the record: ${lastPregame.call}`
                    : `First rip coming. Crowd's up, X-Rail's quiet, scoreboard's empty.`
            ]);
        }
        const lead=sc.player-sc.cpu;
        const tied=lead===0;
        const abs=Math.abs(lead);
        const leader=lead>0?pName:cName;
        const trailer=lead>0?cName:pName;
        const you=lead>0?"the player":"the CPU";
        const series=[];
        if(fin){
            const how=fin.type==="Xtreme"?"an Xtreme":fin.type==="Over"?"an Over":"a spin";
            const howCap=fin.type==="Xtreme"?"An Xtreme":fin.type==="Over"?"An Over":"A spin";
            series.push(
                `${fin.winner} just took ${how}. Score's ${sc.player}–${sc.cpu}. Next launch's the answer, not the recap.`,
                `That was ${how} for ${fin.winner}. ${fin.loser} has to come back out like it didn't rattle them.`,
                `${howCap} goes on the board and we're ${sc.player}–${sc.cpu}. Don't let the last point pick the next launch for you.`
            );
        }
        if(tied){
            series.push(
                `Tied ${sc.player}–${sc.cpu}. Reset your brain. This next rip is a new fight.`,
                `${sc.player} apiece. Room feels even. That's when somebody gets greedy on the pad.`,
                `We're knotted up. First to seven doesn't care that the last point was pretty.`
            );
        }else if(abs>=5){
            series.push(
                `${leader} is running away at ${sc.player}–${sc.cpu}. ${trailer} needs a messy point, not a polite one.`,
                `That's a gap. ${you} on ${leader} has ${sc.player}–${sc.cpu}. One more clean rip and this starts to look decided.`
            );
        }else if(Math.max(sc.player,sc.cpu)>=6){
            series.push(
                `Game point energy. ${sc.player}–${sc.cpu}. One launch from somebody hearing the building.`,
                `${leader} is a point away from putting this away. ${trailer} is a point away from making me eat a prediction.`
            );
        }else{
            series.push(
                `${sc.player}–${sc.cpu}. ${leader} has the room. ${trailer} has the next launch — that's the only thing that matters.`,
                `Scoreboard says ${sc.player}–${sc.cpu}. Same Beys, new rip. Don't fight the last point.`,
                `${leader} leads. Not a blowout. Not safe. Launch like you still have to earn seven.`
            );
        }
        return pickFresh(series);
    }

    function openingLiveCopy(p,c){
        const pb=bladeOf(p), cb=bladeOf(c);
        const pt=p?.launchPlan?.technique||"Center";
        const ct=c?.launchPlan?.technique||"Center";
        const pq=qualityOf(p), cq=qualityOf(c);
        const cold=isColdOpen();
        const qTalk=[];
        if(pq==="Perfect") qTalk.push(`That's a Perfect from ${pb}. Clean as it gets on the way in.`);
        if(pq==="Horrible") qTalk.push(`${pb} just ripped a Horrible. That's a dare.`);
        if(cq==="Perfect") qTalk.push(`CPU answers Perfect on ${cb}. They didn't come in shy.`);
        if(cq==="Horrible") qTalk.push(`${cb}'s launch is a mess. If they survive the first second, I'll be impressed.`);
        const tech={};
        tech["Direct Clash"]=pickFresh([
            `${pb} is going straight at somebody. Clash launch — no orbit, no manners.`,
            `${pb} picked a fight on the way in. Direct line. Somebody's going to feel the first one.`
        ]);
        tech["Drop Launch"]=pickFresh([
            `${pb} hangs and drops. That's the shot from up top — straight through the middle if they mean it.`,
            `Drop from ${pb}. They're not asking the rail for permission.`
        ]);
        tech["X-Rail"]=pickFresh([
            `${pb} takes the X-Rail on the rip. They want the ring before the conversation starts.`,
            `${pb} is on the rail out of the gate. Speed first, opinions later.`
        ]);
        tech["Center"]=pickFresh([
            `${pb} opens from center. Planted. Waiting to see who blinks.`,
            `Center launch, ${pb}. They're starting in the bowl, not on a highlight.`
        ]);
        const cpuTech={};
        cpuTech["Direct Clash"]=`${cb} is coming through the front door too.`;
        cpuTech["Drop Launch"]=`${cb} drops in from the other side.`;
        cpuTech["X-Rail"]=`${cb} grabbed the rail.`;
        cpuTech["Center"]=`${cb} sits center and waits.`;
        const head=cold
            ?pickFresh([
                `First rip. Nothing's happened yet — this is the handshake.`,
                `We're live. Score's still 0-0. First contact writes the rest.`,
                `Let it rip. Theory's over.`
            ])
            :pickFresh([
                `Next rip. Score's already on the board — this one still counts the same.`,
                `New launch, same match. Don't bring the last point in with you.`,
                `They're back on the line. Next point's open.`
            ]);
        const parts=[head,tech[pt]||tech.Center,cpuTech[ct]||cpuTech.Center];
        if(qTalk.length&&Math.random()<0.7) parts.push(pick(qTalk));
        if(cold&&lastPregame?.p?.blade===pb&&Math.random()<0.35){
            parts.push(pickFresh([
                `Remember, I already had a read on ${pb}. Bowl doesn't care.`,
                `This is where ${pb} proves the plate or makes me a liar.`
            ]));
        }
        return parts.filter(Boolean).join(" ");
    }

    function impactLine(p,c,imp,offRail){
        const pb=bladeOf(p), cb=bladeOf(c);
        if(offRail){
            return pickFresh([
                `${pb} and ${cb} meet coming off the ring. That's the swing I was waiting on.`,
                `Off the X-Exit and into a clash — that hit has extra on it.`,
                `They used the rail and then they used each other. That's the fun one.`
            ]);
        }
        if(imp.impactClass==="heavy"){
            return pickFresh([
                `That's a real one. ${pb} and ${cb} just paid rent.`,
                `Heavy contact. Somebody's going to remember that in the RPM.`,
                `Boom. That's not a graze — that's a statement.`,
                `${pb} walked into ${cb} and neither of them liked it. Good.`,
                `There it is. First honest clash of the point.`
            ]);
        }
        return pickFresh([
            `They clip. Not the finish, but the conversation started.`,
            `${pb} finds ${cb}. Light enough to stay in, hard enough to matter.`,
            `Contact in the bowl. They're not circling past each other anymore.`,
            `That's a poke, not a knockout. Still counts.`
        ]);
    }

    function railLine(s){
        const b=bladeOf(s);
        return pickFresh([
            `${b} hooks the X-Rail. Speed's about to get rude.`,
            `${b} is on the ring. Don't look away for the exit.`,
            `Rail ride, ${b}. That's the lap that turns into a problem.`,
            `${b} caught the X-Rail. Building a run.`
        ]);
    }

    function exitLine(s){
        const b=bladeOf(s);
        return pickFresh([
            `${b} dumps off the X-Exit toward the middle. That's a weapon if they still have legs.`,
            `X-Exit, ${b}. Shot's coming into the bowl, not out the back.`,
            `${b} leaves the rail. Now we see if that speed has a target.`
        ]);
    }

    function recoveryLine(s){
        const b=bladeOf(s);
        const pct=Math.round((Number(s.rpm)||0)*100);
        return pickFresh([
            `${b} climbs out! That's a save. Building's still loud.`,
            `RECOVERED. ${b} looked gone and then it wasn't.${pct?` Still got ${pct} on the meter.`:""}`,
            `${b} refuses the pocket. That's the kind of luck that feels like skill.`,
            `They don't stay down. ${b} is back in the bowl.`
        ]);
    }

    function predictLine(p,c){
        const ahead=p.rpm>=c.rpm?p:c;
        const behind=ahead===p?c:p;
        const ab=bladeOf(ahead), bb=bladeOf(behind);
        return pickFresh([
            `If this ends right now, it's ${ab}. ${bb} is running on fumes.`,
            `I'm calling it while they're still spinning: ${ab} unless somebody finds a hole.`,
            `${ab} looks like the point. ${bb} needs a miracle clash, not another lap.`,
            `Late read: ${ab} has more left. Don't quote me if they both die in a pocket.`
        ]);
    }

    function finishCopy(winner,loser,type,matchOver,playerScore,cpuScore){
        const w=bladeOf(winner), l=bladeOf(loser);
        const xtreme=type==="Xtreme", over=type==="Over";
        const lines=xtreme?[
            `${l} falls through the Xtreme! That's three. ${w} just punched the scoreboard.`,
            `XTREME. ${l} is gone. ${w} takes the big one.`,
            `That's the hole in the middle and ${l} found it the hard way. ${w} +3.`
        ]:over?[
            `${l} gets put in the Over. Two points, ${w}. That's a knock with manners.`,
            `OVER. ${w} sent ${l} packing out the side.`,
            `${l} couldn't hold the bowl. Over for ${w}.`
        ]:[
            `${w} outlasts ${l}. Spin finish. Ugly, honest, one point.`,
            `That's a spin. ${l} dies first. ${w} is still humming.`,
            `${w} wins the grind. Not pretty. Still on the board.`
        ];
        let text=pickFresh(lines);
        if(matchOver){
            text+=" "+pickFresh([
                `And that's the match. First to seven, and ${w} got there.`,
                `Ballgame. ${w} closes it ${playerScore}–${cpuScore}.`,
                `You can exhale. ${w} just ended the night.`
            ]);
        }else if(Math.random()<0.45){
            const sc=`${playerScore}–${cpuScore}`;
            text+=" "+pickFresh([
                `We're ${sc}. Next launch is going to tell on somebody.`,
                `Score's ${sc}. I wouldn't get comfortable.`,
                `${sc}. Room's still live.`
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
        resetMatch,battleHudMarkup,beginLive,tickBattle,onFinish,ensureSetupLine
    };
})(typeof window!=="undefined"?window:globalThis);
