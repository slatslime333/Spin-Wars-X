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
    function scramble(list){
        const copy=list.slice();
        for(let i=copy.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const t=copy[i];copy[i]=copy[j];copy[j]=t;
        }
        return copy;
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
        const pLike=pick(likeLines(p));
        const pHate=pick(dislikeLines(p));
        const cLike=pick(likeLines(c));
        const cHate=pick(dislikeLines(c));
        const height=Math.random()<0.55?heightTake(Math.random()<0.5?p:c):"";
        const bits=scramble([
            pLike,
            Math.random()<0.72?pHate:"",
            cLike,
            Math.random()<0.72?cHate:"",
            height,
            matchupLine(p,c)
        ]).filter(Boolean);
        const takes=bits.slice(0,4);
        const call=winnerCall(p,c);
        return [intro,...takes,call].join(" ");
    }

    function renderHTML(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate){
        const copy=buildCopy(player,cpu,playerCombo,cpuCombo,playerPlate,cpuPlate);
        return `<aside class="vs-call" aria-live="polite">
            <div class="vs-call-kicker"><span>LIVE</span> COMMENTARY</div>
            <p class="vs-call-copy">${escapeHtml(copy)}</p>
        </aside>`;
    }

    global.SpinWarsVsCall={INTROS,buildCopy,renderHTML};
})(typeof window!=="undefined"?window:globalThis);
