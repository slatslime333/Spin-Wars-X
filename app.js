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
    Flat:{movement:96,control:48,spinDrain:1.55,xRailAffinity:94,centerAffinity:30,recovery:42,attackBias:10,acceleration:94,friction:42,precession:72,stability:38},
    "Low Flat":{movement:100,control:43,spinDrain:1.70,xRailAffinity:97,centerAffinity:24,recovery:35,attackBias:13,acceleration:100,friction:38,precession:78,stability:32},
    Rush:{movement:91,control:64,spinDrain:1.28,xRailAffinity:88,centerAffinity:38,recovery:48,attackBias:8,acceleration:88,friction:48,precession:62,stability:44},
    "Low Rush":{movement:96,control:52,spinDrain:1.62,xRailAffinity:94,centerAffinity:28,recovery:40,attackBias:11,acceleration:95,friction:40,precession:74,stability:35},
    Level:{movement:66,control:84,spinDrain:0.86,xRailAffinity:58,centerAffinity:62,recovery:70,attackBias:2,acceleration:62,friction:72,precession:42,stability:70},
    Elevate:{movement:55,control:91,spinDrain:0.66,xRailAffinity:42,centerAffinity:76,recovery:82,attackBias:-1,acceleration:54,friction:80,precession:34,stability:82},
    Kick:{movement:82,control:62,spinDrain:1.16,xRailAffinity:78,centerAffinity:36,recovery:52,attackBias:7,acceleration:82,friction:52,precession:58,stability:48},
    Wedge:{movement:32,control:96,spinDrain:0.58,xRailAffinity:24,centerAffinity:94,recovery:90,attackBias:-4,acceleration:34,friction:90,precession:24,stability:94},
    Hexa:{movement:38,control:99,spinDrain:0.52,xRailAffinity:20,centerAffinity:98,recovery:95,attackBias:-5,acceleration:38,friction:92,precession:22,stability:97},
    Needle:{movement:16,control:98,spinDrain:0.38,xRailAffinity:12,centerAffinity:100,recovery:96,attackBias:-8,acceleration:18,friction:96,precession:16,stability:99},
    Ball:{movement:25,control:95,spinDrain:0.34,xRailAffinity:18,centerAffinity:96,recovery:94,attackBias:-7,acceleration:28,friction:94,precession:18,stability:96},
    Orb:{movement:34,control:94,spinDrain:0.40,xRailAffinity:25,centerAffinity:92,recovery:91,attackBias:-5,acceleration:36,friction:91,precession:22,stability:94},
    Point:{movement:58,control:82,spinDrain:0.74,xRailAffinity:48,centerAffinity:70,recovery:72,attackBias:1,acceleration:56,friction:76,precession:38,stability:76},
    "High Needle":{movement:19,control:93,spinDrain:0.34,xRailAffinity:10,centerAffinity:100,recovery:94,attackBias:-7,acceleration:20,friction:96,precession:16,stability:99},
    Quake:{movement:88,control:42,spinDrain:1.72,xRailAffinity:72,centerAffinity:22,recovery:30,attackBias:8,acceleration:90,friction:44,precession:70,stability:34}
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
    <!-- Restored multi-ring impact effect, intentionally restrained. -->
    <circle id="impactFlash" cx="500" cy="420" r="18" fill="none" stroke="#ffffff" stroke-width="3.5"/>
    <circle id="impactRing" cx="500" cy="420" r="8" fill="none" stroke="#ffd43b" stroke-width="2.5"/>
    <circle id="impactRing2" cx="500" cy="420" r="5" fill="none" stroke="#ffffff" stroke-width="2"/>
    <circle id="impactRing3" cx="500" cy="420" r="3" fill="none" stroke="#ffd43b" stroke-width="1.5"/>
    <text id="impactText" x="500" y="380" text-anchor="middle" font-size="20" font-weight="900" fill="#ffffff">HIT!</text>
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

/*
  LAUNCH QUALITY SYSTEM
  Quality is independent from launch angle/technique.
  FIXED QUALITY chooses one weighted-random result and keeps it.
  ROLL QUALITY chooses a fresh weighted-random result each press.
*/
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

function setFixedLaunchQuality(side){
    if(!Game[side]) return "Okay";
    Game[side].launch=Game[side].launch||{};
    if(!Game[side].launch.quality){
        Game[side].launch.quality=rollRandomLaunchQuality();
    }
    Game[side].launch.qualityMode="Fixed";
    return Game[side].launch.quality;
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
        "Center":"takes a wide opening line"
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

    Game.cpu.launch=getAutomaticLaunchPlan("cpu");
    rollLaunchQuality("cpu");

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

    const qualityRPM={
        Horrible:90,Bad:94,Okay:97,Good:99,Perfect:100
    }[Game.player.launch.quality]||97;

    if(stage==="qualityReveal"){
        controls.innerHTML=`
          <div style="padding:18px;background:rgba(0,0,0,.20);border-radius:9px;text-align:center;">
            <div style="font-size:12px;opacity:.72;">LAUNCH QUALITY</div>
            <div style="font-size:30px;font-weight:800;margin:10px 0;">
              ${Game.player.launch.quality}
            </div>
            <div style="font-size:12px;opacity:.70;">
              ${Game.player.launch.qualityMode==="Roll" ? "ROLLED QUALITY" : "FIXED QUALITY"}
            </div>
            <div style="font-size:11px;opacity:.55;margin-top:8px;">
              Quality locked · next: launch angle & technique
            </div>
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
            },2000);
        }
    }else if(stage==="quality"){
        controls.innerHTML=`
          <div style="padding:10px;background:rgba(0,0,0,.20);border-radius:9px;">
            <div style="font-size:12px;opacity:.72;margin-bottom:7px;">
              LAUNCH QUALITY · SCORE ${Game.battle.score?.player||0}-${Game.battle.score?.cpu||0}
            </div>
            <div style="font-size:12px;opacity:.78;text-align:center;margin-bottom:9px;">
              Choose your launch quality. Your choice is locked for this launch.
            </div>

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

            <div style="display:flex;gap:8px;margin-top:9px;">
              <button class="menu-btn silver" id="backToVS" type="button" style="flex:1;">
                ← BACK
              </button>
            </div>
          </div>
        `;
    }else{
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
            </div>

            <div id="launchInfo" style="margin-top:9px;font-size:12px;opacity:.82;text-align:center;">
              ${Game.player.launch.angle} · ${Game.player.launch.technique}
              <br>
              <strong>LAUNCH QUALITY: ${Game.player.launch.quality || "Okay"}</strong>
              · ${Game.player.launch.qualityMode==="Roll" ? "ROLLED" : "FIXED"}
              · START RPM: ${qualityRPM}%
            </div>

            <div style="display:flex;gap:8px;margin-top:9px;">
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

    card.appendChild(controls);

    const rebuildAngleTechnique=(angle,technique)=>{
        Game.player.launch.angle=angle;
        Game.player.launch.technique=technique;
        // Quality is already selected and MUST NOT reroll here.
        Game.player.launch.setupStage="launch";
        showLetItRip();
    };

    if(stage==="quality"){
        document.getElementById("fixedQualityBtn").onclick=()=>{
            Game.player.launch.quality=
                Game.player.launch.fixedQualityPreview ||
                rollRandomLaunchQuality();
            Game.player.launch.qualityMode="Fixed";
            Game.player.launch.setupStage="qualityReveal";
            showLetItRip();
        };

        document.getElementById("rollQualityBtn").onclick=()=>{
            rollLaunchQuality("player");
            Game.player.launch.setupStage="qualityReveal";
            showLetItRip();
        };

        document.getElementById("backToVS").onclick=showVS;
        return;
    }

    document.getElementById("launchFlat").onclick=()=>
        rebuildAngleTechnique("Flat",Game.player.launch.technique);

    document.getElementById("launchSlight").onclick=()=>
        rebuildAngleTechnique("Slight Tilt",Game.player.launch.technique);

    document.getElementById("launchHard").onclick=()=>
        rebuildAngleTechnique("Hard Tilt",Game.player.launch.technique);

    document.getElementById("launchCenter").onclick=()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Center");

    document.getElementById("launchRail").onclick=()=>
        rebuildAngleTechnique(Game.player.launch.angle,"X-Rail");

    document.getElementById("launchClash").onclick=()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Direct Clash");

    document.getElementById("launchDrop").onclick=()=>
        rebuildAngleTechnique(Game.player.launch.angle,"Drop Launch");

    document.getElementById("startBattleNow").onclick=startNewBattle;

    document.getElementById("backToQuality").onclick=()=>{
        Game.player.launch.setupStage="quality";
        showLetItRip();
    };
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
        if(["Flat","Low Flat","Low Rush","Rush","Kick","Quake"].includes(bitName) && personality.risk>=62){
            const roll=Math.random();
            technique=roll<0.16 ? "Drop Launch" : (roll<0.58 ? "Direct Clash" : "Center");
        }else{
            technique=personality.risk>=70 ? "Direct Clash":"Center";
        }
    }else if(type==="Defense" || type==="Stamina"){
        technique="Center";
    }else{
        technique="Center";
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
    const sideSign=side==="player"?1:-1;
    const isXRailLaunch=plan.technique==="X-Rail";

    /*
      X-Rail is a deliberate rail-seeking launch. Start near the appropriate
      upper rail rather than at the normal center-entry lane, then let the
      physical rail-capture test decide whether the Bey actually latches.
    */
    const startX=isDropLaunch
        ? 0
        : isXRailLaunch
            ? sideSign*(0.78 + placementJitter*0.10)
            : sideSign*(-0.70 + placementJitter*0.18);
    const startY=isDropLaunch
        ? -0.47 + placementJitter*0.30
        : isXRailLaunch
            ? 0.49 + placementJitter*0.10
            : placementJitter;
    const direction=isDropLaunch ? 0 : sideSign;

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
        "X-Rail":1.00,
        "Drop Launch":0.92
    }[plan.technique]||1;

    const launchSpeed=
        (0.019+(stats.mobility||70)*0.000045)*
        qualityFactor*techniqueSpeed*tilt.speed;

    const tiltSign=side==="player"?-1:1;
    let vx=direction*launchSpeed;
    let vy=tiltSign*tilt.lateral*launchSpeed;

    if(isXRailLaunch){
        const railTarget=newXRailNearest(sideSign*0.82,0.48);
        const dx=railTarget.x-startX;
        const dy=railTarget.y-startY;
        const d=Math.hypot(dx,dy)||1;

        const inwardX=dx/d;
        const inwardY=dy/d;
        const spinDirection=combo.blade?.spin==="Left" ? 1 : -1;
        const railTangentX=railTarget.tx*spinDirection;
        const railTangentY=railTarget.ty*spinDirection;

        const tangentWeight=0.72;
        const approachWeight=0.28;
        const railLaunchSpeed=launchSpeed*(1.10+0.10*qualityFactor);

        vx=(railTangentX*tangentWeight+inwardX*approachWeight)*railLaunchSpeed;
        vy=(railTangentY*tangentWeight+inwardY*approachWeight)*railLaunchSpeed;
    }

    if(plan.technique==="Drop Launch"){
        vx=0;
        // Drop launch releases just below the X Exit and falls into the bowl.
        vy=0.0145*qualityFactor;
    }

    const tiltStall=
        plan.angle==="Slight Tilt" ? 0.18 :
        plan.angle==="Hard Tilt" ? 0.30 : 0;

    return {
        side,x:startX,y:startY,vx,vy,rpm:qualityRPM,
        stability:newBattleClamp(
            ((stats.balance||70)/100)-tilt.stability+
            (plan.quality==="Perfect"?0.035:plan.quality==="Good"?0.018:0),
            0.40,1
        ),
        radius:0.108,
        // Physical mass is based on the actual blade weight. It is used for
        // collision energy; it does not replace Attack/Knockback stats.
        mass:Math.max(0.82,Math.min(1.18,(combo.blade?.weight||35)/35)),
        hitFlash:0,impactScale:1,lastKnockback:0,
        stats,blade:combo.blade,bit:combo.bit,
        launchPlan:plan,
        launchQuality:plan.quality,
        launchQualityRPM:qualityRPM,
        launchPlacementError:qualityPlacement,
        launchRpmLossMultiplier:tilt.rpm,
        launchTilt:plan.angle,
        launchStall:tiltStall,
        launchStallElapsed:0,
        launchDropActive:plan.technique==="Drop Launch",
        launchDropElapsed:0,
        launchComplete:false,

        // Natural movement state: these alter forces over time rather than
        // drawing a fixed orbit.
        motionPhase:Math.random()*Math.PI*2,
        motionPhase2:Math.random()*Math.PI*2,
        movementNoiseX:(Math.random()-0.5)*0.0002,
        movementNoiseY:(Math.random()-0.5)*0.0002,
        movementNoiseTimer:0.25+Math.random()*0.35,
        movementEnergy:1.0,
        axisStability:newBattleClamp(
            ((stats.balance||70)/99)*
            ((bitPhysics({bit:combo.bit}).stability||70)/100),
            0.25,1
        ),
        tiltLevel:0.08,
        railUses:0,

        // Right spin = counter-clockwise; left spin = clockwise.
        spinDirection:(combo.blade?.spin==="Left" ? 1 : -1),
        railEngaged:false,railProgress:0,railDistance:0,
        railSpeed:0,railRideTime:0,railTravelDistance:0,
        railLoops:0,
        railGrip:0,
        railDirection:0,
        railContactPoint:null,
        railExitCooldown:0,
        railExited:false,
        railExitRefractory:0,
        railExitRefractoryPoint:null,
        surfaceRecovery:0,
        surfaceBounce:0
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
    NEW_BATTLE.finishPending=false;

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
            <span style="font-weight:700;">${Game.battle.score?.player||0} — ${Game.battle.score?.cpu||0}</span>
            <span style="opacity:.65;font-size:12px;">FIRST TO 7</span>
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
              <circle id="newPlayerBey" cx="${px}" cy="${py}" r="4.15"
                      fill="#d8a82c" stroke="#ffffff" stroke-width=".65"/>
              <circle id="newCpuBey" cx="${cx}" cy="${cy}" r="4.15"
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
            ${p.blade.name} ${
    p.launchPlan.technique==="Direct Clash" ? "comes out aggressively." :
    p.launchPlan.technique==="Drop Launch" ? "drops in from the X Exit." :
    "settles into its opening line."
}
            ${c.blade.name} ${c.launchPlan.technique==="Direct Clash"?"answers with an aggressive launch.":"takes its opening position."}
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
    const commentary=document.getElementById("newCommentary");
    if(commentary){
        commentary.textContent=
            finishType==="Xtreme"
                ? `${loser.blade.name} falls into the XTREME ZONE! +3`
                : finishType==="Over"
                    ? `${loser.blade.name} is knocked into the OVER ZONE! +2`
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
        NEW_BATTLE.player=null;
        NEW_BATTLE.cpu=null;

        showLetItRip();
    },2000);
}
function checkForcedStadiumFinish(s){

    const age=performance.now()-(s.lastImpactAt||0);
    if(age>900) return null;

    const force=s.lastImpactForce||0;
    const speed=speedOf(s);

    // A rail-exit knockback gets a real advantage because the Bey is already
    // moving toward the lower stadium when it leaves the rail.
    const exitBoost=s.railExited?1.18:1.0;
    const effectiveForce=force*exitBoost;

    // Xtreme zone: central lower opening. Require a genuine high-force
    // displacement, not merely entering the red area.
    const inXtreme=
        s.y>=0.78 &&
        s.y<=0.98 &&
        Math.abs(s.x)<=0.19;

    const xtremeTargetX=0;
    const xtremeTargetY=0.91;
    const xtremeDx=xtremeTargetX-s.x;
    const xtremeDy=xtremeTargetY-s.y;
    const xtremeDistance=Math.hypot(xtremeDx,xtremeDy)||1;
    const xtremeAlignment=
        (s.vx*xtremeDx+s.vy*xtremeDy)/
        Math.max(speed*xtremeDistance,0.0001);

    if(
        inXtreme &&
        effectiveForce>=0.0180 &&
        speed>=0.045 &&
        xtremeAlignment>=0.55
    ){
        return "Xtreme";
    }

    // Pockets are wider and require slightly less force than Xtreme, but
    // still require a recent impact and meaningful outward travel.
    const leftPocket=
        s.x<=-0.64 &&
        s.y>=0.76 &&
        speed>=0.030;

    const rightPocket=
        s.x>=0.64 &&
        s.y>=0.76 &&
        speed>=0.030;

    const pocketTargetX=leftPocket ? -0.82 : 0.82;
    const pocketTargetY=0.90;
    const pocketDx=pocketTargetX-s.x;
    const pocketDy=pocketTargetY-s.y;
    const pocketDistance=Math.hypot(pocketDx,pocketDy)||1;
    const pocketAlignment=
        (s.vx*pocketDx+s.vy*pocketDy)/
        Math.max(speed*pocketDistance,0.0001);

    if(
        (leftPocket||rightPocket) &&
        effectiveForce>=0.0145 &&
        speed>=0.042 &&
        s.y>0.80 &&
        pocketAlignment>=0.58
    ){
        return "Over";
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
            const ps=3.65*(p.hitFlash>0?(p.impactScale||1):1);
            pe.setAttribute("r",ps);
        }
        if(ce){
            const cs=3.65*(c.hitFlash>0?(c.impactScale||1):1);
            ce.setAttribute("r",cs);
        }

        const impactGroup=document.getElementById("impactEffect");
        if(impactGroup && NEW_BATTLE.lastImpact){
            const imp=NEW_BATTLE.lastImpact;
            const age=Math.max(0,(performance.now()-imp.time)/1000);
            const life=0.38;
            if(age<life){
                const u=age/life;
                const x=50+imp.x*39;
                const y=46+imp.y*39;
                const strength=imp.strength||1;

                impactGroup.setAttribute("opacity",
                    String(Math.max(0,0.90-u*0.90)));

                const flash=document.getElementById("impactFlash");
                const ring=document.getElementById("impactRing");
                const ring2=document.getElementById("impactRing2");
                const ring3=document.getElementById("impactRing3");
                const txt=document.getElementById("impactText");

                if(flash){
                    flash.setAttribute("cx",x);
                    flash.setAttribute("cy",y);
                    flash.setAttribute("r",String(14+u*24*strength));
                    flash.setAttribute("stroke-width",String(4.0-u*1.5));
                }
                if(ring){
                    ring.setAttribute("cx",x);
                    ring.setAttribute("cy",y);
                    ring.setAttribute("r",String(8+u*32*strength));
                }
                if(ring2){
                    ring2.setAttribute("cx",x);
                    ring2.setAttribute("cy",y);
                    ring2.setAttribute("r",String(6+u*24*strength));
                }
                if(ring3){
                    ring3.setAttribute("cx",x);
                    ring3.setAttribute("cy",y);
                    ring3.setAttribute("r",String(4+u*17*strength));
                }
                if(txt){
                    txt.setAttribute("x",x);
                    txt.setAttribute("y",String(y-22-u*12));
                    txt.setAttribute("font-size",String(19+Math.min(6,strength*2.2)));
                    txt.textContent=imp.heavy?"HEAVY HIT!":"HIT!";
                }
            }else{
                impactGroup.setAttribute("opacity","0");
                NEW_BATTLE.lastImpact=null;
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

        const commentary=document.getElementById("newCommentary");
        if(commentary){
            const distance=Math.hypot(p.x-c.x,p.y-c.y);
            if(NEW_BATTLE.elapsed<0.55){
                commentary.textContent=
                    `${p.blade.name}: ${p.launchQuality} launch · ${Math.round(p.rpm*100)}% RPM | `+
                    `${c.blade.name}: ${c.launchQuality} launch · ${Math.round(c.rpm*100)}% RPM`;
            }else if(p.railEngaged || c.railEngaged){
                const rider=p.railEngaged?p:c;
                commentary.textContent=
                    `${rider.blade.name} is riding the X Rail and building speed.`;
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

        // Pocket finish validation:
        // entering a pocket is not enough. The Bey must have been driven by
        // a recent, substantial impact with enough outward/downward velocity.
        const checkPocketFinish=(defender)=>{
            const x=defender.x;
            const y=defender.y;
            const leftPocket =
                x < -0.60 && y > 0.78;
            const rightPocket =
                x > 0.60 && y > 0.78;

            if(!leftPocket && !rightPocket) return false;

            const age=
                performance.now()-
                (defender.lastImpactAt||0);

            if(age>850) return false;

            const radial=Math.hypot(x,y);
            const speed=Math.hypot(defender.vx,defender.vy);
            const outward=
                radial>0.001
                    ? (defender.vx*x+defender.vy*y)/radial
                    : 0;

            const impactForce=defender.lastImpactForce||0;

            // This is intentionally difficult: pocket finishes require a
            // genuine knockback event, not a tap or slow drift.
            const targetX=leftPocket ? -0.82 : 0.82;
            const targetY=0.90;
            const tdX=targetX-x;
            const tdY=targetY-y;
            const targetDistance=Math.hypot(tdX,tdY)||1;
            const targetAlignment=
                (defender.vx*tdX+defender.vy*tdY)/
                Math.max(speed*targetDistance,0.0001);

            return (
                impactForce>=0.0145 &&
                speed>=0.042 &&
                outward>=0.012 &&
                radial>=0.84 &&
                targetAlignment>=0.58
            );
        };

        const pForcedFinish=checkForcedStadiumFinish(p);
        const cForcedFinish=checkForcedStadiumFinish(c);

        if(pForcedFinish){
            finishNewBattle("cpu",pForcedFinish);
            return;
        }
        if(cForcedFinish){
            finishNewBattle("player",cForcedFinish);
            return;
        }

        if(checkPocketFinish(p)){
            finishNewBattle("cpu","Over");
            return;
        }
        if(checkPocketFinish(c)){
            finishNewBattle("player","Over");
            return;
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
        [0.00,-0.603], // X Exit transition point
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
    const bp=bitPhysics(s);
    const rpm=newBattleClamp(s.rpm,0,1);
    const tilt=newBattleClamp(s.tiltLevel||0,0,1);
    const stability=newBattleClamp(s.stability||0,0,1);

    const affinity=(bp.xRailAffinity||0)/100;
    const movement=(bp.movement||60)/100;
    const control=(bp.control||60)/100;

    /*
      This is not a "chance to randomly grab the rail."
      It represents how well the current physical state can satisfy the
      rail's capture requirements.
    */
    const speedSupport=newBattleClamp(
        (approachSpeed-0.010)/0.040,0,1
    );

    const alignmentSupport=newBattleClamp(
        (alignment-0.20)/0.62,0,1
    );

    const approachSupport=newBattleClamp(
        1-Math.abs(approachRatio-0.40)/0.40,0,1
    );

    const rpmSupport=newBattleClamp(
        (rpm-0.22)/0.55,0,1
    );

    const tiltSupport=
        1-newBattleClamp((tilt-0.08)/0.30,0,1);

    const stabilitySupport=
        0.45+stability*0.55;

    const physicalScore=
        speedSupport*0.24+
        alignmentSupport*0.22+
        approachSupport*0.17+
        rpmSupport*0.14+
        tiltSupport*0.13+
        stabilitySupport*0.05+
        control*0.03+
        affinity*0.02;

    return newBattleClamp(physicalScore,0,1);
}

function railCaptureSupport(s){
    const bp=bitPhysics(s);
    const speed=speedOf(s);
    const rpm=newBattleClamp(s.rpm,0,1);
    const tilt=newBattleClamp(s.tiltLevel||0,0,1);
    const stability=newBattleClamp(s.stability||0,0,1);

    const movement=(bp.movement||60)/100;
    const control=(bp.control||60)/100;
    const affinity=(bp.xRailAffinity||50)/100;

    // Attack bits have a natural rail advantage, but the actual state still
    // has to support the capture.
    const movementBias=0.78+movement*0.22;
    const speedSupport=newBattleClamp((speed-0.014)/0.050,0,1);
    const rpmSupport=newBattleClamp((rpm-0.18)/0.62,0,1);
    const tiltSupport=1-newBattleClamp((tilt-0.10)/0.28,0,1);
    const stabilitySupport=0.55+stability*0.45;

    return newBattleClamp(
        speedSupport*0.27+
        rpmSupport*0.20+
        tiltSupport*0.25+
        stabilitySupport*0.10+
        control*0.07+
        affinity*0.06+
        movementBias*0.05,
        0,1
    );
}
function speedOf(s){
    return Math.hypot(s.vx,s.vy);
}

function bitPhysics(s){
    return BIT_PHYSICS[s.bit?.name] || BIT_PHYSICS.Point;
}

function railDirection(s){
    if(s.railDirection===1 || s.railDirection===-1) return s.railDirection;
    return s.spinDirection || -1;
}
function railDirectionAtPoint(s,point){
    /*
      The rail geometry is stored in clockwise order in screen coordinates.
      Right-spin Beys travel counter-clockwise, so right spin follows the
      reverse path. Left spin follows the stored path.

      Do not infer direction from the local radial vector: doing that made
      right-spin Beys select the wrong rail direction on different segments.
    */
    return s.spinDirection===1 ? 1 : -1;
}

function bounceOffRail(s,nearest){

    const dx=s.x-nearest.x;
    const dy=s.y-nearest.y;
    const len=Math.hypot(dx,dy)||1;

    const nx=dx/len;
    const ny=dy/len;

    const bp=bitPhysics(s);
    const balance=(s.stats?.balance||70)/99;
    const control=(bp.control||60)/100;
    const speed=speedOf(s);

    /*
      IMPORTANT:
      Merely being close to the rail is not a collision. If the Bey is moving
      away from the rail or nearly tangent to it, do nothing. The old code
      bounced every frame while inside the contact radius, which is the direct
      cause of the "stuck to rail" behavior.
    */
    const incomingNormal=s.vx*nx+s.vy*ny;
    if(incomingNormal>=-0.0015){
        return false;
    }

    const contactRadius=0.030+s.radius*0.24;
    const separation=Math.max(
        contactRadius+0.006,
        0.060+s.radius*0.04
    );

    s.x=nearest.x+nx*separation;
    s.y=nearest.y+ny*separation;

    const tx=-ny;
    const ty=nx;
    const tangent=s.vx*tx+s.vy*ty;

    const restitution=newBattleClamp(
        0.34+balance*0.20+control*0.12+
        Math.min(0.14,speed*1.5),
        0.24,0.54
    );

    const resolvedNormal=-incomingNormal*restitution;
    const tangentDamp=newBattleClamp(
        0.82+control*0.10,
        0.80,0.94
    );

    s.vx=nx*resolvedNormal+tx*tangent*tangentDamp;
    s.vy=ny*resolvedNormal+ty*tangent*tangentDamp;

    s.surfaceBounce=0.20;
    s.surfaceRecovery=0.12;
    s.motionPhase+=0.75+Math.random()*0.60;
    s.motionPhase2+=0.35+Math.random()*0.50;

    const impactSpeed=Math.max(0,-incomingNormal);
    s.rpm=newBattleClamp(
        s.rpm-(0.0012+impactSpeed*0.014),
        0,1
    );
    s.stability=newBattleClamp(
        s.stability-(0.0025+impactSpeed*0.030),
        0,1
    );

    return true;
}
function tryNewXRailEngagement(s){
    if(s.railEngaged) return true;
    const nearest=newXRailNearest(s.x,s.y);
    if(!nearest) return false;

    const bp=bitPhysics(s), speed=speedOf(s);
    const rpm=newBattleClamp(s.rpm,0,1);
    const tilt=newBattleClamp(s.tiltLevel||0,0,1);
    const stability=newBattleClamp(s.stability||0,0,1);
    const control=(bp.control||60)/100;
    const movement=(bp.movement||60)/100;
    const affinity=(bp.xRailAffinity||50)/100;

    if(Math.sqrt(nearest.dist2)>0.026+s.radius*0.18) return false;

    const dx=s.x-nearest.x, dy=s.y-nearest.y;
    const len=Math.hypot(dx,dy)||1;
    const nx=dx/len, ny=dy/len;
    const approachSpeed=Math.max(0,-(s.vx*nx+s.vy*ny));

    if(approachSpeed<0.012+tilt*0.010+(1-stability)*0.004) return false;

    const direction=railDirectionAtPoint(s,nearest);
    const tangentX=nearest.tx*direction, tangentY=nearest.ty*direction;
    const tangentVelocity=s.vx*tangentX+s.vy*tangentY;
    const tangentRatio=tangentVelocity/Math.max(speed,0.0001);
    const approachRatio=approachSpeed/Math.max(speed,0.0001);

    const effectiveMomentum=
        tangentVelocity*(0.74+0.26*rpm)*(1-0.30*tilt);

    const minimumMomentum=
        0.010+tilt*0.005+(1-stability)*0.0035;

    if(effectiveMomentum<minimumMomentum) return false;

    const minimumTangent=
        0.40-control*0.06-affinity*0.04-rpm*0.06;

    const maximumApproach=
        0.68+control*0.08+movement*0.04;
    if(tangentRatio<minimumTangent || approachRatio>maximumApproach) return false;

    const tiltLimit=
        0.36+stability*0.06+control*0.03+rpm*0.04;
    if(tilt>tiltLimit) return false;

    const speedQuality=newBattleClamp((effectiveMomentum-minimumMomentum)/0.045,0,1);
    const angleQuality=newBattleClamp((tangentRatio-minimumTangent)/Math.max(0.01,1-minimumTangent),0,1);
    const approachQuality=newBattleClamp(1-Math.abs(approachRatio-0.34)/0.34,0,1);
    const tiltQuality=1-newBattleClamp(tilt/Math.max(0.01,tiltLimit),0,1);
    const statusQuality=stability*0.70+rpm*0.30;

    const physicalScore=
        speedQuality*0.30+angleQuality*0.25+approachQuality*0.17+
        tiltQuality*0.18+statusQuality*0.08+control*0.015+affinity*0.005;

    const threshold=
        0.50-movement*0.05-affinity*0.03-rpm*0.05-stability*0.025;
    if(physicalScore+(Math.random()-0.5)*0.018<threshold) return false;

    const g=getNewXRailGeometry();
    const tangentialCarry=Math.max(tangentVelocity,speed*0.72);
    const railSpeed=newBattleClamp(
        tangentialCarry*(1.36+movement*0.16+rpm*0.16+affinity*0.06),
        0.075,0.240
    );

    s.railDirection=direction;
    s.railGrip=newBattleClamp(physicalScore,0.62,1);
    s.railEngaged=true;
    s.railUses=(s.railUses||0)+1;
    s.railContactPoint={x:nearest.x,y:nearest.y};
    s.railDistance=nearest.distance;
    s.railProgress=nearest.distance/g.total;
    s.railSpeed=railSpeed;
    s.railRideTime=0;
    s.railTravelDistance=0;
    s.railLoops=0;

    const normalRelease=Math.max(0.002,approachSpeed*0.12);
    s.x=nearest.x+nx*0.006;
    s.y=nearest.y+ny*0.006;
    s.vx=tangentX*railSpeed+nx*normalRelease;
    s.vy=tangentY*railSpeed+ny*normalRelease;
    return true;
}
function newXRailExit(s){
    const exit=newXRailPointAtDistance(getNewXRailGeometry().exitDistance);
    const bp=bitPhysics(s), rpm=newBattleClamp(s.rpm,0,1);
    const control=(bp.control||60)/100;
    const speed=newBattleClamp(
        Math.max(s.railSpeed||0,speedOf(s)*0.82)*(0.98+rpm*0.08),
        0.055,0.220
    );
    const direction=s.railDirection||railDirectionAtPoint(s,exit);
    const tangentX=exit.tx*direction, tangentY=exit.ty*direction;

    s.railEngaged=false; s.railExited=true;
    s.railRideTime=0; s.railProgress=0; s.railDistance=0;
    s.railTravelDistance=0; s.railLoops=0; s.railGrip=0;
    s.railContactPoint=null; s.railDirection=0;
    s.railExitRefractory=0.20;
    s.railExitRefractoryPoint={x:exit.x,y:exit.y};

    const exitForward=0.88+rpm*0.12+Math.min(0.12,speed*0.80);
    s.x=exit.x; s.y=exit.y+0.058;
    s.vx=tangentX*speed*(0.96+control*0.08);
    s.vy=speed*exitForward+tangentY*speed*(0.22+control*0.10);

    s.rpm=newBattleClamp(s.rpm-(0.008+(s.railSpeed||speed)*0.025),0,1);
    s.stability=newBattleClamp(s.stability-0.008,0,1);
    s.tiltLevel=newBattleClamp((s.tiltLevel||0)+0.025,0,1);
    s.surfaceRecovery=0.12;
}
function updateNewXRailRide(s,dt){
    if(!s.railEngaged) return false;

    const g=getNewXRailGeometry();
    const direction=s.railDirection||railDirection(s);
    const bp=bitPhysics(s);
    const rpm=newBattleClamp(s.rpm,0,1);
    const tilt=newBattleClamp(s.tiltLevel||0,0,1);
    const stability=newBattleClamp(s.stability||0,0,1);
    const movement=(bp.movement||60)/100;
    const affinity=(bp.xRailAffinity||50)/100;
    const control=(bp.control||60)/100;
    const previousDistance=s.railDistance;

    // The Bey remains the source of truth. The rail redirects its velocity;
    // it does not create a slow canned orbit.
    const pointNow=newXRailPointAtDistance(s.railDistance);
    const tx0=pointNow.tx*direction, ty0=pointNow.ty*direction;
    let tangentVelocity=s.vx*tx0+s.vy*ty0;

    if(tangentVelocity<0.050){
        newXRailRailRelease(s,direction);
        return true;
    }

    const railDrive=(0.0012+movement*0.0022+affinity*0.0011)*(0.32+rpm*0.68);
    const railFriction=0.00035+(1-rpm)*0.00040+tilt*0.00030;

    tangentVelocity=Math.max(
        0.050,
        tangentVelocity+(railDrive-railFriction)*dt*60
    );

    const speedSupport=newBattleClamp((tangentVelocity-0.050)/0.120,0,1);
    const rpmSupport=newBattleClamp((rpm-0.16)/0.70,0,1);
    const tiltSupport=1-newBattleClamp((tilt-0.06)/0.34,0,1);
    const stabilitySupport=0.45+stability*0.55;
    const support=
        speedSupport*0.30+rpmSupport*0.22+tiltSupport*0.28+
        stabilitySupport*0.12+control*0.05+affinity*0.03;

    s.railGrip=newBattleClamp(support,0,1);

    if(support<0.31||tilt>0.44||stability<0.12||tangentVelocity<0.034){
        newXRailRailRelease(s,direction);
        return true;
    }

    const travel=tangentVelocity*dt*60;
    s.railDistance+=direction*travel;
    s.railTravelDistance+=Math.abs(travel);

    if(newXRailCrossedExit(previousDistance,s.railDistance,direction)&&
       s.railTravelDistance>0.050){
        s.railSpeed=tangentVelocity;
        newXRailExit(s);
        return true;
    }

    s.railProgress=(((s.railDistance%g.total)+g.total)%g.total)/g.total;

    const point=newXRailPointAtDistance(s.railDistance);
    const tx=point.tx*direction, ty=point.ty*direction;
    const nx=-ty, ny=tx;
    const offset=0.004+0.003*support;

    s.x=point.x+nx*offset;
    s.y=point.y+ny*offset;
    s.railSpeed=tangentVelocity;

    s.vx=tx*tangentVelocity;
    s.vy=ty*tangentVelocity;

    const rpmDrainPerSecond=
        0.0030+tangentVelocity*0.024+(1-rpm)*0.0025+tilt*0.0015;
    s.rpm=newBattleClamp(rpm-rpmDrainPerSecond*dt,0,1);
    s.stability=newBattleClamp(
        stability-(0.00025+tangentVelocity*0.0014)*dt,0,1
    );
    return true;
}
function newXRailRailRelease(s,direction){
    const point=newXRailPointAtDistance(s.railDistance);
    const tangentX=point.tx*direction, tangentY=point.ty*direction;
    const normalX=-tangentY, normalY=tangentX;
    const speed=Math.max(0.025,s.railSpeed||speedOf(s)*0.78);

    s.railEngaged=false; s.railExited=false; s.railContactPoint=null;
    s.railGrip=0; s.railDirection=0;

    const tangential=speed*0.92, normal=Math.max(0.008,speed*0.24);
    const separation=0.060+s.radius*0.04;
    s.x=point.x+normalX*separation;
    s.y=point.y+normalY*separation;
    s.vx=tangentX*tangential+normalX*normal;
    s.vy=tangentY*tangential+normalY*normal;

    s.rpm=newBattleClamp(s.rpm-0.0025,0,1);
    s.stability=newBattleClamp(s.stability-0.006,0,1);
    s.tiltLevel=newBattleClamp((s.tiltLevel||0)+0.025,0,1);
    s.surfaceBounce=0.20; s.surfaceRecovery=0.12;
    s.motionPhase+=0.70+Math.random()*0.55;
    s.motionPhase2+=0.30+Math.random()*0.45;
    s.railExitRefractory=0;
    s.railExitRefractoryPoint={x:s.x,y:s.y};
}
function enforceXRailExitBarrier(s){

        if(s.railEngaged || s.railExited) return;

        // A strong recent collision is allowed to carry the Bey through the
        // exit boundary. Weak normal movement still treats it as a wall.
        if(
            s.knockbackOverrideUntil>performance.now() &&
            (s.knockbackOverrideForce||0)>=0.0135
        ){
            return;
        }

        const exit =
            newXRailPointAtDistance(
                getNewXRailGeometry().exitDistance
            );

        const ax=Math.abs(s.x);

        const halfWidth=0.133;
        const edgeY=-0.790;
        const apexY=exit.y;

        /*
          Only block the two physical side walls of the X Exit.
          Do not create a blanket "you cannot approach here" zone.
        */
        if(ax>=halfWidth) return;

        const boundaryY =
            apexY-
            (
                Math.abs(edgeY-apexY)*
                (1-ax/halfWidth)
            );

        const clearance =
            s.radius*0.72;

        if(s.y<boundaryY+clearance){

            s.y=boundaryY+clearance;

            if(s.vy<0){

                s.vy =
                    -s.vy*0.20;

                s.surfaceRecovery=0.12;
            }
        }
    };

function newPhysicsStep(s,dt){

        const stats = s.stats || {};
        const bp = bitPhysics(s);

        const rpm = newBattleClamp(s.rpm,0,1);
        const mobility = (stats.mobility||70)/100;
        const balance = (stats.balance||70)/99;
        const control = (bp.control||60)/100;
        const centerAffinity = (bp.centerAffinity||60)/100;
        const movement = (bp.movement||60)/100;
        const attackBit = movement>=0.80;
        const attackStat=(stats.attack||70)/99;
        const knockbackStat=(stats.knockback||70)/99;
        const attackSpeedBoost =
            attackBit
                ? (1.28 + 0.28*attackStat + 0.18*Math.pow(rpm,0.70))
                : (0.98 + 0.06*rpm + 0.04*attackStat);

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
          Core movement model:
          RPM supplies available spin energy, while the launch supplies
          translational momentum. They are related, but not identical.
          This prevents a Bey from retaining "100% RPM movement" at low RPM.
        */
        const launchMobility=
            0.020+
            (stats.mobility||70)*0.000050;

        const rpmSpeedFactor=
            0.34+
            0.66*Math.pow(rpm,0.58);

        const physicalSpeedTarget=
            launchMobility*
            (0.72+0.28*bitAcceleration)*
            rpmSpeedFactor*
            (0.78+0.22*bitStability)*
            (attackBit
                ? 1.08+0.12*attackStat+0.07*Math.pow(rpm,0.70)
                : 0.94+0.05*attackStat);

        const speedNow=Math.hypot(s.vx,s.vy);

        if(speedNow>physicalSpeedTarget*1.08){
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

        if(attackBit && rpm>0.38 && speedNow>0.001){
            const attackDrive=
                (0.00020+attackStat*0.00022)*
                Math.pow(rpm,0.82)*
                (0.72+0.28*s.movementEnergy)*
                bitAcceleration;
            s.vx+=(s.vx/speedNow)*attackDrive*dt*60;
            s.vy+=(s.vy/speedNow)*attackDrive*dt*60;
        }

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

        applyKnockbackBoundaryOverride(s);

        if(s.railEngaged){
            if(!Number.isFinite(s.railDistance) ||
               !Number.isFinite(s.railSpeed) ||
               s.railGrip<=0){
                newXRailRailRelease(s,railDirection(s));
            }else{
                updateNewXRailRide(s,dt);
            }
            return;
        }

        /*
          Surface contact first.
        */
        const nearest = newXRailNearest(s.x,s.y);

        if(nearest){
            const railDistance =
                Math.sqrt(nearest.dist2);

            const contactRadius =
                0.030+s.radius*0.24;

            if(
                railDistance<=contactRadius &&
                !s.railExited
            ){

                const dx=s.x-nearest.x;
                const dy=s.y-nearest.y;
                const len=Math.hypot(dx,dy)||1;
                const nx=dx/len;
                const ny=dy/len;
                const incomingNormal=s.vx*nx+s.vy*ny;

                if(!tryNewXRailEngagement(s)){
                    /*
                      Only bounce when the Bey is actually entering the rail.
                      Tangential/away movement is allowed to continue normally.
                    */
                    if(incomingNormal < -0.0015){
                        bounceOffRail(s,nearest);
                    }
                }

                if(s.railEngaged) return;
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
                        d<0.43 &&
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

                        const attackBit=
                            Number(bp.movement||60)>=80;

                        const opponentAttackBit=
                            opponent.bitPhysicsType==="attack" ||
                            Number(
                                opponent.stats &&
                                opponent.stats.movement ||
                                60
                            )>=80;

                        const bothNonAttack=
                            !attackBit && !opponentAttackBit;

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
                            bothNonAttack ? 0.59 : 0.47;

                        if(readiness>threshold){

                            const base=
                                attackBit
                                    ? 0.00052+
                                      attackStat*0.00055+
                                      kbStat*0.00020
                                    : 0.00030+
                                      attackStat*0.00026+
                                      kbStat*0.00018;

                            const strength=
                                base*
                                distanceFactor*
                                (0.72+0.28*s.rpm)*
                                (bothNonAttack?1.30:1.0);

                            /*
                              Mostly crossing force, with a smaller inward
                              component. This prevents permanent homing.
                            */
                            const inward=
                                strength*(0.35+0.18*wave);

                            const crossing=
                                strength*(0.70-0.18*wave);

                            s.vx+=
                                (ax*inward+tx*crossing)*
                                dt*60;
                            s.vy+=
                                (ay*inward+ty*crossing)*
                                dt*60;
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

        enforceXRailExitBarrier(s);

        if(s.railExited){
            const exitPointForClear=
                newXRailPointAtDistance(
                    getNewXRailGeometry().exitDistance
                );
            if(Math.hypot(
                s.x-exitPointForClear.x,
                s.y-exitPointForClear.y
            )>0.18){
                s.railExited=false;
            }
        }

        /*
          The X Exit is a physical opening only for a Bey that is actually
          transitioning from the rail. Normal free movement cannot simply
          phase through the mouth.
        */
        {
            const exitPoint =
                newXRailPointAtDistance(
                    getNewXRailGeometry().exitDistance
                );

            const exitDx = s.x-exitPoint.x;
            const exitDy = s.y-exitPoint.y;
            const exitDist = Math.hypot(exitDx,exitDy);

            if(
                exitDist < 0.105 &&
                s.y < exitPoint.y+0.040 &&
                s.vy < 0
            ){
                s.y = exitPoint.y+0.040;
                s.vy = -s.vy*0.22;
                s.surfaceRecovery = 0.14;
                s.rpm = newBattleClamp(s.rpm-0.0015,0,1);
            }
        }

        /*
          Spin/precession is an acceleration, not a circular path.
          Its influence fades smoothly with RPM.
        */
        const r = Math.hypot(s.x,s.y);

        if(r>0.02 && rpm>0.01){

            const invR=1/r;

            const spinSign=
                s.spinDirection===-1 ? 1 : -1;

            const tangentX=
                s.y*invR*spinSign;
            const tangentY=
                -s.x*invR*spinSign;

            /*
              Precession changes continuously. This is force-based
              wandering, not a fixed orbit.
            */
            s.motionPhase +=
                dt*(0.85+rpm*1.35+movement*0.55);

            s.motionPhase2 +=
                dt*(0.31+(1-rpm)*0.75);

            const wobbleA=Math.sin(s.motionPhase);
            const wobbleB=Math.sin(s.motionPhase2+1.7);

            const lowRpmAttackSuppression =
                attackBit
                    ? newBattleClamp((rpm-0.22)/0.38,0,1)
                    : 1;

            const lateralStrength=
                (0.00014+movement*0.00042)*
                Math.pow(rpm,1.02)*
                (0.52+control*0.48)*
                (0.76+0.24*attackStat)*
                (0.72+0.38*bitPrecession)*
                (0.72+0.28*s.movementEnergy)*
                (attackBit
                    ? (0.68+0.82*lowRpmAttackSuppression)
                    : 0.96);

            const radialX=s.x*invR;
            const radialY=s.y*invR;

            /*
              The direction of the travel force breathes in/out instead of
              remaining perfectly tangent to the bowl.
            */
            const radialWander=
                Math.sin(
                    s.motionPhase*0.73+
                    s.motionPhase2+
                    wobbleB*0.35
                )*
                lateralStrength*
                (0.30+(1-centerAffinity)*0.42+bitPrecession*0.18);

            const tangentScale=
                0.72+0.28*Math.cos(
                    wobbleA*0.95+wobbleB*0.55
                );

            s.vx +=
                tangentX*lateralStrength*tangentScale*dt*60+
                radialX*radialWander*dt*60;

            s.vy +=
                tangentY*lateralStrength*tangentScale*dt*60+
                radialY*radialWander*dt*60;

            /*
              Small cross-track disturbances are stronger for less
              controlled/non-attack movement, but vanish with RPM.
            */
            const crossX=-tangentY;
            const crossY=tangentX;

            const driftForce=
                (0.000018+(1-centerAffinity)*0.000030)*
                Math.pow(rpm,0.85)*
                (0.65+(1-control)*0.35);

            s.vx +=
                crossX*
                Math.sin(s.motionPhase2*1.17)*
                driftForce*dt*60;

            s.vy +=
                crossY*
                Math.sin(s.motionPhase2*1.17)*
                driftForce*dt*60;
        }

        /*
          Surface irregularity / precession variation.

          A real Bey does not follow a fixed mathematical orbit. Tiny changes
          in contact pressure and precession alter the direction of travel.
          This is strongest for controlled non-attack Bits in center fights,
          but remains small enough not to become random teleporting.
        */
        s.movementNoiseTimer-=dt;
        if(s.movementNoiseTimer<=0){
            const variation =
                (0.00020+
                 (1-movement)*0.00034+
                 (1-centerAffinity)*0.00020) *
                (0.42+0.58*rpm);

            const noiseAngle=
                s.motionPhase2+
                Math.random()*Math.PI*2;

            s.movementNoiseX=Math.cos(noiseAngle)*variation;
            s.movementNoiseY=Math.sin(noiseAngle)*variation;
            s.movementNoiseTimer=0.28+Math.random()*0.55;
        }

        const noiseScale =
            (attackBit
                ? 0.72
                : 1.0) *
            (0.55+0.45*rpm);

        s.vx+=s.movementNoiseX*noiseScale*dt*60;
        s.vy+=s.movementNoiseY*noiseScale*dt*60;

        /*
          Stadium slope gently favors the center.
          It becomes more relevant as spin falls because the Bey has less
          self-generated lateral movement.
        */
        if(r>0.015){

            const slopeForce =
                (
                    0.00024 +
                    centerAffinity*0.00050
                ) *
                (
                    0.55 +
                    (1-rpm)*0.72
                );

            s.vx -= s.x*slopeForce*dt*60;
            s.vy -= s.y*slopeForce*dt*60;
        }

        /*
          Physical friction.

          This is the major correction for the "too much momentum forever"
          problem. Velocity decays independently of RPM.
        */
        const baseFriction =
            0.984 +
            control*0.008 -
            movement*0.004 -
            (attackBit ? 0.0018*rpm : 0);

        const rpmFrictionBonus =
            0.004*rpm;

        const friction =
            newBattleClamp(
                baseFriction+rpmFrictionBonus,
                0.972,
                0.992
            );

        const frictionStep =
            Math.pow(
                friction,
                dt*60
            );

        s.vx *= frictionStep;
        s.vy *= frictionStep;

        /*
          Low RPM reduces movement amplitude rather than changing spin
          direction. No reverse-spin behavior is possible.
        */
        const lowRpm =
            newBattleClamp((0.58-rpm)/0.58,0,1);

        if(lowRpm>0){

            const lateralDamp =
                Math.pow(
                    attackBit
                        ? 0.955+0.012*bitStability
                        : 0.968+0.014*bitStability,
                    lowRpm*dt*60
                );

            const rNow =
                Math.hypot(s.x,s.y);

            if(rNow>0.08){

                const ix=s.x/rNow;
                const iy=s.y/rNow;

                const radialVelocity =
                    s.vx*ix+s.vy*iy;

                const tvx =
                    s.vx-ix*radialVelocity;

                const tvy =
                    s.vy-iy*radialVelocity;

                s.vx =
                    ix*radialVelocity+
                    tvx*lateralDamp;

                s.vy =
                    iy*radialVelocity+
                    tvy*lateralDamp;
            }
        }

        /*
          Small physical disturbance.

          It is deliberately tiny. It breaks perfectly mathematical paths
          without becoming visible RNG movement.
        */
        const disturbance =
            (
                0.000012 +
                (1-control)*0.000025
            ) *
            (
                0.35 +
                (1-rpm)*0.65
            );

        s.vx +=
            (Math.random()-0.5)*
            disturbance*dt*60;

        s.vy +=
            (Math.random()-0.5)*
            disturbance*dt*60;

        /*
          Outer stadium wall.

          A hard wall hit destroys the old trajectory instead of simply
          reflecting an orbit and allowing the same orbit to continue.
        */
        const radius =
            Math.hypot(s.x,s.y);

        const wall=0.93;

        if(radius>wall){

            const nx=s.x/(radius||1);
            const ny=s.y/(radius||1);

            const outward =
                s.vx*nx+s.vy*ny;

            s.x=nx*(wall-0.002);
            s.y=ny*(wall-0.002);

            if(outward>0){

                const tangentX=-ny;
                const tangentY=nx;

                const tangent =
                    s.vx*tangentX+
                    s.vy*tangentY;

                /*
                  Hard impact:
                  - reverse outward velocity
                  - reduce it heavily
                  - preserve only some tangent
                  - create a recovery state
                */
                const wallImpactQuality=
                    newBattleClamp(outward/0.045,0,2.2);

                const restitution=
                    newBattleClamp(
                        0.16+
                        balance*0.14+
                        control*0.07+
                        wallImpactQuality*0.045+
                        ((s.mass||1)-1)*0.04,
                        0.16,0.46
                    );

                const tangentRetention =
                    newBattleClamp(
                        0.52+
                        control*0.16,
                        0.52,
                        0.70
                    );

                const bouncedNormal =
                    -outward*restitution;

                s.vx =
                    nx*bouncedNormal+
                    tangentX*tangent*tangentRetention;

                s.vy =
                    ny*bouncedNormal+
                    tangentY*tangent*tangentRetention;

                s.surfaceRecovery=0.20;
                s.tiltLevel=newBattleClamp(
                    (s.tiltLevel||0)+0.06+outward*0.25,
                    0,1
                );
                s.motionPhase+=0.45+Math.random()*0.40;

                s.rpm=newBattleClamp(
                    s.rpm-
                    (0.002+
                     outward*0.025),
                    0,1
                );

                s.stability=newBattleClamp(
                    s.stability-
                    (0.004+
                     outward*0.040),
                    0,1
                );
                s.axisStability=newBattleClamp(
                    (s.axisStability||0.70)-
                    (0.015+outward*0.08),
                    0.15,1
                );
                s.movementEnergy=newBattleClamp(
                    (s.movementEnergy||1)-
                    (0.018+outward*0.18),
                    0.18,1
                );
            }
        }

        /*
          Movement drains RPM.
          RPM is spin energy, NOT a direct velocity multiplier.
        */
        const speed =
            Math.hypot(s.vx,s.vy);

        const bitDrain =
            bp.spinDrain || 1;

        const movementDrain =
            (
                0.00016+
                movement*0.00024+
                speed*0.00042
            ) *
            bitDrain *
            (0.65+rpm*0.35);

        const tiltDrain =
            s.launchRpmLossMultiplier||1;

        s.rpm =
            newBattleClamp(
                s.rpm-
                movementDrain*
                tiltDrain*
                dt*60,
                0,1
            );

        /*
          Stability:
          healthy spin can recover a little;
          speed and impacts consume it.
        */
        const recovery =
            (bp.recovery||60)/100;

        s.stability =
            newBattleClamp(
                s.stability+
                0.00024*
                recovery*
                rpm*
                dt*60 -
                (
                    0.00008+
                    speed*0.0011+
                    (1-rpm)*0.00030
                )*
                dt*60,
                0,1
            );

        s.axisStability=
            newBattleClamp(
                (s.axisStability||0.70)+
                (
                    bitStability*0.00020*rpm*recovery -
                    (1-bitStability)*0.00010 -
                    (1-rpm)*0.00016
                )*
                dt*60,
                0.15,1
            );
    };
function breakXRailFromImpact(s,nx,ny,force){
    if(!s.railEngaged) return false;

    // Collision has already modified s.vx/s.vy. Preserve that exact physical
    // result when handing the Bey back to normal stadium movement.
    const speedBefore=Math.hypot(s.vx,s.vy);
    const impactMagnitude=Math.max(0.003,force);
    const direction=railDirection(s);
    const point=newXRailPointAtDistance(s.railDistance);
    const tangentX=point.tx*direction, tangentY=point.ty*direction;
    const normalX=-tangentY, normalY=tangentX;

    let vx=s.vx, vy=s.vy;
    const outwardVelocity=vx*normalX+vy*normalY;
    const minimumOutward=0.004+impactMagnitude*0.20;

    if(outwardVelocity<minimumOutward){
        const add=minimumOutward-outwardVelocity;
        vx+=normalX*add;
        vy+=normalY*add;
    }

    const postSpeed=Math.hypot(vx,vy);
    if(speedBefore>0.020 && postSpeed<speedBefore*0.78){
        const scale=(speedBefore*0.78)/Math.max(postSpeed,0.0001);
        vx*=scale; vy*=scale;
    }

    s.railEngaged=false;
    s.railExited=false;
    s.railGrip=0;
    s.railContactPoint=null;
    s.railTravelDistance=0;
    s.railRideTime=0;
    s.railDirection=0;

    s.x=point.x+normalX*0.030;
    s.y=point.y+normalY*0.030;
    s.vx=vx; s.vy=vy;

    s.knockbackOverrideUntil=performance.now()+280;
    s.knockbackOverrideForce=force;
    s.rpm=newBattleClamp(s.rpm-(0.0035+force*0.20),0,1);
    s.stability=newBattleClamp(s.stability-(0.008+force*0.35),0,1);
    s.tiltLevel=newBattleClamp((s.tiltLevel||0)+0.045+force*0.55,0,1);

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

    // Allow meaningful glancing/tangential contact, but reject a truly
    // stationary overlap.
    if(closing>=0 && relativeSpeed<0.0022) return;

    const pAttack=(p.stats.attack||70)/99;
    const cAttack=(c.stats.attack||70)/99;
    const pKB=(p.stats.knockback||70)/99;
    const cKB=(c.stats.knockback||70)/99;
    const pDef=(p.stats.defense||70)/99;
    const cDef=(c.stats.defense||70)/99;
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
        pMass*pSpeed*Math.max(0.35,Math.pow(pRPM,0.72));
    const cMomentum=
        cMass*cSpeed*Math.max(0.35,Math.pow(cRPM,0.72));

    // Closing speed identifies who is actually driving into the contact.
    const pClosing=Math.max(0,-closing);
    const cClosing=Math.max(0,closing);

    // Kinetic-energy-style term. Squared velocity makes a fast crash
    // substantially more energetic than a slow bump.
    const pKinetic=
        0.5*pMass*pSpeed*pSpeed*
        (0.48+0.52*pRPM);
    const cKinetic=
        0.5*cMass*cSpeed*cSpeed*
        (0.48+0.52*cRPM);

    // Tangential clashes still have real energy, but they are weaker than a
    // direct collision.
    const grazingEnergy=totalRelative*0.22;

    // Blade Attack + Knockback are combat stats, not Bit-type permissions.
    const pCombatRating=
        0.58+
        pAttack*0.78+
        pKB*0.52;
    const cCombatRating=
        0.58+
        cAttack*0.78+
        cKB*0.52;

    // Momentum is the physical input; Attack/Knockback determine how well
    // the Bey converts that input into an offensive collision.
    const pEnergy=(
        pKinetic+
        pClosing*pMomentum*0.55+
        grazingEnergy*0.32
    )*pContactEfficiency;

    const cEnergy=(
        cKinetic+
        cClosing*cMomentum*0.55+
        grazingEnergy*0.32
    )*cContactEfficiency;

    const statDrivenContact=
        (0.0014+Math.min(pCombatRating,cCombatRating)*0.0014)*
        Math.pow((pRPM+cRPM)*0.5,0.70);

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
        (0.88+avgRPM*0.72);

    const pEnergyScale=
        0.72+
        newBattleClamp(pEnergy/0.0018,0,2.4)*0.22+
        newBattleClamp(pMomentum/0.040,0,2.2)*0.16;

    const cEnergyScale=
        0.72+
        newBattleClamp(cEnergy/0.0018,0,2.4)*0.22+
        newBattleClamp(cMomentum/0.040,0,2.2)*0.16;

    const pHit =
        contactEnergy *
        pEnergyScale *
        (0.62+pKB*1.28) *
        (0.64+pAttack*0.70) *
        (0.68+pRPM*0.50);

    const cHit =
        contactEnergy *
        cEnergyScale *
        (0.62+cKB*1.28) *
        (0.64+cAttack*0.70) *
        (0.68+cRPM*0.50);

    const momentumFactor=newBattleClamp(effectiveImpact/0.020,0,4.0);
    const hitRoll=0.90+Math.random()*0.20;
    const heavyFactor=
        Math.pow(momentumFactor,1.22)*
        (0.70+directness*0.55);

    const pForce=
        pHit*
        (0.78+directness*0.34)*
        (0.86+heavyFactor*0.44)*
        hitRoll;

    const cForce=
        cHit*
        (0.78+directness*0.34)*
        (0.86+heavyFactor*0.44)*
        hitRoll;

    // Rail riding is not immunity. A genuinely heavy collision can break the
    // rider's grip and send it back into normal stadium physics.
    const pRailBreakForce=cForce;
    const cRailBreakForce=pForce;
    const railBreakThreshold=0.0135;
    const railCollisionBreakThreshold=0.0012;

    // IMPORTANT: each Bey's own force is applied to the opponent.
    // This restores the directional Knockback model.
    const pKnockback=
        Math.max(
            0.0040+contactEnergy*0.095,
            pForce*(1.08-cDef*0.26)
        );

    const cKnockback=
        Math.max(
            0.0040+contactEnergy*0.095,
            cForce*(1.08-pDef*0.26)
        );

    // Opponent displacement.
    p.vx-=nx*pKnockback;
    p.vy-=ny*pKnockback;
    c.vx+=nx*pKnockback;
    c.vy+=ny*pKnockback;

    p.vx+=nx*cKnockback;
    p.vy+=ny*cKnockback;
    c.vx-=nx*cKnockback;
    c.vy-=ny*cKnockback;

    // Glancing/recoil component. Stronger hits change trajectory more.
    const followThrough=
        0.0012+
        effectiveImpact*0.024+
        Math.abs(tangentRelative)*0.0050+
        heavyFactor*0.0012;

    const pFollow=
        followThrough*
        (0.74+0.50*pAttack)*
        (0.70+0.40*pKB);

    const cFollow=
        followThrough*
        (0.74+0.50*cAttack)*
        (0.70+0.40*cKB);

    p.vx+=tx*pFollow;
    p.vy+=ty*pFollow;
    c.vx-=tx*cFollow;
    c.vy-=ty*cFollow;

    if(p.railEngaged && cRailBreakForce>=railBreakThreshold){
        p.railEngaged=false;
        p.railGrip=0;
        p.railSpeed=0;
        p.railExited=false;
        p.railExitRefractory=0.20;
        p.surfaceBounce=0.24;
        p.surfaceRecovery=0.16;
    }

    if(c.railEngaged && pRailBreakForce>=railBreakThreshold){
        c.railEngaged=false;
        c.railGrip=0;
        c.railSpeed=0;
        c.railExited=false;
        c.railExitRefractory=0.20;
        c.surfaceBounce=0.24;
        c.surfaceRecovery=0.16;
    }

    // Separate them so the same collision cannot fire repeatedly on adjacent
    // frames while they are still overlapping.
    const separation=minDist-dist;
    p.x-=nx*(separation*0.62+0.0040);
    p.y-=ny*(separation*0.62+0.0040);
    c.x+=nx*(separation*0.62+0.0040);
    c.y+=ny*(separation*0.62+0.0040);

    /*
      RPM damage is now attacker -> target.

      Big/high-RPM/high-Attack impacts remove more RPM from the Bey that
      actually received the hit. Knockback is separate, so a massive shove
      doesn't automatically equal an instant Spin Finish.
    */
    const baseRPMDamage=
        0.0046+
        effectiveImpact*0.041+
        Math.pow(momentumFactor,1.42)*0.0018;

    const pToCDamage=
        baseRPMDamage*
        (0.82+pAttack*0.58)*
        (0.72+pRPM*0.42)*
        (0.82+newBattleClamp(pMomentum/0.035,0,2.2)*0.22)*
        (1-cDef*0.30);

    const cToPDamage=
        baseRPMDamage*
        (0.82+cAttack*0.58)*
        (0.72+cRPM*0.42)*
        (0.82+newBattleClamp(cMomentum/0.035,0,2.2)*0.22)*
        (1-pDef*0.30);

    c.rpm=newBattleClamp(c.rpm-pToCDamage,0,1);
    p.rpm=newBattleClamp(p.rpm-cToPDamage,0,1);

    // Non-attack center clashes still matter: repeated contact has a real
    // RPM cost instead of becoming an endless low-energy tapping match.
    const attackBits=["Flat","Rush","Low Flat","Low Rush","Kick","Quake"];
    const pIsNonAttack=!attackBits.includes(p.bit?.name);
    const cIsNonAttack=!attackBits.includes(c.bit?.name);
    const bothNonAttackBits=pIsNonAttack&&cIsNonAttack;

    const centerCombatQuality=
        bothNonAttackBits
            ? 1.28+
              ((pAttack+pKB+cAttack+cKB)/396)*0.68
            : 1.0;

    if(bothNonAttackBits){
        const centerImpactBoost=centerCombatQuality;
        p.vx-=nx*(cKnockback*(centerImpactBoost-1)*0.52);
        p.vy-=ny*(cKnockback*(centerImpactBoost-1)*0.52);
        c.vx+=nx*(cKnockback*(centerImpactBoost-1)*0.52);
        c.vy+=ny*(cKnockback*(centerImpactBoost-1)*0.52);

        p.rpm=newBattleClamp(
            p.rpm-cToPDamage*(centerImpactBoost-1)*0.52,
            0,1
        );
        c.rpm=newBattleClamp(
            c.rpm-pToCDamage*(centerImpactBoost-1)*0.52,
            0,1
        );
    }

    const stabilityHit=
        0.007+
        effectiveImpact*0.085+
        heavyFactor*0.012;

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
        0.060+
        effectiveImpact*0.52+
        newBattleClamp(heavyFactor,0,2.5)*0.024;

    p.tiltLevel=newBattleClamp((p.tiltLevel||0)+tiltHit,0,1);
    c.tiltLevel=newBattleClamp((c.tiltLevel||0)+tiltHit,0,1);

    // Every impact changes the precession phase.
    p.motionPhase+=0.62+Math.random()*0.80;
    c.motionPhase+=0.62+Math.random()*0.80;
    p.motionPhase2+=0.34+Math.random()*0.65;
    c.motionPhase2+=0.34+Math.random()*0.65;

    const visualStrength=newBattleClamp(
        0.82+
        effectiveImpact/0.020*0.42+
        heavyFactor*0.12,
        0.82,1.95
    );

    p.hitFlash=0.16*visualStrength;
    c.hitFlash=0.16*visualStrength;
    p.impactScale=1.08+0.20*visualStrength;
    c.impactScale=1.08+0.20*visualStrength;

    // Used by the multi-ring visual system.
    NEW_BATTLE.lastImpact={
        x:(p.x+c.x)*0.5,
        y:(p.y+c.y)*0.5,
        strength:visualStrength,
        heavy:heavyFactor>1.25,
        time:performance.now()
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
}

// Launch angle and technique are selected on the stadium setup view.
// The selected launch state is passed directly into the physical engine.

window.addEventListener("DOMContentLoaded",()=>hookMenuButtons());
