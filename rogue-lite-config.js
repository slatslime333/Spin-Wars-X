/* SPIN WARS X — ROGUE LITE CONFIG
 * Pack odds, economy, Awakening thresholds. No UI. No battle rules.
 * Separate from Campaign (rogue-run-config.js).
 */
(function(global){
"use strict";

const FINAL_MATCH=30;
const BOSS_AT={10:"mini",20:"mini",30:"final"};
const MIX_FROM=26;
const MIX_TO=29;

/** Starter money: ~1–2 run entries, not enough for any pack. */
const STARTING_MONEY=80;
const RUN_COST=40;

const AWAKENING_THRESHOLDS={1:5,2:10,3:15};
const GOLD_DEFAULT_RUNS=2;
const GOLD_EXTEND_BASE=90;
const GOLD_EXTEND_STEP=35;

const SELL={
    Bronze:18,
    Silver:42,
    Gold:95
};

const STARTER_GRANT={bronze:3,silver:2};

/** Pack catalog — prices climb; Premium Gold is a grind, not a joke. */
const PACKS={
    bey_bronze:{
        id:"bey_bronze",family:"bey",tier:"Bronze",name:"BRONZE BEY PACK",
        price:120,blurb:"1 Bronze blade."
    },
    bey_bronze_rare:{
        id:"bey_bronze_rare",family:"bey",tier:"Bronze",name:"RARE BRONZE BEY PACK",
        price:200,blurb:"2 blades. Mostly Bronze. Tiny Silver chance."
    },
    bey_bronze_premium:{
        id:"bey_bronze_premium",family:"bey",tier:"Bronze",name:"PREMIUM BRONZE BEY PACK",
        price:290,blurb:"3 blades. Mostly Bronze. Tiny Silver chance."
    },
    bey_silver:{
        id:"bey_silver",family:"bey",tier:"Silver",name:"SILVER BEY PACK",
        price:260,blurb:"2 blades. Mostly Silver. Tiny Bronze chance."
    },
    bey_silver_rare:{
        id:"bey_silver_rare",family:"bey",tier:"Silver",name:"RARE SILVER BEY PACK",
        price:380,blurb:"3 Silver blades."
    },
    bey_gold:{
        id:"bey_gold",family:"bey",tier:"Gold",name:"GOLD BEY PACK",
        price:420,blurb:"1 Gold rental blade."
    },
    bey_gold_rare:{
        id:"bey_gold_rare",family:"bey",tier:"Gold",name:"RARE GOLD BEY PACK",
        price:560,blurb:"1 Gold + 1 flex + 2 Bronze."
    },
    bey_gold_premium:{
        id:"bey_gold_premium",family:"bey",tier:"Gold",name:"PREMIUM GOLD BEY PACK",
        price:780,blurb:"5 cards. Guaranteed Gold chase."
    },
    part_bronze:{
        id:"part_bronze",family:"part",tier:"Bronze",name:"BRONZE PART PACK",
        price:110,blurb:"1 temp part. Low bit / 60–70 odds."
    },
    part_silver:{
        id:"part_silver",family:"part",tier:"Silver",name:"SILVER PART PACK",
        price:190,blurb:"2 temp parts. Mid bit / 60–70. Tiny 80."
    },
    part_gold:{
        id:"part_gold",family:"part",tier:"Gold",name:"GOLD PART PACK",
        price:310,blurb:"3 temp parts. High bit / 60. No 80."
    },
    mod_pack:{
        id:"mod_pack",family:"mod",tier:"Gold",name:"MODIFIER PACK",
        price:340,blurb:"2 random run mods from the Rogue pool. Pick one at run start."
    }
};

function clamp01(n){return Math.max(0,Math.min(1,Number(n)||0));}
function chance(p){return Math.random()<clamp01(p);}

function nightMoney(win,night,opts){
    opts=opts||{};
    const m=Math.max(1,Number(night)||1);
    if(opts.endless) return win?14:7;
    const base=win?(16+m):(8+Math.floor(m/2));
    return base+(opts.shark&&win?60:0);
}

/** Lite CPU pressure helpers — Phase 3. Collection depth softens early / squeezes late. */
function liteCollectionBand(ownedCount){
    const n=Math.max(0,Number(ownedCount)||0);
    if(n<=5) return -0.035;   // starter pool
    if(n<=8) return -0.01;
    if(n<=12) return 0.015;
    return 0.035;              // deep collection
}

function liteNightMix(match,boss){
    const m=Math.max(1,Number(match)||1);
    if(boss){
        if(m<=10) return {easy:0.24,even:0.52,hard:0.24};
        if(m<=20) return {easy:0.14,even:0.50,hard:0.36};
        return {easy:0.08,even:0.44,hard:0.48};
    }
    // Starter-clearable early; late nights punish thin builds harder than Campaign Track.
    if(m<=3) return {easy:0.52,even:0.40,hard:0.08};
    if(m<=6) return {easy:0.42,even:0.46,hard:0.12};
    if(m<=9) return {easy:0.32,even:0.50,hard:0.18};
    if(m<=14) return {easy:0.24,even:0.50,hard:0.26};
    if(m<=19) return {easy:0.18,even:0.48,hard:0.34};
    if(m<=25) return {easy:0.12,even:0.46,hard:0.42};
    return {easy:0.08,even:0.42,hard:0.50};
}

function goldExtendCost(extendCount){
    const n=Math.max(0,Number(extendCount)||0);
    return GOLD_EXTEND_BASE+n*GOLD_EXTEND_STEP;
}

function packList(){
    return Object.keys(PACKS).map(k=>PACKS[k]);
}

function packById(id){return PACKS[id]||null;}

global.SpinWarsRogueLiteConfig={
    FINAL_MATCH,BOSS_AT,MIX_FROM,MIX_TO,
    STARTING_MONEY,RUN_COST,
    AWAKENING_THRESHOLDS,GOLD_DEFAULT_RUNS,GOLD_EXTEND_BASE,GOLD_EXTEND_STEP,
    SELL,STARTER_GRANT,PACKS,
    nightMoney,goldExtendCost,packList,packById,chance,
    liteCollectionBand,liteNightMix,
    rules:{
        finalMatch:FINAL_MATCH,
        bossAt:BOSS_AT,
        mixFrom:MIX_FROM,
        mixTo:MIX_TO,
        label:"ROGUE"
    },
    /** Slot odds used by the opener (Phase 2 theater). Phase 1 grants use these. */
    odds:{
        bronzeBeySilver:0.04,
        silverBeyBronze:0.06,
        rareGoldFlexGold:0.08,
        rareGoldFlexSilver:0.92,
        premiumFlexGold:0.72,
        premiumThirdGold:0.28
    }
};
})(typeof window!=="undefined"?window:globalThis);
