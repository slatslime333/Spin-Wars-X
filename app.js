/*==================================
 SPIN WAR X
 Version 0.7.2 — V99 MOVEMENT CORE REBUILD
==================================*/

//=========================
// GAME STATE
//=========================

const Game = {

    version:"0.7.2",

    screen:"menu",

    mode:null,

    player:{
        blade:null,
        ratchet:null,
        bit:null,

       launch:{
    angle:null,
    technique:null,
    quality:null,
    gamble:false
}
    },

    cpu:{
        blade:null,
        ratchet:null,
        bit:null,

       launch:{
    angle:null,
    technique:null,
    quality:null,
    gamble:false
}
    },

    match:{

    round:1,

    playerPoints:0,

    cpuPoints:0

},

arena:{

    playerSide:null,
    cpuSide:null,

    playerColor:null,
    cpuColor:null,

    xRail:"Top",
    xExit:"Top",

    playerLane:null,
    cpuLane:null

},

battle:{

    phase:"Opening",
    engineMode:"unified",

    openingWinner:null,

    centerControl:null,

    momentum:0,

    exchange:0,

    finished:false,
    matchStarted:false,
    matchFinished:false,
    decisionCooldown:0,

    player:{
        zone:"Center",
        previousZone:"Center",
        side:null,
        direction:"Clockwise",
        rail:false,
        xExit:false,
        speed:0,
        spin:100,
        balance:100,

     attackBonus:0,
defenseBonus:0,
railSpeed:0,
momentum:0
    },

    cpu:{
        zone:"Center",
        previousZone:"Center",
        side:null,
        direction:"CounterClockwise",
        rail:false,
        xExit:false,
        speed:0,
        spin:100,
        balance:100,

     attackBonus:0,
defenseBonus:0,
railSpeed:0,
momentum:0
    }

},

 }; 

//=========================
// ENGINE 2.0 DATABASES
//=========================

const BLADE_ENGINE = {

    silver_wolf:{

        name:"Silver Wolf",
        type:"Defense",
        tier:"Gold",
        spin:"Right",
        weight:37.4,

        card:{ovr:92,attack:64,knockback:72,defense:92,mobility:58,balance:94,stamina:97,burst:91},

        physics:{
            weightClass:"Heavy",
            centerOfGravity:"Low",
            contactShape:"Round",
            recoil:"Very Low",
            lockStrength:94,
            weightDistribution:"Outer"
        },

        behavior:{
            attackStyle:"Counter",
            smashPower:18,
            upperPower:8,
            barragePower:32,
            counterPower:95,
            movementControl:94,
            spinRetention:98,
            lad:99,
            burstResistance:95,

            winConditions:{
                spin:92,
                burst:78,
                knockout:34,
                counter:100
            }
        },

        compatibility:{
            heights:{
                60:90,
                70:90,
                80:55
            },

            bits:{
                Hexa:100,
                Wedge:95,
                Ball:98,
                Orb:88,
                Level:78,
                Elevate:76,
                Flat:40,
                LowFlat:40,
                Rush:40,
                LowRush:42,
                Kick:22,
                Needle:78
            }
        },

        traits:[
            "Counter",
            "Heavy",
            "LAD",
            "Defense",
            "Stable"
        ],

        personality:{
            aggression:19,
            control:98,
            consistency:99,
            risk:10
        }

    },

    phoenix_wing:{

        name:"Phoenix Wing",
        type:"Attack",
        tier:"Gold",
        spin:"Right",
        weight:38.0,

        card:{ovr:94,attack:94,knockback:94,defense:86,mobility:82,balance:86,stamina:82,burst:87},

        physics:{
            weightClass:"Very Heavy",
            centerOfGravity:"Medium",
            contactShape:"Smash",
            recoil:"Medium",
            lockStrength:87,
            weightDistribution:"Outer"
        },

        behavior:{
            attackStyle:"Smash",
            smashPower:99,
            upperPower:72,
            barragePower:68,
            counterPower:42,
            movementControl:86,
            spinRetention:76,
            lad:73,
            burstResistance:87,

            winConditions:{
                spin:55,
                burst:96,
                knockout:99,
                counter:60
            }
        },

        compatibility:{
            heights:{
                60:98,
                70:91,
                80:52
            },

            bits:{
                Rush:100,
                LowRush:98,
                Flat:95,
                LowFlat:96,
                Kick:93,
                Level:76,
                Hexa:60,
                Wedge:35,
                Ball:28,
                Orb:36,
                Needle:30,
                Elevate:75
            }
        },

        traits:[
            "Heavy",
            "Smash",
            "Aggressive",
            "Attack",
            "Power"
        ],

        personality:{
            aggression:100,
            control:82,
            consistency:78,
            risk:78
        }

    },

    wizard_rod:{

        name:"Wizard Rod",
        type:"Stamina",
        tier:"Gold",
        spin:"Right",
        weight:37.0,

        card:{ovr:98,attack:62,knockback:68,defense:91,mobility:46,balance:98,stamina:99,burst:94},

        physics:{
            weightClass:"Heavy",
            centerOfGravity:"Very Low",
            contactShape:"Round",
            recoil:"Very Low",
            lockStrength:92,
            weightDistribution:"Outer"
        },

        behavior:{
            attackStyle:"Stamina",
            smashPower:22,
            upperPower:14,
            barragePower:35,
            counterPower:70,
            movementControl:97,
            spinRetention:100,
            lad:100,
            burstResistance:92,

            winConditions:{
                spin:100,
                burst:52,
                knockout:18,
                counter:60
            }
        },

        compatibility:{
            heights:{
                60:99,
                70:94,
                80:70
            },

            bits:{
                Ball:99,
                Orb:92,
                Hexa:99,
                Needle:80,
                Wedge:90,
                Elevate:74,
                Level:75,
                Flat:70,
                LowFlat:70,
                Rush:95,
                LowRush:90,
                Kick:77
            }
        },

        traits:[
            "Stamina",
            "LAD",
            "Stable",
            "Heavy",
            "Spin Finish"
        ],

        personality:{
    aggression:9,
    control:99,
    consistency:99,
    risk:4

      }

    },
 
    shark_edge:{

        name:"Shark Edge",
        type:"Attack",
        tier:"Silver",
        spin:"Right",
        weight:35.6,

        card:{ovr:86,attack:96,knockback:91,defense:61,mobility:94,balance:62,stamina:60,burst:74},

        physics:{
            weightClass:"Medium",
            centerOfGravity:"Low",
            contactShape:"Upper Smash",
            recoil:"High",
            lockStrength:72,
            weightDistribution:"Forward"
        },

        behavior:{
            attackStyle:"Rush",
            smashPower:92,
            upperPower:95,
            barragePower:74,
            counterPower:28,
            movementControl:90,
            spinRetention:66,
            lad:58,
            burstResistance:73,

            winConditions:{
                spin:24,
                burst:90,
                knockout:98,
                counter:30
            }
        },

        compatibility:{
            heights:{
                60:99,
                70:84,
                80:38
            },

            bits:{
                LowRush:100,
                Rush:98,
                LowFlat:98,
                Flat:94,
                Kick:90,
                Level:84,
                Hexa:30,
                Wedge:25,
                Ball:18,
                Orb:20,
                Needle:15,
                Elevate:50
            }
        },

        traits:[
            "Upper Attack",
            "Aggressive",
            "Fast",
            "Knockout",
            "Glass Cannon"
        ],

        personality:{
            aggression:99,
            control:76,
            consistency:68,
            risk:95

           }
     
        },

       dran_sword:{

        name:"Dran Sword",
        type:"Attack",
        tier:"Silver",
        spin:"Right",
        weight:35.8,

        card:{
         ovr:84,
         
            attack:88,
            knockback:86,
            defense:70,
            mobility:84,
            balance:73,
            stamina:66,
            burst:78
        },

        physics:{
            weightClass:"Medium",
            centerOfGravity:"Low",
            contactShape:"Smash",
            recoil:"High",
            lockStrength:78,
            weightDistribution:"Balanced"
        },

        behavior:{
            attackStyle:"Smash",
            smashPower:90,
            upperPower:72,
            barragePower:82,
            counterPower:34,
            movementControl:82,
            spinRetention:72,
            lad:62,
            burstResistance:78,

            winConditions:{
                spin:36,
                burst:88,
                knockout:93,
                counter:42
            }
        },

        compatibility:{
            heights:{
                60:98,
                70:88,
                80:44
            },

            bits:{
                LowRush:96,
                Rush:98,
                Flat:94,
                LowFlat:94,
                Kick:92,
                Level:82,
                Elevate:66,
                Hexa:42,
                Wedge:30,
                Ball:24,
                Orb:26,
                Needle:18
            }
        },

        traits:[
            "Smash Attack",
            "Aggressive",
            "Versatile",
            "Fast"
        ],

        personality:{
            aggression:90,
            control:80,
            consistency:78,
            risk:82
         
        }

    },

    knight_mail:{

        name:"Knight Mail",
        type:"Defense",
        tier:"Silver",
        spin:"Right",
        weight:36.0,

        card:{ovr:84,attack:68,knockback:85,defense:89,mobility:60,balance:88,stamina:76,burst:91},

        physics:{
            weightClass:"Heavy",
            centerOfGravity:"Low",
            contactShape:"Round",
            recoil:"Low",
            lockStrength:91,
            weightDistribution:"Outer"
        },

        behavior:{
            attackStyle:"Counter",
            smashPower:44,
            upperPower:70,
            barragePower:56,
            counterPower:91,
            movementControl:90,
            spinRetention:86,
            lad:82,
            burstResistance:91,

            winConditions:{
                spin:82,
                burst:64,
                knockout:58,
                counter:92
            }
        },

        compatibility:{
            heights:{
                60:98,
                70:94,
                80:60
            },

            bits:{
                Hexa:88,
                Wedge:90,
                Needle:40,
                Ball:82,
                Orb:80,
                Level:93,
                Elevate:80,
                Flat:80,
                LowFlat:75,
                Rush:94,
                LowRush:96,
                Kick:82
            }
        },

        traits:[
            "Counter",
            "Defense",
            "Heavy",
            "Stable"
        ],

        personality:{
            aggression:38,
            control:94,
            consistency:92,
            risk:24
        }

    },

    shelter_drake:{

        name:"Shelter Drake",
        type:"Balance",
        tier:"Bronze",
        spin:"Right",
        weight:32.4,

        card:{ovr:72,attack:69,knockback:72,defense:70,mobility:80,balance:82,stamina:78,burst:70},

        physics:{
            weightClass:"Light",
            centerOfGravity:"Low",
            contactShape:"Thin Oval",
            recoil:"Medium",
            lockStrength:66,
            weightDistribution:"Balanced"
        },

        behavior:{
            attackStyle:"Precision Smash",
            smashPower:75,
            upperPower:58,
            barragePower:74,
            counterPower:52,
            movementControl:85,
            spinRetention:72,
            lad:68,
            burstResistance:66,

            winConditions:{
                spin:70,
                burst:40,
                knockout:30,
                counter:58
            }
        },

        compatibility:{
            heights:{
                60:100,
                70:82,
                80:42
            },

            bits:{
                LowRush:89,
                Rush:88,
                Flat:83,
                LowFlat:83,
                Kick:84,
                Level:82,
                Elevate:74,
                Hexa:44,
                Wedge:88,
                Ball:34,
                Orb:38,
                Needle:94
            }
        },

        traits:[
            "Precision",
            "Lightweight",
            "Smash Attack",
            "High Skill"
        ],

        personality:{
            aggression:86,
            control:78,
            consistency:62,
            risk:88
        }

    },

    arrow_wizard:{

        name:"Arrow Wizard",
        type:"Balance",
        tier:"Bronze",
        spin:"Right",
        weight:35.0,

        card:{ovr:72,attack:60,knockback:57,defense:74,mobility:59,balance:79,stamina:82,burst:74},

        physics:{
            weightClass:"Medium",
            centerOfGravity:"Centered",
            contactShape:"Multi Contact",
            recoil:"Medium",
            lockStrength:76,
            weightDistribution:"Balanced"
        },

        behavior:{
            attackStyle:"Balanced",
            smashPower:70,
            upperPower:42,
            barragePower:74,
            counterPower:70,
            movementControl:82,
            spinRetention:82,
            lad:78,
            burstResistance:76,

            winConditions:{
                spin:78,
                burst:58,
                knockout:64,
                counter:74
            }
        },

        compatibility:{
            heights:{
                60:88,
                70:100,
                80:82
            },

            bits:{
                Level:100,
                Orb:92,
                Ball:88,
                Hexa:84,
                Wedge:82,
                Elevate:86,
                Flat:72,
                LowFlat:66,
                Rush:68,
                LowRush:62,
                Kick:74,
                Needle:84
            }
        },

        traits:[
            "Balanced",
            "Versatile",
            "Consistent",
            "Control"
        ],

        personality:{
            aggression:56,
            control:90,
            consistency:90,
            risk:34
         
        }

    },

    viper_tail:{
   

        name:"Viper Tail",
        type:"Attack",
        tier:"Bronze",
        spin:"Right",
        weight:35.2,

        card:{ovr:73,attack:79,knockback:74,defense:63,mobility:83,balance:66,stamina:63,burst:70},

        physics:{
            weightClass:"Medium",
            centerOfGravity:"Forward",
            contactShape:"Upper Attack",
            recoil:"High",
            lockStrength:70,
            weightDistribution:"Forward"
        },

        behavior:{
            attackStyle:"Rush",
            smashPower:77,
            upperPower:80,
            barragePower:72,
            counterPower:32,
            movementControl:82,
            spinRetention:66,
            lad:60,
            burstResistance:70,

            winConditions:{
                spin:26,
                burst:74,
                knockout:90,
                counter:30
            }
        },

        compatibility:{
            heights:{
                60:100,
                70:82,
                80:40
            },

            bits:{
                LowRush:98,
                Rush:96,
                LowFlat:96,
                Flat:94,
                Kick:90,
                Level:78,
                Elevate:66,
                Hexa:32,
                Wedge:28,
                Ball:20,
                Orb:22,
                Needle:18
            }
        },

        traits:[
            "Upper Attack",
            "Fast",
            "Aggressive",
            "Glass Cannon"
        ],

        personality:{
            aggression:94,
            control:74,
            consistency:68,
            risk:90
        }

    },
 

    aero_pegasus:{name:"Aero Pegasus",type:"Attack",tier:"Gold",spin:"Right",weight:38.3,card:{ovr:96,attack:96,knockback:94,defense:81,mobility:92,balance:87,stamina:87,burst:91},physics:{weightClass:"Very Heavy",centerOfGravity:"Medium",contactShape:"Upper Smash",recoil:"Medium",lockStrength:91,weightDistribution:"Outer"},behavior:{attackStyle:"Smash",smashPower:96,upperPower:82,barragePower:72,counterPower:48,movementControl:88,spinRetention:84,lad:82,burstResistance:91,winConditions:{spin:70,burst:92,knockout:97,counter:58}},compatibility:{heights:{60:96,70:94,80:58},bits:{Rush:99,LowRush:99,Flat:92,LowFlat:94,Level:94,Kick:88,Point:86,HighNeedle:68,Quake:82,Hexa:72,Wedge:55,Ball:70,Orb:74,Elevate:80,Needle:60}},traits:["Versatile","Heavy","Smash","Attack","Stamina"],personality:{aggression:96,control:86,consistency:84,risk:72}},
    leon_crest:{name:"Leon Crest",type:"Defense",tier:"Silver",spin:"Right",weight:35.0,card:{ovr:79,attack:63,knockback:69,defense:95,mobility:50,balance:90,stamina:76,burst:85},physics:{weightClass:"Medium",centerOfGravity:"High",contactShape:"Round",recoil:"Low",lockStrength:84,weightDistribution:"Outer"},behavior:{attackStyle:"Counter",smashPower:32,upperPower:18,barragePower:36,counterPower:82,movementControl:86,spinRetention:74,lad:76,burstResistance:84,winConditions:{spin:58,burst:64,knockout:24,counter:90}},compatibility:{heights:{60:92,70:84,80:64},bits:{Needle:92,HighNeedle:95,Point:82,Hexa:90,Wedge:88,Ball:86,Orb:84,Elevate:72,Level:68,Rush:38,LowRush:34,Flat:30,LowFlat:28,Kick:48,Quake:30}},traits:["Defense","Round","Counter","Plastic Frame","Stability"],personality:{aggression:20,control:90,consistency:78,risk:20}},
    unicorn_sting:{name:"Unicorn Sting",type:"Balance",tier:"Silver",spin:"Right",weight:33.3,card:{ovr:83,attack:76,knockback:72,defense:84,mobility:64,balance:91,stamina:87,burst:88},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Hybrid",recoil:"Medium",lockStrength:88,weightDistribution:"Outer"},behavior:{attackStyle:"Counter Attack",smashPower:62,upperPower:36,barragePower:64,counterPower:88,movementControl:78,spinRetention:84,lad:86,burstResistance:88,winConditions:{spin:78,burst:76,knockout:48,counter:92}},compatibility:{heights:{60:96,70:82,80:48},bits:{Point:96,Level:88,Hexa:90,Elevate:82,Needle:84,HighNeedle:86,Ball:88,Orb:86,Wedge:80,Rush:68,LowRush:64,Flat:56,LowFlat:54,Kick:82,Quake:50}},traits:["Balance","Counter","Round","Stamina","Versatile"],personality:{aggression:58,control:88,consistency:86,risk:40}},
    knight_shield:{name:"Knight Shield",type:"Defense",tier:"Bronze",spin:"Right",weight:32.3,card:{ovr:71,attack:61,knockback:73,defense:78,mobility:56,balance:75,stamina:75,burst:80},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Tri-Wing",recoil:"High",lockStrength:84,weightDistribution:"Balanced"},behavior:{attackStyle:"Counter",smashPower:48,upperPower:24,barragePower:42,counterPower:82,movementControl:87,spinRetention:72,lad:70,burstResistance:80,winConditions:{spin:62,burst:68,knockout:34,counter:96}},compatibility:{heights:{60:96,70:88,80:68},bits:{Needle:98,HighNeedle:96,Point:84,Hexa:92,Wedge:90,Ball:86,Orb:84,Elevate:70,Level:62,Rush:38,LowRush:34,Flat:32,LowFlat:28,Kick:50,Quake:30}},traits:["Defense","Counter","Round","High Recoil","Stationary"],personality:{aggression:24,control:94,consistency:86,risk:18}},
    tyranno_beat:{name:"Tyranno Beat",type:"Attack",tier:"Gold",spin:"Right",weight:37.0,card:{ovr:88,attack:91,knockback:89,defense:72,mobility:84,balance:74,stamina:73,burst:84},physics:{weightClass:"Heavy",centerOfGravity:"Medium",contactShape:"Elliptical",recoil:"High",lockStrength:84,weightDistribution:"Outer"},behavior:{attackStyle:"Elliptical Smash",smashPower:90,upperPower:58,barragePower:72,counterPower:60,movementControl:84,spinRetention:70,lad:67,burstResistance:84,winConditions:{spin:38,burst:74,knockout:94,counter:68}},compatibility:{heights:{60:96,70:90,80:48},bits:{Quake:98,Flat:94,LowFlat:96,Rush:90,LowRush:88,Point:74,Level:80,Kick:84,HighNeedle:46,Needle:38,Hexa:54,Wedge:46,Ball:30,Orb:34,Elevate:52}},traits:["Attack","Elliptical","Heavy","Smash","Counter Attack","High Recoil"],personality:{aggression:92,control:76,consistency:72,risk:86}},

    leon_claw:{name:"Leon Claw",type:"Balance",tier:"Bronze",spin:"Right",weight:34.0,card:{ovr:76,attack:73,knockback:71,defense:76,mobility:76,balance:86,stamina:79,burst:78},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Claw Hybrid",recoil:"Medium",lockStrength:74,weightDistribution:"Balanced"},behavior:{attackStyle:"Counter Rush",smashPower:64,upperPower:48,barragePower:62,counterPower:78,movementControl:82,spinRetention:76,lad:72,burstResistance:74,winConditions:{spin:70,burst:48,knockout:48,counter:82}},compatibility:{heights:{60:92,70:84,80:66},bits:{Point:94,Level:92,Hexa:88,Elevate:82,Needle:80,HighNeedle:78,Ball:76,Orb:78,Wedge:74,Rush:62,LowRush:58,Flat:66,LowFlat:60,Kick:74,Quake:58}},traits:["Balance","Counter","Versatile","Controlled Attack"],personality:{aggression:52,control:86,consistency:84,risk:38}}

};

//=========================
// V56 RATCHET PHYSICS
//=========================
// Ratchets are physical geometry, not stat sticks.  These values describe
// tendencies that the combo solver converts into 60-99 performance ratings.
// 3/4/5/6 are intentionally distinct; none is a universal upgrade.
const RATCHET_PHYSICS_V56={
    "1":{weight:6.0,sides:1,geometry:"asymmetric",attack:.82,knockback:.72,defense:.26,balance:.28,stamina:.28,mobility:.55,burst:.42,lad:.25,exposure:.65},
    "3":{weight:6.3,sides:3,geometry:"triangular",attack:.62,knockback:.56,defense:.48,balance:.56,stamina:.48,mobility:.48,burst:.50,lad:.50,exposure:.50},
    "4":{weight:6.3,sides:4,geometry:"small-square",attack:.48,knockback:.45,defense:.28,balance:.35,stamina:.42,mobility:.44,burst:.16,lad:.30,exposure:.82},
    "5":{weight:6.6,sides:5,geometry:"wide-outer",attack:.42,knockback:.40,defense:.40,balance:.48,stamina:.42,mobility:.40,burst:.50,lad:.70,exposure:.56},
    "6":{weight:6.65,sides:6,geometry:"six-sided-round",attack:.48,knockback:.46,defense:.50,balance:.58,stamina:.50,mobility:.40,burst:.60,lad:.76,exposure:.48},
    "7":{weight:7.1,sides:7,geometry:"heavy-round",attack:.45,knockback:.54,defense:.60,balance:.68,stamina:.58,mobility:.36,burst:.72,lad:.70,exposure:.44},
    "9":{weight:6.1,sides:9,geometry:"compact-round",attack:.38,knockback:.38,defense:.54,balance:.62,stamina:.52,mobility:.34,burst:.92,lad:.84,exposure:.30}
};

const RATCHET_BASES=Object.entries(RATCHET_PHYSICS_V56).map(([number,p])=>({number:Number(number),stats:{
    attack:Math.round(60+p.attack*40),defense:Math.round(60+p.defense*40),
    stamina:Math.round(60+p.stamina*40),balance:Math.round(60+p.balance*40)
}}));

const HEIGHTS=[60,70,80];
const RATCHETS=[];
for(const [number,p] of Object.entries(RATCHET_PHYSICS_V56)){
    for(const height of HEIGHTS){
        RATCHETS.push({name:`${number}-${height}`,number:Number(number),height,physics:p,
            stats:{attack:Math.round(60+p.attack*40),defense:Math.round(60+p.defense*40),
            stamina:Math.round(60+p.stamina*40),balance:Math.round(60+p.balance*40)}});
    }
}

function getRatchetProfile(ratchet){
    const p=RATCHET_PHYSICS_V56[String(ratchet?.number)]||RATCHET_PHYSICS_V56["3"];
    return {base:p,height:Number(ratchet?.height)||60};
}
function getHeightPhysicsV56(height){
    if(Number(height)===80)return{attack:.03,knockback:.05,defense:-.28,balance:-.38,stamina:-.58,mobility:-.08,burst:-.34,exposure:.24};
    if(Number(height)===70)return{attack:.01,knockback:.02,defense:-.08,balance:-.12,stamina:-.24,mobility:-.02,burst:-.12,exposure:.09};
    return{attack:0,knockback:0,defense:0,balance:0,stamina:0,mobility:0,burst:0,exposure:0};
}
// V56 UI compatibility: Ratchet cards read the physical profile.
RATCHETS.forEach(r=>{
    if(!r.physics) r.physics=getRatchetProfile(r).base;
});


const BIT_ENGINE = {

    flat:{

        name:"Flat",

        type:"Attack",

        card:{attack:88,knockback:80,defense:52,mobility:95,balance:62,stamina:56,burst:80},

        behavior:{speed:96,aggression:92,control:60,staminaRetention:58}

    },

    low_flat:{

        name:"Low Flat",

        type:"Attack",

        card:{attack:92,knockback:84,defense:48,mobility:98,balance:55,stamina:51,burst:80},

        behavior:{speed:99,aggression:96,control:70,staminaRetention:50}

    },

    rush:{

        name:"Rush",

        type:"Attack",

        card:{attack:82,knockback:70,defense:57,mobility:88,balance:76,stamina:65,burst:80},

        behavior:{speed:98,aggression:88,control:78,staminaRetention:68}

    },
 
 low_rush:{

    name:"Low Rush",

    type:"Attack",

    card:{attack:84,knockback:71,defense:55,mobility:91,balance:77,stamina:62,burst:80},

    behavior:{speed:100,aggression:98,control:64,staminaRetention:52}

},

level:{

    name:"Level",

    type:"Balance",

    card:{attack:70,knockback:66,defense:68,mobility:72,balance:85,stamina:80,burst:80},

    behavior:{speed:76,aggression:64,control:94,staminaRetention:80}

},

taper:{
    name:"Taper",type:"Balance",
    card:{attack:70,knockback:62,defense:58,mobility:74,balance:78,stamina:76,burst:80},
    behavior:{speed:68,aggression:58,control:84,staminaRetention:78}
},

kick:{

    name:"Kick",

    type:"Attack",

    card:{attack:76,knockback:65,defense:68,mobility:79,balance:76,stamina:73,burst:80},

    behavior:{speed:84,aggression:94,control:74,staminaRetention:62}

},

wedge:{

    name:"Wedge",

    type:"Defense",

    card:{attack:58,knockback:62,defense:74,mobility:54,balance:78,stamina:82,burst:80},

    behavior:{speed:48,aggression:30,control:98,staminaRetention:84}

},

hexa:{

    name:"Hexa",

    type:"Defense",

    card:{attack:65,knockback:70,defense:80,mobility:52,balance:88,stamina:85,burst:80},

    behavior:{speed:52,aggression:26,control:100,staminaRetention:88}

},

needle:{

    name:"Needle",

    type:"Defense",

    card:{attack:58,knockback:55,defense:58,mobility:36,balance:58,stamina:91,burst:72},

    behavior:{speed:38,aggression:20,control:94,staminaRetention:86}

},

ball:{
    name:"Ball",
    type:"Stamina",
    card:{attack:57,knockback:53,defense:72,mobility:42,balance:88,stamina:98,burst:72},
    behavior:{speed:46,aggression:18,control:96,staminaRetention:99}
},
orb:{

    name:"Orb",

    type:"Stamina",

    card:{attack:60,knockback:57,defense:75,mobility:49,balance:86,stamina:95,burst:72},

    behavior:{speed:54,aggression:24,control:94,staminaRetention:95},

},

    point:{name:"Point",type:"Balance",card:{attack:74,knockback:62,defense:60,mobility:73,balance:78,stamina:78,burst:80},behavior:{speed:62,aggression:58,control:82,staminaRetention:76}},
    high_needle:{name:"High Needle",type:"Defense",card:{attack:59,knockback:56,defense:54,mobility:40,balance:54,stamina:94,burst:72},behavior:{speed:42,aggression:24,control:88,staminaRetention:92}},
    quake:{name:"Quake",type:"Attack",card:{attack:87,knockback:83,defense:45,mobility:89,balance:42,stamina:38,burst:80},behavior:{speed:88,aggression:92,control:42,staminaRetention:35}}

};


//=========================
// BIT PHYSICS 3.0
//=========================
// The bit is the primary movement component. Card stats determine how well
// the Bey uses that movement, while launch angle modifies the bit's natural
// behavior rather than replacing it.
const BIT_PHYSICS = {
    Flat:{movement:96,control:48,spinDrain:1.55,xRailAffinity:94,centerAffinity:30,recovery:42,attackBias:10,acceleration:94,friction:42,precession:72,stability:38},
    "Low Flat":{movement:100,control:43,spinDrain:1.70,xRailAffinity:97,centerAffinity:24,recovery:35,attackBias:13,acceleration:100,friction:38,precession:78,stability:32},
    Rush:{movement:91,control:72,spinDrain:1.05,xRailAffinity:88,centerAffinity:42,recovery:60,attackBias:5,acceleration:86,friction:48,precession:58,stability:54},
    "Low Rush":{movement:94,control:70,spinDrain:1.10,xRailAffinity:93,centerAffinity:35,recovery:58,attackBias:8,acceleration:93,friction:43,precession:66,stability:50},
    Taper:{movement:68,control:84,spinDrain:.82,xRailAffinity:58,centerAffinity:60,recovery:72,attackBias:1,acceleration:64,friction:66,precession:44,stability:68},
    Level:{movement:66,control:88,spinDrain:.76,xRailAffinity:58,centerAffinity:72,recovery:82,attackBias:2,acceleration:62,friction:76,precession:32,stability:82},
    Kick:{movement:82,control:62,spinDrain:1.16,xRailAffinity:78,centerAffinity:36,recovery:52,attackBias:7,acceleration:82,friction:52,precession:58,stability:48},
    Wedge:{movement:48,control:78,spinDrain:.60,xRailAffinity:34,centerAffinity:86,recovery:72,attackBias:-3,acceleration:48,friction:88,precession:30,stability:55},
    Hexa:{movement:40,control:96,spinDrain:.68,xRailAffinity:34,centerAffinity:94,recovery:88,attackBias:-4,acceleration:42,friction:86,precession:24,stability:88},
    Needle:{movement:18,control:86,spinDrain:.40,xRailAffinity:14,centerAffinity:100,recovery:82,attackBias:-8,acceleration:20,friction:95,precession:24,stability:34},
    "High Needle":{movement:27,control:80,spinDrain:.37,xRailAffinity:20,centerAffinity:96,recovery:84,attackBias:-7,acceleration:29,friction:94,precession:30,stability:30},
    Ball:{movement:30,control:96,spinDrain:.34,xRailAffinity:18,centerAffinity:96,recovery:94,attackBias:-7,acceleration:32,friction:94,precession:18,stability:94},
    Orb:{movement:22,control:94,spinDrain:.39,xRailAffinity:14,centerAffinity:98,recovery:88,attackBias:-6,acceleration:28,friction:95,precession:18,stability:90},
    Point:{movement:58,control:86,spinDrain:.78,xRailAffinity:52,centerAffinity:74,recovery:76,attackBias:1,acceleration:58,friction:77,precession:34,stability:72},
    Quake:{movement:89,control:40,spinDrain:1.88,xRailAffinity:75,centerAffinity:20,recovery:24,attackBias:11,acceleration:92,friction:43,precession:74,stability:30}
};

function getBitPhysics(blader){
    const name=Game[blader]?.bit?.name;
    return BIT_PHYSICS[name] || BIT_PHYSICS.Point;
}







function renderMainMenu(){
    Game.screen="menu";
    const app=document.getElementById("app");
    if(!app) return;

    app.innerHTML=`
    <div class="background"></div>
    <main class="main-menu-shell">
        <section class="main-menu-hero">
            <div class="hero-mark">
                <div class="hero-ring hero-ring-a"></div>
                <div class="hero-ring hero-ring-b"></div>
                <div class="hero-core"></div>
            </div>
            <div class="hero-copy">
                <h1>SPIN WARS <em>X</em></h1>
                <p>Choose your launch. LET IT RIP.</p>
            </div>
        </section>

        <section class="battle-select">
            <div class="section-head">
                <div>
                    <span class="section-kicker">BATTLE SELECT</span>
                    <h2>Choose your battle pool</h2>
                </div>
                <span class="section-count">04 MODES</span>
            </div>

            <div class="tier-menu-grid">
                <button class="tier-menu-card tier-menu-bronze" data-mode="bronze">
                    <div class="tier-card-glow"></div>
                    <span class="tier-code">01 · BRONZE</span>
                    <strong>BRONZE</strong>
                    <span class="tier-arrow">→</span>
                </button>

                <button class="tier-menu-card tier-menu-silver" data-mode="silver">
                    <div class="tier-card-glow"></div>
                    <span class="tier-code">02 · SILVER</span>
                    <strong>SILVER</strong>
                    <span class="tier-arrow">→</span>
                </button>

                <button class="tier-menu-card tier-menu-gold" data-mode="gold">
                    <div class="tier-card-glow"></div>
                    <span class="tier-code">03 · GOLD / DIAMOND</span>
                    <strong>GOLD / DIAMOND</strong>
                    <span class="tier-arrow">→</span>
                </button>

                <button class="tier-menu-card tier-menu-custom" data-mode="custom">
                    <div class="tier-card-glow"></div>
                    <span class="tier-code">04 · CUSTOM LAB</span>
                    <strong>CUSTOM</strong>
                    <span class="tier-arrow">→</span>
                </button>
            </div>
        </section>

        <section class="main-menu-lower">
            <div class="menu-feature">
                <span class="feature-icon">◈</span>
                <div><b>PHYSICS SIMULATION</b><small>Movement, impact, RPM and X-Rail behavior</small></div>
            </div>
            <div class="menu-feature">
                <span class="feature-icon">◎</span>
                <div><b>REAL COMBO STATS</b><small>Blade × ratchet × height × Bit synergy</small></div>
            </div>
            <div class="menu-version">V99 · MOVEMENT CORE REBUILD</div>
        </section>
    </main>`;
}

function hookMenuButtons(){
    renderMainMenu();

    document.querySelectorAll(".tier-menu-card[data-mode]").forEach(button=>{
        button.onclick=()=>{
            Game.mode=button.dataset.mode;
            startDraft();
        };
    });
}

//=========================
// DRAFT LOADING
//=========================

function startDraft(){

    Game.screen="loading";

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">🎴</div>

            <h1>GENERATING DRAFT</h1>

            <p>Please Wait...</p>

        </div>

        <section class="menu-card">

            <div class="loading">

                <div class="loading-fill"
                id="loadingFill"></div>

            </div>

            <h2 id="loadingText">

                Preparing Blade Pool...

            </h2>

        </section>

    </main>

    `;

    animateLoading();

}

//=========================
// LOADING BAR
//=========================

function animateLoading(){

    const fill=document.getElementById("loadingFill");

    let progress=0;

    const timer=setInterval(()=>{

        progress+=2;

        fill.style.width=progress+"%";

        if(progress>=100){

            clearInterval(timer);

            setTimeout(showBladeDraft,300);

        }

    },25);

}
//=========================
// BACK BUTTON
//=========================

function createBackButton(onClick){

    const button=document.createElement("button");

    button.className="back-btn";

    button.textContent="← Back";

    button.onclick=onClick;

    return button;

}

//=========================
// SHOW BLADE DRAFT
//=========================
function showBladeDraft(){
    Game.screen="bladeDraft";
    const pool=Object.values(BLADE_ENGINE).filter(blade=>{
        if(Game.mode==="bronze") return blade.tier==="Bronze";
        if(Game.mode==="silver") return blade.tier==="Silver";
        if(Game.mode==="gold") return blade.tier==="Gold";
        return true;
    }).sort(()=>Math.random()-0.5);
    Game.selection=Game.selection||{}; Game.selection.bladePool=pool; Game.selection.bladePage=0; renderBladeDraft();
}
function renderBladeDraft(){
    const pool=Game.selection?.bladePool||[], page=Game.selection?.bladePage||0, size=3;
    const total=Math.max(1,Math.ceil(pool.length/size)), safe=Math.min(Math.max(page,0),total-1); Game.selection.bladePage=safe;
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu selection-screen"><div class="selection-header"><div class="selection-icon">✦</div><div><span class="eyebrow">BUILD YOUR COMBO</span><h1>CHOOSE BLADE</h1><p>${Game.mode==="custom"?"CUSTOM · ALL BLADES":Game.mode.toUpperCase()+" · BLADE POOL"}</p></div></div><section class="menu-card selection-card" id="bladeContainer"></section></main>`;
    const container=document.getElementById("bladeContainer"); pool.slice(safe*size,(safe+1)*size).forEach(blade=>container.appendChild(createBladeCard(blade)));
    if(total>1){
        const nav=document.createElement("div"); nav.className="selection-nav";;
        nav.innerHTML=`<button class="menu-btn silver" id="bladePrev" ${safe===0?"disabled":""}>←</button><span style="font-size:11px;opacity:.7;">${safe+1} / ${total}</span><button class="menu-btn silver" id="bladeNext" ${safe===total-1?"disabled":""}>→</button>`; container.appendChild(nav);
        document.getElementById("bladePrev").onclick=()=>{Game.selection.bladePage--;renderBladeDraft();}; document.getElementById("bladeNext").onclick=()=>{Game.selection.bladePage++;renderBladeDraft();};
    }
    container.appendChild(createBackButton(()=>location.reload()));
}

//=========================
// CREATE CARD
//=========================


function tierClass(tier){
    const v=String(tier||"custom").toLowerCase();
    return v==="gold"?"tier-gold":v==="silver"?"tier-silver":v==="bronze"?"tier-bronze":"tier-custom";
}
function statMini(label,value){
    return `<div class="mini-stat"><span>${label}</span><b>${value}</b></div>`;
}
function createPartCard({title,subtitle,stats,accentClass,onClick,extra="",description=""}){
    const card=document.createElement("button");
    card.type="button";
    card.className=`part-select-card ${accentClass||""}`;
    card.innerHTML=`<div class="part-card-top"><div class="part-copy"><span class="part-card-kicker">PART</span><strong>${title}</strong><small>${subtitle||""}</small></div>${extra}</div>
    ${description?`<p class="part-description">${description}</p>`:""}
    <div class="mini-stat-grid">${stats.map(x=>statMini(x[0],x[1])).join("")}</div>`;
    card.onclick=onClick;
    return card;
}
function createBladeCard(blade){
    const card=document.createElement("button");
    card.type="button";
    card.className=`blade-card game-blade-card ${tierClass(blade.tier)}`;
    card.innerHTML=`
        <div class="blade-card-head">
            <div class="blade-card-title">
                <span class="tier-ribbon">${String(blade.tier||"Custom").toUpperCase()}</span>
                <h2>${blade.name}</h2>
                <div class="blade-meta"><span>${blade.type}</span><span>${blade.weight}g</span><span>${blade.spin==="R"?"RIGHT SPIN":blade.spin||"RIGHT SPIN"}</span></div>
            </div>
            <div class="ovr-badge"><small>OVR</small><b>${blade.card.ovr}</b></div>
        </div>
        <div class="blade-stat-grid">
            ${statMini("ATK",blade.card.attack)}${statMini("KNO",blade.card.knockback)}
            ${statMini("DEF",blade.card.defense)}${statMini("MOB",blade.card.mobility)}
            ${statMini("BAL",blade.card.balance)}${statMini("STA",blade.card.stamina)}
            ${statMini("BST",blade.card.burst)}
        </div>
        <div class="select-hint">SELECT BLADE <span>›</span></div>`;
    card.onclick=()=>chooseBlade(blade,card);
    return card;
}

//=========================
// SELECT BLADE
//=========================

function chooseBlade(blade,card){

    Game.player.blade=blade;

    card.style.transform="scale(1.08)";
    card.style.boxShadow="0 0 30px gold";

    setTimeout(()=>{

        showRatchetPlaceholder();

    },350);

}


//=========================
// SHOW RATCHETS
//=========================
function ratchetCard(r){
    const p=r.physics||{};
    const shape={1:"ASYMMETRIC · DIRECTIONAL MASS",3:"3-SIDED · ALIGNMENT / VERSATILE",
        4:"4-SIDED · EXPOSED / NICHE",5:"5-SIDED · BALANCE CORRECTION",
        6:"6-SIDED · ROUND / LAD",7:"7-SIDED · HEAVY / STABLE",
        9:"9-SIDED · COMPACT / BURST SAFE"}[r.number]||"RATCHET";
    const heightNote=r.height===60?"LOW PROFILE":r.height===70?"MID HEIGHT":"TALL / EXPOSED";
    const burstRisk=p.burst<.35?"HIGH":p.burst<.60?"MEDIUM":"LOW";
    const exposure=p.exposure>.65?"HIGH":p.exposure>.45?"MEDIUM":"LOW";
    const mass=p.weight>=6.8?"HEAVY":p.weight>=6.4?"MEDIUM":"LIGHT";
    const desc={
        1:"Universal workhorse: asymmetric mass can add attack and impact, while its low profile works across many archetypes.",
        3:"Versatile three-sided geometry; alignment can create useful attack, balance or stamina combinations.",
        4:"Niche four-sided option. Low height can work, but exposed protrusions make Burst risk high.",
        5:"Niche balance specialist. It can correct certain weight distributions, but can hurt already-stable builds.",
        6:"Versatile circular shape that can add balance and LAD without being a universal best choice.",
        7:"Universal heavy round workhorse: adds mass, stability and useful low-height performance to many archetypes.",
        9:"Universal compact workhorse: low exposure and good balance make it useful across attack, balance and stamina."
    }[r.number]||"Physical Ratchet geometry changes height, contact and Burst behavior.";
    return createPartCard({title:r.name,subtitle:`${shape} · ${heightNote}`,
        accentClass:`ratchet-card ratchet-${r.number}`,
        stats:[["MASS",mass],["BURST",burstRisk],["EXPOSE",exposure],["ROLE",
            r.number===5?"NICHE":
            r.number===4?"RISKY":
            (r.number===1||r.number===7||r.number===9)?"UNIVERSAL":"VERSATILE"]],
        extra:`<span class="part-index">${r.number}</span>`,
        description:desc,
        onClick:()=>{Game.player.ratchet=r;showBitDraft();}});
}

function showRatchetPlaceholder(){
    Game.screen="ratchetDraft"; const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu selection-screen"><div class="selection-header"><div class="selection-icon">⚙</div><div><span class="eyebrow">BUILD YOUR COMBO</span><h1>CHOOSE RATCHET</h1><p>${Game.mode==="custom"?"CUSTOM · ALL RATCHETS":Game.player.blade.name}</p></div></div><section class="menu-card selection-card" id="ratchetContainer"></section></main>`;
    const container=document.getElementById("ratchetContainer");
    if(Game.mode==="custom"){
        Game.selection=Game.selection||{}; Game.selection.ratchetPool=[...RATCHETS]; Game.selection.ratchetPage=Game.selection.ratchetPage||0; renderRatchetPage(); return;
    }
    [...RATCHETS].sort(()=>Math.random()-0.5).slice(0,3).forEach(r=>container.appendChild(ratchetCard(r)));
    container.appendChild(createBackButton(()=>showBladeDraft()));
}
function renderRatchetPage(){
    const pool=Game.selection.ratchetPool,page=Game.selection.ratchetPage,size=6,total=Math.max(1,Math.ceil(pool.length/size)),safe=Math.min(Math.max(page,0),total-1); Game.selection.ratchetPage=safe;
    const c=document.getElementById("ratchetContainer"); c.innerHTML="";
    pool.slice(safe*size,(safe+1)*size).forEach(r=>c.appendChild(ratchetCard(r)));
    const nav=document.createElement("div");nav.className="selection-nav";nav.innerHTML=`<button class="menu-btn silver" id="ratchetPrev" ${safe===0?"disabled":""}>←</button><span>${safe+1} / ${total}</span><button class="menu-btn silver" id="ratchetNext" ${safe===total-1?"disabled":""}>→</button>`;c.appendChild(nav);
    document.getElementById("ratchetPrev").onclick=()=>{Game.selection.ratchetPage--;renderRatchetPage();};document.getElementById("ratchetNext").onclick=()=>{Game.selection.ratchetPage++;renderRatchetPage();};c.appendChild(createBackButton(()=>showBladeDraft()));
}

//=========================
// SHOW BITS
//=========================
function bitCard(bit){
    const typeClass=String(bit.type||"Balance").toLowerCase(),bp=getBitPhysicalProfileV56(bit);
    const sta=bp.stamina>.90?"VERY HIGH":bp.stamina>.75?"HIGH":bp.stamina>.55?"MEDIUM":"LOW";
    const mob=bp.mobility>.82?"HIGH":bp.mobility>.62?"MEDIUM":"LOW";
    const stability=bp.stability>.80?"HIGH":bp.stability>.55?"MEDIUM":"LOW";
    const descriptions={
        "Point":"Stays controlled while upright; meaningful in-game tilt makes it move outward and attack.",
        "Level":"Stable and centered at high RPM; as RPM falls, natural tilt and wobble make it progressively more mobile.",
        "Hexa":"Hexagonal tip helps the Bey right itself and increases defensive stability.",
        "Rush":"Controlled attack: less raw power than Flat, but better stamina and X-Line consistency.",
        "Low Rush":"Lower, smoother Rush: more stamina than Rush with slightly less impact.",
        "Flat":"High-friction attack Bit built for aggressive movement and powerful Xtreme Dashes.",
        "Low Flat":"Lower, wider Flat: maximum aggression and X-Line speed at a stamina cost.",
        "Kick":"Balance/counter Bit with better stamina, stability and control than pure attack Bits.",
        "Taper":"Controlled balance Bit that trades some attack for mobility and stamina.",
        "Wedge":"Semi-mobile Defense Bit with strong stamina, then a more stationary late battle.",
        "Needle":"Very stationary and stamina-efficient, but its tiny tip can wobble and destabilize.",
        "High Needle":"More mobile than Needle, with strong stamina but even more exposure to destabilization.",
        "Ball":"High-stamina center Bit with excellent stability and low movement.",
        "Orb":"High-stamina Bit with slightly more movement and less pure stability than Ball.",
        "Quake":"Jumping attack Bit: high impact and knockback, but poor stamina and balance."
    };
    return createPartCard({title:bit.name,subtitle:`${bit.type.toUpperCase()} BIT`,
        accentClass:`bit-card bit-${typeClass}`,
        stats:[["MOVE",mob],["STA",sta],["STABLE",stability],
            ["CONTROL",bp.control>.85?"HIGH":bp.control>.65?"MEDIUM":"LOW"]],
        extra:`<span class="bit-type-pill">${bit.type}</span>`,
        description:descriptions[bit.name]||"Distinct physical behavior and tradeoffs.",
        onClick:()=>{Game.player.bit=bit;showComboCard();}});
}

function showBitDraft(){
    Game.screen="bitDraft"; const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu selection-screen"><div class="selection-header"><div class="selection-icon">◉</div><div><span class="eyebrow">BUILD YOUR COMBO</span><h1>CHOOSE BIT</h1><p>${Game.mode==="custom"?"CUSTOM · ALL BITS":Game.player.blade.name}</p></div></div><section class="menu-card selection-card" id="bitContainer"></section></main>`;
    if(Game.mode==="custom"){Game.selection=Game.selection||{};Game.selection.bitPool=Object.values(BIT_ENGINE);Game.selection.bitPage=Game.selection.bitPage||0;renderBitPage();return;}
    const c=document.getElementById("bitContainer");Object.values(BIT_ENGINE).sort(()=>Math.random()-0.5).slice(0,3).forEach(bit=>c.appendChild(bitCard(bit)));c.appendChild(createBackButton(()=>showRatchetPlaceholder()));
}
function renderBitPage(){
    const pool=Game.selection.bitPool,page=Game.selection.bitPage,size=6,total=Math.max(1,Math.ceil(pool.length/size)),safe=Math.min(Math.max(page,0),total-1);Game.selection.bitPage=safe;
    const c=document.getElementById("bitContainer");c.innerHTML="";pool.slice(safe*size,(safe+1)*size).forEach(bit=>c.appendChild(bitCard(bit)));
    const nav=document.createElement("div");nav.className="selection-nav";nav.innerHTML=`<button class="menu-btn silver" id="bitPrev" ${safe===0?"disabled":""}>←</button><span>${safe+1} / ${total}</span><button class="menu-btn silver" id="bitNext" ${safe===total-1?"disabled":""}>→</button>`;c.appendChild(nav);
    document.getElementById("bitPrev").onclick=()=>{Game.selection.bitPage--;renderBitPage();};document.getElementById("bitNext").onclick=()=>{Game.selection.bitPage++;renderBitPage();};c.appendChild(createBackButton(()=>showRatchetPlaceholder()));
}



//=========================
// STAT DATABASE NORMALIZATION
//=========================
Object.values(BLADE_ENGINE).forEach(blade=>{
    if(blade.card) Object.keys(blade.card).forEach(key=>{
        if(typeof blade.card[key]==="number") blade.card[key]=clamp(blade.card[key]);
    });
});
Object.values(BIT_ENGINE).forEach(bit=>{
    if(bit.card) Object.keys(bit.card).forEach(key=>{
        if(typeof bit.card[key]==="number") bit.card[key]=clamp(bit.card[key]);
    });
});

//=========================
// ENGINE 2.0
// COMPATIBILITY
//=========================

function getBladeEngine(blade){

    return BLADE_ENGINE[
        blade.name
            .toLowerCase()
            .replace(/ /g,"_")
    ];

}


function getBitCompatibility(bladeData,bit){
    const key=bit.name.replace(/ /g,"");
    const explicit=bladeData.compatibility?.bits?.[key];
    if(explicit!==undefined) return explicit;
    const matrix={
        Attack:{Attack:78,Balance:68,Stamina:42,Defense:34},
        Defense:{Attack:34,Balance:74,Stamina:86,Defense:92},
        Stamina:{Attack:38,Balance:82,Stamina:96,Defense:91},
        Balance:{Attack:72,Balance:92,Stamina:82,Defense:80}
    };
    let score=matrix[bladeData.type]?.[bit.type]??50;
    if(bit.name==="Low Rush"&&bladeData.type==="Attack") score+=5;
    if(bit.name==="Rush"&&(bladeData.type==="Attack"||bladeData.type==="Balance")) score+=4;
    if(bit.name==="Ball"&&(bladeData.type==="Stamina"||bladeData.type==="Defense")) score+=5;
    if(bit.name==="Hexa"&&(bladeData.type==="Attack"||bladeData.type==="Balance")) score+=3;
    if(bit.name==="Wedge"&&bladeData.type==="Defense") score+=4;
    return Math.max(0,Math.min(100,score));
}
function getHeightCompatibility(bladeData,height){
    return bladeData.compatibility?.heights?.[String(height)]??50;
}
function getCompatibilityScore(blade,ratchet,bit){
    const bladeData=getBladeEngine(blade);
    if(!bladeData) return 50;
    return Math.round(
        getHeightCompatibility(bladeData,ratchet.height)*0.55+
        getBitCompatibility(bladeData,bit)*0.45
    );
}
function clamp(value){return Math.max(60,Math.min(99,Math.round(value)));}

function getBladePhysicalProfile(bladeData){
    const p=bladeData.physics||{},b=bladeData.behavior||{};
    const recoilMap={"Very Low":0.18,"Low":0.32,"Medium":0.55,"High":0.78,"Very High":0.92};
    const weight=Number(bladeData.weight)||32;
    return {
        weight,
        contactAttack:(b.smashPower||50)*0.42+(b.upperPower||50)*0.18+(b.barragePower||50)*0.12+(b.counterPower||50)*0.08,
        momentumPotential:weight*0.55+(b.smashPower||50)*0.18,
        recoil:recoilMap[p.recoil]??0.55,
        stability:(b.movementControl||70)*0.25+(b.spinRetention||70)*0.45+(b.lad||70)*0.30,
        lock:Number(p.lockStrength)||70
    };
}

/*
  REALISTIC COMBO STAT ENGINE
  Attack = ability to turn contact into RPM damage.
  Knockback = ability to transfer momentum/displace the opponent.
  Defense = resistance to displacement/destabilization.
  Mobility = movement speed, distance and activity.
  Balance = control and recovery after impacts.
  Stamina = RPM efficiency/retention.
  Burst = lock + ratchet + bit resistance.
*/

/*
  V48 BLADE × RATCHET SYNERGY
  Ratchet side count is NOT a universal "attack/defense" switch.
  Each blade has its own useful ratchet families because the number of
  protrusions, weight and exposed shape interact with the blade's contact
  geometry and weight distribution.

  These profiles are deliberately expressed as small physical biases rather
  than hard-coded final stats. They modify the underlying combo calculation,
  so the visible combo card and the battle engine receive the same result.
*/
//=========================
// V56 COMBINATION PHYSICS
//=========================
// The old V48/V55 blade-ratchet stat table is retired.  Synergy is now
// derived from physical relationships so unpopular parts can be good/bad
// for the right reasons instead of receiving universal +stat bonuses.

function getBladePhysicalProfileV56(blade){
    const p=blade.physics||{};
    const b=blade.behavior||{};
    const shape=String(p.contactShape||"").toLowerCase();
    const distribution=String(p.weightDistribution||"").toLowerCase();
    const recoil=String(p.recoil||"Medium");
    const recoilValue={"Very Low":.15,Low:.30,Medium:.50,High:.75,"Very High":.90}[recoil]??.50;

    let contact=.50;
    if(shape.includes("smash")||shape.includes("upper")) contact=.80;
    else if(shape.includes("round")) contact=.48;
    else if(shape.includes("elliptical")) contact=.68;
    else if(shape.includes("claw")||shape.includes("hybrid")) contact=.60;

    let stability=.50;
    if(String(p.centerOfGravity).toLowerCase().includes("low")) stability+=.10;
    if(String(p.centerOfGravity).toLowerCase().includes("high")) stability-=.12;
    stability+=(Number(b.movementControl)||70-70)/300;

    let outer=distribution.includes("outer")?.12:distribution.includes("forward")?-.04:0;
    const weight=Math.max(30,Math.min(40,Number(blade.weight)||35));

    return {
        weight,
        contact,
        recoil:recoilValue,
        stability:Math.max(.20,Math.min(.90,stability)),
        retention:Math.max(.20,Math.min(1,(Number(b.spinRetention)||70)/100)),
        lad:Math.max(.20,Math.min(1,(Number(b.lad)||70)/100)),
        lock:Math.max(.20,Math.min(1,(Number(p.lockStrength)||70)/100)),
        outer
    };
}

function getBitPhysicalProfileV56(bit){
    const name=bit?.name||"Point";
    const bp=BIT_PHYSICS[name]||BIT_PHYSICS.Point;
    const b=bit?.behavior||{};
    /*
      These are normalized physical roles, not standalone FIFA stats.
      The combination engine uses them to refine the Blade rather than
      replacing the Blade's identity.
    */
    const roles={
        "Flat":       {attack:.86,knockback:.74,defense:.12,balance:.18,stamina:.10,mobility:.96,burst:.80},
        "Low Flat":   {attack:.92,knockback:.80,defense:.08,balance:.14,stamina:.06,mobility:1.00,burst:.80},
        "Rush":       {attack:.68,knockback:.54,defense:.18,balance:.40,stamina:.40,mobility:.88,burst:.80},
        "Low Rush":   {attack:.70,knockback:.56,defense:.16,balance:.36,stamina:.46,mobility:.92,burst:.80},
        "Taper":      {attack:.42,knockback:.32,defense:.26,balance:.58,stamina:.70,mobility:.70,burst:.80},
        "Kick":       {attack:.54,knockback:.46,defense:.42,balance:.62,stamina:.54,mobility:.76,burst:.80},
        "Quake":      {attack:.82,knockback:.72,defense:.08,balance:.10,stamina:.04,mobility:.86,burst:.80},
        "Ball":       {attack:.14,knockback:.10,defense:.24,balance:.56,stamina:1.00,mobility:.30,burst:.30},
        "Orb":        {attack:.18,knockback:.14,defense:.24,balance:.50,stamina:.92,mobility:.22,burst:.30},
        "Needle":     {attack:.06,knockback:.05,defense:.08,balance:.10,stamina:.90,mobility:.20,burst:.30},
        "High Needle":{attack:.06,knockback:.05,defense:.06,balance:.08,stamina:.94,mobility:.28,burst:.30},
        "Wedge":      {attack:.10,knockback:.14,defense:.18,balance:.28,stamina:.84,mobility:.58,burst:.30},
        "Hexa":       {attack:.20,knockback:.12,defense:.34,balance:.72,stamina:.72,mobility:.40,burst:.80},
        "Point":      {attack:.46,knockback:.34,defense:.18,balance:.52,stamina:.60,mobility:.62,burst:.80},
        "Level":      {attack:.50,knockback:.40,defense:.16,balance:.46,stamina:.58,mobility:.72,burst:.80}
    };
    const role=roles[name]||roles.Point;
    return {...role,
        speed:(Number(b.speed)||Number(bp.movement)||60)/100,
        control:(Number(b.control)||Number(bp.control)||60)/100,
        retention:(Number(b.staminaRetention)||60)/100,
        friction:(Number(bp.friction)||60)/100,
        stability:(Number(bp.stability)||60)/100,
        xRail:(Number(bp.xRailAffinity)||50)/100,
        stableMode:{
            mobility:(name==="Point"||name==="Level")?.36:role.mobility,
            stamina:name==="Point"?.72:name==="Level"?.70:role.stamina
        },
        aggressiveMode:{
            mobility:(name==="Point"||name==="Level")?.82:role.mobility,
            stamina:name==="Point"?.48:name==="Level"?.44:role.stamina
        }
    };
}

function getBladeTypeProfileV56(blade){
    const type=blade.type||"Balance";
    return {
        attack:type==="Attack"?.72:type==="Balance"?.55:.35,
        defense:type==="Defense"?.75:type==="Stamina"?.62:.42,
        stamina:type==="Stamina"?.80:type==="Defense"?.58:.42,
        balance:type==="Balance"?.76:type==="Defense"?.70:type==="Stamina"?.72:.48,
        mobility:type==="Attack"?.78:type==="Balance"?.62:.38
    };
}

function getRatchetGeometryFitV56(blade,ratchet){
    const shape=String(blade.physics?.contactShape||"").toLowerCase();
    const dist=String(blade.physics?.weightDistribution||"").toLowerCase();
    const type=blade.type||"Balance";
    const phys=getBladePhysicalProfileV56(blade);
    let fit=.50;

    // 3: three-sided/alignment-sensitive. Strong when the Blade actually has
    // three main contact points; merely being an Attack Blade is not enough.
    if(ratchet.number===3){
        if(shape.includes("three")||shape.includes("tri")) fit+=.20;
        else if(shape.includes("sword")||shape.includes("claw")) fit+=.12;
        else fit+=.01;
        if(ratchet.height===60) fit+=.03;
    }

    // 4: useful low profile, but the four wide exposed weak points make it
    // genuinely niche. 60 is far more sensible than 70/80.
    if(ratchet.number===4){
        fit-=.10;
        if(ratchet.height===60) fit+=.06;
        if(type==="Attack"&&(shape.includes("upper")||shape.includes("smash"))) fit+=.08;
        if(shape.includes("round")&&type!=="Attack") fit-=.04;
        if(type==="Stamina"||type==="Defense") fit-=.03;
    }

    // 5: balance-correction ratchet. It should shine only when the Blade
    // actually benefits from the added balance/stability. On already-stable
    // Blades + high-friction stamina Bits, it can reduce precession.
    if(ratchet.number===5){
        const imbalance=Math.max(0,.58-phys.stability);
        const recoilNeed=Math.max(0,phys.recoil-.55);
        if(!dist.includes("outer") && !dist.includes("balanced")) fit+=imbalance*.24;
        if(dist.includes("forward")) fit+=.10;
        if(type==="Defense"||type==="Stamina") fit+=.02;
        if(type==="Attack"&&phys.recoil>.65) fit+=.04;
        if(imbalance<.08) fit-=.04;
        if(ratchet.height===80) fit-=.08;
        if(ratchet.height===60) fit+=.02;
        fit-=recoilNeed*.05;
    }

    // 6: circular and versatile, but not a free upgrade. It prefers round or
    // balanced shapes and gets only a modest benefit from stamina/defense.
    if(ratchet.number===6){
        if(shape.includes("round")) fit+=.12;
        else if(shape.includes("three")||shape.includes("tri")) fit+=.03;
        if(type==="Stamina"||type==="Defense") fit+=.03;
        if(type==="Attack"&&shape.includes("smash")) fit-=.02;
        if(ratchet.height===80) fit-=.06;
    }

    // 7: heavy circular stabilizer. This is broadly useful, but its weight
    // should not erase a Blade's own weaknesses.
    if(ratchet.number===7){
        if(shape.includes("round")) fit+=.07;
        if(type==="Stamina"||type==="Defense") fit+=.06;
        if(type==="Attack"&&!shape.includes("round")) fit-=.03;
        if(ratchet.height===60) fit+=.03;
        if(ratchet.height===80) fit-=.06;
    }

    // 9: compact, burst-safe and generally strong, but not automatically the
    // best Ratchet for every Blade. Round/stamina shapes get the most value.
    if(ratchet.number===9){
        if(shape.includes("round")) fit+=.07;
        if(type==="Stamina"||type==="Defense") fit+=.04;
        if(shape.includes("smash")&&type==="Attack") fit+=.04;
        if(type==="Attack"&&!shape.includes("smash")&&!shape.includes("round")) fit-=.02;
        if(ratchet.height===80) fit-=.05;
    }

    // 1: asymmetric mass is a real offensive tool, but it has a second use:
    // low 1-60 can help some high-stamina Blades recover from the pocket/rail
    // by changing the contact geometry. It is not a universal stamina boost.
    if(ratchet.number===1){
        if(type==="Attack") fit+=.14;
        else if(type==="Stamina"||type==="Defense") fit+=.02;
        else fit-=.03;
        if((shape.includes("upper")||shape.includes("smash"))&&type==="Attack") fit+=.05;
        if((type==="Stamina"||type==="Defense")&&phys.stability>.62&&ratchet.height===60) fit+=.08;
        if(ratchet.height===80) fit-=.07;
    }

    return Math.max(.18,Math.min(.88,fit));
}

function getHeightFitV56(blade,height){
    const h=Number(height);
    const explicit=Number(blade.compatibility?.heights?.[h]);
    if(Number.isFinite(explicit)) return Math.max(.25,Math.min(1,explicit/100));
    return h===60?.78:h===70?.62:.42;
}

function partContributionV56(base,role,weight,fit){
    // Part influence is deliberately bounded. A Bit/Ratchet can refine a Blade
    // but cannot replace the Blade's physical identity.
    return (role-base)*weight*fit;
}

function calculateMetaScoreV57(blade,ratchet,bit,stats,fit){
    /*
      Meta is the competitive quality of THIS combo.
      The Blade's own strength is the anchor; parts unlock or suppress it.
      This deliberately prevents the old problem where a 90+ Blade could
      become an 80 simply because the stat average disliked its Bit.
    */
    const bladeOvr=Number(blade.card?.ovr)||70;
    const bladeType=blade.type||"Balance";
    const bitName=bit.name||"";
    const phys=getBladePhysicalProfileV56(blade);
    const height=Number(ratchet.height)||60;

    let roleQuality=(
        stats.attack*.14+stats.knockback*.14+stats.defense*.14+
        stats.mobility*.14+stats.balance*.14+stats.stamina*.18+stats.burst*.12
    );
    if(bladeType==="Attack") roleQuality+=stats.attack*.05+stats.knockback*.05+stats.mobility*.03;
    else if(bladeType==="Stamina") roleQuality+=stats.stamina*.06+stats.balance*.04+stats.defense*.03;
    else if(bladeType==="Defense") roleQuality+=stats.defense*.06+stats.balance*.04+stats.stamina*.03;
    else roleQuality+=stats.balance*.04+stats.attack*.03+stats.stamina*.02;
    roleQuality=Math.max(60,Math.min(99,roleQuality));

    const explicit=Number(blade.compatibility?.bits?.[bitName.replace(/ /g,"")]);
    const bitFit=Number.isFinite(explicit)?explicit:getBitCompatibility(blade,bit);
    const ratchetFit=Math.max(.18,Math.min(.88,fit/Math.max(.30,getHeightFitV56(blade,height))));

    let roleFit=70;
    if(bitName==="Rush"||bitName==="Low Rush") roleFit=(bladeType==="Attack"||bladeType==="Balance")?94:72;
    else if(bitName==="Flat"||bitName==="Low Flat") roleFit=bladeType==="Attack"?91:(bladeType==="Balance"?70:56);
    else if(bitName==="Kick") roleFit=(bladeType==="Defense"||bladeType==="Balance")?92:(bladeType==="Attack"?76:72);
    else if(bitName==="Wedge") roleFit=(bladeType==="Defense"||bladeType==="Stamina")?91:70;
    else if(bitName==="Hexa") roleFit=(bladeType==="Stamina"||bladeType==="Defense")?92:(bladeType==="Balance"?84:68);
    else if(bitName==="Ball"||bitName==="Orb") roleFit=(bladeType==="Stamina"||bladeType==="Defense")?95:(bladeType==="Balance"?82:58);
    else if(bitName==="Needle"||bitName==="High Needle") roleFit=(bladeType==="Defense"||bladeType==="Stamina")?78:(bladeType==="Balance"?70:62);
    else if(bitName==="Point"||bitName==="Level") roleFit=(bladeType==="Balance"||bladeType==="Attack")?88:(bladeType==="Defense"?82:78);
    else if(bitName==="Quake") roleFit=bladeType==="Attack"?84:58;
    else if(bitName==="Taper") roleFit=(bladeType==="Balance"||bladeType==="Attack"||bladeType==="Defense")?86:78;

    let signature=0;

    // 1-60 attack identity.
    if(ratchet.number===1 && height===60 && bladeType==="Attack") signature+=1.80;
    if((ratchet.number===1||ratchet.number===7||ratchet.number===9) && height===60) signature+=.18;

    // 1-60 defensive/recovery identity. This is the physical reason Wizard Rod
    // 1-60 Hexa can reach the absolute ceiling without making every 1-60 combo
    // universally elite.
    if(ratchet.number===1 && height===60 &&
       (bladeType==="Stamina"||bladeType==="Defense") &&
       phys.stability>.62 && phys.retention>.80){
        signature+=.75;
        if(bitName==="Hexa") signature+=1.25;
    }

    // 5 is niche: only reward it when the Blade actually benefits from
    // balance correction, especially with pointy/stability-oriented Bits.
    if(ratchet.number===5 && phys.stability<.55 &&
       (bitName==="Needle"||bitName==="High Needle"||bitName==="Hexa"||bitName==="Wedge")){
        signature+=.90;
    }
    if(ratchet.number===5 && phys.stability>.68) signature-=.18;
    if(ratchet.number===5 && (bitName==="Ball"||bitName==="Orb") && phys.stability>.68) signature-=.85;

    // Broadly useful circular ratchets receive small, not dominant, bonuses.
    if((ratchet.number===3||ratchet.number===7)&&height===60&&shapeHasRoundOrTriShape(blade)) signature+=.45;
    if(ratchet.number===9&&height===60){
        signature+=.25;
        if((bladeType==="Attack"&&phys.recoil>.70)||(bladeType==="Stamina"||bladeType==="Defense")) signature+=.25;
    }

    if(height===80){
        signature-=1.15;
        if(bitName==="Point"||bitName==="Level"||bitName==="Kick") signature+=.25;
    }
    if(height>=70&&stats.burst<72) signature-=.85;

    // Small, bounded modifiers. Blade quality remains the dominant anchor.
    const qualityDelta=(roleQuality-bladeOvr)*.05;
    const bitDelta=(bitFit-75)*.010;
    const ratchetDelta=(ratchetFit-.50)*3.0;
    const heightDelta=height===60?.65:height===70?0:-1.05;
    const roleDelta=(roleFit-75)*.015;

    return Math.max(60,Math.min(99,Math.round(
        bladeOvr-2.0+qualityDelta+bitDelta+ratchetDelta+heightDelta+roleDelta+signature
    )));
}

function shapeHasRoundOrTriShape(blade){
    const s=String(blade.physics?.contactShape||"").toLowerCase();
    return s.includes("round")||s.includes("three")||s.includes("tri")||
        s.includes("sword")||s.includes("claw")||s.includes("hybrid");
}

function normalizePhysicalStat(v){return Math.max(60,Math.min(99,Math.round(v)));}
function getBitRatedProperty(role){return 60+role*40;}
function getRatchetRatedProperty(role){return 60+role*40;}

function calculateComboStats(blade,ratchet,bit){
    const bladeData=getBladeEngine(blade);
    if(!bladeData||!ratchet||!bit) return null;
    const rb=getRatchetProfile(ratchet).base;
    const h=getHeightPhysicsV56(ratchet.height);
    const bp=getBitPhysicalProfileV56(bit);
    const bladePhys=getBladePhysicalProfileV56(bladeData);
    const ratchetFit=getRatchetGeometryFitV56(bladeData,ratchet);
    const heightFit=getHeightFitV56(bladeData,ratchet.height);
    const base={
        attack:Number(bladeData.card.attack)||70,knockback:Number(bladeData.card.knockback)||70,
        defense:Number(bladeData.card.defense)||70,mobility:Number(bladeData.card.mobility)||70,
        balance:Number(bladeData.card.balance)||70,stamina:Number(bladeData.card.stamina)||70,
        burst:Number(bladeData.card.burst)||70
    };
    const br=k=>getBitRatedProperty(bp[k]), rr=k=>getRatchetRatedProperty(rb[k]);
    const stats={};
    stats.attack=base.attack*.66+br("attack")*.22+rr("attack")*.12;
    stats.knockback=base.knockback*.78+br("knockback")*.10+rr("knockback")*.12;
    stats.defense=base.defense*.56+br("defense")*.22+rr("defense")*.22;
    stats.balance=base.balance*.55+br("balance")*.27+rr("balance")*.18;
    stats.mobility=base.mobility*.25+br("mobility")*.65+rr("mobility")*.10;
    stats.stamina=base.stamina*.35+br("stamina")*.50+rr("stamina")*.15;
    stats.burst=base.burst*.72+br("burst")*.16+rr("burst")*.12;

    const destabilizationRisk=Math.max(0,.55-bp.stability)*8+
        Math.max(0,.55-bladePhys.stability)*3+Math.max(0,rb.exposure-.60)*2;
    stats.balance-=destabilizationRisk;
    stats.defense-=destabilizationRisk*.55;

    // Bit-specific tradeoffs are already encoded in bp. Do not add a second
    // generic "Defense Bit = Defense/Balance" bonus on top of that model.
    // Point/Level use continuous behavior in battle; their card stamina is
    // intentionally moderate so the gimmick does not become free endurance.
    stats.stamina-=Math.max(0,bp.speed-.55)*4+Math.max(0,bp.friction-.65)*5;

    const fitDelta=ratchetFit-.50;
    if(bladeData.type==="Attack"){
        stats.attack+=fitDelta*5;stats.knockback+=fitDelta*2.5;
    }else{
        stats.attack+=fitDelta*1.5;stats.knockback+=fitDelta;
    }
    stats.defense+=fitDelta*3;stats.balance+=fitDelta*4;stats.stamina+=fitDelta*2;

    stats.attack+=h.attack*8;stats.knockback+=h.knockback*8;stats.defense+=h.defense*8;
    stats.balance+=h.balance*8;stats.stamina+=h.stamina*8;stats.mobility+=h.mobility*8;
    stats.burst+=h.burst*8;

    stats.knockback+=(bladePhys.weight-35)*.25+(bladePhys.contact-.50)*2;
    stats.attack+=(bladePhys.contact-.50)*1.5;
    stats.defense+=(bladePhys.stability-.50)*2;
    stats.balance+=(bladePhys.stability-.50)*2;
    stats.stamina+=(bladePhys.retention-.50);

    const explicitBitFit=getBitCompatibility(bladeData,bit)/100;
    const bitFitDelta=(explicitBitFit-.70)*2;
    if(bladeData.type==="Attack"){
        stats.attack+=bitFitDelta;stats.knockback+=bitFitDelta*.35;
    }else{
        stats.balance+=bitFitDelta*.35;stats.stamina+=bitFitDelta*.45;
    }

    for(const key of Object.keys(stats))stats[key]=normalizePhysicalStat(stats[key]);
    const ovr=normalizePhysicalStat(Object.values(stats).reduce((a,b)=>a+b,0)/7);
    const meta=calculateMetaScoreV57(bladeData,ratchet,bit,stats,ratchetFit*heightFit);
    return {stats,compatibility:Math.round((explicitBitFit*.55+heightFit*.25+ratchetFit*.20)*100),ovr,meta,
        physical:{ratchetFit,heightFit,bitFit:explicitBitFit,bladeWeight:bladePhys.weight,
            bitMode:(bit.name==="Point"||bit.name==="Level")?"Physical behavior":"fixed"}};
}


/*
 V57 RESEARCH / SYSTEM LOCK
 - 0 Ratchets removed from selectable pool.
 - Elevate removed from selectable Bit pool.
 - Taper and  restored as distinct parts.
 - Needle/HN: high stamina potential, low real stability; no free Defense/Balance.
 - Wedge: semi-mobile, high stamina, less stable than Ball.
 - Point: Physical behavior stable/aggressive behavior.
 - Level: aggressive early behavior can transition conservative.
 - Rush: mobile/control-oriented attack Bit with less raw aggression than Flat.
 - Low Rush: similar to Rush, lower and more consistent, with decent endurance.
 - Hexa: conservative/stable alternative to Ball with extra Burst resistance,
   but below Ball in pure stamina/KO resistance.
 - Ratchet side count is Blade-dependent; 3/4/5/6 are niche/alignment-sensitive.
 - Height 80 is exposure/stability tradeoff, never a free stamina upgrade.
 - OVR remains the average of seven visible combo stats.
 - Meta is secondary to physical combo stats.
*/
/*
 V56 SYNERGY ENGINE LOCK
 - Displayed stats remain FIFA-style 60-99.
 - OVR is the simple average of the seven displayed stats.
 - Blade identity is the dominant input; Ratchet and Bit refine it.
 - No generic part is allowed to manufacture a new offensive identity.
 - Ratchet side count is geometric, not a linear quality ladder.
 - 4 is intentionally niche and exposed rather than being made artificially good.
 - 5 corrects balance/weight distribution; 6 favors circular/LAD behavior;
   3 is versatile/alignment-sensitive; 1 is asymmetric attack-oriented.
 - Height is a physical exposure/center-of-mass modifier. 80 never receives a
   generic stamina/defense upgrade.
 - Bits have unique roles and tradeoffs; Ball, Hexa, Needle, Wedge, Rush, Flat,
   Low Rush, etc. are not interchangeable stat packages.
 - The current battle engine remains intact. It consumes the resulting stats.
*/

//=========================
// COMBO CARD
//=========================

function createComboSummaryCard(side,combo){
    const isPlayer=side==="player";
    const stats=combo.stats||{};
    for(const key of ["attack","knockback","defense","mobility","balance","stamina"]){
        if(!Number.isFinite(Number(stats[key]))) stats[key]=60;
    }
    return `<article class="combo-summary-card ${isPlayer?"combo-side-player":"combo-side-cpu"}">
      <div class="combo-summary-head">
        <div><span class="combo-summary-label">${isPlayer?"PLAYER COMBO":"CPU COMBO"}</span>
          <h2>${combo.blade.name}</h2>
          <div class="combo-summary-parts"><span>${combo.blade.type}</span><span>${combo.ratchet.name}</span><span>${combo.bit.name}</span></div>
        </div>
        <div class="combo-summary-ratings"><div><small>OVR</small><b>${combo.ovr}</b></div><div><small>META</small><b>${combo.meta}</b></div></div>
      </div>
      <div class="combo-summary-stats">
        <span>ATK <b>${stats.attack}</b></span><span>KB <b>${stats.knockback}</b></span><span>DEF <b>${stats.defense}</b></span>
        <span>MOB <b>${stats.mobility}</b></span><span>BAL <b>${stats.balance}</b></span><span>STA <b>${stats.stamina}</b></span>
      </div>
      ${!isPlayer && Game.mode==="custom" ? `
        <button class="cpu-reroll-btn" id="cpuRerollBtn" type="button">↻ REROLL CPU COMBO</button>` : ""}
    </article>`;
}
function showComboCard(){
    const playerCombo=calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit);
    generateCPUCombo();
    const cpuCombo=calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit);
    const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu combo-review-screen">
      <div class="selection-header combo-review-header"><div class="selection-icon">⚔</div><div><span class="eyebrow">BATTLE REVIEW</span><h1>COMBO CHECK</h1><p>Know the matchup before you launch.</p></div></div>
      <section class="combo-matchup-grid">
        ${createComboSummaryCard("player",{...Game.player,stats:playerCombo.stats,ovr:playerCombo.ovr,meta:playerCombo.meta})}
        ${createComboSummaryCard("cpu",{...Game.cpu,stats:cpuCombo.stats,ovr:cpuCombo.ovr,meta:cpuCombo.meta})}
      </section>
      <section class="combo-review-actions"><button class="menu-btn gold" id="battleButton" type="button">START BATTLE</button></section>
    </main>`;
    const battleButton=document.getElementById("battleButton");
    if(battleButton) battleButton.onclick=(event)=>{
        event?.preventDefault?.();
        if(!Game.player.blade||!Game.player.ratchet||!Game.player.bit||!Game.cpu.blade||!Game.cpu.ratchet||!Game.cpu.bit){
            console.error("Start Battle blocked: matchup data is incomplete."); return;
        }
        showVS();
    };

    const cpuRerollButton=document.getElementById("cpuRerollBtn");
    if(cpuRerollButton){
        cpuRerollButton.onclick=(event)=>{
            event?.preventDefault?.();
            generateCPUCombo(true);
            showComboCard();
        };
    }

    const menu=document.querySelector(".combo-review-screen");
    if(menu) menu.appendChild(createBackButton(()=>showBitDraft()));
}

//=========================
// CPU DRAFT
//=========================



//=========================




function syncComboStats(side){
    const s=Game[side];
    if(!s || !s.blade || !s.ratchet || !s.bit) return;
    const combo=calculateComboStats(s.blade,s.ratchet,s.bit);
    s.stats=combo.stats;
    s.comboOVR=combo.ovr;
    s.comboMeta=combo.meta;
    return combo;
}

function assignStadiumSides(){
    Game.arena=Game.arena||{};
    Game.arena.playerSide="Left";
    Game.arena.cpuSide="Right";
    Game.arena.playerColor="Blue";
    Game.arena.cpuColor="Red";
}

function generateCPUCombo(force=false){
    if(!force && Game.cpu?.blade && Game.cpu?.ratchet && Game.cpu?.bit) return;
    const playerTier=Game.player.blade?.tier;
    const playerBlade=Game.player.blade;
    const playerRatchet=Game.player.ratchet;
    const playerBit=Game.player.bit;
    const allBlades=Object.values(BLADE_ENGINE);
    const tierPool=Game.mode==="custom" ? allBlades : allBlades.filter(b=>!playerTier || b.tier===playerTier);
    const differentBlades=tierPool.filter(b=>b!==playerBlade && b.name!==playerBlade?.name);
    const bladePool=differentBlades.length?differentBlades:tierPool.filter(b=>b!==playerBlade);
    const finalBladePool=bladePool.length?bladePool:allBlades;
    // CPU may never share the player's selected Blade, Ratchet, or Bit.
    const differentRatchets=RATCHETS.filter(r=>r!==playerRatchet && r.name!==playerRatchet?.name);
    const ratchetPool=differentRatchets.length?differentRatchets:RATCHETS;
    const allBits=Object.values(BIT_ENGINE);
    const differentBits=allBits.filter(b=>b!==playerBit && b.name!==playerBit?.name);
    const bitPool=differentBits.length?differentBits:allBits;
    Game.cpu.blade=finalBladePool[Math.floor(Math.random()*finalBladePool.length)];
    Game.cpu.ratchet=ratchetPool[Math.floor(Math.random()*ratchetPool.length)];
    Game.cpu.bit=bitPool[Math.floor(Math.random()*bitPool.length)];
    Game.cpu.spin=Game.cpu.blade.spin||"Right";
    Game.cpu.launch={angle:null,technique:null,quality:null};
    syncComboStats("player"); syncComboStats("cpu");
}



function showVS(){
    generateCPUCombo();
    assignStadiumSides();

    // Match is first-to-7 points. Only initialize this when creating the
    // matchup; individual battle sequences preserve the score.
    Game.battle.score=Game.battle.score||{player:0,cpu:0};
    Game.battle.round=1;

    // NEW BATTLE FLOW:
    // VS screen is the final setup screen. CONTINUE enters the new
    // continuous battle simulation directly. The old launch screens,
    // launch animation, zone engine and battle sequence engine are gone.
    showLetItRip();
}

function showLetItRip(){

    if(!Game.player.blade || !Game.player.ratchet || !Game.player.bit ||
       !Game.cpu.blade || !Game.cpu.ratchet || !Game.cpu.bit){
        console.error("Launch setup blocked: combo data is missing.");
        return;
    }

    Game.player.launch=Game.player.launch||{};
    Game.player.launch.angle=Game.player.launch.angle||"Flat";
    Game.player.launch.technique=Game.player.launch.technique||"Center";

    if(!Game.player.launch.setupStage){
        Game.player.launch.setupStage="quality";
    }

    // setupStage is deliberately separate from qualityMode.
    // Quality is selected once, then the user moves to angle/technique.
    const stage=Game.player.launch.setupStage || "quality";

    if(stage==="quality" && !Game.player.launch.fixedQualityPreview){
        Game.player.launch.fixedQualityPreview=rollRandomLaunchQuality();
    }

    // Do not reveal or physically commence the CPU launch while the player
    // is still choosing. The CPU plan is generated again when LET IT RIP is
    // pressed, after the player's final technique is locked.
    NEW_BATTLE.player=newBattleLaunchState("player");
    NEW_BATTLE.cpu=newBattleLaunchState("cpu");

    // CPU preview: visible Bey only, no launch plan/quality revealed.
    // Place it slightly inside its own side of center and keep it stationary.
    const previewCycle=
        Math.floor((Game.battle?.round||0)/2)%2;
    const previewPlayerSign=previewCycle===0 ? -1 : 1;
    const previewCpuSign=-previewPlayerSign;

    NEW_BATTLE.cpu.x=previewCpuSign*0.22;
    NEW_BATTLE.cpu.y=0;
    NEW_BATTLE.cpu.vx=0;
    NEW_BATTLE.cpu.vy=0;
    NEW_BATTLE.cpu.railEngaged=false;
    NEW_BATTLE.cpu.railExited=false;
    NEW_BATTLE.cpu.launchComplete=false;
    NEW_BATTLE.cpu.launchQuality=null;
    NEW_BATTLE.cpu.launchPlan=null;

    NEW_BATTLE.active=false;

    // The CPU's real launch remains undisclosed until the player commits.
    if(Game.cpu.launch){
        Game.cpu.launch.technique=null;
        Game.cpu.launch.angle=null;
        Game.cpu.launch.quality=null;
    }

    renderNewBattle();

    const card=document.querySelector("#newStadium")?.parentElement;
    if(!card) return;

    // Re-rendering launch setup must replace the previous controls.
    // Keeping stale controls created duplicate IDs and could make the
    // document lookup return an element from the wrong stage.
    document.getElementById("launchControls")?.remove();

    const controls=document.createElement("div");
    controls.id="launchControls";
    controls.style.cssText=
        "margin:0 0 8px;position:sticky;top:0;z-index:20;";

    const angleButton=(label,value,id)=>`
      <button id="${id}" class="menu-btn ${Game.player.launch.angle===value?"gold":"silver"}"
        type="button">${label}</button>`;

    const techButton=(label,value,id)=>`
      <button id="${id}" class="menu-btn ${Game.player.launch.technique===value?"gold":"silver"}"
        type="button">${label}</button>`;

    const qualityRPM={
        Horrible:90,Bad:94,Okay:97,Good:99,Perfect:100
    }[Game.player.launch.quality]||97;

    if(stage==="qualityReveal"){
        controls.innerHTML=`
          <div class="launch-quality-reveal">
            <div class="launch-quality-column player-quality-reveal"><span>YOUR LAUNCH</span><strong>${Game.player.launch.quality}</strong><small>${Game.player.launch.qualityMode==="Roll" ? "ROLLED QUALITY" : "FIXED QUALITY"}</small></div>
            <div class="launch-quality-divider">VS</div>
            <div class="launch-quality-column cpu-quality-reveal"><span>CPU LAUNCH</span><strong>${Game.cpu.launch?.quality||"Okay"}</strong><small>CPU ROLL</small></div>
          </div>
        `;

        // Reveal exactly once. No buttons exist during this stage, so there
        // is no way to reroll or go backward during the reveal.
        if(!Game.player.launch.qualityRevealStarted){
            Game.player.launch.qualityRevealStarted=Date.now();
            setTimeout(()=>{
                if(Game.player.launch.setupStage==="qualityReveal"){
                    Game.player.launch.setupStage="launch";
                    Game.player.launch.qualityRevealStarted=0;
                    showLetItRip();
                }
            },1000);
        }
    }else if(stage==="quality"){
        controls.innerHTML=`
          <div style="padding:8px;background:rgba(0,0,0,.20);border-radius:9px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <button class="menu-btn silver" id="fixedQualityBtn" type="button">
                ${Game.player.launch.fixedQualityPreview || "Okay"}
              </button>
              <button class="menu-btn gold" id="rollQualityBtn" type="button">
                ROLL QUALITY
              </button>
            </div>

            <div style="font-size:11px;opacity:.60;text-align:center;margin-top:8px;">
              Left = shown quality · Roll = random quality
            </div>

            <div style="display:flex;gap:8px;margin-top:6px;">
              <button class="menu-btn silver" id="backToVS" type="button" style="flex:1;">
                ← BACK
              </button>
            </div>
          </div>
        `;
    }else{
        controls.innerHTML=`
          <div style="padding:8px;background:rgba(0,0,0,.20);border-radius:9px;">
            <div style="font-size:12px;opacity:.72;margin-bottom:7px;">LAUNCH ANGLE</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;">
              ${angleButton("FLAT","Flat","launchFlat")}
              ${angleButton("SLIGHT TILT","Slight Tilt","launchSlight")}
              ${angleButton("HARD TILT","Hard Tilt","launchHard")}
            </div>

            <div style="font-size:12px;opacity:.72;margin:7px 0 5px;">LAUNCH TECHNIQUE</div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:5px;">
              ${techButton("CENTER","Center","launchCenter")}
              ${techButton("X-RAIL","X-Rail","launchRail")}
              ${techButton("DIRECT CLASH","Direct Clash","launchClash")}
              ${techButton("DROP LAUNCH","Drop Launch","launchDrop")}
            </div>

            <div id="launchInfo" style="margin-top:6px;font-size:12px;opacity:.82;text-align:center;">
              ${Game.player.launch.angle} · ${Game.player.launch.technique}
              <br>
              <strong>LAUNCH QUALITY: ${Game.player.launch.quality || "Okay"}</strong>
              · ${Game.player.launch.qualityMode==="Roll" ? "ROLLED" : "FIXED"}
              · START RPM: ${qualityRPM}%
            </div>

            <div style="display:flex;gap:8px;margin-top:6px;">
              <button class="menu-btn gold" id="startBattleNow" type="button" style="flex:1;">
                LET IT RIP
              </button>
              <button class="menu-btn silver" id="backToQuality" type="button" style="flex:1;">
                ← QUALITY
              </button>
            </div>
          </div>
        `;
    }

    card.insertBefore(controls,document.getElementById("newStadium"));

    const rebuildAngleTechnique=(angle,technique)=>{
        Game.player.launch.angle=angle;
        Game.player.launch.technique=technique;
        // Quality is already selected and MUST NOT reroll here.
        Game.player.launch.setupStage="launch";
        showLetItRip();
    };

    if(stage==="quality"){
        const fixedQualityBtn=controls.querySelector("#fixedQualityBtn");
        const rollQualityBtn=controls.querySelector("#rollQualityBtn");
        const backToVS=controls.querySelector("#backToVS");

        if(fixedQualityBtn){
            fixedQualityBtn.onclick=()=>{
                Game.player.launch.quality=
                    Game.player.launch.fixedQualityPreview ||
                    rollRandomLaunchQuality();
                Game.cpu.launch=Game.cpu.launch||{};
                Game.cpu.launch.quality=rollRandomLaunchQuality();
                Game.player.launch.qualityMode="Fixed";
                Game.player.launch.setupStage="qualityReveal";
                showLetItRip();
            };
        }

        if(rollQualityBtn){
            rollQualityBtn.onclick=()=>{
                rollLaunchQuality("player");
                Game.cpu.launch=Game.cpu.launch||{};
                Game.cpu.launch.quality=rollRandomLaunchQuality();
                Game.player.launch.setupStage="qualityReveal";
                showLetItRip();
            };
        }

        if(backToVS) backToVS.onclick=showVS;
        return;
    }

    const bindLaunchButton=(id,fn)=>{
        const button=controls.querySelector("#"+id);
        if(button) button.onclick=fn;
    };

    bindLaunchButton("launchFlat",()=>
        rebuildAngleTechnique("Flat",Game.player.launch.technique));

    bindLaunchButton("launchSlight",()=>
        rebuildAngleTechnique("Slight Tilt",Game.player.launch.technique));

    bindLaunchButton("launchHard",()=>
        rebuildAngleTechnique("Hard Tilt",Game.player.launch.technique));

    bindLaunchButton("launchCenter",()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Center"));

    bindLaunchButton("launchRail",()=>
        rebuildAngleTechnique(Game.player.launch.angle,"X-Rail"));

    bindLaunchButton("launchClash",()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Direct Clash"));

    bindLaunchButton("launchDrop",()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Drop Launch"));

    const startButton=controls.querySelector("#startBattleNow");
    if(startButton){
        startButton.onclick=(event)=>{
            event?.preventDefault?.();

            // The CPU preview is intentionally incomplete. Its real launch
            // is generated only now, after the player's choices are locked.
            startNewBattle();
        };
    }

    const backToQuality=controls.querySelector("#backToQuality");
    if(backToQuality){
        backToQuality.onclick=()=>{
            Game.player.launch.setupStage="quality";
            showLetItRip();
        };
    }
}

/*========================================================
 NEW BATTLE ENGINE — STEP 1
 VS screen -> continuous physical simulation

 This deliberately starts with only:
 - launch starting conditions
 - continuous X/Y movement
 - RPM
 - velocity
 - stability
 - stadium boundary
 - basic physical contact

 No old launch screens, zone routing, battleTick, or legacy
 battle progression are used.
========================================================*/

const NEW_STADIUM_GEOMETRY = {
    // Normalized top-down coordinates: x/y are percentages of the stadium.
    // Screen orientation is fixed: players launch from LEFT and RIGHT.
    battleZone: { cx:50, cy:45, rx:34, ry:36 },

    // X Rail is an open track with a dedicated top X Exit gap.
    xRail: {
        loop: "open",
        path: "upper-inner-loop",
        exit: { x:50, y:18, direction:"toward-center" }
    },

    bottomRail: {
        y:82,
        left: { x1:0, x2:35 },
        center: { x1:35, x2:65 },
        right: { x1:65, x2:100 }
    },

    pockets: {
        left:  { x:20, y:91, w:24, h:9 },
        right: { x:80, y:91, w:24, h:9 }
    },

    xtremeZone: { x:50, y:91, w:22, h:9 }
};

const NEW_BATTLE = {
    raf:null,
    last:0,
    elapsed:0,
    active:false,
    player:null,
    cpu:null,
    railGeometry:null
};

// Self-contained helper for the NEW engine.
// Do not depend on any removed legacy battle helpers.
function newBattleClamp(value,min,max){
    return Math.max(min,Math.min(max,value));
}


/*========================================================
 LAUNCH QUALITY — CANONICAL
========================================================*/
const LAUNCH_QUALITY_WEIGHTS=[
    ["Horrible",8],["Bad",17],["Okay",40],["Good",25],["Perfect",10]
];

function rollRandomLaunchQuality(){
    let total=0;
    for(const [,weight] of LAUNCH_QUALITY_WEIGHTS) total+=weight;
    let roll=Math.random()*total;
    for(const [quality,weight] of LAUNCH_QUALITY_WEIGHTS){
        roll-=weight;
        if(roll<=0) return quality;
    }
    return "Okay";
}

function rollLaunchQuality(side){
    if(!Game[side]) return "Okay";
    Game[side].launch=Game[side].launch||{};
    Game[side].launch.quality=rollRandomLaunchQuality();
    Game[side].launch.qualityMode="Roll";
    return Game[side].launch.quality;
}

function ensureLaunchQuality(side){
    if(!Game[side]) return "Okay";
    Game[side].launch=Game[side].launch||{};
    if(!Game[side].launch.quality){
        Game[side].launch.quality=rollRandomLaunchQuality();
    }
    return Game[side].launch.quality;
}

function getAutomaticLaunchPlan(side){
    const combo=Game[side];
    const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);
    const type=combo.blade.type;
    const bitName=combo.bit.name;
    const personality=combo.blade.personality||{aggression:50,control:50,risk:50};

    /*
      CPU launch is adaptive, not permanently Center.
      It reads the player's locked technique when available, then chooses
      from several physically sensible responses with personality weighting.
    */
    const playerLaunch=Game.player?.launch||{};
    const playerTechnique=playerLaunch.technique||"Center";
    const attackBits=["Flat","Low Flat","Low Rush","Rush","Kick","Quake"];
    const isAttackBit=attackBits.includes(bitName);
    const roll=Math.random();

    let technique="Center";

    if(type==="Attack" && isAttackBit){
        if(playerTechnique==="X-Rail"){
            technique=roll<0.34 ? "X-Rail" :
                      roll<0.64 ? "Direct Clash" :
                      roll<0.84 ? "Center" : "Drop Launch";
        }else if(playerTechnique==="Direct Clash"){
            technique=roll<0.48 ? "Direct Clash" :
                      roll<0.68 ? "Center" :
                      roll<0.88 ? "X-Rail" : "Drop Launch";
        }else if(playerTechnique==="Drop Launch"){
            technique=roll<0.30 ? "Direct Clash" :
                      roll<0.58 ? "X-Rail" :
                      roll<0.82 ? "Center" : "Drop Launch";
        }else{
            technique=roll<0.28 ? "Direct Clash" :
                      roll<0.52 ? "X-Rail" :
                      roll<0.78 ? "Center" : "Drop Launch";
        }
    }else if(type==="Attack"){
        technique=roll<0.24 ? "Direct Clash" :
                  roll<0.48 ? "X-Rail" :
                  roll<0.82 ? "Center" : "Drop Launch";
    }else if(type==="Defense" || type==="Stamina"){
        // Defensive/stamina CPU still varies, but favors neutral starts.
        technique=roll<0.16 ? "X-Rail" :
                  roll<0.30 ? "Drop Launch" :
                  roll<0.46 ? "Direct Clash" : "Center";
    }else{
        technique=roll<0.20 ? "X-Rail" :
                  roll<0.38 ? "Direct Clash" :
                  roll<0.55 ? "Drop Launch" : "Center";
    }

    let angle="Flat";
    if(type==="Defense" || type==="Stamina") angle=roll<0.72 ? "Slight Tilt" : "Flat";
    if(type==="Attack" && personality.aggression>=90) angle="Flat";
    if(playerLaunch.angle==="Hard Tilt" && roll<0.35) angle="Hard Tilt";
    else if(playerLaunch.angle==="Slight Tilt" && roll<0.45) angle="Slight Tilt";

    const qualityBase=
        (stats.balance||70)*0.25 +
        (stats.mobility||70)*0.20 +
        (stats.stamina||70)*0.15 +
        (personality.consistency||50)*0.40;
    const qualityRoll=qualityBase + (Math.random()*14-7);
    const rolledQuality=qualityRoll>=92?"Perfect":
        qualityRoll>=82?"Good":
        qualityRoll>=68?"Okay":
        qualityRoll>=55?"Bad":"Horrible";
    const quality=side==="cpu" ? (Game.cpu?.launch?.quality||rolledQuality) : (Game.player?.launch?.quality||rolledQuality);

    return {technique,angle,quality};
}

function newBattleLaunchState(side){
    const combo=Game[side];
    const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);

    const plan =
        side==="player" && Game.player.launch?.technique
            ? {
                technique:Game.player.launch.technique,
                angle:Game.player.launch.angle||"Flat",
                quality:Game.player.launch.quality ||
                    ensureLaunchQuality("player")
              }
            : getAutomaticLaunchPlan(side);

    const qualityFactor={
        Horrible:0.72,Bad:0.86,Okay:1.00,Good:1.08,Perfect:1.15
    }[plan.quality]||1;

    // Launch quality is a physical starting condition.
    // Better quality means a cleaner placement and more RPM at release.
    const qualityRPM={
        Horrible:0.90,
        Bad:0.94,
        Okay:0.97,
        Good:0.99,
        Perfect:1.00
    }[plan.quality]||0.97;

    const qualityPlacement={
        Horrible:0.085,
        Bad:0.055,
        Okay:0.030,
        Good:0.014,
        Perfect:0.004
    }[plan.quality]||0.030;

    const placementJitter=(Math.random()-0.5)*qualityPlacement;

    if(!plan.quality){
        plan.quality=ensureLaunchQuality(side);
    }

    const isDropLaunch=plan.technique==="Drop Launch";

    /*
      Stadium orientation alternates every two completed battle sequences.
      0-1: player left / CPU right.
      2-3: player right / CPU left.
      Then the orientation repeats.
    */
    const orientationCycle=
        Math.floor((Game.battle?.round||0)/2)%2;
    const playerOnLeft=orientationCycle===0;
    const playerSideSign=playerOnLeft?-1:1;
    const sideXSign=
        side==="player" ? playerSideSign : -playerSideSign;
    const launchDirection=-sideXSign;

    const isXRailLaunch=plan.technique==="X-Rail";
    const isCenterLaunch=plan.technique==="Center";

    /*
      X-Rail is a deliberate rail-seeking launch. Start near the appropriate
      upper rail rather than at the normal center-entry lane, then let the
      physical rail-capture test decide whether the Bey actually latches.
    */
    let startX=isCenterLaunch
        ? 0
        : isDropLaunch
            ? sideXSign*(0.28 + placementJitter*0.05)
            : isXRailLaunch
                ? sideXSign*(0.68 + placementJitter*0.05)
                : sideXSign*(0.70 + placementJitter*0.18);

    // Drop hangs under the top X-Rail, beside the X-Exit (not on the rail
    // and not inside the V). X-Rail still starts at the lower corner.
    let startY=isCenterLaunch
        ? 0
        : isDropLaunch
            ? -0.64 + placementJitter*0.02
            : isXRailLaunch
                ? placementJitter*0.06
                : placementJitter;

    const direction=(isDropLaunch || isCenterLaunch) ? 0 : launchDirection;

    // Launch angle is a real release vector:
    // Flat = forward/stable
    // Slight Tilt = controlled lateral release
    // Hard Tilt = stronger lateral release + more instability/RPM cost
    const tilt={
        "Flat":       {lateral:0.000, speed:1.00, stability:0.000, rpm:1.00},
        "Slight Tilt":{lateral:0.055, speed:0.985, stability:0.018, rpm:1.06},
        "Hard Tilt":  {lateral:0.105, speed:0.965, stability:0.042, rpm:1.14}
    }[plan.angle] || {lateral:0,speed:1,stability:0,rpm:1};

    const techniqueSpeed={
        Center:1.00,
        "Direct Clash":1.18,
        "X-Rail":1.16,
        "Drop Launch":0.96
    }[plan.technique]||1;

    const launchSpeed=
        (0.0420+(stats.mobility||70)*0.000110)*
        qualityFactor*techniqueSpeed*tilt.speed;

    const tiltSign=side==="player"?-1:1;
    let vx=direction*launchSpeed;
    let vy=tiltSign*tilt.lateral*launchSpeed;

    if(isCenterLaunch){
        vx=0;
        vy=0;
    }

    if(isXRailLaunch){
        /*
          V81 X-RAIL LAUNCH CONTRACT
          -------------------------
          X-Rail launches begin at the LOWER CORNER of the top rail on the
          player's side. The launch quality determines how accurately the
          Bey reaches that corner; a poor launch can miss the rail.

          RIGHT spin follows the authored rail path:
            lower-left entry -> around the stadium -> lower-right/top exit.

          LEFT spin follows the exact reverse.

          IMPORTANT: the launch tangent and the rider tangent use the SAME
          railDirection() convention. No separate sign inversion is allowed.
        */
        const railHint = sideXSign < 0
            ? {x:-0.75,y:0.45}
            : {x: 0.75,y:0.45};

        const railTarget=
            (window.SpinWarsXRailEngine &&
             typeof window.SpinWarsXRailEngine.nearest==="function")
                ? window.SpinWarsXRailEngine.nearest(railHint.x,railHint.y)
                : newXRailNearest(railHint.x,railHint.y);

        const railRadius=Math.hypot(
            railTarget.x,
            railTarget.y
        )||1;

        // Spawn on the inside of the rail. Better launches start closer and
        // are more likely to hook. Horrible launches sit far enough inside
        // that they often miss and stay in the bowl.
        const inwardX=-railTarget.x/railRadius;
        const inwardY=-railTarget.y/railRadius;

        const qualityMiss={
            Horrible:0.11,
            Bad:0.068,
            Okay:0.034,
            Good:0.014,
            Perfect:0.003
        }[plan.quality]||0.034;

        const missAngle=(Math.random()*2-1)*Math.PI;
        const missX=Math.cos(missAngle)*qualityMiss;
        const missY=Math.sin(missAngle)*qualityMiss;

        const entryOffset={
            Horrible:0.165,
            Bad:0.092,
            Okay:0.048,
            Good:0.022,
            Perfect:0.010
        }[plan.quality]||0.048;

        const actualStartX=
            railTarget.x+
            inwardX*entryOffset+
            missX;
        const actualStartY=
            railTarget.y+
            inwardY*entryOffset+
            missY;

        // Override the generic start position for X-Rail only.
        // This keeps all other launch techniques untouched.
        startX=actualStartX;
        startY=actualStartY;

        const dx=railTarget.x-startX;
        const dy=railTarget.y-startY;
        const d=Math.hypot(dx,dy)||1;

        const approachX=dx/d;
        const approachY=dy/d;

        /*
          ONE source of truth:
          railDirection() already defines Right-spin as the authored
          LEFT -> RIGHT path. Use that same sign here.
        */
        const spinDirection =
            combo.blade?.spin==="Left" ? -1 : 1;
        const railTravelDirection=spinDirection===-1 ? -1 : 1;

        const railTangentX=railTarget.tx*railTravelDirection;
        const railTangentY=railTarget.ty*railTravelDirection;

        const tangentWeight=
            plan.quality==="Perfect" ? 0.72 :
            plan.quality==="Good" ? 0.64 :
            plan.quality==="Okay" ? 0.54 :
            plan.quality==="Bad" ? 0.42 : 0.28;
        const approachWeight=1-tangentWeight;
        const railLaunchSpeed=launchSpeed*(1.03+0.07*qualityFactor);

        vx=
            (railTangentX*tangentWeight+
             approachX*approachWeight)*
            railLaunchSpeed;

        vy=
            (railTangentY*tangentWeight+
             approachY*approachWeight)*
            railLaunchSpeed;
    }

    if(plan.technique==="Drop Launch"){
        // Start suspended near the player's side of the X Exit. The actual
        // downward release is handled by the physics step after the stall.
        vx=0;
        vy=0;
    }

    const tiltStall=
        plan.angle==="Slight Tilt" ? 0.22 :
        plan.angle==="Hard Tilt" ? 0.28 : 0;

    const dropStallDuration=
        plan.technique==="Drop Launch"
            ? (plan.angle==="Hard Tilt" ? 1.15 :
               plan.angle==="Slight Tilt" ? 0.72 : 0.42)
            : 0;

    return {
        side,x:startX,y:startY,vx,vy,rpm:qualityRPM,
        stability:newBattleClamp(
            ((stats.balance||70)/100)-tilt.stability+
            (plan.quality==="Perfect"?0.035:plan.quality==="Good"?0.018:0),
            0.40,1
        ),
        radius:0.124,
        // Physical mass is based on the actual blade weight. It is used for
        // collision energy; it does not replace Attack/Knockback stats.
        mass:Math.max(0.82,Math.min(1.18,(combo.blade?.weight||35)/35)),
        hitFlash:0,impactScale:1,lastKnockback:0,
        stats,blade:combo.blade,bit:combo.bit,
        launchPlan:plan,
        launchQuality:plan.quality,
        launchSpeed,
        launchQualityRPM:qualityRPM,
        launchPlacementError:qualityPlacement,
        launchRpmLossMultiplier:tilt.rpm,
        launchTilt:plan.angle,
        launchStall:dropStallDuration,
        launchStallElapsed:0,
        launchDropActive:plan.technique==="Drop Launch",
        launchDropReleased:false,
        launchDropFalling:false,
        launchDropElapsed:0,
        launchSideSign:sideXSign,
        launchComplete:false,

        // Natural movement state: these alter forces over time rather than
        // drawing a fixed orbit.
        motionPhase:Math.random()*Math.PI*2,
        motionPhase2:Math.random()*Math.PI*2,
        movementNoiseX:(Math.random()-0.5)*0.0002,
        movementNoiseY:(Math.random()-0.5)*0.0002,
        movementNoiseTimer:0.25+Math.random()*0.35,
        movementEnergy:newBattleClamp(
            0.92+
            getBattleStat({stats},"stamina")*0.08,
            0.92,1.0
        ),
        statProfile:{
            attack:getBattleStat({stats},"attack"),
            knockback:getBattleStat({stats},"knockback"),
            defense:getBattleStat({stats},"defense"),
            mobility:getBattleStat({stats},"mobility"),
            balance:getBattleStat({stats},"balance"),
            stamina:getBattleStat({stats},"stamina")
        },
        axisStability:newBattleClamp(
            (
                getBattleStat({stats},"balance")*0.72+
                getBattleStat({stats},"defense")*0.28
            )*
            ((bitPhysics({bit:combo.bit}).stability||70)/100),
            0.25,1
        ),
        tiltLevel:0.08,
        railUses:0,
        railCaptureCooldown:0,
        railCaptureCooldownPoint:null,
        railChainLock:0,
        railChainCount:0,
        railAwayTime:0,

        // Right spin = counter-clockwise; left spin = the exact reverse.
        spinDirection:(combo.blade?.spin==="Left" ? -1 : 1),
        railEngaged:false,railProgress:0,railDistance:0,
        railSpeed:0,railRideTime:0,railTravelDistance:0,
        railLoops:0,
        railGrip:0,
        railDirection:0,
        railContactPoint:null,
        railExited:false,
        railExitRefractory:0,
        railExitRefractoryPoint:null,
        finishRecoveryUsed:false,
        recoveredFlashUntil:0,
        surfaceRecovery:0,
        surfaceBounce:0
    };
}

function applyDirectClashAim(self, other){
    if(!self || !other) return;
    if(self.launchPlan?.technique!=="Direct Clash") return;
    const dx=other.x-self.x;
    const dy=other.y-self.y;
    const dist=Math.hypot(dx,dy)||0.001;
    const quality=self.launchQuality || self.launchPlan?.quality || "Okay";
    const missRad={
        Perfect:0.04,
        Great:0.07,
        Good:0.10,
        Okay:0.18,
        Bad:0.30,
        Poor:0.30,
        Horrible:0.48,
        Terrible:0.48
    }[quality]||0.18;
    const miss=(Math.random()*2-1)*missRad;
    const ux=dx/dist;
    const uy=dy/dist;
    const cos=Math.cos(miss);
    const sin=Math.sin(miss);
    const ax=ux*cos-uy*sin;
    const ay=ux*sin+uy*cos;
    const speed=Math.max(Number(self.launchSpeed)||0, 0.028);
    self.vx=ax*speed;
    self.vy=ay*speed;
    self.impactMomentumState=Math.max(Number(self.impactMomentumState)||0, 0.92);
}

function applyDirectClashLaunches(p, c){
    applyDirectClashAim(p, c);
    applyDirectClashAim(c, p);
}

function startNewBattle(){
    // This is the only function allowed to start the live physics loop.
    // Validate the shared direction convention before any physics runs so
    // free movement and X-Rail cannot silently disagree.
    validatePhysicsDirectionContract();
    if(NEW_BATTLE.active) return false;

    if(!Game.player.blade || !Game.player.ratchet || !Game.player.bit ||
       !Game.cpu.blade || !Game.cpu.ratchet || !Game.cpu.bit){
        console.error("Battle start blocked: combo data is incomplete.");
        return false;
    }

    try{
        cancelAnimationFrame(NEW_BATTLE.raf);

    Game.screen="battle";
    Game.battle.engineMode="new_physics";
    Game.battle.phase="Launch";
    Game.battle.finished=false;
    Game.battle.matchStarted=true;
    Game.battle.matchFinished=false;
    Game.battle.exchange=0;
    Game.battle.round=Game.battle.round||0;
    Game.battle.orientation=
        Math.floor(Game.battle.round/2)%2;
    NEW_BATTLE.finishPending=false;

    // Rebuild once from the selected launch choices. This is the ONLY place
    // that starts physical battle state.
    NEW_BATTLE.player=newBattleLaunchState("player");
    NEW_BATTLE.cpu=newBattleLaunchState("cpu");
    applyDirectClashLaunches(NEW_BATTLE.player, NEW_BATTLE.cpu);

    Game.player.launch=Game.player.launch||{};
    Game.player.launch.angle=NEW_BATTLE.player.launchPlan.angle;
    Game.player.launch.technique=NEW_BATTLE.player.launchPlan.technique;
    Game.player.launch.quality=NEW_BATTLE.player.launchPlan.quality;

    Game.cpu.launch=Game.cpu.launch||{};
    Game.cpu.launch.angle=NEW_BATTLE.cpu.launchPlan?.angle||"Flat";
    Game.cpu.launch.technique=NEW_BATTLE.cpu.launchPlan?.technique||"Center";
    Game.cpu.launch.quality=NEW_BATTLE.cpu.launchPlan?.quality||"Okay";

        NEW_BATTLE.elapsed=0;
        NEW_BATTLE.active=true;
        NEW_BATTLE.last=performance.now();

        renderNewBattle();
        NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);

        return true;
    }catch(error){
        console.error("Spin Wars could not start the battle:",error);
        NEW_BATTLE.active=false;

        const app=document.getElementById("app");
        if(app){
            const note=app.querySelector("#newCommentary");
            if(note) note.textContent="Battle start error — launch state was rejected.";
        }

        return false;
    }
}
function renderNewBattle(){
    const app=document.getElementById("app");
    if(!app) return;

    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;

    // The game view is deliberately a top-down BX-10-style stadium:
    // square/octagonal outer body, circular battle bowl, open X Rail,
    // bottom-center X Rail exit, and the lower finish openings.
    const px=50+p.x*39;
    const py=46+p.y*39;
    const cx=50+c.x*39;
    const cy=46+c.y*39;

    const orientationCycle=
        Math.floor((Game.battle?.round||0)/2)%2;
    const playerSideLabel=
        orientationCycle===0 ? "LEFT SIDE" : "RIGHT SIDE";
    const cpuSideLabel=
        orientationCycle===0 ? "RIGHT SIDE" : "LEFT SIDE";

    app.innerHTML=`
      <div class="background"></div>
      <main class="menu" style="max-width:920px;">
        <section class="menu-card" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>BATTLE</strong>
            <span style="font-weight:700;">${Game.battle.score?.player||0} — ${Game.battle.score?.cpu||0}</span>
            <span style="opacity:.65;font-size:12px;">FIRST TO 7</span>
          </div>

          <div id="newStadium" style="
            position:relative;width:min(68vw,58vh,560px);aspect-ratio:1/1;
            margin:7px auto;background:#c9cdd0;
            border:2px solid #6d757b;overflow:hidden;
            clip-path:polygon(7% 0,93% 0,100% 7%,100% 93%,93% 100%,7% 100%,0 93%,0 7%);
            box-shadow:0 10px 28px rgba(0,0,0,.38);">

            <svg viewBox="0 0 100 100"
                 preserveAspectRatio="none"
                 style="position:absolute;inset:0;width:100%;height:100%;">

              <!-- Outer BX-10 body / frame -->
              <polygon points="7,3 93,3 97,7 97,93 93,97 7,97 3,93 3,7"
                       fill="#b9bdc0" stroke="#6d757b" stroke-width="1.2"/>

              <!-- Main bowl -->
              <ellipse cx="50" cy="45" rx="39" ry="39"
                       fill="#e8eaeb" stroke="#9da3a7" stroke-width="1.1"/>
              <ellipse cx="50" cy="45" rx="34.5" ry="34.5"
                       fill="#d7dbdd" stroke="#b2b7ba" stroke-width=".8"/>

              <!-- Recessed lower finish area -->
              <path d="M7 76 L24 76 L29 84 L71 84 L76 76 L93 76 L93 97 L7 97 Z"
                    fill="#aeb3b6" stroke="#777f84" stroke-width="1"/>

              <!-- Bottom rail / ledge -->
              <path d="M8 78 L29 78 L33 84 L67 84 L71 78 L92 78"
                    fill="none" stroke="#737b80" stroke-width="2.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 79.8 L29.5 79.8 L33.5 85.6 L66.5 85.6 L70.5 79.8 L92 79.8"
                    fill="none" stroke="#eef0f1" stroke-width=".8"
                    stroke-linecap="round" opacity=".8"/>

              <!-- LEFT POCKET: angled opening behind bottom rail -->
              <path d="M10 82 L27 82 L32 88 L32 94 L10 94 Z"
                    fill="#6f7579" stroke="#555c61" stroke-width="1"/>
              <path d="M12 84 L25.5 84 L29.5 89 L29.5 93 L12 93 Z"
                    fill="#30363a"/>
              <path d="M10 82 L27 82 L32 88"
                    fill="none" stroke="#eceeef" stroke-width="1"/>

              <!-- XTREME ZONE: center opening behind the lower rail -->
              <path d="M34 84 L66 84 L62 96 L38 96 Z"
                    fill="#777d81" stroke="#555c61" stroke-width="1"/>
              <path d="M37 86 L63 86 L60 94 L40 94 Z"
                    fill="#363c40"/>
              <path d="M34 84 L66 84"
                    stroke="#f0f1f2" stroke-width="1"/>

              <!-- RIGHT POCKET -->
              <path d="M73 82 L90 82 L90 94 L68 94 L68 88 Z"
                    fill="#6f7579" stroke="#555c61" stroke-width="1"/>
              <path d="M74.5 84 L88 84 L88 93 L70.5 93 L70.5 89 Z"
                    fill="#30363a"/>
              <path d="M73 82 L90 82 L90 94"
                    fill="none" stroke="#eceeef" stroke-width="1"/>

              <!-- X RAIL: TOP X-RAIL / X-EXIT.
                   The rail is at the TOP of the stadium. Its two endpoints
                   form the X-Exit gap. The exit launches the Bey inward
                   toward the center; normal battle physics can then carry
                   it toward the bottom Xtreme/Over area. -->
              <path d="
                M 44.8 10.3
                C 41.6 8.2 37.2 7.2 32.8 9.3
                C 20.8 15.1 14.0 29.0 14.7 45.5
                C 15.6 63.0 29.6 76.8 50.0 77.7
                C 70.4 76.8 84.4 63.0 85.3 45.5
                C 86.0 29.0 79.2 15.1 67.2 9.3
                C 62.8 7.2 58.4 8.2 55.2 10.3"
                fill="none" stroke="#18a84a" stroke-width="2.1"
                stroke-linecap="round" stroke-linejoin="round"/>

              <!-- X EXIT BODY: top-center launch structure. -->
              <path d="
                M 44.8 10.3
                L 50 17.5
                L 55.2 10.3
                L 52.3 15.2
                L 50 21.0
                L 47.7 15.2
                Z"
                fill="#18a84a"
                stroke="#18a84a"
                stroke-width="1.2"
                stroke-linejoin="round"/>

              <!-- X EXIT LANE: launch from the top rail into the bowl. -->
              <path d="M 47.7 15.2 L 50 21.0 L 52.3 15.2"
                    fill="none"
                    stroke="#18a84a"
                    stroke-width="2.1"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>

              <!-- Beys -->
              <circle id="newPlayerBey" cx="${px}" cy="${py}" r="4.85"
                      fill="#d8a82c" stroke="#ffffff" stroke-width=".65"/>
              <circle id="newCpuBey" cx="${cx}" cy="${cy}" r="4.85"
                      fill="#aeb7c0" stroke="#ffffff" stroke-width=".65"/>

              <!-- Actual battle impact renderer. These IDs are the targets
                   updated by newBattleFrame() on every collision. -->
              <g id="impactEffect" opacity="0" pointer-events="none">
                <circle id="impactFlash" cx="50" cy="46" r="10"
                        fill="none" stroke="#ffffff" stroke-width="2.6"/>
                <circle id="impactRing" cx="50" cy="46" r="6"
                        fill="none" stroke="#ffd43b" stroke-width="1.8"/>
                <circle id="impactRing2" cx="50" cy="46" r="4"
                        fill="none" stroke="#ffffff" stroke-width="1.5"/>
                <circle id="impactRing3" cx="50" cy="46" r="2"
                        fill="none" stroke="#ffd43b" stroke-width="1.2"/>
                <circle id="impactExplosion" cx="50" cy="46" r="4"
                        fill="#ffffff" stroke="#ffffff" stroke-width="2.4"/>
                <circle id="impactCore" cx="50" cy="46" r="3"
                        fill="#ffd43b"/>
                <g id="impactShock" opacity="0">
                  <circle id="impactShockOuter" cx="50" cy="46" r="6"
                          fill="none" stroke="#ffffff" stroke-width="1.8"/>
                  <line x1="50" y1="46" x2="50" y2="40"
                        stroke="#ffffff" stroke-width="1.8"/>
                  <line x1="50" y1="46" x2="56" y2="46"
                        stroke="#ffffff" stroke-width="1.8"/>
                  <line x1="50" y1="46" x2="50" y2="52"
                        stroke="#ffd43b" stroke-width="1.8"/>
                  <line x1="50" y1="46" x2="44" y2="46"
                        stroke="#ffd43b" stroke-width="1.8"/>
                  <line x1="50" y1="46" x2="54.5" y2="41.5"
                        stroke="#ffffff" stroke-width="1.5"/>
                  <line x1="50" y1="46" x2="45.5" y2="50.5"
                        stroke="#ffffff" stroke-width="1.5"/>
                </g>
                <g id="impactSpokes" opacity="0">
                  <line x1="50" y1="46" x2="50" y2="42"
                        stroke="#ffffff" stroke-width="1.5"/>
                  <line x1="50" y1="46" x2="54" y2="46"
                        stroke="#ffffff" stroke-width="1.5"/>
                  <line x1="50" y1="46" x2="50" y2="50"
                        stroke="#ffd43b" stroke-width="1.5"/>
                  <line x1="50" y1="46" x2="46" y2="46"
                        stroke="#ffd43b" stroke-width="1.5"/>
                  <line x1="50" y1="46" x2="53" y2="43"
                        stroke="#ffffff" stroke-width="1.3"/>
                  <line x1="50" y1="46" x2="47" y2="49"
                        stroke="#ffffff" stroke-width="1.3"/>
                </g>
                <circle id="impactBurst1" cx="50" cy="46" r="1.5"
                        fill="#ffffff"/>
                <circle id="impactBurst2" cx="50" cy="46" r="1.5"
                        fill="#ffd43b"/>
                <text id="impactText" x="50" y="40"
                      text-anchor="middle" font-size="5.2"
                      font-weight="900" fill="#ffffff"></text>
                <text id="playerDamageText" x="50" y="46"
                      text-anchor="middle" font-size="3.5"
                      font-weight="900" fill="#35d26b" opacity="0"></text>
                <text id="cpuDamageText" x="50" y="46"
                      text-anchor="middle" font-size="3.5"
                      font-weight="900" fill="#ff4b4b" opacity="0"></text>
              </g>
              <text id="playerRecoveredText" x="50" y="46"
                    text-anchor="middle" font-size="4.0" font-weight="1000"
                    fill="#8bdcff" opacity="0">RECOVERED</text>
              <text id="cpuRecoveredText" x="50" y="46"
                    text-anchor="middle" font-size="4.0" font-weight="1000"
                    fill="#8bdcff" opacity="0">RECOVERED</text>
            </svg>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;">
            <div class="battle-hud-card battle-hud-player">
              <div class="battle-hud-top"><div><strong>${p.blade.name}</strong><span class="battle-side-label">${playerSideLabel}</span></div><span class="battle-hud-role">PLAYER</span></div>
              <div class="battle-combo-line">${p.blade.name} / ${p.ratchet?.name||""} / ${p.bit.name} <b>OVERALL ${p.comboMeta||Game.player.comboMeta||"—"}</b></div>
              <div class="rpm-readout"><span>RPM</span><b id="newPlayerRPM">${Math.round(p.rpm*100)}</b><em>%</em></div>
              <div class="rpm-bar-shell"><div id="newPlayerRPMBar" class="rpm-bar-fill rpm-bar-player"></div></div>
              <div class="stability-readout">STABILITY <b id="newPlayerStability">${Math.round(p.stability*100)}</b>%</div>
            </div>
            <div class="battle-hud-card battle-hud-cpu">
              <div class="battle-hud-top"><div><strong>${c.blade.name}</strong><span class="battle-side-label">${cpuSideLabel}</span></div><span class="battle-hud-role">CPU</span></div>
              <div class="battle-combo-line">${c.blade.name} / ${c.ratchet?.name||""} / ${c.bit.name} <b>OVERALL ${c.comboMeta||Game.cpu.comboMeta||"—"}</b></div>
              <div class="rpm-readout"><span>RPM</span><b id="newCpuRPM">${Math.round(c.rpm*100)}</b><em>%</em></div>
              <div class="rpm-bar-shell"><div id="newCpuRPMBar" class="rpm-bar-fill rpm-bar-cpu"></div></div>
              <div class="stability-readout">STABILITY <b id="newCpuStability">${Math.round(c.stability*100)}</b>%</div>
            </div>
          </div>

          <div id="newCommentary" style="margin-top:8px;padding:10px;background:rgba(0,0,0,.22);border-radius:8px;font-size:13px;">
            ${p.blade.name} ${
    p.launchPlan.technique==="Direct Clash" ? "comes out aggressively." :
    p.launchPlan.technique==="Drop Launch" ? "drops in from the X Exit." :
    "settles into its opening line."
}
            ${c.blade.name} ${
                c.launchPlan?.technique==="Direct Clash"
                    ? "answers with an aggressive launch."
                    : "is waiting for your launch."
            }
          </div>
        </section>
      </main>`;
}

function finishNewBattle(winnerSide,finishType="Spin Finish"){
    if(NEW_BATTLE.finishPending) return;

    NEW_BATTLE.finishPending=true;
    NEW_BATTLE.active=false;
    if(NEW_BATTLE.raf) cancelAnimationFrame(NEW_BATTLE.raf);

    Game.battle.score=Game.battle.score||{player:0,cpu:0};

    const finishPoints =
        finishType==="Xtreme" ? 3 :
        finishType==="Over" ? 2 :
        1;

    if(winnerSide==="player"){
        Game.battle.score.player+=finishPoints;
    }else{
        Game.battle.score.cpu+=finishPoints;
    }

    Game.battle.finishType=finishType;
    Game.battle.matchFinished=false;
    Game.battle.finished=false;

    const winner=winnerSide==="player"
        ? NEW_BATTLE.player
        : NEW_BATTLE.cpu;

    const loser=winnerSide==="player"
        ? NEW_BATTLE.cpu
        : NEW_BATTLE.player;

    const playerScore=Game.battle.score.player;
    const cpuScore=Game.battle.score.cpu;
    const matchWinner=
        playerScore>=7 ? "player" :
        cpuScore>=7 ? "cpu" : null;

    /*
      Keep the actual stadium visible after a Pocket/Xtreme. The Bey has
      already entered the finish area; don't replace it with a menu instantly.
    */
    const stadium=document.getElementById("newStadium");
    if(stadium){
        const flash=document.createElement("div");
        flash.className=`finish-flash finish-flash-${finishType.toLowerCase()}`;
        if(finishType==="Spin Finish"){
            flash.innerHTML=
                `<div class="finish-flash-spin-ring"></div>
                 <div class="finish-flash-kicker">${winner.blade.name}</div>
                 <div class="finish-flash-main">SPIN FINISH</div>
                 <div class="finish-flash-points">+1</div>`;
        }else{
            flash.innerHTML=
                `<div class="finish-lightning lightning-left">⚡</div>
                 <div class="finish-lightning lightning-right">⚡</div>
                 <div class="finish-flash-kicker">${winner.blade.name}</div>
                 <div class="finish-flash-main">${finishType.toUpperCase()} FINISH</div>
                 <div class="finish-flash-points">+${finishPoints}</div>`;
        }
        stadium.appendChild(flash);
    }
    const commentary=document.getElementById("newCommentary");
    if(commentary){
        commentary.textContent=
            finishType==="Xtreme"
                ? `${loser.blade.name} falls into the XTREME ZONE! ${winner.blade.name} +3`
                : finishType==="Over"
                    ? `${loser.blade.name} is knocked into the OVER ZONE! ${winner.blade.name} +2`
                    : `${winner.blade.name} wins by SPIN FINISH. +1`;
    }

    setTimeout(()=>{
        if(matchWinner){
            Game.battle.matchFinished=true;
            Game.battle.finished=true;
            Game.battle.winner=matchWinner;

            const finalWinner=
                matchWinner==="player"
                    ? NEW_BATTLE.player
                    : NEW_BATTLE.cpu;

            const app=document.getElementById("app");
            if(app){
                app.innerHTML=`
                  <div class="background"></div>
                  <main class="menu">
                    <div class="logo">
                      <div class="logo-icon">⚔</div>
                      <h1>${finalWinner.blade.name}</h1>
                      <p>WINS THE MATCH</p>
                    </div>
                    <section class="menu-card" style="text-align:center;">
                      <h2>${playerScore} — ${cpuScore}</h2>
                      <p>${finishType.toUpperCase()} · +${finishPoints} POINTS · FIRST TO 7</p>
                      <p style="opacity:.65;font-size:12px;">Returning to main menu...</p>
                    </section>
                  </main>`;
            }
            setTimeout(()=>location.reload(),1800);
            return;
        }

        /*
          Point scored. Reset only the battle physics and launch choices.
          Keep the same matchup and score. The next sequence starts at the
          quality screen.
        */
        Game.battle.round=(Game.battle.round||0)+1;
        Game.battle.finished=false;
        Game.battle.matchFinished=false;

        Game.player.launch=Game.player.launch||{};
        Game.player.launch.setupStage="quality";
        Game.player.launch.quality=null;
        Game.player.launch.qualityMode=null;
        Game.player.launch.fixedQualityPreview=null;
        Game.player.launch.qualityRevealStarted=0;
        Game.player.launch.angle="Flat";
        Game.player.launch.technique="Center";

        NEW_BATTLE.finishPending=false;
        NEW_BATTLE.active=false;
        Game.player.recoveredFlashUntil=0;
        Game.cpu.recoveredFlashUntil=0;
        NEW_BATTLE.player=null;
        NEW_BATTLE.cpu=null;

        showLetItRip();
    },2000);
}

function finishRecoveryChance(s,zone,knockForce){
    const rpm=newBattleClamp(s?.rpm,0,1);
    const tilt=newBattleClamp(s?.tiltLevel||0,0,1);
    const force=Math.max(0, Number(knockForce)||0);
    const speed=Math.hypot(s?.vx||0,s?.vy||0);
    const hitHard=newBattleClamp(force/0.042,0,1.45);
    const pocket=zone==="Pocket"||zone==="Over";
    const tiltWeight=pocket?0.54:0.36;
    // High RPM should often climb out of a medium knock. A hard,
    // well-aimed smash still pockets even a healthy Bey.
    return newBattleClamp(
        0.16+
        rpm*0.62+
        (1-Math.min(hitHard,1))*0.18-
        tilt*tiltWeight-
        hitHard*0.22-
        Math.max(0,speed-0.070)*1.1,
        0.08,
        0.78
    );
}

function tryFinishZoneRecovery(s,zone,knockForce){
    if(!s || s.finishRecoveryUsed) return false;
    const now=performance.now();
    const rpm=newBattleClamp(s.rpm,0,1);
    const balance=getBattleStat(s,"balance");
    const impactAge=now-(s.lastImpactAt||0);
    const chance=finishRecoveryChance(s,zone,knockForce??s.lastImpactForce);

    // Only a Bey that was just driven in can recover. The roll then
    // follows knock hardness, remaining RPM, and tilt: high RPM can
    // climb out of a medium hit; a hard, tilted knock stays pocketed.
    if(impactAge>1100) return false;
    if(Math.random()>chance) return false;

    s.finishRecoveryUsed=true;
    s.recoveredFlashUntil=now+1150;

    const centerX=0;
    const centerY=0.48;
    const dx=centerX-s.x;
    const dy=centerY-s.y;
    const len=Math.hypot(dx,dy)||1;
    const escapeSpeed=
        0.038+
        0.020*newBattleClamp(rpm,0,1)+
        0.010*balance+
        0.003*Math.pow(rpm,1.6);

    // Put the Bey just back inside the finish boundary and give it a real
    // outward-from-pocket / toward-stadium velocity instead of teleporting it.
    if(zone==="Xtreme"){
        s.y=0.675;
        s.x=newBattleClamp(s.x,-0.20,0.20);
    }else{
        s.y=Math.min(0.71,s.y);
        s.x=s.x<0 ? -0.52 : 0.52;
    }
    s.vx=(dx/len)*escapeSpeed;
    s.vy=(dy/len)*escapeSpeed;
    s.impactMomentumState=Math.max(Number(s.impactMomentumState)||0, 0.62);
    s.finishDebug=`RECOVERED · ${Math.round(rpm*100)}% RPM climbs out`;
    s.stability=newBattleClamp(s.stability+0.035+balance*0.025,0,1);
    s.axisStability=newBattleClamp((s.axisStability||0.70)+0.035,0.15,1);
    s.tiltLevel=newBattleClamp((s.tiltLevel||0)-0.12,0,1);
    s.surfaceRecovery=0.30;
    s.surfaceBounce=0.28;
    s.motionPhase+=0.8+Math.random()*0.5;
    s.motionPhase2+=0.4+Math.random()*0.3;

    return true;
}

function checkForcedStadiumFinish(s){
    /*
      V46 FINISH BALANCE

      A finish should primarily be caused by an actual collision/knockback.
      High RPM by itself should NOT make a Bey self-KO.

      X-Rail exit is the one special case where stored rail momentum can
      legitimately carry a Bey into a finish zone without another collision
      on that exact frame.

      The Bey must also CROSS the finish boundary this frame.
    */
    if(!s) return null;

    const now=performance.now();
    const age=now-(s.lastImpactAt||0);
    const speed=Math.hypot(s.vx,s.vy);
    const force=s.lastImpactForce||0;

    if(!Number.isFinite(s.finishPrevX) || !Number.isFinite(s.finishPrevY)){
        s.finishPrevX=s.x;
        s.finishPrevY=s.y;
        return null;
    }

    const prevX=s.finishPrevX;
    const prevY=s.finishPrevY;
    s.finishPrevX=s.x;
    s.finishPrevY=s.y;

    if(speed<0.030) return null;

    const recentImpact=age<=900;
    const recentRailExit=!!s.railExited && age<=900;

    // Finishes need a committed knock into the opening. Light rim
    // clips should not score; a real smash still can. X-Rail exit
    // still uses stored rail speed. The window is long enough that a
    // smash can travel to the pocket and still count, so recovery can
    // roll on the same event.
    const impactEntry=recentImpact && force>=0.008;
    const railExitForce=s.railExitForce||0;
    const railEntry=recentRailExit && speed>=0.048 && (force>=0.0020 || railExitForce>=0.0020);

    const lip=s.finishLipContact||null;
    if(s.finishLipContact) s.finishLipContact=null;

    // V55 FINISH QUALIFICATION
    // A Bey must actually enter the finish zone with meaningful momentum
    // and a directional path toward the opening. Position alone is not enough.
    // This keeps self-KOs and light taps from producing automatic finishes.

    // ---------- XTREME ----------
    const wasXtreme=
        prevY>=0.71 &&
        prevY<=1.01 &&
        Math.abs(prevX)<=0.255;

    const inXtreme=
        s.y>=0.71 &&
        s.y<=1.01 &&
        Math.abs(s.x)<=0.255;

    const enteredXtreme=(!wasXtreme && inXtreme);

    if(enteredXtreme){
        const dx=-s.x;
        const dy=0.91-s.y;
        const d=Math.hypot(dx,dy)||1;

        const alignment=
            (s.vx*dx+s.vy*dy)/
            Math.max(speed*d,0.0001);

        const impactQualified=
            impactEntry &&
            speed>=0.030 &&
            alignment>=0.14;

        const railQualified=
            railEntry &&
            speed>=0.048 &&
            alignment>=0.16;

        if(impactQualified||railQualified){
            const recoveryForce=Math.max(force,railExitForce,speed*0.32);
            if(tryFinishZoneRecovery(s,"Xtreme",recoveryForce)) return "Recovered";
            s.finishDebug=
                `XTREME CONFIRMED · force ${force.toFixed(3)} · `+
                `speed ${speed.toFixed(3)} · align ${alignment.toFixed(2)}`;
            return "Xtreme";
        }
    }

    // ---------- OVER / POCKET ----------
    const wasLeftPocket=prevX<=-0.575 && prevY>=0.72;
    const wasRightPocket=prevX>=0.575 && prevY>=0.72;
    const leftPocket=s.x<=-0.575 && s.y>=0.72;
    const rightPocket=s.x>=0.575 && s.y>=0.72;

    const enteredPocket=
        (!wasLeftPocket && leftPocket) ||
        (!wasRightPocket && rightPocket);

    if(enteredPocket){
        const targetX=(leftPocket || s.x<0) ? -0.84 : 0.84;
        const targetY=0.90;
        const dx=targetX-s.x;
        const dy=targetY-s.y;
        const d=Math.hypot(dx,dy)||1;

        const alignment=
            (s.vx*dx+s.vy*dy)/
            Math.max(speed*d,0.0001);

        const outward=
            (s.vx*s.x+s.vy*s.y)/
            Math.max(Math.hypot(s.x,s.y),0.0001);

        const impactQualified=
            impactEntry &&
            speed>=0.028 &&
            outward>=0.0018 &&
            alignment>=0.12;

        const railQualified=
            railEntry &&
            speed>=0.046 &&
            outward>=0.0020 &&
            alignment>=0.14;

        if(impactQualified||railQualified){
            const recoveryForce=Math.max(force,railExitForce,speed*0.32);
            if(tryFinishZoneRecovery(s,"Pocket",recoveryForce)) return "Recovered";
            s.finishDebug=
                `OVER CONFIRMED · force ${force.toFixed(3)} · `+
                `speed ${speed.toFixed(3)} · align ${alignment.toFixed(2)}`;
            return "Over";
        }
    }

    if(typeof window!=="undefined" && (lip || enteredXtreme || enteredPocket)){
        window.__SWX_FINISH=window.__SWX_FINISH||[];
        window.__SWX_FINISH.push({
            lip:lip&&lip.zone,
            force:+force.toFixed(3),
            speed:+speed.toFixed(3),
            x:+s.x.toFixed(3),
            y:+s.y.toFixed(3)
        });
        if(window.__SWX_FINISH.length>30) window.__SWX_FINISH.shift();
    }

    return null;
}

function applyKnockbackBoundaryOverride(s){

    if(!s.knockbackOverrideUntil) return;

    if(performance.now()>s.knockbackOverrideUntil){
        s.knockbackOverrideUntil=0;
        s.knockbackOverrideForce=0;
    }
}

function newBattleFrame(now){
    if(!NEW_BATTLE.active) return;

    const dt=Math.min(0.035,Math.max(0.001,(now-NEW_BATTLE.last)/1000));
    NEW_BATTLE.last=now;
    NEW_BATTLE.elapsed+=dt;

    try{
        const p=NEW_BATTLE.player;
        const c=NEW_BATTLE.cpu;
        if(!p || !c) throw new Error("Battle state missing player or CPU.");

        if(NEW_BATTLE.elapsed<1.05){
            Game.battle.phase="Launch";
        }else{
            p.launchComplete=true;
            c.launchComplete=true;
            Game.battle.phase="Battle";
        }

        newPhysicsStep(p,dt);
        newPhysicsStep(c,dt);

        if(
            !Number.isFinite(p.x)||!Number.isFinite(p.y)||
            !Number.isFinite(p.vx)||!Number.isFinite(p.vy)||
            !Number.isFinite(c.x)||!Number.isFinite(c.y)||
            !Number.isFinite(c.vx)||!Number.isFinite(c.vy)
        ){
            throw new Error("Non-finite Bey physics state.");
        }

        newPhysicsCollision(dt);

        if(
            !Number.isFinite(p.x)||!Number.isFinite(p.y)||
            !Number.isFinite(p.vx)||!Number.isFinite(p.vy)||
            !Number.isFinite(c.x)||!Number.isFinite(c.y)||
            !Number.isFinite(c.vx)||!Number.isFinite(c.vy)
        ){
            throw new Error("Non-finite collision result.");
        }

        const pe=document.getElementById("newPlayerBey");
        const ce=document.getElementById("newCpuBey");

        if(pe){
            pe.setAttribute("cx",50+p.x*39);
            pe.setAttribute("cy",46+p.y*39);
        }
        if(ce){
            ce.setAttribute("cx",50+c.x*39);
            ce.setAttribute("cy",46+c.y*39);
        }

        if(pe){
            const ps=4.85*(p.hitFlash>0?(p.impactScale||1):1);
            pe.setAttribute("r",ps);
        }
        if(ce){
            const cs=4.85*(c.hitFlash>0?(c.impactScale||1):1);
            ce.setAttribute("r",cs);
        }

        const impactGroup=document.getElementById("impactEffect");
        if(impactGroup && NEW_BATTLE.lastImpact){
            const imp=NEW_BATTLE.lastImpact;
            const age=Math.max(0,(performance.now()-imp.time)/1000);
            const life=
                imp.impactClass==="heavy" ? 0.92 :
                imp.impactClass==="medium" ? 0.76 : 0.60;
            if(age<life){
                const u=age/life;
                const x=50+imp.x*39;
                const y=46+imp.y*39;
                const strength=imp.strength||1;
                const impactMultiplier=
                    imp.impactClass==="heavy" ? 1.22 :
                    imp.impactClass==="medium" ? 1.0 : 0.78;

                impactGroup.setAttribute("opacity",
                    String(Math.max(0,0.90-u*0.90)));

                const flash=document.getElementById("impactFlash");
                const ring=document.getElementById("impactRing");
                const ring2=document.getElementById("impactRing2");
                const ring3=document.getElementById("impactRing3");
                const explosion=document.getElementById("impactExplosion");
                const core=document.getElementById("impactCore");
                const spokes=document.getElementById("impactSpokes");
                const shock=document.getElementById("impactShock");
                const shockOuter=document.getElementById("impactShockOuter");
                const burst1=document.getElementById("impactBurst1");
                const burst2=document.getElementById("impactBurst2");
                const txt=document.getElementById("impactText");
                const playerDamageText=document.getElementById("playerDamageText");
                const cpuDamageText=document.getElementById("cpuDamageText");
                const playerRecoveredText=document.getElementById("playerRecoveredText");
                const cpuRecoveredText=document.getElementById("cpuRecoveredText");

                if(flash){
                    flash.setAttribute("cx",x);
                    flash.setAttribute("cy",y);
                    const flashPhase=Math.min(1,u*7);
                    flash.setAttribute("r",String(4.5+u*7.5*strength*impactMultiplier));
                    flash.setAttribute("stroke-width",String(5.0-u*2.2));
                    flash.setAttribute("opacity",String(Math.max(0,1.0-flashPhase)));
                }
                if(ring){
                    ring.setAttribute("cx",x);
                    ring.setAttribute("cy",y);
                    ring.setAttribute("r",String(2.5+u*9.0*strength*impactMultiplier));
                }
                if(ring2){
                    ring2.setAttribute("cx",x);
                    ring2.setAttribute("cy",y);
                    ring2.setAttribute("r",String(2.0+u*7.0*strength));
                }
                if(ring3){
                    ring3.setAttribute("cx",x);
                    ring3.setAttribute("cy",y);
                    ring3.setAttribute("r",String(1.2+u*5.0*strength));
                }
                if(explosion){
                    explosion.setAttribute("cx",x);
                    explosion.setAttribute("cy",y);
                    explosion.setAttribute("r",String(3.0+u*7.0*strength*impactMultiplier));
                    explosion.setAttribute("stroke-width",String(Math.max(1.0,4.0-u*2.4)));
                    explosion.setAttribute("opacity",String(Math.max(0,1.0-u*1.12)));
                }
                if(core){
                    core.setAttribute("cx",x);
                    core.setAttribute("cy",y);
                    core.setAttribute("r",String(Math.max(0.9,4.2-u*3.0)));
                    core.setAttribute("opacity",String(Math.max(0,1.0-u*1.30)));
                }
                if(spokes){
                    const spokeScale=1+u*(2.8+strength*0.9);
                    spokes.setAttribute("opacity",String(Math.max(0,0.95-u*1.15)));
                    spokes.setAttribute("transform",`translate(${x-500} ${y-420}) scale(${spokeScale}) translate(${500-x} ${420-y}) rotate(${u*18} ${x} ${y})`);
                }
                if(shock){
                    const shockPhase=Math.min(1,u*4.8);
                    const shockScale=1+shockPhase*(2.5+strength*0.9);
                    shock.setAttribute("opacity",String(Math.max(0,0.95-shockPhase*1.05)));
                    shock.setAttribute("transform",
                        `translate(${x-500} ${y-420}) scale(${shockScale}) translate(${500-x} ${420-y}) rotate(${u*22} ${x} ${y})`);
                }
                if(shockOuter){
                    shockOuter.setAttribute("cx",x);
                    shockOuter.setAttribute("cy",y);
                    shockOuter.setAttribute("r",String(8+u*30*strength));
                    shockOuter.setAttribute("opacity",String(Math.max(0,0.95-u*1.25)));
                }
                if(burst1){
                    burst1.setAttribute("cx",String(x-u*25*strength));
                    burst1.setAttribute("cy",String(y-u*12*strength));
                    burst1.setAttribute("r",String(Math.max(0.8,3.2-u*2.2)));
                    burst1.setAttribute("opacity",String(Math.max(0,1-u*1.4)));
                }
                if(burst2){
                    burst2.setAttribute("cx",String(x+u*27*strength));
                    burst2.setAttribute("cy",String(y+u*10*strength));
                    burst2.setAttribute("r",String(Math.max(0.8,2.8-u*1.8)));
                    burst2.setAttribute("opacity",String(Math.max(0,0.95-u*1.3)));
                }
                if(txt){
                    txt.setAttribute("x",x);
                    txt.setAttribute("y",String(y-22-u*12));
                    txt.setAttribute("font-size",String(19+Math.min(6,strength*2.2)));
                    txt.textContent="";
                }
                const pLoss=imp.playerRpmLoss||0;
                const cLoss=imp.cpuRpmLoss||0;
                if(playerDamageText){
                    playerDamageText.setAttribute("x",String(x));
                    playerDamageText.setAttribute("y",String(y-8-u*8));
                    playerDamageText.textContent=pLoss>0.0005?`-${Math.round(pLoss*100)} RPM`:"";
                    playerDamageText.setAttribute("opacity",String(pLoss>0.0005?Math.max(0,1-u*1.08):0));
                }
                if(cpuDamageText){
                    cpuDamageText.setAttribute("x",String(x));
                    cpuDamageText.setAttribute("y",String(y+2-u*8));
                    cpuDamageText.textContent=cLoss>0.0005?`-${Math.round(cLoss*100)} RPM`:"";
                    cpuDamageText.setAttribute("opacity",String(cLoss>0.0005?Math.max(0,1-u*1.08):0));
                }
             }else{
                impactGroup.setAttribute("opacity","0");
                const pd=document.getElementById("playerDamageText");
                const cd=document.getElementById("cpuDamageText");
                if(pd) pd.setAttribute("opacity","0");
                if(cd) cd.setAttribute("opacity","0");
                const pr=document.getElementById("playerRecoveredText");
                const cr=document.getElementById("cpuRecoveredText");
                if(pr && p.recoveredFlashUntil<=performance.now()) pr.setAttribute("opacity","0");
                if(cr && c.recoveredFlashUntil<=performance.now()) cr.setAttribute("opacity","0");
                NEW_BATTLE.lastImpact=null;
            }
        }
        const nowRecovery=performance.now();
        for(const [el,s] of [
            [document.getElementById("playerRecoveredText"),p],
            [document.getElementById("cpuRecoveredText"),c]
        ]){
            if(el && s.recoveredFlashUntil>nowRecovery){
                el.setAttribute("x",String(50+s.x*39));
                el.setAttribute("y",String(46+s.y*39-8));
                const ru=1-(s.recoveredFlashUntil-nowRecovery)/1150;
                el.setAttribute("opacity",String(Math.max(0,1-ru)));
                el.setAttribute("font-size",String(3.8+ru*0.9));
            }else if(el){
                el.setAttribute("opacity","0");
            }
        }

        p.hitFlash=Math.max(0,(p.hitFlash||0)-dt);
        c.hitFlash=Math.max(0,(c.hitFlash||0)-dt);
        p.impactScale=Math.max(1,(p.impactScale||1)-dt*1.8);
        c.impactScale=Math.max(1,(c.impactScale||1)-dt*1.8);

        for(const [id,v] of [
            ["newPlayerRPM",p.rpm],
            ["newCpuRPM",c.rpm],
            ["newPlayerStability",p.stability],
            ["newCpuStability",c.stability]
        ]){
            const el=document.getElementById(id);
            if(el) el.textContent=Math.round(v*100);
        }
        for(const [id,v] of [["newPlayerRPMBar",p.rpm],["newCpuRPMBar",c.rpm]]){
            const bar=document.getElementById(id);
            if(bar){
                const pct=Math.max(0,Math.min(100,v*100));
                bar.style.width=`${pct}%`;
                bar.setAttribute("aria-valuenow",String(Math.round(pct)));
            }
        }

        /*
          V44 FIX: invoke the authoritative finish resolver from the physics
          loop. V43 defined the resolver but never executed it.
        */
        const finishCandidates=[];
        const playerFinish=checkForcedStadiumFinish(p);
        const cpuFinish=checkForcedStadiumFinish(c);

        // checkForcedStadiumFinish identifies the Bey that ENTERED the zone.
        // The opponent is therefore the finisher/winner for scoring purposes.
        if(playerFinish && playerFinish!=="Recovered"){
            finishCandidates.push({
                enteredSide:"player",
                winnerSide:"cpu",
                type:playerFinish,
                strength:(p.lastImpactForce||0)+Math.hypot(p.vx,p.vy)*0.35
            });
        }
        if(cpuFinish && cpuFinish!=="Recovered"){
            finishCandidates.push({
                enteredSide:"cpu",
                winnerSide:"player",
                type:cpuFinish,
                strength:(c.lastImpactForce||0)+Math.hypot(c.vx,c.vy)*0.35
            });
        }

        if(finishCandidates.length){
            finishCandidates.sort((a,b)=>b.strength-a.strength);
            const finish=finishCandidates[0];
            finishNewBattle(finish.winnerSide,finish.type);
            return;
        }

        const commentary=document.getElementById("newCommentary");
        if(commentary){
            const distance=Math.hypot(p.x-c.x,p.y-c.y);
            if(!NEW_BATTLE.active){
                commentary.textContent=
                    `${p.blade.name}: READY · ${p.launchQuality || "QUALITY LOCKED"} | `+
                    `${c.blade.name}: READY — CPU launch hidden`;
            }else if(NEW_BATTLE.elapsed<0.55){
                commentary.textContent=
                    `${p.blade.name}: ${p.launchQuality} launch · ${Math.round(p.rpm*100)}% RPM | `+
                    `${c.blade.name}: ${c.launchQuality} launch · ${Math.round(c.rpm*100)}% RPM`;
            }else if(NEW_BATTLE.lastImpact && performance.now()-(NEW_BATTLE.lastImpact.time||0)<900){
                commentary.textContent=
                    `IMPACT ${NEW_BATTLE.lastImpact.impactClass} · knockback ${Number(NEW_BATTLE.lastImpact.kb||0).toFixed(3)}`;
            }else if(p.railEngaged || c.railEngaged){
                const rider=p.railEngaged?p:c;
                commentary.textContent=
                    `${rider.blade.name} is riding the X Rail and building speed.`;
            }else if((p.recoveredFlashUntil||0)>performance.now() || (c.recoveredFlashUntil||0)>performance.now()){
                const recovered=(p.recoveredFlashUntil||0)>=(c.recoveredFlashUntil||0)?p:c;
                commentary.textContent=
                    recovered.finishDebug ||
                    `${recovered.blade.name} climbs out of the finish zone!`;
            }else if(p.finishDebug || c.finishDebug){
                commentary.textContent=p.finishDebug || c.finishDebug;
            }else if(NEW_BATTLE.finishPending){
                commentary.textContent=
                    Game.battle.finishType==="Xtreme"
                        ? "XTREME FINISH!"
                        : Game.battle.finishType==="Over"
                            ? "OVER FINISH!"
                            : "SPIN FINISH!";
            }else if(p.rpm<=0.001 || c.rpm<=0.001){
                const winner=p.rpm>c.rpm?p:c;
                commentary.textContent=
                    `${winner.blade.name} wins by Spin Finish.`;
            }else if(distance<0.16){
                commentary.textContent="Heavy contact — both Beys are fighting for position.";
            }else if(distance<0.30){
                commentary.textContent="The Beys are circling back toward each other.";
            }else{
                commentary.textContent="Both Beys are moving through the stadium.";
            }
        }

        // Xtreme / Over have already been resolved above by the single
        // authoritative finish resolver.

        if(p.rpm<=0.001 || c.rpm<=0.001){
            finishNewBattle(p.rpm>c.rpm?"player":"cpu");
            return;
        }

    }catch(err){
        console.error("Spin Wars battle simulation error:",err);
        const commentary=document.getElementById("newCommentary");
        if(commentary){
            commentary.textContent="Simulation error — physics loop stopped.";
        }
        NEW_BATTLE.active=false;
        return;
    }

    NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);
}
function getNewXRailGeometry(){
    if(NEW_BATTLE.railGeometry) return NEW_BATTLE.railGeometry;

    /*
      V72 X-RAIL: FINITE TOP-EXIT TRACK
      -----------------------------------
      The Spin Wars X battle orientation places the X-Rail at the TOP of the
      player's view. The two endpoints form the X-Exit gap. The rail runs
      down both sides and around the lower bowl before returning to the
      opposite top endpoint.

      Stored path direction is LEFT -> RIGHT around the lower bowl.
      Right-spin travels the stored path to the right-side X-Exit; left-spin
      travels the exact reverse.

      There is NO wrap-around. Reaching the appropriate top endpoint launches
      the Bey inward toward the center. Normal battle physics then determines
      whether that launch later produces an Xtreme or Over finish.
    */
    const controls=[
        {x:-0.133,y:-0.790},
        {x:-0.480,y:-0.660},
        {x:-0.760,y:-0.455},
        {x:-0.905,y:0.010},
        {x:-0.820,y:0.480},
        {x:-0.500,y:0.735},
        {x:0.000,y:0.805},
        {x:0.500,y:0.735},
        {x:0.820,y:0.480},
        {x:0.905,y:0.010},
        {x:0.760,y:-0.455},
        {x:0.480,y:-0.660},
        {x:0.133,y:-0.790}
    ];

    function catmull(p0,p1,p2,p3,t){
        const t2=t*t,t3=t2*t;
        return {
            x:0.5*((2*p1.x)+(-p0.x+p2.x)*t+
                (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+
                (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
            y:0.5*((2*p1.y)+(-p0.y+p2.y)*t+
                (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+
                (-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
        };
    }

    function derivative(p0,p1,p2,p3,t){
        const t2=t*t;
        return {
            x:0.5*((-p0.x+p2.x)+
                2*(2*p0.x-5*p1.x+4*p2.x-p3.x)*t+
                3*(-p0.x+3*p1.x-3*p2.x+p3.x)*t2),
            y:0.5*((-p0.y+p2.y)+
                2*(2*p0.y-5*p1.y+4*p2.y-p3.y)*t+
                3*(-p0.y+3*p1.y-3*p2.y+p3.y)*t2)
        };
    }

    const samples=[];
    const samplesPerSpan=28;

    for(let i=0;i<controls.length-1;i++){
        const p0=controls[Math.max(0,i-1)];
        const p1=controls[i];
        const p2=controls[i+1];
        const p3=controls[Math.min(controls.length-1,i+2)];

        for(let j=0;j<samplesPerSpan;j++){
            const t=j/samplesPerSpan;
            const point=catmull(p0,p1,p2,p3,t);
            const d=derivative(p0,p1,p2,p3,t);
            const dl=Math.hypot(d.x,d.y)||1;

            samples.push({
                x:point.x,
                y:point.y,
                tx:d.x/dl,
                ty:d.y/dl
            });
        }
    }

    const last=controls[controls.length-1];
    const prev=controls[controls.length-2];
    const dl=Math.hypot(last.x-prev.x,last.y-prev.y)||1;

    samples.push({
        x:last.x,
        y:last.y,
        tx:(last.x-prev.x)/dl,
        ty:(last.y-prev.y)/dl
    });

    const segments=[];
    let total=0;

    for(let i=0;i<samples.length-1;i++){
        const a=samples[i];
        const b=samples[i+1];
        const length=Math.hypot(b.x-a.x,b.y-a.y);

        if(length<0.000001) continue;

        segments.push({a,b,length,start:total});
        total+=length;
    }

    NEW_BATTLE.railGeometry={
        controls,
        samples,
        segments,
        total,
        startDistance:0,
        endDistance:total,
        leftExit:samples[0],
        rightExit:samples[samples.length-1],
        exitGap:{
            leftX:-0.133,
            rightX:0.133,
            y:-0.790
        },
        type:"top-open-accelerator-track-v72"
    };

    return NEW_BATTLE.railGeometry;
}

function newXRailPointAtDistance(distance){
    const g=getNewXRailGeometry();
    const d=newBattleClamp(Number(distance)||0,0,g.total);

    for(const seg of g.segments){
        if(d<=seg.start+seg.length ||
           seg===g.segments[g.segments.length-1]){

            const t=seg.length
                ? newBattleClamp(
                    (d-seg.start)/seg.length,
                    0,1
                )
                : 0;

            const x=
                seg.a.x+
                (seg.b.x-seg.a.x)*t;

            const y=
                seg.a.y+
                (seg.b.y-seg.a.y)*t;

            const tx=
                seg.a.tx+
                (seg.b.tx-seg.a.tx)*t;

            const ty=
                seg.a.ty+
                (seg.b.ty-seg.a.ty)*t;

            const tl=Math.hypot(tx,ty)||1;

            return {
                x,y,
                tx:tx/tl,
                ty:ty/tl,
                distance:d,
                segment:seg
            };
        }
    }

    const last=g.samples[g.samples.length-1];

    return {
        x:last.x,
        y:last.y,
        tx:last.tx,
        ty:last.ty,
        distance:g.total
    };
}

function newXRailNearest(x,y){
    const g=getNewXRailGeometry();
    let best=null;

    for(const seg of g.segments){
        const abx=seg.b.x-seg.a.x;
        const aby=seg.b.y-seg.a.y;
        const ab2=abx*abx+aby*aby||1;

        const t=newBattleClamp(
            (
                (x-seg.a.x)*abx+
                (y-seg.a.y)*aby
            )/ab2,
            0,1
        );

        const px=seg.a.x+abx*t;
        const py=seg.a.y+aby*t;

        const dx=x-px;
        const dy=y-py;
        const dist2=dx*dx+dy*dy;

        if(!best || dist2<best.dist2){
            let tx=
                seg.a.tx+
                (seg.b.tx-seg.a.tx)*t;

            let ty=
                seg.a.ty+
                (seg.b.ty-seg.a.ty)*t;

            const tl=Math.hypot(tx,ty)||1;

            best={
                x:px,
                y:py,
                dist2,
                distance:seg.start+seg.length*t,
                tx:tx/tl,
                ty:ty/tl,
                segment:seg,
                t
            };
        }
    }

    return best;
}

function speedOf(s){
    return Math.hypot(s?.vx||0,s?.vy||0);
}

function getDynamicBitBehavior(bit,rpm,stability,currentTilt){
    const n=bit?.name||"";
    const r=newBattleClamp((Number(rpm)||0)/100,0,1);
    const st=newBattleClamp((Number(stability)||0)/100,0,1);
    const tilt=newBattleClamp(Math.abs(Number(currentTilt)||0),0,1);

    if(n==="Point"){
        const aggression=newBattleClamp(
            0.04+
            Math.pow(tilt,1.55)*0.78+
            (1-st)*0.14,
            0,1
        );

        return {
            mode:aggression>0.56?"aggressive":"stable",
            aggression,
            mobility:0.27+aggression*0.55,
            staminaEfficiency:1-aggression*0.26
        };
    }

    if(n==="Level"){
        const lowRpm=Math.pow(1-r,1.18);

        const aggression=newBattleClamp(
            0.035+
            lowRpm*0.64+
            Math.pow(tilt,1.35)*0.34+
            (1-st)*0.10,
            0,1
        );

        return {
            mode:aggression>0.56?"aggressive":"stable",
            aggression,
            mobility:0.28+aggression*0.60,
            staminaEfficiency:1-aggression*0.22
        };
    }

    return null;
}

function getBattleStat(s,key,fallback=70){
    const value=Number(s?.stats?.[key]);

    if(!Number.isFinite(value)){
        return Math.max(
            60,
            Math.min(99,fallback)
        )/99;
    }

    return Math.max(
        60,
        Math.min(99,value)
    )/99;
}

function bitPhysics(s){
    return BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
}

function getSpinOrbitTangent(x,y,spinDirection){
    /*
      SINGLE DIRECTION CONVENTION
      ----------------------------
      Screen coordinates use +Y downward.

      RIGHT spin = counter-clockwise around the stadium:
        tangent = (y, -x)

      LEFT spin = the exact reverse.

      This is the same convention used by the X-Rail. No later system is
      allowed to "correct" this direction after movement is calculated.
    */
    const r=Math.hypot(x,y)||1;
    const sign=spinDirection===1 ? 1 : -1;
    return {
        x:(y/r)*sign,
        y:(-x/r)*sign
    };
}

function validatePhysicsDirectionContract(){
    const checks=[
        {x:0,y:-1,expectX:-1,expectY:0,name:"top"},
        {x:-1,y:0,expectX:0,expectY:1,name:"left"},
        {x:0,y:1,expectX:1,expectY:0,name:"bottom"},
        {x:1,y:0,expectX:0,expectY:-1,name:"right"}
    ];
    for(const c of checks){
        const t=getSpinOrbitTangent(c.x,c.y,1);
        const dot=t.x*c.expectX+t.y*c.expectY;
        if(dot<0.999){
            throw new Error(`Physics direction contract failed at ${c.name}.`);
        }
    }
    return true;
}


/*
 * V79 PHYSICS DIRECTION CONTRACT
 * ------------------------------
 * A collision may redirect a Bey's velocity, but it must NEVER create a
 * sustained orbit opposite to the Bey's physical spin direction.
 *
 * This runs only at the collision event. It does NOT become a second
 * per-frame movement controller, so it cannot fight the normal orbit physics
 * or the X-Rail.
 *
 * Radial/impact velocity is preserved. Only the tangential component that
 * would establish an opposite-direction orbit is removed.
 */
function enforcePostImpactSpinDirection(s){
    if(!s || s.railEngaged) return;

    const rpm=newBattleClamp(s.rpm||0,0,1);
    if(rpm<=0.10) return;

    const radius=Math.hypot(s.x,s.y);
    if(radius<0.035) return;

    const tangent=getSpinOrbitTangent(
        s.x,
        s.y,
        s.spinDirection
    );
    const tangential=s.vx*tangent.x+s.vy*tangent.y;

    /*
      Remove ONLY an opposite-spin tangential component. Valid same-spin
      tangential momentum and radial impact momentum remain untouched.
    */
    if(tangential<0){
        s.vx-=tangent.x*tangential;
        s.vy-=tangent.y*tangential;
    }

    s.lastOrbitDirection=s.spinDirection===1 ? "CCW" : "CW";
}

function newXRailTangentAtPoint(point, direction, x, y){
    /*
      AUTHORITATIVE GAMEPLAY DIRECTION
      --------------------------------
      The authored rail path is the physical track from the LEFT top
      endpoint, down around the stadium, to the RIGHT top endpoint.

      For Spin Wars X, a RIGHT-spin Bey rides that authored path: LEFT ->
      RIGHT -> TOP X-EXIT. A LEFT-spin Bey rides the exact reverse.

      We intentionally do NOT infer direction from the Bey's current
      velocity or from screen-space angular math. The track's authored
      direction is the source of truth.
    */
    let tx=point?.tx||0;
    let ty=point?.ty||0;
    const len=Math.hypot(tx,ty)||1;
    tx/=len;
    ty/=len;
    const dir=direction>=0 ? 1 : -1;
    return {x:tx*dir,y:ty*dir};
}

function railDirection(s){
    /*
      The authored rail path is LEFT endpoint -> down the left side ->
      around the lower bowl -> up the right side -> RIGHT endpoint.

      That path is the game's counter-clockwise orbit in screen coordinates.

      RIGHT spin MUST use +1 (left endpoint to right endpoint).
      LEFT spin MUST use -1 (the exact reverse).
    */
    return s?.spinDirection===-1 ? -1 : 1;
}

function isBottomFinishCorridor(s){
    return !!s && s.y>0.70;
}

function newXRailRelease(s,direction,reason="release"){
    if(!s) return false;

    const point=newXRailNearest(s.x,s.y);
    const dir=direction||railDirection(s);

    s.railEngaged=false;
    s.railGrip=0;
    s.railDirection=0;
    s.railSpeed=0;
    s.railTravelDistance=0;
    s.railRideTime=0;
    s.railBoost=0;
    s.railContactPoint=
        point
            ? {x:point.x,y:point.y}
            : null;
    s.railExited=false;
    s.railExitForce=0;

    s.railExitRefractory=0.18;

    // Prevent immediate X-rail -> X-exit -> X-rail loops.
    const chainCount=Math.max(1,s.railChainCount||1);
    s.railChainLock=Math.min(2.20,0.70+0.45*(chainCount-1));
    s.railCaptureCooldown=Math.max(0.42,s.railChainLock);
    s.railCaptureCooldownPoint={x:s.x,y:s.y};
    s.railExitRefractoryPoint={
        x:s.x,
        y:s.y
    };

    /*
      Release away from the rail surface, but preserve most of the
      Bey's existing velocity. We do NOT invent a new orbit here.
    */
    if(point){
        const dx=s.x-point.x;
        const dy=s.y-point.y;
        const len=Math.hypot(dx,dy)||1;

        const outwardX=dx/len;
        const outwardY=dy/len;

        const outward=
            s.vx*outwardX+
            s.vy*outwardY;

        if(outward<0.002){
            s.vx+=outwardX*(0.002-outward);
            s.vy+=outwardY*(0.002-outward);
        }

        const separation=0.012+s.radius*0.10;
        s.x=point.x+outwardX*separation;
        s.y=point.y+outwardY*separation;
    }

    s.surfaceBounce=0.10;
    s.surfaceRecovery=0.10;
    s.motionPhase+=0.35+Math.random()*0.25;

    return reason;
}

function tryNewXRailEngagement(s){
    if(!s || s.railEngaged) return false;
    if(!window.SpinWarsXRailEngine ||
       typeof window.SpinWarsXRailEngine.step!=="function"){
        throw new Error("X-Rail 4.4 engine is not available");
    }

    /*
      Compatibility wrapper. The active physics path uses
      SpinWarsXRailEngine.step(), which owns the actual swept contact and
      capture decision. This function intentionally performs no duplicate
      geometry or capture calculations.
    */
    const before=!!s.railEngaged;
    window.SpinWarsXRailEngine.step(s,0);
    return !before && !!s.railEngaged;
}

function newXRailExit(s,reason){
    if(!s) return false;
    if(
        window.SpinWarsXRailEngine &&
        typeof window.SpinWarsXRailEngine.release==="function"
    ){
        return window.SpinWarsXRailEngine.release(s,reason||"release");
    }
    s.railEngaged=false;
    return true;
}

function applyXRailContactSafety(s,nearest,incomingNormal){
    if(!s) return false;
    if(
        window.SpinWarsXRailEngine &&
        typeof window.SpinWarsXRailEngine.contactSafety==="function"
    ){
        return window.SpinWarsXRailEngine.contactSafety(s,nearest);
    }
    return false;
}

function applyXRailConstraint(s,dt){
    if(!s?.railEngaged) return false;
    if(!window.SpinWarsXRailEngine ||
       typeof window.SpinWarsXRailEngine.step!=="function"){
        throw new Error("X-Rail 4.4 engine is not available");
    }

    const result=window.SpinWarsXRailEngine.step(s,dt);

    /*
      The standalone X-Rail engine owns the constrained movement.
      While riding or transitioning through the X-Exit ramp, free-space
      movement must not run in the same frame.
    */
    return !!(
        result &&
        (
            result.active ||
            s.railEngaged ||
            s.xrailExitRampActive
        )
    );
}

function newPhysicsStep(s,dt){

        const stats = s.stats || {};
        const bp = bitPhysics(s);

        const rpm = newBattleClamp(s.rpm,0,1);
        const mobility = getBattleStat(s,"mobility");
        const balance = getBattleStat(s,"balance");
        const stamina = getBattleStat(s,"stamina");
        const control = (bp.control||60)/100;

        // Stamina is spin efficiency, not a free speed bonus.
        const staminaEfficiency=(0.70+stamina*0.52)*
            (s.dynamicBitStaminaEfficiency||1);
        const centerAffinity = (bp.centerAffinity||60)/100;
        let movement = (bp.movement||60)/100;

        // Point and Level are continuous physical behaviors. Their state
        // changes with actual tilt, RPM and stability during the battle;
        // there is no separate "launch mode" toggle.
        const dynamicBit=getDynamicBitBehavior(
            s.bit,
            s.rpm*100,
            s.stability*100,
            s.tiltLevel||0
        );
        if(dynamicBit){
            movement=dynamicBit.mobility;
            s.dynamicBitMode=dynamicBit.mode;
            s.dynamicBitAggression=dynamicBit.aggression;
            s.dynamicBitStaminaEfficiency=dynamicBit.staminaEfficiency;
        }else{
            s.dynamicBitMode=null;
            s.dynamicBitAggression=0;
            s.dynamicBitStaminaEfficiency=1;
        }

        const attackBit = movement>=0.80;
        const attackStat=getBattleStat(s,"attack");
        const knockbackStat=getBattleStat(s,"knockback");
        const attackSpeedBoost = 1;

        /*
          Dynamic tilt/precession:
          high RPM + stability + speed = stable top;
          low RPM, low stability and slow movement = increasing wobble.
        */
        const currentSpeed=Math.hypot(s.vx,s.vy);
        const speedStability=newBattleClamp(currentSpeed/0.055,0,1);

        const bitAcceleration=(bp.acceleration||60)/100;
        const bitFriction=(bp.friction||60)/100;
        const bitPrecession=(bp.precession||50)/100;
        const bitStability=(bp.stability||60)/100;

        /*
          DROP LAUNCH:
          Hang still at the top of the stadium, then fall straight toward
          the center. Harder tilt stalls longer. A real collision from
          another Bey interrupts the stall by ending it; this block must
          not overwrite that knockback.
        */
        if(s.launchDropActive && !s.launchDropReleased){
            s.launchStallElapsed=(s.launchStallElapsed||0)+dt;

            if(s.launchStallElapsed < (s.launchStall||0.42)){
                s.vx=0;
                s.vy=0;
                s.tiltLevel=newBattleClamp(
                    (s.launchTilt==="Hard Tilt" ? 0.28 :
                     s.launchTilt==="Slight Tilt" ? 0.16 : 0.07),
                    0.02,0.94
                );
                return;
            }

            const dropSide=-(s.launchSideSign || (s.side==="player" ? -1 : 1));
            const dropTilt=
                s.launchTilt==="Hard Tilt" ? 0.12 :
                s.launchTilt==="Slight Tilt" ? 0.06 : 0.0;

            s.vx=dropSide*dropTilt*0.018;
            s.vy=0.022;
            s.launchDropReleased=true;
            s.launchDropFalling=true;
        }

        /*
          Core movement model:
          RPM supplies available spin energy, while the launch supplies
          translational momentum. They are related, but not identical.
          This prevents a Bey from retaining "100% RPM movement" at low RPM.
        */
        const launchMobility=
            0.0385+
            (stats.mobility||70)*0.000095;

        const rpmSpeedFactor=attackBit
            ? 0.28+0.72*Math.pow(rpm,0.70)
            : 0.48+0.52*Math.pow(rpm,0.50);

        const physicalSpeedTarget=
            launchMobility*
            (0.98+0.34*bitAcceleration)*
            rpmSpeedFactor*
            (0.86+0.24*bitStability)*
            (1.04+0.30*movement+0.08*attackStat)*
            attackSpeedBoost*
            (attackBit && rpm<0.60
                ? 0.76+0.40*(rpm/0.60)
                : (!attackBit && rpm<0.40
                    ? 0.86+0.14*(rpm/0.40)
                    : 1.0));

        const speedNow=Math.hypot(s.vx,s.vy);
        const keepImpactSpeed=(s.impactMomentumState||0)>0.16;

        // Attack Bits keep circling as RPM falls. Extra low-RPM braking
        // was wiping their tangent and leaving a straight shuttle.
        if(!keepImpactSpeed && !attackBit && rpm<0.40 && speedNow>physicalSpeedTarget){
            const lowRpmBrake=(0.0010+(0.40-rpm)*0.0030)*dt*60;
            const brakeScale=newBattleClamp(1-lowRpmBrake,0.92,1);
            s.vx*=brakeScale;
            s.vy*=brakeScale;
        }

        if(!keepImpactSpeed && speedNow>physicalSpeedTarget*1.08){
            const excessRatio=newBattleClamp(
                (speedNow-physicalSpeedTarget)/
                Math.max(speedNow,0.0001),0,0.24
            );
            const decay=
                (0.0012+bitFriction*0.0018+excessRatio*0.0035)*
                dt*60;
            const scale=newBattleClamp(1-decay,0.90,1);
            s.vx*=scale;
            s.vy*=scale;
        }else if(speedNow>0.001 && speedNow<physicalSpeedTarget){
            const acceleration=
                (0.00035+bitAcceleration*0.0010)*
                (0.45+0.55*rpm)*dt*60;
            s.vx+=(s.vx/speedNow)*acceleration;
            s.vy+=(s.vy/speedNow)*acceleration;
        }

        const workRate=
            speedNow*(0.22+bitFriction*0.40)*(0.65+0.35*rpm);

        s.movementEnergy=newBattleClamp(
            (s.movementEnergy||1)-
            workRate*0.00070*dt*60+
            rpm*bitStability*0.00010*dt*60,
            0.18,1
        );

        const targetTilt=newBattleClamp(
            (1-s.stability)*0.48+
            (1-(s.axisStability||0.70))*0.20+
            (1-rpm)*0.24+
            (1-speedStability)*0.08,
            0.02,0.94
        );

        s.tiltLevel +=
            (targetTilt-(s.tiltLevel||0))*
            Math.min(1,dt*4.5);

        if(s.surfaceBounce>0){
            s.tiltLevel=newBattleClamp(
                s.tiltLevel+0.12*dt,0,1
            );
        }

        if(s.surfaceRecovery>0){
            s.surfaceRecovery =
                Math.max(0,s.surfaceRecovery-dt);
        }

        if(s.surfaceBounce>0){
            s.surfaceBounce =
                Math.max(0,s.surfaceBounce-dt);
        }

        if(s.railExitRefractory>0){

            s.railExitRefractory =
                Math.max(0,s.railExitRefractory-dt);

            if(s.railExitRefractoryPoint){
                const dx =
                    s.x-s.railExitRefractoryPoint.x;
                const dy =
                    s.y-s.railExitRefractoryPoint.y;

                if(Math.hypot(dx,dy)>0.12){
                    s.railExitRefractory=0;
                    s.railExitRefractoryPoint=null;
                }
            }
        }

        if(s.railCaptureCooldown>0){
            s.railCaptureCooldown=Math.max(0,s.railCaptureCooldown-dt);
            if(s.railCaptureCooldownPoint){
                const moved=Math.hypot(
                    s.x-s.railCaptureCooldownPoint.x,
                    s.y-s.railCaptureCooldownPoint.y
                );
                if(moved>0.10){
                    s.railCaptureCooldown=0;
                    s.railCaptureCooldownPoint=null;
                }
            }
        }

        if(s.railChainLock>0){
            s.railChainLock=Math.max(0,s.railChainLock-dt);
        }

        if(!s.railEngaged){
            const railNear=newXRailNearest(s.x,s.y);
            const railAwayDistance=railNear
                ? Math.sqrt(railNear.dist2)
                : 1;

            if(railAwayDistance>0.22){
                s.railAwayTime=(s.railAwayTime||0)+dt;
                if(s.railAwayTime>0.55){
                    s.railChainCount=0;
                    s.railAwayTime=0;
                }
            }else{
                s.railAwayTime=0;
            }
        }

        applyKnockbackBoundaryOverride(s);

        /*
          RAIL PRIORITY
          -------------
          The X-Rail is a separate constrained surface. Once a Bey is
          captured, the free-space movement response must NOT run first and
          fight the rail constraint.

          This was a major source of contradictory behavior in V70.
        */
        if(s.railEngaged){
            const railActive=applyXRailConstraint(s,dt);
            if(railActive) return;
        }

        /*
          X-RAIL 4.4 FREE CONTACT
          -----------------------
          The standalone engine owns free-Bey rail/exit contact. A free Bey
          can bounce from the rail or redirect from the X-Exit surface, but
          only a qualifying swept impact can enter rail riding.
        */
        if(!s.railEngaged){
            if(!window.SpinWarsXRailEngine ||
               typeof window.SpinWarsXRailEngine.step!=="function"){
                throw new Error("X-Rail 4.4 engine is not available");
            }

            const railResult=window.SpinWarsXRailEngine.step(s,dt);

            /*
              Capture and exit-ramp movement are authoritative. Do not let
              the old free-space movement stack write over them this frame.
            */
            if(
                railResult &&
                (
                    railResult.active ||
                    s.railEngaged ||
                    s.xrailExitRampActive
                )
            ){
                return;
            }
        }

        /*
          SOFT COMBAT ENGAGEMENT
          ----------------------
          This is trajectory bias only. It does not guarantee a hit and it
          does not create a timer. Attack Bits get stronger convergence;
          non-attack Bits get a gentler version so they actually engage.
        */
        {
            const opponent =
                s===NEW_BATTLE.player
                    ? NEW_BATTLE.cpu
                    : NEW_BATTLE.player;

            const currentAttackBit =
                Number(bp.movement||60)>=80;

            const opponentAttackBit =
                opponent &&
                (
                    opponent.bitPhysicsType==="attack" ||
                    Number(
                        opponent.stats &&
                        opponent.stats.movement ||
                        60
                    )>=80
                );

            const bothNonAttack =
                !!opponent &&
                !currentAttackBit &&
                !opponentAttackBit;

            if(opponent){
                const ox=Number(opponent.x);
                const oy=Number(opponent.y);
                const sx=Number(s.x);
                const sy=Number(s.y);

                if(
                    Number.isFinite(ox) &&
                    Number.isFinite(oy) &&
                    Number.isFinite(sx) &&
                    Number.isFinite(sy)
                ){
                    const dx=ox-sx;
                    const dy=oy-sy;
                    const d=Math.hypot(dx,dy);

                    if(
                        d>0.14 &&
                        d<(bothNonAttack ? 0.58 : 0.43) &&
                        s.rpm>0.20 &&
                        opponent.rpm>0.05
                    ){
                        const invD=1/Math.max(d,0.001);
                        const tx=-dy*invD;
                        const ty=dx*invD;
                        const ax=dx*invD;
                        const ay=dy*invD;

                        const attackStat=
                            newBattleClamp(
                                Number(s.stats && s.stats.attack || 70)/99,
                                0,1
                            );

                        const kbStat=
                            newBattleClamp(
                                Number(s.stats && s.stats.knockback || 70)/99,
                                0,1
                            );

                        /*
                          The wave creates windows of engagement. It is not a
                          countdown, so it cannot guarantee a collision.
                        */
                        const wave=
                            0.5+
                            0.5*Math.sin(
                                (s.motionPhase||0)*0.61+
                                (s.motionPhase2||0)*0.37
                            );

                        const distanceFactor=
                            newBattleClamp(
                                (0.43-d)/0.25,
                                0,1
                            );

                        const readiness=
                            newBattleClamp(
                                0.48+
                                s.rpm*0.28+
                                (1-(s.tiltLevel||0))*0.16+
                                wave*0.16,
                                0,1
                            );

                        const threshold=
                            bothNonAttack ? 0.53 : 0.47;

                        if(readiness>threshold){

                            const base=
                                attackBit
                                    ? 0.00068+
                                      attackStat*0.00070+
                                      kbStat*0.00026
                                    : 0.00040+
                                      attackStat*0.00034+
                                      kbStat*0.00022;

                            const strength=
                                base*
                                distanceFactor*
                                (0.72+0.28*s.rpm)*
                                (bothNonAttack?1.68:1.12);

                            /*
                              The old gravity/crossing system is removed.
                              This assist is strictly radial: it only points
                              at the opponent and never adds an orbital force.
                            */
                            const closeAssist=
                                newBattleClamp(
                                    (0.50-d)/0.28,
                                    0,1
                                );

                            const assist=
                                strength*
                                (0.34+0.48*closeAssist)*
                                (bothNonAttack ? 1.08 : 0.92);

                            s.vx+=ax*assist*dt*60;
                            s.vy+=ay*assist*dt*60;
                        }
                    }
                }
            }
        }

        /*
          Existing velocity moves the Bey.
          We intentionally DO NOT inject a permanent orbital speed.
        */
        s.x += s.vx*dt*60;
        s.y += s.vy*dt*60;

        if(s.railExited && s.railExitRefractoryPoint){
            if(Math.hypot(
                s.x-s.railExitRefractoryPoint.x,
                s.y-s.railExitRefractoryPoint.y
            )>0.18){
                s.railExited=false;
                s.railExitRefractoryPoint=null;
            }
        }

        /*
          MOVEMENT ENGINE — V100
          ----------------------
          The approved V99.6 free-space movement model now lives in
          movement-engine.js. app.js handles battle/rail/collision orchestration
          and delegates free-space movement here.
        */
        return SpinWarsMovementEngine.step(s,dt,{
            clamp:newBattleClamp,
            getSpinOrbitTangent,
            enforcePostImpactSpinDirection,
            rpm,
            centerAffinity,
            movement,
            bitStability,
            balance,
            control,
            stamina,
            bitPrecession,
            bitFriction,
            bp,
            staminaEfficiency,
            physicalSpeedTarget
        });
    };
function breakXRailFromImpact(s,nx,ny,force){
    if(!s?.railEngaged) return false;

    const impactMagnitude=Math.max(0.003,force);

    /*
      X-Rail 4.4 owns the rail-state transition. The impact impulse below
      is still owned by the battle collision system.
    */
    if(
        window.SpinWarsXRailEngine &&
        typeof window.SpinWarsXRailEngine.release==="function"
    ){
        window.SpinWarsXRailEngine.release(s,"impact-break");
    }else{
        s.railEngaged=false;
    }

    /*
      Give the released Bey a small physical outward component so the next
      frame cannot immediately snap it back into the rail.
    */
    const point=
        window.SpinWarsXRailEngine &&
        typeof window.SpinWarsXRailEngine.nearest==="function"
            ? window.SpinWarsXRailEngine.nearest(s.x,s.y)
            : null;

    if(point){
        const dx=s.x-point.x;
        const dy=s.y-point.y;
        const len=Math.hypot(dx,dy)||1;
        const rx=dx/len;
        const ry=dy/len;
        const outward=s.vx*rx+s.vy*ry;
        const minimumOutward=0.004+impactMagnitude*0.20;

        if(outward<minimumOutward){
            const add=minimumOutward-outward;
            s.vx+=rx*add;
            s.vy+=ry*add;
        }

        const contactRadius=0.072+s.radius*0.48;
        const distance=Math.sqrt(Math.max(0,point.dist2));

        if(distance<contactRadius){
            const push=contactRadius-distance+0.006;
            s.x+=rx*push;
            s.y+=ry*push;
        }
    }

    s.railChainLock=Math.max(s.railChainLock||0,0.55);
    s.knockbackOverrideUntil=performance.now()+280;
    s.knockbackOverrideForce=force;

    s.rpm=newBattleClamp(
        s.rpm-(0.0035+force*0.20),
        0,1
    );
    s.stability=newBattleClamp(
        s.stability-(0.008+force*0.35),
        0,1
    );
    s.tiltLevel=newBattleClamp(
        (s.tiltLevel||0)+0.045+force*0.55,
        0,1
    );

    s.surfaceBounce=0.20;
    s.surfaceRecovery=0.12;
    s.motionPhase+=1.0+Math.random()*0.7;
    s.motionPhase2+=0.4+Math.random()*0.5;

    return true;
}

function newPhysicsCollision(dt){
    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;
    if(!p||!c) return;

    // A Bey riding the X Rail is still physically hittable. A sufficiently
    // strong impact can break its rail grip; weak contact does not.
    const pWasOnRail=!!p.railEngaged;
    const cWasOnRail=!!c.railEngaged;

    const dx=c.x-p.x, dy=c.y-p.y;
    const dist=Math.hypot(dx,dy);
    const minDist=p.radius+c.radius;

    if(dist>minDist || dist<0.0001) return;

    const nx=dx/dist, ny=dy/dist;
    const tx=-ny, ty=nx;
    const rvx=c.vx-p.vx, rvy=c.vy-p.vy;
    const closing=rvx*nx+rvy*ny;
    const relativeSpeed=Math.hypot(rvx,rvy);

    // A real hit must still be closing. Fast overlaps that are already
    // separating used to keep receiving full knockback every frame, which
    // launched Beys across the stadium or ended the round instantly.
    if(closing>=-0.00035) return;

    const now=performance.now();
    if(now<(NEW_BATTLE.collisionLockUntil||0)) return;
    NEW_BATTLE.collisionLockUntil=now+90;

    if(p.launchDropActive && !p.launchDropReleased){
        p.launchDropReleased=true;
        p.launchDropFalling=true;
        p.launchStallElapsed=p.launchStall||0;
    }
    if(c.launchDropActive && !c.launchDropReleased){
        c.launchDropReleased=true;
        c.launchDropFalling=true;
        c.launchStallElapsed=c.launchStall||0;
    }

    const pAttack=getBattleStat(p,"attack");
    const cAttack=getBattleStat(c,"attack");
    const pKB=getBattleStat(p,"knockback");
    const cKB=getBattleStat(c,"knockback");
    const pDef=getBattleStat(p,"defense");
    const cDef=getBattleStat(c,"defense");
    const pRPM=newBattleClamp(p.rpm,0,1);
    const cRPM=newBattleClamp(c.rpm,0,1);

    const impactSpeed=Math.abs(closing);
    const tangentRelative=rvx*tx+rvy*ty;
    const totalRelative=Math.max(relativeSpeed,0.0001);

    // Directional momentum:
    // each Bey brings its own mass + velocity + RPM into the collision.
    // A high-Attack Bey on a controlled bit can hit hard, but a heavier/faster
    // Bey arriving with much more momentum can still transfer more energy.
    const pSpeed=Math.hypot(p.vx,p.vy);
    const cSpeed=Math.hypot(c.vx,c.vy);
    const pMass=p.mass||1;
    const cMass=c.mass||1;

    const contactEfficiency=(blade)=>{
        const shape=blade?.physics?.contactShape||"Round";
        const recoil=blade?.physics?.recoil||"Medium";
        const shapeFactor={
            "Smash":1.12,"Upper":1.08,"Round":0.96,
            "Pointed":1.02,"Wide":1.00
        }[shape]||0.98;
        const recoilFactor={
            "Very Low":1.06,"Low":1.03,"Medium":1.00,
            "High":0.94,"Very High":0.88
        }[recoil]||1.00;
        return shapeFactor*recoilFactor;
    };

    const pContactEfficiency=contactEfficiency(p.blade);
    const cContactEfficiency=contactEfficiency(c.blade);

    const pMomentum=
        pMass*
        Math.max(pSpeed,pRPM*0.010)*
        Math.max(0.08,Math.pow(Math.max(pRPM,0.05),0.85));
    const cMomentum=
        cMass*
        Math.max(cSpeed,cRPM*0.010)*
        Math.max(0.08,Math.pow(Math.max(cRPM,0.05),0.85));

    // Closing speed identifies who is actually driving into the contact.
    const pClosing=Math.max(0,-closing);
    const cClosing=Math.max(0,closing);

    // Kinetic-energy-style term. Squared velocity makes a fast crash
    // substantially more energetic than a slow bump.
    const pKinetic=
        0.5*pMass*Math.max(pSpeed*pSpeed,pRPM*0.00018)*
        (0.22+0.78*pRPM)*
        (1.00+0.18*pRPM);
    const cKinetic=
        0.5*cMass*Math.max(cSpeed*cSpeed,cRPM*0.00018)*
        (0.22+0.78*cRPM)*
        (1.00+0.18*cRPM);

    // Tangential clashes still have real energy, but they are weaker than a
    // direct collision.
    const grazingEnergy=totalRelative*0.22;

    // Blade Attack + Knockback are combat stats, not Bit-type permissions.
    const pCombatRating=
        0.58+
        pAttack*0.44+
        pKB*0.28;
    const cCombatRating=
        0.58+
        cAttack*0.44+
        cKB*0.28;

    // Momentum is the physical input; Attack/Knockback determine how well
    // the Bey converts that input into an offensive collision.
    const pParked=pSpeed<0.007;
    const cParked=cSpeed<0.007;
    const bothParked=pParked&&cParked;
    const pSpinBite=
        (0.00052+pAttack*0.00070+pKB*0.00086)*
        (0.12+0.88*pRPM)*
        (pParked?0.72:1)*
        (bothParked?0.34:1);
    const cSpinBite=
        (0.00052+cAttack*0.00070+cKB*0.00086)*
        (0.12+0.88*cRPM)*
        (cParked?0.72:1)*
        (bothParked?0.34:1);

    const pEnergy=(
        pKinetic+
        pClosing*pMomentum*0.62+
        grazingEnergy*0.36+
        pSpinBite
    )*pContactEfficiency;

    const cEnergy=(
        cKinetic+
        cClosing*cMomentum*0.62+
        grazingEnergy*0.36+
        cSpinBite
    )*cContactEfficiency;

    const statDrivenContact=
        (0.0016+Math.min(pCombatRating,cCombatRating)*0.00115)*
        Math.pow(Math.max(0.28,(pRPM+cRPM)*0.5),0.55);

    const effectiveImpact=Math.max(
        impactSpeed,
        grazingEnergy,
        statDrivenContact,
        Math.sqrt(Math.max(pEnergy,cEnergy))*0.62
    );

    const directness=newBattleClamp(
        impactSpeed/Math.max(totalRelative,0.0001),
        0,1
    );
    const avgRPM=(pRPM+cRPM)*0.5;

    const contactEnergy=
        effectiveImpact*
        (1.02+avgRPM*0.58);

    const pEnergyScale=
        0.84+
        newBattleClamp(pEnergy/0.0016,0,2.6)*0.28+
        newBattleClamp(pMomentum/0.034,0,2.4)*0.20;

    const cEnergyScale=
        0.84+
        newBattleClamp(cEnergy/0.0016,0,2.6)*0.28+
        newBattleClamp(cMomentum/0.034,0,2.4)*0.20;

    const pHit =
        contactEnergy *
        pEnergyScale *
        (0.96+pKB*0.38) *
        (0.94+pAttack*0.32) *
        (0.90+pRPM*0.16);

    const cHit =
        contactEnergy *
        cEnergyScale *
        (0.96+cKB*0.38) *
        (0.94+cAttack*0.32) *
        (0.90+cRPM*0.16);

    const momentumFactor=newBattleClamp(effectiveImpact/0.020,0,4.0);
    const hitRoll=0.90+Math.random()*0.20;
    const heavyFactor=
        Math.pow(momentumFactor,1.08)*
        (0.58+directness*0.38);

    const pForce=
        pHit*
        (0.76+directness*0.22)*
        (0.84+heavyFactor*0.25)*
        hitRoll;

    const cForce=
        cHit*
        (0.76+directness*0.22)*
        (0.84+heavyFactor*0.25)*
        hitRoll;

    // Knockback stays one physical system: closing speed, Attack/KB stats,
    // and remaining RPM. No extra bit-pair or rail-exit multipliers.
    const extremeSpeedScale=
        relativeSpeed>0.40 ? 0.40/relativeSpeed : 1;

    const pRailBreakForce=cForce;
    const cRailBreakForce=pForce;
    const railBreakThreshold=0.0068;
    const railCollisionBreakThreshold=0.0014;
    const bounceSep=Math.max(0,-closing)*(0.70+directness*0.30);
    const pSpinPower=
        (0.018+pAttack*0.024+pKB*0.026)*
        (0.18+0.82*pRPM)*
        Math.max(0.12, Math.min(1, pSpeed/0.038))*
        (pParked&&cParked?0.34:1);
    const cSpinPower=
        (0.018+cAttack*0.024+cKB*0.026)*
        (0.18+0.82*cRPM)*
        Math.max(0.12, Math.min(1, cSpeed/0.038))*
        (pParked&&cParked?0.34:1);
    const pKnockback=Math.min(
        0.128,
        Math.max(
            0.0035+avgRPM*0.007,
            (bounceSep*0.82+pSpinPower+pForce*0.022)*
            extremeSpeedScale*
            (0.94+(1-cDef)*0.24)*
            (1.08+newBattleClamp(momentumFactor/2.0,0,0.40))
        )
    );
    const cKnockback=Math.min(
        0.128,
        Math.max(
            0.0035+avgRPM*0.007,
            (bounceSep*0.82+cSpinPower+cForce*0.022)*
            extremeSpeedScale*
            (0.94+(1-pDef)*0.24)*
            (1.08+newBattleClamp(momentumFactor/2.0,0,0.40))
        )
    );

    // Stop walking into each other, then shove apart. Adding a tiny delta
    // on top of inbound speed looked like "damage with no impact".
    const pNormal=p.vx*nx+p.vy*ny;
    const cNormal=c.vx*nx+c.vy*ny;
    if(pNormal>0){p.vx-=nx*pNormal;p.vy-=ny*pNormal;}
    if(cNormal<0){c.vx-=nx*cNormal;c.vy-=ny*cNormal;}
    c.vx+=nx*pKnockback; c.vy+=ny*pKnockback;
    p.vx-=nx*cKnockback; p.vy-=ny*cKnockback;

    /*
      PHASE A — IMPACT MOMENTUM OWNERSHIP
      -----------------------------------
      The collision impulse is now allowed to control the trajectory for a
      short physical recovery window. The normal movement response must not
      immediately overwrite a genuine knockback event with its preferred
      stadium curvature.

      This is not a teleport, scripted path, or finish override. It is simply
      a temporary reduction in orbital steering after a real collision.
    */
    const pImpactMomentumState=
        newBattleClamp(
            Math.max(
                pKnockback/0.018,
                effectiveImpact/0.016,
                0.68
            ),
            0,1
        );

    const cImpactMomentumState=
        newBattleClamp(
            Math.max(
                cKnockback/0.018,
                effectiveImpact/0.016,
                0.68
            ),
            0,1
        );

    p.impactMomentumState=Math.max(
        p.impactMomentumState||0,
        pImpactMomentumState
    );
    c.impactMomentumState=Math.max(
        c.impactMomentumState||0,
        cImpactMomentumState
    );

    const recoilP=pKnockback*(0.08+0.10*pDef);
    const recoilC=cKnockback*(0.08+0.10*cDef);
    p.vx-=nx*recoilC; p.vy-=ny*recoilC;
    c.vx+=nx*recoilP; c.vy+=ny*recoilP;

    // Glancing/recoil component. Stronger hits change trajectory more.
    const followThrough=
        0.00018+
        effectiveImpact*0.0021+
        Math.abs(tangentRelative)*0.00032+
        heavyFactor*0.00008;

    const pFollow=
        followThrough*
        (0.84+0.24*pAttack)*
        (0.82+0.20*pKB);

    const cFollow=
        followThrough*
        (0.84+0.24*cAttack)*
        (0.82+0.20*cKB);

    p.vx+=tx*pFollow;
    p.vy+=ty*pFollow;
    c.vx-=tx*cFollow;
    c.vy-=ty*cFollow;

    if(p.railEngaged && cRailBreakForce>=railBreakThreshold){
        breakXRailFromImpact(p,nx,ny,cRailBreakForce);
    }

    if(c.railEngaged && pRailBreakForce>=railBreakThreshold){
        breakXRailFromImpact(c,-nx,-ny,pRailBreakForce);
    }

    /*
      Hard-impact rail ejector. Once a rider loses grip, give it a real
      outward impulse from its last rail contact so the next frame cannot
      simply snap it back onto the rail.
    */
    for(const rider of [p,c]){
        if(!rider.railEngaged &&
           rider.lastImpactForce>=0.0065 &&
           rider.railContactPoint){
            const rx=rider.x-rider.railContactPoint.x;
            const ry=rider.y-rider.railContactPoint.y;
            const rl=Math.hypot(rx,ry)||1;
            const eject=
                0.010+
                newBattleClamp(rider.lastImpactForce/0.025,0,2)*0.014;

            rider.vx+=(rx/rl)*eject;
            rider.vy+=(ry/rl)*eject;
            rider.surfaceBounce=0.34;
            rider.surfaceRecovery=0.20;
            rider.railContactPoint=null;
        }
    }

    // Separate them so the same collision cannot fire repeatedly on adjacent
    // frames while they are still overlapping.
    const separation=minDist-dist;
    p.x-=nx*(separation*0.62+0.0040);
    p.y-=ny*(separation*0.62+0.0040);
    c.x+=nx*(separation*0.62+0.0040);
    c.y+=ny*(separation*0.62+0.0040);

    // A collision can otherwise push a Bey deep into the rail in one frame.
    // Resolve that immediately. The bottom finish corridor remains the only
    // intentional pass-through route.
    for(const rider of [p,c]){
        if(!rider.railEngaged){
            const railPoint=newXRailNearest(rider.x,rider.y);
            if(railPoint){
                const rd=Math.sqrt(Math.max(0,railPoint.dist2));
                const rr=0.030+rider.radius*0.24;
                if(rd<=rr && !isBottomFinishCorridor(rider)){
                    applyXRailContactSafety(
                        rider,
                        railPoint,
                        0
                    );
                }
            }
        }
    }

    /*
      RPM damage is now attacker -> target.

      Big/high-RPM/high-Attack impacts remove more RPM from the Bey that
      actually received the hit. Knockback is separate, so a massive shove
      doesn't automatically equal an instant Spin Finish.
    */
    /*
      V61 DAMAGE MODEL
      ----------------
      Damage is not a flat "contact happened = 1 RPM" event anymore.

      The attacker contributes:
        1) physical momentum
        2) the actual knockback impulse it generated
        3) impact/force delivered at contact
        4) a modest Attack/Knockback stat influence

      Momentum and delivered force are deliberately the dominant terms.
      This lets the same Bey produce a light scrape, a medium clash, or a
      genuinely damaging smash without making every hit lethal.

      Low-RPM Beys retain a small damage floor. Their attacks become less
      frequent/effective because momentum, speed and force fall, but they
      never become mathematically incapable of dealing damage.
    */

    const pMomentumQuality=
        newBattleClamp(pMomentum/0.040,0,3.0);
    const cMomentumQuality=
        newBattleClamp(cMomentum/0.040,0,3.0);

    // pKnockback/cKnockback is the actual displacement impulse generated
    // by each attacker after defense and Bit behavior are applied.
    const pKnockQuality=
        newBattleClamp(pKnockback/0.0060,0,3.0);
    const cKnockQuality=
        newBattleClamp(cKnockback/0.0060,0,3.0);

    const pForceQuality=
        newBattleClamp(pForce/0.020,0,3.0);
    const cForceQuality=
        newBattleClamp(cForce/0.020,0,3.0);

    /*
      RPM is used as a supporting multiplier rather than the primary damage
      source. A 40-RPM Bey can still hurt; it just has much less momentum and
      delivered force available to do it consistently.
    */
    const pRPMQuality=0.58+0.42*newBattleClamp(pRPM,0,1);
    const cRPMQuality=0.58+0.42*newBattleClamp(cRPM,0,1);

    /*
      Attack and Knockback matter, but neither is allowed to overpower the
      physical collision. This preserves the distinction:
        Attack = ability to convert contact into offensive damage.
        Knockback = ability to deliver displacement/impact.
    */
    const pStatDamageFactor=
        (0.88+pAttack*0.0016)*
        (0.92+pKB*0.0010);
    const cStatDamageFactor=
        (0.88+cAttack*0.0016)*
        (0.92+cKB*0.0010);

    const nonAttackRPMMultiplier=1.0;

    const attackVsAttackRPMMultiplier=1.0;

    /*
      X-Rail attacks get a controlled damage bonus because the rail supplies
      additional launch energy. It is a bonus, not an automatic heavy hit.
    */
    const pRailAttackMultiplier=pWasOnRail ? 1.18 : 1.0;
    const cRailAttackMultiplier=cWasOnRail ? 1.18 : 1.0;

    /*
      Physical damage curve:
        - momentum is the largest contributor
        - actual knockback is the second major contributor
        - delivered force adds the final impact component
        - RPM/stat factors refine rather than dominate

      Typical contacts land around 1–6 RPM.
      Strong clashes can reach roughly 7–12+ RPM.
      Truly exceptional collisions can go higher, but the cap prevents
      single impacts from melting a full-spin Bey.
    */
    /*
      Attacker-specific damage curve.

      The old curve shared the same contactEnergy and therefore made
      simultaneous exchanges converge on nearly identical RPM losses.
      Each Bey now gets a modest independent contact-quality term based on
      its own momentum, closing speed, force and geometry. This does NOT
      randomize damage blindly; the physics still dominates.
    */
    const pContactShare=
        newBattleClamp(
            pEnergy/Math.max(pEnergy+cEnergy,0.000001),
            0.18,0.82
        );
    const cContactShare=
        newBattleClamp(
            cEnergy/Math.max(pEnergy+cEnergy,0.000001),
            0.18,0.82
        );

    const pContactVariance=
        0.88+
        pContactShare*0.22+
        Math.random()*0.10;

    const cContactVariance=
        0.88+
        cContactShare*0.22+
        Math.random()*0.10;

    const pDamageCurve=
        0.0030+
        0.0115*Math.pow(pMomentumQuality,0.82)+
        0.0150*Math.pow(pKnockQuality,0.88)+
        0.0100*Math.pow(pForceQuality,0.84);

    const cDamageCurve=
        0.0030+
        0.0115*Math.pow(cMomentumQuality,0.82)+
        0.0150*Math.pow(cKnockQuality,0.88)+
        0.0100*Math.pow(cForceQuality,0.84);

    const pDamageVariance=
        pContactVariance*
        (0.92+0.08*newBattleClamp(pClosing/0.03,0,1));

    const cDamageVariance=
        cContactVariance*
        (0.92+0.08*newBattleClamp(cClosing/0.03,0,1));

    /*
      Defender still matters. Defense reduces incoming damage, but never
      reduces it to zero. This is intentionally softer than the old system.
    */
    const pToCDamageRaw=
        pDamageCurve*
        pDamageVariance*
        pStatDamageFactor*
        pRPMQuality*
        nonAttackRPMMultiplier*
        attackVsAttackRPMMultiplier*
        pRailAttackMultiplier*
        (0.82+0.18*(1-newBattleClamp(cDef/100,0,1)));

    const cToPDamageRaw=
        cDamageCurve*
        cDamageVariance*
        cStatDamageFactor*
        cRPMQuality*
        nonAttackRPMMultiplier*
        attackVsAttackRPMMultiplier*
        cRailAttackMultiplier*
        (0.82+0.18*(1-newBattleClamp(pDef/100,0,1)));

    /*
      Small guaranteed floor: a real contact always matters, including at
      low RPM. This is below the normal 1-RPM display threshold, so it does
      not turn every tiny scrape into a large visible hit.
    */
    const contactDamageFloor=0.0055;

    /*
      Hard cap prevents a single collision from deleting a huge percentage
      of the battle's remaining RPM. Strong hits still feel dramatically
      different because they can reach the upper portion of this range.
    */
    const maximumSingleHitDamage=0.135;

    const pToCDamage=newBattleClamp(
        Math.max(contactDamageFloor,pToCDamageRaw),
        contactDamageFloor,
        maximumSingleHitDamage
    );
    const cToPDamage=newBattleClamp(
        Math.max(contactDamageFloor,cToPDamageRaw),
        contactDamageFloor,
        maximumSingleHitDamage
    );

    const __cRpmLoss=pToCDamage;
    const __pRpmLoss=cToPDamage;
    let __pExtraRpmLoss=0;
    let __cExtraRpmLoss=0;
    c.rpm=newBattleClamp(c.rpm-pToCDamage,0,1);
    p.rpm=newBattleClamp(p.rpm-cToPDamage,0,1);

    // Non-attack vs non-attack still uses the same collision impulse.
    // Extra shove/RPM here was making light stamina contacts feel bigger
    // than attack-on-attack hits.

    const stabilityHit=
        0.004+
        effectiveImpact*0.050+
        heavyFactor*0.006;

    p.stability=newBattleClamp(
        p.stability-stabilityHit*(1-pDef*0.36),
        0,1
    );
    c.stability=newBattleClamp(
        c.stability-stabilityHit*(1-cDef*0.36),
        0,1
    );

    p.axisStability=newBattleClamp(
        (p.axisStability||0.70)-
        stabilityHit*(0.42-pDef*0.18),
        0.15,1
    );
    c.axisStability=newBattleClamp(
        (c.axisStability||0.70)-
        stabilityHit*(0.42-cDef*0.18),
        0.15,1
    );

    p.movementEnergy=newBattleClamp(
        (p.movementEnergy||1)-effectiveImpact*0.28,
        0.18,1
    );
    c.movementEnergy=newBattleClamp(
        (c.movementEnergy||1)-effectiveImpact*0.28,
        0.18,1
    );

    const tiltHit=
        0.035+
        effectiveImpact*0.32+
        newBattleClamp(heavyFactor,0,2.5)*0.015;

    p.tiltLevel=newBattleClamp((p.tiltLevel||0)+tiltHit,0,1);
    c.tiltLevel=newBattleClamp((c.tiltLevel||0)+tiltHit,0,1);

    // Every impact changes the precession phase.
    p.motionPhase+=0.62+Math.random()*0.80;
    c.motionPhase+=0.62+Math.random()*0.80;
    p.motionPhase2+=0.34+Math.random()*0.65;
    c.motionPhase2+=0.34+Math.random()*0.65;

    const impactVisualEnergy=
        newBattleClamp(
            effectiveImpact/0.022+
            heavyFactor*0.12,
            0,1
        );

    const visualStrength=newBattleClamp(
        0.78+
        impactVisualEnergy*0.86,
        0.78,1.72
    );
    const impactClass=
        visualStrength>=1.22 ? "heavy" :
        visualStrength>=0.96 ? "medium" : "light";

    p.hitFlash=0.27*visualStrength;
    c.hitFlash=0.27*visualStrength;
    p.impactScale=1.13+0.38*visualStrength;
    c.impactScale=1.13+0.38*visualStrength;

    // Used by the multi-ring visual system.
    NEW_BATTLE.lastImpact={
        x:(p.x+c.x)*0.5,
        y:(p.y+c.y)*0.5,
        strength:visualStrength,
        impactClass,
        heavy:impactClass==="heavy",
        playerRpmLoss:__pRpmLoss+__pExtraRpmLoss,
        cpuRpmLoss:__cRpmLoss+__cExtraRpmLoss,
        time:performance.now(),
        kb:(pKnockback+cKnockback)*0.5
    };

    p.lastKnockback=pKnockback;
    c.lastKnockback=cKnockback;

    // Record who generated the displacement. Pocket finishes use this
    // information so a light accidental drift cannot become a finish.
    p.lastImpactAt=performance.now();
    c.lastImpactAt=performance.now();
    p.lastImpactForce=cKnockback;
    c.lastImpactForce=pKnockback;
    p.lastImpactAttacker="cpu";
    c.lastImpactAttacker="player";

    if(pWasOnRail &&
       Math.max(pRailBreakForce,Math.abs(p.lastKnockback||0))>=railCollisionBreakThreshold){
        breakXRailFromImpact(
            p,nx,ny,
            Math.max(pRailBreakForce,Math.abs(p.lastKnockback||0))
        );
    }
    if(cWasOnRail &&
       Math.max(cRailBreakForce,Math.abs(c.lastKnockback||0))>=railCollisionBreakThreshold){
        breakXRailFromImpact(
            c,-nx,-ny,
            Math.max(cRailBreakForce,Math.abs(c.lastKnockback||0))
        );
    }

    /*
      FINAL COLLISION DIRECTION CHECK
      -------------------------------
      All collision impulses are now applied. Correct only a post-impact
      tangential reversal so a hit cannot turn a right-spin Bey into a
      sustained clockwise orbit (or vice versa).
    */
    enforcePostImpactSpinDirection(p);
    enforcePostImpactSpinDirection(c);
}

// Launch angle and technique are selected on the stadium setup view.
// The selected launch state is passed directly into the physical engine.

window.addEventListener("DOMContentLoaded",()=>hookMenuButtons());
