/* SPIN WARS X — X-RAIL ENGINE
 * Version 5.7 — natural rail speed, catch from remaining momentum
 *
 * Riding still uses the open rail path and the X-Exit ramp.
 * Free Beys collide with a single closed bumper. The X-Exit closer
 * bounces toward stadium middle; the rest of the rail uses a normal
 * surface bounce so launches can still hook. Drop launches stall under
 * the top rail beside the exit and skip rail contact only while hanging.
 */
(function(global){
"use strict";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clamp01=v=>clamp(Number(v)||0,0,1);

const SVG_SEGMENTS=[
 [[44.8,10.3],[41.6,8.2],[37.2,7.2],[32.8,9.3]],
 [[32.8,9.3],[20.8,15.1],[14.0,29.0],[14.7,45.5]],
 [[14.7,45.5],[15.6,63.0],[29.6,76.8],[50.0,77.7]],
 [[50.0,77.7],[70.4,76.8],[84.4,63.0],[85.3,45.5]],
 [[85.3,45.5],[86.0,29.0],[79.2,15.1],[67.2,9.3]],
 [[67.2,9.3],[62.8,7.2],[58.4,8.2],[55.2,10.3]]
];

const SVG_SCALE=39;
const RAIL_STROKE_WIDTH=2.1;
const RAIL_HALF_WIDTH=RAIL_STROKE_WIDTH/(2*SVG_SCALE);
const CONTACT_EPSILON=0.004;
const DEFAULT_BEY_RADIUS=0.124;
const MAX_SWEEP_SAMPLES=80;
const RIDE_MAX_STEP=0.010;

function inCommittedFinishMouth(s){
 if(!s)return false;
 const smash=
  (Number(s.lastImpactForce)||0)>=0.007 &&
  (Number(s.impactMomentumState)||0)>0.24;
 if(!smash)return false;
 const r=Math.hypot(s.x,s.y);
 const outward=r>1e-6?(s.vx*s.x+s.vy*s.y)/r:0;
 if(outward<0.0075 || r<0.70)return false;
 const xtreme=s.y>=0.58 && Math.abs(s.x)<=0.24;
 const pocket=s.y>=0.54 && Math.abs(s.x)>=0.48;
 return xtreme||pocket;
}

function toGame(p){return{x:(p[0]-50)/SVG_SCALE,y:(p[1]-46)/SVG_SCALE};}
function bezier(p0,p1,p2,p3,t){
 const u=1-t,uu=u*u,tt=t*t;
 return{x:uu*u*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+tt*t*p3.x,
        y:uu*u*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+tt*t*p3.y};
}
function derivative(p0,p1,p2,p3,t){
 const u=1-t;
 return{x:3*u*u*(p1.x-p0.x)+6*u*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x),
        y:3*u*u*(p1.y-p0.y)+6*u*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y)};
}

let geometry=null;
function buildGeometry(){
 if(geometry)return geometry;
 const samples=[],perCurve=72;
 for(const raw of SVG_SEGMENTS){
  const[a,b,c,d]=raw.map(toGame);
  for(let i=0;i<perCurve;i++){
   const t=i/perCurve,p=bezier(a,b,c,d,t),q=derivative(a,b,c,d,t),len=Math.hypot(q.x,q.y);
   if(len<1e-9)continue;
   samples.push({x:p.x,y:p.y,tx:q.x/len,ty:q.y/len,closer:false});
  }
 }
 const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame),q=derivative(...last,1),len=Math.hypot(q.x,q.y)||1;
 samples.push({x:last[3].x,y:last[3].y,tx:q.x/len,ty:q.y/len,closer:false});
 geometry=segmentsFromSamples(samples);
 geometry.leftExit=samples[0];
 geometry.rightExit=samples[samples.length-1];
 return geometry;
}

let solidGeometry=null;
function buildSolidGeometry(){
 if(solidGeometry)return solidGeometry;
 const ride=buildGeometry();
 const apex=toGame([50,21.0]);
 const samples=ride.samples.map(s=>({x:s.x,y:s.y,tx:s.tx,ty:s.ty,closer:false}));
 const start=ride.rightExit,end=ride.leftExit;
 const closerPts=[
  start,
  toGame([52.3,15.2]),
  apex,
  toGame([47.7,15.2]),
  end
 ];
 for(let i=0;i<closerPts.length-1;i++){
  const a=closerPts[i],b=closerPts[i+1],steps=8;
  for(let k=1;k<=steps;k++){
   const t=k/steps;
   const p={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
   const prev=samples[samples.length-1];
   const dx=p.x-prev.x,dy=p.y-prev.y,len=Math.hypot(dx,dy)||1;
   samples.push({x:p.x,y:p.y,tx:dx/len,ty:dy/len,closer:true});
  }
 }
 solidGeometry=segmentsFromSamples(samples);
 return solidGeometry;
}

function segmentsFromSamples(samples){
 const segments=[];let total=0;
 for(let i=0;i<samples.length-1;i++){
  const a=samples[i],b=samples[i+1],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(length<1e-9)continue;
  segments.push({a,b,length,start:total,closer:!!(a.closer||b.closer)});
  total+=length;
 }
 return {samples,segments,total};
}

function exitRampGeometry(){
 const g=buildGeometry();
 const a=g.leftExit,b=g.rightExit;
 const mx=(a.x+b.x)*0.5,my=(a.y+b.y)*0.5;
 const centerLen=Math.hypot(-mx,-my)||1;
 const apex=toGame([50,21.0]);
 return {left:a,right:b,mid:{x:mx,y:my},apex,inward:{x:-mx/centerLen,y:-my/centerLen}};
}

function nearestOn(g,x,y){
 if(!g||!Number.isFinite(x)||!Number.isFinite(y))return null;
 let best=null;
 for(const seg of g.segments){
  const abx=seg.b.x-seg.a.x,aby=seg.b.y-seg.a.y,ab2=abx*abx+aby*aby;
  if(ab2<1e-12)continue;
  const t=clamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
  const px=seg.a.x+abx*t,py=seg.a.y+aby*t,dx=x-px,dy=y-py,dist2=dx*dx+dy*dy;
  if(best&&dist2>=best.dist2)continue;
  let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t,ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t,tl=Math.hypot(tx,ty);
  if(tl<1e-9)continue;
  best={x:px,y:py,dist2,distance:seg.start+seg.length*t,tx:tx/tl,ty:ty/tl,closer:!!seg.closer};
 }
 return best;
}
function nearest(x,y){return nearestOn(buildGeometry(),x,y);}
function nearestSolid(x,y){return nearestOn(buildSolidGeometry(),x,y);}
function tangentAt(point,direction=1){
 if(!point)return null;const sign=direction<0?-1:1;return{x:point.tx*sign,y:point.ty*sign};
}
function beyRadius(s){const r=Number(s?.radius);return Number.isFinite(r)&&r>0?r:DEFAULT_BEY_RADIUS;}
function contactRadius(s){return beyRadius(s)+RAIL_HALF_WIDTH+CONTACT_EPSILON;}
function setContactDebug(s,p,distance,kind){
 s.railContacting=true;s.railContactDistance=distance;s.railContactPoint=p?{x:p.x,y:p.y}:null;s.lastXRailContactType=kind||"contact";
}
function clearContactDebug(s){s.railContacting=false;s.railContactDistance=null;s.lastXRailContactType=null;}
function resetRide(s){
 s.railEngaged=false;s.railGrip=0;s.railDirection=0;s.railSpeed=0;s.railRideTime=0;s.railTravelDistance=0;
 s.railContactPoint=null;s._xrailLastDistance=null;clearContactDebug(s);
}
function release(s,reason){
 if(!s)return false;
 const p=nearest(s.x,s.y);resetRide(s);
 s.railExited=reason==="x-exit";
 s.railExitForce=reason==="x-exit"?Math.hypot(s.vx,s.vy):0;
 s.railExitRefractory=reason==="x-exit"?0.22:0.08;
 s.railCaptureCooldown=reason==="x-exit"?0.16:0.08;
 s.railCaptureCooldownPoint={x:s.x,y:s.y};s.railExitRefractoryPoint={x:s.x,y:s.y};
 s.lastXRailExitReason=reason||"release";if(p)s.railDistance=p.distance;return true;
}
function getContact(s,p){
 if(!s||!p)return null;
 const distance=Math.sqrt(Math.max(0,p.dist2));if(!Number.isFinite(distance))return null;
 let nx=s.x-p.x,ny=s.y-p.y,nlen=Math.hypot(nx,ny);
 if(nlen<1e-8){nx=-p.ty;ny=p.tx;}else{nx/=nlen;ny/=nlen;}
 const speed=Math.hypot(s.vx,s.vy),normal=s.vx*nx+s.vy*ny,inward=-normal,tangential=s.vx*p.tx+s.vy*p.ty;
 return{distance,nx,ny,speed,normal,inward,tangential,
  approachRatio:inward/Math.max(speed,0.0001),tangentRatio:tangential/Math.max(speed,0.0001),
  tilt:Math.abs(Number(s.tiltLevel)||0)};
}
function sweptContact(s,findNearest,prevDistance){
 if(!s||typeof findNearest!=="function")return null;
 const x0=Number.isFinite(s._xrailPrevX)?s._xrailPrevX:s.x,y0=Number.isFinite(s._xrailPrevY)?s._xrailPrevY:s.y;
 const x1=s.x,y1=s.y,dx=x1-x0,dy=y1-y0,travel=Math.hypot(dx,dy),radius=contactRadius(s);
 const samples=Math.max(4,Math.min(MAX_SWEEP_SAMPLES,Math.ceil(travel/0.004)));let best=null;
 for(let i=0;i<=samples;i++){
  const u=i/samples,x=x0+dx*u,y=y0+dy*u,p=findNearest(x,y);if(!p)continue;
  const distance=Math.sqrt(Math.max(0,p.dist2));if(distance>radius)continue;
  if(!best||distance<best.distance)best={...p,distance,u};
 }
 if(!best)return null;
 const previousDistance=Number.isFinite(prevDistance)?prevDistance:Infinity;
 const entering=previousDistance>radius+CONTACT_EPSILON&&best.distance<=radius+CONTACT_EPSILON;
 const cx=x0+(x1-x0)*best.u,cy=y0+(y1-y0)*best.u;
 let nx=0-best.x,ny=0-best.y,nlen=Math.hypot(nx,ny);
 if(nlen<1e-8){nx=-best.ty;ny=best.tx;}else{nx/=nlen;ny/=nlen;}
 const towardCenter=s.vx*nx+s.vy*ny,movingInto=towardCenter< -0.0018;
 return{...best,impact:entering||movingInto,entering,previousDistance,contactX:cx,contactY:cy};
}
function sweptRailContact(s){return sweptContact(s,nearest,s._xrailPrevDistance);}
function sweptSolidContact(s){return sweptContact(s,nearestSolid,s._xrailSolidPrevDistance);}
function isExitZone(s,p){
 if(p?.closer) return true;
 if(!s) return false;
 const g=buildGeometry();
 const apex=toGame([50,21.0]);
 return Math.hypot(s.x-apex.x,s.y-apex.y)<0.20
  || Math.hypot(s.x-g.rightExit.x,s.y-g.rightExit.y)<0.16
  || Math.hypot(s.x-g.leftExit.x,s.y-g.leftExit.y)<0.16;
}
function captureDecision(s,p,contact){
 const c=getContact(s,p);
 // Catch from remaining CCW bite, not peak RPM. ~70% RPM with real
 // speed/momentum should still hook; dead or too-direct hits still fail.
 if(!c||c.speed<0.0034)return{ok:false,reason:"low-speed",contact:c};
 if(s.spinDirection!==1)return{ok:false,reason:"wrong-spin",contact:c};
 /*
   A wide Attack orbit can sit on the X-Rail ring. Circling there is a
   graze, not a ride. Only a real entry with CCW bite hooks — leftover
   launch width or a clash, not every lap of a rail-width circle.
 */
 if(!contact?.entering)return{ok:false,reason:"no-rail-entry",contact:c};
 if(c.inward<0.0038)return{ok:false,reason:"weak-impact",contact:c};
 if(c.tangential<0.0028||c.tangentRatio<0.16)return{ok:false,reason:"insufficient-ccw-momentum",contact:c};
 if(c.approachRatio>0.95)return{ok:false,reason:"too-direct",contact:c};
 if(c.tilt>0.44)return{ok:false,reason:"tilt-too-high",contact:c};
 /*
   Free hits on the X-Exit bounce to center unless they are a real
   hook: strong CCW and speed into the rail, not a bump on the V.
 */
 if(isExitZone(s,p)||p?.closer){
  if(c.speed<0.009||c.tangential<0.0075||c.tangentRatio<0.26){
   return{ok:false,reason:"exit-not-a-hook",contact:c};
  }
 }
 return{ok:true,contact:c,grip:clamp(0.72+(1-c.tilt)*0.14+c.tangentRatio*0.10,0.72,0.96)};
}
function engage(s,contact){
 if(!s||s.railEngaged||!contact?.impact)return false;
 if((s.railExitRefractory||0)>0||(s.railCaptureCooldown||0)>0)return false;
 const p=contact,decision=captureDecision(s,p,contact);s.lastXRailResult=decision.reason||"rejected";setContactDebug(s,p,p.distance,"impact");
 if(!decision.ok)return false;
 const c=decision.contact;
 const incoming=Math.hypot(s.vx,s.vy);
 if(c.normal<0){s.vx-=c.nx*c.normal;s.vy-=c.ny*c.normal;}
 const tangential=s.vx*p.tx+s.vy*p.ty;
 if(!Number.isFinite(tangential)||tangential<=0.0026){s.lastXRailResult="capture-lost-tangent";return false;}
 s.railEngaged=true;s.railExited=false;s.railDirection=1;s.railGrip=decision.grip;s.railContactPoint={x:p.x,y:p.y};
 /*
   Ride the rail with the speed you arrived with. Keep the CCW tangent,
   but do not throw away the rest of the incoming smash/launch so the
   lap and X-Exit still have real momentum.
 */
 s.railDistance=p.distance;s.railSpeed=Math.min(0.155,Math.max(0.078,Math.max(tangential,incoming*0.90)));s.railRideTime=0;s.railTravelDistance=0;s._xrailLastDistance=p.distance;s._xrailPrevDistance=p.distance;
 s.railUses=(s.railUses||0)+1;s.lastXRailResult="capture";
 const gap=contactRadius(s),nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
 if(p.distance<gap&&len>1e-8){const push=gap-p.distance;s.x+=(nx/len)*push;s.y+=(ny/len)*push;}
 return true;
}
function restoreBounceSpeed(s,incoming,keep,minKeep){
 const want=Math.max(minKeep,incoming*keep);
 const now=Math.hypot(s.vx,s.vy);
 if(now<1e-8){
  const r=Math.hypot(s.x,s.y)||1;
  s.vx=-(s.x/r)*want;
  s.vy=-(s.y/r)*want;
  return want;
 }
 if(now<want){
  s.vx*=want/now;
  s.vy*=want/now;
 }
 return Math.hypot(s.vx,s.vy);
}
function separateFromSolid(s,p){
 if(!s||!p)return false;
 const gap=contactRadius(s);
 const d=Number.isFinite(p.distance)?p.distance:Math.sqrt(Math.max(0,p.dist2||0));
 if(!(d<gap))return false;
 let nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
 if(len<1e-9){nx=-p.ty;ny=p.tx;len=1;}else{nx/=len;ny/=len;}
 const push=gap-d+0.001;
 s.x+=nx*push;s.y+=ny*push;
 return true;
}
function bounce(s,p){
 if(!s||!p)return false;
 if((s.railBounceCooldown||0)>0){
  separateFromSolid(s,p);
  return false;
 }
 if(s.launchDropActive && !s.launchDropReleased)return false;

 const incoming=Math.hypot(s.vx,s.vy);
 const gap=contactRadius(s);
 const d=Number.isFinite(p.distance)?p.distance:Math.sqrt(Math.max(0,p.dist2||0));
 const fromExit=!!s.railExited||s.lastXRailExitReason==="x-exit"||(s.railExitRefractory||0)>0;
 setContactDebug(s,p,d,"surface");

 /*
  * Unhooked X-Exit hits bounce toward stadium middle and keep their
  * speed. Riding the exit is only for a real CCW hook (handled before
  * bounce). Do not dump them or let them skim along the V.
  */
 if(p.closer||isExitZone(s,p)){
  const toX=0-s.x,toY=0-s.y,toLen=Math.hypot(toX,toY)||1;
  const cx=toX/toLen,cy=toY/toLen;
  if(d<gap){
   s.x+=cx*(gap-d+0.008);
   s.y+=cy*(gap-d+0.008);
  }
  const speed=Math.max(incoming,0.036);
  const spin=(Number(s.spinDirection)||1)>=0?1:-1;
  const tx=-s.y/toLen,ty=s.x/toLen;
  s.vx=cx*speed*0.97+tx*spin*speed*0.18;
  s.vy=cy*speed*0.97+ty*spin*speed*0.18;
  restoreBounceSpeed(s,incoming,1,0.036);
  s.surfaceBounce=Math.max(s.surfaceBounce||0,0.12);
  s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.08);
  s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,0.82);
  s.lastXRailResult="bounce-center";
  s.railBounceCooldown=0.10;
  s.railCaptureCooldown=Math.max(Number(s.railCaptureCooldown)||0,0.22);
  s.railExitForce=0;
  s.railExitKnockbackMultiplier=1;
  s.railExited=false;
  s.xrailExitRampActive=false;
  s.xExitCenterLock=0;
  return true;
 }

 let nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
 if(len<1e-9){nx=-p.ty;ny=p.tx;}else{nx/=len;ny/=len;}
 if(d<gap){s.x+=nx*(gap-d);s.y+=ny*(gap-d);}
 const normal=s.vx*nx+s.vy*ny;
 if(normal>=0){
  s.lastXRailResult=d<gap?"rail-separate":"near-rail-no-impact";
  return false;
 }
 const restitution=fromExit?0.64:0.56;
 const reflected=-normal*restitution;
 s.vx-=nx*normal;s.vy-=ny*normal;s.vx+=nx*reflected;s.vy+=ny*reflected;
 restoreBounceSpeed(s,incoming,fromExit?0.74:0.68,fromExit?0.028:0.024);
 s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
 s.lastXRailResult="bounce";
 s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,fromExit?0.62:0.42);
 s.railCaptureCooldown=Math.max(Number(s.railCaptureCooldown)||0,0.16);
 return true;
}
function contactSafety(s,p){return bounce(s,p);}
function hashString(value){
 const str=String(value||"");let h=2166136261;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
 return(h>>>0)/4294967295;
}
function optionalStat(s,names,def){
 for(const name of names){const v=Number(s?.[name]);if(Number.isFinite(v))return clamp01(v/99);}
 return def;
}
function pickExitLane(s){
 const seed=
  hashString((s.blade&&s.blade.name)||s.id||"bey")*0.91+
  (Number(s.railRideTime)||0)*2.17+
  (Number(s.railTravelDistance)||0)*1.31+
  ((Number(s.x)||0)+1.7)*0.37+
  ((Number(s.railSpeed)||0)*8.3);
 const roll=seed-Math.floor(seed);
 if(roll<0.30) return -1;
 if(roll>0.70) return 1;
 return 0;
}
function chooseExitHeading(s,p){
 const speed=Math.hypot(s.vx,s.vy),railSpeed=Number(s.railSpeed)||speed,rpm=clamp01(s.rpm),tilt=clamp(Math.abs(Number(s.tiltLevel)||0),0,1),grip=clamp(Number(s.railGrip)||0.75,0.65,0.96);
 const balance=optionalStat(s,["balance","balanceStat"],0.70);
 const exit=exitRampGeometry();
 const quality=clamp(0.45*grip+0.25*balance+0.20*rpm+0.10*(1-tilt),0,1);
 const exitEnergyFactor=1;
 const rawSpeed=railSpeed*(1.12-tilt*0.03);
 const exitSpeed=Math.min(0.19,Math.max(0.072,rawSpeed));
 const lane=pickExitLane(s);
 const yaw=lane*0.20;
 const ix=exit.inward.x,iy=exit.inward.y;
 const cs=Math.cos(yaw),sn=Math.sin(yaw);
 const hx=ix*cs-iy*sn,hy=ix*sn+iy*cs;
 const hlen=Math.hypot(hx,hy)||1;
 s.xExitLane=lane;
 s.xExitLaneX=lane*0.12;
 return{x:hx/hlen,y:hy/hlen,speed:exitSpeed,lateralAmount:lane,quality,spread:Math.abs(yaw),seed:yaw,exitEnergyFactor,lane};
}
function beginExitRamp(s,p){
 if(s.xrailExitRampActive)return true;
 const heading=chooseExitHeading(s,p),speed=Math.hypot(s.vx,s.vy);
 const exit=exitRampGeometry();
 const rampTime=clamp(0.08+(1-clamp01((Number(s.railSpeed)||speed)/0.075))*0.03,0.08,0.12);
 const start={x:s.x,y:s.y};
 const laneX=Number(heading.lane||s.xExitLane||0)*0.10;
 const end={x:exit.apex.x+laneX,y:exit.apex.y+0.12};
 const control={x:start.x*0.22+end.x*0.78,y:start.y*0.55+end.y*0.45};
 s.xrailExitRampActive=true;s.xrailExitRampTime=0;s.xrailExitRampDuration=rampTime;s.xrailExitRampStart=start;s.xrailExitRampHeading=heading;
 s.xrailExitRampControl=control;s.xrailExitRampEnd=end;s.xrailExitForceCenter=false;
 s.xrailExitRampStartSpeed=Math.max(0.004,speed);s.xrailExitRampSpeed=heading.speed;
 s.xrailExitTarget=end;s.xrailExitTargetBias=0;s.railExitQuality=heading.quality;s.railExitEnergyFactor=heading.exitEnergyFactor;
 s.railExitKnockbackMultiplier=1;s.lastXRailResult="x-exit-ramp";s.railExitForce=heading.speed;
 return true;
}
function exitRampStep(s,dt){
 const heading=s.xrailExitRampHeading;
 const start=s.xrailExitRampStart,control=s.xrailExitRampControl,end=s.xrailExitRampEnd;
 if(!heading||!start||!control||!end){s.xrailExitRampActive=false;release(s,"x-exit");return false;}
 const duration=Math.max(0.08,Number(s.xrailExitRampDuration)||0.11);
 s.xrailExitRampTime=(s.xrailExitRampTime||0)+dt;const t=clamp(s.xrailExitRampTime/duration,0,1);
 const smooth=t*t*(3-2*t);
 const u=1-smooth;
 const x=u*u*start.x+2*u*smooth*control.x+smooth*smooth*end.x;
 const y=u*u*start.y+2*u*smooth*control.y+smooth*smooth*end.y;
 let hx=heading.x,hy=heading.y;
 if(!s.xrailExitForceCenter){
  const dx=2*u*(control.x-start.x)+2*smooth*(end.x-control.x);
  const dy=2*u*(control.y-start.y)+2*smooth*(end.y-control.y);
  let dlen=Math.hypot(dx,dy)||1;
  hx=dx/dlen;hy=dy/dlen;
  if(hx*heading.x+hy*heading.y<0.15){hx=heading.x;hy=heading.y;}
 }
 const startSpeed=Math.max(0.004,Number(s.xrailExitRampStartSpeed)||0.004);
 const targetSpeed=Math.max(startSpeed,Number(s.xrailExitRampSpeed)||startSpeed);
 const speed=startSpeed+(targetSpeed-startSpeed)*smooth;
 s.x=x;s.y=y;s.vx=hx*speed;s.vy=hy*speed;s.railSpeed=speed;s.lastXRailResult="x-exit-ramp";
 if(t>=1){
  s.xrailExitRampActive=false;s.lastXRailResult="x-exit";
  release(s,"x-exit");
  s.vx=heading.x*targetSpeed;s.vy=heading.y*targetSpeed;
  s.railExitForce=targetSpeed;s.railExitVector={x:heading.x,y:heading.y};s.railExitBias=0;s.railExitRampCompleted=true;
  s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,0.88);
  s.xExitCenterLock=0.12;
  s.xrailExitForceCenter=false;
  return false;
 }
 return true;
}
function riderStep(s,dt){
 if(s.xrailExitRampActive)return exitRampStep(s,dt);
 const g=buildGeometry(),p=nearest(s.x,s.y);if(!p){release(s,"no-geometry");return false;}
 const radius=beyRadius(s),distance=Math.sqrt(Math.max(0,p.dist2)),contactLimit=radius+RAIL_HALF_WIDTH+0.012;
 if(distance>contactLimit){release(s,"lost-contact");return false;}
 const lastDistance=s._xrailLastDistance;if(Number.isFinite(lastDistance)&&p.distance<lastDistance-0.12){release(s,"lost-forward-progress");return false;}
 const exitPoint=g.rightExit,endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
 const nearExit=p.distance>=g.total-0.16;
 if(nearExit&&endpointDistance<=0.18){beginExitRamp(s,exitPoint);return true;}
 const tx=p.tx,ty=p.ty,tangentSpeed=s.vx*tx+s.vy*ty;
 const carried=Math.max(
  Number.isFinite(tangentSpeed)?tangentSpeed:0,
  Number(s.railSpeed)||0
 );
 if(!Number.isFinite(carried)||carried<=0.0020){release(s,"lost-tangent");return false;}
 const rpm=clamp(Number(s.rpm)||0,0,1),grip=clamp(Number(s.railGrip)||0.75,0.65,0.96);
 const drive=(rpm*0.00072+grip*0.00010-(1-rpm)*0.00012)*dt*60;
 const railSpeed=Math.min(0.155,Math.max(0.078,carried+drive));
 s.railSpeed=railSpeed;
 const travel=railSpeed*dt*60;
 const steps=Math.max(1,Math.ceil(travel/RIDE_MAX_STEP));
 const stepTravel=travel/steps;
 s.vx=tx*railSpeed;s.vy=ty*railSpeed;
 for(let i=0;i<steps;i++){
  const now=nearest(s.x,s.y);
  if(!now){release(s,"no-geometry");return false;}
  const nowDist=Math.sqrt(Math.max(0,now.dist2));
  if(nowDist>contactLimit){release(s,"lost-contact");return false;}
  s.vx=now.tx*railSpeed;s.vy=now.ty*railSpeed;
  s.x+=now.tx*stepTravel;s.y+=now.ty*stepTravel;
  const after=nearest(s.x,s.y);
  if(!after){release(s,"no-geometry");return false;}
  const ax=s.x-after.x,ay=s.y-after.y,alen=Math.hypot(ax,ay),targetGap=radius+RAIL_HALF_WIDTH+0.006;
  if(alen>1e-9){const correction=clamp(targetGap-alen,-0.014,0.014);s.x+=(ax/alen)*correction;s.y+=(ay/alen)*correction;}
  s.railDistance=after.distance;s.railContactPoint={x:after.x,y:after.y};s._xrailLastDistance=after.distance;setContactDebug(s,after,Math.sqrt(Math.max(0,after.dist2)),"riding");
  const exitPoint=g.rightExit,endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
  if(after.distance>=g.total-0.16 && endpointDistance<=0.18){beginExitRamp(s,exitPoint);return true;}
 }
 s.railSpeed=Math.hypot(s.vx,s.vy);s.railRideTime=(s.railRideTime||0)+dt;s.railTravelDistance=(s.railTravelDistance||0)+s.railSpeed*dt;s.lastXRailResult="riding";return true;
}
function stepCenterLock(s,dt){
 const lock=Number(s.xExitCenterLock)||0;
 if(lock<=0)return false;
 s.xExitCenterLock=Math.max(0,lock-dt);
 const speed=Math.max(0.060,Math.hypot(s.vx,s.vy));
 const laneX=Number(s.xExitLaneX)||0;
 const heading=s.xrailExitRampHeading||s.railExitVector;
 s.x+=(laneX-s.x)*Math.min(1,dt*10);
 let hx=0,hy=1;
 if(heading && Number.isFinite(heading.x) && Number.isFinite(heading.y)){
  const hl=Math.hypot(heading.x,heading.y)||1;
  hx=heading.x/hl;hy=heading.y/hl;
 }else{
  const aim=Math.hypot(laneX,1)||1;
  hx=laneX/aim;hy=1/aim;
 }
 s.vx=hx*speed;
 s.vy=hy*speed;
 s.x+=s.vx*dt*60;
 s.y+=s.vy*dt*60;
 s.lastXRailResult="x-exit-center";
 s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,1);
 return true;
}
function step(s,dt){
 if(!s)return{active:false,state:"none"};
 if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||!Number.isFinite(s.vx)||!Number.isFinite(s.vy))throw new Error("X-Rail received non-finite Bey state.");
 if(s.xrailExitRampActive){
  const active=exitRampStep(s,dt);s._xrailPrevX=s.x;s._xrailPrevY=s.y;
  return{active:true,state:"x-exit-ramp"};
 }
 if(stepCenterLock(s,dt)){
  s._xrailPrevX=s.x;s._xrailPrevY=s.y;
  return{active:true,state:"x-exit-center"};
 }
 if(s.railEngaged){
  const active=riderStep(s,dt);s._xrailPrevX=s.x;s._xrailPrevY=s.y;s._xrailPrevDistance=Number.isFinite(s.railDistance)?s.railDistance:s._xrailPrevDistance;
  return{active,state:s.railEngaged?"riding":"release"};
 }
 if((s.railExitRefractory||0)>0)s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
 if((s.railCaptureCooldown||0)>0)s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
 if((s.railBounceCooldown||0)>0)s.railBounceCooldown=Math.max(0,s.railBounceCooldown-dt);
 if(s.launchDropActive && !s.launchDropReleased){
  s._xrailPrevX=s.x;s._xrailPrevY=s.y;
  return{active:false,state:"drop-stall"};
 }
 if(!Number.isFinite(s._xrailPrevX)){s._xrailPrevX=s.x;s._xrailPrevY=s.y;}
 const justRodeExit=!!s.railExited||(s.lastXRailExitReason==="x-exit"&&(s.railExitRefractory||0)>0);
 const mouthPass=inCommittedFinishMouth(s);
 const solid=sweptSolidContact(s);
 if(solid){
  const overlapping=solid.distance<=contactRadius(s);
  if(solid.impact||overlapping){
   if(!mouthPass && !justRodeExit && (s.railExitRefractory||0)<=0 && (s.railCaptureCooldown||0)<=0){
    const rail=sweptRailContact(s);
    if(rail && (rail.impact||rail.distance<=contactRadius(s)) && engage(s,rail)){
     s._xrailPrevX=s.x;s._xrailPrevY=s.y;
     const p=nearest(s.x,s.y);s._xrailPrevDistance=p?Math.sqrt(Math.max(0,p.dist2)):Infinity;
     s._xrailSolidPrevDistance=solid.distance;
     return{active:true,state:"capture"};
    }
   }
   if(!mouthPass){
    bounce(s,solid);
    const after=nearestSolid(s.x,s.y);
    if(after) separateFromSolid(s,after);
   }
   s._xrailPrevX=s.x;s._xrailPrevY=s.y;
   const p=nearestSolid(s.x,s.y);s._xrailSolidPrevDistance=p?Math.sqrt(Math.max(0,p.dist2)):Infinity;
   return{active:false,state:mouthPass?"finish-mouth":"free"};
  }
  setContactDebug(s,solid,solid.distance,"near");
 }else clearContactDebug(s);
 s._xrailPrevX=s.x;s._xrailPrevY=s.y;
 const rideP=nearest(s.x,s.y);s._xrailPrevDistance=rideP?Math.sqrt(Math.max(0,rideP.dist2)):Infinity;
 const solidP=nearestSolid(s.x,s.y);s._xrailSolidPrevDistance=solidP?Math.sqrt(Math.max(0,solidP.dist2)):Infinity;
 return{active:false,state:s.railEngaged?"capture":"free"};
}
function inspect(s){
 if(!s)return null;const p=nearest(s.x,s.y);if(!p)return null;const c=getContact(s,p),swept=sweptRailContact(s),solid=sweptSolidContact(s);
 return{distance:c?.distance??null,contactRadius:contactRadius(s),speed:c?.speed??null,normal:c?.normal??null,inward:c?.inward??null,tangential:c?.tangential??null,approachRatio:c?.approachRatio??null,tangentRatio:c?.tangentRatio??null,tilt:c?.tilt??null,previousDistance:s._xrailPrevDistance??null,sweptImpact:!!swept?.impact,sweptEntering:!!swept?.entering,sweptDistance:swept?.distance??null,solidDistance:solid?.distance??null,solidCloser:!!solid?.closer,progress:p.distance,total:buildGeometry().total,engaged:!!s.railEngaged,contacting:!!s.railContacting,result:s.lastXRailResult||null,exitQuality:s.railExitQuality??null,exitEnergyFactor:s.railExitEnergyFactor??null,exitKnockbackMultiplier:s.railExitKnockbackMultiplier??null};
}
global.SpinWarsXRailEngine={version:"6.4-exit-center",geometry:buildGeometry,exitGeometry:exitRampGeometry,nearest,tangentAt,release,engage,bounce,contactSafety,step,inspect,inCommittedFinishMouth,pickExitLane,chooseExitHeading,isExitZone};
})(typeof window!=="undefined"?window:globalThis);
