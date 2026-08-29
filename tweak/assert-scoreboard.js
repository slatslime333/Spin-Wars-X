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
    rpmDamage: 1240, hits: 20, bigImpacts: 4, spin: 1, over: 0, xtreme: 1,
    dashes: 7, xrailDashes: 3, peakRpm: 0.97, biggestImpact: 87,
    xrailSpin: 0, xrailOver: 0, xrailXtreme: 1,
    bestMul: 1.5, bestChain: "Big Impact → X-Rail → Xtreme Finish"
};
const base = SB.baseScore(side);
const expectBase = Math.floor(1240 / 10) + 4 * 50 + 200 + 500 + 200;
if (base !== expectBase) throw new Error("baseScore " + base + " != " + expectBase);
const t = SB.tally(side);
if (t.final !== Math.round(expectBase * 1.5)) throw new Error("final " + t.final);
const rows = SB.breakdown(side);
const dash = rows.find(r => r.key === "dash");
if (!dash || dash.pts !== 0) throw new Error("dashes must be +0");
const xdash = rows.find(r => r.key === "xdash");
if (!xdash || xdash.pts !== 0) throw new Error("xrail dashes must be +0");
if (S.SPIN_FINISH !== 200 || S.OVER_FINISH !== 350 || S.XTREME_FINISH !== 500) throw new Error("finish pts");
if (S.BIG_IMPACT !== 50 || S.RPM_DAMAGE_PER_POINT !== 10) throw new Error("damage pts");
if (S.XRAIL_XTREME !== 200) throw new Error("xrail xtreme bonus");
console.log("ok base", base, "final", t.final);
console.log("all scoreboard asserts passed");
