/* node tweak/assert-scoreboard.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const src = fs.readFileSync(path.join(__dirname, "..", "scoreboard.js"), "utf8");
const sandbox = { window: {}, performance: { now: () => 0 } };
sandbox.globalThis = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const SB = sandbox.window.SpinWarsScoreboard;
if (!SB) throw new Error("SpinWarsScoreboard missing");
const S = SB.SCORE;
const side = {
    rpmDamage: 1240, abilityDamage: 180, hits: 20, bigImpacts: 4, spin: 1, over: 0, xtreme: 1,
    dashes: 7, xrailRides: 5, peakRpm: 0.97
};
const base = SB.baseScore(side);
const expectBase = Math.floor(1240 / 10) + Math.floor(180 / 10) + 4 * 50 + 200 + 500;
if (base !== expectBase) throw new Error("baseScore " + base + " != " + expectBase);
const t = SB.tally(side);
if (t.final !== Math.round(expectBase * 1)) throw new Error("final " + t.final);
side.bestMul = 1.5;
const t2 = SB.tally(side);
if (t2.final !== Math.round(expectBase * 1.5)) throw new Error("final mul " + t2.final);
const rows = SB.breakdown(side);
const dash = rows.find(r => r.key === "dash");
if (!dash || dash.pts !== 0) throw new Error("dashes must be +0");
const xride = rows.find(r => r.key === "xride");
if (!xride || xride.pts !== 0 || xride.stat !== "5") throw new Error("xrail rides");
const ability = rows.find(r => r.key === "ability");
if (!ability || ability.pts !== 18) throw new Error("ability damage pts");
if (rows.find(r => r.key === "xdash" || r.key === "xspin" || r.key === "xover" || r.key === "xxtreme")) {
    throw new Error("removed x-rail finish / dash rows must stay gone");
}
if (S.SPIN_FINISH !== 200 || S.OVER_FINISH !== 350 || S.XTREME_FINISH !== 500) throw new Error("finish pts");
if (S.BIG_IMPACT !== 50 || S.RPM_DAMAGE_PER_POINT !== 10) throw new Error("damage pts");
if (S.BIG_IMPACT_MIN_HUD !== 8) throw new Error("big impact min");
if (SB.gameQuality("player", 7, 0, { final: 1800 }) !== "Perfect") throw new Error("quality perfect");
if (SB.gameQuality("cpu", 0, 7, { final: 80 }) !== "Horrible") throw new Error("quality horrible");
const csv = fs.readFileSync(path.join(__dirname, "spin-wars-x-scoreboard.csv"), "utf8");
if (/XRAIL_SPIN|X-Rail → Spin|X-Rail Dashes|decisive/i.test(csv) && /XRAIL_SPIN/.test(csv)) {
    throw new Error("csv still has removed x-rail finish rows");
}
if (!/xrailRides/.test(csv) || !/ABILITY_DAMAGE/.test(csv) || !/gameQuality/.test(csv)) {
    throw new Error("csv missing new scoreboard rows");
}
console.log("ok base", base, "final", t2.final);
console.log("all scoreboard asserts passed");
