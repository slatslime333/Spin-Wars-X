/* SPIN WARS X — PHYSICS ISOLATION PATCH v2.0
   Load AFTER app.js in index.html.

   Goal: stop the legacy zone/rail movement system from being authoritative
   while we build the continuous physics battle engine.
*/
(function(){
  "use strict";
  if (!window.Game || !window.Game.battle) return;

  const G = window.Game;
  G.battle.engineMode = "physics_v2";
  G.battle.physics = G.battle.physics || {
    time: 0, active:false,
    player:{x:-0.58,y:0,vx:0,vy:0,rpm:1,stability:1},
    cpu:{x:0.58,y:0,vx:0,vy:0,rpm:1,stability:1}
  };

  const P = G.battle.physics;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const q=(G.player.launch||{}).quality;
  const quality={Perfect:1,Good:.94,Okay:.84,Bad:.68,Horrible:.5}[q]||.84;

  function reset(){
    P.time=0; P.active=false;
    P.player={x:-.58,y:0,vx:.018*quality,vy:0,rpm:1,stability:1};
    P.cpu={x:.58,y:0,vx:-.018*quality,vy:0,rpm:1,stability:1};
  }

  function step(s,dt){
    const speed=Math.hypot(s.vx,s.vy);
    s.x += s.vx*dt*60;
    s.y += s.vy*dt*60;
    const r=Math.hypot(s.x,s.y);
    if(r>.88){
      const nx=s.x/r, ny=s.y/r;
      s.x=nx*.88; s.y=ny*.88;
      const out=s.vx*nx+s.vy*ny;
      if(out>0){
        s.vx-=2*out*nx; s.vy-=2*out*ny;
        s.vx*=.72; s.vy*=.72;
      }
    }
    s.vx*=Math.pow(.985,dt*60);
    s.vy*=Math.pow(.985,dt*60);
    s.rpm=clamp(s.rpm-.00045*dt*60,0,1);
    s.stability=clamp(s.stability-(speed*.012)*dt,0,1);
  }

  function render(){
    const nodes=[
      ["playerBey",P.player],
      ["cpuBey",P.cpu]
    ];
    for(const [id,s] of nodes){
      const el=document.getElementById(id);
      if(!el) continue;
      const x=500+s.x*350, y=420+s.y*315;
      el.setAttribute("cx",x);
      el.setAttribute("cy",y);
    }
  }

  let raf=null,last=0,start=0;
  function stop(){
    if(raf) cancelAnimationFrame(raf);
    raf=null; P.active=false;
  }

  function run(duration=8000){
    stop(); reset(); P.active=true;
    start=last=performance.now();
    function frame(now){
      if(!P.active) return;
      const dt=Math.min(.05,(now-last)/1000||1/60);
      last=now; P.time+=(dt);
      step(P.player,dt); step(P.cpu,dt); render();
      if(now-start<duration) raf=requestAnimationFrame(frame);
      else stop();
    }
    raf=requestAnimationFrame(frame);
  }

  // Legacy systems remain in the source for compatibility, but cannot drive
  // movement/events while physics_v2 is active.
  window.battleTick=()=>false;
  window.getNaturalMovement=()=>null;
  window.simulateBattleMovement=()=>false;
  window.checkBattleEvents=()=>false;
  window.canCollide=()=>false;
  window.resolveCollision=()=>false;
  window.handleXRailMovement=()=>false;
  window.resolveXRailExit=()=>({resolved:false});
  window.checkRailInterception=()=>false;
  window.checkOpeningInteraction=()=>false;
  window.resolveOpeningClash=()=>false;
  window.resolveOpeningAttack=()=>false;
  window.resolveAutomaticSituation=()=>false;
  window.resolveAutomaticEvent=()=>false;
  window.applyBattleEvent=()=>false;

  // The decision system is intentionally disconnected until physical
  // collisions/finishes are authoritative.
  window.generateDynamicDecision=()=>false;
  window.chooseDynamicMove=()=>false;

  window.SWX=window.SWX||{};
  window.SWX.physicsV2={reset,run,stop,getState:()=>P};
  window.SWX.startPhysicsTest=()=>run(8000);

  reset();
})();
