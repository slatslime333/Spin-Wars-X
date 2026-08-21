/* Spin Wars X - X-Rail Engine
   Phase A: physical rail-capture decision. */

(function () {
    "use strict";

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function capture(input) {
        input = input || {};

        var speed = Number(input.speed) || 0;
        var rpm = clamp(Number(input.rpm) || 0, 0, 1);
        var approach = clamp(Number(input.approachRatio) || 0, 0, 1);
        var tangent = clamp(Number(input.tangentRatio) || 0, 0, 1);
        var tangentSpeed = Number(input.tangentSpeed) || 0;
        var affinity = clamp(Number(input.affinity) || 0, 0, 1);
        var stability = clamp(Number(input.stability) || 0, 0, 1);
        var deliberate = input.deliberate === true;
        var attackBit = input.attackBit === true;
        var recentKnockback = input.recentKnockback === true;

        var rpmFloor = deliberate ? 0.27 : (attackBit ? 0.46 : 0.52);
        if (rpm < rpmFloor) return { capture:false, reason:"low-rpm" };

        if (speed < (deliberate ? 0.008 : 0.012)) {
            return { capture:false, reason:"low-speed" };
        }

        var approachFloor = deliberate
            ? 0.10 + 0.08 * (1 - affinity)
            : (recentKnockback ? 0.22 + 0.14 * (1 - affinity)
                               : 0.25 + 0.16 * (1 - affinity));

        if (approach < approachFloor) {
            return { capture:false, reason:"poor-approach" };
        }

        var tangentFloor = deliberate
            ? 0.22 + 0.10 * (1 - affinity)
            : (recentKnockback
                ? 0.58 - affinity * 0.12 - (attackBit ? 0.02 : 0)
                : (attackBit ? 0.60 : 0.68) - affinity * 0.10);

        var tangentSpeedFloor = deliberate
            ? 0.0065 + 0.002 * (1 - affinity)
            : (recentKnockback ? 0.010 - affinity * 0.001
                               : 0.0115 - affinity * 0.001);

        if (tangent < tangentFloor || tangentSpeed < tangentSpeedFloor) {
            return { capture:false, reason:"poor-tangent" };
        }

        var approachQuality = clamp(approach / 0.42, 0, 1);
        var tangentQuality = clamp(
            (tangent - tangentFloor) / Math.max(0.01, 1 - tangentFloor),
            0, 1
        );
        var speedQuality = clamp((speed - 0.012) / 0.050, 0, 1);
        var alignment = clamp((rpm - 0.70) / 0.30, 0, 1) *
                        clamp(tangent / 0.72, 0, 1) *
                        clamp(approach / 0.42, 0, 1);

        var score = clamp(
            affinity * 0.30 +
            tangentQuality * 0.27 +
            approachQuality * 0.16 +
            speedQuality * 0.08 +
            rpm * 0.08 +
            stability * 0.05 +
            alignment * 0.06,
            0, 1
        );

        var baseChance = deliberate
            ? 0.68 + score * 0.20
            : attackBit
                ? 0.26 + score * 0.38
                : recentKnockback
                    ? 0.10 + score * 0.28
                    : 0.05 + score * 0.18;

        var chance = clamp(baseChance + (Math.random() - 0.5) * 0.08, 0.18, 0.90);

        if (Math.random() > chance) {
            return { capture:false, reason:"contact-not-caught", score:score };
        }

        return {
            capture:true,
            score:score,
            chance:chance,
            grip:clamp(0.66 + affinity * 0.18 + score * 0.16, 0, 1),
            initialBoost:0.010 + affinity * 0.014 + rpm * 0.008 + score * 0.010
        };
    }

    window.SpinWarsXRailEngine = {
        version:"phase-a-clean",
        capture:capture
    };
}());
