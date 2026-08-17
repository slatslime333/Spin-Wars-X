
/* SPIN WARS X — LAUNCH / MOVEMENT FIX
   Target: 2026-08-17 app.js (0.6.x launch engine)
   Load this AFTER app.js.
*/
(function(){
"use strict";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const angleData={
  "Flat":       {tilt:0,  lateral:0.00, forward:1.00, stability:1.00, drain:1.00},
  "Slight Tilt":{tilt:7,  lateral:0.18, forward:0.94, stability:0.96, drain:1.05},
  "Hard Tilt":  {tilt:14, lateral:0.36, forward:0.86, stability:0.88, drain:1.14}
};

function launchQuality(){
  if(typeof launchQualityRoll==="function") return launchQualityRoll();
  const r=Math.random()*100;
  return r<5?"Horrible":r<12?"Bad":r<45?"Okay":r<90?"Good":"Perfect";
}

function qualityData(q){
  return {
    Horrible:{speed:.78,accuracy:.55},
    Bad:{speed:.88,accuracy:.72},
    Okay:{speed:1,accuracy:.86},
    Good:{speed:1.08,accuracy:.95},
    Perfect:{speed:1.14,accuracy:1}
  }[q]||{speed:1,accuracy:.86};
}

function bitName(side){
  return Game[side]?.bit?.name || "Point";
}

function techniqueVector(side,tech){
  const sign=side==="player"?1:-1;
  if(tech==="Direct Clash") return {x:sign*1.25,y:0};
  if(tech==="Wide Circle") return {x:sign*.82,y:side==="player"?-.46:.46};
  if(tech==="Drop Launch") return {x:sign*.48,y:side==="player"?-.72:.72};
  if(tech==="X-Rail") return {x:sign*1.02,y:side==="player"?-.30:.30};
  return {x:sign,y:0};
}

function selectedTrajectory(side){
  const launch=Game[side]?.launch||{};
  const a=angleData[launch.angle||"Flat"];
  const t=techniqueVector(side,launch.technique||"Center");
  let x=t.x, y=t.y;
  const len=Math.hypot(x,y)||1;
  x/=len; y/=len;
  // Tilt is a real launcher release angle: it redirects velocity,
  // not merely a stat bonus.
  const lateral=(side==="player"?1:-1)*a.lateral;
  const rx=x*Math.cos(lateral)-y*Math.sin(lateral);
  const ry=x*Math.sin(lateral)+y*Math.cos(lateral);
  return {x:rx*a.forward,y:ry*a.forward};
}

function integratedLaunchScreen(){
  if(!window.Game) return;
  Game.battle=Game.battle||{};
  Game.battle.newLaunchStage="integrated";

  Game.player.launch=Game.player.launch||{};
  if(!Game.player.launch.angle) Game.player.launch.angle="Flat";
  if(!Game.player.launch.technique) Game.player.launch.technique="Center";
  if(!Game.player.launch.quality) Game.player.launch.quality=launchQuality();

  const p=Game.player, c=Game.cpu;
  const a=Game.player.launch.angle;
  const t=Game.player.launch.technique;
  const q=Game.player.launch.quality;
  const tp=selectedTrajectory("player");
  const start={x:18,y:50};
  const end={x:start.x+tp.x*42,y:start.y+tp.y*42};

  const angleButton=(name)=>`<button type="button" class="menu-btn ${a===name?"gold":"silver"} swx-angle" data-angle="${name}">${name}</button>`;
  const techButton=(name)=>`<button type="button" class="menu-btn ${t===name?"gold":"silver"} swx-tech" data-tech="${name}">${name}</button>`;

  document.getElementById("app").innerHTML=`
    <div class="background"></div>
    <main class="menu" style="max-width:920px;">
      <section class="menu-card" style="padding:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>ROUND ${Game.battle.round||Game.battle.turn||1} · LAUNCH</strong>
          <span style="opacity:.65;font-size:11px;">YOU: ${p.blade?.name||"Bey"}</span>
        </div>

        <div id="swxLaunchStadium" style="
          position:relative;width:min(88vw,760px);aspect-ratio:1/1;
          margin:10px auto;background:#c9cdd0;border:2px solid #6d757b;
          overflow:hidden;clip-path:polygon(7% 0,93% 0,100% 7%,100% 93%,93% 100%,7% 100%,0 93%,0 7%);
          box-shadow:0 10px 28px rgba(0,0,0,.38);">
          <svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%;">
            <polygon points="7,3 93,3 97,7 97,93 93,97 7,97 3,93 3,7"
              fill="#b9bdc0" stroke="#6d757b" stroke-width="1.2"/>
            <ellipse cx="50" cy="45" rx="39" ry="39" fill="#e8eaeb" stroke="#9da3a7" stroke-width="1.1"/>
            <ellipse cx="50" cy="45" rx="34.5" ry="34.5" fill="#d7dbdd" stroke="#b2b7ba" stroke-width=".8"/>
            <path d="M8 78 L29 78 L33 84 L67 84 L71 78 L92 78" fill="none" stroke="#737b80" stroke-width="2.8"/>
            <path d="M10 82 L27 82 L32 88 L32 94 L10 94 Z M73 82 L90 82 L90 94 L68 94 L68 88 Z"
              fill="#30363a" stroke="#555c61" stroke-width="1"/>
            <path d="M34 84 L66 84 L62 96 L38 96 Z" fill="#363c40" stroke="#555c61" stroke-width="1"/>
            <path d="M48 24 L50 28 L52 24" fill="none" stroke="#18a84a" stroke-width="2"/>
            <path d="M18 50 L${end.x.toFixed(2)} ${end.y.toFixed(2)}"
              fill="none" stroke="#3ba8ff" stroke-width="1.8" stroke-dasharray="3 2"/>
            <circle cx="18" cy="50" r="2.6" fill="#3ba8ff"/>
            <circle cx="82" cy="50" r="2.6" fill="#ff4b4b"/>
            <circle cx="${clamp(end.x,8,92).toFixed(2)}" cy="${clamp(end.y,8,82).toFixed(2)}"
              r="2" fill="#3ba8ff"/>
            <text x="18" y="45" text-anchor="middle" font-size="3.2" font-weight="700" fill="#1684d5">YOU</text>
            <text x="82" y="45" text-anchor="middle" font-size="3.2" font-weight="700" fill="#d33">CPU</text>
          </svg>
        </div>

        <div style="font-size:10px;opacity:.65;margin:2px 0 5px;">LAUNCH ANGLE</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          ${angleButton("Flat")}${angleButton("Slight Tilt")}${angleButton("Hard Tilt")}
        </div>

        <div style="font-size:10px;opacity:.65;margin:9px 0 5px;">TECHNIQUE</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          ${techButton("Center")}${techButton("X-Rail")}${techButton("Direct Clash")}
          ${techButton("Drop Launch")}${techButton("Wide Circle")}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:9px;font-size:11px;">
          <span>Quality: <strong>${q}</strong></span>
          <span>Angle: <strong>${a}</strong></span>
        </div>

        <button type="button" class="menu-btn gold" id="swxLetItRip" style="margin-top:8px;">
          LET IT RIP
        </button>
        <button type="button" class="menu-btn silver" id="swxBackVS">← BACK</button>
      </section>
    </main>`;

  document.querySelectorAll(".swx-angle").forEach(btn=>{
    btn.onclick=()=>{
      Game.player.launch.angle=btn.dataset.angle;
      Game.player.launch.quality=launchQuality();
      integratedLaunchScreen();
    };
  });

  document.querySelectorAll(".swx-tech").forEach(btn=>{
    btn.onclick=()=>{
      Game.player.launch.technique=btn.dataset.tech;
      Game.player.launch.quality=launchQuality();
      integratedLaunchScreen();
    };
  });

  document.getElementById("swxLetItRip").onclick=()=>{
    Game.player.launch.quality=Game.player.launch.quality||launchQuality();
    if(typeof beginNewPhysicalLaunch==="function"){
      beginNewPhysicalLaunch();
    }else if(typeof showLaunchExecution==="function"){
      showLaunchExecution();
    }
  };

  document.getElementById("swxBackVS").onclick=()=>{
    if(typeof showLetItRip==="function") showLetItRip();
  };
}

/*
 * Real tilt physics.
 *
 * The old engine stored `state.tilt`, but newPhysicsStep never used it.
 * This version converts tilt into:
 *   - lateral steering / launch arc
 *   - reduced forward drive at harder angles
 *   - extra correction torque for high-control bits
 *   - extra spin drain
 *   - stability loss when the Bey is tilted against its natural behavior
 *
 * Flat = clean/fast.
 * Slight = meaningful lateral line change.
 * Hard = strong lateral line change, slower forward travel and much
 *        greater stability cost.
 */

function fixedLaunchTarget(side,tech){
  if(tech==="Direct Clash") return {x:side==="player"?0.12:-0.12,y:0};
  if(tech==="X-Rail") return side==="player"?{x:-0.42,y:0.62}:{x:0.42,y:0.62};
  if(tech==="Wide Circle") return side==="player"?{x:0.02,y:-0.56}:{x:0.02,y:0.56};
  if(tech==="Drop Launch") return {x:0,y:0.10};
  return {x:0,y:0};
}

function fixedNewBattleLaunchState(side){
  const combo=Game[side];
  const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);
  const launch=combo.launch||{};
  const tech=launch.technique||"Center";
  const angle=launch.angle||"Flat";
  const quality=qualityData(launch.quality||"Okay");
  const ad=angleData[angle];
  const sign=side==="player"?1:-1;
  const startX=side==="player"?-.74:.74;
  const startY=0;
  const target=fixedLaunchTarget(side,tech);
  const dx=target.x-startX, dy=target.y-startY;
  const len=Math.hypot(dx,dy)||1;

  let dirX=dx/len, dirY=dy/len;
  const tilt=(side==="player"?1:-1)*ad.lateral;
  const rx=dirX*Math.cos(tilt)-dirY*Math.sin(tilt);
  const ry=dirX*Math.sin(tilt)+dirY*Math.cos(tilt);

  const bitMove=(stats.mobility||70)/100;
  const base=.021 + bitMove*.008;
  const techSpeed={
    Center:1,
    "Direct Clash":1.16,
    "X-Rail":1.08,
    "Wide Circle":.88,
    "Drop Launch":.94
  }[tech]||1;
  const launchSpeed=base*quality.speed*techSpeed*ad.forward;

  return {
    side,
    x:startX,y:startY,
    vx:rx*launchSpeed*sign,
    vy:ry*launchSpeed,
    rpm:clamp(.88+(stats.stamina-70)*.0025, .65,1),
    stability:clamp((stats.balance/100)*qualityData(launch.quality||"Okay").stability, .35,.99),
    tilt:ad.tilt,
    launchAngle:angle,
    launchTechnique:tech,
    launchQuality:launch.quality||"Okay",
    launchTarget:target,
    launchComplete:false,
    launchAge:0,
    radius:.060,
    hitFlash:0,
    stats,
    blade:combo.blade,
    bit:combo.bit,
    spinDirection:(combo.blade?.spin==="Left"||combo.blade?.spin==="Left-Spin")?1:-1,
    railEngaged:false,
    railProgress:0,
    railDistance:0,
    railSpeed:0,
    railRideTime:0,
    railTravelDistance:0,
    railLoops:0,
    railContactPoint:null,
    railExitCooldown:0
  };
}

function fixedNewPhysicsStep(s,dt){
  const stats=s.stats||{};
  const bit=s.bit||{};
  const angle=s.launchAngle||Game[s.side]?.launch?.angle||"Flat";
  const ad=angleData[angle]||angleData.Flat;
  const speed=Math.hypot(s.vx,s.vy);
  const mobility=(stats.mobility||70)/100;
  const control=(stats.balance||70)/100;
  const bitControl=(bit.behavior?.control||bit.control||70)/100;

  if(s.railExitCooldown>0) s.railExitCooldown=Math.max(0,s.railExitCooldown-dt);

  // Tilt creates a persistent directional bias instead of being a one-time
  // launch bonus. It gradually relaxes as the Bey loses RPM.
  const sideSign=s.side==="player"?1:-1;
  const rpmFactor=.45+.55*s.rpm;
  const tiltForce=(ad.lateral*.045 + (ad.tilt/14)*.020) * rpmFactor;
  const forwardFactor=ad.forward;

  // Attack bits respond more aggressively to tilt; controlled bits hold
  // the line better.
  const bitResponse=.70 + mobility*.18 + bitControl*.12;
  const desiredTurn=sideSign*tiltForce*bitResponse;

  const c=Math.cos(desiredTurn), si=Math.sin(desiredTurn);
  const rvx=s.vx*c-s.vy*si;
  const rvy=s.vx*si+s.vy*c;
  s.vx=rvx;
  s.vy=rvy;

  // Normal movement.
  s.x+=s.vx*dt*60*forwardFactor;
  s.y+=s.vy*dt*60;

  // Natural self-correction. Hard tilt fights the correction instead of
  // disappearing immediately.
  const correction=(1-bitControl)*0.010 + (1-control)*0.006;
  if(ad.tilt>0){
    s.vy-=sideSign*ad.lateral*correction*dt*60;
  }

  const friction=.985+mobility*.004;
  s.vx*=Math.pow(friction,dt*60);
  s.vy*=Math.pow(friction,dt*60);

  // Bit-driven curvature.
  const curve=((stats.balance||70)/1000)*(s.side==="player"?1:-1);
  const cc=Math.cos(curve), ss=Math.sin(curve);
  const cvx=s.vx*cc-s.vy*ss;
  const cvy=s.vx*ss+s.vy*cc;
  s.vx=cvx; s.vy=cvy;

  // Tilt makes the Bey reach the rail more easily when the launch actually
  // points toward it, but doesn't teleport it onto the rail.
  if(typeof tryNewXRailEngagement==="function") tryNewXRailEngagement(s);

  const railPoint=typeof newXRailNearest==="function" ? newXRailNearest(s.x,s.y) : null;
  const railDistance=railPoint ? Math.sqrt(railPoint.dist2) : 999;

  const r=Math.hypot(s.x,s.y);
  if(r>0.96 && railDistance>0.045){
    const nx=s.x/r, ny=s.y/r;
    s.x=nx*.96; s.y=ny*.96;
    const outward=s.vx*nx+s.vy*ny;
    if(outward>0){
      s.vx-=2*outward*nx;
      s.vy-=2*outward*ny;
      s.vx*=.72;
      s.vy*=.72;
    }
  }

  // Energy/stability cost of holding a tilted release.
  const movementDrain=.00042+speed*.0012;
  const tiltDrain=(ad.drain-1)*.00055;
  s.rpm=clamp(s.rpm-(movementDrain+Math.max(0,tiltDrain))*dt*60,0,1);

  const stabilityDrain=(1-s.rpm)*.0008+speed*.002;
  const tiltStability=ad.tilt>0
    ? (.0009*(ad.tilt/7))*(1-bitControl*.35)
    : 0;
  s.stability=clamp(s.stability-(stabilityDrain+tiltStability)*dt*60,0,1);

  // Tilt slowly relaxes as the Bey stabilizes.
  if(ad.tilt>0){
    s.tilt*=Math.pow(.985,dt*60);
  }
}

function install(){
  // Replace the separated angle/technique screens with the single stadium
  // setup. These assignments also keep existing callers intact.
  window.showLaunchAngle=integratedLaunchScreen;
  window.showLaunchTechnique=integratedLaunchScreen;
  window.showLaunchExecution=integratedLaunchScreen;

  // The live physics loop calls this global function by name.
  window.newPhysicsStep=fixedNewPhysicsStep;
  window.newBattleLaunchState=fixedNewBattleLaunchState;

  // If the old launch screen is entered directly, land on the integrated one.
  window.showLaunchScreen=integratedLaunchScreen;
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",install,{once:true});
}else{
  install();
}
})();
