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

function expectRpm(dmg){
    let rem = dmg, pts = 0;
    const b1 = Math.min(rem, S.RPM_BAND1_TO);
    pts += Math.floor(b1 / S.RPM_BAND1_PER);
    rem -= b1;
    if (rem <= 0) return pts;
    const b2 = Math.min(rem, S.RPM_BAND2_TO - S.RPM_BAND1_TO);
    pts += Math.floor(b2 / S.RPM_BAND2_PER);
    rem -= b2;
    if (rem <= 0) return pts;
    return pts + Math.floor(rem / S.RPM_BAND3_PER);
}

if (SB.rpmPts(1240) !== expectRpm(1240)) throw new Error("rpmPts progressive");
if (SB.rpmPts(700) !== expectRpm(700)) throw new Error("rpmPts at max match damage");
if (SB.rpmPts(700) <= Math.floor(700 / 10)) throw new Error("700 dmg should beat old flat /10");
if (SB.rpmPts(200) !== Math.floor(200 / 5)) throw new Error("low band");
const lowRate = SB.rpmPts(200) / 200;
const highRate = (SB.rpmPts(700) - SB.rpmPts(500)) / 200;
if (!(highRate > lowRate)) throw new Error("high damage band should be denser");

const side = {
    rpmDamage: 520, abilityDamage: 180, abilityRestore: 20, abilityPockets: 1, abilityPocketPts: 180,
    hits: 20, bigImpacts: 4, spin: 1, over: 0, xtreme: 1,
    dashes: 7, xrailRides: 5, peakRpm: 0.97
};
const base = SB.baseScore(side);
const expectBase = expectRpm(520) + expectRpm(180) + Math.floor(20 / S.ABILITY_RESTORE_PER) + 180 + 4 * 50 + 200 + 500;
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
if (!ability || ability.pts !== expectRpm(180) + Math.floor(20 / S.ABILITY_RESTORE_PER) + 180) throw new Error("ability pts");
if (!/restore/.test(ability.stat) || !/pocket/.test(ability.stat)) throw new Error("ability stat line");
if (rows.find(r => r.key === "xdash" || r.key === "xspin" || r.key === "xover" || r.key === "xxtreme")) {
    throw new Error("removed x-rail finish / dash rows must stay gone");
}
if (S.SPIN_FINISH !== 200 || S.OVER_FINISH !== 350 || S.XTREME_FINISH !== 500) throw new Error("finish pts");
if (S.BIG_IMPACT !== 50 || S.RPM_BAND1_PER !== 5 || S.RPM_BAND1_TO !== 250) throw new Error("damage pts");
if (S.RPM_BAND2_TO !== 500 || S.RPM_BAND3_PER !== 3) throw new Error("rpm bands around 700");
if (S.BIG_IMPACT_MIN_HUD !== 8) throw new Error("big impact min");
if (S.ABILITY_POCKET_OVER !== 120 || S.ABILITY_POCKET_XTREME !== 180) throw new Error("ability pocket");
if (S.ABILITY_RESTORE_PER !== 2) throw new Error("ability restore per");
if (SB.gameQuality("player", 7, 0, { final: 1800 }) !== "Perfect") throw new Error("quality perfect");
if (SB.gameQuality("cpu", 0, 7, { final: 80 }) !== "Horrible") throw new Error("quality horrible");

SB.beginMatch();
SB.addAbilityRestore("player", 10);
SB.markAbilityKnock("player", "cpu");
SB.onFinish("player", "Xtreme", { rpm: 0.5 });
const packed = SB.packMatch();
if (packed.player.abilityRestore < 10) throw new Error("restore tracked");
if (packed.player.abilityPockets !== 1) throw new Error("ability pocket credited");
if (!packed.highlight.steps || !packed.highlight.steps.length) {
    /* no chain steps without big/rail — ok */
}

const csv = fs.readFileSync(path.join(__dirname, "spin-wars-x-scoreboard.csv"), "utf8");
if (/XRAIL_SPIN|X-Rail → Spin|X-Rail Dashes|decisive/i.test(csv) && /XRAIL_SPIN/.test(csv)) {
    throw new Error("csv still has removed x-rail finish rows");
}
if (!/xrailRides/.test(csv) || !/ABILITY_POCKET/.test(csv) || !/RPM_BAND1/.test(csv) || !/gameQuality/.test(csv)) {
    throw new Error("csv missing new scoreboard rows");
}
console.log("ok base", base, "final", t2.final, "rpm700", SB.rpmPts(700), "rpm520", SB.rpmPts(520));
console.log("all scoreboard asserts passed");
