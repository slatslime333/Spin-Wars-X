/*==================================
 SPIN WAR X
 Version 0.6.1
==================================*/

//=========================
// GAME STATE
//=========================

const Game = {

    version:"0.6.1",

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

    xRail:"Bottom",
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
evasionBonus:0,
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
evasionBonus:0,
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

        card:{
         ovr:95,
         
            attack:35,
            knockback:48,
            defense:96,
            mobility:56,
            balance:95,
            stamina:97,
            burst:94
        },

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

        card:{
         ovr:94,
          
            attack:94,
            knockback:92,
            defense:84,
            mobility:84,
            balance:87,
            stamina:75,
            burst:87
        },

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

        card:{
         ovr:98,
         
            attack:52,
            knockback:58,
            defense:88,
            mobility:44,
            balance:97,
            stamina:99,
            burst:92
        },

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

        card:{
         ovr:84,
         
            attack:91,
            knockback:89,
            defense:68,
            mobility:92,
            balance:70,
            stamina:63,
            burst:73
        },

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

        card:{
         ovr:85,
         
            attack:70,
            knockback:86,
            defense:91,
            mobility:62,
            balance:90,
            stamina:71,
            burst:91
        },

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

        card:{
         ovr:70,
         
            attack:70,
            knockback:76,
            defense:65,
            mobility:84,
            balance:82,
            stamina:80,
            burst:66
        },

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

        card:{
         ovr:74,
         
            attack:70,
            knockback:68,
            defense:72,
            mobility:74,
            balance:82,
            stamina:78,
            burst:76
        },

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

        card:{
         ovr:73,
         
            attack:82,
            knockback:80,
            defense:64,
            mobility:86,
            balance:68,
            stamina:62,
            burst:70
        },

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
            smashPower:84,
            upperPower:88,
            barragePower:76,
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
 

    aero_pegasus:{name:"Aero Pegasus",type:"Attack",tier:"Gold",spin:"Right",weight:38.3,card:{ovr:94,attack:94,knockback:94,defense:77,mobility:90,balance:83,stamina:86,burst:91},physics:{weightClass:"Very Heavy",centerOfGravity:"Medium",contactShape:"Upper Smash",recoil:"Medium",lockStrength:91,weightDistribution:"Outer"},behavior:{attackStyle:"Smash",smashPower:96,upperPower:82,barragePower:72,counterPower:48,movementControl:88,spinRetention:84,lad:82,burstResistance:91,winConditions:{spin:70,burst:92,knockout:97,counter:58}},compatibility:{heights:{60:96,70:94,80:58},bits:{Rush:99,LowRush:99,Flat:92,LowFlat:94,Level:94,Kick:88,Point:86,HighNeedle:68,Quake:82,Hexa:72,Wedge:55,Ball:70,Orb:74,Elevate:80,Needle:60}},traits:["Versatile","Heavy","Smash","Attack","Stamina"],personality:{aggression:96,control:86,consistency:84,risk:72}},
    leon_crest:{name:"Leon Crest",type:"Defense",tier:"Silver",spin:"Right",weight:35.0,card:{ovr:78,attack:66,knockback:64,defense:95,mobility:50,balance:84,stamina:72,burst:84},physics:{weightClass:"Medium",centerOfGravity:"High",contactShape:"Round",recoil:"Low",lockStrength:84,weightDistribution:"Outer"},behavior:{attackStyle:"Counter",smashPower:32,upperPower:18,barragePower:36,counterPower:82,movementControl:86,spinRetention:74,lad:76,burstResistance:84,winConditions:{spin:58,burst:64,knockout:24,counter:90}},compatibility:{heights:{60:72,70:84,80:94},bits:{Needle:92,HighNeedle:95,Point:82,Hexa:90,Wedge:88,Ball:86,Orb:84,Elevate:72,Level:68,Rush:38,LowRush:34,Flat:30,LowFlat:28,Kick:48,Quake:30}},traits:["Defense","Round","Counter","Plastic Frame","Stability"],personality:{aggression:20,control:90,consistency:78,risk:20}},
    unicorn_sting:{name:"Unicorn Sting",type:"Balance",tier:"Silver",spin:"Right",weight:33.3,card:{ovr:82,attack:76,knockback:73,defense:82,mobility:62,balance:88,stamina:85,burst:88},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Hybrid",recoil:"Medium",lockStrength:88,weightDistribution:"Outer"},behavior:{attackStyle:"Counter Attack",smashPower:62,upperPower:36,barragePower:64,counterPower:88,movementControl:78,spinRetention:84,lad:86,burstResistance:88,winConditions:{spin:78,burst:76,knockout:48,counter:92}},compatibility:{heights:{60:96,70:82,80:48},bits:{Point:96,Level:88,Hexa:90,Elevate:82,Needle:84,HighNeedle:86,Ball:88,Orb:86,Wedge:80,Rush:68,LowRush:64,Flat:56,LowFlat:54,Kick:82,Quake:50}},traits:["Balance","Counter","Round","Stamina","Versatile"],personality:{aggression:58,control:88,consistency:86,risk:40}},
    knight_shield:{name:"Knight Shield",type:"Defense",tier:"Bronze",spin:"Right",weight:32.3,card:{ovr:74,attack:69,knockback:76,defense:91,mobility:52,balance:90,stamina:78,burst:84},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Tri-Wing",recoil:"High",lockStrength:84,weightDistribution:"Balanced"},behavior:{attackStyle:"Counter",smashPower:48,upperPower:24,barragePower:42,counterPower:90,movementControl:92,spinRetention:76,lad:72,burstResistance:84,winConditions:{spin:62,burst:68,knockout:34,counter:96}},compatibility:{heights:{60:74,70:82,80:90},bits:{Needle:98,HighNeedle:96,Point:84,Hexa:92,Wedge:90,Ball:86,Orb:84,Elevate:70,Level:62,Rush:38,LowRush:34,Flat:32,LowFlat:28,Kick:50,Quake:30}},traits:["Defense","Counter","Round","High Recoil","Stationary"],personality:{aggression:24,control:94,consistency:86,risk:18}},
    tyranno_beat:{name:"Tyranno Beat",type:"Attack",tier:"Gold",spin:"Right",weight:37.0,card:{ovr:88,attack:91,knockback:89,defense:75,mobility:84,balance:78,stamina:69,burst:84},physics:{weightClass:"Heavy",centerOfGravity:"Medium",contactShape:"Elliptical",recoil:"High",lockStrength:84,weightDistribution:"Outer"},behavior:{attackStyle:"Elliptical Smash",smashPower:90,upperPower:58,barragePower:72,counterPower:60,movementControl:84,spinRetention:70,lad:67,burstResistance:84,winConditions:{spin:38,burst:74,knockout:94,counter:68}},compatibility:{heights:{60:96,70:90,80:48},bits:{Quake:98,Flat:94,LowFlat:96,Rush:90,LowRush:88,Point:74,Level:80,Kick:84,HighNeedle:46,Needle:38,Hexa:54,Wedge:46,Ball:30,Orb:34,Elevate:52}},traits:["Attack","Elliptical","Heavy","Smash","Counter Attack","High Recoil"],personality:{aggression:92,control:76,consistency:72,risk:86}},

    leon_claw:{name:"Leon Claw",type:"Balance",tier:"Bronze",spin:"Right",weight:34.0,card:{ovr:72,attack:72,knockback:70,defense:74,mobility:76,balance:84,stamina:76,burst:74},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Claw Hybrid",recoil:"Medium",lockStrength:74,weightDistribution:"Balanced"},behavior:{attackStyle:"Counter Rush",smashPower:64,upperPower:48,barragePower:62,counterPower:78,movementControl:82,spinRetention:76,lad:72,burstResistance:74,winConditions:{spin:70,burst:48,knockout:48,counter:82}},compatibility:{heights:{60:86,70:96,80:72},bits:{Point:94,Level:92,Hexa:88,Elevate:82,Needle:80,HighNeedle:78,Ball:76,Orb:78,Wedge:74,Rush:62,LowRush:58,Flat:66,LowFlat:60,Kick:74,Quake:58}},traits:["Balance","Counter","Versatile","Controlled Attack"],personality:{aggression:52,control:86,consistency:84,risk:38}}

};

//=========================
// ENGINE 2.0 RATCHETS
//=========================

const RATCHET_ENGINE = {

    "1":{

        weight:1,

        stability:72,

        burstResistance:82,

        attackBias:96,

        defenseBias:45,

        staminaBias:52,

        mobilityBias:92

    },

    "3":{

        weight:3,

        stability:82,

        burstResistance:86,

        attackBias:82,

        defenseBias:66,

        staminaBias:68,

        mobilityBias:84

    },

    "5":{

        weight:5,

        stability:90,

        burstResistance:90,

        attackBias:70,

        defenseBias:82,

        staminaBias:80,

        mobilityBias:74

    },

    "6":{

        weight:6,

        stability:92,

        burstResistance:92,

        attackBias:64,

        defenseBias:88,

        staminaBias:86,

        mobilityBias:70

    },

    "7":{

        weight:7,

        stability:94,

        burstResistance:94,

        attackBias:58,

        defenseBias:94,

        staminaBias:92,

        mobilityBias:66

    },

    "9":{

        weight:9,

        stability:99,

        burstResistance:98,

        attackBias:46,

        defenseBias:98,

        staminaBias:95,

        mobilityBias:54

    }

};

//=========================
// ENGINE 2.0 HEIGHTS
//=========================

const HEIGHT_ENGINE = {

    "60":{

        attack:2,

        knockback:1,

        defense:-1,

        mobility:2,

        balance:-1,

        stamina:-2,

        burst:2

    },

    "70":{

        attack:0,

        knockback:0,

        defense:0,

        mobility:0,

        balance:1,

        stamina:0,

        burst:0

    },

    "80":{

        attack:-2,

        knockback:-2,

        defense:-8,

        mobility:-3,

        balance:-5,

        stamina:3,

        burst:-7

    }

};

//=========================
// ENGINE 2.0 BITS
//=========================

const BIT_ENGINE = {

    flat:{

        name:"Flat",

        type:"Attack",

        card:{
            attack:95,
            knockback:88,
            defense:62,
            mobility:94,
            balance:68,
            stamina:60,
            burst:72
        },

        behavior:{
            speed:96,
            aggression:92,
            control:60,
            staminaRetention:62
        }

    },

    low_flat:{

        name:"Low Flat",

        type:"Attack",

        card:{
            attack:98,
            knockback:92,
            defense:58,
            mobility:98,
            balance:64,
            stamina:56,
            burst:74
        },

        behavior:{
            speed:99,
            aggression:93,
            control:74,
            staminaRetention:70
        }

    },

    rush:{

        name:"Rush",

        type:"Attack",

        card:{
            attack:96,
            knockback:84,
            defense:62,
            mobility:95,
            balance:70,
            stamina:64,
            burst:76
        },

        behavior:{
            speed:98,
            aggression:90,
            control:78,
            staminaRetention:74
        }

    },
 
 low_rush:{

    name:"Low Rush",

    type:"Attack",

    card:{
        attack:99,
        knockback:94,
        defense:56,
        mobility:99,
        balance:62,
        stamina:54,
        burst:78
    },

    behavior:{
        speed:100,
        aggression:100,
        control:64,
        staminaRetention:54
    }

},

level:{

    name:"Level",

    type:"Balance",

    card:{
        attack:78,
        knockback:76,
        defense:80,
        mobility:78,
        balance:94,
        stamina:80,
        burst:86
    },

    behavior:{
        speed:76,
        aggression:64,
        control:94,
        staminaRetention:82
    }

},

elevate:{

    name:"Elevate",

    type:"Balance",

    card:{
        attack:70,
        knockback:72,
        defense:86,
        mobility:82,
        balance:92,
        stamina:92,
        burst:84
    },

    behavior:{
        speed:72,
        aggression:52,
        control:96,
        staminaRetention:94
    }

},

 kick:{

    name:"Kick",

    type:"Attack",

    card:{
        attack:90,
        knockback:98,
        defense:68,
        mobility:86,
        balance:66,
        stamina:64,
        burst:82
    },

    behavior:{
        speed:84,
        aggression:94,
        control:74,
        staminaRetention:66
    }

},

wedge:{

    name:"Wedge",

    type:"Defense",

    card:{
        attack:58,
        knockback:66,
        defense:95,
        mobility:52,
        balance:96,
        stamina:84,
        burst:92
    },

    behavior:{
        speed:48,
        aggression:30,
        control:98,
        staminaRetention:86
    }

},

hexa:{

    name:"Hexa",

    type:"Defense",

    card:{
        attack:60,
        knockback:68,
        defense:98,
        mobility:56,
        balance:98,
        stamina:88,
        burst:94
    },

    behavior:{
        speed:52,
        aggression:26,
        control:100,
        staminaRetention:90
    }

},

needle:{

    name:"Needle",

    type:"Defense",

    card:{
        attack:50,
        knockback:58,
        defense:94,
        mobility:40,
        balance:94,
        stamina:82,
        burst:90
    },

    behavior:{
        speed:38,
        aggression:20,
        control:98,
        staminaRetention:84
    }

},

ball:{

    name:"Ball",

    type:"Stamina",

    card:{
        attack:46,
        knockback:54,
        defense:82,
        mobility:48,
        balance:92,
        stamina:99,
        burst:88
    },

    behavior:{
        speed:46,
        aggression:18,
        control:96,
        staminaRetention:100
    }

},

orb:{

    name:"Orb",

    type:"Stamina",

    card:{
        attack:54,
        knockback:60,
        defense:84,
        mobility:58,
        balance:90,
        stamina:95,
        burst:86
    },

    behavior:{
        speed:54,
        aggression:24,
        control:94,
        staminaRetention:96
    },

},

    point:{name:"Point",type:"Balance",card:{attack:72,knockback:70,defense:72,mobility:70,balance:78,stamina:74,burst:82},behavior:{speed:62,aggression:58,control:82,staminaRetention:78}},
    high_needle:{name:"High Needle",type:"Defense",card:{attack:62,knockback:60,defense:88,mobility:48,balance:82,stamina:86,burst:66},behavior:{speed:42,aggression:24,control:88,staminaRetention:90}},
    quake:{name:"Quake",type:"Attack",card:{attack:84,knockback:78,defense:54,mobility:90,balance:48,stamina:46,burst:88},behavior:{speed:88,aggression:92,control:42,staminaRetention:38}}

};


//=========================
// BIT PHYSICS 3.0
//=========================
// The bit is the primary movement component. Card stats determine how well
// the Bey uses that movement, while launch angle modifies the bit's natural
// behavior rather than replacing it.
const BIT_PHYSICS = {
    Flat:{movement:96,control:48,spinDrain:1.55,xRailAffinity:94,centerAffinity:30,recovery:42,attackBias:10},
    "Low Flat":{movement:100,control:43,spinDrain:1.70,xRailAffinity:97,centerAffinity:24,recovery:35,attackBias:13},
    Rush:{movement:91,control:64,spinDrain:1.28,xRailAffinity:88,centerAffinity:38,recovery:48,attackBias:8},
    "Low Rush":{movement:96,control:52,spinDrain:1.62,xRailAffinity:94,centerAffinity:28,recovery:40,attackBias:11},
    Level:{movement:66,control:84,spinDrain:0.86,xRailAffinity:58,centerAffinity:62,recovery:70,attackBias:2},
    Elevate:{movement:55,control:91,spinDrain:0.66,xRailAffinity:42,centerAffinity:76,recovery:82,attackBias:-1},
    Kick:{movement:82,control:62,spinDrain:1.16,xRailAffinity:78,centerAffinity:36,recovery:52,attackBias:7},
    Wedge:{movement:32,control:96,spinDrain:0.58,xRailAffinity:24,centerAffinity:94,recovery:90,attackBias:-4},
    Hexa:{movement:38,control:99,spinDrain:0.52,xRailAffinity:20,centerAffinity:98,recovery:95,attackBias:-5},
    Needle:{movement:16,control:98,spinDrain:0.38,xRailAffinity:12,centerAffinity:100,recovery:96,attackBias:-8},
    Ball:{movement:25,control:95,spinDrain:0.34,xRailAffinity:18,centerAffinity:96,recovery:94,attackBias:-7},
    Orb:{movement:34,control:94,spinDrain:0.40,xRailAffinity:25,centerAffinity:92,recovery:91,attackBias:-5},
    Point:{movement:58,control:82,spinDrain:0.74,xRailAffinity:48,centerAffinity:70,recovery:72,attackBias:1},
    "High Needle":{movement:19,control:93,spinDrain:0.34,xRailAffinity:10,centerAffinity:100,recovery:94,attackBias:-7},
    Quake:{movement:88,control:42,spinDrain:1.72,xRailAffinity:72,centerAffinity:22,recovery:30,attackBias:8}
};

function getBitPhysics(blader){
    const name=Game[blader]?.bit?.name;
    return BIT_PHYSICS[name] || BIT_PHYSICS.Point;
}

function getCurrentControl(blader){
    const state=Game.battle[blader];
    const side=Game[blader];
    const combo=getBattleCombo(blader);
    const bit=getBitPhysics(blader);
    if(!state || !side || !combo) return 50;
    const fatigue=(100-state.spin)*0.20 + (100-state.balance)*0.24;
    const momentumPenalty=Math.max(0,-state.momentum)*0.10;
    const launchBonus=side.launch?.controlBonus || 0;
    return clampBattleValue(
        bit.control*0.52 + (combo.stats.balance||70)*0.30 + (combo.stats.defense||70)*0.08 + launchBonus - fatigue - momentumPenalty,
        5,99
    );
}

function getBitMovementPower(blader){
    const side=Game[blader], state=Game.battle[blader];
    const combo=getBattleCombo(blader), bit=getBitPhysics(blader);
    if(!side || !state || !combo) return bit.movement;
    const rpmFactor=0.48 + state.spin/190;
    const balanceFactor=0.58 + state.balance/238;
    return clampBattleValue(
        bit.movement*0.72 + (combo.stats.mobility||70)*0.18 + (side.launch?.movementBonus||0)*0.6,
        5,99
    ) * rpmFactor * balanceFactor;
}

function getLaunchAngleProfile(angle,bit){
    const isAttack=bit.movement>=80;
    const isStable=bit.control>=90;
    if(angle==='Flat') return {
        movement:isAttack?1.10:1.02,
        control:isAttack?-6:2,
        drain:isAttack?1.10:0.96,
        xrail:isAttack?1.08:0.90,
        balance:isStable?3:-2,
        spin:isStable?4:-1
    };
    if(angle==='Slight Tilt') return {
        movement:isAttack?0.84:1.00,
        control:isAttack?12:7,
        drain:isAttack?0.80:0.94,
        xrail:isAttack?0.78:0.92,
        balance:isAttack?5:4,
        spin:isAttack?7:3
    };
    return {
        movement:isAttack?0.66:0.90,
        control:isAttack?20:10,
        drain:isAttack?0.70:0.88,
        xrail:isAttack?0.58:0.78,
        balance:isAttack?8:6,
        spin:isAttack?9:4
    };
}

function applyBitDrivenLaunchPhysics(blader){
    const side=Game[blader];
    const state=Game.battle[blader];
    if(!side || !side.bit || !state) return;
    const bit=getBitPhysics(blader);
    const angle=getLaunchAngleProfile(side.launch.angle,bit);
    const qualityFactor={Horrible:0.76,Bad:0.88,Okay:1,Good:1.06,Perfect:1.12}[side.launch.quality]||1;

    side.launch.bitMovement=bit.movement;
    side.launch.bitControl=bit.control;
    side.launch.bitSpinDrain=bit.spinDrain;
    side.launch.movementEfficiency=angle.movement*qualityFactor;
    side.launch.staminaEfficiency=Math.max(0.45,bit.spinDrain*angle.drain/Math.max(0.55,qualityFactor));
    side.launch.controlBonus=angle.control + (side.launch.controlBonus||0)*0.35;
    side.launch.movementBonus=(bit.movement-70)*0.30;
    side.launch.angleSpinBonus=angle.spin;
    side.launch.angleBalanceBonus=angle.balance;

    const technique=side.launch.technique;
    const railSuitability=bit.xRailAffinity*angle.xrail;
    const qualityBonus={Horrible:-22,Bad:-10,Okay:0,Good:8,Perfect:14}[side.launch.quality]||0;
    const control=getCurrentControl(blader) || bit.control;
    side.launch.xRailChance=clampBattleValue(railSuitability*0.65 + control*0.20 + qualityBonus,8,96);
    side.launch.xRailRoll=Math.random()*100;
    side.launch.xRailCommitted=side.launch.xRailRoll<side.launch.xRailChance;

    side.launch.launchControl=clampBattleValue(bit.control*0.60+(side.stats?.balance||70)*0.25+angle.control+qualityBonus*0.25,5,99);
    side.launch.openingMovement=clampBattleValue(bit.movement*angle.movement*qualityFactor,5,99);
}


//=========================
// ZONE POSITIONS
//=========================

const ZONE_POSITIONS={
    TopLeft:{x:330,y:245}, TopCenter:{x:500,y:300}, TopRight:{x:670,y:245},
    LeftMid:{x:300,y:420}, Center:{x:500,y:430}, RightMid:{x:700,y:420},
    BottomLeft:{x:360,y:560}, BottomCenter:{x:500,y:585}, BottomRight:{x:640,y:560},

    // Continuous oval X-Line. The named LeftRail/RightRail zones are entry
    // sections; the upper arc feeds the single X Exit at the top.
    LeftRail:{x:220,y:410}, RailLeftTop:{x:300,y:170}, XRailExit:{x:500,y:92},
    RailRightTop:{x:700,y:170}, RightRail:{x:780,y:410},
    RailLeftBottom:{x:275,y:585}, RailBottom:{x:500,y:660}, RailRightBottom:{x:725,y:585},

    LeftPocket:{x:255,y:705}, XtremeZone:{x:500,y:712}, RightPocket:{x:745,y:705}
};

//=========================
// STADIUM ENGINE 3.0
//=========================
const STADIUM_MAP={
    TopLeft:{neighbors:['TopCenter','LeftMid']},
    TopCenter:{neighbors:['TopLeft','TopRight','Center','RailLeftTop','RailRightTop']},
    TopRight:{neighbors:['TopCenter','RightMid']},
    LeftMid:{neighbors:['TopLeft','Center','BottomLeft','LeftRail']},
    Center:{neighbors:['TopCenter','LeftMid','RightMid','BottomCenter']},
    RightMid:{neighbors:['TopRight','Center','BottomRight','RightRail']},
    BottomLeft:{neighbors:['LeftMid','BottomCenter','LeftPocket','RailLeftBottom']},
    BottomCenter:{neighbors:['BottomLeft','Center','BottomRight','XtremeZone','RailBottom']},
    BottomRight:{neighbors:['RightMid','BottomCenter','RightPocket','RailRightBottom']},

    LeftRail:{neighbors:['LeftMid','RailLeftTop','RailLeftBottom']},
    RailLeftTop:{neighbors:['LeftRail','XRailExit']},
    XRailExit:{neighbors:['RailLeftTop','RailRightTop','Center']},
    RailRightTop:{neighbors:['XRailExit','RightRail']},
    RightRail:{neighbors:['RightMid','RailRightTop','RailRightBottom']},
    RailLeftBottom:{neighbors:['BottomLeft','RailBottom','LeftRail']},
    RailBottom:{neighbors:['RailLeftBottom','RailRightBottom','BottomCenter']},
    RailRightBottom:{neighbors:['BottomRight','RailBottom','RightRail']},

    XtremeZone:{neighbors:[]}, LeftPocket:{neighbors:[]}, RightPocket:{neighbors:[]}
};

//=========================
// MOVEMENT PATH / TRAJECTORY HELPERS
//=========================
function getMovementPath(from,to){
    if(!from || !to) return [];
    if(from===to) return [from];

    const direct=STADIUM_MAP[from]?.neighbors || [];
    if(direct.includes(to)) return [from,to];

    // Find a short route through the stadium graph so visual playback never
    // appears to teleport between unrelated zones.
    const queue=[[from]];
    const seen=new Set([from]);
    while(queue.length){
        const path=queue.shift();
        const last=path[path.length-1];
        for(const next of (STADIUM_MAP[last]?.neighbors||[])){
            if(seen.has(next)) continue;
            const nextPath=[...path,next];
            if(next===to) return nextPath;
            seen.add(next);
            if(nextPath.length<=5) queue.push(nextPath);
        }
    }
    return [from,to];
}

function movementPointList(movement,side){
    if(!movement || !movement[side]) return [];
    const m=movement[side];
    // Use the exact recorded route when available. The fallback is only for
    // older sequences that predate route recording.
    if(Array.isArray(m.path) && m.path.length) return m.path.slice();
    return getMovementPath(m.from,m.to);
}

function beginMovementCapture(){
    const p=Game.battle.player, c=Game.battle.cpu;
    Game.battle.movementCapture={
        player:[p?.zone].filter(Boolean),
        cpu:[c?.zone].filter(Boolean),
        contactIndex:{player:null,cpu:null},
        contactPoint:null,
        active:true
    };
}

function recordMovementStep(bey,zone){
    const capture=Game.battle.movementCapture;
    if(!capture || !capture.active || !zone) return;
    const path=capture[bey];
    if(!Array.isArray(path)) capture[bey]=[zone];
    else if(path[path.length-1]!==zone) path.push(zone);
}

function markMovementContact(){
    const capture=Game.battle.movementCapture;
    if(!capture || !capture.active) return;
    capture.contactIndex.player=Math.max(0,(capture.player?.length||1)-1);
    capture.contactIndex.cpu=Math.max(0,(capture.cpu?.length||1)-1);
    const pp=ZONE_POSITIONS[Game.battle.player.zone];
    const cp=ZONE_POSITIONS[Game.battle.cpu.zone];
    if(pp && cp){
        capture.contactPoint={x:(pp.x+cp.x)/2,y:(pp.y+cp.y)/2};
    }
}

function finalizeMovementCapture(keepActive=false){
    const capture=Game.battle.movementCapture;
    if(!capture || !capture.active) return;
    const p=capture.player?.length ? capture.player : [Game.battle.player.zone];
    const c=capture.cpu?.length ? capture.cpu : [Game.battle.cpu.zone];
    Game.battle.lastMovement={
        player:{
            from:p[0], to:p[p.length-1], path:p.slice(),
            contactIndex:capture.contactIndex?.player ?? null
        },
        cpu:{
            from:c[0], to:c[c.length-1], path:c.slice(),
            contactIndex:capture.contactIndex?.cpu ?? null
        },
        contactPoint:capture.contactPoint ? {...capture.contactPoint} : null,
        recoil:{
            player:{from:p[p.length-1],to:p[p.length-1]},
            cpu:{from:c[c.length-1],to:c[c.length-1]}
        }
    };
    const cp=capture.contactPoint;
    if(cp){
        const pp=ZONE_POSITIONS[Game.battle.player.zone];
        const cpos=ZONE_POSITIONS[Game.battle.cpu.zone];
        if(pp) Game.battle.lastMovement.recoil.player={from:cp,to:{x:pp.x,y:pp.y}};
        if(cpos) Game.battle.lastMovement.recoil.cpu={from:cp,to:{x:cpos.x,y:cpos.y}};
    }
    capture.active=!!keepActive;
}

function renderTrajectoryPath(movement,side,id,color){
    const zones=movementPointList(movement,side);
    if(zones.length<2) return "";
    const points=zones.map(z=>ZONE_POSITIONS[z]).filter(Boolean);
    if(points.length<2) return "";
    const d=points.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
    return `<path id="${id}" d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="7 8" opacity=".8" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function getAnimationPath(animation,side){
    const m=animation?.[side];
    if(!m) return [];
    const zones=Array.isArray(m.path) && m.path.length ? m.path : getMovementPath(m.from,m.to);
    const points=zones.map(z=>ZONE_POSITIONS[z]).filter(Boolean);
    return points.length ? points : [];
}

//=========================
// RENDER STADIUM
//=========================

function renderStadium(){

return `

<div class="stadium">

<svg class="stadium-svg"
viewBox="0 0 1000 900">

<defs>
  <marker id="playerArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
    <path d="M0,0 L8,4 L0,8 z" fill="#3ba8ff"/>
  </marker>
  <marker id="cpuArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
    <path d="M0,0 L8,4 L0,8 z" fill="#ff4b4b"/>
  </marker>
</defs>

    <!-- CONTINUOUS OVAL X-LINE -->
<path class="rail-track" d="M500 92 C790 92 855 290 820 470 C790 610 650 675 500 675 C350 675 210 610 180 470 C145 290 210 92 500 92"/>

<!-- SINGLE TOP X-EXIT -->
<path class="x-exit-gate" d="M500 88 L538 136 L462 136 Z"/>

<!-- XTREME -->

<rect
    class="xtremeZone"
    x="435"
    y="690"
    width="130"
    height="45"
    rx="18"
/>

<!-- LEFT OVER / POCKET -->

<circle
    class="overZone"
    cx="255"
    cy="705"
    r="38"
/>

<!-- RIGHT OVER / POCKET -->

<circle
    class="overZone"
    cx="745"
    cy="705"
    r="38"
/>

<text class="stadium-zone-label" x="255" y="712" text-anchor="middle">POCKET</text>
<text class="stadium-zone-label" x="745" y="712" text-anchor="middle">POCKET</text>
<text class="stadium-zone-label xtreme-label" x="500" y="718" text-anchor="middle">XTREME</text>

<g id="trajectoryLayer" pointer-events="none">
    <path id="playerTrajectory" d="" fill="none" stroke="#3ba8ff" stroke-width="3" stroke-dasharray="7 8" opacity="0" marker-end="url(#playerArrow)"/>
    <path id="cpuTrajectory" d="" fill="none" stroke="#ff4b4b" stroke-width="3" stroke-dasharray="7 8" opacity="0" marker-end="url(#cpuArrow)"/>
    <circle id="playerTrajectoryEnd" cx="0" cy="0" r="5" fill="#3ba8ff" opacity="0"/>
    <circle id="cpuTrajectoryEnd" cx="0" cy="0" r="5" fill="#ff4b4b" opacity="0"/>
    <circle id="contactMarker" cx="0" cy="0" r="7" fill="none" stroke="#ffd43b" stroke-width="2" stroke-dasharray="3 3" opacity="0"/>
</g>

<circle
    id="playerBey"
    cx="500"
    cy="420"
    r="12"
    fill="#3ba8ff"
/>

<circle
    id="cpuBey"
    cx="500"
    cy="420"
    r="12"
    fill="#ff4b4b"
/>

<text id="playerBeyLabel" text-anchor="middle" font-size="16" font-weight="800" fill="#3ba8ff"></text>
<text id="cpuBeyLabel" text-anchor="middle" font-size="16" font-weight="800" fill="#ff4b4b"></text>

<g id="impactEffect" opacity="0" pointer-events="none">
    <circle id="impactFlash" cx="500" cy="420" r="22" fill="none" stroke="#ffffff" stroke-width="5"/>
    <circle id="impactRing" cx="500" cy="420" r="8" fill="none" stroke="#ffd43b" stroke-width="3"/>
    <text id="impactText" x="500" y="380" text-anchor="middle" font-size="22" font-weight="900" fill="#ffffff">HIT!</text>
</g>

</svg>

</div>

`;

}

function updateTrajectoryPreview(movement){
    const playerPath=document.getElementById("playerTrajectory");
    const cpuPath=document.getElementById("cpuTrajectory");
    const playerEnd=document.getElementById("playerTrajectoryEnd");
    const cpuEnd=document.getElementById("cpuTrajectoryEnd");
    const contact=document.getElementById("contactMarker");
    if(!playerPath || !cpuPath) return;

    const setPath=(el,endEl,side,color,arrow)=>{
        const zones=movementPointList(movement,side);
        if(zones.length<2){
            el.setAttribute("d",""); el.setAttribute("opacity","0");
            if(endEl) endEl.setAttribute("opacity","0");
            return;
        }
        const pts=zones.map(z=>ZONE_POSITIONS[z]).filter(Boolean);
        const d=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
        el.setAttribute("d",d);
        el.setAttribute("stroke",color);
        el.setAttribute("marker-end",`url(#${arrow})`);
        el.setAttribute("opacity","0.78");
        if(endEl){
            const last=pts[pts.length-1];
            endEl.setAttribute("cx",last.x); endEl.setAttribute("cy",last.y); endEl.setAttribute("opacity","0.9");
        }
    };
    setPath(playerPath,playerEnd,"player","#3ba8ff","playerArrow");
    setPath(cpuPath,cpuEnd,"cpu","#ff4b4b","cpuArrow");

    if(contact && movement?.contactPoint){
        contact.setAttribute("cx",movement.contactPoint.x);
        contact.setAttribute("cy",movement.contactPoint.y);
        contact.setAttribute("opacity","0.9");
    }else if(contact){
        contact.setAttribute("opacity","0");
    }
}

//=========================
// BATTLE STATE / HUD 1.0
//=========================

function getStadiumPreview(){

    return `

    <div style="
        text-align:center;
        margin:15px 0;
    ">

        <svg
            viewBox="0 0 1000 900"
            style="
                width:100%;
                max-width:430px;
                height:auto;
            "
        >

            <!-- LEFT X-RAIL -->

            <path
                d="
                M275 610
                C205 520 185 360 220 245
                C255 150 345 90 450 75
                "
                fill="none"
                stroke="#666"
                stroke-width="28"
                stroke-linecap="round"
            />

            <!-- RIGHT X-RAIL -->

            <path
                d="
                M725 610
                C795 520 815 360 780 245
                C745 150 655 90 550 75
                "
                fill="none"
                stroke="#666"
                stroke-width="28"
                stroke-linecap="round"
            />

            <!-- BATTLE AREA -->

            <path
                d="
                M260 210
                Q500 120 740 210
                Q820 300 800 470
                Q790 560 730 605
                Q655 655 565 620
                L435 620
                Q345 655 270 605
                Q210 560 200 470
                Q180 300 260 210
                Z
                "
                fill="#191919"
                stroke="#777"
                stroke-width="10"
            />

            <!-- X EXIT -->

            <rect
                x="455"
                y="62"
                width="90"
                height="40"
                rx="12"
                fill="#ffd43b"
            />

            <!-- POCKETS -->

            <circle
                cx="255"
                cy="705"
                r="38"
                fill="#080808"
                stroke="#777"
                stroke-width="5"
            />

            <circle
                cx="745"
                cy="705"
                r="38"
                fill="#080808"
                stroke="#777"
                stroke-width="5"
            />

            <!-- XTREME ZONE -->

            <rect
                x="435"
                y="690"
                width="130"
                height="45"
                rx="18"
                fill="#e33"
            />

            <!-- PLAYER SIDE -->

            <circle
                cx="${Game.arena.playerSide==="Left" ? 300 : 700}"
                cy="420"
                r="15"
                fill="${Game.arena.playerColor==="Blue" ? "#3ba8ff" : "#ff4b4b"}"
            />

            <!-- CPU SIDE -->

            <circle
                cx="${Game.arena.cpuSide==="Left" ? 300 : 700}"
                cy="420"
                r="15"
                fill="${Game.arena.cpuColor==="Blue" ? "#3ba8ff" : "#ff4b4b"}"
            />

        </svg>

        <p>
            <strong>
                ${Game.arena.playerColor} Bey:
                ${Game.arena.playerSide} side
            </strong>
        </p>

        <p style="opacity:.7;">
            X-Rail is on both sides → X Exit is at the top
        </p>

    </div>

    `;
}

//=========================
// MENU
//=========================

function hookMenuButtons(){

    let buttons = document.querySelectorAll(".menu-btn[data-mode]");
    if(!document.querySelector('.menu-btn[data-mode="custom"]')){
        const host=document.querySelector("main.menu") || document.querySelector(".menu-card") || document.getElementById("app");
        if(host){
            const custom=document.createElement("button");
            custom.className="menu-btn gold";
            custom.dataset.mode="custom";
            custom.textContent="CUSTOM";
            host.appendChild(custom);
        }
        buttons=document.querySelectorAll(".menu-btn[data-mode]");
    }

    buttons.forEach(button=>{

        button.onclick=()=>{

            Game.mode = button.dataset.mode;

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
    app.innerHTML=`<div class="background"></div><main class="menu"><div class="logo"><div class="logo-icon">🎴</div><h1>CHOOSE BLADE</h1><p>${Game.mode==="custom"?"CUSTOM · ALL BLADES":Game.mode.toUpperCase()+" · BLADE POOL"}</p></div><section class="menu-card" id="bladeContainer"></section></main>`;
    const container=document.getElementById("bladeContainer"); pool.slice(safe*size,(safe+1)*size).forEach(blade=>container.appendChild(createBladeCard(blade)));
    if(total>1){
        const nav=document.createElement("div"); nav.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;";
        nav.innerHTML=`<button class="menu-btn silver" id="bladePrev" ${safe===0?"disabled":""}>←</button><span style="font-size:11px;opacity:.7;">${safe+1} / ${total}</span><button class="menu-btn silver" id="bladeNext" ${safe===total-1?"disabled":""}>→</button>`; container.appendChild(nav);
        document.getElementById("bladePrev").onclick=()=>{Game.selection.bladePage--;renderBladeDraft();}; document.getElementById("bladeNext").onclick=()=>{Game.selection.bladePage++;renderBladeDraft();};
    }
    container.appendChild(createBackButton(()=>location.reload()));
}

//=========================
// CREATE CARD
//=========================

function createBladeCard(blade){

    const card=document.createElement("div");

    card.className="blade-card";

   const ovr = blade.card.ovr;

    card.innerHTML=`

        <div style="display:flex;justify-content:space-between;align-items:center;">

            <strong>${blade.name}</strong>

            <strong>OVR ${ovr}</strong>

        </div>

        <div style="display:flex;justify-content:space-between;margin-bottom:8px;opacity:.8;font-size:.9rem;">

            <span>${blade.type}</span>

            <span>${blade.weight}g</span>

        </div>

        <hr>

<div>Attack ............. ${blade.card.attack}</div>

<div>Knockback ...... ${blade.card.knockback}</div>

<div>Defense .......... ${blade.card.defense}</div>

<div>Mobility .......... ${blade.card.mobility}</div>

<div>Balance .......... ${blade.card.balance}</div>

<div>Stamina ......... ${blade.card.stamina}</div>

<div>Burst .............. ${blade.card.burst}</div>

    `;

    card.onclick=()=>{

        chooseBlade(blade,card);

    };

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
// RATCHET BASE DATABASE
//=========================

const RATCHET_BASES = [

{
number:1,

stats:{
attack:4,
knockback:5,
defense:-2,
mobility:3,
balance:-3,
stamina:-2
}
},

{
number:3,

stats:{
attack:2,
knockback:2,
defense:1,
mobility:1,
balance:2,
stamina:1
}
},

{
number:5,

stats:{
attack:-1,
knockback:1,
defense:3,
mobility:-1,
balance:3,
stamina:3
}
},

{
number:6,

stats:{
attack:-2,
knockback:0,
defense:5,
mobility:-2,
balance:4,
stamina:4
}
},

{
number:7,

stats:{
attack:-3,
knockback:-1,
defense:6,
mobility:-3,
balance:5,
stamina:5
}
},

{
number:9,

stats:{
attack:-4,
knockback:-2,
defense:8,
mobility:-4,
balance:7,
stamina:6
}
}

];
//=========================
// BUILD ALL RATCHETS
//=========================

/* EXPANDED ROSTER + CUSTOM MODE PRESERVED */
const HEIGHTS=[60,70,80];

const RATCHETS=[];

RATCHET_BASES.forEach(base=>{

    HEIGHTS.forEach(height=>{

        const modifier={

            attack:0,
            knockback:0,
            defense:0,
            mobility:0,
            balance:0,
            stamina:0

        };

        if(height===60){

            modifier.attack+=2;
            modifier.mobility+=2;
            modifier.stamina-=2;

        }

        if(height===70){

            modifier.balance+=1;

        }

        if(height===80){

            modifier.defense-=4;
            modifier.balance-=3;
            modifier.stamina+=2;
            modifier.mobility-=2;

        }

        RATCHETS.push({

            name:`${base.number}-${height}`,

            number:base.number,

            height,

            stats:{

                attack:base.stats.attack+modifier.attack,

                knockback:base.stats.knockback+modifier.knockback,

                defense:base.stats.defense+modifier.defense,

                mobility:base.stats.mobility+modifier.mobility,

                balance:base.stats.balance+modifier.balance,

                stamina:base.stats.stamina+modifier.stamina

            }

        });

    });

});
//=========================
// SHOW RATCHETS
//=========================
function showRatchetPlaceholder(){
    Game.screen="ratchetDraft"; const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu"><div class="logo"><div class="logo-icon">⚙</div><h1>CHOOSE RATCHET</h1><p>${Game.mode==="custom"?"CUSTOM · ALL RATCHETS":Game.player.blade.name}</p></div><section class="menu-card" id="ratchetContainer"></section></main>`;
    const container=document.getElementById("ratchetContainer");
    if(Game.mode==="custom"){
        Game.selection=Game.selection||{}; Game.selection.ratchetPool=[...RATCHETS]; Game.selection.ratchetPage=Game.selection.ratchetPage||0; renderRatchetPage(); return;
    }
    [...RATCHETS].sort(()=>Math.random()-0.5).slice(0,3).forEach(r=>{const b=document.createElement("button");b.className="menu-btn silver";b.textContent=r.name;b.onclick=()=>{Game.player.ratchet=r;showBitDraft();};container.appendChild(b);});
    container.appendChild(createBackButton(()=>showBladeDraft()));
}
function renderRatchetPage(){
    const pool=Game.selection.ratchetPool,page=Game.selection.ratchetPage,size=6,total=Math.max(1,Math.ceil(pool.length/size)),safe=Math.min(Math.max(page,0),total-1); Game.selection.ratchetPage=safe;
    const c=document.getElementById("ratchetContainer"); c.innerHTML=""; pool.slice(safe*size,(safe+1)*size).forEach(r=>{const b=document.createElement("button");b.className="menu-btn silver";b.textContent=r.name;b.onclick=()=>{Game.player.ratchet=r;showBitDraft();};c.appendChild(b);});
    const nav=document.createElement("div");nav.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;";nav.innerHTML=`<button class="menu-btn silver" id="ratchetPrev" ${safe===0?"disabled":""}>←</button><span style="font-size:11px;opacity:.7;">${safe+1} / ${total}</span><button class="menu-btn silver" id="ratchetNext" ${safe===total-1?"disabled":""}>→</button>`;c.appendChild(nav);
    document.getElementById("ratchetPrev").onclick=()=>{Game.selection.ratchetPage--;renderRatchetPage();};document.getElementById("ratchetNext").onclick=()=>{Game.selection.ratchetPage++;renderRatchetPage();};c.appendChild(createBackButton(()=>showBladeDraft()));
}

//=========================
// SHOW BITS
//=========================
function showBitDraft(){
    Game.screen="bitDraft"; const app=document.getElementById("app");
    app.innerHTML=`<div class="background"></div><main class="menu"><div class="logo"><div class="logo-icon">💿</div><h1>CHOOSE BIT</h1><p>${Game.mode==="custom"?"CUSTOM · ALL BITS":Game.player.blade.name}</p></div><section class="menu-card" id="bitContainer"></section></main>`;
    if(Game.mode==="custom"){Game.selection=Game.selection||{};Game.selection.bitPool=Object.values(BIT_ENGINE);Game.selection.bitPage=Game.selection.bitPage||0;renderBitPage();return;}
    const c=document.getElementById("bitContainer");Object.values(BIT_ENGINE).sort(()=>Math.random()-0.5).slice(0,3).forEach(bit=>{const b=document.createElement("button");b.className="menu-btn bronze";b.textContent=bit.name;b.onclick=()=>{Game.player.bit=bit;showComboCard();};c.appendChild(b);});c.appendChild(createBackButton(()=>showRatchetPlaceholder()));
}
function renderBitPage(){
    const pool=Game.selection.bitPool,page=Game.selection.bitPage,size=6,total=Math.max(1,Math.ceil(pool.length/size)),safe=Math.min(Math.max(page,0),total-1);Game.selection.bitPage=safe;
    const c=document.getElementById("bitContainer");c.innerHTML="";pool.slice(safe*size,(safe+1)*size).forEach(bit=>{const b=document.createElement("button");b.className="menu-btn bronze";b.textContent=bit.name;b.onclick=()=>{Game.player.bit=bit;showComboCard();};c.appendChild(b);});
    const nav=document.createElement("div");nav.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;";nav.innerHTML=`<button class="menu-btn silver" id="bitPrev" ${safe===0?"disabled":""}>←</button><span style="font-size:11px;opacity:.7;">${safe+1} / ${total}</span><button class="menu-btn silver" id="bitNext" ${safe===total-1?"disabled":""}>→</button>`;c.appendChild(nav);
    document.getElementById("bitPrev").onclick=()=>{Game.selection.bitPage--;renderBitPage();};document.getElementById("bitNext").onclick=()=>{Game.selection.bitPage++;renderBitPage();};c.appendChild(createBackButton(()=>showRatchetPlaceholder()));
}

function buildCombo(blade,ratchet,bit){

    return{

        blade,
        ratchet,
        bit,

        stats:null,

        ovr:0,

        meta:0,

        compatibility:0

    };

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

function getHeightModifier(height){

    return HEIGHT_ENGINE[String(height)];

}

function getBitCompatibility(bladeData,bit){
    const key=bit.name.replace(/ /g,"");
    const explicit=bladeData.compatibility?.bits?.[key];
    if(explicit!==undefined) return explicit;
    const matrix={
        Attack:{Attack:76,Balance:70,Stamina:38,Defense:28},
        Defense:{Attack:28,Balance:76,Stamina:88,Defense:92},
        Stamina:{Attack:34,Balance:80,Stamina:94,Defense:90},
        Balance:{Attack:72,Balance:90,Stamina:80,Defense:78}
    };
    let score=matrix[bladeData.type]?.[bit.type] ?? 50;
    if(bit.name==="Point" && (bladeData.type==="Balance" || bladeData.type==="Defense")) score+=5;
    if(bit.name==="High Needle" && (bladeData.type==="Defense" || bladeData.type==="Stamina")) score+=5;
    if(bit.name==="Quake" && bladeData.type==="Attack") score+=7;
    return Math.max(0,Math.min(100,score));
}

function getHeightCompatibility(bladeData,height){

    return bladeData.compatibility.heights[
        String(height)
    ] ?? 50;

}

function getCompatibilityScore(blade,ratchet,bit){

    const bladeData=getBladeEngine(blade);

    if(!bladeData){

        return 50;

    }

    const heightScore=getHeightCompatibility(
        bladeData,
        ratchet.height
    );

    const bitScore=getBitCompatibility(
        bladeData,
        bit
    );

    return Math.round(

        (heightScore+bitScore)/2

    );

}

//=========================
// ENGINE 2.0 HELPERS
//=========================

function scoreHeight(bladeData,height){

    return bladeData.compatibility.heights[String(height)] ?? 50;

}

function scoreBit(bladeData,bitName){

    return bladeData.compatibility.bits[
        bitName.replace(/ /g,"")
    ] ?? 50;

}

function average(a,b){

    return Math.round((a+b)/2);

}

//=========================
// STAT ENGINE
//=========================

function clamp(value){

    return Math.max(60,Math.min(99,value));

}

//=========================
// BATTLE VALUE / LAUNCH QUALITY HELPERS
//=========================

function clampBattleValue(value,min=0,max=100){
    return Math.max(min,Math.min(max,value));
}

function calculateLaunchQuality(side,angle,technique){
    const s=Game[side];
    if(!s?.blade || !s?.ratchet || !s?.bit) return "Okay";

    const combo=calculateComboStats(s.blade,s.ratchet,s.bit);
    const personality=s.blade.personality||{
        aggression:50,control:50,consistency:50,risk:50
    };

    const angleBonus={
        "Flat":0,
        "Slight Tilt":4,
        "Hard Tilt":-3
    }[angle] ?? 0;

    const techniqueBonus={
        "Center":3,
        "X-Rail":0,
        "Direct Clash":-2,
        "Drop Launch":1,
        "Wide Circle":0
    }[technique] ?? 0;

    const score=clampBattleValue(
        (combo.stats.balance||70)*0.28 +
        (combo.stats.mobility||70)*0.16 +
        (combo.stats.stamina||70)*0.12 +
        (personality.consistency||50)*0.34 +
        (personality.control||50)*0.10 +
        angleBonus +
        techniqueBonus +
        (Math.random()*12-6),
        0,100
    );

    if(score>=92) return "Perfect";
    if(score>=82) return "Good";
    if(score>=68) return "Okay";
    if(score>=55) return "Bad";
    return "Horrible";
}


//=========================
// REAL COMBO SYNERGY
//=========================

function getComboSynergy(
    blade,
    ratchet,
    bit
){

    const synergy={

        attack:0,
        knockback:0,
        defense:0,
        mobility:0,
        balance:0,
        stamina:0,
        burst:0

    };


    const bladeType=
        blade.type;

    const bitName=
        bit.name;


    //=========================
    // FLAT
    //=========================

    if(bitName==="Flat"){

        synergy.attack+=6;
        synergy.knockback+=4;
        synergy.mobility+=8;

        if(bladeType==="Attack"){

            synergy.attack+=4;
            synergy.knockback+=3;
            synergy.stamina-=4;
            synergy.balance-=3;

        }

        else if(bladeType==="Defense"){

            synergy.stamina-=12;
            synergy.defense-=9;
            synergy.balance-=8;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina-=14;
            synergy.balance-=9;
            synergy.defense-=6;

        }

        else{

            synergy.stamina-=9;
            synergy.balance-=5;

        }

    }


    //=========================
    // LOW FLAT
    //=========================

    else if(bitName==="Low Flat"){

        synergy.attack+=7;
        synergy.knockback+=5;
        synergy.mobility+=9;
        synergy.burst+=3;

        if(bladeType==="Attack"){

            synergy.attack+=4;
            synergy.knockback+=4;
            synergy.balance+=2;
            synergy.stamina-=3;

        }

        else if(bladeType==="Defense"){

            synergy.stamina-=14;
            synergy.defense-=10;
            synergy.balance-=8;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina-=15;
            synergy.balance-=10;
            synergy.defense-=7;

        }

        else{

            synergy.stamina-=10;
            synergy.balance-=6;

        }

    }


    //=========================
    // RUSH
    //=========================

    else if(bitName==="Rush"){

        synergy.attack+=5;
        synergy.knockback+=1;
        synergy.mobility+=8;
        synergy.stamina+=3;
        synergy.burst+=4;

        if(bladeType==="Attack"){

            synergy.attack+=5;
            synergy.knockback+=3;
            synergy.stamina-=4;
            synergy.balance-=3;

        }

        else if(bladeType==="Defense"){

            synergy.stamina-=13;
            synergy.defense-=9;
            synergy.balance-=7;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina-=12;
            synergy.balance-=8;
            synergy.defense-=6;

        }

        else{

            synergy.stamina-=8;
            synergy.balance-=5;

        }

    }


    //=========================
    // LOW RUSH
    //=========================

    else if(bitName==="Low Rush"){

        synergy.attack+=7;
        synergy.knockback+=3;
        synergy.mobility+=10;
        synergy.stamina+=4;
        synergy.burst+=5;

        if(bladeType==="Attack"){

            synergy.attack+=5;
            synergy.knockback+=4;
            synergy.balance+=2;
            synergy.stamina-=3;

        }

        else if(bladeType==="Defense"){

            synergy.stamina-=14;
            synergy.defense-=10;
            synergy.balance-=8;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina-=13;
            synergy.balance-=9;
            synergy.defense-=7;

        }

        else{

            synergy.stamina-=9;
            synergy.balance-=6;

        }

    }


    //=========================
    // KICK
    //=========================

    else if(bitName==="Kick"){

        synergy.attack+=5;
        synergy.knockback+=4;
        synergy.mobility+=5;

        if(bladeType==="Attack"){

            synergy.attack+=3;
            synergy.knockback+=3;
            synergy.balance-=2;

        }

        else if(bladeType==="Defense"){

            synergy.stamina-=6;
            synergy.defense-=4;
            synergy.balance-=3;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina-=8;
            synergy.balance-=5;

        }

        else{

            synergy.attack+=2;
            synergy.balance-=2;

        }

    }


    //=========================
    // LEVEL
    //=========================

    else if(bitName==="Level"){

        synergy.attack+=4;
        synergy.mobility+=4;
        synergy.balance+=4;
        synergy.stamina+=5;

        if(bladeType==="Attack"){

            synergy.attack+=4;
            synergy.stamina+=4;
            synergy.balance+=3;

        }

        else if(bladeType==="Defense"){

            synergy.stamina+=2;
            synergy.defense-=2;

        }

        else if(bladeType==="Stamina"){

            synergy.attack+=3;
            synergy.stamina+=2;
            synergy.balance+=2;

        }

        else{

            synergy.attack+=3;
            synergy.stamina+=3;
            synergy.balance+=3;

        }

    }


    //=========================
    // BALL
    //=========================

    else if(bitName==="Ball"){

        synergy.stamina+=10;
        synergy.balance+=5;
        synergy.mobility-=4;

        if(bladeType==="Attack"){

            synergy.stamina+=5;
            synergy.attack-=7;
            synergy.knockback-=6;
            synergy.balance-=5;

        }

        else if(bladeType==="Defense"){

            synergy.stamina+=6;
            synergy.defense+=2;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina+=7;
            synergy.balance+=3;

        }

        else{

            synergy.stamina+=5;
            synergy.balance+=2;

        }

    }


    //=========================
    // ORB
    //=========================

    else if(bitName==="Orb"){

        synergy.stamina+=10;
        synergy.defense+=3;
        synergy.balance+=2;
        synergy.mobility-=3;

        if(bladeType==="Attack"){

            synergy.stamina+=5;
            synergy.attack-=7;
            synergy.knockback-=6;
            synergy.balance-=7;

        }

        else if(bladeType==="Defense"){

            synergy.stamina+=5;
            synergy.defense+=3;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina+=7;
            synergy.balance+=2;

        }

        else{

            synergy.stamina+=5;
            synergy.balance-=1;

        }

    }


    //=========================
    // NEEDLE
    //=========================

    else if(bitName==="Needle"){

        synergy.stamina+=8;
        synergy.mobility-=7;

        if(bladeType==="Attack"){

            synergy.stamina+=5;
            synergy.attack-=6;
            synergy.knockback-=5;
            synergy.defense-=8;
            synergy.balance-=12;

        }

        else if(bladeType==="Defense"){

            synergy.stamina+=4;
            synergy.defense-=3;
            synergy.balance-=5;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina+=5;
            synergy.defense-=2;
            synergy.balance-=4;

        }

        else{

            synergy.stamina+=4;
            synergy.defense-=4;
            synergy.balance-=6;

        }

    }


    //=========================
    // HEXA
    //=========================

    else if(bitName==="Hexa"){

        synergy.defense+=8;
        synergy.balance+=8;
        synergy.mobility-=4;

        if(bladeType==="Attack"){

            synergy.attack-=4;
            synergy.knockback-=4;
            synergy.defense+=2;
            synergy.balance+=3;
            synergy.stamina-=3;

        }

        else if(bladeType==="Defense"){

            synergy.defense+=5;
            synergy.balance+=4;
            synergy.stamina+=2;

        }

        else if(bladeType==="Stamina"){

            synergy.defense+=4;
            synergy.balance+=4;
            synergy.stamina-=2;

        }

        else{

            synergy.defense+=4;
            synergy.balance+=4;

        }

    }


    //=========================
    // WEDGE
    //=========================

    else if(bitName==="Wedge"){

        synergy.defense+=5;
        synergy.balance+=7;
        synergy.mobility-=5;

        if(bladeType==="Attack"){

            synergy.attack-=5;
            synergy.knockback-=5;
            synergy.stamina+=2;
            synergy.balance-=2;

        }

        else if(bladeType==="Defense"){

            synergy.defense+=4;
            synergy.balance+=3;
            synergy.stamina+=2;

        }

        else if(bladeType==="Stamina"){

            synergy.stamina+=2;
            synergy.balance+=3;

        }

        else{

            synergy.balance+=3;
            synergy.defense+=2;

        }

    }


    //=========================
    // ELEVATE
    //=========================

    else if(bitName==="Elevate"){

        synergy.attack+=5;
        synergy.mobility+=6;
        synergy.stamina+=5;
        synergy.burst-=8;

        if(bladeType==="Attack"){

            synergy.attack+=4;
            synergy.knockback+=3;
            synergy.stamina+=3;
            synergy.balance-=3;

        }

        else if(bladeType==="Defense"){

            synergy.attack+=2;
            synergy.mobility+=3;
            synergy.stamina+=3;
            synergy.defense-=3;

        }

        else if(bladeType==="Stamina"){

            synergy.attack+=3;
            synergy.stamina+=5;
            synergy.balance+=2;

        }

        else{

            synergy.attack+=3;
            synergy.stamina+=3;
            synergy.balance+=2;

        }

    }


    //=========================
    // NEW BIT BEHAVIOR
    //=========================

    if(bitName==="Point") {
        synergy.balance+=6;
        synergy.stamina+=3;
        synergy.mobility+=1;
        if(bladeType==="Attack") { synergy.attack+=2; synergy.knockback+=1; }
        if(bladeType==="Defense") { synergy.defense+=3; synergy.balance+=2; }
        if(bladeType==="Stamina") { synergy.stamina+=3; synergy.balance+=2; }
    }

    if(bitName==="High Needle") {
        synergy.defense+=7;
        synergy.stamina+=7;
        synergy.mobility-=4;
        synergy.balance+=3;
        if(bladeType==="Attack") { synergy.attack-=7; synergy.knockback-=6; synergy.balance-=6; }
        if(bladeType==="Defense") { synergy.defense+=2; }
        if(bladeType==="Stamina") { synergy.stamina+=3; synergy.balance-=2; }
    }

    if(bitName==="Quake") {
        synergy.attack+=7;
        synergy.knockback+=6;
        synergy.mobility+=8;
        synergy.stamina-=8;
        synergy.balance-=7;
        if(bladeType==="Attack") synergy.attack+=3;
        if(bladeType==="Defense") { synergy.defense-=8; synergy.balance-=8; }
        if(bladeType==="Stamina") { synergy.stamina-=10; synergy.balance-=8; }
    }

    // Tall 80 setups expose the ratchet and raise the center of mass.
    // Needle can preserve spin, but on an 80-height defense combo it cannot
    // erase the positional/stability penalty.
    if(ratchet.height===80){
        synergy.defense-=4;
        synergy.balance-=4;
        if(bitName==="Needle" || bitName==="High Needle") synergy.defense-=5;
    }

    //=========================
    // HEIGHT INTERACTION
    //=========================

    if(
        ratchet.height===60
    ){

        if(
            bitName==="Low Flat" ||
            bitName==="Low Rush"
        ){

            synergy.attack+=3;
            synergy.knockback+=2;
            synergy.balance+=2;

        }

        else if(
            bitName==="Ball" ||
            bitName==="Orb" ||
            bitName==="Wedge"
        ){

            synergy.balance+=2;
            synergy.stamina+=2;

        }

    }


    //=========================
    // CLAMP SYNERGY
    //=========================

    Object.keys(synergy).forEach(key=>{

        synergy[key]=
            Math.max(
                -18,
                Math.min(
                    18,
                    synergy[key]
                )
            );

    });


    return synergy;

}

function calculateComboStats(blade, ratchet, bit){

    const bladeData=getBladeEngine(blade);

    if(!bladeData){

        console.error("Blade not found.");

        return null;

    }

        const stats = {

    attack: bladeData.card.attack,
    knockback: bladeData.card.knockback,
    defense: bladeData.card.defense,
    mobility: bladeData.card.mobility,
    balance: bladeData.card.balance,
    stamina: bladeData.card.stamina,
    burst: bladeData.card.burst

};

    const ratchetData=RATCHET_ENGINE[
        String(ratchet.number)
    ];

    const heightData=getHeightModifier(
        ratchet.height
    );

    // Ratchet influence

    stats.attack+=Math.round(
        (ratchetData.attackBias-50)/10
    );

    stats.defense+=Math.round(
        (ratchetData.defenseBias-50)/10
    );

    stats.stamina+=Math.round(
        (ratchetData.staminaBias-50)/10
    );

    stats.mobility+=Math.round(
        (ratchetData.mobilityBias-50)/10
    );

    stats.balance+=Math.round(
        (ratchetData.stability-50)/12
    );

    stats.burst+=Math.round(
        (ratchetData.burstResistance-50)/12
    );

    // Height influence

    stats.attack+=heightData.attack;
    stats.knockback+=heightData.knockback;
    stats.defense+=heightData.defense;
    stats.mobility+=heightData.mobility;
    stats.balance+=heightData.balance;
    stats.stamina+=heightData.stamina;
    stats.burst+=heightData.burst;

    // Bit influence (Engine 2.0)

stats.attack += Math.round((bit.card.attack - 70) / 10);
stats.knockback += Math.round((bit.card.knockback - 70) / 10);
stats.defense += Math.round((bit.card.defense - 70) / 10);
stats.mobility += Math.round((bit.card.mobility - 70) / 10);
stats.balance += Math.round((bit.card.balance - 70) / 10);
stats.stamina += Math.round((bit.card.stamina - 70) / 10);
stats.burst += Math.round((bit.card.burst - 70) / 10);
 
    //=========================
// COMBO SYNERGY
//=========================

const compatibility=
    getCompatibilityScore(
        blade,
        ratchet,
        bit
    );


const synergy=
    getComboSynergy(
        blade,
        ratchet,
        bit
    );


Object.keys(synergy).forEach(key=>{

    if(
        stats[key]!==undefined
    ){

        stats[key]+=
            synergy[key];

    }

});

    Object.keys(stats).forEach(key=>{
        stats[key]=clamp(stats[key]);
    });

   const baseOVR = clamp(bladeData.card.ovr);

const compatibilityBonus = Math.round(
    (compatibility - 50) / 10
);

const ovr = clamp(
    baseOVR + compatibilityBonus
);

    return{

        stats,

        compatibility,

        ovr,

        meta:clamp(Math.round((ovr+compatibility)/2))

    };

}

function createStatBar(label,value){

    return `

    <div class="stat-row">

        <div class="stat-label">

            <span>${label}</span>

            <span>${value}</span>

        </div>

        <div class="stat-bar">

            <div
                class="stat-fill"
                style="width:${value}%">
            </div>

        </div>

    </div>

    `;

}

//=========================
// COMBO CARD
//=========================

function showComboCard(){

    const combo = calculateComboStats(
    Game.player.blade,
    Game.player.ratchet,
    Game.player.bit
);

    const blade = Game.player.blade;

    const app = document.getElementById("app");

    app.innerHTML = `
    
    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">⚔</div>

            <h1>YOUR COMBO</h1>

        </div>

        <section class="menu-card">

            <div class="blade-name">

                ${blade.name}

            </div>

            <div class="blade-type">

                ${blade.type}

            </div>

            <br>

            <h2>META ${combo.meta}</h2>

          <h3>OVR ${combo.ovr}</h3>

            <hr>

            <p>⚔ Attack: ${combo.stats.attack}</p>

            <p>💥 Knockback: ${combo.stats.knockback}</p>

            <p>🛡 Defense: ${combo.stats.defense}</p>

            <p>🌀 Mobility: ${combo.stats.mobility}</p>
            
            <p>⚖ Balance: ${combo.stats.balance}</p>

            <p>🔋 Stamina: ${combo.stats.stamina}</p>

            <hr>

            <p><strong>Ratchet:</strong> ${Game.player.ratchet.name}</p>

            <p><strong>Bit:</strong> ${Game.player.bit.name}</p>

            <br>

            <button
                class="menu-btn gold"
                id="battleButton">

                START BATTLE

            </button>

        </section>

    </main>

    `;

    document
    .getElementById("battleButton")
    .onclick = () => {

        showVS();

    };
const menuCard=document.querySelector(".menu-card");

menuCard.appendChild(

    createBackButton(()=>{

        showBitDraft();

    })

);

} 

//=========================
// CPU DRAFT
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

function generateCPUCombo(){
    const playerTier=Game.player.blade?.tier;
    const blades=Game.mode==="custom"
        ? Object.values(BLADE_ENGINE)
        : Object.values(BLADE_ENGINE).filter(b=>!playerTier || b.tier===playerTier);
    const pool=blades.length?blades:Object.values(BLADE_ENGINE);
    Game.cpu.blade=pool[Math.floor(Math.random()*pool.length)];
    Game.cpu.ratchet=RATCHETS[Math.floor(Math.random()*RATCHETS.length)];
    const bits=Object.values(BIT_ENGINE);
    Game.cpu.bit=bits[Math.floor(Math.random()*bits.length)];
    Game.cpu.spin=Game.cpu.blade.spin||"Right";
    Game.cpu.launch={angle:null,technique:null,quality:null};
    syncComboStats("player");
    syncComboStats("cpu");
}

function getLaunchTechniqueText(blader){
    const technique=Game[blader]?.launch?.technique;
    const text={
        Center:"aims for the center",
        "X-Rail":"attempts an X Rail line",
        "X-Rail Dash":"attempts an X Rail line",
        "Reverse X-Dash":"attempts a reverse X Rail line",
        "Direct Clash":"aims to meet the opponent early",
        "Drop Launch":"takes a low opening line",
        "Wide Circle":"takes a wide opening line"
    };
    return text[technique]||"takes a neutral opening line";
}

function getMatchPrediction(){
    const p=Game.player.blade?.card||{};
    const c=Game.cpu.blade?.card||{};
    const ps=(p.attack||0)+(p.defense||0)+(p.stamina||0)+(p.balance||0)+(p.mobility||0);
    const cs=(c.attack||0)+(c.defense||0)+(c.stamina||0)+(c.balance||0)+(c.mobility||0);
    if(ps-cs>35) return `${Game.player.blade.name} has the stronger profile on paper.`;
    if(cs-ps>35) return `${Game.cpu.blade.name} has the stronger profile on paper.`;
    return "This matchup looks close on paper.";
}

function showVS(){
    generateCPUCombo();
    assignStadiumSides();
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
    Game.player.launch.quality=calculateLaunchQuality(
        "player",Game.player.launch.angle,Game.player.launch.technique
    );

    Game.cpu.launch=getAutomaticLaunchPlan("cpu");

    NEW_BATTLE.player=newBattleLaunchState("player");
    NEW_BATTLE.cpu=newBattleLaunchState("cpu");
    NEW_BATTLE.active=false;

    renderNewBattle();

    const card=document.querySelector("#newStadium")?.parentElement;
    if(!card) return;

    const controls=document.createElement("div");
    controls.id="launchControls";
    controls.style.cssText="margin-top:10px;";

    const angleButton=(label,value,id)=>`
      <button id="${id}" class="menu-btn ${Game.player.launch.angle===value?"gold":"silver"}"
        type="button">${label}</button>`;
    const techButton=(label,value,id)=>`
      <button id="${id}" class="menu-btn ${Game.player.launch.technique===value?"gold":"silver"}"
        type="button">${label}</button>`;

    controls.innerHTML=`
      <div style="padding:10px;background:rgba(0,0,0,.20);border-radius:9px;">
        <div style="font-size:12px;opacity:.72;margin-bottom:7px;">LAUNCH ANGLE</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;">
          ${angleButton("FLAT","Flat","launchFlat")}
          ${angleButton("SLIGHT TILT","Slight Tilt","launchSlight")}
          ${angleButton("HARD TILT","Hard Tilt","launchHard")}
        </div>

        <div style="font-size:12px;opacity:.72;margin:10px 0 7px;">LAUNCH TECHNIQUE</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:7px;">
          ${techButton("CENTER","Center","launchCenter")}
          ${techButton("X-RAIL","X-Rail","launchRail")}
          ${techButton("DIRECT CLASH","Direct Clash","launchClash")}
          ${techButton("DROP LAUNCH","Drop Launch","launchDrop")}
          ${techButton("WIDE CIRCLE","Wide Circle","launchCircle")}
        </div>

        <div id="launchInfo" style="margin-top:9px;font-size:12px;opacity:.78;text-align:center;">
          ${Game.player.launch.angle} · ${Game.player.launch.technique}
        </div>

        <div style="display:flex;gap:8px;margin-top:9px;">
          <button class="menu-btn gold" id="startBattleNow" type="button" style="flex:1;">
            LET IT RIP
          </button>
          <button class="menu-btn silver" id="backToVS" type="button" style="flex:1;">
            ← BACK
          </button>
        </div>
      </div>
    `;

    card.appendChild(controls);

    const setLaunch=(angle,technique)=>{
        Game.player.launch.angle=angle;
        Game.player.launch.technique=technique;
        Game.player.launch.quality=calculateLaunchQuality(
            "player",angle,technique
        );
        // Rebuild the preview and controls without starting physics.
        showLetItRip();
    };

    document.getElementById("launchFlat").onclick=()=>setLaunch("Flat",Game.player.launch.technique);
    document.getElementById("launchSlight").onclick=()=>setLaunch("Slight Tilt",Game.player.launch.technique);
    document.getElementById("launchHard").onclick=()=>setLaunch("Hard Tilt",Game.player.launch.technique);

    document.getElementById("launchCenter").onclick=()=>setLaunch(Game.player.launch.angle,"Center");
    document.getElementById("launchRail").onclick=()=>setLaunch(Game.player.launch.angle,"X-Rail");
    document.getElementById("launchClash").onclick=()=>setLaunch(Game.player.launch.angle,"Direct Clash");
    document.getElementById("launchDrop").onclick=()=>setLaunch(Game.player.launch.angle,"Drop Launch");
    document.getElementById("launchCircle").onclick=()=>setLaunch(Game.player.launch.angle,"Wide Circle");

    document.getElementById("startBattleNow").onclick=startNewBattle;
    document.getElementById("backToVS").onclick=showVS;
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

    // X Rail is a closed loop with a dedicated top exit trajectory.
    xRail: {
        loop: "closed",
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

function getAutomaticLaunchPlan(side){
    const combo=Game[side];
    const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);
    const type=combo.blade.type;
    const bitName=combo.bit.name;
    const personality=combo.blade.personality||{aggression:50,control:50,risk:50};

    // Launches are automatic for now. The player will get launch/decision
    // control later; this step establishes the physical opening both sides use.
    let technique="Center";
    if(type==="Attack"){
        technique=(personality.risk>=70 || ["Flat","Low Flat","Low Rush","Rush","Kick","Quake"].includes(bitName))
            ?"Direct Clash":"Wide Circle";
    }else if(type==="Defense" || type==="Stamina"){
        technique="Center";
    }else{
        technique=personality.control>=85 ? "Center" : "Wide Circle";
    }

    let angle="Flat";
    if(type==="Defense" || type==="Stamina") angle="Slight Tilt";
    if(type==="Attack" && personality.aggression>=90) angle="Flat";

    const qualityBase=
        (stats.balance||70)*0.25 +
        (stats.mobility||70)*0.20 +
        (stats.stamina||70)*0.15 +
        (personality.consistency||50)*0.40;
    const qualityRoll=qualityBase + (Math.random()*14-7);
    const quality=qualityRoll>=92?"Perfect":
        qualityRoll>=82?"Good":
        qualityRoll>=68?"Okay":
        qualityRoll>=55?"Bad":"Horrible";

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
                    calculateLaunchQuality(
                        "player",
                        Game.player.launch.angle||"Flat",
                        Game.player.launch.technique
                    )
              }
            : getAutomaticLaunchPlan(side);

    const startX=side==="player"?-0.70:0.70;
    const startY=0;
    const direction=side==="player"?1:-1;

    const qualityFactor={
        Horrible:0.72,Bad:0.86,Okay:1.00,Good:1.08,Perfect:1.15
    }[plan.quality]||1;

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
        "Direct Clash":1.10,
        "Wide Circle":0.84,
        "X-Rail":1.00,
        "Drop Launch":0.90
    }[plan.technique]||1;

    const launchSpeed=
        (0.019+(stats.mobility||70)*0.000045)*
        qualityFactor*techniqueSpeed*tilt.speed;

    const tiltSign=side==="player"?-1:1;
    let vx=direction*launchSpeed;
    let vy=tiltSign*tilt.lateral*launchSpeed;

    if(plan.technique==="Wide Circle") vy+=tiltSign*0.012;
    if(plan.technique==="Drop Launch") vy+=tiltSign*0.016;
    if(plan.technique==="X-Rail") vy+=tiltSign*0.008;

    return {
        side,x:startX,y:startY,vx,vy,rpm:1,
        stability:newBattleClamp(
            ((stats.balance||70)/100)-tilt.stability+
            (plan.quality==="Perfect"?0.035:plan.quality==="Good"?0.018:0),
            0.40,1
        ),
        radius:0.065,
        hitFlash:0,
        stats,blade:combo.blade,bit:combo.bit,
        launchPlan:plan,
        launchRpmLossMultiplier:tilt.rpm,
        launchTilt:plan.angle,
        launchComplete:false,
        // Right spin = counter-clockwise; left spin = clockwise.
        spinDirection:(combo.blade?.spin==="Left" ? 1 : -1),
        railEngaged:false,railProgress:0,railDistance:0,
        railSpeed:0,railRideTime:0,railTravelDistance:0,
        railLoops:0,railContactPoint:null,railExitCooldown:0
    };
}
function startNewBattle(){
    // Hard guard: never enter battle without valid launch state.
    if(!NEW_BATTLE.player || !NEW_BATTLE.cpu){
        console.error("Start battle blocked: launch state was not initialized.");
        showLetItRip();
        return;
    }

    cancelAnimationFrame(NEW_BATTLE.raf);

    Game.screen="battle";
    Game.battle.engineMode="new_physics";
    Game.battle.phase="Launch";
    Game.battle.finished=false;
    Game.battle.matchStarted=true;
    Game.battle.matchFinished=false;
    Game.battle.exchange=0;

    // Rebuild once from the selected launch choices. This is the ONLY place
    // that starts physical battle state.
    NEW_BATTLE.player=newBattleLaunchState("player");
    NEW_BATTLE.cpu=newBattleLaunchState("cpu");

    Game.player.launch=Game.player.launch||{};
    Game.player.launch.angle=NEW_BATTLE.player.launchPlan.angle;
    Game.player.launch.technique=NEW_BATTLE.player.launchPlan.technique;
    Game.player.launch.quality=NEW_BATTLE.player.launchPlan.quality;

    Game.cpu.launch=Game.cpu.launch||{};
    Game.cpu.launch.angle=NEW_BATTLE.cpu.launchPlan.angle;
    Game.cpu.launch.technique=NEW_BATTLE.cpu.launchPlan.technique;
    Game.cpu.launch.quality=NEW_BATTLE.cpu.launchPlan.quality;

    NEW_BATTLE.elapsed=0;
    NEW_BATTLE.active=true;
    NEW_BATTLE.last=performance.now();

    renderNewBattle();
    NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);
}
function renderNewBattle(){
    const app=document.getElementById("app");
    if(!app) return;

    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;

    // The game view is deliberately a top-down BX-10-style stadium:
    // square/octagonal outer body, circular battle bowl, closed X Rail,
    // top-center X Rail exit, and three lower finish openings.
    const px=50+p.x*39;
    const py=46+p.y*39;
    const cx=50+c.x*39;
    const cy=46+c.y*39;

    app.innerHTML=`
      <div class="background"></div>
      <main class="menu" style="max-width:920px;">
        <section class="menu-card" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>LIVE BATTLE</strong>
            <span style="opacity:.65;font-size:12px;">CONTINUOUS SIMULATION</span>
          </div>

          <div id="newStadium" style="
            position:relative;width:min(88vw,760px);aspect-ratio:1/1;
            margin:14px auto;background:#c9cdd0;
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

              <!-- X RAIL: continuous green track around the bowl.
                   The top section is shaped into the X exit rather than
                   leaving awkward open/white gaps. -->
              <path d="
                M 14.7 44.5
                C 14.0 31.0 20.8 18.9 32.8 13.3
                C 37.2 11.2 41.6 11.8 44.8 14.2
                L 50 22.5
                L 55.2 14.2
                C 58.4 11.8 62.8 11.2 67.2 13.3
                C 79.2 18.9 86.0 31.0 85.3 44.5
                C 84.4 63.0 70.4 78.8 50.0 79.7
                C 29.6 78.8 15.6 63.0 14.7 44.5 Z"
                fill="none" stroke="#18a84a" stroke-width="2.1"
                stroke-linecap="round" stroke-linejoin="round"/>

              <!-- FILLED X EXIT: solid green exit body removes the
                   distracting white openings between the rail edges. -->
              <path d="
                M 44.8 14.2
                L 50 22.5
                L 55.2 14.2
                L 52.3 24.5
                L 50 28.0
                L 47.7 24.5
                Z"
                fill="#18a84a"
                stroke="#18a84a"
                stroke-width="1.2"
                stroke-linejoin="round"/>

              <!-- X EXIT LANE: the actual path back into the bowl. -->
              <path d="M 47.7 24.5 L 50 28.0 L 52.3 24.5"
                    fill="none"
                    stroke="#18a84a"
                    stroke-width="2.1"
                    stroke-linecap="round"
                    stroke-linejoin="round"/>

              <!-- Beys -->
              <circle id="newPlayerBey" cx="${px}" cy="${py}" r="2.35"
                      fill="#d8a82c" stroke="#ffffff" stroke-width=".65"/>
              <circle id="newCpuBey" cx="${cx}" cy="${cy}" r="2.35"
                      fill="#aeb7c0" stroke="#ffffff" stroke-width=".65"/>
            </svg>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
            <div style="padding:9px;background:rgba(255,255,255,.05);border-radius:8px;">
              <strong>${p.blade.name}</strong><br>
              RPM <span id="newPlayerRPM">${Math.round(p.rpm*100)}</span>%
              · Stability <span id="newPlayerStability">${Math.round(p.stability*100)}</span>%
            </div>
            <div style="padding:9px;background:rgba(255,255,255,.05);border-radius:8px;text-align:right;">
              <strong>${c.blade.name}</strong><br>
              RPM <span id="newCpuRPM">${Math.round(c.rpm*100)}</span>%
              · Stability <span id="newCpuStability">${Math.round(c.stability*100)}</span>%
            </div>
          </div>

          <div id="newCommentary" style="margin-top:8px;padding:10px;background:rgba(0,0,0,.22);border-radius:8px;font-size:13px;">
            ${p.blade.name} ${p.launchPlan.technique==="Direct Clash"?"comes out aggressively.":"settles into its opening line."}
            ${c.blade.name} ${c.launchPlan.technique==="Direct Clash"?"answers with an aggressive launch.":"takes its opening position."}
          </div>
        </section>
      </main>`;
}

function finishNewBattle(winnerSide){
    if(!NEW_BATTLE.active) return;

    NEW_BATTLE.active=false;
    if(NEW_BATTLE.raf) cancelAnimationFrame(NEW_BATTLE.raf);

    Game.battle.finished=true;
    Game.battle.matchFinished=true;
    Game.battle.winner=winnerSide;

    const winner=winnerSide==="player"
        ? NEW_BATTLE.player
        : NEW_BATTLE.cpu;

    const app=document.getElementById("app");
    if(app){
        app.innerHTML=`
          <div class="background"></div>
          <main class="menu">
            <div class="logo">
              <div class="logo-icon">⚔</div>
              <h1>WINNER</h1>
              <p>${winner.blade.name}</p>
            </div>
            <section class="menu-card" style="text-align:center;">
              <h2 style="margin:8px 0;">${winner.blade.name}</h2>
              <p>SPIN FINISH</p>
              <p style="opacity:.65;font-size:12px;">Returning to main menu...</p>
            </section>
          </main>`;
    }

    // Give the result screen a moment to be read, then return to the
    // existing main menu. Reload is intentional because the main menu is
    // owned by index.html and we are not changing index/style.
    setTimeout(()=>location.reload(),1800);
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
        newPhysicsCollision(dt);

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
            pe.setAttribute("r",p.hitFlash>0?2.55:2.35);
        }
        if(ce){
            ce.setAttribute("r",c.hitFlash>0?2.55:2.35);
        }
        p.hitFlash=Math.max(0,(p.hitFlash||0)-dt);
        c.hitFlash=Math.max(0,(c.hitFlash||0)-dt);

        for(const [id,v] of [
            ["newPlayerRPM",p.rpm],
            ["newCpuRPM",c.rpm],
            ["newPlayerStability",p.stability],
            ["newCpuStability",c.stability]
        ]){
            const el=document.getElementById(id);
            if(el) el.textContent=Math.round(v*100);
        }

        const commentary=document.getElementById("newCommentary");
        if(commentary){
            const distance=Math.hypot(p.x-c.x,p.y-c.y);
            if(p.railEngaged || c.railEngaged){
                const rider=p.railEngaged?p:c;
                commentary.textContent=
                    `${rider.blade.name} is riding the X Rail and building speed.`;
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

    // Physical path matching the visible continuous green X Rail.
    // Point order is clockwise; right-spin uses the reverse direction (CCW).
    const points=[
        [-0.905,-0.01],[-0.75,-0.50],[-0.44,-0.79],[-0.133,-0.79],
        [0.00,-0.603], // top-center X Exit transition point
        [0.133,-0.79],[0.44,-0.79],[0.75,-0.50],[0.905,-0.01],
        [0.82,0.48],[0.50,0.78],[0.00,0.865],[-0.50,0.78],[-0.82,0.48]
    ].map(([x,y])=>({x,y}));

    const segments=[];
    let total=0;
    for(let i=0;i<points.length;i++){
        const a=points[i], b=points[(i+1)%points.length];
        const length=Math.hypot(b.x-a.x,b.y-a.y);
        segments.push({a,b,length,start:total});
        total+=length;
    }

    NEW_BATTLE.railGeometry={
        points,segments,total,
        exitDistance:segments[4].start
    };
    return NEW_BATTLE.railGeometry;
}

function newXRailPointAtDistance(distance){
    const g=getNewXRailGeometry();
    const d=((distance%g.total)+g.total)%g.total;
    for(const seg of g.segments){
        if(d<=seg.start+seg.length || seg===g.segments[g.segments.length-1]){
            const t=seg.length ? newBattleClamp((d-seg.start)/seg.length,0,1) : 0;
            const tx=(seg.b.x-seg.a.x)/(seg.length||1);
            const ty=(seg.b.y-seg.a.y)/(seg.length||1);
            return {x:seg.a.x+(seg.b.x-seg.a.x)*t,y:seg.a.y+(seg.b.y-seg.a.y)*t,tx,ty,distance:d};
        }
    }
    return {x:0,y:0,tx:1,ty:0,distance:0};
}

function newXRailNearest(x,y){
    const g=getNewXRailGeometry();
    let best=null;
    for(const seg of g.segments){
        const abx=seg.b.x-seg.a.x, aby=seg.b.y-seg.a.y;
        const ab2=abx*abx+aby*aby || 1;
        const t=newBattleClamp(((x-seg.a.x)*abx+(y-seg.a.y)*aby)/ab2,0,1);
        const px=seg.a.x+abx*t, py=seg.a.y+aby*t;
        const dx=x-px, dy=y-py, dist2=dx*dx+dy*dy;
        if(!best || dist2<best.dist2){
            const len=Math.sqrt(ab2);
            best={x:px,y:py,dist2,distance:seg.start+len*t,tx:abx/len,ty:aby/len};
        }
    }
    return best;
}

function newXRailCrossedExit(previousDistance,nextDistance,direction){
    const g=getNewXRailGeometry();
    const exit=g.exitDistance;
    const eps=0.018;
    if(direction>0){
        const e=previousDistance<=exit ? exit : exit+g.total;
        return previousDistance<=e+eps && nextDistance>=e-eps;
    }
    const e=previousDistance>=exit ? exit : exit-g.total;
    return previousDistance>=e-eps && nextDistance<=e+eps;
}

function newXRailEngagementChance(s,approachSpeed,alignment,approachRatio){
    const bitPhysics=BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
    const affinity=(bitPhysics.xRailAffinity||0)/100;
    const movement=(bitPhysics.movement||60)/100;
    const isAttack=movement>=0.80;

    const speedFactor=newBattleClamp((approachSpeed-0.012)/0.038,0,1);
    const alignmentFactor=newBattleClamp((alignment-0.22)/0.55,0,1);
    const impactAngleFactor=newBattleClamp((approachRatio-0.28)/0.55,0,1);

    // Realistic X-Rail access is selective:
    // Attack/Rush bits get the strongest chance, while stamina/defense bits
    // can still catch it occasionally but should not repeatedly farm it.
    const attackBonus=isAttack ? 0.20 : 0;
    const base=isAttack ? 0.008 : 0.002;

    return newBattleClamp(
        base +
        affinity*0.18 +
        movement*0.08 +
        speedFactor*0.34 +
        alignmentFactor*0.20 +
        impactAngleFactor*0.24 +
        attackBonus,
        0.002,0.78
    );
}

function tryNewXRailEngagement(s){
    if(s.railEngaged || s.railExitCooldown>0) return false;

    const nearest=newXRailNearest(s.x,s.y);
    if(!nearest) return false;

    const distance=Math.sqrt(nearest.dist2);
    const contactRadius=0.030 + s.radius*0.22;
    if(distance>contactRadius) return false;

    const nx=s.x-nearest.x, ny=s.y-nearest.y;
    const normalLength=Math.hypot(nx,ny) || 1;
    const normalX=nx/normalLength, normalY=ny/normalLength;

    const velocityMag=Math.hypot(s.vx,s.vy)||0.001;

    // The Bey must be moving INTO the rail with meaningful radial speed.
    // Merely traveling parallel to it no longer creates a lock.
    const inwardVelocity=s.vx*normalX+s.vy*normalY;
    const approachSpeed=Math.max(0,-inwardVelocity);
    const approachRatio=approachSpeed/velocityMag;

    if(approachSpeed<0.012 || approachRatio<0.28) return false;

    const railDirection=s.spinDirection||-1;
    const desiredTx=nearest.tx*railDirection;
    const desiredTy=nearest.ty*railDirection;

    const tangentVelocity=s.vx*desiredTx+s.vy*desiredTy;
    const alignment=tangentVelocity/velocityMag;

    // The Bey has to be entering at a usable tangent angle as well.
    if(alignment<0.22) return false;

    const chance=newXRailEngagementChance(
        s,
        approachSpeed,
        alignment,
        approachRatio
    );

    if(Math.random()>chance) return false;

    const incomingSpeed=velocityMag;
    const bitPhysics=BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
    const isAttack=(bitPhysics.movement||60)>=80;

    s.railEngaged=true;
    s.railContactPoint={x:nearest.x,y:nearest.y};
    s.railDistance=nearest.distance;
    s.railProgress=nearest.distance/getNewXRailGeometry().total;
    s.railSpeed=newBattleClamp(
        incomingSpeed*(isAttack?1.08:1.02),
        0.024,
        isAttack?0.070:0.055
    );
    s.railRideTime=0;
    s.railTravelDistance=0;
    s.railLoops=0;

    s.x=nearest.x;
    s.y=nearest.y;

    // Remove the inward component that caused the impact. Only the usable
    // tangent component is converted into rail speed.
    const normalVelocity=s.vx*normalX+s.vy*normalY;
    if(normalVelocity<0){
        s.vx-=normalVelocity*normalX;
        s.vy-=normalVelocity*normalY;
    }

    // The impact itself costs energy immediately.
    s.rpm=newBattleClamp(
        s.rpm-(isAttack?0.035:0.045),
        0,1
    );
    s.stability=newBattleClamp(
        s.stability-(isAttack?0.015:0.022),
        0,1
    );

    return true;
}


function newXRailExit(s){
    const exit=newXRailPointAtDistance(getNewXRailGeometry().exitDistance);
    const bitPhysics=BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
    const isAttack=(bitPhysics.movement||60)>=80;

    // X Rail creates a burst of speed, but the rail cannot preserve momentum
    // indefinitely. The exit is intentionally damped.
    const exitSpeed=newBattleClamp(
        s.railSpeed*(isAttack?1.08:1.03),
        0.028,
        isAttack?0.074:0.060
    );

    s.railEngaged=false;
    s.railExitCooldown=1.35;
    s.railRideTime=0;
    s.railProgress=0;
    s.railDistance=0;
    s.railTravelDistance=0;
    s.railLoops=0;
    s.railContactPoint=null;

    s.x=exit.x;
    s.y=exit.y+0.035;

    // The physical X Exit launches inward/downward. Preserve only a small
    // amount of tangential carry so the exit isn't a scripted straight line.
    const tangentX=exit.tx*(s.spinDirection||-1);
    const tangentY=exit.ty*(s.spinDirection||-1);
    const tangentCarry=isAttack?0.14:0.08;

    s.vx=tangentX*exitSpeed*tangentCarry;
    s.vy=exitSpeed+tangentY*exitSpeed*tangentCarry;

    // Large RPM cost for the rail ride + exit. Attack gets more speed, but
    // pays for it with energy; non-attack types pay more relative to their
    // lower rail efficiency.
    s.rpm=newBattleClamp(
        s.rpm-(isAttack?0.16:0.22),
        0,1
    );
    s.stability=newBattleClamp(
        s.stability-(isAttack?0.055:0.075),
        0,1
    );

    // Kill most of the rail's accumulated momentum at the exit so the Bey
    // has to re-enter normal stadium physics instead of chaining rails.
    s.railSpeed*=0.38;
}



function updateNewXRailRide(s,dt){
    if(!s.railEngaged) return false;

    const g=getNewXRailGeometry();
    const direction=s.spinDirection||-1;
    const previousDistance=s.railDistance;
    const bitPhysics=BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
    const isAttack=(bitPhysics.movement||60)>=80;
    const affinity=(bitPhysics.xRailAffinity||0)/100;
    const movement=(bitPhysics.movement||60)/100;

    s.railRideTime+=dt;

    // Short, aggressive acceleration instead of endless rail acceleration.
    const railBoost=
        0.008+
        movement*0.006+
        affinity*0.005;

    s.railSpeed=newBattleClamp(
        s.railSpeed + railBoost*dt*60 - 0.0030*dt*60,
        0.024,
        isAttack?0.074:0.060
    );

    const travel=s.railSpeed*dt*60;
    s.railDistance+=direction*travel;
    s.railTravelDistance+=Math.abs(travel);
    s.railProgress=(
        ((s.railDistance%g.total)+g.total)%g.total
    )/g.total;

    const point=newXRailPointAtDistance(s.railDistance);
    const tangentX=point.tx*direction;
    const tangentY=point.ty*direction;

    s.x=point.x;
    s.y=point.y;
    s.vx=tangentX*s.railSpeed;
    s.vy=tangentY*s.railSpeed;

    // Rail is expensive. This is the major fix for the previous infinite
    // X-Rail behavior.
    const drainPerSecond=
        0.22+
        s.railSpeed*1.55+
        affinity*0.04;

    s.rpm=newBattleClamp(
        s.rpm-drainPerSecond*dt,
        0,1
    );

    s.stability=newBattleClamp(
        s.stability-
        (0.018+s.railSpeed*0.08)*dt,
        0,1
    );

    // Exit at the first meaningful X Exit crossing. A tiny minimum ride
    // prevents a rail touch directly beside the exit from becoming a free
    // instant dash. A hard travel limit guarantees no infinite loop.
    const crossed=newXRailCrossedExit(
        previousDistance,
        s.railDistance,
        direction
    );

    const minimumRide=0.34;
    const maximumRide=Math.min(g.total*0.98,isAttack?g.total*0.98:g.total*0.72);

    if(
        (crossed && s.railTravelDistance>=minimumRide) ||
        s.railTravelDistance>=maximumRide ||
        s.railRideTime>=2.15
    ){
        newXRailExit(s);
        return true;
    }

    return true;
}


function newPhysicsStep(s,dt){
    const stats=s.stats||{};
    const bit=BIT_PHYSICS[s.bit?.name]||BIT_PHYSICS.Point;
    const rpm=newBattleClamp(s.rpm,0,1);
    const rpmPct=rpm*100;
    const mobility=(stats.mobility||70)/100;
    const centerAffinity=(bit.centerAffinity||60)/100;
    const movement=(bit.movement||60)/100;

    if(s.railExitCooldown>0){
        s.railExitCooldown=Math.max(0,s.railExitCooldown-dt);
    }

    // Active X-Rail state completely owns movement while engaged.
    if(s.railEngaged){
        updateNewXRailRide(s,dt);
        return;
    }

    const speed=Math.hypot(s.vx,s.vy);
    const r=Math.hypot(s.x,s.y);
    const invR=r>0.0001?1/r:0;

    // Right spin = counter-clockwise.
    // At the right side of the stadium this points upward; at the left side
    // it points downward. This gives a natural circular tendency without
    // forcing the Bey onto a perfect orbit.
    const spinSign=s.spinDirection===-1 ? 1 : -1;
    let tx=r>0.0001 ? (s.y*invR)*spinSign : 0;
    let ty=r>0.0001 ? (-s.x*invR)*spinSign : 0;

    // Low RPM suppresses aggressive travel. Attack Bits retain some path,
    // while center-oriented Bits become increasingly settled.
    const lowRpm=newBattleClamp((0.50-rpm)/0.50,0,1);
    const attackMovement=Math.max(0,(movement-0.72)/0.28);
    const travelFactor=
        0.42+
        movement*0.58+
        attackMovement*(1-lowRpm)*0.32-
        lowRpm*(0.34-centerAffinity*0.18);

    // Precession is acceleration, not a fixed circular path.
    const precession=
        (0.00075+
         movement*0.0012)*
        newBattleClamp(travelFactor,0.18,1.25)*
        (0.48+rpm*0.72);

    s.vx+=tx*precession*dt*60;
    s.vy+=ty*precession*dt*60;

    // Stadium slope: the lower/center region becomes increasingly favored as
    // RPM falls. This is a gentle force, not a magnetic center snap.
    if(r>0.015){
        const centerForce=
            (0.00022+
             lowRpm*0.00070+
             centerAffinity*0.00030)*
            (0.60+rpm*0.40);

        s.vx-=s.x*centerForce*dt*60;
        s.vy-=s.y*centerForce*dt*60;
    }

    // Tilt continues to influence the movement after launch.
    const tilt=s.launchTilt;
    if(tilt==="Slight Tilt"){
        s.vx+=tx*0.00016*dt*60;
        s.vy+=ty*0.00016*dt*60;
    }else if(tilt==="Hard Tilt"){
        s.vx+=tx*0.00028*dt*60;
        s.vy+=ty*0.00028*dt*60;
    }

    // RPM-dependent damping. High-mobility Attack Bits travel more at high
    // RPM, but everybody settles naturally as spin falls.
    const baseDamp=
        0.992+
        movement*0.003+
        rpm*0.003;
    const damping=Math.pow(baseDamp,dt*60);
    s.vx*=damping;
    s.vy*=damping;

    // Mild physical noise keeps movement from becoming a perfect orbit.
    const noise=(0.00016+movement*0.00018)*(0.35+rpm*0.65);
    s.vx+=(Math.random()-0.5)*noise*dt*60;
    s.vy+=(Math.random()-0.5)*noise*dt*60;

    s.x+=s.vx*dt*60;
    s.y+=s.vy*dt*60;

    // Rail engagement must happen before the outer wall clamps the Bey.
    tryNewXRailEngagement(s);
    if(s.railEngaged) return;

    // Stadium outer wall.
    const radius=Math.hypot(s.x,s.y);
    const wall=0.93;

    if(radius>wall){
        const nx=s.x/(radius||1);
        const ny=s.y/(radius||1);

        s.x=nx*wall;
        s.y=ny*wall;

        const outward=s.vx*nx+s.vy*ny;
        if(outward>0){
            // High-speed wall contact retains some tangential motion but loses
            // energy, creating an actual impact rather than a clean slide.
            s.vx-=outward*1.72*nx;
            s.vy-=outward*1.72*ny;
            s.vx*=0.72;
            s.vy*=0.72;

            s.rpm=newBattleClamp(
                s.rpm-(0.0015+Math.abs(outward)*0.018),
                0,1
            );
            s.stability=newBattleClamp(
                s.stability-(0.002+Math.abs(outward)*0.025),
                0,1
            );
        }
    }

    // Every bit has its own friction/spin drain. This is what makes Orb/Ball/
    // Needle substantially more stationary than Flat/Rush.
    const bitDrain=bit.spinDrain||1;
    const movementDrain=
        (0.00012+
         movement*0.00028+
         speed*0.00055)*
        bitDrain;

    const tiltDrain=s.launchRpmLossMultiplier||1;
    s.rpm=newBattleClamp(
        s.rpm-movementDrain*tiltDrain*dt*60,
        0,1
    );

    // Stability recovers naturally at healthy RPM and degrades with speed,
    // tilt, impacts and low RPM.
    const recovery=(bit.recovery||60)/100;
    const stabilityRecovery=
        0.00034*recovery*rpm*dt*60;
    const stabilityLoss=
        (0.00010+
         speed*0.0014+
         lowRpm*0.00035)*
        tiltDrain*dt*60;

    s.stability=newBattleClamp(
        s.stability+stabilityRecovery-stabilityLoss,
        0,1
    );
}
function newPhysicsCollision(dt){
    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;
    if(!p||!c||p.railEngaged||c.railEngaged) return;

    const dx=c.x-p.x, dy=c.y-p.y;
    const dist=Math.hypot(dx,dy);
    const minDist=p.radius+c.radius;

    if(dist>minDist || dist<0.0001) return;

    const nx=dx/dist, ny=dy/dist;
    const tx=-ny, ty=nx;
    const rvx=c.vx-p.vx, rvy=c.vy-p.vy;
    const closing=rvx*nx+rvy*ny;

    // Only solve impacts when the Beys are actually moving into one another.
    if(closing>=0) return;

    const pBit=BIT_PHYSICS[p.bit?.name]||BIT_PHYSICS.Point;
    const cBit=BIT_PHYSICS[c.bit?.name]||BIT_PHYSICS.Point;

    const pAttack=(p.stats.attack||70)/99;
    const cAttack=(c.stats.attack||70)/99;
    const pKB=(p.stats.knockback||70)/99;
    const cKB=(c.stats.knockback||70)/99;
    const pDef=(p.stats.defense||70)/99;
    const cDef=(c.stats.defense||70)/99;

    const impactSpeed=Math.abs(closing);
    const tangentRelative=rvx*tx+rvy*ty;
    const totalRelative=Math.hypot(rvx,rvy)||0.001;
    const directness=newBattleClamp(
        impactSpeed/totalRelative,0,1
    );

    // Momentum + stats determine force. Contact angle and a small physical
    // variance make identical Beys capable of producing different hits.
    const pMomentum=impactSpeed*(0.55+pKB*0.85)*(0.70+pAttack*0.30);
    const cMomentum=impactSpeed*(0.55+cKB*0.85)*(0.70+cAttack*0.30);
    const momentumFactor=newBattleClamp(impactSpeed/0.035,0,2.4);
    const variance=0.92+Math.random()*0.16;

    const pForce=
        pMomentum*
        (0.72+directness*0.28)*
        (0.65+momentumFactor*0.42)*
        variance;

    const cForce=
        cMomentum*
        (0.72+directness*0.28)*
        (0.65+momentumFactor*0.42)*
        variance;

    const pImpulse=
        (pForce/(0.72+cDef*0.55))*
        (1.0-0.12*pDef);

    const cImpulse=
        (cForce/(0.72+pDef*0.55))*
        (1.0-0.12*cDef);

    // Even at low RPM, contact produces a visible shove.
    const lowRpmShove=
        (p.rpm<0.50||c.rpm<0.50)
            ? 0.0022+0.0025*(1-Math.min(p.rpm,c.rpm)*2)
            : 0;

    p.vx-=nx*(pImpulse+lowRpmShove);
    p.vy-=ny*(pImpulse+lowRpmShove);
    c.vx+=nx*(cImpulse+lowRpmShove);
    c.vy+=ny*(cImpulse+lowRpmShove);

    // Recoil / glancing contact changes the exit angle.
    const tangentKick=
        (0.0009+
         impactSpeed*0.010+
         Math.abs(tangentRelative)*0.0028)*
        (0.60+momentumFactor*0.22);

    p.vx+=tx*tangentKick;
    p.vy+=ty*tangentKick;
    c.vx-=tx*tangentKick;
    c.vy-=ty*tangentKick;

    // Separate the bodies so they cannot remain glued together.
    const separation=minDist-dist;
    p.x-=nx*(separation*0.54+0.002);
    p.y-=ny*(separation*0.54+0.002);
    c.x+=nx*(separation*0.54+0.002);
    c.y+=ny*(separation*0.54+0.002);

    const pDamage=
        0.0022+
        impactSpeed*0.020+
        pForce*0.010+
        Math.pow(momentumFactor,2)*0.0009;

    const cDamage=
        0.0022+
        impactSpeed*0.020+
        cForce*0.010+
        Math.pow(momentumFactor,2)*0.0009;

    // Higher attack transfers more RPM loss; defense reduces incoming damage.
    p.rpm=newBattleClamp(
        p.rpm-pDamage*(0.82+cAttack*0.22)*(1-pDef*0.24),
        0,1
    );
    c.rpm=newBattleClamp(
        c.rpm-cDamage*(0.82+pAttack*0.22)*(1-cDef*0.24),
        0,1
    );

    p.stability=newBattleClamp(
        p.stability-(0.004+impactSpeed*0.055)*(1-pDef*0.30),
        0,1
    );
    c.stability=newBattleClamp(
        c.stability-(0.004+impactSpeed*0.055)*(1-cDef*0.30),
        0,1
    );

    p.hitFlash=0.08;
    c.hitFlash=0.08;
}

// Launch angle and technique are selected on the stadium setup view.
// The selected launch state is passed directly into the physical engine.

window.addEventListener("DOMContentLoaded",()=>hookMenuButtons());
