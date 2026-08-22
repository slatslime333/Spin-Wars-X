/*
 SPIN WARS X — X-RAIL ENGINE
 Version 2.1 — clean physical foundation

 One authority for X-Rail. The rail is a surface, not a second movement engine.
 Geometry below is derived from the ACTUAL SVG rail drawn by renderNewBattle().
*/
(function(global){
"use strict";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Actual rendered SVG rail, converted from 100x100 screen coordinates to the
// game's normalized physics coordinates (screen - 50 / 39, screenY - 46 / 39).
const SVG_SEGMENTS=[
 [[44.8,10.3],[41.6,8.2],[37.2,7.2],[32.8,9.3]],
 [[32.8,9.3],[20.8,15.1],[14.0,29.0],[14.7,45.5]],
 [[14.7,45.5],[15.6,63.0],[29.6,76.8],[50.0,77.7]],
 [[50.0,77.7],[70.4,76.8],[84.4,63.0],[85.3,45.5]],
 [[85.3,45.5],[86.0,29.0],[79.2,15.1],[67.2,9.3]],
 [[67.2,9.3],[62.8,7.2],[58.4,8.2],[55.2,10.3]]
];

function toGame(p){ return {x:(p[0]-50)/39,y:(p[1]-46)/39}; }
function bezier(p0,p1,p2,p3,t){
 const u=1-t,uu=u*u,tt=t*t;
 return {
  x:uu*u*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+tt*t*p3.x,
  y:uu*u*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+tt*t*p3.y
 };
}
function derivative(p0,p1,p2,p3,t){
 const u=1-t;
 return {
  x:3*u*u*(p1.x-p0.x)+6*u*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x),
  y:3*u*u*(p1.y-p0.y)+6*u*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y)
 };
}

let geometry=null;
function buildGeometry(){
 if(geometry) return geometry;
 const samples=[];
 const per=32;
 for(const raw of SVG_SEGMENTS){
  const [a,b,c,d]=raw.map(toGame);
  for(let i=0;i<per;i++){
   const t=i/per;
   const p=bezier(a,b,c,d,t);
   const q=derivative(a,b,c,d,t);
   const l=Math.hypot(q.x,q.y)||1;
   samples.push({x:p.x,y:p.y,tx:q.x/l,ty:q.y/l});
  }
 }
 const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame);
 const p=last[3], q=derivative(...last,1), l=Math.hypot(q.x,q.y)||1;
 samples.push({x:p.x,y:p.y,tx:q.x/l,ty:q.y/l});
 const segments=[]; let total=0;
 for(let i=0;i<samples.length-1;i++){
  const a=samples[i],b=samples[i+1],len=Math.hypot(b.x-a.x,b.y-a.y);
  if(len<1e-8) continue;
  segments.push({a,b,length:len,start:total}); total+=len;
 }
 geometry={samples,segments,total,leftExit:samples[0],rightExit:samples[samples.length-1]};
 return geometry;
}

function nearest(x,y){
 const g=buildGeometry(); let best=null;
 for(const seg of g.segments){
  const abx=seg.b.x-seg.a.x, aby=seg.b.y-seg.a.y, ab2=abx*abx+aby*aby||1;
  const t=clamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
  const px=seg.a.x+abx*t,py=seg.a.y+aby*t,dx=x-px,dy=y-py,dist2=dx*dx+dy*dy;
  if(!best||dist2<best.dist2){
   let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t,ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t;
   const l=Math.hypot(tx,ty)||1;
   best={x:px,y:py,dist2,distance:seg.start+seg.length*t,tx:tx/l,ty:ty/l};
  }
 }
 return best;
}

// Left-top -> around bottom -> right-top is counter-clockwise in game space.
function direction(){ return 1; }
function tangentAt(p){ return p ? {x:p.tx,y:p.ty} : null; }
function isBottomFinishCorridor(){ return false; }

function clearRide(s){
 s.railEngaged=false;
 s.railGrip=0;
 s.railDirection=0;
 s.railSpeed=0;
 s.railRideTime=0;
 s.railTravelDistance=0;
 s.railContactPoint=null;
}

function release(s,reason){
 if(!s) return false;
 const p=nearest(s.x,s.y);
 clearRide(s);
 s.railExited=reason==="x-exit";
 s.railExitForce=reason==="x-exit" ? Math.hypot(s.vx,s.vy) : 0;
 s.railExitRefractory=reason==="x-exit" ? 0.30 : 0.12;
 s.railCaptureCooldown=reason==="x-exit" ? 0.28 : 0.08;
 s.railCaptureCooldownPoint={x:s.x,y:s.y};
 s.railExitRefractoryPoint={x:s.x,y:s.y};
 s.lastXRailExitReason=reason||"release";
 if(p) s.railDistance=p.distance;
 return true;
}

function captureDecision(s,p){
 const speed=Math.hypot(s.vx,s.vy);
 if(!Number.isFinite(speed)||speed<0.006) return {ok:false,reason:"low-speed"};
 if(s.spinDirection!==1) return {ok:false,reason:"wrong-spin"};
 const d=Math.sqrt(p.dist2)||1e-8;
 const nx=(s.x-p.x)/d,ny=(s.y-p.y)/d;
 // n points from rail toward Bey. Moving into rail is negative along n.
 const normal=s.vx*nx+s.vy*ny;
 const inward=-normal;
 const t={x:p.tx,y:p.ty};
 const tangent=s.vx*t.x+s.vy*t.y;
 const approachRatio=inward/speed;
 const tangentRatio=tangent/speed;
 const tilt=Math.abs(Number(s.tiltLevel)||0);

 if(inward<=0.0015) return {ok:false,reason:"not-entering-rail"};
 if(tangent<=0.0045 || tangentRatio<0.20) return {ok:false,reason:"bad-tangent"};
 if(approachRatio>0.78) return {ok:false,reason:"too-square"};
 // Low/flat tilt is catchable; heavy lean is not.
 if(tilt>0.34) return {ok:false,reason:"tilt-too-high"};

 const contactQuality=1-Math.abs(approachRatio-0.38)/0.38;
 if(contactQuality<0.15) return {ok:false,reason:"poor-contact"};

 return {ok:true,nx,ny,tangent:t,inward,tangentSpeed:tangent,grip:clamp(.60+0.25*clamp(1-tilt/.34,0,1)+0.10*clamp(contactQuality,0,1),.60,.95)};
}

function engage(s){
 if(!s||s.railEngaged) return false;
 if((s.railExitRefractory||0)>0 || (s.railCaptureCooldown||0)>0) return false;
 const p=nearest(s.x,s.y); if(!p) return false;
 const radius=Number(s.radius)||0.124;
 const contactRadius=0.055+radius;
 if(Math.sqrt(p.dist2)>contactRadius) return false;
 const d=captureDecision(s,p);
 s.lastXRailResult=d.reason;
 if(!d.ok) return false;

 const normal=s.vx*d.nx+s.vy*d.ny;
 if(normal<0){ s.vx-=d.nx*normal; s.vy-=d.ny*normal; }
 const tang=s.vx*d.tangent.x+s.vy*d.tangent.y;
 if(!Number.isFinite(tang)||tang<=0) return false;

 s.railEngaged=true;
 s.railExited=false;
 s.railDirection=1;
 s.railGrip=d.grip;
 s.railContactPoint={x:p.x,y:p.y};
 s.railDistance=p.distance;
 s.railSpeed=tang;
 s.railRideTime=0;
 s.railTravelDistance=0;
 s.railUses=(s.railUses||0)+1;
 s.lastXRailResult="capture";
 return true;
}

function bounce(s,p){
 if(!s||!p) return false;
 let nx=s.x-p.x,ny=s.y-p.y,l=Math.hypot(nx,ny);
 if(l<1e-8){ nx=-p.ty;ny=p.tx;l=1; }
 nx/=l;ny/=l;
 const n=s.vx*nx+s.vy*ny;
 if(n<0){
  const r=.42;
  s.vx-=nx*n; s.vy-=ny*n;
  s.vx+=nx*(-n*r); s.vy+=ny*(-n*r);
 }else{
  const push=.0015;
  s.vx+=nx*push;s.vy+=ny*push;
 }
 const dist=Math.sqrt(p.dist2),gap=Math.max(.012,(Number(s.radius)||.124)*.90);
 if(dist<gap){ const push=gap-dist; s.x+=nx*push;s.y+=ny*push; }
 s.surfaceBounce=Math.max(s.surfaceBounce||0,.16);
 s.surfaceRecovery=Math.max(s.surfaceRecovery||0,.10);
 s.lastXRailResult="bounce";
 return true;
}

function contactSafety(s,p){ return bounce(s,p); }

function constraint(s,dt){
 if(!s?.railEngaged) return false;
 const g=buildGeometry(),p=nearest(s.x,s.y);
 if(!p){release(s,"no-geometry");return false;}
 const radius=Number(s.radius)||.124;
 const contactLimit=.055+radius+.025;
 const dist=Math.sqrt(p.dist2);
 if(dist>contactLimit){release(s,"lost-contact");return false;}

 const t={x:p.tx,y:p.ty};
 let nx=s.x-p.x,ny=s.y-p.y,nl=Math.hypot(nx,ny);
 if(nl<1e-8){nx=-t.y;ny=t.x;nl=1;} else {nx/=nl;ny/=nl;}
 let tang=s.vx*t.x+s.vy*t.y;
 const normal=s.vx*nx+s.vy*ny;
 const speed=Math.hypot(s.vx,s.vy);
 // Curvature naturally creates a small apparent normal component as the
 // Bey follows the rail. Do not confuse that with an impact ejecting it.
 // Collision code is responsible for hard hits; contact loss is handled by
 // the distance test above.
 if(tang<=.0025){release(s,"lost-tangent");return false;}
 // A rider is constrained to the rail surface. Normal velocity is not
 // carried away from the rail; impacts that create enough outward velocity
 // were handled above as a release.
 if(normal<0){s.vx-=nx*normal;s.vy-=ny*normal;}
 else if(normal>0){s.vx-=nx*normal;s.vy-=ny*normal;}

 const rpm=clamp(Number(s.rpm)||0,0,1);
 const grip=clamp(Number(s.railGrip)||.65,.55,.98);
 const bitName=String(s.bit?.name||"").toLowerCase();
 const attack=(bitName.includes("flat")||bitName.includes("rush")||bitName.includes("quake"));
 const accel=(.00016+.00022*rpm+.00012*grip+(attack?.00010:0));
 const friction=.00005+(1-rpm)*.00006;
 tang+=accel*dt*60-friction*dt*60;
 const ceiling=.060+.035*rpm+.012*grip+(attack?.008:0);
 tang=clamp(tang,.003,ceiling);
 s.vx=t.x*tang+nx*Math.max(0,normal);
 s.vy=t.y*tang+ny*Math.max(0,normal);

 // app.js intentionally returns early while railEngaged. The rail is the
 // constrained surface for that frame, so it must integrate its own actual
 // velocity here. This is NOT a second free-space movement engine.
 s.x+=s.vx*dt*60;
 s.y+=s.vy*dt*60;

 // Maintain the Bey's physical contact gap around the curved rail. This is
 // a local surface correction, not a command to follow a stored distance.
 const after=nearest(s.x,s.y);
 if(after){
  const adx=s.x-after.x,ady=s.y-after.y,alen=Math.hypot(adx,ady)||1;
  const anx=adx/alen,any=ady/alen;
  const targetGap=radius+0.012;
  const gapError=targetGap-alen;
  if(Math.abs(gapError)>0.0005){
   const correction=gapError;
   s.x+=anx*correction;
   s.y+=any*correction;
  }
 }

 s.railSpeed=tang;
 s.railRideTime=(s.railRideTime||0)+dt;
 s.railTravelDistance=(s.railTravelDistance||0)+tang*dt;
 s.railDistance=p.distance;
 s.railContactPoint={x:p.x,y:p.y};

 const endpoint=g.rightExit;
 const ex=s.x-endpoint.x,ey=s.y-endpoint.y;
 const exitDist=Math.hypot(ex,ey);
 if(exitDist<=.11+radius*.5 || p.distance>=g.total-.035){
  // X-Exit is an opening in the rail, not another section of track. Preserve
  // the rider's speed but turn a portion of it through the physical opening.
  const ix=-endpoint.x,iy=-endpoint.y,il=Math.hypot(ix,iy)||1;
  const inX=ix/il,inY=iy/il;
  const speedOut=Math.max(.012,Math.hypot(s.vx,s.vy));
  const blend=.32;
  let exVx=(s.vx/speedOut)*(1-blend)+inX*blend;
  let exVy=(s.vy/speedOut)*(1-blend)+inY*blend;
  const el=Math.hypot(exVx,exVy)||1;
  exVx/=el; exVy/=el;
  s.vx=exVx*speedOut;
  s.vy=exVy*speedOut;
  const exitGap=radius+.018;
  s.x=endpoint.x+inX*exitGap;
  s.y=endpoint.y+inY*exitGap;
  release(s,"x-exit");
  return false;
 }
 return true;
}

function step(s,dt){
 if(!s) return {active:false,state:"none"};
 if(s.railEngaged){ return {active:constraint(s,dt),state:s.railEngaged?"riding":"release"}; }
 if((s.railExitRefractory||0)>0) s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
 if((s.railCaptureCooldown||0)>0) s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
 const p=nearest(s.x,s.y); if(!p) return {active:false,state:"none"};
 const radius=Number(s.radius)||.124;
 const contactRadius=.055+radius;
 if(Math.sqrt(p.dist2)>contactRadius) return {active:false,state:"none"};
 if(s.railExited || s.railExitRefractory>0 || s.railCaptureCooldown>0){ bounce(s,p); return {active:false,state:"bounce"}; }
 if(engage(s)) return {active:true,state:"capture"};
 bounce(s,p);
 return {active:false,state:"bounce"};
}

function inspect(s){
 const p=s?nearest(s.x,s.y):null;
 if(!s||!p) return null;
 const d=Math.sqrt(p.dist2)||1e-8,nx=(s.x-p.x)/d,ny=(s.y-p.y)/d;
 const speed=Math.hypot(s.vx,s.vy),normal=s.vx*nx+s.vy*ny,tangent=s.vx*p.tx+s.vy*p.ty;
 return {distance:d,speed,normal,tangent,approachRatio:-normal/Math.max(speed,.0001),tangentRatio:tangent/Math.max(speed,.0001),tilt:Number(s.tiltLevel)||0,spinDirection:s.spinDirection,engaged:!!s.railEngaged,lastResult:s.lastXRailResult};
}

global.SpinWarsXRailEngine={version:"2.1-clean",geometry:buildGeometry,nearest,tangentAt,direction,isBottomFinishCorridor,release,engage,exit:release,contactSafety,constraint,step,inspect};
})(window);
