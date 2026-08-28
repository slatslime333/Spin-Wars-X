/* Source + charge-key asserts. Run: node tweak/assert-ability-quickplay.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const abilities = fs.readFileSync(path.join(root, "abilities.js"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const csv = fs.readFileSync(path.join(root, "tweak/spin-wars-x-balance.csv"), "utf8");
const checks = [
  [/const IRON_MS=3000/, abilities, "Iron Skin 3s"],
  [/const FREE_SPIN_CHANCE=0\.15/, abilities, "Free Spin 15%"],
  [/pExtraRpm=0\.010\+Math\.random\(\)\*0\.030/, abilities, "Double Edge player 1–4"],
  [/cExtraRpm=0\.010\+Math\.random\(\)\*0\.030/, abilities, "Double Edge cpu 1–4"],
  [/1–4 extra RPM/, abilities, "Double Edge blurb"],
  [/Each clash: 15% chance/, abilities, "Free Spin blurb"],
  [/2 uses a match\. 3s\. Clash RPM/, abilities, "Iron Skin blurb"],
  [/function syncMatchCharges/, abilities, "syncMatchCharges exists"],
  [/function matchChargeKey/, abilities, "matchChargeKey exists"],
  [/SpinWarsAbilities\.resetMatch\(\)/, app, "Quick Match resets charges"],
  [/syncMatchCharges/, app, "combo/VS sync charges"],
  [/IRON_MS,3000/, csv, "CSV Iron Skin 3s"],
  [/free_spin_chance,0\.15/, csv, "CSV Free Spin 15%"],
  [/double_edge_plus_rpm,0\.010–0\.040/, csv, "CSV Double Edge 1–4"]
];
let fail = 0;
for (const [re, src, label] of checks) {
  if (!re.test(src)) {
    console.error("FAIL", label);
    fail++;
  } else console.log("ok", label);
}
if (fail) process.exit(1);
console.log("all ability-quickplay asserts passed");
