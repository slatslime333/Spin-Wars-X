/*
 SPIN WARS X — SAFE BATTLE ENGINE MIGRATION
 Step 1: establish the new physical state WITHOUT disabling or replacing
 any existing menu, UI, launch, movement, collision, rail, or decision code.

 IMPORTANT:
 This file is loaded AFTER app.js.
 It intentionally does not overwrite existing global functions.
*/

(function () {
    "use strict";

    const SWX = window.SWX = window.SWX || {};

    SWX.engineVersion = "physics-migration-1";
    SWX.legacyEngine = "preserved";
    SWX.physics = SWX.physics || {};

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const num = (v, fallback = 0) =>
        Number.isFinite(Number(v)) ? Number(v) : fallback;

    function getProfile(side) {
        const source = window.Game?.[side] || {};
        const stats = source.stats || {};
        const blade = source.blade || {};
        const bit = source.bit || {};

        return {
            attack: num(stats.attack, blade.card?.attack || 70),
            knockback: num(stats.knockback, blade.card?.knockback || 70),
            defense: num(stats.defense, blade.card?.defense || 70),
            balance: num(stats.balance, blade.card?.balance || 70),
            stamina: num(stats.stamina, blade.card?.stamina || 70),
            mobility: num(stats.mobility, blade.card?.mobility || 70),
            bitName: bit.name || "Point",
            weight: num(blade.weight, 38)
        };
    }

    function createState(side) {
        const p = getProfile(side);
        const launch = window.Game?.[side]?.launch || {};
        const startX = side === "player" ? -0.58 : 0.58;
        const direction = side === "player" ? 1 : -1;

        return {
            side,
            x: startX,
            y: 0,

            vx: direction * 0.018,
            vy: 0,

            rpm: 1,
            momentumX: 0,
            momentumY: 0,

            tilt: num(launch.tiltDegrees, 0),

            stability: clamp(
                0.72 + (p.balance - 70) * 0.004,
                0.25,
                1
            ),

            profile: p,

            // These are intentionally placeholders until their real systems
            // are implemented.
            onRail: false,
            railProgress: 0,
            insidePocket: null,
            insideXtreme: false
        };
    }

    function initializePhysicalState() {
        const battle = window.Game?.battle;
        if (!battle) return;

        battle.physics = {
            version: SWX.engineVersion,
            time: 0,
            active: false,

            player: createState("player"),
            cpu: createState("cpu")
        };

        battle.engineMode = "migration";

        SWX.physics.state = battle.physics;
    }

    /*
     * Wrap startBattleRound SAFELY.
     *
     * The original function still runs normally.
     * Nothing is disabled.
     * Nothing is redirected.
     */
    function installRoundHook() {
        if (typeof window.startBattleRound !== "function") return false;
        if (window.startBattleRound.__swxMigrationWrapped) return true;

        const original = window.startBattleRound;

        function wrappedStartBattleRound(...args) {
            const result = original.apply(this, args);

            // The existing battle state is now initialized, so create the new
            // physical state beside it. The old engine remains authoritative
            // for this step.
            initializePhysicalState();

            return result;
        }

        wrappedStartBattleRound.__swxMigrationWrapped = true;
        wrappedStartBattleRound.__swxOriginal = original;

        window.startBattleRound = wrappedStartBattleRound;
        return true;
    }

    /*
     * Do not assume script ordering beyond "after app.js".
     * Wait briefly for the game's functions to exist.
     */
    let attempts = 0;
    const hookTimer = setInterval(() => {
        attempts++;

        if (installRoundHook() || attempts >= 100) {
            clearInterval(hookTimer);
        }
    }, 25);

    SWX.initializePhysicalState = initializePhysicalState;

    /*
     * Developer inspection only.
     *
     * Console:
     *   SWX.getState()
     */
    SWX.getState = () => window.Game?.battle?.physics || null;

})();
