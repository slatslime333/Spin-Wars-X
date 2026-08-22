/*
 * SPIN WARS X — LAUNCH PLACEMENT FIX
 * Version 1.0
 *
 * Purpose:
 * - Preserve the current launch system and X-Rail engine.
 * - Make launch quality produce a controlled spawn error.
 * - Prevent Center launches from always spawning at exactly (0,0).
 * - Simplify X-Rail launch placement to ONE quality-error model.
 *
 * This file must load AFTER app.js.
 */
(function(global){
    "use strict";

    if(typeof global.newBattleLaunchState!=="function"){
        console.error("Launch placement fix: newBattleLaunchState was not found.");
        return;
    }

    const originalNewBattleLaunchState=global.newBattleLaunchState;

    const QUALITY_ERROR={
        Horrible:0.085,
        Bad:0.055,
        Okay:0.030,
        Good:0.014,
        Perfect:0.004
    };

    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

    function qualityError(quality){
        return QUALITY_ERROR[quality]??QUALITY_ERROR.Okay;
    }

    function deterministicRandomDirection(side,quality){
        /*
         * Keep the error random enough to feel like launch inconsistency,
         * but deterministic per state so the launch cannot change direction
         * every frame.
         */
        const seed=(performance.now()*0.001+
                   (side==="player"?1.731:4.219)+
                   qualityError(quality)*17.0);
        const a=(Math.sin(seed*12.9898)*43758.5453)%1;
        const b=(Math.sin(seed*78.233)*43758.5453)%1;
        return {
            x:Math.cos(a*Math.PI*2),
            y:Math.sin(b*Math.PI*2)
        };
    }

    function applyCenterPlacement(state,side){
        const error=qualityError(state.launchQuality);

        /*
         * Perfect is essentially centered. Worse launches can begin
         * noticeably off-center, but never outside a controlled radius.
         */
        const maxOffset=clamp(error*0.62,0.002,0.055);
        const d=deterministicRandomDirection(side,state.launchQuality);

        state.x=d.x*maxOffset;
        state.y=d.y*maxOffset;

        state.launchPlacementOffset={
            x:state.x,
            y:state.y,
            magnitude:Math.hypot(state.x,state.y)
        };
        state.launchPlacementSource="quality-error";
    }

    function applyXRailPlacement(state,side){
        const E=global.SpinWarsXRailEngine;
        if(!E || typeof E.nearest!=="function"){
            throw new Error("Launch placement fix: X-Rail engine unavailable.");
        }

        /*
         * The rail remains the physical authority. We only choose the
         * intended entry region here.
         *
         * Orientation:
         * 0-1: player left / CPU right
         * 2-3: player right / CPU left
         */
        const orientation=Math.floor((global.Game?.battle?.round||0)/2)%2;
        const playerOnLeft=orientation===0;
        const sideSign=
            side==="player"
                ? (playerOnLeft?-1:1)
                : (playerOnLeft?1:-1);

        /*
         * These are the same lower-side approach regions already used by
         * the current game. We do NOT move the rail geometry.
         */
        const intended={
            x:sideSign*0.82,
            y:0.48
        };

        const target=E.nearest(intended.x,intended.y);
        if(!target){
            throw new Error("Launch placement fix: X-Rail entry could not be resolved.");
        }

        const error=qualityError(state.launchQuality);

        /*
         * One error model:
         *   perfect = very close to intended entry
         *   horrible = farther away
         *
         * Error is split into a small normal component and a small
         * along-entry component. It is NOT stacked with another random
         * miss angle or another entry offset.
         */
        const radialX=target.x;
        const radialY=target.y;
        const radialLen=Math.hypot(radialX,radialY)||1;
        const normalX=radialX/radialLen;
        const normalY=radialY/radialLen;

        const tangentX=target.tx;
        const tangentY=target.ty;

        const d=deterministicRandomDirection(side,state.launchQuality);
        const errorDistance=clamp(error*0.52,0.002,0.045);

        const normalError=d.x*errorDistance*0.55;
        const tangentError=d.y*errorDistance*0.80;

        state.x=
            target.x+
            normalX*normalError+
            tangentX*tangentError;

        state.y=
            target.y+
            normalY*normalError+
            tangentY*tangentError;

        /*
         * Launch velocity is still a real physical approach. Do not
         * teleport into the rail and do not give the rail a capture boost.
         */
        const dx=target.x-state.x;
        const dy=target.y-state.y;
        const distance=Math.hypot(dx,dy)||1;
        const approachX=dx/distance;
        const approachY=dy/distance;

        const spin=
            state.blade?.spin==="Left" ? -1 : 1;

        const tangentX2=target.tx*spin;
        const tangentY2=target.ty*spin;

        const speed=Math.max(
            Math.hypot(state.vx,state.vy),
            0.029
        );

        /*
         * Keep the existing launch speed; only rebuild the direction from
         * the corrected spawn point. This prevents launch placement from
         * secretly becoming a second speed system.
         */
        const approachWeight=0.62;
        const tangentWeight=0.38;

        state.vx=
            (approachX*approachWeight+tangentX2*tangentWeight)*speed;
        state.vy=
            (approachY*approachWeight+tangentY2*tangentWeight)*speed;

        state.launchPlacementOffset={
            x:state.x-target.x,
            y:state.y-target.y,
            magnitude:Math.hypot(state.x-target.x,state.y-target.y)
        };
        state.launchPlacementTarget={
            x:target.x,
            y:target.y
        };
        state.launchPlacementSource="quality-error-single-model";
    }

    global.newBattleLaunchState=function(side){
        const state=originalNewBattleLaunchState(side);

        if(!state || !state.launchQuality){
            return state;
        }

        const technique=state.launchPlan?.technique;

        if(technique==="Center"){
            applyCenterPlacement(state,side);
        }else if(technique==="X-Rail"){
            applyXRailPlacement(state,side);
        }

        return state;
    };

    global.SpinWarsLaunchPlacementFix={
        version:"1.0",
        qualityError,
        baseConstructor:originalNewBattleLaunchState
    };
})(window);
