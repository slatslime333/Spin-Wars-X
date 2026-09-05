/* SPIN WARS X — ROGUE RUN CONFIG
 * Track, payout, calendar. No UI. No battle rules.
 */
(function(global){
"use strict";

const FINAL_MATCH=30;
const BOSS_AT={10:"mini",20:"mini",30:"final"};
const MIX_FROM=26;
const MIX_TO=29;
const MAX_LEVEL=25;
const STAT_MAX=99;
const STARTER_BLADES=["shelter_drake","knight_shield"];
const STARTER_RATCHETS=["5-80","4-80"];
const STARTER_BITS=["Needle","Flat"];

const TRACK=[
    {n:1,kind:"ratchet",name:"3-80"},
    {n:2,kind:"bit",name:"Orb"},
    {n:3,kind:"other-starter"},
    {n:4,kind:"ratchet",name:"5-70"},
    {n:5,kind:"ratchet",name:"1-80"},
    {n:6,kind:"blade",id:"arrow_wizard"},
    {n:7,kind:"ratchet",name:"6-80"},
    {n:8,kind:"blade",id:"leon_claw"},
    {n:9,kind:"ratchet",name:"7-80"},
    {n:10,kind:"bit",name:"Low Flat"},
    {n:11,kind:"ratchet",name:"9-80"},
    {n:12,kind:"blade",id:"viper_tail"},
    {n:13,kind:"bit",name:"Wedge"},
    {n:14,kind:"bundle",parts:[{kind:"ratchet",name:"3-70"},{kind:"ratchet",name:"4-70"}]},
    {n:15,kind:"blade",id:"knight_mail"},
    {n:16,kind:"ratchet",name:"6-70"},
    {n:17,kind:"ratchet",name:"9-70"},
    {n:18,kind:"bundle",parts:[{kind:"blade",id:"shark_edge"},{kind:"bit",name:"Quake"}]},
    {n:19,kind:"ratchet",name:"4-60"},
    {n:20,kind:"bit",name:"Kick"},
    {n:21,kind:"bundle",parts:[{kind:"ratchet",name:"7-70"},{kind:"ratchet",name:"1-70"}]},
    {n:22,kind:"blade",id:"leon_crest"},
    {n:23,kind:"bit",name:"Low Rush"},
    {n:24,kind:"blade",id:"dran_sword"},
    {n:25,kind:"ratchet",name:"7-60"},
    {n:26,kind:"blade",id:"unicorn_sting"},
    {n:27,kind:"bit",name:"Point"},
    {n:28,kind:"bit",name:"Rush"},
    {n:29,kind:"blade",id:"tyranno_beat"},
    {n:30,kind:"bit",name:"Level"},
    {n:31,kind:"ratchet",name:"5-60"},
    {n:32,kind:"blade",id:"silver_wolf"},
    {n:33,kind:"ratchet",name:"6-60"},
    {n:34,kind:"ratchet",name:"3-60"},
    {n:35,kind:"bit",name:"Ball"},
    {n:36,kind:"bit",name:"Hexa"},
    {n:37,kind:"blade",id:"phoenix_wing"},
    {n:38,kind:"ratchet",name:"9-60"},
    {n:39,kind:"ratchet",name:"1-60"},
    {n:40,kind:"blade",id:"aero_pegasus"},
    {n:41,kind:"blade",id:"wizard_rod"}
];

function levelForRow(n){
    return 1+Math.ceil((Number(n)||1)*24/41);
}

function unitPrice(kind,n){
    const i=Number(n)||1;
    if(kind==="ratchet") return 34+i;
    if(kind==="bit") return 48+i*2;
    return Math.round(70+i*1.6);
}

function rowPrice(row){
    if(!row) return 0;
    if(row.kind==="bundle"){
        const sum=(row.parts||[]).reduce((s,p)=>s+unitPrice(p.kind,row.n),0);
        return Math.round(sum*0.88);
    }
    if(row.kind==="other-starter") return unitPrice("blade",row.n);
    return unitPrice(row.kind,row.n);
}

TRACK.forEach(row=>{
    row.level=levelForRow(row.n);
    row.price=rowPrice(row);
});

function levelNeed(level){
    const lv=Math.max(1,Number(level)||1);
    if(lv>=MAX_LEVEL) return 0;
    if(lv===1) return 50;
    return Math.round(38+lv*5);
}

function nightMoney(win,night,opts){
    opts=opts||{};
    const m=Math.max(1,Number(night)||1);
    if(opts.endless) return win?10:5;
    const base=win?(12+m):(6+Math.floor(m/2));
    return base+(opts.shark&&win?48:0);
}

function nightExp(win,night,opts){
    opts=opts||{};
    const m=Math.max(1,Number(night)||1);
    if(opts.endless) return win?8:4;
    const base=win?(15+m):(6+Math.floor(m/2));
    return base+(opts.shark&&win?36:0);
}

function cpuLane(match){
    const m=Math.max(1,Number(match)||1);
    if(m>=FINAL_MATCH) return "final";
    if(m<=9) return "Bronze";
    if(m<=19) return "Silver";
    if(m<=25) return "Gold";
    return "mix";
}

global.SpinWarsRogueRunConfig={
    FINAL_MATCH,BOSS_AT,MIX_FROM,MIX_TO,MAX_LEVEL,STAT_MAX,
    STARTER_BLADES,STARTER_RATCHETS,STARTER_BITS,TRACK,
    levelForRow,rowPrice,levelNeed,nightMoney,nightExp,cpuLane,
    RANDOMIZE_BONUS:6,
    rules:{
        finalMatch:FINAL_MATCH,
        bossAt:BOSS_AT,
        mixFrom:MIX_FROM,
        mixTo:MIX_TO,
        label:"ROGUE RUN"
    }
};
})(typeof window!=="undefined"?window:globalThis);
