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
    Ball:{movement:20,control:98,spinDrain:0.34,xRailAffinity:18,centerAffinity:98,recovery:94,attackBias:-7},
    Orb:{movement:17,control:99,spinDrain:0.40,xRailAffinity:25,centerAffinity:99,recovery:92,attackBias:-5},
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




// ================================================================
// CLEAN BATTLE-ENGINE RESET
// Everything above this point is menu/data/selection infrastructure.
// Everything below is ONLY the pre-battle launch UI.
// ================================================================

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
    const playerBladeName=Game.player.blade?.name;
    const playerRatchetName=Game.player.ratchet?.name;
    const playerBitName=Game.player.bit?.name;

    const blades=
        Game.mode==="custom"
            ? Object.values(BLADE_ENGINE)
            : Object.values(BLADE_ENGINE).filter(
                b=>!playerTier || b.tier===playerTier
            );

    // Never intentionally mirror the player's blade.
    let pool=blades.filter(b=>b.name!==playerBladeName);
    if(!pool.length){
        pool=Object.values(BLADE_ENGINE).filter(
            b=>b.name!==playerBladeName
        );
    }
    if(!pool.length) pool=Object.values(BLADE_ENGINE);

    Game.cpu.blade=pool[Math.floor(Math.random()*pool.length)];

    // Also avoid an exact part-for-part copy when alternatives exist.
    let ratchetPool=RATCHETS.filter(r=>r.name!==playerRatchetName);
    if(!ratchetPool.length) ratchetPool=RATCHETS;
    Game.cpu.ratchet=ratchetPool[
        Math.floor(Math.random()*ratchetPool.length)
    ];

    const bits=Object.values(BIT_ENGINE);
    let bitPool=bits.filter(b=>b.name!==playerBitName);
    if(!bitPool.length) bitPool=bits;
    Game.cpu.bit=bitPool[Math.floor(Math.random()*bitPool.length)];

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
    const app=document.getElementById("app");
    const player=Game.player.blade;
    const cpu=Game.cpu.blade;
    const pc=calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit);
    const cc=calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit);
    app.innerHTML=`
      <div class="background"></div><main class="menu"><section class="menu-card">
        <h1>ROUND ${Game.battle.round||1}</h1><hr>
        <div style="display:flex;justify-content:space-between;text-align:left;gap:20px;">
          <div><strong>${player.name}</strong><br>${Game.player.ratchet.name}<br>${Game.player.bit.name}<br><br>OVR ${pc.ovr}</div>
          <div style="text-align:right;"><strong>${cpu.name}</strong><br>${Game.cpu.ratchet.name}<br>${Game.cpu.bit.name}<br><br>OVR ${cc.ovr}</div>
        </div>
        <hr><div style="padding:12px;background:rgba(255,255,255,.06);border-radius:10px;">
          <strong>COMMENTATOR</strong><p>${getMatchPrediction()}</p>
        </div>
        <button class="menu-btn gold" id="continueToLaunch">CONTINUE</button>
        <button class="menu-btn silver" id="backToCombo">← BACK TO COMBO</button>
      </section></main>`;
    document.getElementById("continueToLaunch").onclick=startNewBattle;
    document.getElementById("backToCombo").onclick=showComboCard;
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
    cpu:null
};

// Self-contained helper for the NEW engine.
// Do not depend on any removed legacy battle helpers.
function newBattleClamp(value,min,max){
    return Math.max(min,Math.min(max,value));
}


function launchQualityRoll(){
    // Original safe-roll distribution retained from the old launch system.
    const roll=Math.random()*100;
    if(roll<5) return "Horrible";
    if(roll<12) return "Bad";
    if(roll<45) return "Okay";
    if(roll<90) return "Good";
    return "Perfect";
}

function launchRiskQualityRoll(){
    // Risking the launch gives a meaningfully different distribution.
    const roll=Math.random()*100;
    if(roll<5) return "Horrible";
    if(roll<15) return "Bad";
    if(roll<40) return "Okay";
    if(roll<75) return "Good";
    return "Perfect";
}

function launchQualityModifier(quality){
    return {
        Horrible:{speed:.70,accuracy:.42,rpm:.86,stability:.72},
        Bad:{speed:.84,accuracy:.68,rpm:.94,stability:.86},
        Okay:{speed:1.00,accuracy:.82,rpm:1.00,stability:1.00},
        Good:{speed:1.07,accuracy:.94,rpm:1.03,stability:1.06},
        Perfect:{speed:1.13,accuracy:1.00,rpm:1.06,stability:1.11}
    }[quality] || {speed:1,accuracy:.82,rpm:1,stability:1};
}

function launchAngleModifier(angle,bit){
    const movement=bit.movement||60;
    const control=bit.control||70;

    if(angle==="Flat"){
        return {
            speed:movement>=80?1.10:1.02,
            control:movement>=80?.88:1.02,
            drain:movement>=80?1.08:.98,
            tilt:0
        };
    }

    if(angle==="Slight Tilt"){
        return {
            speed:movement>=80?.90:.98,
            control:1.08 + control/1000,
            drain:.91,
            tilt:4
        };
    }

    return {
        speed:movement>=80?.78:.90,
        control:1.15 + control/900,
        drain:.84,
        tilt:8
    };
}

function chooseCPUOpeningLaunch(){
    const side=Game.cpu;
    const combo=calculateComboStats(side.blade,side.ratchet,side.bit);
    const type=side.blade?.type||"Balance";
    const personality=side.blade?.personality||{};
    const risk=personality.risk??50;
    const aggression=personality.aggression??50;

    const playerType=Game.player.blade?.type||"Balance";

    // Matchup-aware, but imperfect. The CPU chooses an intention; execution
    // quality is still resolved separately by the physical launch system.
    let weights={Center:1,"X-Rail":1,"Direct Clash":1,"Drop Launch":1};

    if(type==="Attack"){
        weights["Direct Clash"]+=playerType==="Stamina"?3:1.4;
        weights["X-Rail"]+=combo.knockback>=82?1.8:1;
        weights.Center+=playerType==="Attack"?1.4:.6;
        weights["Drop Launch"]+=playerType==="Defense"?1.3:.7;
    }else if(type==="Stamina"){
        weights.Center+=3;
        weights["Drop Launch"]+=1.2;
        weights["X-Rail"]+=.5;
        weights["Direct Clash"]+=playerType==="Attack"?.7:0;
    }else if(type==="Defense"){
        weights.Center+=2.4;
        weights["Drop Launch"]+=1.5;
        weights["Direct Clash"]+=risk>65?1.1:.5;
        weights["X-Rail"]+=.6;
    }else{
        weights.Center+=1.6;
        weights["X-Rail"]+=1;
        weights["Direct Clash"]+=aggression>70?1.4:.7;
        weights["Drop Launch"]+=1;
    }

    // Personality nudges the decision rather than overriding the matchup.
    weights["Direct Clash"]+=Math.max(0,aggression-60)/35;
    weights["X-Rail"]+=Math.max(0,risk-55)/45;

    const options=Object.keys(weights);
    const total=options.reduce((sum,k)=>sum+Math.max(.1,weights[k]),0);
    let roll=Math.random()*total;
    let technique=options[0];
    for(const option of options){
        roll-=Math.max(.1,weights[option]);
        if(roll<=0){ technique=option; break; }
    }

    const bit=getBitPhysics("cpu");
    let angle;
    if(bit.movement>=80){
        angle=Math.random() < (risk>70?.65:.50) ? "Flat" :
               Math.random() < .72 ? "Slight Tilt" : "Hard Tilt";
    }else if(bit.control>=90){
        angle=Math.random() < .65 ? "Flat" : "Slight Tilt";
    }else{
        angle=Math.random() < .45 ? "Flat" :
               Math.random() < .80 ? "Slight Tilt" : "Hard Tilt";
    }

    side.launch.technique=technique;
    side.launch.angle=angle;
    side.launch.quality=launchQualityRoll();
    side.launch.gamble=false;
}

function newBattlePreviewState(side){
    const combo=Game[side];
    const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);
    return {
        side,
        x:side==="player"?-.72:.72,
        y:0,
        vx:0,
        vy:0,
        rpm:1,
        stability:newBattleClamp((stats.balance||70)/100,.45,1),
        tilt:0,
        momentum:0,
        radius:.073,
        hitFlash:0,
        stats,
        blade:combo.blade,
        bit:combo.bit,
        launchComplete:false
    };
}

function getLaunchTarget(side,technique){
    if(technique==="Center") return {x:0,y:0};

    if(technique==="Direct Clash"){
        const opponent=side==="player" ? NEW_BATTLE.cpu : NEW_BATTLE.player;
        // If the opponent has already been created, aim at its real launch
        // position. Otherwise use the known opposite launcher position.
        return opponent
            ? {x:opponent.x,y:opponent.y}
            : (side==="player"?{x:.76,y:0}:{x:-.76,y:0});
    }

    if(technique==="X-Rail"){
        // Player-side dash catches the lower rail; CPU-side dash catches the
        // right-side rail. These are approach points, not teleports.
        return side==="player"
            ? {x:-.43,y:.68}
            : {x:.78,y:.05};
    }

    // Drop Launch is different: it starts at the X-Rail exit itself,
    // then releases DOWN into the Battle Zone.
    return {x:0,y:0};
}

function makeLaunchState(side){
    const combo=Game[side];
    const stats=calculateComboStats(combo.blade,combo.ratchet,combo.bit);
    const bit=getBitPhysics(side);
    const quality=launchQualityModifier(combo.launch?.quality);
    const angle=launchAngleModifier(combo.launch?.angle,bit);
    const technique=combo.launch?.technique||"Center";
    const target=getLaunchTarget(side,technique);

    // Launchers normally begin from the player's side. Drop Launch is the
    // exception: the Bey begins immediately beside the top X-Rail exit and
    // travels DOWN into the Battle Zone, matching the intended technique.
    const isDropLaunch=technique==="Drop Launch";
    const startX=isDropLaunch ? 0 : (side==="player"?-.76:.76);
    const startY=isDropLaunch ? -.58 : 0;
    const dx=target.x-startX;
    const dy=target.y-startY;
    const distance=Math.max(.001,Math.hypot(dx,dy));

    // Launch quality changes how closely the release follows the chosen line.
    // Poor launches deviate; excellent launches track the intended trajectory.
    const deviation=(1-quality.accuracy)*.18;
    const jitterX=(Math.random()-.5)*deviation;
    const jitterY=(Math.random()-.5)*deviation;
    const tx=target.x+jitterX;
    const ty=target.y+jitterY;
    const vxBase=(tx-startX)/Math.max(.35,distance)*.020;
    const vyBase=(ty-startY)/Math.max(.35,distance)*.020;

    const inward=side==="player"?1:-1;
    const techniqueSpeed={
        Center:1.00,
        "X-Rail":1.08,
        "Direct Clash":1.18,
        "Drop Launch":.92
    }[technique]||1;

    const launchSpeed=techniqueSpeed*quality.speed*angle.speed;
    const initialRPM=newBattleClamp(
        (0.92 + (stats.stamina||70)/1000)*quality.rpm,
        .65,1
    );

    let initialTilt=angle.tilt;
    // Tilt is a physical angle, not a generic attack/defense switch.
    // Higher Ratchets amplify the same selected launch angle.
    const ratchetHeight=parseInt(String(combo.ratchet?.name||"").match(/-(\d+)/)?.[1]||60,10);
    if(initialTilt>0) initialTilt += Math.max(0,(ratchetHeight-60)/10)*.7;

    // Initial release impulse. The Bey begins at the launcher and immediately
    // accelerates along the selected physical trajectory. Technique, quality,
    // tilt and bit behavior all affect this vector.
    // The opening release is intentionally much stronger than the old
    // placeholder movement. A real launch should visibly leave the launcher
    // and travel along the selected line before normal friction takes over.
    const releaseSpeed = 0.060 * launchSpeed * (0.92 + (stats.mobility||70)/700);
    const launchImpulse = isDropLaunch ? releaseSpeed*1.15 : releaseSpeed;

    const state={
        side,
        x:startX,
        y:startY,
        vx:(tx-startX)/Math.max(.35,distance)*launchImpulse,
        vy:(ty-startY)/Math.max(.35,distance)*launchImpulse,
        rpm:initialRPM,
        stability:newBattleClamp(
            ((stats.balance||70)/100)*quality.stability,
            .25,.99
        ),
        tilt:initialTilt,
        momentum:0,
        radius:.073,
        hitFlash:0,
        stats,
        blade:combo.blade,
        bit,
        launchComplete:false,
        launchTechnique:technique,
        launchAngle:combo.launch?.angle||"Flat",
        launchQuality:combo.launch?.quality||"Okay",
        launchTarget:target,
        launchStartedAt:performance.now(),
        launchAge:0,
        centerLaunch:technique==="Center",
        directClash:technique==="Direct Clash",
        dropPhase:technique==="Drop Launch" ? "approach" : null,
        railIntent:technique==="X-Rail",
        launchSpinDirection:combo.blade?.spin||"Right",
        inwardDirection:inward
    };

    return state;
}

function beginNewPhysicalLaunch(){
    chooseCPUOpeningLaunch();

    // The player has already selected angle, technique and quality.
    Game.battle.phase="Launch";
    Game.battle.finished=false;

    NEW_BATTLE.player=makeLaunchState("player");
    NEW_BATTLE.cpu=makeLaunchState("cpu");
    NEW_BATTLE.elapsed=0;
    NEW_BATTLE.active=true;
    NEW_BATTLE.last=performance.now();

    renderNewBattle("battle");
    NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);
}

function startNewBattle(){
    cancelAnimationFrame(NEW_BATTLE.raf);

    Game.screen="battle";
    Game.battle.engineMode="new_physics";
    Game.battle.phase="Launch Setup";
    Game.battle.finished=false;
    Game.battle.matchStarted=true;
    Game.battle.matchFinished=false;
    Game.battle.exchange=0;
    Game.battle.newLaunchStage="tilt";

    Game.player.launch=Game.player.launch||{};
    Game.player.launch.angle=null;
    Game.player.launch.technique=null;
    Game.player.launch.quality=null;
    Game.player.launch.gamble=false;

    Game.cpu.launch=Game.cpu.launch||{};
    Game.cpu.launch.angle=null;
    Game.cpu.launch.technique=null;
    Game.cpu.launch.quality=null;
    Game.cpu.launch.gamble=false;

    NEW_BATTLE.player=newBattlePreviewState("player");
    NEW_BATTLE.cpu=newBattlePreviewState("cpu");
    NEW_BATTLE.elapsed=0;
    NEW_BATTLE.active=false;
    NEW_BATTLE.finished=false;
    NEW_BATTLE.contactCooldown=0;
    NEW_BATTLE.impact=null;

    renderNewBattle("launch");
    wireNewLaunchControls();
}

function renderNewBattle(mode="battle"){
    const app=document.getElementById("app");
    if(!app) return;

    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;
    const launchSetup=mode==="launch";
    const launchStage=Game.battle.newLaunchStage||"tilt";
    const selectedAngle=Game.player.launch?.angle;
    const selectedTechnique=Game.player.launch?.technique;
    const predictedQuality=Game.player.launch?.quality;

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
              <circle id="newPlayerBey" cx="${px}" cy="${py}" r="3.15"
                      fill="#d8a82c" stroke="#ffffff" stroke-width=".65"/>
              <circle id="newCpuBey" cx="${cx}" cy="${cy}" r="3.15"
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


          ${launchSetup ? `
          <div id="newLaunchStatus" style="margin-top:10px;padding:9px 10px;border-radius:9px;background:#202831;color:#fff;border:1px solid #46515a;font-size:12px;">
            ${launchStage==="tilt"
                ? "Choose your launch angle first."
                : launchStage==="technique"
                    ? `Tilt locked: <strong>${selectedAngle}</strong> · Now choose your launch technique.`
                    : `Launch locked: <strong>${selectedTechnique}</strong> · ${selectedAngle}.`
            }
          </div>
          <div id="newLaunchControls" style="margin-top:10px;padding:12px;border-radius:10px;background:rgba(0,0,0,.18);">
            <div style="font-size:12px;opacity:.7;margin-bottom:6px;">LAUNCH SETUP · ${launchStage==="tilt"?"1 / 3":launchStage==="technique"?"2 / 3":"3 / 3"}</div>

            ${launchStage==="tilt" ? `
              <strong>CHOOSE TILT</strong>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:8px;">
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-angle="Flat">FLAT</button>
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-angle="Slight Tilt">SLIGHT TILT</button>
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-angle="Hard Tilt">HARD TILT</button>
              </div>
              <div style="font-size:10px;opacity:.62;margin-top:7px;">
                Tilt changes movement, control, attack angle, stability and burst exposure.
              </div>
            ` : launchStage==="technique" ? `
              <strong>CHOOSE LAUNCH</strong>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px;">
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-technique="Center">CENTER</button>
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-technique="X-Rail">X RAIL</button>
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-technique="Direct Clash">DIRECT CLASH</button>
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" data-new-launch-technique="Drop Launch">DROP LAUNCH</button>
              </div>
              <div style="font-size:10px;opacity:.62;margin-top:7px;">
                The technique sets a physical launch trajectory. It does not guarantee the result.
              </div>
            ` : `
              <strong>LAUNCH EXECUTION</strong>
              <div style="margin:8px 0;padding:9px;border-radius:8px;background:rgba(255,255,255,.05);">
                <div>${selectedAngle} · ${selectedTechnique}</div>
                <div style="font-size:22px;font-weight:800;margin-top:3px;">${predictedQuality}</div>
                <div style="font-size:10px;opacity:.62;">Predicted release quality</div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;">
                <button class="menu-btn" style="background:#202831;color:#ffffff;border:1px solid #68747d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" id="newLaunchKeep">QUALITY</button>
                <button class="menu-btn gold" style="background:#b47a16;color:#fff;border:1px solid #e2b54d;box-shadow:0 2px 5px rgba(0,0,0,.28);font-weight:800;" id="newLaunchRisk">RISK</button>
              </div>
              <div style="font-size:10px;opacity:.62;margin-top:7px;">
                QUALITY keeps the predetermined roll. RISK throws it back for a new result.
              </div>
            `}
          </div>` : `
          <div id="newCommentary" style="margin-top:8px;padding:10px;background:#202831;color:#fff;border-radius:8px;font-size:13px;">
            ${getLaunchTechniqueText("player").replace("aims","launches and aims")} · ${Game.player.launch.angle||"Flat"}.
          </div>`}
        </section>
      </main>`;
}

function wireNewLaunchControls(){
    const angleButtons=document.querySelectorAll("[data-new-launch-angle]");
    angleButtons.forEach(btn=>{
        btn.onclick=()=>{
            Game.player.launch.angle=btn.getAttribute("data-new-launch-angle");
            Game.battle.newLaunchStage="technique";
            renderNewBattle("launch");
            wireNewLaunchControls();
        };
    });

    const techniqueButtons=document.querySelectorAll("[data-new-launch-technique]");
    techniqueButtons.forEach(btn=>{
        btn.onclick=()=>{
            Game.player.launch.technique=btn.getAttribute("data-new-launch-technique");
            // Predetermined quality is rolled once and shown before the
            // player decides whether to keep it or risk a reroll.
            Game.player.launch.quality=launchQualityRoll();
            Game.player.launch.gamble=false;
            Game.battle.newLaunchStage="quality";
            renderNewBattle("launch");
            wireNewLaunchControls();
        };
    });

    const keep=document.getElementById("newLaunchKeep");
    if(keep){
        keep.onclick=()=>{
            Game.player.launch.gamble=false;
            beginNewPhysicalLaunch();
        };
    }

    const risk=document.getElementById("newLaunchRisk");
    if(risk){
        risk.onclick=()=>{
            Game.player.launch.gamble=true;
            Game.player.launch.quality=launchRiskQualityRoll();
            beginNewPhysicalLaunch();
        };
    }
}


function finishNewBattle(winnerSide){
    if(!NEW_BATTLE.active || NEW_BATTLE.finished) return;

    NEW_BATTLE.finished=true;
    NEW_BATTLE.active=false;
    cancelAnimationFrame(NEW_BATTLE.raf);

    Game.battle.finished=true;
    Game.battle.matchFinished=true;
    Game.battle.phase="Finished";

    const winnerName=
        winnerSide==="player"
            ? Game.player.blade.name
            : Game.cpu.blade.name;

    const winnerLabel=
        winnerSide==="player"
            ? "YOU WIN"
            : "CPU WINS";

    const app=document.getElementById("app");
    if(app){
        app.innerHTML=`
          <div class="background"></div>
          <main class="menu">
            <section class="menu-card" style="text-align:center;">
              <div style="font-size:13px;opacity:.7;letter-spacing:1px;">
                BATTLE FINISHED
              </div>
              <h1 style="margin:10px 0;">${winnerLabel}</h1>
              <div style="font-size:18px;font-weight:800;">
                ${winnerName}
              </div>
              <div style="margin-top:10px;opacity:.7;font-size:12px;">
                Spin Finish
              </div>
            </section>
          </main>`;

        // Return to the game's existing home screen after the result is
        // readable. Reloading restores the original index/home state and
        // avoids carrying battle state into the next match.
        setTimeout(()=>location.reload(),1800);
    }else{
        location.reload();
    }
}

function newBattleFrame(now){
    if(!NEW_BATTLE.active) return;

    const dt=Math.min(0.04,Math.max(0.001,(now-NEW_BATTLE.last)/1000));
    NEW_BATTLE.last=now;
    NEW_BATTLE.elapsed+=dt;

    newPhysicsStep(NEW_BATTLE.player,dt);
    newPhysicsStep(NEW_BATTLE.cpu,dt);
    newPhysicsCollision(dt);

    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;

    // Spin Finish: the first Bey whose RPM reaches zero loses immediately.
    if(p.rpm<=0 || c.rpm<=0){
        p.rpm=Math.max(0,p.rpm);
        c.rpm=Math.max(0,c.rpm);

        if(p.rpm<=0 && c.rpm<=0){
            // Extremely rare simultaneous stop: award the finish to the Bey
            // with the greater remaining stability.
            finishNewBattle(
                p.stability>=c.stability ? "player" : "cpu"
            );
        }else if(p.rpm<=0){
            finishNewBattle("cpu");
        }else{
            finishNewBattle("player");
        }
        return;
    }

    // Low RPM begins reducing aggressive travel at 50%. It should settle,
    // but never become a frozen object while another Bey is still making
    // contact with it.
    [p,c].forEach(s=>{
        const lowRpm=Math.max(0,0.50-s.rpm)/0.50;
        if(lowRpm>0){
            const damp=1-lowRpm*0.045;
            s.vx*=damp;
            s.vy*=damp;
        }
        s.hitFlash=Math.max(0,(s.hitFlash||0)-dt);
    });

    const pe=document.getElementById("newPlayerBey");
    const ce=document.getElementById("newCpuBey");

    const drawBey=(el,s)=>{
        if(!el) return;
        let shakeX=0,shakeY=0;
        if(s.hitFlash>0){
            const mag=(s.hitFlash/0.16)*0.24;
            shakeX=(Math.random()-0.5)*mag;
            shakeY=(Math.random()-0.5)*mag;
        }
        el.setAttribute("cx",50+(s.x+shakeX)*39);
        el.setAttribute("cy",46+(s.y+shakeY)*39);
        el.setAttribute("stroke",s.hitFlash>0 ? "#ffffff" : "none");
        el.setAttribute("stroke-width",s.hitFlash>0 ? "1.4" : "0");
    };

    drawBey(pe,p);
    drawBey(ce,c);

    // Impact flash/ring.
    let impactFx=document.getElementById("newImpactFx");
    if(NEW_BATTLE.impact){
        NEW_BATTLE.impact.age+=dt;
        if(!impactFx){
            const svg=document.querySelector("#newStadium svg");
            if(svg){
                impactFx=document.createElementNS(
                    "http://www.w3.org/2000/svg","circle"
                );
                impactFx.id="newImpactFx";
                impactFx.setAttribute("fill","none");
                impactFx.setAttribute("pointer-events","none");
                svg.appendChild(impactFx);
            }
        }
        if(impactFx){
            const i=NEW_BATTLE.impact;
            const progress=Math.min(1,i.age/i.duration);
            impactFx.setAttribute("cx",50+i.x*39);
            impactFx.setAttribute("cy",46+i.y*39);
            impactFx.setAttribute(
                "r",String(1.4+progress*3.2*i.level)
            );
            impactFx.setAttribute(
                "stroke-width",String(0.85*(1-progress)+0.25)
            );
            impactFx.setAttribute(
                "stroke",`rgba(255,255,255,${1-progress})`
            );
        }
        if(NEW_BATTLE.impact.age>=NEW_BATTLE.impact.duration){
            NEW_BATTLE.impact=null;
            if(impactFx) impactFx.remove();
        }
    }

    const ids=[
        ["newPlayerRPM",p.rpm],["newCpuRPM",c.rpm],
        ["newPlayerStability",p.stability],["newCpuStability",c.stability]
    ];
    ids.forEach(([id,v])=>{
        const el=document.getElementById(id);
        if(el) el.textContent=Math.round(v*100);
    });

    const commentary=document.getElementById("newCommentary");
    if(commentary){
        const distance=Math.hypot(p.x-c.x,p.y-c.y);
        if(NEW_BATTLE.elapsed<0.85){
            commentary.textContent =
                `${Game.player.blade.name} launches ${Game.player.launch.technique==="X-Rail"?"toward the X Rail.":Game.player.launch.technique==="Direct Clash"?"straight toward the opponent.":Game.player.launch.technique==="Drop Launch"?"toward the X Exit.":"toward the center."}`;
        }else if(NEW_BATTLE.elapsed<1.6){
            commentary.textContent =
                distance<0.22
                    ?"The opening lines are converging — first contact is coming."
                    :"Both Beys are establishing their launch trajectories.";
        }else{
            commentary.textContent=distance<0.18
                ?"They're closing fast — contact is imminent."
                :"Both Beys are carving their paths around the stadium.";
        }
    }

    NEW_BATTLE.raf=requestAnimationFrame(newBattleFrame);
}

function newPhysicsStep(s,dt){
    const stats=s.stats||{};
    const bit=s.bit||{};

    s.launchAge=(s.launchAge||0)+dt;

    const rpm=newBattleClamp(s.rpm,0,1);
    const bitMovement=newBattleClamp(bit.movement||50,10,100);
    const bitControl=newBattleClamp(bit.control||70,10,100);
    const centerAffinity=newBattleClamp(bit.centerAffinity||50,0,100);
    const balance=newBattleClamp((stats.balance||70)/100,0.5,1);

    /*
     * MOVEMENT MODEL 2.0
     *
     * No orbit target.
     * No rail attraction.
     * No automatic circular path.
     *
     * Movement emerges from four things:
     *   1. launch momentum
     *   2. stadium slope toward center
     *   3. weak spin/precession influence
     *   4. small physical drift
     *
     * RPM controls how strongly the Bey can maintain movement. It does NOT
     * change the Bey's spin direction and it does NOT directly place the Bey
     * on a circle.
     */

    const distance=Math.hypot(s.x,s.y);
    const safeDistance=Math.max(distance,0.001);
    const radialX=s.x/safeDistance;
    const radialY=s.y/safeDistance;

    // Permanent spin direction. It can weaken with RPM, but can NEVER flip.
    const spinDirection=(s.launchSpinDirection||"Right").toLowerCase();
    const rightSpin=spinDirection!=="left";

    // Right-spin = counter-clockwise precession tendency.
    // Left-spin = clockwise precession tendency.
    let tangentX=rightSpin ? radialY : -radialY;
    let tangentY=rightSpin ? -radialX : radialX;

    // At the exact center, keep the existing heading rather than inventing
    // an opposite direction.
    const speed=Math.hypot(s.vx,s.vy);
    if(distance<0.09 && speed>0.0015){
        tangentX=s.vx/speed;
        tangentY=s.vy/speed;
    }

    // ------------------------------------------------------------
    // 1. LAUNCH MOMENTUM
    // ------------------------------------------------------------
    // Launch momentum is allowed to dominate the opening. Normal movement
    // physics gradually takes over instead of immediately replacing it.
    const launchFactor=Math.max(0,1-s.launchAge/1.15);

    if(launchFactor>0){
        const target=s.launchTarget;
        if(target){
            const dx=target.x-s.x;
            const dy=target.y-s.y;
            const d=Math.hypot(dx,dy);

            if(d>0.04 && s.launchTechnique!=="Drop Launch"){
                const launchAim=
                    s.launchTechnique==="Direct Clash" ? 0.018 :
                    s.launchTechnique==="X-Rail" ? 0.014 :
                    0.010;

                s.vx+=(dx/d)*launchAim*launchFactor*dt*60;
                s.vy+=(dy/d)*launchAim*launchFactor*dt*60;
            }
        }
    }

    // ------------------------------------------------------------
    // 2. STADIUM SLOPE
    // ------------------------------------------------------------
    // Center is the low point. The pull is weak at high RPM and gradually
    // becomes stronger as the Bey loses energy. Stable bits receive more of
    // this downhill effect.
    const stableBitFactor=
        bitMovement<25
            ? 2.15
            : bitMovement<45
                ? 1.70
                : bitMovement<75
                    ? 1.25
                    : 0.72;

    const lowRpmFactor=Math.pow(1-rpm,1.25);

    // Low-movement stamina/defense bits behave like a top sitting in the
    // bottom of the bowl: they can leave center from the launch, but the
    // stadium continually encourages them back inward.
    const centerPreference=
        bitMovement<25 ? 1.65 :
        bitMovement<45 ? 1.35 :
        1;

    const slopeAccel=
        distance *
        (0.00075+
         lowRpmFactor*0.0068+
         centerAffinity/100*0.0018) *
        stableBitFactor*
        centerPreference;

    s.vx+=(-radialX)*slopeAccel*dt*60;
    s.vy+=(-radialY)*slopeAccel*dt*60;

    // ------------------------------------------------------------
    // 3. WEAK SPIN / PRECESSION
    // ------------------------------------------------------------
    // This is deliberately much weaker than the previous versions. It gives
    // the Bey a general circling tendency without forcing an orbit.
    const attackMovement=newBattleClamp((bitMovement-60)/40,0,1);

    const lowMovementMultiplier=
        bitMovement<25 ? 0.22 :
        bitMovement<45 ? 0.45 :
        1;

    const precessionStrength=
        (0.00008+
         attackMovement*0.00115) *
        lowMovementMultiplier *
        Math.pow(rpm,1.45);

    // A wall impact temporarily suppresses this so the new trajectory can
    // develop naturally rather than snapping back onto an orbit.
    const impactRecovery=Math.max(0,s.impactRecovery||0);
    const precessionSuppression=
        impactRecovery>0
            ? 0.15+(1-impactRecovery)*0.85
            : 1;

    s.vx+=tangentX*precessionStrength*precessionSuppression*dt*60;
    s.vy+=tangentY*precessionStrength*precessionSuppression*dt*60;

    // ------------------------------------------------------------
    // 4. RANDOM PHYSICAL DRIFT
    // ------------------------------------------------------------
    // Slowly changing drift prevents the Bey from becoming a perfect circle.
    // It is deliberately subtle: random does not mean chaotic teleporting.
    s.driftTimer=(s.driftTimer||0)-dt;

    if(s.driftTimer<=0){
        s.driftTimer=0.22+Math.random()*0.50;

        const driftScale=
            0.00010+
            (1-bitControl/100)*0.00055+
            attackMovement*0.00045;

        s.driftX=(Math.random()-0.5)*driftScale;
        s.driftY=(Math.random()-0.5)*driftScale;
    }

    const driftMultiplier=
        0.45+rpm*0.55;

    s.vx+=(s.driftX||0)*driftMultiplier*dt*60;
    s.vy+=(s.driftY||0)*driftMultiplier*dt*60;

    // ------------------------------------------------------------
    // DROP LAUNCH
    // ------------------------------------------------------------
    if(s.launchTechnique==="Drop Launch" && s.dropPhase){
        const exitX=0, exitY=-0.55;
        const exitDistance=Math.hypot(s.x-exitX,s.y-exitY);

        if(s.dropPhase==="approach" && exitDistance<0.11){
            s.dropPhase="stall";
            s.dropStall=0;
            s.vx*=0.35;
            s.vy*=0.35;
        }else if(s.dropPhase==="stall"){
            s.dropStall=(s.dropStall||0)+dt;
            s.vx*=0.94;
            s.vy*=0.94;

            if(s.dropStall>=0.28){
                s.dropPhase="drop";

                // Down/inward from the X Exit.
                const dx2=-s.x;
                const dy2=-s.y;
                const d2=Math.max(.001,Math.hypot(dx2,dy2));

                s.vx=(dx2/d2)*0.050;
                s.vy=(dy2/d2)*0.050;
            }
        }
    }

    // ------------------------------------------------------------
    // MOVE
    // ------------------------------------------------------------
    s.x+=s.vx*dt*60;
    s.y+=s.vy*dt*60;

    // Very light surface drag. We want RPM, impacts and slope to control the
    // battle, not an invisible giant friction multiplier.
    const movementFriction=
        bitMovement<25 ? 0.9950 :
        bitMovement<45 ? 0.9968 :
        bitMovement<70 ? 0.9980 :
        0.9987;

    const drag=
        movementFriction-
        (bitMovement/100)*0.00004;

    s.vx*=Math.pow(drag,dt*60);
    s.vy*=Math.pow(drag,dt*60);

    // Decay impact recovery after movement has been allowed to establish a
    // new direction.
    if(s.impactRecovery>0){
        s.impactRecovery=Math.max(0,s.impactRecovery-dt/0.55);
    }

    // ------------------------------------------------------------
    // X-RAIL STRUCTURE / EXIT
    // ------------------------------------------------------------
    // Until the actual X-Rail mechanic is implemented, ALL rail geometry is
    // passive stadium geometry. There is no attraction and no rail-following.
    //
    // The exit is a wall. Only a future railActive state may cross it.
    const exitY=-0.56;
    const exitHalfWidth=0.14;

    if(!s.railActive && s.y<exitY && Math.abs(s.x)<exitHalfWidth){
        s.y=exitY;

        if(s.vy<0){
            const impactSpeed=Math.hypot(s.vx,s.vy);
            const impactFactor=Math.min(1,impactSpeed/0.060);

            s.vy=Math.abs(s.vy)*(0.42-0.10*impactFactor);
            s.vx*=0.68-0.10*impactFactor;

            s.rpm=newBattleClamp(
                s.rpm-(0.004+0.008*impactFactor),
                0,1
            );

            s.stability=newBattleClamp(
                s.stability-(0.008+0.014*impactFactor),
                0,1
            );

            s.impactRecovery=1;
            s.wallHits=(s.wallHits||0)+1;
            s.driftTimer=0;
        }
    }

    // ------------------------------------------------------------
    // OUTER WALL COLLISION
    // ------------------------------------------------------------
    const rx=0.86;
    const ry=0.86;

    const ellipseValue=
        (s.x*s.x)/(rx*rx)+
        (s.y*s.y)/(ry*ry);

    if(ellipseValue>1){
        const nx=s.x/(rx*rx);
        const ny=s.y/(ry*ry);
        const normalLength=Math.hypot(nx,ny)||1;

        const nX=nx/normalLength;
        const nY=ny/normalLength;

        // Put the Bey back on the playable surface.
        const scale=1/Math.sqrt(ellipseValue);
        s.x*=scale*0.982;
        s.y*=scale*0.982;

        const outward=s.vx*nX+s.vy*nY;

        if(outward>0){
            const impactSpeed=Math.hypot(s.vx,s.vy);
            const speedFactor=Math.min(1,impactSpeed/0.065);

            // Remove the outward component and reflect the remainder.
            s.vx-=2*outward*nX;
            s.vy-=2*outward*nY;

            // Strong impact response. The faster the collision, the more
            // momentum is lost.
            const retention=
                0.42+
                (bitControl/100)*0.14+
                balance*0.05-
                speedFactor*0.12;

            const r=newBattleClamp(retention,0.28,0.66);

            s.vx*=r;
            s.vy*=r;

            // Small spin-consistent post-impact bias. This is NOT enough to
            // force an orbit.
            const impactTangentX=rightSpin ? nY : -nY;
            const impactTangentY=rightSpin ? -nX : nX;

            const kick=
                (0.0010+speedFactor*0.0035)*
                (0.55+rpm*0.45);

            s.vx+=impactTangentX*kick;
            s.vy+=impactTangentY*kick;

            // The collision temporarily dominates movement.
            s.impactRecovery=1;
            s.wallHits=(s.wallHits||0)+1;

            // Meaningful impact costs.
            s.rpm=newBattleClamp(
                s.rpm-(0.003+speedFactor*0.012),
                0,1
            );

            s.stability=newBattleClamp(
                s.stability-
                (0.004+speedFactor*0.018+
                 (1-bitControl/100)*0.004),
                0,1
            );

            s.driftTimer=0;
        }
    }

    // ------------------------------------------------------------
    // RPM / TILT / STABILITY
    // ------------------------------------------------------------
    const speedNow=Math.hypot(s.vx,s.vy);
    const tiltFactor=1+(s.tilt||0)*0.018;
    const bitDrain=(bit.spinDrain||0.8)/100;

    // Increased stamina drain. The Bey can still travel for a useful period,
    // but battles should not take excessively long.
    s.rpm=newBattleClamp(
        s.rpm-
        (0.00022+
         speedNow*0.000075*tiltFactor+
         bitDrain*0.00010)*
        dt*60,
        0,1
    );

    const recovery=(bit.recovery||65)/100;

    if(s.rpm>0.62 && s.tilt>0){
        s.tilt=newBattleClamp(
            s.tilt-recovery*0.16*dt,
            0,12
        );
    }else{
        s.tilt=newBattleClamp(
            s.tilt+
            (speedNow*0.0055+
             (1-s.rpm)*0.043)*
            dt*60,
            0,12
        );
    }

    const tiltInstability=(s.tilt/12)*0.0013;

    s.stability=newBattleClamp(
        s.stability-
        ((1-s.rpm)*0.00058+
         speedNow*0.00024+
         tiltInstability)*
        dt*60,
        0,1
    );
}
function newPhysicsCollision(dt){
    const p=NEW_BATTLE.player;
    const c=NEW_BATTLE.cpu;

    // Brief collision cooldown prevents one physical contact from being
    // counted as 10+ hits while the Beys are separating.
    NEW_BATTLE.contactCooldown=Math.max(
        0,(NEW_BATTLE.contactCooldown||0)-dt
    );

    const dx=c.x-p.x, dy=c.y-p.y;
    const dist=Math.hypot(dx,dy);
    const minDist=p.radius+c.radius;

    if(dist<=minDist && dist>0.0001){
        const nx=dx/dist, ny=dy/dist;
        const rvx=c.vx-p.vx, rvy=c.vy-p.vy;
        const closing=rvx*nx+rvy*ny;

        if(closing<0 && NEW_BATTLE.contactCooldown<=0){
            const impactSpeed=Math.max(0,-closing);

            // Attack, knockback and the actual closing speed all matter.
            // Knockback is deliberately much stronger than the old 0.72
            // impulse so hits visibly separate the Beys.
            const pAttack=(p.stats?.attack||70)/100;
            const cAttack=(c.stats?.attack||70)/100;
            const pKB=(p.stats?.knockback||70)/100;
            const cKB=(c.stats?.knockback||70)/100;
            const pDef=(p.stats?.defense||70)/100;
            const cDef=(c.stats?.defense||70)/100;

            // Closing speed is the momentum/impact driver. Slow contact
            // produces a small shove; a fast collision can become a heavy
            // hit and launch the defender a large distance.
            const momentumFactor=
                newBattleClamp(impactSpeed/0.060,0,2.25);

            const pForce=
                impactSpeed*
                (0.55+pKB*1.20)*
                (0.65+pAttack*0.35)*
                (0.65+momentumFactor*0.70);

            const cForce=
                impactSpeed*
                (0.55+cKB*1.20)*
                (0.65+cAttack*0.35)*
                (0.65+momentumFactor*0.70);

            // Defender resistance reduces incoming knockback.
            const pResistance=0.62+pDef*0.38;
            const cResistance=0.62+cDef*0.38;

            const pImpulse=cForce/pResistance;
            const cImpulse=pForce/cResistance;

            // Even late in the battle, a real contact produces a visible
            // shove. Keep it small; high-speed momentum still dominates.
            const lowRpmContact=
                (p.rpm<0.50 || c.rpm<0.50) &&
                impactSpeed>0.004
                    ? 0.0045
                    : 0;

            p.vx-=nx*(pImpulse+lowRpmContact);
            p.vy-=ny*(pImpulse+lowRpmContact);
            c.vx+=nx*(cImpulse+lowRpmContact);
            c.vy+=ny*(cImpulse+lowRpmContact);

            // Separate them decisively so they don't overlap and repeatedly
            // exchange tiny impulses.
            const separation=Math.max(0,minDist-dist);

            const hitTier=
                impactSpeed<0.018 ? "LIGHT" :
                impactSpeed<0.034 ? "SOLID" :
                impactSpeed<0.052 ? "HEAVY" :
                "SMASH";

            const hitMultiplier=
                hitTier==="LIGHT" ? 0.75 :
                hitTier==="SOLID" ? 1.00 :
                hitTier==="HEAVY" ? 1.45 :
                1.95;

            const separationPush=
                separation+
                0.018+
                impactSpeed*0.10*hitMultiplier;

            p.x-=nx*separationPush*0.55;
            p.y-=ny*separationPush*0.55;
            c.x+=nx*separationPush*0.55;
            c.y+=ny*separationPush*0.55;

            // Impact has a visible game-state consequence.
            const pDamage=
                (0.0035+
                 impactSpeed*0.018+
                 cForce*0.006)*
                (0.75+cAttack*0.25);

            const cDamage=
                (0.0035+
                 impactSpeed*0.018+
                 pForce*0.006)*
                (0.75+pAttack*0.25);

            p.rpm=newBattleClamp(p.rpm-pDamage,0,1);
            c.rpm=newBattleClamp(c.rpm-cDamage,0,1);

            p.stability=newBattleClamp(
                p.stability-
                (0.008+impactSpeed*0.020+
                 (1-pDef)*0.008),
                0,1
            );
            c.stability=newBattleClamp(
                c.stability-
                (0.008+impactSpeed*0.020+
                 (1-cDef)*0.008),
                0,1
            );

            p.tilt=newBattleClamp(
                p.tilt+(cForce*2.8+impactSpeed*2.0),0,12
            );
            c.tilt=newBattleClamp(
                c.tilt+(pForce*2.8+impactSpeed*2.0),0,12
            );

            // Impact animation state. Renderer turns this into a bright
            // contact flash/ring and a brief Bey shake.
            const hitX=(p.x+c.x)*0.5;
            const hitY=(p.y+c.y)*0.5;
            const impactLevel=newBattleClamp(
                impactSpeed*7+
                Math.abs(pForce-cForce)*2+
                (hitTier==="SMASH" ? 0.35 :
                 hitTier==="HEAVY" ? 0.15 : 0),
                0.10,1
            );

            NEW_BATTLE.impact={
                x:hitX,
                y:hitY,
                level:impactLevel,
                age:0,
                duration:0.22,
                tier:hitTier
            };

            p.hitFlash=0.22;
            c.hitFlash=0.22;
            p.impactRecovery=1;
            c.impactRecovery=1;

            NEW_BATTLE.contactCooldown=
                0.18+Math.min(0.18,impactSpeed*1.5);
        }
    }
}

// The old launch-screen/battle systems have been removed.
// The VS CONTINUE button now enters startNewBattle() directly.

window.addEventListener("DOMContentLoaded",()=>hookMenuButtons());
