/*==================================
 SPIN WARS X — ABILITIES + COMBAT DOCK
 Dash, match charges, exclusive channels, kits.
 Physics still uses the existing clash shove / RPM drain.
==================================*/
(function(global){
    const DASH_CD=5;
    const DASH_SHOVE=0.062;
    const ABILITY_USES=2;
    const SIMUL_MS=120;
    const KNOCK_CAP=0.086;
    const SWORD_R=0.36;
    const STORM_R=0.42;
    const QUAKE_R=0.40;
    const KITS={
        "Dran Sword":"ancient-sword",
        "Viper Tail":"ancient-sword",
        "Shark Edge":"ancient-sword",
        "Shark Scale":"ancient-sword",
        "Arrow Wizard":"hurricane",
        "Leon Claw":"hurricane",
        "Wizard Rod":"hurricane",
        "Shelter Drake":"hurricane",
        "Leon Crest":"iron-skin",
        "Knight Mail":"iron-skin",
        "Knight Shield":"iron-skin",
        "Silver Wolf":"free-spin",
        "Unicorn Sting":"double-edge",
        "Tyranno Beat":"earthquake",
        "Aero Pegasus":"pegasus-blast",
        "Phoenix Wing":"flame-trail"
    };
    const META={
        "ancient-sword":{
            name:"Ancient Sword", active:true,
            blurb:"Get close until the glow reaches them, then vanish and cut. If they are outside the ring, you miss — and still use a charge."
        },
        "hurricane":{
            name:"Hurricane", active:true,
            blurb:"Whip up a wind around you. You pick up a little spin and move quicker. Anyone who flies through the wind gets blown aside."
        },
        "iron-skin":{
            name:"Iron Skin", active:true,
            blurb:"Turn to metal for a few seconds. Hits bounce off and shove them harder. You still slow down over time, and falling in a hole still ends the point."
        },
        "free-spin":{
            name:"Free Spin", active:false,
            blurb:"Always on. Sometimes a hit barely moves you and takes no spin. FREE SPIN pops up when it happens."
        },
        "double-edge":{
            name:"Double Edge", active:false,
            blurb:"Always on. Each clash might hit them harder, sting you extra, or play out like a normal hit."
        },
        "earthquake":{
            name:"Earthquake", active:true,
            blurb:"Stomp the stadium. Cracks knock them outward and stop their slide. If they stay in the cracks, they lose spin."
        },
        "pegasus-blast":{
            name:"Pegasus Blast", active:true,
            blurb:"A beam lifts you off the stadium. Steer the marker onto them, then crash. Land it to take a chunk of their spin. Miss, and you lose some of yours."
        },
        "flame-trail":{
            name:"Flame Trail", active:true,
            blurb:"Leave a trail of fire and run faster. If they drive through the fire, they lose spin. Your own trail will not burn you."
        }
    };

    const state={
        charges:{player:ABILITY_USES,cpu:ABILITY_USES},
        dashAt:{player:0,cpu:0},
        pending:null,
        channel:null,
        cpuThink:0,
        popUntil:0,
        popText:"",
        flame:{player:[],cpu:[]},
        pegasus:null,
        swordGlow:true
    };

    function kitId(blade){
        const name=blade?.name||blade||"";
        return KITS[name]||null;
    }
    function kitMeta(id){return META[id]||null;}
    function other(side){return side==="player"?"cpu":"player";}
    function bey(side){return global.NEW_BATTLE?.[side];}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function nowMs(){return performance.now();}
    function battleLive(){
        return !!(global.NEW_BATTLE?.active && !global.Game?.battle?.finished);
    }
    function camHot(){
        const cam=global.NEW_BATTLE?.killCam;
        return !!(cam&&cam.active);
    }
    function dropStalling(s){
        return !!(s&&s.launchDropActive&&!s.launchDropReleased);
    }
    function blocked(s){
        if(!s||!battleLive()) return true;
        if(camHot()) return true;
        if(s.railEngaged) return true;
        if(dropStalling(s)) return true;
        if(s.rpm<=0.001) return true;
        if(s.abilityHold) return true;
        if(s.abilityHidden) return true;
        return false;
    }
    function worldToSvg(x,y){
        return {x:50+x*39,y:46+y*39};
    }
    function popup(text){
        state.popText=text;
        state.popUntil=nowMs()+900;
        const el=document.getElementById("abilityCallout");
        if(el){
            el.textContent=text;
            el.setAttribute("opacity","1");
        }
        const hud=document.getElementById("combatToast");
        if(hud) hud.textContent=text;
    }
    function popHit(victim,amount){
        const lost=Math.max(0,Number(amount)||0);
        if(!victim||lost<0.0005) return;
        const NB=global.NEW_BATTLE;
        if(!NB) return;
        const isPlayer=victim.side==="player"||victim===bey("player");
        NB.lastImpact={
            x:victim.x,
            y:victim.y,
            time:nowMs(),
            strength:0.9,
            impactClass:"light",
            playerRpmLoss:isPlayer?lost:0,
            cpuRpmLoss:isPlayer?0:lost,
            kb:0
        };
    }
    function channelBusy(){
        return !!(state.channel && state.channel.until>nowMs());
    }

    function emblemSVG(id,size){
        const s=size||24;
        const paths={
            "ancient-sword":`<path d="M12 3 L14 11 L21 12 L14 13 L12 21 L10 13 L3 12 L10 11 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "hurricane":`<path d="M12 4 C18 6 18 12 12 12 C6 12 7 18 12 20 C17 18 19 12 12 12" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "iron-skin":`<path d="M12 3 L19 6 V12 C19 17 12 21 12 21 C12 21 5 17 5 12 V6 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "free-spin":`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="7" r="1.6" fill="currentColor"/>`,
            "double-edge":`<path d="M7 19 L12 4 L17 19 M9 13 H15" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "earthquake":`<path d="M4 16 L8 10 L11 14 L14 8 L20 16 M3 19 H21" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "pegasus-blast":`<path d="M5 14 L12 5 L19 14 M12 5 V20 M8 10 C6 8 6 6 8 5" fill="none" stroke="currentColor" stroke-width="1.8"/>`,
            "flame-trail":`<path d="M12 20 C8 16 8 12 12 6 C16 12 17 16 12 20 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>`
        };
        return `<svg class="ability-emblem emblem-${id||"none"}" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true">${paths[id]||`<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>`}</svg>`;
    }

    function abilityChipHTML(blade,opts){
        opts=opts||{};
        const id=kitId(blade);
        const meta=kitMeta(id);
        if(!meta){
            return `<div class="ability-chip empty"><span>No ability</span></div>`;
        }
        const open=opts.open?" open":"";
        const tag=meta.active?"ACTIVE":"PASSIVE";
        return `<details class="swx-drop ability-drop"${open}>
            <summary><span class="swx-drop-mark">${emblemSVG(id,22)}</span><span class="swx-drop-title">${meta.name}</span><span class="swx-drop-tag">${tag}</span><span class="swx-drop-caret" aria-hidden="true">▾</span></summary>
            <p class="swx-drop-body">${meta.blurb}</p>
        </details>`;
    }

    function resetMatch(){
        state.charges={player:ABILITY_USES,cpu:ABILITY_USES};
        state.dashAt={player:0,cpu:0};
        state.pending=null;
        state.channel=null;
        state.flame={player:[],cpu:[]};
        state.pegasus=null;
        state.popUntil=0;
        state.cpuLastAbility=0;
        state.cpuThink=0;
        if(global.Game){
            global.Game.battle=global.Game.battle||{};
            global.Game.battle.abilityCharges={...state.charges};
        }
    }
    function resetRound(p,c){
        state.pending=null;
        state.channel=null;
        state.flame={player:[],cpu:[]};
        state.pegasus=null;
        [p,c].forEach(s=>{
            if(!s) return;
            s.abilityHold=false;
            s.abilityHidden=false;
            s.abilitySpeedMul=1;
            s.abilityIgnoreRpm=false;
            s.abilityRpmMul=1;
            s.ironSkinUntil=0;
            s.hurricaneUntil=0;
            s.flameUntil=0;
            s.quakeUntil=0;
            s.swordFreezeUntil=0;
            s.metallic=false;
            s.quakePulse=1;
        });
        hidePegasusStick();
    }

    function dashFill(side){
        const t=state.dashAt[side]||0;
        const left=t-nowMs();
        if(left<=0) return 1;
        return clamp(1-left/(DASH_CD*1000),0,1);
    }
    function abilityFill(side){
        const left=state.charges[side]||0;
        return left/ABILITY_USES;
    }

    function tryDash(side){
        const s=bey(side);
        if(!s||blocked(s)) return false;
        if((state.dashAt[side]||0)>nowMs()) return false;
        const sp=Math.hypot(s.vx,s.vy);
        if(sp<0.004) return false;
        const hx=s.vx/sp, hy=s.vy/sp;
        s.vx+=hx*DASH_SHOVE;
        s.vy+=hy*DASH_SHOVE;
        s.impactMomentumState=Math.max(s.impactMomentumState||0,0.42);
        s.dashGust={hx,hy,x:s.x,y:s.y,until:nowMs()+280};
        state.dashAt[side]=nowMs()+DASH_CD*1000;
        updateDock();
        return true;
    }

    function tryAbility(side){
        const s=bey(side);
        const id=kitId(s?.blade);
        const meta=kitMeta(id);
        if(!s||!meta) return false;
        if(!meta.active) return false;
        if((state.charges[side]||0)<=0) return false;
        if(blocked(s)) return false;
        if(s.swordFreezeUntil>nowMs()) return false;

        const t=nowMs();
        if(channelBusy()){
            popup("DENIED");
            return false;
        }
        const pend=state.pending;
        if(pend && pend.side!==side && (t-pend.t)<SIMUL_MS){
            state.pending=null;
            const winner=Math.random()<0.5?pend.side:side;
            popup("DENIED");
            fireAbility(winner);
            return true;
        }
        state.pending={side,t};
        setTimeout(()=>{
            if(state.pending && state.pending.side===side && state.pending.t===t){
                state.pending=null;
                fireAbility(side);
            }
        },SIMUL_MS);
        return true;
    }

    function spend(side){
        state.charges[side]=Math.max(0,(state.charges[side]||0)-1);
        if(global.Game?.battle) global.Game.battle.abilityCharges={...state.charges};
        updateDock();
    }

    function beginChannel(side,ms,kind){
        state.channel={side,kind,until:nowMs()+ms};
    }

    function fireAbility(side){
        const s=bey(side);
        const foe=bey(other(side));
        const id=kitId(s?.blade);
        if(!s||!foe||!id) return false;
        if(channelBusy()){ popup("DENIED"); return false; }
        if((state.charges[side]||0)<=0) return false;
        if(blocked(s) && id!=="pegasus-blast") return false;

        if(id==="ancient-sword") return startSword(side,s,foe);
        if(id==="hurricane") return startHurricane(side,s);
        if(id==="iron-skin") return startIron(side,s);
        if(id==="earthquake") return startQuake(side,s);
        if(id==="pegasus-blast") return startPegasus(side,s,foe);
        if(id==="flame-trail") return startFlame(side,s);
        return false;
    }

    function startSword(side,s,foe){
        spend(side);
        const d=Math.hypot(s.x-foe.x,s.y-foe.y);
        if(d>SWORD_R){
            popup("MISS");
            s.hitFlash=0.4;
            s.swordSmoke=nowMs()+500;
            return true;
        }
        const ang=Math.atan2(s.y-foe.y,s.x-foe.x);
        s.x=foe.x+Math.cos(ang)*0.02;
        s.y=foe.y+Math.sin(ang)*0.02;
        s.vx=0; s.vy=0;
        foe.vx=0; foe.vy=0;
        s.abilityHold=true;
        foe.abilityHold=true;
        foe.swordFreezeUntil=nowMs()+1700;
        s.swordFreezeUntil=nowMs()+1700;
        s.swordFrom={x:Math.cos(ang),y:Math.sin(ang)};
        s.swordHits=[];
        s.swordTick=0;
        s.swordSmoke=nowMs()+1700;
        beginChannel(side,1700,"ancient-sword");
        popup("ANCIENT SWORD");
        return true;
    }
    function startHurricane(side,s){
        spend(side);
        s.hurricaneUntil=nowMs()+2000;
        s.abilitySpeedMul=1.12;
        s.hurricaneRpm0=s.rpm;
        beginChannel(side,2000,"hurricane");
        popup("HURRICANE");
        return true;
    }
    function startIron(side,s){
        spend(side);
        s.ironSkinUntil=nowMs()+3000;
        s.metallic=true;
        beginChannel(side,3000,"iron-skin");
        popup("IRON SKIN");
        return true;
    }
    function startQuake(side,s){
        spend(side);
        s.quakeUntil=nowMs()+2000;
        s.quakeTick=0;
        beginChannel(side,2000,"earthquake");
        popup("EARTHQUAKE");
        return true;
    }
    function startFlame(side,s){
        spend(side);
        s.flameUntil=nowMs()+3000;
        s.abilitySpeedMul=1.15;
        state.flame[side]=[];
        s.flamePhase=0;
        beginChannel(side,3000,"flame-trail");
        popup("FLAME TRAIL");
        return true;
    }
    function startPegasus(side,s,foe){
        spend(side);
        s.abilityHold=true;
        s.abilityHidden=true;
        s.vx=0; s.vy=0;
        beginChannel(side,5000,"pegasus-blast");
        const away=Math.atan2(s.y-foe.y,s.x-foe.x)+ (Math.random()-0.5)*1.2;
        const dist=0.42+Math.random()*0.22;
        state.pegasus={
            side,
            phase:"lift",
            liftUntil:nowMs()+2000,
            aimUntil:0,
            aim:{x:clamp(foe.x+Math.cos(away)*dist,-0.72,0.72), y:clamp(foe.y+Math.sin(away)*dist,-0.62,0.72)},
            stick:{x:0,y:0},
            drift:{x:(Math.random()-0.5)*0.12,y:(Math.random()-0.5)*0.12}
        };
        popup("PEGASUS BLAST");
        return true;
    }

    function applyShove(target,dx,dy,mag){
        const len=Math.hypot(dx,dy)||1;
        const m=Math.min(KNOCK_CAP, mag);
        target.vx+= (dx/len)*m;
        target.vy+= (dy/len)*m;
        target.lastImpactForce=m;
        target.lastImpactAt=nowMs();
        target.impactMomentumState=Math.max(target.impactMomentumState||0, clamp(m/0.090,0.14,0.62));
    }

    function onClashKnock(p,c,knocks){
        let pKnock=knocks.pKnockback;
        let cKnock=knocks.cKnockback;
        let pIgnore=false, cIgnore=false;
        let pMul=1, cMul=1;
        const t=nowMs();
        const pIron=p.ironSkinUntil>t;
        const cIron=c.ironSkinUntil>t;
        const pKit=kitId(p.blade);
        const cKit=kitId(c.blade);

        if(pKit==="free-spin" && Math.random()<0.10){
            cKnock*=0.80;
            pIgnore=true;
            popup("FREE SPIN");
        }
        if(cKit==="free-spin" && Math.random()<0.10){
            pKnock*=0.80;
            cIgnore=true;
            popup("FREE SPIN");
        }

        if(pKit==="double-edge"){
            const roll=Math.random();
            if(roll<1/3){
                pKnock*=1.20;
                popup("DOUBLE EDGE");
            }else if(roll<2/3){
                pMul=1.15;
                popup("DOUBLE EDGE");
            }
        }
        if(cKit==="double-edge"){
            const roll=Math.random();
            if(roll<1/3){
                cKnock*=1.20;
                popup("DOUBLE EDGE");
            }else if(roll<2/3){
                cMul=1.15;
                popup("DOUBLE EDGE");
            }
        }

        let pSmashCap=false, cSmashCap=false;
        if(pIron){
            const reflected=Math.min(KNOCK_CAP, cKnock*1.20);
            pIgnore=true;
            cKnock=0;
            pKnock=Math.min(KNOCK_CAP, Math.max(pKnock, reflected));
            cSmashCap=true;
        }
        if(cIron){
            const reflected=Math.min(KNOCK_CAP, pKnock*1.20);
            cIgnore=true;
            pKnock=0;
            cKnock=Math.min(KNOCK_CAP, Math.max(cKnock, reflected));
            pSmashCap=true;
        }

        p.abilityIgnoreRpm=pIgnore;
        c.abilityIgnoreRpm=cIgnore;
        p.abilityRpmMul=pMul;
        c.abilityRpmMul=cMul;
        return {
            pKnockback:Math.min(KNOCK_CAP,pKnock),
            cKnockback:Math.min(KNOCK_CAP,cKnock),
            pSmashCap,cSmashCap
        };
    }

    function skipClash(p,c){
        if(p?.abilityHold || c?.abilityHold) return true;
        if(p?.abilityHidden || c?.abilityHidden) return true;
        if((p?.swordFreezeUntil||0)>nowMs() || (c?.swordFreezeUntil||0)>nowMs()) return true;
        const ch=state.channel;
        if(ch && (ch.kind==="ancient-sword"||ch.kind==="pegasus-blast") && ch.until>nowMs()) return true;
        return false;
    }
    function holdPhysics(s){
        if(!s) return false;
        if(s.abilityHold || s.abilityHidden) return true;
        if((s.swordFreezeUntil||0)>nowMs()) return true;
        return false;
    }

    function step(dt,p,c){
        const t=nowMs();
        if(state.channel && state.channel.until<=t){
            const kind=state.channel.kind;
            const side=state.channel.side;
            state.channel=null;
            if(kind==="hurricane"){
                const s=bey(side);
                if(s) s.abilitySpeedMul=1;
            }
            if(kind==="flame-trail"){
                const s=bey(side);
                if(s) s.abilitySpeedMul=1;
            }
            if(kind==="iron-skin"){
                const s=bey(side);
                if(s) s.metallic=false;
            }
        }

        stepSword(dt,p,c,t);
        stepHurricane(dt,p,c,t);
        stepQuake(dt,p,c,t);
        stepFlame(dt,p,c,t);
        stepPegasus(dt,p,c,t);
        maybeCpu(dt,p,c,t);
        paintFx(p,c,t);
        updateDock();
        const call=document.getElementById("abilityCallout");
        if(call && t>state.popUntil) call.setAttribute("opacity","0");
    }

    function stepSword(dt,p,c,t){
        const ch=state.channel;
        if(!ch || ch.kind!=="ancient-sword") return;
        const atk=bey(ch.side);
        const def=bey(other(ch.side));
        if(!atk||!def) return;
        atk.abilityHold=true;
        def.abilityHold=true;
        atk.vx=0; atk.vy=0; def.vx=0; def.vy=0;
        atk.x=def.x+(atk.swordFrom?.x||1)*0.018;
        atk.y=def.y+(atk.swordFrom?.y||0)*0.018;
        atk.swordTick=(atk.swordTick||0)+dt;
        atk.ninjaFlick=Math.sin(t/40)>0 ? 1 : 0.15;
        if(atk.swordTick>=0.5 && (atk.swordHits||[]).length<4){
            atk.swordTick-=0.5;
            const kb=0.35+Math.random()*0.15;
            const rpm=0.010+Math.random()*0.010;
            atk.swordHits=atk.swordHits||[];
            atk.swordHits.push(kb);
            def.rpm=clamp(def.rpm-rpm,0,1);
            popHit(def,rpm);
        }
        if(t>=ch.until-16){
            const avg=(atk.swordHits||[0.4]).reduce((a,b)=>a+b,0)/Math.max(1,(atk.swordHits||[]).length);
            const mag=Math.min(KNOCK_CAP, 0.086*avg);
            const ox=-(atk.swordFrom?.x||1);
            const oy=-(atk.swordFrom?.y||0);
            applyShove(def, ox, oy, mag);
            applyShove(atk, atk.swordFrom?.x||1, atk.swordFrom?.y||0, mag*0.4);
            atk.abilityHold=false;
            def.abilityHold=false;
            atk.ninjaFlick=1;
            atk.swordFreezeUntil=0;
            def.swordFreezeUntil=0;
        }
    }

    function stepHurricane(dt,p,c,t){
        [p,c].forEach(s=>{
            if(!s || s.hurricaneUntil<=t) return;
            const span=2000;
            const left=s.hurricaneUntil-t;
            const gained=(s.hurricaneRpm0||s.rpm)*0.15*(dt/(span/1000));
            s.rpm=clamp(s.rpm+gained,0,1);
            const foe=s===p?c:p;
            if(!foe) return;
            const d=Math.hypot(s.x-foe.x,s.y-foe.y);
            if(d<STORM_R && d>1e-4){
                const nx=(foe.x-s.x)/d, ny=(foe.y-s.y)/d;
                if(!foe.stormHit){
                    applyShove(foe,nx,ny,0.022);
                    foe.stormHit=true;
                }
                foe.vx+=nx*0.00032;
                foe.vy+=ny*0.00032;
            }else if(foe){
                foe.stormHit=false;
            }
        });
    }

    function stepQuake(dt,p,c,t){
        [p,c].forEach(s=>{
            if(!s || s.quakeUntil<=t){
                if(s) s.quakePulse=1;
                return;
            }
            s.quakePulse=1+0.18*Math.abs(Math.sin(t/90));
            s.quakeTick=(s.quakeTick||0)+dt;
            const foe=s===p?c:p;
            if(!foe) return;
            const d=Math.hypot(s.x-foe.x,s.y-foe.y);
            if(s.quakeTick>=0.5){
                s.quakeTick-=0.5;
                if(d<QUAKE_R){
                    const chip=0.010+Math.random()*0.010;
                    foe.rpm=clamp(foe.rpm-chip,0,1);
                    popHit(foe,chip);
                    const nx=d>1e-4?(foe.x-s.x)/d:1;
                    const ny=d>1e-4?(foe.y-s.y)/d:0;
                    const sp=Math.hypot(foe.vx,foe.vy);
                    if(sp>1e-6){ foe.vx*=0.18; foe.vy*=0.18; }
                    applyShove(foe,nx,ny,0.028);
                }
            }
        });
    }

    function stepFlame(dt,p,c,t){
        ["player","cpu"].forEach(side=>{
            const s=bey(side);
            const trail=state.flame[side];
            if(!s) return;
            if(s.flameUntil>t){
                trail.push({x:s.x,y:s.y,t});
                while(trail.length && t-trail[0].t>900) trail.shift();
            }else if(trail.length){
                while(trail.length && t-trail[0].t>900) trail.shift();
            }
            const foe=bey(other(side));
            if(!foe || s.flameUntil<=t) return;
            let hit=false;
            for(const pt of trail){
                if(t-pt.t<80) continue;
                if(Math.hypot(foe.x-pt.x,foe.y-pt.y)<s.radius*0.92){ hit=true; break; }
            }
            if(!hit) return;
            foe.flameTouch=(foe.flameTouch||0)+dt;
            if((foe.flamePhase||0)<1){
                foe.flameAcc=(foe.flameAcc||0)+dt;
                if(foe.flameAcc>=0.3){
                    foe.flameAcc=0;
                    foe.rpm=clamp(foe.rpm-0.008,0,1);
                    popHit(foe,0.008);
                    foe.flameHits=(foe.flameHits||0)+1;
                    if(foe.flameHits>=1) foe.flamePhase=1;
                }
            }else{
                foe.flameAcc=(foe.flameAcc||0)+dt;
                if(foe.flameAcc>=0.5){
                    foe.flameAcc=0;
                    const burn=0.016+Math.random()*0.008;
                    foe.rpm=clamp(foe.rpm-burn,0,1);
                    popHit(foe,burn);
                }
            }
        });
    }

    function stepPegasus(dt,p,c,t){
        const pg=state.pegasus;
        if(!pg) return;
        const s=bey(pg.side);
        const foe=bey(other(pg.side));
        if(!s||!foe){ state.pegasus=null; return; }
        if(pg.phase==="lift"){
            s.abilityHidden=true;
            s.abilityHold=true;
            s.vx=0; s.vy=0;
            if(t>=pg.liftUntil){
                pg.phase="aim";
                pg.aimUntil=t+3000;
                showPegasusStick(pg);
            }
            return;
        }
        if(pg.phase==="aim"){
            const st=pg.stick||{x:0,y:0};
            const keys=state.keys||{x:0,y:0};
            const ix=clamp(st.x+keys.x,-1,1);
            const iy=clamp(st.y+keys.y,-1,1);
            pg.aim.x=clamp(pg.aim.x+ix*0.70*dt+pg.drift.x*dt,-0.78,0.78);
            pg.aim.y=clamp(pg.aim.y+iy*0.70*dt+pg.drift.y*dt,-0.68,0.78);
            if(Math.random()<0.04){
                pg.drift.x=(Math.random()-0.5)*0.16;
                pg.drift.y=(Math.random()-0.5)*0.16;
            }
            if(t>=pg.aimUntil){
                crashPegasus(pg,s,foe);
            }
        }
    }

    function crashPegasus(pg,s,foe){
        hidePegasusStick();
        s.abilityHidden=false;
        s.abilityHold=false;
        s.x=pg.aim.x;
        s.y=pg.aim.y;
        state.pegasusCrash=nowMs()+420;
        state.pegasusSide=pg.side;
        const hit=Math.hypot(s.x-foe.x,s.y-foe.y)<=foe.radius*1.20;
        if(hit){
            const dmg=0.08+0.10*foe.rpm;
            foe.rpm=clamp(foe.rpm-dmg,0,1);
            popHit(foe,dmg);
            applyShove(foe, foe.x-s.x, foe.y-s.y, 0.086*0.70);
            popup("PEGASUS HIT");
        }else{
            s.rpm=clamp(s.rpm-0.15,0,1);
            popHit(s,0.15);
            popup("MISS");
        }
        s.hitFlash=0.5;
        s.impactScale=1.35;
        state.pegasus=null;
        state.channel=null;
    }

    function showPegasusStick(pg){
        let box=document.getElementById("pegasusAim");
        if(!box){
            box=document.createElement("div");
            box.id="pegasusAim";
            box.className="pegasus-aim";
            box.innerHTML=`<p>AIM THE BLAST</p><div class="pegasus-stick" id="pegasusStick"><i id="pegasusKnob"></i></div>`;
            document.querySelector(".battle-dock")?.appendChild(box);
        }
        box.hidden=false;
        const stick=document.getElementById("pegasusStick");
        const knob=document.getElementById("pegasusKnob");
        const setFrom=(cx,cy,rect)=>{
            const x=(cx-rect.left)/rect.width*2-1;
            const y=(cy-rect.top)/rect.height*2-1;
            const m=Math.hypot(x,y)||1;
            const k=m>1?1/m:1;
            pg.stick={x:x*k,y:y*k};
            if(knob){
                knob.style.transform=`translate(${pg.stick.x*28}px,${pg.stick.y*28}px)`;
            }
        };
        stick.onpointerdown=(e)=>{
            stick.setPointerCapture(e.pointerId);
            setFrom(e.clientX,e.clientY,stick.getBoundingClientRect());
        };
        stick.onpointermove=(e)=>{
            if(e.buttons||stick.hasPointerCapture?.(e.pointerId)) setFrom(e.clientX,e.clientY,stick.getBoundingClientRect());
        };
        stick.onpointerup=()=>{ pg.stick={x:0,y:0}; if(knob) knob.style.transform=""; };
        if(pg.side==="cpu"){
            const foe=bey("player");
            if(foe){
                const dx=foe.x-pg.aim.x, dy=foe.y-pg.aim.y;
                const m=Math.hypot(dx,dy)||1;
                pg.stick={x:(dx/m)*0.55,y:(dy/m)*0.55};
            }
        }
    }
    function hidePegasusStick(){
        const box=document.getElementById("pegasusAim");
        if(box) box.hidden=true;
    }

    function readFight(cpu,you){
        const dx=you.x-cpu.x, dy=you.y-cpu.y;
        const dist=Math.hypot(dx,dy)||1e-6;
        const relVx=you.vx-cpu.vx, relVy=you.vy-cpu.vy;
        const approach=-(dx*relVx+dy*relVy)/dist;
        const closeRate=approach*60;
        const eta=closeRate>0.004?dist/closeRate:999;
        const cpuSp=Math.hypot(cpu.vx,cpu.vy);
        const youSp=Math.hypot(you.vx,you.vy);
        const score=global.Game?.battle?.score||{player:0,cpu:0};
        const behind=(score.player||0)>(score.cpu||0);
        const rpmDown=(cpu.rpm||0)+0.08<(you.rpm||0);
        const elapsed=Number(global.NEW_BATTLE?.elapsed)||0;
        const lower=cpu.y>0.50;
        const intoHole=lower && cpu.vy>0.003 && Math.abs(cpu.x)<0.82;
        const climbingOut=lower && cpu.vy<-0.004;
        return {dist,approach,eta,cpuSp,youSp,behind,rpmDown,elapsed,intoHole,climbingOut,score};
    }

    function cpuShouldDash(cpu,you,f){
        if(!cpu||!you||blocked(cpu)) return false;
        if((state.dashAt.cpu||0)>nowMs()) return false;
        if(f.cpuSp<0.008) return false;
        if(f.intoHole) return false;
        if(f.elapsed<0.62) return false;
        if(f.climbingOut) return true;
        const clashWindow=f.approach>0.010 && f.dist>0.16 && f.dist<0.38 && f.eta>0.08 && f.eta<0.70;
        if(clashWindow) return true;
        const slip=f.approach>0.018 && f.dist<0.20 && f.youSp>f.cpuSp*1.04;
        if(slip) return true;
        return false;
    }

    function cpuShouldAbility(id,cpu,you,f){
        if(!id||!cpu||!you) return false;
        if(!kitMeta(id)?.active) return false;
        if((state.charges.cpu||0)<=0) return false;
        if(channelBusy()) return false;
        if(blocked(cpu) && id!=="pegasus-blast") return false;
        if(f.elapsed<0.28) return false;
        if(you.abilityHidden||you.abilityHold) return false;
        const charges=state.charges.cpu||0;
        const since=nowMs()-(state.cpuLastAbility||0);
        if(charges===1 && since<3200 && !f.behind && !f.rpmDown) return false;
        if(id==="ancient-sword"){
            return f.dist<SWORD_R*0.90 && (you.rpm||0)>0.10;
        }
        if(id==="hurricane"){
            return f.dist<STORM_R*0.95 && (
                f.approach>0.006 || (cpu.rpm||0)<0.82 || f.youSp>f.cpuSp
            );
        }
        if(id==="iron-skin"){
            return f.approach>0.008 && f.dist<0.34 && f.eta<0.55;
        }
        if(id==="earthquake"){
            return f.dist<QUAKE_R*0.92 && (f.youSp>0.012 || f.approach>0.004);
        }
        if(id==="pegasus-blast"){
            if(cpu.railEngaged) return false;
            if((cpu.rpm||0)<0.22) return false;
            return f.dist>0.24 && f.dist<0.82 && (f.behind||f.rpmDown||f.elapsed>3.2);
        }
        if(id==="flame-trail"){
            return f.approach>0.004 && f.dist<0.42 && f.cpuSp>0.010;
        }
        return false;
    }

    function maybeCpu(dt,p,c){
        state.cpuThink+=dt;
        if(state.cpuThink<0.12) return;
        state.cpuThink=0;
        if(!battleLive()||camHot()) return;
        const cpu=c;
        const you=p;
        if(!cpu||!you) return;
        const f=readFight(cpu,you);
        if(cpuShouldDash(cpu,you,f)) tryDash("cpu");
        const id=kitId(cpu.blade);
        if(cpuShouldAbility(id,cpu,you,f) && tryAbility("cpu")){
            state.cpuLastAbility=nowMs();
        }
    }

    function paintFx(p,c,t){
        const g=document.getElementById("abilityFx");
        if(!g) return;
        const NS=true;
        let html="";
        const ring=(s,r,cls,sw)=>{
            if(!s) return "";
            const pt=worldToSvg(s.x,s.y);
            return `<circle class="${cls}" cx="${pt.x.toFixed(2)}" cy="${pt.y.toFixed(2)}" r="${(r*39).toFixed(2)}" fill="none" stroke-width="${sw||0.85}"/>`;
        };
        const smoke=(s)=>{
            if(!s||!(s.swordSmoke>t)) return "";
            const pt=worldToSvg(s.x,s.y);
            const age=1-Math.max(0,(s.swordSmoke-t)/1700);
            let out="";
            for(let i=0;i<5;i++){
                const a=i*1.256+t/180;
                const rad=2.2+i*1.1+age*2;
                out+=`<circle class="fx-smoke" cx="${(pt.x+Math.cos(a)*rad).toFixed(1)}" cy="${(pt.y+Math.sin(a)*rad*0.7).toFixed(1)}" r="${(1.4+i*0.35).toFixed(1)}" fill="#9aa3ad" fill-opacity="${(0.28-age*0.18).toFixed(2)}"/>`;
            }
            return out;
        };
        [["player",p],["cpu",c]].forEach(([side,s])=>{
            if(!s) return;
            const id=kitId(s.blade);
            const pt=worldToSvg(s.x,s.y);
            if(id==="ancient-sword" && (state.charges[side]||0)>0 && !s.abilityHold){
                html+=ring(s,SWORD_R,"fx-sword-radius",0.9);
            }
            html+=smoke(s);
            if(s.abilityHold && id==="ancient-sword"){
                const flick=Math.sin(t/45);
                const ox=flick*2.4;
                html+=`<g class="fx-slash">
                    <line x1="${pt.x-5+ox}" y1="${pt.y-4}" x2="${pt.x+6-ox}" y2="${pt.y+5}" stroke="#f4f0e4" stroke-width="0.9"/>
                    <line x1="${pt.x+5}" y1="${pt.y-5}" x2="${pt.x-4}" y2="${pt.y+6}" stroke="#c9b48a" stroke-width="0.7"/>
                </g>`;
            }
            if(s.hurricaneUntil>t){
                html+=ring(s,STORM_R,"fx-storm",1.1);
                const spin=t/80;
                html+=`<g class="fx-tornado" transform="rotate(${(spin*40)%360} ${pt.x} ${pt.y})">
                    <ellipse cx="${pt.x}" cy="${pt.y}" rx="${STORM_R*39*0.55}" ry="${STORM_R*39*0.22}" fill="none" stroke="#bfefff" stroke-width="0.7" opacity="0.8"/>
                    <ellipse cx="${pt.x}" cy="${pt.y}" rx="${STORM_R*39*0.85}" ry="${STORM_R*39*0.34}" fill="none" stroke="#7ec8ff" stroke-width="0.55" opacity="0.55"/>
                    <path d="M${pt.x} ${pt.y-STORM_R*18} C${pt.x+4} ${pt.y} ${pt.x-4} ${pt.y} ${pt.x} ${pt.y+STORM_R*16}" fill="none" stroke="#e8f7ff" stroke-width="0.8"/>
                </g>`;
            }
            if(s.quakeUntil>t){
                html+=ring(s,QUAKE_R,"fx-quake",1);
                const j=Math.sin(t/90);
                html+=`<g class="fx-cracks">
                    <path d="M${pt.x-8} ${pt.y+j} L${pt.x-2} ${pt.y+4} L${pt.x+3} ${pt.y-1} L${pt.x+9} ${pt.y+3}" fill="none" stroke="#6a4a28" stroke-width="0.7"/>
                    <path d="M${pt.x} ${pt.y-6} L${pt.x+2} ${pt.y-1} L${pt.x-3} ${pt.y+5}" fill="none" stroke="#8a6230" stroke-width="0.55"/>
                </g>`;
            }
            if(s.metallic){
                html+=ring(s,s.radius*1.12,"fx-iron",1.2);
                html+=`<circle cx="${pt.x}" cy="${pt.y}" r="${s.radius*39*0.92}" fill="#cfd8e0" fill-opacity="0.22"/>`;
            }
            const trail=state.flame[side];
            if(trail?.length>1){
                const pts=trail.map(q=>{
                    const v=worldToSvg(q.x,q.y);
                    return `${v.x.toFixed(1)},${v.y.toFixed(1)}`;
                }).join(" ");
                html+=`<polyline class="fx-flame-under" points="${pts}" fill="none" stroke="#7a1208" stroke-width="3.4" stroke-linecap="round" opacity="0.45"/>`;
                html+=`<polyline class="fx-flame" points="${pts}" fill="none" stroke="#ff4a24" stroke-width="2.1" stroke-linecap="round"/>`;
            }
            if(s.dashGust && s.dashGust.until>t){
                const g2=s.dashGust;
                const gp=worldToSvg(s.x,s.y);
                const bx=-g2.hx*4.5, by=-g2.hy*4.5;
                html+=`<g class="fx-gust">
                    <path d="M${gp.x+bx} ${gp.y+by} q ${bx} ${by*0.2} ${bx*1.6} ${by*0.15}" fill="none" stroke="#d7efe4" stroke-width="0.9"/>
                    <path d="M${gp.x+bx*0.6} ${gp.y+by*0.6} q ${-by} ${bx} ${bx} ${by}" fill="none" stroke="#9ad7b8" stroke-width="0.7"/>
                    <path d="M${gp.x+bx*1.1} ${gp.y+by*1.1} q ${by} ${-bx} ${bx*0.8} ${by*0.4}" fill="none" stroke="#ffffff" stroke-width="0.55" opacity="0.8"/>
                </g>`;
            }
            if(s.ninjaFlick!=null && s.abilityHold){
                const spr=document.getElementById(side==="player"?"newPlayerBeySprite":"newCpuBeySprite");
                if(spr) spr.setAttribute("opacity", String(s.ninjaFlick));
            }else{
                const spr=document.getElementById(side==="player"?"newPlayerBeySprite":"newCpuBeySprite");
                if(spr && !s.abilityHidden) spr.setAttribute("opacity","1");
            }
            if(s.abilityHidden){
                const spr=document.getElementById(side==="player"?"newPlayerBeySprite":"newCpuBeySprite");
                const cir=document.getElementById(side==="player"?"newPlayerBey":"newCpuBey");
                if(spr) spr.style.display="none";
                if(cir) cir.style.display="none";
                html+=`<g class="fx-ufo">
                    <ellipse cx="${pt.x}" cy="${pt.y-9}" rx="7.2" ry="2.4" fill="#8fd0ff" fill-opacity="0.85"/>
                    <ellipse cx="${pt.x}" cy="${pt.y-10.2}" rx="3.2" ry="1.4" fill="#e8f7ff"/>
                    <path d="M${pt.x-5} ${pt.y-7} L${pt.x} ${pt.y+3} L${pt.x+5} ${pt.y-7}" fill="#b8e8ff" fill-opacity="0.35"/>
                </g>`;
            }
            if(s.quakePulse && s.quakePulse!==1){
                s.impactScale=s.quakePulse;
            }
        });
        if(state.pegasus?.phase==="aim"){
            const v=worldToSvg(state.pegasus.aim.x,state.pegasus.aim.y);
            html+=`<g class="fx-cross">
                <circle cx="${v.x}" cy="${v.y}" r="4.2" fill="none" stroke="#7ef0ff" stroke-width="0.8"/>
                <circle cx="${v.x}" cy="${v.y}" r="1.2" fill="#7ef0ff"/>
                <line x1="${v.x-6}" y1="${v.y}" x2="${v.x-2.2}" y2="${v.y}" stroke="#7ef0ff" stroke-width="0.6"/>
                <line x1="${v.x+2.2}" y1="${v.y}" x2="${v.x+6}" y2="${v.y}" stroke="#7ef0ff" stroke-width="0.6"/>
            </g>`;
        }
        if(state.pegasusCrash && state.pegasusCrash>t){
            const v=worldToSvg(p.x,p.y);
            const focus=state.pegasusSide==="cpu"?c:p;
            const w=worldToSvg(focus.x,focus.y);
            html+=`<g class="fx-bolt">
                <path d="M${w.x+2} ${w.y-10} L${w.x-2} ${w.y-2} L${w.x+1} ${w.y-2} L${w.x-3} ${w.y+8}" fill="#fff8a8" stroke="#ffe566" stroke-width="0.4"/>
            </g>`;
        }
        g.innerHTML=html;
    }

    function dockHTML(){
        const p=bey("player");
        const id=kitId(p?.blade);
        const meta=kitMeta(id);
        const charges=state.charges.player;
        const dashPct=Math.round(dashFill("player")*100);
        const abPct=Math.round(abilityFill("player")*100);
        const passive=!meta?.active;
        return `<div class="combat-dock" id="combatDock">
            <button type="button" class="combat-btn dash-btn" id="dashBtn">
                <span class="combat-fill" style="height:${dashPct}%"></span>
                <span class="combat-label">DASH</span>
            </button>
            <button type="button" class="combat-btn ability-btn${passive?" is-passive":""}" id="abilityBtn" ${passive?"disabled":""}>
                <span class="combat-fill" style="height:${abPct}%"></span>
                <span class="combat-emblem">${emblemSVG(id,28)}</span>
                <span class="combat-pips">${passive?"PASSIVE":`${charges}/2`}</span>
            </button>
            <span class="combat-toast" id="combatToast"></span>
        </div>`;
    }

    function bindKeys(){
        if(state.keysBound) return;
        state.keysBound=true;
        state.keys={x:0,y:0};
        const down=(e)=>{
            const k=e.key;
            if(k==="Shift"||k===" "){ e.preventDefault(); tryDash("player"); }
            if(k==="e"||k==="E"||k==="f"||k==="F"){ e.preventDefault(); tryAbility("player"); }
            if(k==="ArrowLeft"||k==="a"||k==="A") state.keys.x=-1;
            if(k==="ArrowRight"||k==="d"||k==="D") state.keys.x=1;
            if(k==="ArrowUp"||k==="w"||k==="W") state.keys.y=-1;
            if(k==="ArrowDown"||k==="s"||k==="S") state.keys.y=1;
        };
        const up=(e)=>{
            const k=e.key;
            if(k==="ArrowLeft"||k==="a"||k==="A"||k==="ArrowRight"||k==="d"||k==="D") state.keys.x=0;
            if(k==="ArrowUp"||k==="w"||k==="W"||k==="ArrowDown"||k==="s"||k==="S") state.keys.y=0;
        };
        window.addEventListener("keydown",down);
        window.addEventListener("keyup",up);
    }
    function mountDock(){
        const host=document.getElementById("launchDock");
        if(!host) return;
        host.innerHTML=dockHTML();
        host.querySelector("#dashBtn")?.addEventListener("click",()=>tryDash("player"));
        host.querySelector("#abilityBtn")?.addEventListener("click",()=>tryAbility("player"));
        bindKeys();
    }
    function updateDock(){
        const dash=document.querySelector("#dashBtn .combat-fill");
        const ab=document.querySelector("#abilityBtn .combat-fill");
        const pips=document.querySelector("#abilityBtn .combat-pips");
        if(dash) dash.style.height=`${Math.round(dashFill("player")*100)}%`;
        if(ab) ab.style.height=`${Math.round(abilityFill("player")*100)}%`;
        const id=kitId(bey("player")?.blade);
        const meta=kitMeta(id);
        if(pips && meta?.active) pips.textContent=`${state.charges.player}/2`;
        const db=document.getElementById("dashBtn");
        const abn=document.getElementById("abilityBtn");
        if(db) db.classList.toggle("ready", dashFill("player")>=1);
        if(abn && meta?.active) abn.classList.toggle("ready", (state.charges.player||0)>0 && !channelBusy());
    }

    function fxMarkup(){
        return `<g id="abilityFx" pointer-events="none"></g>
            <text id="abilityCallout" x="50" y="22" text-anchor="middle" font-size="5.4" font-weight="900" fill="#ffe08a" stroke="#120c04" stroke-width="0.45" opacity="0"></text>`;
    }

    global.SpinWarsAbilities={
        kitId, kitMeta, emblemSVG, abilityChipHTML,
        resetMatch, resetRound, tryDash, tryAbility,
        onClashKnock, skipClash, holdPhysics, step,
        mountDock, updateDock, fxMarkup, dashFill, abilityFill,
        cpuShouldDash, cpuShouldAbility, readFight,
        SWORD_R, STORM_R, QUAKE_R, KITS, META
    };
})(window);
