/*
 * SPIN WARS X — X-RAIL ENGINE
 * Version 4.0 — impact capture / physical exit
 *
 * One owner. No spline riding, no scripted exit path, no random capture.
 *
 * Model:
 *   FREE -> actual crossing/contact -> BOUNCE or CAPTURE -> RIDE -> EXIT -> FREE
 *
 * The rail is a physical surface. It does not attract Beys from a distance.
 * A successful catch is an impact event, not prolonged proximity.
 */
(function(global){
    "use strict";

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    /* Exact centerline used by the current SVG stadium rail. */
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
        return {x:uu*u*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+tt*t*p3.x,
                y:uu*u*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+tt*t*p3.y};
    }
    function derivative(p0,p1,p2,p3,t){
        const u=1-t;
        return {x:3*u*u*(p1.x-p0.x)+6*u*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x),
                y:3*u*u*(p1.y-p0.y)+6*u*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y)};
    }

    let geometry=null;
    function buildGeometry(){
        if(geometry) return geometry;
        const samples=[];
        const perCurve=56;
        for(const raw of SVG_SEGMENTS){
            const [a,b,c,d]=raw.map(toGame);
            for(let i=0;i<perCurve;i++){
                const t=i/perCurve;
                const p=bezier(a,b,c,d,t);
                const q=derivative(a,b,c,d,t);
                const len=Math.hypot(q.x,q.y);
                if(len<1e-9) continue;
                samples.push({x:p.x,y:p.y,tx:q.x/len,ty:q.y/len});
            }
        }
        const last=SVG_SEGMENTS[SVG_SEGMENTS.length-1].map(toGame);
        const q=derivative(...last,1);
        const len=Math.hypot(q.x,q.y)||1;
        samples.push({x:last[3].x,y:last[3].y,tx:q.x/len,ty:q.y/len});

        const segments=[]; let total=0;
        for(let i=0;i<samples.length-1;i++){
            const a=samples[i],b=samples[i+1];
            const length=Math.hypot(b.x-a.x,b.y-a.y);
            if(length<1e-9) continue;
            segments.push({a,b,length,start:total});
            total+=length;
        }
        geometry={samples,segments,total,leftExit:samples[0],rightExit:samples[samples.length-1]};
        return geometry;
    }

    function nearest(x,y){
        const g=buildGeometry();
        if(!Number.isFinite(x)||!Number.isFinite(y)) return null;
        let best=null;
        for(const seg of g.segments){
            const abx=seg.b.x-seg.a.x, aby=seg.b.y-seg.a.y;
            const ab2=abx*abx+aby*aby;
            if(ab2<1e-12) continue;
            const t=clamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
            const px=seg.a.x+abx*t, py=seg.a.y+aby*t;
            const dx=x-px,dy=y-py,dist2=dx*dx+dy*dy;
            if(best&&dist2>=best.dist2) continue;
            let tx=seg.a.tx+(seg.b.tx-seg.a.tx)*t;
            let ty=seg.a.ty+(seg.b.ty-seg.a.ty)*t;
            const tl=Math.hypot(tx,ty);
            if(tl<1e-9) continue;
            best={x:px,y:py,dist2,distance:seg.start+seg.length*t,tx:tx/tl,ty:ty/tl};
        }
        return best;
    }

    function resetRide(s){
        s.railEngaged=false;
        s.railGrip=0;
        s.railDirection=0;
        s.railSpeed=0;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s.railContactPoint=null;
        s._xrailLastDistance=null;
    }

    function release(s,reason){
        if(!s) return false;
        const p=nearest(s.x,s.y);
        resetRide(s);
        s.railExited=reason==="x-exit";
        s.railExitForce=reason==="x-exit"?Math.hypot(s.vx,s.vy):0;
        s.railExitRefractory=reason==="x-exit"?0.22:0.08;
        s.railCaptureCooldown=reason==="x-exit"?0.16:0.08;
        s.railCaptureCooldownPoint={x:s.x,y:s.y};
        s.railExitRefractoryPoint={x:s.x,y:s.y};
        s.lastXRailExitReason=reason||"release";
        if(p) s.railDistance=p.distance;
        return true;
    }

    /*
     * PHYSICAL CONTACT
     * ----------------
     * The SVG rail is drawn as a 2.1-unit stroke in the 100x100 stadium.
     * Its half-width in game coordinates is approximately 0.027.
     *
     * Bey radius + rail half-width is the physical contact envelope.
     * This is NOT a capture magnet: contact still requires a swept impact.
     */
    const RAIL_HALF_WIDTH_GAME=0.027;
    const CONTACT_EPSILON=0.003;

    function contactRadius(s){
        const radius=Number(s?.radius)||0.124;
        return radius+RAIL_HALF_WIDTH_GAME+CONTACT_EPSILON;
    }

    function getContact(s,p){
        const distance=Math.sqrt(Math.max(0,p.dist2));
        if(!Number.isFinite(distance)) return null;

        let nx=s.x-p.x, ny=s.y-p.y;
        const nlen=Math.hypot(nx,ny);

        if(nlen<1e-8){
            nx=-p.ty;
            ny=p.tx;
        }else{
            nx/=nlen;
            ny/=nlen;
        }

        const speed=Math.hypot(s.vx,s.vy);
        const normal=s.vx*nx+s.vy*ny;
        const inward=-normal;
        const tangential=s.vx*p.tx+s.vy*p.ty;

        return {
            distance,
            nx,ny,
            speed,
            normal,
            inward,
            tangential,
            approachRatio:inward/Math.max(speed,0.0001),
            tangentRatio:tangential/Math.max(speed,0.0001),
            tilt:Math.abs(Number(s.tiltLevel)||0)
        };
    }

    /*
     * Find whether the Bey's actual frame-to-frame movement crossed the
     * physical rail envelope.
     *
     * We sample the swept segment at fixed points. This is intentionally
     * simple and deterministic; it prevents a fast Bey from tunneling
     * through the thin rail between animation frames.
     */
    function sweptRailContact(s){
        if(!s) return null;

        const x0=Number.isFinite(s._xrailPrevX)?s._xrailPrevX:s.x;
        const y0=Number.isFinite(s._xrailPrevY)?s._xrailPrevY:s.y;
        const x1=s.x, y1=s.y;

        const dx=x1-x0, dy=y1-y0;
        const travel=Math.hypot(dx,dy);
        const samples=Math.max(
            2,
            Math.min(12,Math.ceil(travel/0.010))
        );

        let best=null;
        const g=buildGeometry();
        const radius=contactRadius(s);

        for(let i=0;i<=samples;i++){
            const u=i/samples;
            const x=x0+dx*u;
            const y=y0+dy*u;
            const p=nearest(x,y);
            if(!p) continue;

            const distance=Math.sqrt(Math.max(0,p.dist2));
            if(distance>radius) continue;

            if(!best || distance<best.distance){
                best={
                    ...p,
                    distance,
                    u,
                    crossed:
                        distance<=radius &&
                        (
                            i>0 ||
                            Math.hypot(x0-p.x,y0-p.y)>radius
                        )
                };
            }
        }

        if(!best) return null;

        /*
         * A Bey that starts inside the shell but is moving away is not
         * making a new rail impact. A new impact requires either:
         *   - entering the shell during this frame, or
         *   - an actual inward velocity at the contact point.
         */
        const nx=best.x;
        const ny=best.y;
        let rx=s.x-best.x, ry=s.y-best.y;
        const rl=Math.hypot(rx,ry);

        if(rl<1e-8){
            rx=-best.ty;
            ry=best.tx;
        }else{
            rx/=rl;
            ry/=rl;
        }

        const inward=-(s.vx*rx+s.vy*ry);

        const previousDistance=Number.isFinite(s._xrailPrevDistance)
            ? s._xrailPrevDistance
            : Infinity;

        const entering=
            previousDistance>radius+CONTACT_EPSILON &&
            best.distance<=radius+CONTACT_EPSILON;

        const movingInto=inward>0.0025;

        if(!entering && !movingInto){
            return {
                ...best,
                impact:false,
                entering:false,
                inward,
                previousDistance
            };
        }

        return {
            ...best,
            impact:true,
            entering,
            inward,
            previousDistance
        };
    }

    function captureDecision(s,p,contact){
        const c=getContact(s,p);
        if(!c||c.speed<0.008){
            return {ok:false,reason:"low-speed",contact:c};
        }

        if(s.spinDirection!==1){
            return {ok:false,reason:"wrong-spin",contact:c};
        }

        /*
         * The swept test is the capture gate. Being near the rail is not.
         */
        if(!contact?.impact){
            return {ok:false,reason:"no-rail-impact",contact:c};
        }

        /*
         * The Bey must have meaningful inward momentum. This is what
         * distinguishes an impact from an attack orbit that merely skims
         * alongside the rail.
         */
        if(c.inward<0.0065){
            return {ok:false,reason:"weak-impact",contact:c};
        }

        /*
         * Tangential momentum must be CCW and substantial enough to carry
         * the Bey along the rail after the impact.
         */
        if(c.tangential<0.0070 || c.tangentRatio<0.28){
            return {ok:false,reason:"insufficient-ccw-momentum",contact:c};
        }

        /*
         * A near-square hit is more likely to rebound than lock.
         */
        if(c.approachRatio>0.86){
            return {ok:false,reason:"too-direct",contact:c};
        }

        /*
         * Tilt is a physical capture gate, not a small scoring modifier.
         */
        if(c.tilt>0.30){
            return {ok:false,reason:"tilt-too-high",contact:c};
        }

        return {
            ok:true,
            contact:c,
            grip:clamp(
                0.68+
                (1-c.tilt)*0.18+
                c.tangentRatio*0.10,
                0.68,0.96
            )
        };
    }

    function engage(s,contact){
        if(!s||s.railEngaged||!contact?.impact) return false;

        if((s.railExitRefractory||0)>0 ||
           (s.railCaptureCooldown||0)>0){
            return false;
        }

        const p=contact;
        const decision=captureDecision(s,p,contact);
        s.lastXRailResult=decision.reason;

        if(!decision.ok) return false;

        const c=decision.contact;

        /*
         * Remove only velocity directed INTO the rail. Tangential momentum
         * remains the Bey's own momentum.
         */
        if(c.normal<0){
            s.vx-=c.nx*c.normal;
            s.vy-=c.ny*c.normal;
        }

        const tangential=s.vx*p.tx+s.vy*p.ty;

        if(!Number.isFinite(tangential)||tangential<=0.004){
            s.lastXRailResult="capture-lost-tangent";
            return false;
        }

        s.railEngaged=true;
        s.railExited=false;
        s.railDirection=1;
        s.railGrip=decision.grip;
        s.railContactPoint={x:p.x,y:p.y};
        s.railDistance=p.distance;
        s.railSpeed=tangential;
        s.railRideTime=0;
        s.railTravelDistance=0;
        s._xrailLastDistance=p.distance;
        s._xrailPrevDistance=p.distance;
        s.railUses=(s.railUses||0)+1;
        s.lastXRailResult="capture";

        /*
         * Resolve only actual overlap with the physical rail surface.
         * This prevents a captured Bey from visually sitting inside the rail.
         */
        const gap=contactRadius(s);
        if(p.distance<gap){
            const nx=s.x-p.x;
            const ny=s.y-p.y;
            const len=Math.hypot(nx,ny);

            if(len>1e-8){
                const push=gap-p.distance;
                s.x+=(nx/len)*push;
                s.y+=(ny/len)*push;
            }
        }

        return true;
    }

    function bounce(s,p){
        if(!s||!p) return false;

        let nx=s.x-p.x,ny=s.y-p.y,len=Math.hypot(nx,ny);

        if(len<1e-9){
            nx=-p.ty;
            ny=p.tx;
            len=1;
        }

        nx/=len;
        ny/=len;

        const normal=s.vx*nx+s.vy*ny;

        /*
         * Only reflect velocity if the Bey is actually moving INTO the rail.
         * A Bey that is merely near the rail is left alone.
         */
        if(normal<0){
            const restitution=0.46;
            const reflected=-normal*restitution;

            s.vx-=nx*normal;
            s.vy-=ny*normal;
            s.vx+=nx*reflected;
            s.vy+=ny*reflected;

            const gap=contactRadius(s);
            const d=Math.sqrt(p.dist2);

            if(d<gap){
                const push=gap-d;
                s.x+=nx*push;
                s.y+=ny*push;
            }

            s.surfaceBounce=Math.max(s.surfaceBounce||0,0.16);
            s.surfaceRecovery=Math.max(s.surfaceRecovery||0,0.10);
            s.railCaptureCooldown=0.10;
            s.railCaptureCooldownPoint={x:s.x,y:s.y};
            s.lastXRailResult="bounce";
            return true;
        }

        s.lastXRailResult="near-rail-no-impact";
        return false;
    }

    function contactSafety(s,p){
        return bounce(s,p);
    }

    function riderStep(s,dt){
        const g=buildGeometry();
        const p=nearest(s.x,s.y);
        if(!p){release(s,"no-geometry");return false;}

        const radius=Number(s.radius)||0.124;
        const distance=Math.sqrt(p.dist2);
        const contactLimit=radius+0.028;
        if(distance>contactLimit){release(s,"lost-contact");return false;}

        const lastDistance=s._xrailLastDistance;
        if(Number.isFinite(lastDistance) && p.distance<lastDistance-0.030){
            release(s,"lost-forward-progress");
            return false;
        }

        /*
         * X-EXIT: the final rail point is the mouth. There is no canned exit
         * position or exit trajectory. If the Bey reaches the final throat
         * while moving in the authored CCW direction, rail authority ends.
         * Its current x/y/vx/vy are preserved exactly.
         */
        const exitDistance=0.20;
        const exitPoint=g.rightExit;
        const endpointDistance=Math.hypot(s.x-exitPoint.x,s.y-exitPoint.y);
        const exitForward=s.vx*exitPoint.tx+s.vy*exitPoint.ty;
        const nearExit=p.distance>=g.total-exitDistance;
        const centerX=-exitPoint.x;
        const centerY=-exitPoint.y;
        const centerLen=Math.hypot(centerX,centerY)||1;
        const centerDot=(s.vx*(centerX/centerLen)+s.vy*(centerY/centerLen)) /
            Math.max(Math.hypot(s.vx,s.vy),0.0001);

        if(nearExit && endpointDistance<=0.24 && exitForward>0.006 && centerDot>0.45){
            /*
             * The rider is already moving through the real opening. Release
             * exactly where it is and preserve its current velocity. The
             * following normal-movement step carries it into the stadium.
             */
            release(s,"x-exit");
            s.lastXRailResult="x-exit";
            return false;
        }

        const tx=p.tx,ty=p.ty;
        let nx=s.x-p.x,ny=s.y-p.y,nlen=Math.hypot(nx,ny);
        if(nlen<1e-9){nx=-ty;ny=tx;nlen=1;} else {nx/=nlen;ny/=nlen;}

        const tangentSpeed=s.vx*tx+s.vy*ty;
        if(!Number.isFinite(tangentSpeed)||tangentSpeed<=0.0025){
            release(s,"lost-tangent");return false;
        }

        /*
         * A rail rider can only travel in the authored CCW tangent direction.
         * The rail removes the normal component of velocity; it does not
         * invent a new speed or steer the Bey toward a canned path.
         */
        const rpm=clamp(Number(s.rpm)||0,0,1);
        const grip=clamp(Number(s.railGrip)||0.72,0.65,0.96);
        const friction=(0.000035+(1-rpm)*0.000055)*dt*60;
        const railAssist=(0.00002+0.00008*rpm*grip)*dt*60;
        const railSpeed=Math.max(0.0025,tangentSpeed-friction+railAssist);

        s.vx=tx*railSpeed;
        s.vy=ty*railSpeed;

        /* Rail riders are integrated here because app.js skips free movement for them. */
        s.x+=s.vx*dt*60;
        s.y+=s.vy*dt*60;

        /* Tiny normal correction keeps contact with the physical rail surface. */
        const after=nearest(s.x,s.y);
        if(after){
            const ax=s.x-after.x,ay=s.y-after.y,alen=Math.hypot(ax,ay);
            const targetGap=radius+0.006;
            if(alen>1e-9){
                const correction=clamp(targetGap-alen,-0.010,0.010);
                s.x+=(ax/alen)*correction;
                s.y+=(ay/alen)*correction;
            }
            s.railDistance=after.distance;
            s.railContactPoint={x:after.x,y:after.y};
            s._xrailLastDistance=after.distance;
        }

        s.railSpeed=Math.hypot(s.vx,s.vy);
        s.railRideTime=(s.railRideTime||0)+dt;
        s.railTravelDistance=(s.railTravelDistance||0)+s.railSpeed*dt;
        s.lastXRailResult="riding";
        return true;
    }

    function step(s,dt){
        if(!s) return {active:false,state:"none"};

        if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||
           !Number.isFinite(s.vx)||!Number.isFinite(s.vy)){
            throw new Error("X-Rail received non-finite Bey state.");
        }

        /*
         * Existing riders have rail authority for the frame. Free Beys are
         * tested against the swept path after normal movement.
         */
        if(s.railEngaged){
            const railResult=riderStep(s,dt);

            s._xrailPrevX=s.x;
            s._xrailPrevY=s.y;
            s._xrailPrevDistance=Number.isFinite(s.railDistance)
                ? s.railDistance
                : s._xrailPrevDistance;

            return {
                active:railResult,
                state:s.railEngaged?"riding":"release"
            };
        }

        if((s.railExitRefractory||0)>0){
            s.railExitRefractory=Math.max(0,s.railExitRefractory-dt);
        }

        if((s.railCaptureCooldown||0)>0){
            s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
        }

        /*
         * First invocation establishes the previous physical position.
         * Subsequent calls can sweep the actual movement segment.
         */
        if(!Number.isFinite(s._xrailPrevX)){
            s._xrailPrevX=s.x;
            s._xrailPrevY=s.y;
        }

        const previousX=s._xrailPrevX;
        const previousY=s._xrailPrevY;

        const swept=sweptRailContact(s);

        /*
         * Do not turn proximity into a bounce. Only an actual swept impact
         * gets a bounce/capture decision.
         */
        if(swept?.impact){
            if(s.railExited||s.railExitRefractory>0||
               s.railCaptureCooldown>0){
                bounce(s,swept);
            }else if(engage(s,swept)){
                /*
                 * Capture happens at the actual contact point. Keep the
                 * current physical velocity; riderStep owns the next frame.
                 */
            }else{
                bounce(s,swept);
            }
        }

        /*
         * Save the physical position AFTER this engine pass. app.js calls
         * us before and after movement, so the second call sees the complete
         * movement segment from the previous frame to the current frame.
         */
        s._xrailPrevX=s.x;
        s._xrailPrevY=s.y;

        const p=nearest(s.x,s.y);
        s._xrailPrevDistance=p
            ? Math.sqrt(Math.max(0,p.dist2))
            : Infinity;

        return {
            active:false,
            state:s.railEngaged?"capture":"free",
            previousX,
            previousY
        };
    }

    function inspect(s){
        if(!s) return null;

        const p=nearest(s.x,s.y);
        if(!p) return null;

        const c=getContact(s,p);
        const swept=sweptRailContact(s);

        return c?{
            distance:c.distance,
            contactRadius:contactRadius(s),
            speed:c.speed,
            normal:c.normal,
            inward:c.inward,
            tangential:c.tangential,
            approachRatio:c.approachRatio,
            tangentRatio:c.tangentRatio,
            tilt:c.tilt,
            previousDistance:s._xrailPrevDistance??null,
            sweptImpact:!!swept?.impact,
            sweptEntering:!!swept?.entering,
            sweptDistance:swept?.distance??null,
            progress:p.distance,
            total:buildGeometry().total,
            engaged:!!s.railEngaged,
            result:s.lastXRailResult||null
        }:null;
    }

    global.SpinWarsXRailEngine={
        version:"4.0-impact-capture-physical-exit",
        geometry:buildGeometry,
        nearest,
        release,
        engage,
        contactSafety,
        step,
        inspect
    };
})(window);
