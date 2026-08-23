/* SPIN WARS X — X-RAIL ENGINE
 * Version 4.7 — unlocked X-Exit launches down the stadium center
 *
 * Capture and riding are unchanged. 4.6 makes the rail and X-Exit solid
 * for free Beys: they cannot orbit through the mouth, and an X-Exit
 * impact launches them into the bowl on the same lane a rider uses.
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
   samples.push({x:p.x,y:p.y,tx:q.x/len,ty:q.y/len});
  }
 }
 const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame),q=derivative(...last,1),len=Math.hypot(q.x,q.y)||1;
 samples.push({x:last[3].x,y:last[3].y,tx:q.x/len,ty:q.y/len});
 const segments=[];let total=0;
 for(let i=0;i<samples.length-1;i++){
  const a=samples[i],b=samples[i+1],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(length<1e-9)continue;
  segments.push({a,b,length,start:total});total+=length;
 }
 geometry={samples,segments,total,leftExit:samples[0],rightExit:samples[samples.length-1]};
 return geometry;
}


function exitRampGeometry(){
 const g=buildGeometry();
 const a=g.leftExit,b=g.rightExit;
 const mx=(a.x+b.x)*0.5,my=(a.y+b.y)*0.5;
 const centerLen=Math.hypot(-mx,-my)||1;
 const ix=-mx/centerLen,iy=-my/centerLen;
 const apex=toGame([50,21.0]);
 /*
  * Solid X-Exit: the visual V plus the outer chord between rail ends.
  * Free Beys cannot pass this volume. Riders use the lane through it.
  */
 const faces=[
  {a:{x:a.x,y:a.y},b:{x:apex.x,y:apex.y}},
  {a:{x:b.x,y:b.y},b:{x:apex.x,y:apex.y}},
  {a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}}
 ];
 return {left:a,right:b,mid:{x:mx,y:my},apex,inward:{x:ix,y:iy},faces};
}
function closestPointOnSegment(x,y,a,b){
 const abx=b.x-a.x,aby=b.y-a.y,ab2=abx*abx+aby*aby;
 if(ab2<1e-12)return {x:a.x,y:a.y,t:0,dist2:(x-a.x)**2+(y-a.y)**2};
 const t=clamp(((x-a.x)*abx+(y-a.y)*aby)/ab2,0,1);
 const px=a.x+abx*t,py=a.y+aby*t;
 return {x:px,y:py,t,dist2:(x-px)**2+(y-py)**2};
}
function triSign(p1,p2,p3){
 return (p1.x-p3.x)*(p2.y-p3.y)-(p2.x-p3.x)*(p1.y-p3.y);
}
function inTriangle(p,a,b,c){
 const b1=triSign(p,a,b)<0,b2=triSign(p,b,c)<0,b3=triSign(p,c,a)<0;
 return (b1===b2)&&(b2===b3);
}
function inExitMouthRegion(s){
 const g=exitRampGeometry();
 const pad=beyRadius(s)+0.02;
 return !!s && s.y<g.apex.y+pad && s.y>g.left.y-pad && Math.abs(s.x)<0.22;
}
function exitSurfaceContact(s){
 const g=exitRampGeometry(),radius=beyRadius(s)+RAIL_HALF_WIDTH+0.010;
 let best=null;
 for(const seg of g.faces){
   const q=closestPointOnSegment(s.x,s.y,seg.a,seg.b);
   if(q.dist2<=radius*radius && (!best||q.dist2<best.dist2)){
     const dx=seg.b.x-seg.a.x,dy=seg.b.y-seg.a.y,len=Math.hypot(dx,dy)||1;
     const tx=dx/len,ty=dy/len;
     let nx=-ty,ny=tx;
     if(nx*g.inward.x+ny*g.inward.y<0){nx=-nx;ny=-ny;}
     best={...q,tx,ty,nx,ny,distance:Math.sqrt(q.dist2),inwardX:g.inward.x,inwardY:g.inward.y};
   }
 }
 const inside=inTriangle(s,g.left,g.right,g.apex)||inExitMouthRegion(s);
 if(!best && !inside)return null;
 if(!best){
  best={x:g.apex.x,y:g.apex.y,distance:0,nx:g.inward.x,ny:g.inward.y,
   inwardX:g.inward.x,inwardY:g.inward.y};
 }
 const normalVelocity=s.vx*best.nx+s.vy*best.ny;
 const centerVelocity=s.vx*g.inward.x+s.vy*g.inward.y;
 const actualImpact=inside||best.distance<=radius;
 return {...best,normalVelocity,centerVelocity,actualImpact,inside};
}
function bounceFromExit(s,c){
 if(!s||!c||!c.actualImpact)return false;
 beginExitRamp(s,c,{forceCenter:!s.railEngaged});
 s.lastXRailResult="exit-surface-bounce";
 s.railExitSurfaceHit=true;
 s.railExitSurfaceHitTime=0;
 return true;
}
function nearest(x,y){
 const g=buildGeometry();if(!Number.isFinite(x)||!Number.isFinite(y))return null;
 let best=null;
 for(const seg of g.segments){
  const abx=seg.b.x-seg.a.x,aby=seg.b.y-seg.a.y,ab2=abx*abx+aby*aby;
  if(ab2<1e-12)continue;
  const t=clamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
  const px=seg.a.x+abx*t,py=seg.a.y+aby*t,dx=x-px,dy=y-py,dist2=dx*dx+dy*dy;
  if(best&&dist2>=best.dist2)continue;
  let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t,ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t,tl=Math.hypot(tx,ty);
  if(tl<1e-9)continue;
  best={x:px,y:py,dist2,distance:seg.start+seg.length*t,tx:tx/tl,ty:ty/tl};
 }
 return best;
}
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
function sweptRailContact(s){
 if(!s)return null;
 const x0=Number.isFinite(s._xrailPrevX)?s._xrailPrevX:s.x,y0=Number.isFinite(s._xrailPrevY)?s._xrailPrevY:s.y;
 const x1=s.x,y1=s.y,dx=x1-x0,dy=y1-y0,travel=Math.hypot(dx,dy),radius=contactRadius(s);
 const samples=Math.max(4,Math.min(24,Math.ceil(travel/0.006)));let best=null;
 for(let i=0;i<=samples;i++){
  const u=i/samples,x=x0+dx*u,y=y0+dy*u,p=nearest(x,y);if(!p)continue;
  const distance=Math.sqrt(Math.max(0,p.dist2));if(distance>radius)continue;
  if(!best||distance<best.distance)best={...p,distance,u};
 }
 if(!best)return null;
 const previousDistance=Number.isFinite(s._xrailPrevDistance)?s._xrailPrevDistance:Infinity;
 const entering=previousDistance>radius+CONTACT_EPSILON&&best.distance<=radius+CONTACT_EPSILON;
 const cx=x0+(x1-x0)*best.u,cy=y0+(y1-y0)*best.u;
 let nx=cx-best.x,ny=cy-best.y,nlen=Math.hypot(nx,ny);
 if(nlen<1e-8){nx=-best.ty;ny=best.tx;}else{nx/=nlen;ny/=nlen;}
 const inward=-(s.vx*nx+s.vy*ny),movingInto=inward>0.0018;
 return{...best,impact:entering||movingInto,entering,inward,previousDistance,contactX:cx,contactY:cy};
}
function captureDecision(s,p,contact){
 const c=getContact(s,p);
 if(!c||c.speed<0.007)return{ok:false,reason:"low-speed",contact:c};
 if(s.spinDirection!==1)return{ok:false,reason:"wrong-spin",contact:c};
 if(!contact?.impact)return{ok:false,reason:"no-rail-impact",contact:c};
 if(c.inward<0.0048)return{ok:false,reason:"weak-impact",contact:c};
 if(c.tangential<0.0055||c.tangentRatio<0.20)return{ok:false,reason:"insufficient-ccw-momentum",contact:c};
 if(c.approachRatio>0.93)return{ok:false,reason:"too-direct",contact:c};
 if(c.tilt>0.38)return{ok:false,reason:"tilt-too-high",contact:c};
 return{ok:true,contact:c,grip:clamp(0.72+(1-c.tilt)*0.14+c.tangentRatio*0.10,0.72,0.96)};
}
function engage(s,contact){
 if(!s||s.railEngaged||!contact?.impact)return false;
 if((s.railExitRefractory||0)>0||(s.railCaptureCooldown||0)>0)return false;
 const p=contact,decision=captureDecision(s,p,contact);s.lastXRailResult=decision.reason||"rejected";setContactDebug(s,p,p.distance,"impact");
 if(!decision.ok)return false;
 const c=decision.contact;if(c.normal<0){s.vx-=c.nx*c.normal;s.vy-=c.ny*c.normal;}
 const tangential=s.vx*p.tx+s.vy*p.ty;
 if(!Number.isFinite(tangential)||tangential<=0.0035){s.lastXRailResult="capture-lost-tangent";return false;}
 s.railEngaged=true;s.railExited=false;s.railDirection=1;s.railGrip=decision.grip;s.railContactPoint={x:p.x,y:p.y};
 s.railDistance=p.distance;s.railSpeed=tangential;s.railRideTime=0;s.railTravelDistance=0;s._xrailLastDistance=p.distance;s._xrailPrevDistance=p.distance;
 s.railUses=(s.railUses||0)+1;s.lastXRailResult="capture";
 const gap=contactRadius(s),nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
 if(p.distance<gap&&len>1e-8){const push=gap-p.distance;s.x+=(nx/len)*push;s.y+=(ny/len)*push;}
 return true;
}
function bounce(s,p){
 if(!s||!p)return false;
 let nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);
 if(len<1e-9){nx=-p.ty;ny=p.tx;}else{nx/=len;ny/=len;}
 const normal=s.vx*nx+s.vy*ny;setContactDebug(s,p,Math.sqrt(Math.max(0,p.dist2)),"surface");
 const gap=contactRadius(s),d=Math.sqrt(Math.max(0,p.dist2));
 if(d<gap){const push=gap-d;s.x+=nx*push;s.y+=ny*push;}
 if(normal>=0){
  s.lastXRailResult=d<gap?"rail-separate":"near-rail-no-impact";
  return false;
 }
 const restitution=0.46,reflected=-normal*restitution;
 s.vx-=nx*normal;s.vy-=ny*normal;s.vx+=nx*reflected;s.vy+=ny*reflected;
 s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
 s.lastXRailResult="bounce";
 s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,0.55);
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
function chooseExitHeading(s,p){
 const speed=Math.hypot(s.vx,s.vy),railSpeed=Number(s.railSpeed)||speed,rpm=clamp01(s.rpm),tilt=clamp(Math.abs(Number(s.tiltLevel)||0),0,1),grip=clamp(Number(s.railGrip)||0.75,0.65,0.96);
 const balance=optionalStat(s,["balance","balanceStat"],0.70),attack=optionalStat(s,["attack","attackStat"],0.70),knockback=optionalStat(s,["knockback","knockbackStat"],0.70);
 const exit=exitRampGeometry();
 const quality=clamp(0.45*grip+0.25*balance+0.20*rpm+0.10*(1-tilt),0,1);
 const attackRailFactor=clamp(1+attack*0.12+Math.max(0,railSpeed-0.075)*1.6,1,1.20);
 const exitEnergyFactor=clamp(1.03+quality*0.14,1.03,1.17);
 const rawSpeed=railSpeed*(1.04+rpm*0.06+attack*0.055+knockback*0.025-tilt*0.05)*exitEnergyFactor*attackRailFactor;
 const exitSpeed=Math.min(0.160,Math.max(0.018,rawSpeed));
 /*
  * The X-Exit lane is the visual V into the bowl. Exit heading is that
  * lane, not a blend of the curling rail tangent (which pointed into the
  * gap and caused the leftward wiggle).
  */
 return{x:exit.inward.x,y:exit.inward.y,speed:exitSpeed,lateralAmount:0,quality,spread:0,seed:0,exitEnergyFactor};
}
function beginExitRamp(s,p,opts){
 if(s.xrailExitRampActive)return true;
 const heading=chooseExitHeading(s,p),speed=Math.hypot(s.vx,s.vy);
 const exit=exitRampGeometry();
 const forceCenter=!!opts?.forceCenter||!s.railEngaged;
 const rampTime=clamp(0.08+(1-clamp01((Number(s.railSpeed)||speed)/0.075))*0.03,0.08,0.12);
 const start={x:s.x,y:s.y};
 const end={x:exit.apex.x,y:exit.apex.y+0.12};
 const control=forceCenter
  ? {x:0,y:(start.y+end.y)*0.5}
  : {x:start.x*0.22+end.x*0.78,y:start.y*0.55+end.y*0.45};
 if(forceCenter){heading.x=exit.inward.x;heading.y=exit.inward.y;}
 s.xrailExitRampActive=true;s.xrailExitRampTime=0;s.xrailExitRampDuration=rampTime;s.xrailExitRampStart=start;s.xrailExitRampHeading=heading;
 s.xrailExitRampControl=control;s.xrailExitRampEnd=end;s.xrailExitForceCenter=forceCenter;
 s.xrailExitRampStartSpeed=Math.max(0.004,speed);s.xrailExitRampSpeed=heading.speed;
 s.xrailExitTarget=end;s.xrailExitTargetBias=0;s.railExitQuality=heading.quality;s.railExitEnergyFactor=heading.exitEnergyFactor;
 s.railExitKnockbackMultiplier=1+0.10*heading.quality;s.lastXRailResult="x-exit-ramp";s.railExitForce=heading.speed;
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
  s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0,1);
  s.xExitCenterLock=s.xrailExitForceCenter?0.28:0.16;
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
 const lastDistance=s._xrailLastDistance;if(Number.isFinite(lastDistance)&&p.distance<lastDistance-0.040){release(s,"lost-forward-progress");return false;}
 const exitPoint=g.rightExit,endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
 const nearExit=p.distance>=g.total-0.16;
 if(nearExit&&endpointDistance<=0.18){beginExitRamp(s,exitPoint);return true;}
 const tx=p.tx,ty=p.ty,tangentSpeed=s.vx*tx+s.vy*ty;if(!Number.isFinite(tangentSpeed)||tangentSpeed<=0.0020){release(s,"lost-tangent");return false;}
 const rpm=clamp(Number(s.rpm)||0,0,1),grip=clamp(Number(s.railGrip)||0.75,0.65,0.96);
 const movementStat=clamp(Number(s.movement ?? s.stats?.movement ?? 0.70),0,1);
 const attackStat=clamp((Number(s.attack ?? s.stats?.attack ?? 70))/99,0,1);
 const attackRailFactor=clamp(1+(Math.max(0,movementStat-0.72)*0.70)+(Math.max(0,attackStat-0.70)*0.18),1,1.24);
 const ceiling=(0.050+0.045*rpm+0.018*grip)*attackRailFactor;
 const acceleration=(0.00065+0.00135*rpm*grip)*
       (1+0.55*Math.max(0,attackRailFactor-1))*dt*60;
 const friction=(0.00010+(1-rpm)*0.00011)*dt*60;
 const targetSpeed=Math.min(ceiling,tangentSpeed+acceleration-friction);
 const railSpeed=Math.max(0.0020,targetSpeed);
 s.vx=tx*railSpeed;s.vy=ty*railSpeed;s.x+=s.vx*dt*60;s.y+=s.vy*dt*60;
 const after=nearest(s.x,s.y);
 if(after){
  const ax=s.x-after.x,ay=s.y-after.y,alen=Math.hypot(ax,ay),targetGap=radius+RAIL_HALF_WIDTH+0.006;
  if(alen>1e-9){const correction=clamp(targetGap-alen,-0.014,0.014);s.x+=(ax/alen)*correction;s.y+=(ay/alen)*correction;}
  s.railDistance=after.distance;s.railContactPoint={x:after.x,y:after.y};s._xrailLastDistance=after.distance;setContactDebug(s,after,Math.sqrt(Math.max(0,after.dist2)),"riding");
 }
 s.railSpeed=Math.hypot(s.vx,s.vy);s.railRideTime=(s.railRideTime||0)+dt;s.railTravelDistance=(s.railTravelDistance||0)+s.railSpeed*dt;s.lastXRailResult="riding";return true;
}
function stepCenterLock(s,dt){
 const lock=Number(s.xExitCenterLock)||0;
 if(lock<=0)return false;
 s.xExitCenterLock=Math.max(0,lock-dt);
 const speed=Math.max(0.018,Math.hypot(s.vx,s.vy));
 s.x+=(0-s.x)*Math.min(1,dt*14);
 s.vx=0;
 s.vy=speed;
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
 if(s.railExitSurfaceHit){
  s.railExitSurfaceHitTime=(s.railExitSurfaceHitTime||0)+dt;
  if(s.railExitSurfaceHitTime>0.22)s.railExitSurfaceHit=false;
 }
 if(!Number.isFinite(s._xrailPrevX)){s._xrailPrevX=s.x;s._xrailPrevY=s.y;}
 const justRodeExit=!!s.railExited||(s.lastXRailExitReason==="x-exit"&&(s.railExitRefractory||0)>0);
 const prev={x:s._xrailPrevX,y:s._xrailPrevY,vx:s.vx,vy:s.vy,radius:s.radius};
 const exitNow=justRodeExit?null:exitSurfaceContact(s);
 const exitPrev=justRodeExit?null:exitSurfaceContact(prev);
 const exitHit=exitNow?.actualImpact||exitPrev?.actualImpact;
 if(exitHit){
   bounceFromExit(s,exitNow||exitPrev);
   s._xrailPrevX=s.x;s._xrailPrevY=s.y;
   return{active:true,state:"x-exit-redirect"};
 }
 const swept=sweptRailContact(s);
 if(swept){
   const overlapping=swept.distance<=contactRadius(s);
   if(swept.impact||overlapping){
     if(inExitMouthRegion(s)&&!s.railEngaged){
      bounceFromExit(s,{actualImpact:true});
      s._xrailPrevX=s.x;s._xrailPrevY=s.y;
      return{active:true,state:"x-exit-redirect"};
     }
     if(s.railExited||s.railExitRefractory>0||s.railCaptureCooldown>0)bounce(s,swept);
     else if(!engage(s,swept))bounce(s,swept);
     s._xrailPrevX=s.x;s._xrailPrevY=s.y;const p=nearest(s.x,s.y);s._xrailPrevDistance=p?Math.sqrt(Math.max(0,p.dist2)):Infinity;
     return{active:!!s.railEngaged||!!s.xrailExitRampActive,state:s.railEngaged?"capture":"free"};
   }
   setContactDebug(s,swept,swept.distance,"near");
 }else clearContactDebug(s);
 s._xrailPrevX=s.x;s._xrailPrevY=s.y;const p=nearest(s.x,s.y);s._xrailPrevDistance=p?Math.sqrt(Math.max(0,p.dist2)):Infinity;
 return{active:false,state:s.railEngaged?"capture":"free"};
}
function inspect(s){
 if(!s)return null;const p=nearest(s.x,s.y);if(!p)return null;const c=getContact(s,p),swept=sweptRailContact(s),exitSurface=exitSurfaceContact(s);
 return{distance:c?.distance??null,contactRadius:contactRadius(s),speed:c?.speed??null,normal:c?.normal??null,inward:c?.inward??null,tangential:c?.tangential??null,approachRatio:c?.approachRatio??null,tangentRatio:c?.tangentRatio??null,tilt:c?.tilt??null,previousDistance:s._xrailPrevDistance??null,sweptImpact:!!swept?.impact,sweptEntering:!!swept?.entering,sweptDistance:swept?.distance??null,exitSurfaceContact:!!exitSurface,exitSurfaceImpact:!!exitSurface?.actualImpact,exitSurfaceDistance:exitSurface?.distance??null,progress:p.distance,total:buildGeometry().total,engaged:!!s.railEngaged,contacting:!!s.railContacting,result:s.lastXRailResult||null,exitQuality:s.railExitQuality??null,exitEnergyFactor:s.railExitEnergyFactor??null,exitKnockbackMultiplier:s.railExitKnockbackMultiplier??null};
}
global.SpinWarsXRailEngine={version:"4.7-xexit-center-launch",geometry:buildGeometry,exitGeometry:exitRampGeometry,nearest,tangentAt,release,engage,bounce,contactSafety,step,inspect};
})(window);
