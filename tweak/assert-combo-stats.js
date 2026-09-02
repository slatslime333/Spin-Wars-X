/* node tweak/assert-combo-stats.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function stubEl(){
  const el = {
    style: {},
    classList: { add(){}, remove(){}, contains(){ return false; }, toggle(){} },
    dataset: {},
    children: [],
    innerHTML: "",
    textContent: "",
    id: "",
    className: "",
    appendChild(){ return this; },
    remove(){},
    setAttribute(){},
    getAttribute(){ return null; },
    addEventListener(){},
    removeEventListener(){},
    querySelector(){ return stubEl(); },
    querySelectorAll(){ return []; },
    closest(){ return null; },
    focus(){}
  };
  return el;
}

const sandbox = {
  console,
  Math, JSON, Date, Number, String, Object, Array, Boolean,
  parseInt, parseFloat, isNaN, isFinite, Infinity, NaN, undefined,
  setTimeout(){ return 0; },
  clearTimeout(){},
  setInterval(){ return 0; },
  clearInterval(){},
  requestAnimationFrame(){ return 0; },
  cancelAnimationFrame(){},
  performance: { now(){ return 0; } },
  localStorage: { getItem(){ return null; }, setItem(){}, removeItem(){} },
  sessionStorage: { getItem(){ return null; }, setItem(){}, removeItem(){} },
  navigator: { userAgent: "node", serviceWorker: null },
  location: { href: "http://localhost/", reload(){} },
  Image: function(){ this.onload=null; this.src=""; },
  HTMLElement: function(){},
  Node: function(){},
  addEventListener(){},
  removeEventListener(){}
};
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.document = {
  readyState: "complete",
  body: stubEl(),
  head: stubEl(),
  documentElement: stubEl(),
  hidden: false,
  getElementById(){ return null; },
  querySelector(){ return null; },
  querySelectorAll(){ return []; },
  createElement(){ return stubEl(); },
  createTextNode(){ return stubEl(); },
  addEventListener(){},
  removeEventListener(){}
};

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8"), sandbox);
vm.runInContext(`
  this.calculateComboStats = calculateComboStats;
  this.BIT_ENGINE = BIT_ENGINE;
  this.BIT_PHYSICS = BIT_PHYSICS;
  this.BLADE_ENGINE = BLADE_ENGINE;
  this.RATCHETS = RATCHETS;
`, sandbox);

const calc = sandbox.calculateComboStats;
const bits = sandbox.BIT_ENGINE;
const blades = sandbox.BLADE_ENGINE;
const ratchets = sandbox.RATCHETS;
if(typeof calc !== "function") throw new Error("calculateComboStats missing");

function bit(name){
  return Object.values(bits).find(b => b && b.name === name);
}
function rat(name){
  return ratchets.find(r => r.name === name);
}
function blade(key){
  return blades[key];
}
function row(bl, rName, bName){
  const c = calc(bl, rat(rName), bit(bName));
  if(!c) throw new Error("combo failed " + bl.name + " " + rName + " " + bName);
  const s = c.stats;
  return {
    kit: `${bl.name} ${rName} ${bName}`,
    ovr: c.ovr, meta: c.meta,
    atk: s.attack, kno: s.knockback, def: s.defense,
    bal: s.balance, mob: s.mobility, sta: s.stamina, bst: s.burst
  };
}
function print(title, rows){
  console.log("\n== " + title + " ==");
  console.log("kit".padEnd(42) + "OVR META  ATK KNO DEF BAL MOB STA BST");
  rows.forEach(r => {
    console.log(
      r.kit.padEnd(42) +
      [r.ovr, r.meta, r.atk, r.kno, r.def, r.bal, r.mob, r.sta, r.bst]
        .map(n => String(n).padStart(4)).join("")
    );
  });
}

const rod = blade("wizard_rod");
const dran = blade("dran_sword");
const pegasus = blade("aero_pegasus");
const wolf = blade("silver_wolf") || blade("silverwolf");
const phoenix = blade("phoenix_wing");

const holdBits = ["Needle", "Ball", "Hexa"];
const holdRows = [];
for(const h of ["3-60", "3-70", "3-80"]){
  for(const b of holdBits) holdRows.push(row(rod, h, b));
}
print("Wizard Rod hold triangle (Needle > Ball > Hexa STA; Hexa > Ball > Needle DEF/BAL)", holdRows);

const attackBits = ["Rush", "Low Rush", "Kick", "Quake", "Flat"];
print("Dran Sword 1-60 attack family", attackBits.concat(["Low Flat"]).map(b => row(dran, "1-60", b)));
print("Aero Pegasus 9-60 attack family", attackBits.concat(["Low Flat"]).map(b => row(pegasus, "9-60", b)));

print("Burst: 4-80 vs 9-60 (same blade + Needle)", [
  row(rod, "4-80", "Needle"),
  row(rod, "9-60", "Needle"),
  row(dran, "4-80", "Rush"),
  row(dran, "9-60", "Rush")
]);

print("Height on Wizard Rod Hexa", [
  row(rod, "9-60", "Hexa"),
  row(rod, "9-70", "Hexa"),
  row(rod, "9-80", "Hexa")
]);

if(wolf){
  print("Silver Wolf stamina bits 9-60", holdBits.concat(["Orb","Wedge"]).map(b => row(wolf, "9-60", b)));
}

const fails = [];
function expect(ok, msg){ if(!ok) fails.push(msg); }

const n60 = row(rod, "3-60", "Needle");
const b60 = row(rod, "3-60", "Ball");
const h60 = row(rod, "3-60", "Hexa");
expect(n60.sta > b60.sta, `Needle STA ${n60.sta} should beat Ball ${b60.sta}`);
expect(b60.sta > h60.sta, `Ball STA ${b60.sta} should beat Hexa ${h60.sta}`);
expect(h60.def > b60.def, `Hexa DEF ${h60.def} should beat Ball ${b60.def}`);
expect(b60.def > n60.def, `Ball DEF ${b60.def} should beat Needle ${n60.def}`);
expect(h60.bal > b60.bal, `Hexa BAL ${h60.bal} should beat Ball ${b60.bal}`);
expect(b60.bal > n60.bal, `Ball BAL ${b60.bal} should beat Needle ${n60.bal}`);

const rush = row(dran, "1-60", "Rush");
const low = row(dran, "1-60", "Low Rush");
const lowFlat = row(dran, "1-60", "Low Flat");
const kick = row(dran, "1-60", "Kick");
const quake = row(dran, "1-60", "Quake");
expect(low.atk > rush.atk, `Low Rush ATK ${low.atk} > Rush ${rush.atk}`);
expect(low.kno > rush.kno, `Low Rush KNO ${low.kno} > Rush ${rush.kno}`);
expect(low.sta <= 60, `Low Rush STA ${low.sta} should dump (≤60)`);
expect(low.sta < rush.sta - 8, `Low Rush STA ${low.sta} should sit well under Rush ${rush.sta}`);
expect(low.bal < rush.bal, `Low Rush BAL ${low.bal} < Rush ${rush.bal}`);
expect(lowFlat.sta < low.sta, `Low Flat STA ${lowFlat.sta} < Low Rush ${low.sta}`);
expect(kick.bal > rush.bal, `Kick BAL ${kick.bal} > Rush ${rush.bal}`);
expect(kick.atk < low.atk, `Kick ATK ${kick.atk} < Low Rush ${low.atk}`);
expect(quake.sta <= 42, `Quake STA ${quake.sta} should dump (≤42)`);
expect(quake.sta < lowFlat.sta, `Quake STA ${quake.sta} < Low Flat ${lowFlat.sta}`);
expect(quake.kno > rush.kno, `Quake KNO ${quake.kno} > Rush ${rush.kno}`);

const pegRush = row(pegasus, "9-60", "Rush");
const pegLow = row(pegasus, "9-60", "Low Rush");
const pegLowFlat = row(pegasus, "9-60", "Low Flat");
const pegQuake = row(pegasus, "9-60", "Quake");
expect(pegLow.sta <= 60, `Pegasus Low Rush STA ${pegLow.sta} still dumps`);
expect(pegLowFlat.sta < pegLow.sta, `Pegasus Low Flat ${pegLowFlat.sta} < Low Rush ${pegLow.sta}`);
expect(pegQuake.sta < pegLowFlat.sta, `Pegasus Quake ${pegQuake.sta} < Low Flat ${pegLowFlat.sta}`);
expect(pegQuake.sta <= 48, `Pegasus Quake STA ${pegQuake.sta} is the floor dump`);

const allBits = Object.values(bits).filter(b => b && b.name !== "Taper" && b.name !== "High Needle" && b.name !== "Elevate");
const pegAll = allBits.map(b => row(pegasus, "9-60", b.name));
const worst = pegAll.reduce((a, r) => r.sta < a.sta ? r : a);
expect(worst.kit.endsWith("Quake"), `worst Pegasus STA should be Quake, got ${worst.kit} ${worst.sta}`);
const dranAll = allBits.map(b => row(dran, "1-60", b.name));
const worstDran = dranAll.reduce((a, r) => r.sta < a.sta ? r : a);
expect(worstDran.kit.endsWith("Quake"), `worst Dran STA should be Quake, got ${worstDran.kit} ${worstDran.sta}`);

const n80 = row(rod, "3-80", "Needle");
const n60b = row(rod, "3-60", "Needle");
expect(n80.bal < n60b.bal - 4, `80 Needle BAL ${n80.bal} should be clearly worse than 60 ${n60b.bal}`);
expect(n80.bst < n60b.bst - 6, `80 Needle BST ${n80.bst} should be clearly worse than 60 ${n60b.bst}`);

const burst80 = row(rod, "4-80", "Needle");
const burst60 = row(rod, "9-60", "Needle");
expect(burst80.bst < burst60.bst - 8, `4-80 burst ${burst80.bst} should lose to 9-60 ${burst60.bst}`);

const lrPhys = sandbox.BIT_PHYSICS["Low Rush"];
const rPhys = sandbox.BIT_PHYSICS.Rush;
const kPhys = sandbox.BIT_PHYSICS.Kick;
const qPhys = sandbox.BIT_PHYSICS.Quake;
expect(lrPhys.attackBias > rPhys.attackBias, "Low Rush attackBias > Rush");
expect(lrPhys.stability < rPhys.stability, "Low Rush stability < Rush");
expect(lrPhys.spinDrain > rPhys.spinDrain, "Low Rush drain > Rush");
const lfPhys = sandbox.BIT_PHYSICS["Low Flat"];
expect(lfPhys.spinDrain > lrPhys.spinDrain, `Low Flat drain ${lfPhys.spinDrain} > Low Rush ${lrPhys.spinDrain}`);
expect(qPhys.spinDrain > lfPhys.spinDrain, `Quake drain ${qPhys.spinDrain} > Low Flat ${lfPhys.spinDrain}`);
expect(qPhys.spinDrain > lrPhys.spinDrain + 1.2, `Quake drain ${qPhys.spinDrain} should dwarf Low Rush ${lrPhys.spinDrain}`);
expect(kPhys.stability > rPhys.stability, "Kick stability > Rush (hybrid hold)");
expect(sandbox.BIT_ENGINE.kick.type === "Balance", "Kick type is Balance");
expect(sandbox.BIT_ENGINE.low_rush.card.attack > sandbox.BIT_ENGINE.rush.card.attack, "card Low Rush ATK > Rush");
expect(sandbox.BIT_ENGINE.low_rush.card.knockback > sandbox.BIT_ENGINE.rush.card.knockback, "card Low Rush KB > Rush");
expect(sandbox.BIT_ENGINE.low_rush.behavior.aggression > sandbox.BIT_ENGINE.rush.behavior.aggression, "Low Rush aggression > Rush");
expect(sandbox.BIT_ENGINE.kick.card.balance > sandbox.BIT_ENGINE.rush.card.balance, "card Kick BAL > Rush");

if(fails.length){
  console.error("\nFAILED\n" + fails.join("\n"));
  process.exit(1);
}
console.log("\nall combo-stat asserts passed");
