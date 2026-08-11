
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
    cobalt_dragoon:{name:"Cobalt Dragoon",type:"Attack",tier:"Gold",spin:"Left",weight:37.8,card:{ovr:91,attack:91,knockback:90,defense:67,mobility:86,balance:69,stamina:75,burst:80},physics:{weightClass:"Heavy",centerOfGravity:"Medium",contactShape:"Upper Attack",recoil:"High",lockStrength:80,weightDistribution:"Uneven"},behavior:{attackStyle:"Upper",smashPower:78,upperPower:98,barragePower:76,counterPower:45,movementControl:78,spinRetention:70,lad:68,burstResistance:80,winConditions:{spin:42,burst:78,knockout:95,counter:52}},compatibility:{heights:{60:98,70:82,80:42},bits:{Rush:90,LowRush:88,Flat:84,LowFlat:88,Level:92,Kick:82,Point:80,HighNeedle:54,Quake:78,Hexa:70,Wedge:52,Ball:45,Orb:50,Elevate:94,Needle:40}},traits:["Left Spin","Upper Attack","Heavy","Aggressive","High Recoil"],personality:{aggression:96,control:72,consistency:70,risk:92}},
    leon_crest:{name:"Leon Crest",type:"Defense",tier:"Silver",spin:"Right",weight:35.0,card:{ovr:78,attack:66,knockback:64,defense:95,mobility:50,balance:84,stamina:72,burst:84},physics:{weightClass:"Medium",centerOfGravity:"High",contactShape:"Round",recoil:"Low",lockStrength:84,weightDistribution:"Outer"},behavior:{attackStyle:"Counter",smashPower:32,upperPower:18,barragePower:36,counterPower:82,movementControl:86,spinRetention:74,lad:76,burstResistance:84,winConditions:{spin:58,burst:64,knockout:24,counter:90}},compatibility:{heights:{60:72,70:84,80:94},bits:{Needle:92,HighNeedle:95,Point:82,Hexa:90,Wedge:88,Ball:86,Orb:84,Elevate:72,Level:68,Rush:38,LowRush:34,Flat:30,LowFlat:28,Kick:48,Quake:30}},traits:["Defense","Round","Counter","Plastic Frame","Stability"],personality:{aggression:20,control:90,consistency:78,risk:20}},
    unicorn_sting:{name:"Unicorn Sting",type:"Balance",tier:"Silver",spin:"Right",weight:33.3,card:{ovr:82,attack:76,knockback:73,defense:82,mobility:62,balance:88,stamina:85,burst:88},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Hybrid",recoil:"Medium",lockStrength:88,weightDistribution:"Outer"},behavior:{attackStyle:"Counter Attack",smashPower:62,upperPower:36,barragePower:64,counterPower:88,movementControl:78,spinRetention:84,lad:86,burstResistance:88,winConditions:{spin:78,burst:76,knockout:48,counter:92}},compatibility:{heights:{60:96,70:82,80:48},bits:{Point:96,Level:88,Hexa:90,Elevate:82,Needle:84,HighNeedle:86,Ball:88,Orb:86,Wedge:80,Rush:68,LowRush:64,Flat:56,LowFlat:54,Kick:82,Quake:50}},traits:["Balance","Counter","Round","Stamina","Versatile"],personality:{aggression:58,control:88,consistency:86,risk:40}},
    knight_shield:{name:"Knight Shield",type:"Defense",tier:"Bronze",spin:"Right",weight:32.3,card:{ovr:74,attack:69,knockback:76,defense:91,mobility:52,balance:90,stamina:78,burst:84},physics:{weightClass:"Medium",centerOfGravity:"Medium",contactShape:"Round Tri-Wing",recoil:"High",lockStrength:84,weightDistribution:"Balanced"},behavior:{attackStyle:"Counter",smashPower:48,upperPower:24,barragePower:42,counterPower:90,movementControl:92,spinRetention:76,lad:72,burstResistance:84,winConditions:{spin:62,burst:68,knockout:34,counter:96}},compatibility:{heights:{60:74,70:82,80:90},bits:{Needle:98,HighNeedle:96,Point:84,Hexa:92,Wedge:90,Ball:86,Orb:84,Elevate:70,Level:62,Rush:38,LowRush:34,Flat:32,LowFlat:28,Kick:50,Quake:30}},traits:["Defense","Counter","Round","High Recoil","Stationary"],personality:{aggression:24,control:94,consistency:86,risk:18}},
    tyranno_beat:{name:"Tyranno Beat",type:"Attack",tier:"Bronze",spin:"Right",weight:37.0,card:{ovr:76,attack:86,knockback:82,defense:70,mobility:78,balance:73,stamina:63,burst:82},physics:{weightClass:"Heavy",centerOfGravity:"Medium",contactShape:"Elliptical",recoil:"High",lockStrength:82,weightDistribution:"Outer"},behavior:{attackStyle:"Elliptical Smash",smashPower:84,upperPower:54,barragePower:66,counterPower:62,movementControl:76,spinRetention:64,lad:62,burstResistance:82,winConditions:{spin:30,burst:70,knockout:82,counter:72}},compatibility:{heights:{60:92,70:86,80:46},bits:{Quake:96,Flat:90,LowFlat:92,Rush:84,LowRush:82,Point:72,Level:76,Kick:80,HighNeedle:44,Needle:36,Hexa:52,Wedge:45,Ball:28,Orb:32,Elevate:48}},traits:["Attack","Elliptical","Heavy","Counter Attack","Recoil"],personality:{aggression:86,control:68,consistency:58,risk:82}}

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
// ZONE POSITIONS
//=========================

const ZONE_POSITIONS={

    // TOP
    TopLeft:{x:330,y:245},
    TopCenter:{x:500,y:300},
    TopRight:{x:670,y:245},

    // MIDDLE
    LeftMid:{x:300,y:420},
    Center:{x:500,y:430},
    RightMid:{x:700,y:420},

    // BOTTOM
    BottomLeft:{x:360,y:560},
    BottomCenter:{x:500,y:585},
    BottomRight:{x:640,y:560},

    // X-RAILS
    LeftRail:{x:215,y:300},
    RightRail:{x:785,y:300},

    // X-EXIT
    XRailExit:{x:500,y:75},

    // FINISH AREAS
    LeftPocket:{x:255,y:705},
    XtremeZone:{x:500,y:712},
    RightPocket:{x:745,y:705}

};

//=========================
// STADIUM ENGINE
//=========================

const STADIUM_MAP = {

    TopLeft:{
        neighbors:["TopCenter","LeftMid"]
    },

    TopCenter:{
        neighbors:["TopLeft","TopRight","Center","XRailExit"]
    },

    TopRight:{
        neighbors:["TopCenter","RightMid"]
    },

    LeftMid:{
        neighbors:["TopLeft","Center","BottomLeft","LeftRail"]
    },

    Center:{
        neighbors:[
            "TopCenter",
            "LeftMid",
            "RightMid",
            "BottomCenter"
        ]
    },

    RightMid:{
        neighbors:[
            "TopRight",
            "Center",
            "BottomRight",
            "RightRail"
        ]
    },

    BottomLeft:{
        neighbors:[
            "LeftMid",
            "BottomCenter",
            "LeftPocket"
        ]
    },

    BottomCenter:{
        neighbors:[
            "BottomLeft",
            "Center",
            "BottomRight",
            "XtremeZone"
        ]
    },

    BottomRight:{
        neighbors:[
            "RightMid",
            "BottomCenter",
            "RightPocket"
        ]
    },

    LeftRail:{
        neighbors:[
            "LeftMid",
            "XRailExit"
        ]
    },

    RightRail:{
        neighbors:[
            "RightMid",
            "XRailExit"
        ]
    },

    XRailExit:{
        neighbors:[
            "TopCenter"
        ]
    },

    XtremeZone:{
        neighbors:[]
    },

    LeftPocket:{
        neighbors:[]
    },

    RightPocket:{
        neighbors:[]
    }

};

//=========================
// RENDER STADIUM
//=========================

function renderStadium(){

return `

<div class="stadium">

<svg class="stadium-svg"
viewBox="0 0 1000 900">

    <!-- LEFT RAIL -->

<path
    class="rail-track"
    d="
        M275 610
        C205 520 185 360 220 245
        C255 150 345 90 450 75
    "
/>

<!-- RIGHT RAIL -->

<path
    class="rail-track"
    d="
        M725 610
        C795 520 815 360 780 245
        C745 150 655 90 550 75
    "
/>

<!-- TOP CONNECTOR -->

<path
    class="rail-track"
    d="
        M450 75
        L470 75

        M530 75
        L550 75
    "
/>

    <!-- BATTLE BOWL -->

<path
    class="battleOuter"

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

/>

<path
    class="battleInner"

    d="

    M295 235

    Q500 155 705 235

    Q770 305 755 455

    Q745 535 690 575

    Q625 615 555 585

    L445 585

    Q375 615 310 575

    Q255 535 245 455

    Q230 305 295 235

    Z

    "

/>

    <!-- X EXIT -->

    <rect
        class="xExit"
        x="455"
        y="62"
        width="90"
        height="40"
        rx="12"
    />

    <!-- LEFT OVER -->

<circle
    class="overZone"
    cx="255"
    cy="705"
    r="38"
/>

<!-- XTREME -->

<rect
    class="xtremeZone"
    x="435"
    y="690"
    width="130"
    height="45"
    rx="18"
/>

<!-- RIGHT OVER -->

<circle
    class="overZone"
    cx="745"
    cy="705"
    r="38"
/>

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

</svg>

</div>

`;

}

//=========================
// BATTLE STATE / HUD 1.0
//=========================
function getBeyState(key){
    const b=Game.battle[key];
    if(!b) return "Stable";
    if(b.spin<=25 || b.balance<=25) return "Critical";
    if(b.behavior==="recovering" || b.behavior==="retreating" || (b.spin<55 && b.balance<65)) return "Recovering";
    if(b.behavior==="chasing" && b.momentum>=10) return "Pressuring";
    if(b.spin<60 || b.balance<60) return "Pressured";
    const blade=key==="player" ? Game.player.blade : Game.cpu.blade;
    if(blade && (blade.type==="Defense" || blade.type==="Stamina") && b.momentum>=0) return "Defensive";
    if(b.spin>=85 && b.balance>=85 && b.momentum>10) return "Strong";
    return "Stable";
}
function getStateDetail(key){
    const b=Game.battle[key];
    switch(getBeyState(key)){
        case "Pressuring": return "forcing the action";
        case "Recovering": return "trying to stabilize";
        case "Pressured": return "under pressure";
        case "Critical": return "one major exchange from a finish";
        case "Defensive": return "protecting its position";
        case "Strong": return "in control of its position";
        default: return b ? "holding a stable line" : "";
    }
}
function clampBattleValue(value,min=0,max=100){
    return Math.max(min,Math.min(max,value));
}

//=========================
// BATTLE ADVANTAGE STATE
//=========================
function getBattleAdvantageState(){
    const p=Game.battle.player, c=Game.battle.cpu;
    if(!p || !c) return {label:"NEUTRAL",leader:null,detail:"Neither Bey has established control."};

    const pCritical=p.spin<=30 || p.balance<=30;
    const cCritical=c.spin<=30 || c.balance<=30;
    if(pCritical && !cCritical) return {label:"YOU IN DANGER",leader:"cpu",detail:`${Game.player.blade.name} is one major exchange from a finish.`};
    if(cCritical && !pCritical) return {label:"CPU IN DANGER",leader:"player",detail:`${Game.cpu.blade.name} is one major exchange from a finish.`};

    const diff=(p.momentum-c.momentum)+(p.spin-c.spin)*0.18+(p.balance-c.balance)*0.12;
    if(diff>=32) return {label:"YOU ADVANTAGE",leader:"player",detail:`${Game.player.blade.name} is controlling the pace and the next lane.`};
    if(diff<=-32) return {label:"CPU ADVANTAGE",leader:"cpu",detail:`${Game.cpu.blade.name} is controlling the pace and the next lane.`};
    if(diff>=14) return {label:"YOU PRESSURE",leader:"player",detail:`${Game.player.blade.name} is starting to dictate the exchange.`};
    if(diff<=-14) return {label:"CPU PRESSURE",leader:"cpu",detail:`${Game.cpu.blade.name} is starting to dictate the exchange.`};
    return {label:"NEUTRAL",leader:null,detail:"Neither Bey has established a lasting advantage."};
}

function getDecisionProfile(intent){
    const profiles={
        attack:["HIGH","HIGH","Convert the opening into damage."],
        chase:["MEDIUM","HIGH","Keep pressure and cut off recovery."],
        counter:["HIGH","HIGH","Huge payoff if the timing is right."],
        brace:["LOW","MEDIUM","Reduce the cost of taking the next hit."],
        evade:["MEDIUM","LOW","Give up contact to improve survival."],
        escape:["MEDIUM","HIGH","Escape danger and potentially reverse the position."],
        stabilize:["LOW","MEDIUM","Recover balance and preserve the round."],
        center:["LOW","MEDIUM","Trade immediate aggression for control."],
        hold:["LOW","LOW","Protect spin and wait for a better lane."]
    };
    const p=profiles[intent] || ["MEDIUM","MEDIUM","Create a better position."];
    return {risk:p[0],reward:p[1],desc:p[2]};
}

function recordPlayerIntent(intent){
    if(!Game.battle.playerIntentHistory) Game.battle.playerIntentHistory=[];
    Game.battle.playerIntentHistory.push(intent);
    if(Game.battle.playerIntentHistory.length>5) Game.battle.playerIntentHistory.shift();
}

//=========================
// BATTLE BRAIN 5.0 HELPERS
//=========================
function getBattleCombo(blader){
    const side=Game[blader];
    return side && side.blade && side.ratchet && side.bit
        ? calculateComboStats(side.blade,side.ratchet,side.bit)
        : null;
}

function getLaunchTechniqueText(blader){
    const launch=Game[blader].launch;
    const spin=Game[blader].spin || "Right";
    const naturalSide=spin==="Right" ? "Left" : "Right";
    const descriptions={
        "Center":"aims for the center to establish control",
        "X-Rail":`commits to the ${naturalSide}-side X Rail for a fast exit`,
        "Direct Clash":"tries to meet the opponent early",
        "Drop Launch":"drops toward the pocket line to change the attack angle",
        "Wide Circle":"takes a wide line before closing",
        "Reverse X-Dash":"uses the rail to reverse the attack line",
        "X-Rail Dash":"commits to the rail and accelerates through the ride"
    };
    return descriptions[launch.technique] || "takes a neutral opening line";
}

function getLaunchQualityText(quality){
    return {
        Perfect:"maximum control, clean movement and strong opening spin",
        Good:"strong control, efficient movement and a healthy opening",
        Okay:"clean launch with no major advantage",
        Bad:"a shaky release that costs control and some spin",
        Horrible:"a compromised release that starts the Bey fighting itself"
    }[quality] || "neutral";
}

function getLaunchStory(blader){
    const side=Game[blader], launch=side?.launch||{};
    const name=side?.blade?.name||"The Bey";
    const quality=launch.quality||"Okay";
    const technique=launch.technique||"Center";
    const angle=launch.angle||"Flat";
    const qualityLines={
        Perfect:[`${name} leaves the launcher clean and immediately finds its rhythm.`,`The release is crisp. ${name} gets the movement it was built for without wasting much spin.`,`That is a beautiful launch — ${name} enters the stadium with control already established.`],
        Good:[`${name} gets a strong release and settles quickly into the intended line.`,`A solid launch. ${name} has enough control to follow the plan without giving away much spin.`,`Good release from ${name}; the opening movement looks deliberate rather than desperate.`],
        Okay:[`${name} gets away cleanly, but there is no free advantage in the opening.`,`A neutral release. ${name} has the tools, but now the movement has to create the opportunity.`,`${name} is clean off the launcher. From here, the first line it takes will matter.`],
        Bad:[`${name} comes off the launcher a little awkwardly. The first movement is already costing it.`,`That release was not clean. ${name} has to spend part of its opening correcting the line.`,`${name} gets into the stadium, but the launch did not give it the control it wanted.`],
        Horrible:[`${name} stumbles out of the launch. It is moving, but it is spending valuable spin getting organized.`,`A rough release puts ${name} on the back foot immediately.`,`${name} survives the launch, but the intended line is already compromised.`]
    };
    const techniqueLines={
        Center:`${name} is looking for the center and a stable first line.`,
        "X-Rail":`${name} is hunting the X Rail for a faster route into the battle.`,
        "X-Rail Dash":`${name} is committed to the rail; the goal is to turn the ride into speed at the exit.`,
        "Reverse X-Dash":`${name} is trying to bend the opening back toward the rail instead of taking the obvious route.`,
        "Direct Clash":`${name} is coming straight for the opponent — no time wasted looking for a second chance.`,
        "Drop Launch":`${name} drops into a lower line, trading some freedom of movement for a different attack angle.`,
        "Wide Circle":`${name} takes the long way around, building a line before closing.`
    };
    const angleLines={
        "Flat":"The flat release favors a cleaner, more predictable path.",
        "Slight Tilt":"The slight tilt gives the Bey more lateral movement, but asks it to manage its balance.",
        "Hard Tilt":"The hard tilt is the gamble: more movement and attack potential, but more energy spent correcting the line."
    };
    const lines=qualityLines[quality]||qualityLines.Okay;
    return `${lines[Math.floor(Math.random()*lines.length)]} ${techniqueLines[technique]||""} ${angleLines[angle]||""} ${getLaunchQualityText(quality)}.`;
}

function getLaunchImpactSummary(blader){
    const side=Game[blader], launch=side?.launch||{};
    const name=side?.blade?.name||"The Bey";
    const q=launch.quality||"Okay";
    if(q==="Perfect") return `${name} has the cleanest opening: extra spin, better movement and extra control.`;
    if(q==="Good") return `${name} gets a useful opening edge — better movement and enough spin/control to settle into its plan.`;
    if(q==="Bad") return `${name} starts behind the plan: reduced opening spin and a shakier line.`;
    if(q==="Horrible") return `${name} starts compromised. The release costs spin and balance before the first real exchange even happens.`;
    return `${name} starts neutral. The first exchange will decide who turns movement into momentum.`;
}

function getRecentBattleStory(){
    const events=Game.battle.sequenceEvents||[];
    if(events.length) return events.slice(-2).map(e=>e.text).join(" ");
    const history=Game.battle.history||[];
    const recent=history.slice().reverse().find(e=>e && e.title==="BATTLE MOMENT");
    return recent?.text||"";
}

function getFinishContext(bey,finish){
    const loser=Game.battle[bey];
    const other=bey==="player" ? "cpu" : "player";
    const combo=getBattleCombo(bey);
    const oppCombo=getBattleCombo(other);
    if(finish==="Over Finish"){
        const power=combo ? Math.round((combo.stats.attack*0.45)+(combo.stats.knockback*0.55)) : 0;
        return power>=85
            ? "The pocket pressure was too much to recover from."
            : "The Bey was caught too deep to recover.";
    }
    if(finish==="Xtreme Finish"){
        const power=combo ? Math.round((combo.stats.attack*0.45)+(combo.stats.knockback*0.55)) : 0;
        return power>=85
            ? "The high-speed attack created a rare Xtreme route."
            : "The exchange redirected the Bey into a high-speed Xtreme line.";
    }
    if(finish==="Spin Finish"){
        return loser && loser.spin<=0 ? "Its spin finally gives out." : "The Bey can no longer sustain the battle.";
    }
    return "";
}

function renderBattleStatus(key){
    const b=Game.battle[key];
    const side=key==="player" ? Game.player : Game.cpu;
    if(!b || !side.blade) return "";
    const name=side.blade.name;
    const state=getBeyState(key);
    const stamina=Math.round(clampBattleValue(b.spin));
    const balance=Math.round(clampBattleValue(b.balance));
    const momentum=Math.round(clampBattleValue(50+b.momentum*0.5));
    return `<div style="padding:8px 9px;border-radius:9px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);font-size:10px;">
        <div style="display:flex;justify-content:space-between;gap:6px;"><strong>${name}</strong><strong>${state}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;"><span>STAMINA</span><span>${stamina}%</span></div>
        <div style="height:6px;background:rgba(255,255,255,.1);border-radius:6px;overflow:hidden;margin-top:3px;"><div style="width:${stamina}%;height:100%;background:#e7e7e7;"></div></div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;opacity:.72;"><span>Balance ${balance}%</span><span>Momentum ${momentum}%</span></div>
        <div style="margin-top:3px;opacity:.62;">NOW · ${formatBattleZone(b.zone)} · LAUNCH ${side.launch?.quality||"Okay"}</div>
    </div>`;
}
function renderBattleStatusPanel(){
    const a=getBattleAdvantageState();
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:7px 0;">${renderBattleStatus("player")}${renderBattleStatus("cpu")}</div>
    <div style="padding:6px 8px;border-radius:8px;background:rgba(255,212,59,.05);border:1px solid rgba(255,255,255,.07);font-size:9px;">
      <strong>${a.label}</strong> · ${a.detail}${Game.battle.cpuRead && Game.battle.cpuRead!=="No strong read" ? ` · CPU: ${Game.battle.cpuRead}` : ""}
    </div>`;
}

//=========================
// RENDER BEYS
//=========================

function renderBeys(){

    const player=document.getElementById("playerBey");
    const cpu=document.getElementById("cpuBey");
    const playerLabel=document.getElementById("playerBeyLabel");
    const cpuLabel=document.getElementById("cpuBeyLabel");

    if(!player || !cpu) return;

    const p=ZONE_POSITIONS[Game.battle.player.zone];
    const c=ZONE_POSITIONS[Game.battle.cpu.zone];

    if(!p || !c) return;

    let playerX=p.x;
    let cpuX=c.x;

    if(Game.battle.player.zone===Game.battle.cpu.zone){

        playerX-=12;
        cpuX+=12;

    }

    player.setAttribute("cx",playerX);
    player.setAttribute("cy",p.y);

    cpu.setAttribute("cx",cpuX);
    cpu.setAttribute("cy",c.y);

    if(playerLabel){
        playerLabel.setAttribute("x",playerX);
        playerLabel.setAttribute("y",p.y-18);
        playerLabel.textContent="YOU";
    }
    if(cpuLabel){
        cpuLabel.setAttribute("x",cpuX);
        cpuLabel.setAttribute("y",c.y-18);
        cpuLabel.textContent="CPU";
    }

}

//=========================
// COLLISION RADIUS
//=========================

const COLLISION_RADIUS = {

    TopLeft:["TopCenter","LeftMid"],

    TopCenter:[
        "TopLeft",
        "TopRight",
        "Center",
        "XRailExit"
    ],

    TopRight:[
        "TopCenter",
        "RightMid"
    ],

    LeftMid:[
        "TopLeft",
        "Center",
        "BottomLeft",
        "LeftRail"
    ],

    Center:[
        "TopCenter",
        "LeftMid",
        "RightMid",
        "BottomCenter"
    ],

    RightMid:[
        "TopRight",
        "Center",
        "BottomRight",
        "RightRail"
    ],

    BottomLeft:[
        "LeftMid",
        "BottomCenter",
        "LeftPocket"
    ],

    BottomCenter:[
        "Center",
        "BottomLeft",
        "BottomRight"
    ],

    BottomRight:[
        "RightMid",
        "BottomCenter",
        "RightPocket"
    ],

    LeftRail:[
        "LeftMid",
        "XRailExit"
    ],

    RightRail:[
        "RightMid",
        "XRailExit"
    ],

    XRailExit:[
        "TopCenter",
        "LeftRail",
        "RightRail"
    ],

    LeftPocket:[
        "BottomLeft"
    ],

    RightPocket:[
        "BottomRight"
    ]

};

//=========================
// MOVE BEY
//=========================

function moveBey(bey,newZone){

    const target = Game.battle[bey];

    // Save previous position
    target.previousZone = target.zone;

    // Move
    target.zone = newZone;

    // Reset event flags
    target.rail = false;
    target.xExit = false;

    // Rail check
    if(newZone === "LeftRail" || newZone === "RightRail"){

        target.rail = true;

    }

    // X-Rail Exit check
    if(newZone === "XRailExit"){

        target.xExit = true;

    }

}

//=========================
// NEXT NATURAL ZONE
//=========================

function getNaturalMovement(bey){

    const data=Game.battle[bey];

    // Stay on the rail for multiple ticks
    // so speed can build.

    if(
        data.zone==="LeftRail" ||
        data.zone==="RightRail"
    ){

        return data.zone;

    }

    // X Exit leaves the rail
    if(data.zone==="XRailExit"){

        return "TopCenter";

    }

    const neighbors=
        STADIUM_MAP[data.zone].neighbors;

    if(neighbors.length===0){

        return data.zone;

    }

    if(data.direction==="Clockwise"){

        return neighbors[0];

    }

    return neighbors[
        neighbors.length-1
    ];

}

//=========================
// BATTLE TICK
//=========================

function battleTick(){

    const player=Game.battle.player;
    const cpu=Game.battle.cpu;

    const oldPlayerZone=player.zone;
    const oldCpuZone=cpu.zone;

    const oldPlayerRailSpeed=player.railSpeed;
    const oldCpuRailSpeed=cpu.railSpeed;

    // -------------------------
    // RAIL INTERCEPTION
    // -------------------------

    const playerOnRail=player.rail;
    const cpuOnRail=cpu.rail;

    checkRailInterception();

    // -------------------------
    // COLLISION BEFORE MOVEMENT
    // -------------------------

    if(canCollide(player.zone,cpu.zone)){

        resolveCollision();

        saveBattleSequence(

            "💥 COLLISION",

            `${Game.player.blade.name} and ${Game.cpu.blade.name} collide.

${Game.player.blade.name}
Spin: ${Math.round(player.spin)}
Balance: ${Math.round(player.balance)}

${Game.cpu.blade.name}
Spin: ${Math.round(cpu.spin)}
Balance: ${Math.round(cpu.balance)}`

        );

        renderBattleSequence();

        return;

    }

    // -------------------------
    // NORMAL MOVEMENT
    // -------------------------

    const playerDestination=
        getNaturalMovement("player");

    const cpuDestination=
        getNaturalMovement("cpu");

    moveBey(
        "player",
        playerDestination
    );

    moveBey(
        "cpu",
        cpuDestination
    );

    // -------------------------
    // BUILD EVENT TEXT
    // -------------------------

    let eventText="";

    // Player movement
    if(oldPlayerZone!==player.zone){

        eventText+=
`${Game.player.blade.name} moves:

${oldPlayerZone}
→ ${player.zone}

`;

    }

    // CPU movement
    if(oldCpuZone!==cpu.zone){

        eventText+=
`${Game.cpu.blade.name} moves:

${oldCpuZone}
→ ${cpu.zone}

`;

    }

    if(eventText===""){

        eventText=
`Both Beys continue moving.

${Game.player.blade.name}: ${player.zone}

${Game.cpu.blade.name}: ${cpu.zone}`;

    }

    // -------------------------
    // SAVE SEQUENCE
    // -------------------------

    saveBattleSequence(

        "BATTLE MOVEMENT",

        eventText

    );

    renderBattleSequence();

}

//=========================
// DIRECTIONAL COUNTER
//=========================

function counterDestination(defender, attacker){

    const defenderZone = Game.battle[defender].zone;

    // Defender's position determines where
    // the attacker gets redirected.

    if(defenderZone==="LeftMid"){

        return [
            "RightMid",
            "BottomLeft",
            "LeftPocket"
        ];

    }

    if(defenderZone==="RightMid"){

        return [
            "LeftMid",
            "BottomRight",
            "RightPocket"
        ];

    }

    if(defenderZone==="TopCenter"){

        return [
            "TopLeft",
            "TopRight",
            "XRailExit"
        ];

    }

    if(defenderZone==="Center"){

        return [
            "BottomCenter",
            "LeftMid",
            "RightMid"
        ];

    }

    return STADIUM_MAP[
        Game.battle[attacker].zone
    ].neighbors;

}

//=========================
// BATTLE EVENTS
//=========================

function checkBattleEvents(){

    const player = Game.battle.player;

    const cpu = Game.battle.cpu;
 
checkRailInterception();
 
    // Collision

    if(canCollide(player.zone,cpu.zone)){

        resolveCollision();

        return;

    }

    // Rail Exit

    if(player.xExit){

        resolveRailExit("player");

    }

    if(cpu.xExit){

        resolveRailExit("cpu");

    }

    // Pocket danger

    if(player.zone==="LeftPocket" || player.zone==="RightPocket"){

        resolvePocket("player");

    }

    if(cpu.zone==="LeftPocket" || cpu.zone==="RightPocket"){

        resolvePocket("cpu");

    }

}

//=========================
// COLLISION CHECK
//=========================

function canCollide(playerZone,cpuZone){

    if(playerZone===cpuZone){

        return true;

    }

    const nearby =
        COLLISION_RADIUS[playerZone];

    if(!nearby){

        return false;

    }

    return nearby.includes(cpuZone);

}

//=========================
// IMPACT SYSTEM
//=========================

function getImpactData(attacker,defender){

    const attackerState=Game.battle[attacker];
    const defenderState=Game.battle[defender];

    const attackerCombo=
        attacker==="player"
        ? calculateComboStats(
            Game.player.blade,
            Game.player.ratchet,
            Game.player.bit
        )
        : calculateComboStats(
            Game.cpu.blade,
            Game.cpu.ratchet,
            Game.cpu.bit
        );

    const defenderCombo=
        defender==="player"
        ? calculateComboStats(
            Game.player.blade,
            Game.player.ratchet,
            Game.player.bit
        )
        : calculateComboStats(
            Game.cpu.blade,
            Game.cpu.ratchet,
            Game.cpu.bit
        );

    // Base stats
    const knockback=
        attackerCombo.stats.knockback;

    const attack=
        attackerCombo.stats.attack;

    const defense=
        defenderCombo.stats.defense+
        defenderState.defenseBonus;

    // Speed multiplier
    let speedMultiplier=1;

    if(attackerState.rail){

        speedMultiplier=1.6;

    }else if(attackerState.speed>=80){

        speedMultiplier=1.25;

    }else if(attackerState.speed>=50){

        speedMultiplier=1.1;

    }

    // Momentum multiplier
    const momentumMultiplier=
        1+
        Math.abs(attackerState.momentum)/100;

    // Contact quality. A rail exit striking a centered Bey is a special
    // high-speed collision with extra impact/displacement potential.
    let contactMultiplier=1;
    if(attackerState.zone===defenderState.zone) contactMultiplier=1.15;
    if(attackerState.rail) contactMultiplier*=1.35;
    if(attackerState.railExitStrike){
        contactMultiplier*=attackerState.railExitTargetZone==="Center" ? 1.42 : 1.22;
    }

    const rawImpact=
        knockback*
        speedMultiplier*
        momentumMultiplier*
        contactMultiplier;

    const attackImpact=
        attack*
        speedMultiplier;

    const effectiveImpact=
        Math.max(
            0,
            rawImpact+
            attackImpact-
            defense
        );

    return{

        rawImpact,
        effectiveImpact,
        speedMultiplier,
        contactMultiplier

    };

}

//=========================
// COUNTER SYSTEM
//=========================

function calculateCounter(defender,attacker){

    const defenderState=Game.battle[defender];
    const attackerState=Game.battle[attacker];

    const defenderCombo=
        defender==="player"
        ? calculateComboStats(
            Game.player.blade,
            Game.player.ratchet,
            Game.player.bit
        )
        : calculateComboStats(
            Game.cpu.blade,
            Game.cpu.ratchet,
            Game.cpu.bit
        );

    const defenderKnockback=
        defenderCombo.stats.knockback;

    const defenderDefense=
        defenderCombo.stats.defense+
        defenderState.defenseBonus;

    // Counter timing
    let timing=1;

    if(
        Game[defender].currentMove==="Counter"
    ){

        timing=1.5;

    }

    // Rail contact gives the counter
    // more opportunity to redirect momentum
    let position=1;

    if(attackerState.rail){

        position=1.35;

    }

    const stability=
        (
            defenderDefense+
            defenderState.balance
        )/200;

    const counterPower=
        defenderKnockback*
        timing*
        position*
        stability;

    const incoming=
        getImpactData(
            attacker,
            defender
        ).effectiveImpact;

    return{

        power:counterPower,

        incoming,

        success:
            counterPower>incoming

    };

}

//=========================
// COLLISION
//=========================

function resolveCollision(){

    let attacker="player";
    let defender="cpu";

    const playerPower=
        Game.battle.player.momentum;

    const cpuPower=
        Game.battle.cpu.momentum;

    // Determine who is bringing more momentum
    if(cpuPower>playerPower){

        attacker="cpu";
        defender="player";

    }

    const attackerState=
        Game.battle[attacker];

    const defenderState=
        Game.battle[defender];

    // Counter attempt
    const counter=
        calculateCounter(
            defender,
            attacker
        );

    if(
        Game[defender].currentMove==="Counter" &&
        counter.success
    ){

        console.log(
            defender+
            " COUNTERS "+
            attacker
        );

        attackerState.balance-=8;
        attackerState.spin-=5;

        attackerState.momentum*=-0.75;

        pushBey(attacker);

        renderBeys();

        return;

    }

    // Normal impact
    const impact=
        getImpactData(
            attacker,
            defender
        );

    console.log(
        "IMPACT:",
        impact
    );

    const damage=
        Math.max(
            1,
            Math.round(
                impact.effectiveImpact/18
            )
        );

    defenderState.spin-=damage;
    defenderState.balance-=
        Math.max(
            1,
            Math.round(damage*0.65)
        );

    // Convert impact into momentum
    attackerState.momentum+=
        impact.effectiveImpact/10;

    defenderState.momentum-=
        impact.effectiveImpact/12;

   // Push according to impact
pushBey(defender);

// Check if the knockback pushed the Bey
// into a dangerous stadium area
if(checkStadiumDanger(defender)){

    return;

}

renderBeys();

}

//=========================
// KNOCKBACK
//=========================

function pushBey(bey){
    const battle=Game.battle[bey];
    if(!battle) return;

    const opponentKey=bey==="player" ? "cpu" : "player";
    const opponent=Game.battle[opponentKey];
    const combo=getBattleCombo(bey);
    const attacker=getBattleCombo(battle.incomingFrom||opponentKey);
    const defense=combo?.stats?.defense||70;
    const balance=battle.balance;
    const incoming=Math.max(0,battle.incomingForce||0);
    const attackerKnockback=attacker?.stats?.knockback||70;
    const attackerAttack=attacker?.stats?.attack||70;

    const railExitBonus=battle.railExitStrike
        ? (battle.railExitTargetZone==="Center" ? 24 : 10)
        : 0;
    const force=incoming*0.92+
        attackerKnockback*0.34+
        attackerAttack*0.20+
        Math.max(0,battle.momentum)*0.20+
        railExitBonus-
        defense*0.12-
        balance*0.08;

    let pushes=1;
    if(force>38) pushes=2;
    if(force>70) pushes=3;
    if(force>105) pushes=4;
    if(force>140) pushes=5;

    if(defense>92 && balance>82) pushes=Math.max(1,pushes-1);

    for(let i=0;i<pushes;i++){
        const currentZone=battle.zone;
        const neighbors=STADIUM_MAP[currentZone]?.neighbors;
        if(!neighbors || neighbors.length===0) break;

        let destinations=neighbors.filter(zone=>zone!==battle.previousZone);
        if(!destinations.length) destinations=neighbors;

        // High force favors dangerous outward routes; stable defenders favor
        // safe recovery lanes.
        const dangerZones=["LeftPocket","RightPocket","LeftRail","RightRail","XRailExit","XtremeZone"];
        const attackPower=(attackerAttack*0.45)+(attackerKnockback*0.55);
        const preferDanger=force>52 && (attackerKnockback>76 || attackerAttack>78);
        const scored=destinations.map(zone=>{
            let score=Math.random()*8;
            if(zone===opponent.zone) score-=8;
            if(dangerZones.includes(zone)){
                score += preferDanger ? 32 : -10;
                if(zone==="XtremeZone") score += (force>88 && attackerKnockback>84) ? 22 : -18;
                if((zone==="LeftPocket" || zone==="RightPocket") && attackPower>82) score += 14;
            }
            if(zone==="Center") score+=defense>85?8:-2;
            if(zone===battle.previousZone) score-=5;
            return {zone,score};
        }).sort((a,b)=>b.score-a.score);

        const oldZone=battle.zone;
        const destination=scored[0]?.zone;
        if(!destination) break;
        moveBey(bey,destination);
        battle.previousZone=oldZone;

        if(checkStadiumDanger(bey)) return;
    }

    battle.incomingForce=0;
    battle.incomingFrom=null;
}


 //=========================
// CHECK STADIUM DANGER
//=========================

function checkStadiumDanger(bey){
    const battle=Game.battle[bey];
    if(!battle) return false;
    const zone=battle.zone;

    // POCKET: attack/knockback creates the opportunity; defense/balance/stamina
    // determine whether the defender can fight its way back out.
    if(zone==="LeftPocket" || zone==="RightPocket"){
        const combo=getBattleCombo(bey);
        const incoming=Math.max(0,battle.incomingForce||0);
        const recovery=
            (combo?.stats?.defense||70)*0.20+
            battle.balance*0.30+
            (combo?.stats?.stamina||70)*0.12+
            (combo?.stats?.mobility||70)*0.08-
            incoming*0.18;
        const roll=Math.random()*100;
        const safeChance=Math.max(10,Math.min(78,recovery));
        if(roll>safeChance){
            Game.battle.finish="Over Finish";
            Game.battle.finishPoints=2;
            Game.battle.winner=bey==="player" ? "cpu" : "player";
            Game.battle.finishCause="Pocketed";
            endBattleRound();
            return true;
        }
        // A successful recovery pulls the Bey back toward the nearest safe lane.
        const escapeZone=zone==="LeftPocket" ? "BottomLeft" : "BottomRight";
        moveBey(bey,escapeZone);
        battle.balance=Math.min(100,battle.balance+3);
        battle.momentum=Math.max(-100,battle.momentum-8);
        Game.battle.lastEvent="pocketEscape";
        return false;
    }

    // XTREME: the Xtreme Zone is the actual finish area. Reaching the
    // X Exit is an attack opportunity, not itself a finish.
    if(zone==="XtremeZone"){
        const combo=getBattleCombo(bey);
        const power=
            (combo?.stats?.attack||60)*0.45+
            (combo?.stats?.knockback||60)*0.55;
        const incoming=Math.max(0,battle.incomingForce||0);
        const momentum=Math.abs(battle.momentum||0);
        const aggressive=(power>=80 || incoming>=62);
        const chance=Math.max(35,Math.min(88,
            38 + (power-70)*0.45 + (incoming-50)*0.32 + momentum*0.16
        ));
        if(aggressive && incoming>=55 && Math.random()*100 < chance){
            Game.battle.finish="Xtreme Finish";
            Game.battle.finishPoints=3;
            Game.battle.winner=bey==="player" ? "cpu" : "player";
            Game.battle.finishCause="Xtreme";
            endBattleRound();
            return true;
        }
        // If the Bey reaches the Xtreme lane but survives the first check,
        // bounce it back into the stadium instead of allowing repeated checks.
        moveBey(bey,"BottomCenter");
        battle.momentum=Math.max(-100,battle.momentum-20);
        battle.balance=Math.max(15,battle.balance-8);
        Game.battle.lastEvent="xtremeEscape";
        return false;
    }

    return false;
}


//=========================
// RAIL EXIT
//=========================

function resolveRailExit(bey){

    console.log(bey+" exited the X-Rail!");

}

//=========================
// POCKET
//=========================

function resolvePocket(bey){

    console.log(bey+" is in pocket danger!");

}

//=========================
// ASSIGN STADIUM SIDES
//=========================

function assignStadiumSides(){

    // Swap every 2 rounds
    const swap=Math.floor((Game.match.round-1)/2)%2;

    if(swap===0){

        // Rounds 1-2

        Game.arena.playerSide="Left";
        Game.arena.cpuSide="Right";

        Game.arena.playerColor="Blue";
        Game.arena.cpuColor="Red";

    }else{

        // Rounds 3-4

        Game.arena.playerSide="Right";
        Game.arena.cpuSide="Left";

        Game.arena.playerColor="Red";
        Game.arena.cpuColor="Blue";

    }

    Game.arena.playerLane="Outer";
    Game.arena.cpuLane="Outer";

}

//=========================
// SET LAUNCH POSITIONS
//=========================

function setLaunchPositions(){

    const playerSide = Game.arena.playerSide;
    const cpuSide = Game.arena.cpuSide;

    const playerStart =
        playerSide === "Left"
        ? "LeftMid"
        : "RightMid";

    const cpuStart =
        cpuSide === "Left"
        ? "LeftMid"
        : "RightMid";

    // Reset launch state
    Game.battle.player.rail = false;
    Game.battle.player.xExit = false;
    Game.battle.player.railSpeed = 0;

    Game.battle.cpu.rail = false;
    Game.battle.cpu.xExit = false;
    Game.battle.cpu.railSpeed = 0;

    // Put both Beys on their actual launch sides
    moveBey(
        "player",
        playerStart
    );

    moveBey(
        "cpu",
        cpuStart
    );

    renderBeys();

}

//=========================
// PLAY LAUNCH ANIMATION
//=========================

function playLaunchAnimation(){

    const playerPath = getLaunchPath("player");
    const cpuPath = getLaunchPath("cpu");

    let step = 0;

    function animate(){

      if(step < playerPath.length){

    moveBey("player", playerPath[step]);

}

if(step < cpuPath.length){

    moveBey("cpu", cpuPath[step]);

}

if(
    playerPath[step]==="XRailExit" &&
    Game.player.launch.technique==="Drop Launch"
){

    applyDropLaunch("player");

}

if(
    cpuPath[step]==="XRailExit" &&
    Game.cpu.launch.technique==="Drop Launch"
){

    applyDropLaunch("cpu");

}

// PLAYER REVERSE X-DASH
if(
    Game.player.launch.technique==="Reverse X-Dash" &&
    !Game.battle.player.reverseDash &&
    (
        playerPath[step]==="LeftRail" ||
        playerPath[step]==="RightRail"
    )
){

    applyReverseXDash("player");

}


// CPU REVERSE X-DASH
if(
    Game.cpu.launch.technique==="Reverse X-Dash" &&
    !Game.battle.cpu.reverseDash &&
    (
        cpuPath[step]==="LeftRail" ||
        cpuPath[step]==="RightRail"
    )
){

    applyReverseXDash("cpu");

}
     
// PLAYER X-RAIL DASH
if(
    Game.player.launch.technique==="X-Rail Dash" &&
    !Game.battle.player.xrailDash &&
    (
        playerPath[step]==="LeftRail" ||
        playerPath[step]==="RightRail"
    )
){

    applyXRailDash("player");

}


// CPU X-RAIL DASH
if(
    Game.cpu.launch.technique==="X-Rail Dash" &&
    !Game.battle.cpu.xrailDash &&
    (
        cpuPath[step]==="LeftRail" ||
        cpuPath[step]==="RightRail"
    )
){

    applyXRailDash("cpu");

}
     
// PLAYER DIRECT CLASH
if(
    Game.player.launch.technique==="Direct Clash" &&
    !Game.battle.player.directClash &&
    playerPath[step]==="Center"
){

    applyDirectClash("player");

}


// CPU DIRECT CLASH
if(
    Game.cpu.launch.technique==="Direct Clash" &&
    !Game.battle.cpu.directClash &&
    cpuPath[step]==="Center"
){

    applyDirectClash("cpu");

}
     
     if(
    playerPath[step]==="Center" ||
    cpuPath[step]==="Center"
){

    checkOpeningInteraction();

}
     
renderBeys();

        step++;

        if(
            step <
            Math.max(
                playerPath.length,
                cpuPath.length
            )
        ){

            setTimeout(
                animate,
                300
            );

       }else{

    setTimeout(()=>{

        showArena();

        if(!Game.battle.matchStarted){
            startBattleLoop();
        }else{
            startBattleRound();
        }

    },600);

}

    }

    animate();

}

//=========================
// GENERATE ARENA
//=========================

function generateArena(){

    setLaunchPositions();

    playLaunchAnimation();

}

//=========================
// BATTLE COMMENTARY
//=========================

function getBattleCommentary(){
    const event=Game.battle.lastEvent;
    const player=Game.battle.player;
    const cpu=Game.battle.cpu;
    const pName=Game.player.blade.name;
    const cName=Game.cpu.blade.name;
    const leader=player.momentum>=cpu.momentum ? pName : cName;

    if(event==="passBy" || event==="nearMiss") return `MISS! ${pName} and ${cName} cross at speed — no clean contact. ${leader} keeps the better line.`;
    if(event==="normalHit") return `CLEAN HIT! ${leader} wins the exchange and keeps moving.`;
    if(event==="heavyHit") return `HEAVY HIT! ${leader} breaks the other Bey's line.`;
    if(event==="extremeImpact") return `BIG IMPACT! A rare collision sends the battle into dangerous territory.`;
    if(event==="railDash") return `X RAIL! Speed is building — the next exit matters.`;
    if(event==="railImpact") return `X RAIL HIT! The rail turns speed into a real attack.`;
    if(event==="counterHit") return `COUNTER! The incoming attack gets turned back.`;
    if(event==="pressure") return `${leader} is forcing the issue. The other Bey is giving ground.`;
    if(event==="reposition" || event==="separation") return `Both Beys reset their lines. Nobody wants the bad angle.`;
    if(event==="pocketEscape") return `ESCAPE! The Bey finds a way out of the pocket.`;
    return `The battle is still developing. ${pName} ${formatBattleZone(player.zone)} · ${cName} ${formatBattleZone(cpu.zone)}.`;
}


//=========================
// GENERATE DYNAMIC DECISION
//=========================

function generateDynamicDecision(){
    if(Game.battle.decisionActive) return;

    const player=Game.battle.player, cpu=Game.battle.cpu;
    const event=Game.battle.lastEvent;
    const playerZone=player.zone, cpuZone=cpu.zone;
    const playerName=Game.player.blade.name, cpuName=Game.cpu.blade.name;
    const pCombo=getBattleCombo("player");
    const pType=Game.player.blade?.type || "Balance";
    const previousStory=getRecentBattleStory();
    const advantageState=getBattleAdvantageState();

    const playerCondition=
        player.spin<35 ? `${playerName} is low on spin.` :
        player.balance<35 ? `${playerName} is unstable.` :
        `${playerName} still has room to make a big play.`;

    const cpuCondition=
        cpu.spin<35 ? `${cpuName} is low on spin.` :
        cpu.balance<35 ? `${cpuName} is unstable.` :
        `${cpuName} is still stable.`;

    let scenario="";
    let pool=[];
    const add=(intent,name)=>{
        if(!pool.some(x=>x.intent===intent)){
            const profile=getDecisionProfile(intent);
            pool.push({intent,name,risk:profile.risk,reward:profile.reward,desc:profile.desc});
        }
    };

    if(["LeftPocket","RightPocket"].includes(playerZone)){
        scenario=`${playerName} is in ${formatBattleZone(playerZone)} with ${cpuName} closing in. ${playerCondition} The immediate question is survival — escape, stabilize, or turn the pressure around.`;
        add("escape","Fight back into the bowl");
        add("stabilize","Settle the Bey and recover");
        add("counter","Use the pocket pressure against them");
        add("evade","Slip out before the next hit");
    }else if(playerZone==="XtremeZone"){
        scenario=`${playerName} has been thrown into the Xtreme lane. ${cpuName} has the position, but the next contact can still change the exchange.`;
        add("escape","Break back into the bowl");
        add("counter","Turn the rebound into a counter");
        add("evade","Ride the edge and escape");
        add("attack","Throw one last counterattack");
    }else if(player.rail || playerZone==="XRailExit"){
        scenario=`${playerName} has the X Rail. Speed is building and the X Exit is approaching. ${cpuName} is at ${formatBattleZone(cpuZone)}. This is a commitment decision, not a generic attack.`;
        add("attack","Commit to the X Exit strike");
        add("chase","Stay on the line and hunt the exit");
        add("hold","Control the run and protect the spin");
        add("evade","Abort the rail before the exit");
    }else if(cpu.rail || cpuZone==="XRailExit"){
        scenario=`${cpuName} is building speed toward the X Exit. ${playerName} has to decide whether to absorb it, move away, or meet it head-on.`;
        add("brace","Brace for the rail exit");
        add("evade","Clear the exit lane");
        add("counter","Meet the rail with a counter");
        add("attack","Challenge the exit directly");
    }else if(player.balance<35 || player.spin<35){
        scenario=`${playerName} is compromised at ${formatBattleZone(playerZone)}. ${cpuCondition} One reckless choice could end the round, but giving up the initiative is dangerous too.`;
        add("stabilize","Rebuild balance before attacking");
        add("evade","Get out of the danger lane");
        add("counter","Invite the attack and punish it");
        add("center","Reset toward the center");
    }else if(cpu.balance<35 || cpu.spin<35){
        scenario=`${cpuName} is showing a weakness at ${formatBattleZone(cpuZone)}. ${playerCondition} This is a chance to press the advantage before the CPU recovers.`;
        add("attack","Hit the weakness now");
        add("chase","Cut off the recovery lane");
        add("counter","Bait the desperate attack");
        add("center","Take center and force the next clash");
    }else if(event==="extremeImpact"){
        scenario=`That last impact changed the round. ${previousStory} ${playerName} is at ${formatBattleZone(playerZone)} while ${cpuName} is at ${formatBattleZone(cpuZone)}. Convert the damage into a finish or reset before the recoil catches you.`;
        add("attack","Press the advantage immediately");
        add("chase","Hunt the damaged Bey");
        add("counter","Expect the desperate counter");
        add("evade","Reset before the recoil catches you");
    }else if(event==="heavyHit" || event==="counterHit"){
        scenario=`The last collision changed the balance of the fight. ${previousStory} ${playerCondition} ${cpuCondition} This is a follow-up decision, not a repeat of the last exchange.`;
        add("attack","Cash in the opening");
        add("chase","Cut off their escape");
        add("counter","Bait the retaliation");
        add("evade","Let the recoil pass and reposition");
        add("center","Take the center after the hit");
    }else if(event==="pressure"){
        scenario=`Pressure is building at ${formatBattleZone(playerZone)}. ${cpuName} is being forced to react, but overcommitting can reverse the momentum.`;
        add("attack","Break through with a hard attack");
        add("counter","Let them overextend");
        add("evade","Change the line and make them chase");
        add("chase","Keep them trapped under pressure");
    }else if(event==="nearMiss" || event==="glancingHit"){
        scenario=`The Beys just missed or barely connected. ${playerName} is at ${formatBattleZone(playerZone)} and ${cpuName} is at ${formatBattleZone(cpuZone)}. The next angle is still open.`;
        add("attack","Cut across the next opening");
        add("chase","Follow the opponent's line");
        add("counter","Wait for the second approach");
        add("evade","Change lanes before they turn");
        add("center","Take the middle first");
    }else if(STADIUM_MAP[playerZone]?.neighbors?.includes(cpuZone) || STADIUM_MAP[cpuZone]?.neighbors?.includes(playerZone)){
        scenario=`The lanes are closing. ${playerName} is at ${formatBattleZone(playerZone)} and ${cpuName} is at ${formatBattleZone(cpuZone)}. One clean decision can determine the next meaningful contact.`;
        add("attack","Meet them with force");
        add("counter","Invite the attack and punish it");
        add("evade","Slip past and take the better lane");
        add("chase","Cut off their route");
        add("brace","Absorb the first contact");
    }else{
        scenario=`The Beys are separated: ${playerName} at ${formatBattleZone(playerZone)}, ${cpuName} at ${formatBattleZone(cpuZone)}. ${previousStory || "No clean contact has happened yet."} Choose how to create the next engagement.`;
        add(pCombo?.stats?.mobility>82 ? "chase" : "center",pCombo?.stats?.mobility>82 ? "Hunt the opponent" : "Take the center");
        add("attack",pType==="Attack" ? "Launch the first strike" : "Force an early clash");
        add("hold","Conserve spin and hold your line");
        add("evade","Change the angle and draw them in");
        add("counter","Invite the first attack");
    }

    pool.sort(()=>Math.random()-0.5);
    const choices=pool.slice(0,3);
    scenario += `\n\nBATTLE STATE · ${advantageState.label} — ${advantageState.detail}`;

    Game.battle.decisionChoices=choices;
    Game.battle.pendingDecision={scenario,choices};
    Game.battle.decisionActive=true;
    saveBattleSequence("TACTICAL DECISION",`${scenario}\n\nChoose how you want to play the situation.`);
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
}

function winnerNameForStory(){
    const winner=Game.battle.lastHitWinner;
    return winner==="player" ? Game.player.blade.name : winner==="cpu" ? Game.cpu.blade.name : "The last attacker";
}

//=========================
// SHOW DYNAMIC DECISION
//=========================

function showDynamicDecision(
    scenario,
    choices
){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>ROUND ${Game.battle.turn}</h1>

            <hr>

            ${renderStadium()}

            <hr>

            <div class="battle-decision">

                <h2>MOVE</h2>

                <strong>🎙 COMMENTATOR</strong>

                <p>
                    ${scenario}
                </p>

                <hr>

                ${choices.map(
                    (choice,index)=>`

                    <button
                        type="button"
                        class="menu-btn gold tactical-choice-btn" data-tactical-intent="${choice.intent}"
                    >

                        ${index+1}. ${choice.name}

                    </button>

                    `
                ).join("")}

            </div>

        </section>

    </main>

    `;

    renderBeys();

    // Legacy decision renderer uses the same isolated tactical handler.
    document.querySelectorAll(".tactical-choice-btn[data-tactical-intent]").forEach(btn=>{
        btn.addEventListener("click", handleTacticalChoice, {once:true});
    });

}

//=========================
 // TACTICAL CHOICE HANDLER
 //=========================
 function handleTacticalChoice(event){
     event.preventDefault();
     event.stopPropagation();
     const btn=event.currentTarget;
     const intent=btn && btn.dataset ? btn.dataset.tacticalIntent : null;
     if(!intent) return;
     chooseDynamicMove(intent);
 }

 //=========================
// CHOOSE DYNAMIC MOVE
//=========================

function chooseDynamicMove(intent){
    if(Game.battle.finished) return false;

    const pending=Game.battle.pendingDecision;
    const choices=(pending && Array.isArray(pending.choices))
        ? pending.choices
        : (Array.isArray(Game.battle.decisionChoices) ? Game.battle.decisionChoices : []);

    // Ignore stale clicks from an older rendered decision.
    if(!Game.battle.decisionActive || !choices.length) return false;

    const choice=choices.find(c=>c && c.intent===intent);
    if(!choice) return false;

    // Lock the decision BEFORE resolving it. This prevents a second click,
    // duplicate handler, or cached button from resolving the same decision twice.
    Game.battle.decisionActive=false;
    Game.battle.pendingDecision=null;
    Game.battle.decisionChoices=[];
    Game.battle.player.intent=intent;
    recordPlayerIntent(intent);

    const latest=Game.battle.history[Game.battle.history.length-1];
    if(latest && latest.title==="TACTICAL DECISION"){
        latest.text += `\n\nYOU CHOSE: ${choice.name}`;
    }

    // Immediately render the locked state, then run the actual battle resolver.
    renderBattleSequence();

    try{
        resolvePlayerIntent();
    }catch(error){
        console.error("Tactical decision resolution failed:",error);

        // Never leave the player frozen on a dead decision screen.
        Game.battle.lastEvent="reposition";
        Game.battle.decisionCooldown=3;
        saveBattleSequence(
            "DECISION RESULT",
            `${Game.player.blade.name} chooses ${choice.name}. The battle resumes and the Beys reposition for the next exchange.`
        );
        Game.battle.sequenceIndex=Game.battle.history.length-1;
        renderBattleSequence();
        setTimeout(()=>decideNextBattleStep(),850);
    }
    return true;
}
//=========================
// RESOLVE PLAYER INTENT
//=========================

function executeXRailDecision(bey,cpuIntent="brace",cpuResult="success"){
    const state=Game.battle[bey];
    if(!state) return;

    if(state.zone==="LeftRail" || state.zone==="RightRail"){
        state.momentum=Math.min(100,state.momentum+24);
        state.railSpeed=Math.min(100,(state.railSpeed||0)+30);
        state.spin=Math.max(0,state.spin-1);
    }

    // Give the defender a real reaction instead of treating the rail choice
    // as an automatic win. Brace improves resistance; Counter can redirect
    // the incoming rail momentum when its timing wins the exchange.
    if(cpuIntent==="brace") Game.battle.cpu.defenseBonus=(Game.battle.cpu.defenseBonus||0)+8;

    const result=resolveXRailExit(bey);
    Game.battle.lastEvent=result.event;

    if(cpuIntent==="counter" && cpuResult==="perfect") {
        Game.battle.forcedWinner="cpu";
        result.event="counterHit";
        Game.battle.lastEvent=result.event;
    }

    applyBattleEvent(result.event);

    Game.battle.cpu.defenseBonus=Math.max(0,(Game.battle.cpu.defenseBonus||0)-8);

    if(Game.battle.finished) return;
    if(checkBattleFinish()) return;

    const playerResult="success";
    showIntentResult(
        "Commit to X Rail + Attack",
        cpuIntent,
        playerResult,
        `${Game.player.blade.name} commits to the X Rail. The run builds speed into the X Exit; ${Game.cpu.blade.name} responds with ${cpuIntent}.`
    );
}

function resolvePlayerIntent(){

    const intent=Game.battle.player.intent;

    // Specialized rail decisions execute the actual rail sequence instead of
    // being collapsed into a generic attack.
    if(intent==="attack" && (Game.battle.player.rail || Game.battle.player.zone==="XRailExit")){
        const cpuIntent=chooseCPUIntent();
        Game.battle.cpu.intent=cpuIntent;
        const cpuResult=rollIntentResult("cpu",cpuIntent);
        executeXRailDecision("player",cpuIntent,cpuResult);
        return;
    }

    const cpuIntent=chooseCPUIntent();

    Game.battle.cpu.intent=cpuIntent;

    const playerResult=
        rollIntentResult(
            "player",
            intent
        );

    const cpuResult=
        rollIntentResult(
            "cpu",
            cpuIntent
        );

    // Apply both Beys' attempted moves
    applyIntentMovement(
        "player",
        intent,
        playerResult
    );

    applyIntentMovement(
        "cpu",
        cpuIntent,
        cpuResult
    );

    resolveIntentResult(
        intent,
        cpuIntent,
        playerResult,
        cpuResult
    );

}

//=========================
// CHOOSE CPU INTENT
//=========================

function chooseCPUIntent(){
    const player=Game.battle.player, cpu=Game.battle.cpu;
    const stats=Game.cpu.stats || calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit)?.stats || {};
    const type=Game.cpu.blade?.type || "Balance";
    const personality=Game.cpu.blade?.personality || {};
    const aggression=personality.aggression ?? 50;
    const risk=personality.risk ?? 50;
    const roll=Math.random()*100;
    const history=Game.battle.playerIntentHistory || [];
    const recent=history.slice(-3);
    const repeated=recent.length>=2 && recent.every(x=>x===recent[recent.length-1]);
    const last=recent[recent.length-1];

    if(repeated){
        if(last==="attack" || last==="chase"){
            Game.battle.cpuRead="Reading your aggression";
            if(cpu.balance>45 && roll<62) return stats.defense>82 ? "brace" : "counter";
        }
        if(last==="evade" || last==="escape"){
            Game.battle.cpuRead="Reading your escapes";
            if(roll<58) return "chase";
        }
        if(last==="counter"){
            Game.battle.cpuRead="Avoiding the counter trap";
            if(roll<58) return "hold";
        }
        if(last==="brace" || last==="stabilize"){
            Game.battle.cpuRead="Testing your defense";
            if(roll<55) return aggression>70 ? "attack" : "chase";
        }
    }else{
        Game.battle.cpuRead="No strong read";
    }

    if(cpu.balance<35 || cpu.spin<35) return stats.balance>80 ? "stabilize" : "evade";
    if(cpu.zone==="LeftPocket" || cpu.zone==="RightPocket") return "escape";
    if(cpu.rail || cpu.zone==="XRailExit") return risk>60 ? "attack" : "hold";

    const close=cpu.zone===player.zone || STADIUM_MAP[cpu.zone]?.neighbors?.includes(player.zone);
    if(close){
        if(type==="Defense" && stats.defense>85 && roll<55) return "brace";
        if(type==="Stamina" && stats.balance>85 && roll<60) return "evade";
        if(type==="Attack" && stats.attack>85 && aggression>70 && roll<65) return "attack";
        if(stats.knockback>85 && roll<45) return "counter";
        return roll<50 ? "evade" : "brace";
    }

    if(type==="Attack" && aggression>75) return roll<70 ? "chase" : "attack";
    if(type==="Stamina") return roll<60 ? "center" : "hold";
    if(type==="Defense") return roll<65 ? "hold" : "center";
    return roll<40 ? "chase" : roll<70 ? "center" : "hold";
}

function rollIntentResult(blader,intent){
    const battle=Game.battle[blader];
    const stat=getSimpleMoveStat(blader,intent);

    // Simple rule:
    // 50% base + up to 25% from the relevant stat + a small position modifier.
    let chance=50+(stat-70)*0.5;
    if(battle.balance<40) chance-=8;
    if(battle.spin<40) chance-=5;

    chance=Math.max(25,Math.min(75,chance));

    const roll=Math.random()*100;
    if(roll<chance-15) return "perfect";
    if(roll<chance) return "success";
    if(roll<chance+15) return "partial";
    return "fail";
}

//=========================
// APPLY INTENT MOVEMENT
//=========================

function applyIntentMovement(
    blader,
    intent,
    result
){
    const battle=Game.battle[blader];
    if(result==="fail" || !battle) return;

    const neighbors=STADIUM_MAP[battle.zone]?.neighbors || [];
    if(!neighbors.length) return;

    const opponent=blader==="player" ? "cpu" : "player";
    const opponentZone=Game.battle[opponent].zone;
    const safe=neighbors.filter(z=>!["LeftPocket","RightPocket","XtremeZone"].includes(z));
    let targetZone=null;

    if(intent==="escape" || intent==="evade"){
        const candidates=safe.filter(z=>z!==opponentZone);
        if(candidates.includes("Center")) targetZone="Center";
        else if(candidates.length) targetZone=candidates[Math.floor(Math.random()*candidates.length)];
    }else if(intent==="center"){
        if(neighbors.includes("Center")) targetZone="Center";
    }else if(intent==="chase" || intent==="attack"){
        if(neighbors.includes(opponentZone)){
            targetZone=opponentZone;
        }else{
            const approachers=safe.filter(z=>
                z!==battle.previousZone &&
                STADIUM_MAP[z]?.neighbors?.includes(opponentZone)
            );
            if(approachers.length) targetZone=approachers[Math.floor(Math.random()*approachers.length)];
            else if(intent==="chase" && safe.length) targetZone=safe[Math.floor(Math.random()*safe.length)];
        }
    }else if(intent==="counter" || intent==="brace"){
        // Counter/brace deliberately hold the current line unless a better
        // defensive lane is directly available.
        if(intent==="brace" && neighbors.includes("Center") && battle.balance<55){
            targetZone="Center";
        }
    }else if(intent==="stabilize" || intent==="hold"){
        if(neighbors.includes("Center") && battle.balance<60) targetZone="Center";
        else if(safe.length && result==="perfect") targetZone=safe[Math.floor(Math.random()*safe.length)];
    }

    if(targetZone) moveBey(blader,targetZone);

    if(result==="perfect") battle.momentum+=15;
    else if(result==="partial") battle.momentum+=5;

    renderBeys();
}

//=========================
// APPLY PLAYER MOVEMENT
//=========================

function applyPlayerIntentMovement(
    intent,
    result
){

    const player=Game.battle.player;

    // Failed moves do not reliably move
    if(result==="fail"){

        return;

    }

    const currentZone=player.zone;

    const neighbors=
        STADIUM_MAP[currentZone].neighbors;

    if(!neighbors || neighbors.length===0){

        return;

    }

    let targetZone=null;

    //=========================
    // ESCAPE / EVADE
    //=========================

    if(
        intent==="escape" ||
        intent==="evade"
    ){

        if(
            neighbors.includes("Center")
        ){

            targetZone="Center";

        }

    }


    //=========================
    // MOVE TO CENTER
    //=========================

    if(intent==="center"){

        if(
            neighbors.includes("Center")
        ){

            targetZone="Center";

        }

    }


    //=========================
    // STABILIZE
    //=========================

    if(intent==="stabilize"){

        player.balance=
            Math.min(
                100,
                player.balance+
                (
                    result==="perfect"
                    ? 15
                    : 8
                )
            );

    }


    //=========================
    // CHASE
    //=========================

    if(intent==="chase"){

        const cpuZone=
            Game.battle.cpu.zone;

        if(
            neighbors.includes(cpuZone)
        ){

            targetZone=cpuZone;

        }

    }


    //=========================
    // ATTACK / COUNTER
    //=========================

    if(
        intent==="attack" ||
        intent==="counter"
    ){

        const cpuZone=
            Game.battle.cpu.zone;

        if(
            neighbors.includes(cpuZone)
        ){

            targetZone=cpuZone;

        }

    }


    //=========================
    // APPLY MOVEMENT
    //=========================

    if(targetZone){

        moveBey(
            "player",
            targetZone
        );

    }


    // Partial success gives less benefit
    if(result==="partial"){

        player.momentum+=5;

    }


    if(result==="perfect"){

        player.momentum+=15;

    }

    renderBeys();

}

//=========================
// RESOLVE INTENT VS INTENT
//=========================

function resolveIntentResult(
    playerIntent,
    cpuIntent,
    playerResult,
    cpuResult
){
    const player=Game.battle.player;
    const cpu=Game.battle.cpu;
    const playerContact=
        player.zone===cpu.zone ||
        STADIUM_MAP[player.zone]?.neighbors?.includes(cpu.zone);

    player.attackBonus=0;
    player.defenseBonus=0;
    player.evasionBonus=0;

    if(playerIntent==="attack"){
        player.attackBonus=playerResult==="perfect"?20:playerResult==="success"?12:5;
        player.momentum+=playerResult==="perfect"?18:playerResult==="success"?10:3;
    }else if(playerIntent==="counter"){
        player.defenseBonus=playerResult==="perfect"?18:10;
        player.momentum+=playerResult==="perfect"?14:5;
    }else if(playerIntent==="brace"){
        player.defenseBonus=playerResult==="perfect"?24:16;
        player.balance=Math.min(100,player.balance+(playerResult==="perfect"?4:2));
    }else if(playerIntent==="evade"){
        player.evasionBonus=playerResult==="perfect"?24:14;
        player.momentum+=playerResult==="perfect"?8:3;
    }else if(playerIntent==="chase"){
        player.attackBonus=playerResult==="perfect"?14:7;
        player.momentum+=playerResult==="perfect"?16:8;
    }else if(playerIntent==="center"){
        player.balance=Math.min(100,player.balance+(playerResult==="perfect"?7:3));
        player.momentum+=playerResult==="perfect"?6:2;
    }else if(playerIntent==="hold" || playerIntent==="stabilize"){
        player.balance=Math.min(100,player.balance+(playerResult==="perfect"?9:5));
        player.momentum+=playerResult==="perfect"?6:2;
    }else if(playerIntent==="escape"){
        player.evasionBonus=playerResult==="perfect"?22:12;
    }

    let event="passBy";
    let text="";

    const pCombo=getBattleCombo("player");
    const cCombo=getBattleCombo("cpu");
    const pAttack=(pCombo?.stats.attack||60)+player.attackBonus;
    const pKB=(pCombo?.stats.knockback||60)+Math.round(player.attackBonus*0.55);
    const cAttack=(cCombo?.stats.attack||60);
    const cKB=(cCombo?.stats.knockback||60);
    const playerAdv=pAttack*0.52+pKB*0.48+player.momentum*0.35;
    const cpuAdv=cAttack*0.52+cKB*0.48+cpu.momentum*0.35;
    const executionGap=(playerResult==="perfect"?18:playerResult==="success"?8:playerResult==="partial"?0:-12)
        -(cpuResult==="perfect"?18:cpuResult==="success"?8:cpuResult==="partial"?0:-12);

    if(playerIntent==="attack" || playerIntent==="chase"){
        if(!playerContact){
            event=playerIntent==="chase" ? "pressure" : "separation";
            text=playerIntent==="chase"
                ? "You pursue the line, but the Beys are still too far apart for the attack to land."
                : "You attack the space rather than the Bey. The movement creates the next opening instead of damage.";
        }else if((cpuIntent==="evade" || cpuIntent==="escape") && cpuResult==="perfect" && playerResult!=="perfect"){
            event="nearMiss";
            text="You commit to the line, but the CPU reads it and slips away before the contact.";
        }else if(playerResult==="perfect" && executionGap>=8){
            Game.battle.forcedWinner="player";
            event=(pAttack+pKB+player.momentum>195 && cpu.balance<70)?"extremeImpact":"heavyHit";
            text=playerIntent==="chase"
                ?"You cut off the escape lane and arrive with real force."
                :"You commit to the opening and land a damaging connection.";
        }else if(playerResult!=="fail" && playerAdv+executionGap>=cpuAdv-8){
            Game.battle.forcedWinner="player";
            event=playerResult==="success"?"heavyHit":"normalHit";
            text="The attack gets through. It is not a knockout yet, but the hit changes the position and drains real spin.";
        }else{
            event=playerResult==="fail"?"nearMiss":"glancingHit";
            text="The attack reaches the opponent, but the angle is not clean enough for a major connection.";
        }
    }else if(playerIntent==="counter"){
        if(!playerContact){
            event="pressure";
            text="You hold the counter window. There is no incoming contact yet, so you preserve the threat instead of swinging at empty space.";
        }else if(cpuIntent==="attack" || cpuIntent==="chase"){
            if(playerResult==="perfect" && cpuResult!=="perfect"){
                Game.battle.forcedWinner="player";
                event="counterHit";
                text="You wait for the commitment, then turn the incoming force back into the attacker.";
            }else if(playerResult==="success" && cpuResult==="fail"){
                Game.battle.forcedWinner="player";
                event="heavyHit";
                text="The CPU overcommits and your counter catches the recovery.";
            }else if(cpuResult==="perfect"){
                Game.battle.forcedWinner="cpu";
                event="heavyHit";
                text="The CPU times the approach first and breaks through your counter window.";
            }else{
                event="glancingHit";
                text="The counter window opens, but neither Bey gets enough separation to turn it into a clean punish.";
            }
        }else{
            event="pressure";
            text="You hold the counter threat. The CPU does not give you the attack you wanted, but the hesitation gives you control of the next line.";
        }
    }else if(playerIntent==="brace"){
        if(!playerContact){
            event="reposition";
            text="You stay compact and refuse to chase a target that is not yet in striking range.";
        }else if(cpuIntent==="attack" || cpuIntent==="chase"){
            if(cpuResult==="perfect" && playerResult!=="perfect"){
                Game.battle.forcedWinner="cpu";
                event="normalHit";
                text="You absorb the first blow, but the CPU's timing is too clean to completely shut down.";
            }else if(cpuResult!=="fail"){
                Game.battle.forcedWinner="cpu";
                event="glancingHit";
                text="You brace correctly and turn the incoming strike into a glancing hit instead of a clean smash.";
            }else{
                event="pressure";
                text="The CPU commits and your brace holds. The attacker loses the better line.";
            }
        }else{
            event="reposition";
            text="You stay compact and refuse to give away a clean target.";
        }
    }else if(playerIntent==="evade" || playerIntent==="escape"){
        if(cpuIntent==="attack" && cpuResult==="perfect" && playerResult!=="perfect"){
            Game.battle.forcedWinner="cpu";
            event="glancingHit";
            text="You try to slip away, but the CPU catches the edge of the escape.";
        }else{
            event="separation";
            text=playerIntent==="escape"
                ?"You break the pressure and get the Bey back onto a safer lane."
                :"You give up the immediate clash and force the opponent to chase.";
        }
    }else if(playerIntent==="center"){
        if(cpuIntent==="attack" && cpuResult==="perfect"){
            Game.battle.forcedWinner="cpu";
            event="normalHit";
            text="You take center, but the CPU reaches you before the position can settle.";
        }else{
            event="pressure";
            text="You take the middle and make the opponent come through your line.";
        }
    }else{
        event="reposition";
        text=playerIntent==="stabilize"
            ?"You stabilize the Bey instead of forcing a bad exchange."
            :"You hold the line and preserve energy for the next collision.";
    }

    Game.battle.lastEvent=event;
    if(event) applyBattleEvent(event);
    if(Game.battle.finished) return;
    if(checkBattleFinish()) return;

    showIntentResult(playerIntent,cpuIntent,playerResult,text);

    Game.battle.lastEvent=null;
    Game.battle.decisionCooldown=4;
    setTimeout(()=>decideNextBattleStep(),850);
}

//=========================
// SHOW INTENT RESULT
//=========================

function showIntentResult(intent,cpuIntent,result,text){
    const p=Game.battle.player, c=Game.battle.cpu;
    const pName=Game.player.blade.name, cName=Game.cpu.blade.name;
    const winner=Game.battle.lastHitWinner;
    const resultWords={
        perfect:"You caught the moment perfectly.",
        success:"The plan works, and the Bey gets what it needed from the exchange.",
        partial:"The idea works, but the execution leaves something on the table.",
        fail:"The timing is off. The Bey has to live with the position it is left in."
    };
    const aftermath=winner
        ? `${winner==="player"?pName:cName} now has the initiative, but the next lane is not guaranteed.`
        : `${pName} is at ${formatBattleZone(p.zone)} while ${cName} is at ${formatBattleZone(c.zone)}. The battle is still open.`;
    const impactText=getImpactCalculationText();
    const detail=`${text}\n\n${resultWords[result]||"The exchange changes the shape of the battle."} ${aftermath}\n\nYOUR MOVE: ${intent}\nCPU RESPONSE: ${cpuIntent}\nEXECUTION: ${result.toUpperCase()}${impactText ? `\n\n${impactText}` : ""}`;
    saveBattleSequence("DECISION RESULT",detail);
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
}
function syncBattleStats(blader){
    const side=Game[blader];
    if(!side || !side.blade || !side.ratchet || !side.bit) return null;
    const combo=calculateComboStats(side.blade,side.ratchet,side.bit);
    side.stats=combo?.stats || null;
    side.comboOVR=combo?.ovr || 0;
    side.comboMeta=combo?.meta || 0;
    return combo;
}

//=========================
// START BATTLE LOOP
//=========================

function startBattleLoop(){

    Game.battle.finished=false;
    Game.battle.winner=null;
    Game.battle.finish=null;
    Game.battle.decisionActive=false;
    Game.battle.pendingDecision=null;
    Game.battle.decisionCooldown=0;
    Game.battle.matchFinished=false;
    Game.battle.matchStarted=true;
    Game.battle.round=1;
    Game.battle.playerScore=0;
    Game.battle.cpuScore=0;
    Game.battle.pointsToWin=7;

    startBattleRound();

}

//=========================
// XTREME RAIL SYSTEM
//=========================

function isXRailZone(zone){
    return ["LeftRail","RightRail","XRailExit"].includes(zone);
}
function getXRailNextZone(zone){
    const railPath={
        LeftRail:"XRailExit",
        RightRail:"XRailExit",
        XRailExit:"TopCenter"
    };
    return railPath[zone] || null;
}
function handleXRailMovement(bey){
    const battle=Game.battle[bey];
    if(!battle) return false;
    const currentZone=battle.zone;
    const nextZone=getXRailNextZone(currentZone);
    if(!nextZone) return false;

    const beyName=bey==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    battle.railDashing=true;
    battle.railOrigin=currentZone;
    battle.momentum=Math.min(100,battle.momentum+18);
    battle.railSpeed=Math.min(100,(battle.railSpeed||0)+25);
    battle.spin=Math.max(0,battle.spin-1);

    if(currentZone==="LeftRail" || currentZone==="RightRail"){
        battle.railText=`${beyName} commits to the Xtreme Rail and builds speed toward the X Exit.`;
        moveBey(bey,nextZone);
        Game.battle.railEvent={event:"railDash",resolved:true,side:bey};
        return true;
    }
    return false;
}
//=========================
// X-RAIL EXIT
//=========================

function resolveXRailExit(bey){
    const battle=Game.battle[bey];
    const opponentKey=bey==="player" ? "cpu" : "player";
    const opponent=Game.battle[opponentKey];
    if(!battle || !opponent) return {resolved:false};

    const combo=getBattleCombo(bey);
    const exitZone="TopCenter";
    const targetZone=opponent.zone;
    const contact=targetZone===exitZone || STADIUM_MAP[exitZone]?.neighbors?.includes(targetZone);
    const centerStrike=targetZone==="Center";
    const railPower=(combo?.stats?.attack||60)*0.35+
        (combo?.stats?.knockback||60)*0.45+
        Math.abs(battle.momentum||0)*0.55+
        (battle.railSpeed||0)*0.35;

    battle.railExitStrike=!!(contact && railPower>55);
    battle.railExitTargetZone=targetZone;
    battle.railExitPower=railPower;

    moveBey(bey,exitZone);
    battle.railDashing=false;
    battle.xExit=false;
    battle.railSpeed=Math.max(0,(battle.railSpeed||0)-10);

    if(battle.railExitStrike){
        // Do not force the winner. The actual impact system decides whether
        // the rail attack wins the exchange using Attack, Knockback,
        // Momentum, Speed, Defense and Balance.
        return {resolved:true,event:"railImpact",side:bey,centerStrike};
    }
    return {resolved:true,event:"railDash",side:bey};
}

//=========================
// BATTLE BEHAVIOR
//=========================

function updateBattleBehavior(bey){
    const battle=Game.battle[bey];
    const opponent=Game.battle[bey==="player" ? "cpu" : "player"];
    const blade=bey==="player" ? Game.player.blade : Game.cpu.blade;
    if(!battle || !opponent || !blade) return;

    if(battle.behaviorTurns>0){ battle.behaviorTurns--; return; }

    const type=blade.type || "Balance";
    const personality=blade.personality || {};
    const aggression=personality.aggression ?? 50;
    const control=personality.control ?? 50;
    const risk=personality.risk ?? 50;
    const danger=["LeftPocket","RightPocket"].includes(battle.zone);
    const nearOpponent=battle.zone===opponent.zone || STADIUM_MAP[battle.zone]?.neighbors?.includes(opponent.zone);

    if(battle.balance<30 || battle.spin<22){
        battle.behavior="recovering";
    }else if(danger || battle.momentum<-25){
        battle.behavior="retreating";
    }else if(type==="Attack"){
        battle.behavior=(nearOpponent || battle.momentum>8 || aggression>75) ? "chasing" : "circling";
    }else if(type==="Stamina"){
        battle.behavior=(opponent.momentum>battle.momentum+25 || opponent.spin>battle.spin+20) ? "retreating" : "holding";
    }else if(type==="Defense"){
        battle.behavior=nearOpponent && battle.momentum>5 ? "holding" : "holding";
    }else{
        if(nearOpponent && aggression>=control) battle.behavior="chasing";
        else if(battle.spin<60 || battle.balance<60) battle.behavior="recovering";
        else battle.behavior=control>=60 ? "holding" : "circling";
    }
    battle.behaviorTurns=1 + Math.floor((100-Math.min(100,risk))*0.02);
}
//=========================
// SIMULATE BATTLE MOVEMENT
//=========================

function simulateBattleMovement(bey){
    const battle=Game.battle[bey];
    const opponentKey=bey==="player" ? "cpu" : "player";
    const opponent=Game.battle[opponentKey];
    const side=bey==="player" ? Game.player : Game.cpu;
    const blade=side.blade;
    if(!battle || !opponent || !blade) return;

    if(battle.zone==="LeftRail" || battle.zone==="RightRail"){
        handleXRailMovement(bey);
        return;
    }

    if(battle.zone==="XRailExit"){
        const railResult=resolveXRailExit(bey);
        Game.battle.railEvent=railResult;
        return;
    }

    updateBattleBehavior(bey);
    const neighbors=STADIUM_MAP[battle.zone]?.neighbors || [];
    if(!neighbors.length) return;

    const type=blade.type || "Balance";
    const personality=blade.personality || {};
    const combo=calculateComboStats(side.blade,side.ratchet,side.bit);
    const stats=combo?.stats || {};
    const aggression=personality.aggression ?? 50;
    const control=personality.control ?? 50;
    const risk=personality.risk ?? 50;
    const spin=battle.spin;
    const balance=battle.balance;
    const mobility=stats.mobility ?? 70;
    const stamina=stats.stamina ?? 70;
    const momentum=battle.momentum;
    const centerZones=["Center","TopCenter","LeftMid","RightMid","BottomCenter"];
    const dangerZones=["LeftPocket","RightPocket","XtremeZone"];
    const railZones=["LeftRail","RightRail"];
    const safeNeighbors=neighbors.filter(z=>!["LeftPocket","RightPocket","XtremeZone"].includes(z));
    const movementNeighbors=safeNeighbors.length ? safeNeighbors : neighbors.filter(z=>z!=="XtremeZone");
    let bestZone=movementNeighbors[0] || neighbors[0], bestScore=-Infinity;

    for(const zone of movementNeighbors){
        let score=0;
        const danger=dangerZones.includes(zone);
        const center=centerZones.includes(zone);
        const rail=railZones.includes(zone);
        const touchesOpponent=zone===opponent.zone;
        const approachesOpponent=STADIUM_MAP[zone]?.neighbors?.includes(opponent.zone);
        if(danger) score-=95;
        if(center) score+=control*0.55 + mobility*0.20;
        if(zone===battle.previousZone) score-=10;
        if(approachesOpponent) score+=(aggression*0.25)+(mobility*0.22)+(Math.max(0,momentum)*0.35);
        if(touchesOpponent) score+=aggression*0.75;
        if(rail) score+=(risk*0.65)+(aggression*0.25);
        if(battle.behavior==="chasing") score+=touchesOpponent?55:approachesOpponent?30:0;
        if(battle.behavior==="retreating" || battle.behavior==="recovering") score+=center?28:!approachesOpponent?20:0;
        if(battle.behavior==="holding") score+=center*18;
        if(type==="Attack" && rail) score+=risk*0.5;
        if(type==="Stamina" && rail) score-=(risk*0.8) + Math.max(0,80-stamina)*0.25;
        if(type==="Defense" && rail) score-=risk*0.35;
        if(spin<45 && center) score+=20 + Math.max(0,80-stamina)*0.25;
        if(balance<40 && danger) score-=40;
        score+=Math.random()*1.5;
        if(score>bestScore){ bestScore=score; bestZone=zone; }
    }
    moveBey(bey,bestZone);
}
//=========================
// NATURAL SPIN / MOVEMENT COST
//=========================
function applyNaturalSpinCost(bey){
    const state=Game.battle[bey], side=Game[bey], combo=getBattleCombo(bey);
    if(!state || !side || !combo || state.spin<=0) return 0;
    const retention=combo.stats.stamina||70;
    const speed=state.speed||0, momentum=Math.abs(state.momentum||0);
    const quality=side.launch?.quality||"Okay";
    const launchEfficiency=side.launch?.staminaEfficiency || ({Perfect:0.82,Good:0.90,Okay:1,Bad:1.12,Horrible:1.28}[quality]||1);
    const movementCost=0.28 + speed/240 + momentum/500;
    const retentionFactor=Math.max(0.62,Math.min(1.12,88/Math.max(60,retention)));
    const cost=Math.max(0.35,movementCost*retentionFactor*launchEfficiency);
    state.spin=Math.max(0,state.spin-cost);
    return cost;
}

//=========================
// SIMULATE BATTLE ROUND
//=========================

function simulateBattleRound(){

    const player=
        Game.battle.player;

    const cpu=
        Game.battle.cpu;


    if(checkBattleFinish()){

        return;

    }


    Game.battle.turn++;

    // No artificial simulation limit. The round continues until an actual
    // Spin, Over, or Xtreme finish occurs.


    //=========================
    // REMEMBER START POSITIONS
    //=========================

    const playerPreviousZone=
        player.zone;

    const cpuPreviousZone=
        cpu.zone;


    //=========================
    // SIMULATE MOVEMENT
    //=========================

    simulateBattleMovement("player");
    simulateBattleMovement("cpu");

    // Movement itself consumes spin. High speed creates opportunities but
    // costs more; high stamina and a clean launch make that movement cheaper.
    const pSpinCost=applyNaturalSpinCost("player");
    const cSpinCost=applyNaturalSpinCost("cpu");

    //=========================
    // RECORD WHAT ACTUALLY HAPPENED
    //=========================

    Game.battle.lastMovement={

        player:{
            from:playerPreviousZone,
            to:player.zone
        },

        cpu:{
            from:cpuPreviousZone,
            to:cpu.zone
        }

    };


    //=========================
    // CHECK BATTLE SITUATION
    //=========================

    let situation;

    if(
        player.zone===cpu.zone
    ){

        situation="clash";

    }

    else if(
        player.zone===cpuPreviousZone &&
        cpu.zone===playerPreviousZone
    ){

        situation="crossing";

    }

    else if(
        STADIUM_MAP[player.zone]
        ?.neighbors
        ?.includes(cpu.zone)
    ){

        situation="approach";

    }

    else{

        situation="separated";

    }


    Game.battle.situation=
        situation;


    renderBeys();


    //=========================
    // RAIL EVENT PRIORITY
    //=========================

    const railEvent=
        Game.battle.railEvent;

    Game.battle.railEvent=
        null;


    if(railEvent){

        Game.battle.lastEvent=
            railEvent.event;

        resolveAutomaticEvent(
            railEvent.event
        );

        return;

    }


    resolveAutomaticSituation();

}

//=========================
// AUTOMATIC BATTLE EVENT
//=========================

function resolveAutomaticSituation(){
    const situation=Game.battle.situation;
    const player=Game.battle.player;
    const cpu=Game.battle.cpu;
    const pCombo=getBattleCombo("player");
    const cCombo=getBattleCombo("cpu");

    // Simple battle power:
    // Attack + Knockback average, then a small momentum adjustment.
    const pPower=Math.round(((pCombo?.stats.attack||60)+(pCombo?.stats.knockback||60))/2) + Math.round(player.momentum/4);
    const cPower=Math.round(((cCombo?.stats.attack||60)+(cCombo?.stats.knockback||60))/2) + Math.round(cpu.momentum/4);

    const close=situation==="clash" || situation==="crossing";
    const near=situation==="approach";
    const railSide=player.rail ? "player" : cpu.rail ? "cpu" : null;
    const attacker=pPower>=cPower ? "player" : "cpu";
    const defender=attacker==="player" ? "cpu" : "player";
    const attackerCombo=attacker==="player" ? pCombo : cCombo;
    const defenderCombo=defender==="player" ? pCombo : cCombo;

    const attackScore=Math.round(((attackerCombo?.stats.attack||60)+(attackerCombo?.stats.knockback||60))/2);
    const defenseScore=Math.round(((defenderCombo?.stats.defense||60)+(defenderCombo?.stats.balance||60))/2);
    const advantage=attackScore-defenseScore+Math.round(Game.battle[attacker].momentum/4);

    // About ±15 points of randomness keeps stats important without making
    // every exchange predetermined.
    const adjustedRoll=Math.max(0,Math.min(100,Math.random()*100-advantage));
    let event="separation";

    if(railSide){
        const railPower=(attackerCombo?.stats.attack||60)*0.45+
            (attackerCombo?.stats.knockback||60)*0.55;
        if(adjustedRoll<26) event="railDash";
        else if(railPower>82 && adjustedRoll>66) event="railImpact";
        else event="railDash";
    }else if(situation==="separated"){
        if(adjustedRoll<28) event="reposition";
        else if(adjustedRoll<46) event="nearMiss";
        else if(adjustedRoll<64) event="separation";
        else if(adjustedRoll<82) event="pressure";
        else event="glancingHit";
    }else if(near){
        if(adjustedRoll<10) event="nearMiss";
        else if(adjustedRoll<22) event="glancingHit";
        else if(adjustedRoll<38) event="pressure";
        else if(adjustedRoll<66) event="normalHit";
        else if(adjustedRoll<88) event="heavyHit";
        else {
            const power=(attackerCombo?.stats.attack||60)*0.45+
                (attackerCombo?.stats.knockback||60)*0.55;
            event=power>=82 ? "extremeImpact" : "heavyHit";
        }
    }else if(close){
        if(Game[defender].currentMove==="Counter" && adjustedRoll<24){
            Game.battle.forcedWinner=defender;
            event="counterHit";
        }else if(adjustedRoll<7) event="nearMiss";
        else if(adjustedRoll<18) event="glancingHit";
        else if(adjustedRoll<34) event="pressure";
        else if(adjustedRoll<61) event="normalHit";
        else if(adjustedRoll<86) event="heavyHit";
        else {
            const power=(attackerCombo?.stats.attack||60)*0.45+
                (attackerCombo?.stats.knockback||60)*0.55;
            event=power>=80 ? "extremeImpact" : "heavyHit";
        }
    }

    Game.battle.lastEvent=event;
    resolveAutomaticEvent(event);
}

//=========================
// HIT AFTERMATH
//=========================

function applyHitAftermath(
    winner,
    loser,
    event
){

    const winnerState=
        Game.battle[winner];

    const loserState=
        Game.battle[loser];

    if(
        !winnerState ||
        !loserState
    ){

        return;

    }

    // Normal hit:
    // winner keeps pressure,
    // loser repositions.
    if(event==="normalHit"){

        winnerState.behavior=
            "chasing";

        winnerState.behaviorTurns=1;

        loserState.behavior=
            "circling";

        loserState.behaviorTurns=1;

    }


    // Heavy hit:
    // winner presses forward,
    // loser must recover.
    else if(event==="heavyHit"){

        winnerState.behavior=
            "chasing";

        winnerState.behaviorTurns=2;

        loserState.behavior=
            "retreating";

        loserState.behaviorTurns=2;

        winnerState.momentum=
            Math.min(
                100,
                winnerState.momentum+15
            );

        loserState.momentum=
            Math.max(
                -100,
                loserState.momentum-15
            );

    }


    // Extreme impact:
    // strong follow-up pressure.
    else if(event==="extremeImpact"){

        winnerState.behavior=
            "chasing";

        winnerState.behaviorTurns=2;

        loserState.behavior=
            "recovering";

        loserState.behaviorTurns=2;

        winnerState.momentum=
            Math.min(
                100,
                winnerState.momentum+25
            );

        loserState.momentum=
            Math.max(
                -100,
                loserState.momentum-25
            );

    }

}

//=========================
// APPLY BATTLE EVENT
//=========================

function applyBattleEvent(event){
    const player=Game.battle.player;
    const cpu=Game.battle.cpu;
    const playerCombo=getBattleCombo("player");
    const cpuCombo=getBattleCombo("cpu");

    if(event==="passBy" || event==="nearMiss"){
        player.spin=Math.max(0,player.spin-1);
        cpu.spin=Math.max(0,cpu.spin-1);
        player.momentum*=0.96;
        cpu.momentum*=0.96;
        Game.battle.lastHitWinner=null;
        Game.battle.lastHitDamage=null;
        return;
    }

    if(event==="separation" || event==="reposition"){
        player.spin=Math.max(0,player.spin-1);
        cpu.spin=Math.max(0,cpu.spin-1);
        player.balance=Math.min(100,player.balance+1);
        cpu.balance=Math.min(100,cpu.balance+1);
        Game.battle.lastHitWinner=null;
        Game.battle.lastHitDamage=null;
        return;
    }

    if(event==="railDash"){
        const side=Game.battle.railEvent?.side || (player.rail ? "player" : "cpu");
        const b=Game.battle[side];
        b.momentum=Math.min(100,b.momentum+18);
        b.railSpeed=Math.min(100,(b.railSpeed||0)+20);
        b.spin=Math.max(0,b.spin-1);
        Game.battle.lastHitWinner=null;
        Game.battle.lastHitDamage=null;
        return;
    }

    let winner=Game.battle.forcedWinner;
    if(winner!=="player" && winner!=="cpu") winner=null;
    Game.battle.forcedWinner=null;

    const playerAttack=Math.round(((playerCombo?.stats.attack||60)+(playerCombo?.stats.knockback||60))/2);
    const cpuAttack=Math.round(((cpuCombo?.stats.attack||60)+(cpuCombo?.stats.knockback||60))/2);
    const playerDefense=Math.round(((playerCombo?.stats.defense||60)+(playerCombo?.stats.balance||60))/2);
    const cpuDefense=Math.round(((cpuCombo?.stats.defense||60)+(cpuCombo?.stats.balance||60))/2);

    if(!winner){
        const playerScore=playerAttack+Math.round(player.momentum/4);
        const cpuScore=cpuAttack+Math.round(cpu.momentum/4);
        winner=playerScore>=cpuScore ? "player" : "cpu";
    }

    const loser=winner==="player" ? "cpu" : "player";
    const winnerCombo=winner==="player" ? playerCombo : cpuCombo;
    const loserCombo=loser==="player" ? playerCombo : cpuCombo;
    const winnerState=Game.battle[winner];
    const loserState=Game.battle[loser];
    Game.battle.lastHitWinner=winner;

    const beforeState=getBeyState(loser);
    const beforeSpin=loserState.spin;
    const beforeBalance=loserState.balance;

    const attackScore=winner==="player" ? playerAttack : cpuAttack;
    const defenseScore=winner==="player" ? cpuDefense : playerDefense;
    const momentumBonus=Math.round(winnerState.momentum/4);

    const attackPower=
        (winnerCombo?.stats?.attack||60)*0.52+
        (winnerCombo?.stats?.knockback||60)*0.48+
        Math.max(0,winnerState.momentum)*0.18+
        (winnerState.speed||0)*0.10;
    const resistance=
        (loserCombo?.stats?.defense||60)*0.27+
        (loserCombo?.stats?.balance||60)*0.23;
    const advantage=Math.max(4,attackPower-resistance);

    let strength=1;
    if(event==="glancingHit") strength=0.55;
    if(event==="pressure") strength=0.75;
    if(event==="normalHit") strength=1.15;
    if(event==="counterHit") strength=1.45;
    if(event==="heavyHit") strength=1.85;
    if(event==="extremeImpact") strength=2.45;
    if(event==="railImpact") strength=2.20;

    const variance=0.88+Math.random()*0.28;
    const spinDamage=Math.max(2,Math.round((3.2+advantage*0.16)*strength*variance));
    const balanceDamage=Math.max(1,Math.round((1.8+advantage*0.11)*strength*variance));

    loserState.spin=Math.max(0,loserState.spin-spinDamage);
    loserState.balance=Math.max(0,loserState.balance-balanceDamage);
    winnerState.spin=Math.max(0,winnerState.spin-(event==="heavyHit"||event==="extremeImpact"?1:0));
    winnerState.momentum=Math.min(100,winnerState.momentum+
        (event==="extremeImpact"?20:event==="heavyHit"?14:event==="railImpact"?17:event==="counterHit"?12:5));
    loserState.momentum=Math.max(-100,loserState.momentum-
        (event==="extremeImpact"?26:event==="heavyHit"?18:event==="railImpact"?20:event==="counterHit"?14:8));

    // Record incoming force so the displacement engine knows who actually
    // created the pressure. This is what makes Knockback a real stat.
    loserState.railExitStrike=!!winnerState.railExitStrike;
    loserState.railExitTargetZone=winnerState.railExitTargetZone;
    loserState.incomingForce=Math.max(0,
        advantage+
        (event==="extremeImpact"?35:event==="heavyHit"?22:event==="railImpact"?28:event==="counterHit"?14:0)
    );
    loserState.incomingFrom=winner;

    if(event==="glancingHit" || event==="pressure"){
        loserState.behavior="retreating";
        loserState.behaviorTurns=1;
    }else if(event==="counterHit"){
        loserState.behavior="retreating";
        loserState.behaviorTurns=2;
        winnerState.behavior="chasing";
        winnerState.behaviorTurns=1;
    }else{
        applyHitAftermath(winner,loser,event);
    }

    const railStrike=!!winnerState.railExitStrike;
    Game.battle.lastHitDamage={
        spin:spinDamage,
        balance:balanceDamage,
        beforeSpin,
        beforeBalance,
        afterSpin:loserState.spin,
        afterBalance:loserState.balance,
        beforeState,
        afterState:getBeyState(loser),
        winner,
        loser,
        event,
        attackPower:Math.round((winnerCombo?.stats?.attack||60)),
        knockbackPower:Math.round((winnerCombo?.stats?.knockback||60)),

        defenderDefense:Math.round((loserCombo?.stats?.defense||60)),
        defenderBalance:Math.round((loserCombo?.stats?.balance||60)),
        momentum:Math.round(winnerState.momentum),
        momentumBonus,
        speed:Math.round(winnerState.speed),
        launchBonus:0,
        impactBase:advantage,
        strength,
        enduranceFactor:1
    };

    // Use the attacker’s Knockback to drive actual displacement. For a rail
    // exit strike, the defender must be pushed before we evaluate the pocket
    // or Xtreme finish opportunity.
    if(event!=="pressure" || advantage>10){
        pushBey(loser);
    }

    // A knockback can immediately trigger an Over/Xtreme Finish.
    // Once the round is finished, never append a normal battle event afterward.
    if(Game.battle.finished) return;

    if(checkBattleFinish()) return;

    if(railStrike){
        winnerState.railExitStrike=false;
        winnerState.railExitTargetZone=null;
        winnerState.railExitPower=0;
        loserState.railExitStrike=false;
        loserState.railExitTargetZone=null;
    }
}

//=========================
// IMPACT CALCULATION COMMENTARY
//=========================

function getImpactCalculationText(){
    const d=Game.battle.lastHitDamage;
    if(!d || !d.winner || !d.event) return "";

    const winnerName=d.winner==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    const loserName=d.loser==="player" ? Game.player.blade.name : Game.cpu.blade.name;

    const attackPower=Math.round((d.attackPower+d.knockbackPower)/2);
    const defensePower=Math.round((d.defenderDefense+d.defenderBalance)/2);
    const momentum=Math.max(0,Math.round(d.momentumBonus||0));
    const advantage=Math.round(attackPower+momentum-defensePower);
    return `CALC · ${winnerName}
ATTACK POWER · ${attackPower}  (ATK ${d.attackPower} + KB ${d.knockbackPower})
DEFENSE POWER · ${defensePower}  (DEF ${d.defenderDefense} + BAL ${d.defenderBalance})
MOMENTUM · +${momentum}  →  ADVANTAGE ${advantage >= 0 ? "+" : ""}${advantage}
DAMAGE · -${d.spin} STA · -${d.balance} BAL`;
}

//=========================
// EVENT COMMENTARY
//=========================

function formatBattleZone(zone){
    const names={TopLeft:"Top Left",TopCenter:"Top Center",TopRight:"Top Right",LeftMid:"Left Mid",Center:"Center",RightMid:"Right Mid",BottomLeft:"Bottom Left",BottomCenter:"Bottom Center",BottomRight:"Bottom Right",LeftRail:"X Rail — Left",RightRail:"X Rail — Right",XRailExit:"X Exit",XtremeZone:"Xtreme Zone",LeftPocket:"Left Pocket",RightPocket:"Right Pocket"};
    return names[zone] || zone || "Unknown";
}


function generateEventCommentary(event){
    const p=Game.battle.player, c=Game.battle.cpu;
    const winner=Game.battle.lastHitWinner;
    const damage=Game.battle.lastHitDamage;
    const pName=Game.player.blade.name, cName=Game.cpu.blade.name;
    const winnerName=winner==="player"?pName:cName;
    const loserName=winner==="player"?cName:pName;
    const winnerState=winner ? Game.battle[winner] : null;
    const loserKey=winner==="player" ? "cpu" : "player";
    const wCombo=winner ? getBattleCombo(winner) : null;
    const wLaunch=winner ? Game[winner].launch : null;
    const movement=Game.battle.lastMovement;
    const fromZone=winner && movement ? formatBattleZone(movement[winner].from) : "";
    const toZone=winner && movement ? formatBattleZone(movement[winner].to) : "";
    const speed=Math.round(winnerState?.speed||0);
    const quality=wLaunch?.quality||"Okay";
    const qualityLine=quality==="Perfect" ? "The launch is still paying dividends." : quality==="Good" ? "That strong opening is helping the attack stay composed." : quality==="Bad" ? "The rough launch is still costing some of the clean movement." : quality==="Horrible" ? "The poor launch means every correction costs more." : "The opening was neutral, so the hit has to make its own advantage.";

    if(event==="nearMiss"){
        const lines=[
            `${pName} and ${cName} close fast — but the lines pass by each other at the last second. Neither gets the contact it wanted.`,
            `They nearly meet. ${pName} cuts across the lane while ${cName} slips past, and the opening disappears.`,
            `A split-second miss! Both Beys keep spinning, but neither can claim the angle.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="reposition" || event==="separation"){
        const lines=[
            `The pressure fades and both Beys give themselves room. ${pName} is searching for a better line while ${cName} refuses to hand one over.`,
            `No clean opening yet. They separate, reset their lanes, and start hunting for the next mistake.`,
            `Both Beys break away. This is not a retreat so much as a reset — the next approach will tell us who learned from the last one.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="railDash"){
        const railSide=p.rail ? "player" : "cpu";
        const railName=railSide==="player"?pName:cName;
        const rs=Game.battle[railSide];
        const q=Game[railSide].launch?.quality||"Okay";
        const lines=[
            `${railName} catches the X Rail and the whole battle changes shape. The ${q.toLowerCase()} launch is carrying into real speed now — the rail run is building before the exit.`,
            `${railName} commits to the rail. The Bey is not just moving faster; it is storing that speed for whatever waits at the X Exit.`,
            `The rail is live! ${railName} is riding the wall, building speed while the opponent has to decide whether to meet the exit or get out of the way.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(!winner || !damage) return `They make contact, but neither Bey owns the exchange. The battle stays unsettled.`;

    if(event==="glancingHit"){
        const lines=[
            `${winnerName} gets there first, but only by a fraction. It clips ${loserName}'s edge and keeps moving. ${qualityLine}`,
            `${winnerName} finds a small opening and brushes ${loserName}. Not a knockout blow — just enough to steal the line.`,
            `A glancing connection from ${winnerName}. ${loserName} is forced to adjust before it can settle again.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="pressure"){
        const lines=[
            `${winnerName} does not need the big hit yet. It keeps ${loserName} moving, taking away the comfortable lanes one by one. ${qualityLine}`,
            `${winnerName} is leaning on the battle now. Every pass forces ${loserName} to spend movement correcting instead of attacking.`,
            `Pressure is building. ${winnerName} has the better rhythm, and ${loserName} is being made to react instead of choose.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="counterHit"){
        const lines=[
            `${loserName} came in expecting to own the contact — and ${winnerName} waited for it. The attack is turned aside and sent back with the defender's stability behind it.`,
            `Beautiful counter! ${winnerName} absorbs the incoming line, finds the angle underneath it, and redirects the force back into ${loserName}.`,
            `${winnerName} reads the collision perfectly. Instead of fighting the momentum head-on, it lets ${loserName} create the opening and then punishes it.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="railImpact"){
        const target=winnerState?.railExitTargetZone==="Center" ? "straight through the center" : "off the X Exit";
        const lines=[
            `${winnerName} comes flying out of the rail ${target}. The ride has turned movement into momentum, and ${loserName} has to absorb the impact before it can recover.`,
            `X RAIL STRIKE! ${winnerName} converts the run into a full-speed hit. ${loserName} is caught on the exit line with nowhere to hide.`,
            `The rail pays off! ${winnerName} exits with speed still climbing and crashes into ${loserName}. That is exactly why the X Rail is dangerous.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="normalHit"){
        const lines=[
            `${winnerName} closes from ${fromZone||"its lane"} into ${toZone||"the contact point"} and gets the cleaner side of the collision. ${loserName} is pushed off its preferred rhythm.`,
            `${winnerName} finds the line and makes clean contact. The hit is not explosive, but it changes the position and gives ${winnerName} the initiative.`,
            `Clean connection. ${winnerName} arrives with the better angle and leaves ${loserName} having to rebuild its position.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="heavyHit"){
        const lines=[
            `${winnerName} finally catches ${loserName} with enough speed behind the contact to break the line. ${loserName} is knocked out of position, and now the pressure belongs to ${winnerName}. ${qualityLine}`,
            `That one had weight behind it! ${winnerName} enters with ${speed} speed and turns it into a hard collision. ${loserName} is forced backward before it can recover.`,
            `${winnerName} gets the angle, the momentum, and the contact. The hit drives ${loserName} away from the center and opens a dangerous follow-up.`,
            `The collision lands flush. ${winnerName}'s attack and knockback finally overcome ${loserName}'s stability, and the whole battle swings with it.`
        ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="extremeImpact"){
        const attackStyle=wCombo?.behavior?.attackStyle||"Attack";
        const lines=
            attackStyle==="Smash"
            ? [
                `BOOM! ${winnerName}'s smash profile comes through at full speed. ${loserName} is launched into a dangerous line.`,
                `${winnerName} gets the heavy contact it was built for. The smash breaks ${loserName}'s line and opens a finish route.`,
                `That is pure smash power. ${winnerName} turns speed, momentum and knockback into a brutal displacement.`
            ]
            : attackStyle==="Rush"
            ? [
                `RUSH ATTACK! ${winnerName} keeps the contact low and fast, turning repeated movement into one decisive launch.`,
                `${winnerName} finally finds the opening its speed was creating. The rush converts into a dangerous impact on ${loserName}.`,
                `Speed becomes force! ${winnerName} arrives first and sends ${loserName} scrambling toward the finish lanes.`
            ]
            : [
                `BOOM! ${winnerName} catches ${loserName} at speed and the impact changes the geometry of the stadium.`,
                `${winnerName} hits with everything the opening has built — speed, momentum and contact all arrive together.`,
                `That is the collision everyone was waiting for. ${winnerName} turns the approach into a violent impact.`
            ];
        return lines[Math.floor(Math.random()*lines.length)];
    }
    if(event==="xtremeEscape"){
        return `${loserName} survives the Xtreme line and gets bounced back toward the bowl. That was a warning shot — the next one may not be survivable.`;
    }
    if(event==="pocketEscape"){
        return `${loserName} finds the edge of the pocket and claws its way back into the bowl. The finish was there, but the defense held.`;
    }
    return `${winnerName} wins the exchange and carries the initiative forward.`;
}

//=========================
// AFTER AUTO EVENT
//=========================

function resolveAutomaticEvent(event){
    if(Game.battle.finished) return;
    if(!Game.battle.sequenceEvents) Game.battle.sequenceEvents=[];
    applyBattleEvent(event);
    if(Game.battle.finished){ Game.battle.sequenceEvents=[]; return; }
    if(checkBattleFinish()){ Game.battle.sequenceEvents=[]; return; }

    const movement=Game.battle.lastMovement;
    const playerMove=movement ? `${formatBattleZone(movement.player.from)} → ${formatBattleZone(movement.player.to)}` : formatBattleZone(Game.battle.player.zone);
    const cpuMove=movement ? `${formatBattleZone(movement.cpu.from)} → ${formatBattleZone(movement.cpu.to)}` : formatBattleZone(Game.battle.cpu.zone);
    let eventText=generateEventCommentary(event);
    if(Game.battle.turn<=1){
        eventText=`${getLaunchImpactSummary("player")} ${getLaunchImpactSummary("cpu")}\n\n${eventText}`;
    }
    const impactText=getImpactCalculationText();
    if(impactText){
        eventText+=`\n\n${impactText}`;
    }
    const shortMove=`YOU ${playerMove} · CPU ${cpuMove}`;

    Game.battle.sequenceEvents.push({event,move:shortMove,text:eventText});

    const target=Game.battle.sequenceTarget || (2+Math.floor(Math.random()*2));
    Game.battle.sequenceTarget=target;
    const majorEvent=["heavyHit","extremeImpact","counterHit","railImpact"].includes(event);
    const railEvent=["railDash","railImpact"].includes(event);
    const shouldShow=majorEvent || railEvent || Game.battle.sequenceEvents.length>=target;

    if(!shouldShow){
        setTimeout(()=>decideNextBattleStep(),140);
        return;
    }

    const recent=Game.battle.sequenceEvents.slice(-2);
    const text=recent.map((item,i)=>`${item.text}`).join("\n\n");
    saveBattleSequence("BATTLE MOMENT",text);
    Game.battle.sequenceEvents=[];
    Game.battle.sequenceTarget=null;
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
}
//=========================
// SHOW AUTO SIMULATION
//=========================

function showBattleSimulation(text){

    Game.battle.sequenceIndex=
        Game.battle.history.length-1;

    renderBattleSequence();

}

//=========================
// DECIDE NEXT BATTLE STEP
//=========================

function decideNextBattleStep(){

    if(Game.battle.finished){
        return;
    }

    if(checkBattleFinish()){
        return;
    }

    // A decision is an interruption in an ongoing battle, not a new turn.
    // Always give the simulation several real ticks to move, drain spin and
    // create the next situation before offering another choice.
    if(Game.battle.decisionCooldown>0){
        Game.battle.decisionCooldown--;
        setTimeout(()=>simulateBattleRound(),300);
        return;
    }

    // Opening: let the battle develop before the first decision.
    if(Game.battle.turn < 3){
        setTimeout(()=>simulateBattleRound(),300);
        return;
    }

    const meaningfulMoment=[
        "heavyHit","extremeImpact","counterHit","railImpact","pressure",
        "glancingHit","nearMiss"
    ].includes(Game.battle.lastEvent);

    const scheduledMoment=
        Game.battle.turn>0 &&
        Game.battle.turn%5===0;

    const dangerous=
        Game.battle.player.balance<45 ||
        Game.battle.player.spin<45 ||
        Game.battle.cpu.balance<45 ||
        Game.battle.cpu.spin<45 ||
        ["LeftPocket","RightPocket","LeftRail","RightRail","XRailExit","XtremeZone"].includes(Game.battle.player.zone) ||
        ["LeftPocket","RightPocket","LeftRail","RightRail","XRailExit","XtremeZone"].includes(Game.battle.cpu.zone);

    // Decisions appear at meaningful moments, with a five-tick fallback so the
    // player is never trapped in a constant decision loop.
    if(meaningfulMoment || scheduledMoment || dangerous){
        generateDynamicDecision();
        return;
    }

    setTimeout(()=>simulateBattleRound(),300);
}

//=========================
// CHECK BATTLE FINISH
//=========================

function checkBattleFinish(){
    const player=Game.battle.player, cpu=Game.battle.cpu;
    const playerOut=Number.isFinite(player.spin) && player.spin<=0;
    const cpuOut=Number.isFinite(cpu.spin) && cpu.spin<=0;

    // Spin Finish can only happen when the actual spin reserve reaches zero.
    // Balance, momentum, turn count, and UI state never trigger it.
    if(playerOut && cpuOut){
        const last=Game.battle.lastHitWinner;
        const winner=last==="player" ? "player" : last==="cpu" ? "cpu" : (player.balance>=cpu.balance ? "player" : "cpu");
        Game.battle.finish="Spin Finish"; Game.battle.finishPoints=1; Game.battle.winner=winner;
        endBattleRound(); return true;
    }
    if(playerOut){
        Game.battle.finish="Spin Finish"; Game.battle.finishPoints=1; Game.battle.winner="cpu";
        endBattleRound(); return true;
    }
    if(cpuOut){
        Game.battle.finish="Spin Finish"; Game.battle.finishPoints=1; Game.battle.winner="player";
        endBattleRound(); return true;
    }
    // Over Finish is resolved only by checkStadiumDanger() after a Bey is
    // actually driven into a pocket. Reaching 0 balance in the middle of the
    // stadium makes the Bey unstable; it does not magically score an Over.
    return false;
}

//=========================
// GENERATE BATTLE SITUATION
//=========================

function generateBattleSituation(){

    const player=Game.battle.player;
    const cpu=Game.battle.cpu;

    const distance=Math.abs(
        player.x-cpu.x
    );

    let situation;

    if(distance<60){

        situation="close";

    }else if(distance<150){

        situation="approaching";

    }else{

        situation="separated";

    }

    Game.battle.situation=situation;

    showBattleMoveScreen();

}

function endBattleRound(){
    if(Game.battle.finished) return;

    Game.battle.finished=true;
    const winner=Game.battle.winner;
    const points=Game.battle.finishPoints||1;

    if(winner==="player") Game.battle.playerScore+=points;
    else if(winner==="cpu") Game.battle.cpuScore+=points;

    const winnerName=winner==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    const loserKey=winner==="player" ? "cpu" : "player";
    const loserName=loserKey==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    const loserState=Game.battle[loserKey];
    const matchWinner=Game.battle.playerScore>=Game.battle.pointsToWin ||
        Game.battle.cpuScore>=Game.battle.pointsToWin;
    Game.battle.matchFinished=matchWinner;

    const finish=Game.battle.finish||"Spin Finish";
    const cause=getFinishContext(loserKey,finish);
    const finalSpin=Math.round(clampBattleValue(loserState?.spin||0));
    const finalBalance=Math.round(clampBattleValue(loserState?.balance||0));

    const finishStory = finish==="Xtreme Finish"
        ? `XTREME FINISH! ${winnerName} turns a high-speed line into the decisive launch. ${loserName} is sent out through the Xtreme lane.`
        : finish==="Over Finish"
        ? `OVER FINISH! ${winnerName} drives ${loserName} too deep into the pocket to recover.`
        : `SPIN FINISH! ${winnerName} outlasts ${loserName} as the final spin gives out.`;

    const text=`${finish.toUpperCase()} · +${points}

${finishStory}
${cause}

${loserName}: ${finalSpin}% STA · ${finalBalance}% BAL
SCORE · YOU ${Game.battle.playerScore} — CPU ${Game.battle.cpuScore}

${matchWinner ? "MATCH COMPLETE." : "NEXT ROUND READY."}`;

    saveBattleSequence(`BATTLE ROUND ${Game.battle.round} RESULT`,text);
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
}


//=========================
// START NEW BATTLE ROUND
//=========================

function startBattleRound(){
    Game.battle.finished=false;
    Game.battle.winner=null;
    Game.battle.finish=null;
    Game.battle.finishPoints=0;
    Game.battle.decisionActive=false;
    Game.battle.pendingDecision=null;
    Game.battle.decisionCooldown=0;
    Game.battle.decisionChoices=[];
    Game.battle.turn=0;
    Game.battle.sequenceEvents=[];
    Game.battle.sequenceTarget=null;
    Game.battle.lastEvent=null;
    Game.battle.lastHitWinner=null;
    Game.battle.lastHitDamage=null;
    Game.battle.forcedWinner=null;
    Game.battle.lastMovement=null;
    Game.battle.railEvent=null;
    Game.battle.openingInteractionResolved=false;
    Game.battle.playerIntentHistory=[];
    Game.battle.cpuRead="No strong read";

    // Every round gets a fresh stadium state. The match score persists, but
    // Bey positions/spin/balance do not carry over from the previous round.
    setLaunchPositions();

    const pCombo=syncBattleStats("player");
    const cCombo=syncBattleStats("cpu");
    const p=Game.battle.player, c=Game.battle.cpu;

    // Stats establish the opening condition, but with diminishing returns.
    // This keeps Stamina important without making it the only path to victory.
    const pSta=pCombo?.stats?.stamina ?? 80;
    const cSta=cCombo?.stats?.stamina ?? 80;
    const pBal=pCombo?.stats?.balance ?? 80;
    const cBal=cCombo?.stats?.balance ?? 80;

    p.spin=clampBattleValue(
        82+(pSta-75)*0.45+(Game.player.launch.spinBonus||0)*0.45+
        (Game.player.launch.angleSpinBonus||0)*0.25,68,100
    );
    p.balance=clampBattleValue(
        82+(pBal-75)*0.35+(Game.player.launch.balanceBonus||0)*0.45,68,100
    );
    p.speed=clampBattleValue(
        ((pCombo?.stats?.mobility ?? 70)+(Game.player.launch.movementBonus||0)*0.6) * (Game.player.launch.movementEfficiency||1)
    );
    p.momentum=0; p.railSpeed=0; p.behavior="circling"; p.behaviorTurns=0;
    p.rail=false; p.xExit=false; p.reverseDash=false; p.xrailDash=false; p.railExitStrike=false; p.railExitTargetZone=null; p.railExitPower=0;

    c.spin=clampBattleValue(
        82+(cSta-75)*0.45+(Game.cpu.launch.spinBonus||0)*0.45+
        (Game.cpu.launch.angleSpinBonus||0)*0.25,68,100
    );
    c.balance=clampBattleValue(
        82+(cBal-75)*0.35+(Game.cpu.launch.balanceBonus||0)*0.45,68,100
    );
    c.speed=clampBattleValue(
        ((cCombo?.stats?.mobility ?? 70)+(Game.cpu.launch.movementBonus||0)*0.6) * (Game.cpu.launch.movementEfficiency||1)
    );
    c.momentum=0; c.railSpeed=0; c.behavior="circling"; c.behaviorTurns=0;
    c.rail=false; c.xExit=false; c.reverseDash=false; c.xrailDash=false; c.railExitStrike=false; c.railExitTargetZone=null; c.railExitPower=0;

    const roundText=`ROUND ${Game.battle.round} · READY

SCORE  YOU ${Game.battle.playerScore} — CPU ${Game.battle.cpuScore}

🎙 ${Game.player.blade.name}: ${Game.player.launch.quality} launch — ${getLaunchTechniqueText("player")}.
${getLaunchImpactSummary("player")}
🎙 ${Game.cpu.blade.name}: ${Game.cpu.launch.quality} launch — ${getLaunchTechniqueText("cpu")}.
${getLaunchImpactSummary("cpu")}

OPENING CONDITION
${Game.player.blade.name}: ${Math.round(p.spin)} STA · ${Math.round(p.balance)} BAL
${Game.cpu.blade.name}: ${Math.round(c.spin)} STA · ${Math.round(c.balance)} BAL`;

    saveBattleSequence(`BATTLE ROUND ${Game.battle.round}`,roundText);
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
}


//=========================
// STADIUM PREVIEW
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
    const c=document.getElementById("bitContainer");Object.values(BIT_ENGINE).sort(()=>Math.random()-0.5).slice(0,3).forEach(bit=>{const b=document.createElement("button");b.className="menu-btn bronze";b.textContent=bit.name;b.onclick=()=>{Game.player.bit=bit;syncBattleStats("player");showComboCard();};c.appendChild(b);});c.appendChild(createBackButton(()=>showRatchetPlaceholder()));
}
function renderBitPage(){
    const pool=Game.selection.bitPool,page=Game.selection.bitPage,size=6,total=Math.max(1,Math.ceil(pool.length/size)),safe=Math.min(Math.max(page,0),total-1);Game.selection.bitPage=safe;
    const c=document.getElementById("bitContainer");c.innerHTML="";pool.slice(safe*size,(safe+1)*size).forEach(bit=>{const b=document.createElement("button");b.className="menu-btn bronze";b.textContent=bit.name;b.onclick=()=>{Game.player.bit=bit;syncBattleStats("player");showComboCard();};c.appendChild(b);});
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

function generateCPUCombo(){

    // Blade
    const bladePool = Object.values(BLADE_ENGINE).filter(

        blade => blade.tier === Game.player.blade.tier

    );

    Game.cpu.blade = bladePool[
        Math.floor(Math.random()*bladePool.length)
    ];

    // Ratchet
    Game.cpu.ratchet = [...RATCHETS][
        Math.floor(Math.random()*RATCHETS.length)
    ];

    // Bit
    const bits = Object.values(BIT_ENGINE);

    Game.cpu.bit = bits[
        Math.floor(Math.random()*bits.length)
    ];
    syncBattleStats("cpu");

}

//=========================
// VS SCREEN
//=========================

function showVS(){

    generateCPUCombo();

    assignStadiumSides();

    showLetItRip();

}

//=========================
// LAUNCH SCREEN
//=========================

function showLaunchScreen(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>LAUNCH PHASE</h1>

            <p>

<strong>You are the ${Game.arena.playerColor} Bey</strong>

<br>

Launching from the

<strong>${Game.arena.playerSide}</strong>

side.

</p>
            
${getStadiumPreview()}

            <hr>

            <h2>${Game.player.blade.name}</h2>

            <p>

                ${Game.player.ratchet.name}
                •
                ${Game.player.bit.name}

            </p>

            <br>

            <h3>Select Launch Angle</h3>

            <button class="menu-btn bronze" id="flatLaunch">
    Flat
</button>

<button class="menu-btn silver" id="slightLaunch">
    Slight Tilt
</button>

<button class="menu-btn gold" id="hardLaunch">
    Hard Tilt
</button>

        </section>

    </main>

    `;

document.getElementById("flatLaunch").onclick = () => {

    chooseLaunchAngle("Flat");

};

document.getElementById("slightLaunch").onclick = () => {

    chooseLaunchAngle("Slight Tilt");

};

document.getElementById("hardLaunch").onclick = () => {

    chooseLaunchAngle("Hard Tilt");

};

}

//=========================
// CHOOSE LAUNCH ANGLE
//=========================

   function chooseLaunchAngle(angle){

    Game.player.launch.angle = angle;

    showLaunchTechnique();

}

//=========================
// LAUNCH TECHNIQUE
//=========================

function showLaunchTechnique(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>LAUNCH TECHNIQUE</h1>
            
    ${getStadiumPreview()}

            <hr>

            <h2>${Game.player.blade.name}</h2>

            <p>

                Launch Angle:
                <strong>${Game.player.launch.angle}</strong>

            </p>

            <br>

            <button class="menu-btn bronze" id="centerLaunch">

                Center

            </button>

            <button class="menu-btn silver" id="xrailLaunch">

${getXRailTechnique("player")}

            </button>

            <button class="menu-btn gold" id="clashLaunch">

                Direct Clash

            </button>

            <button class="menu-btn bronze" id="dropLaunch">

    Drop Launch

</button>

            <button class="menu-btn silver" id="circleLaunch">

                Wide Circle

            </button>

        </section>

    </main>

    <br>

<button
    class="menu-btn"
    id="backLaunch">

← Back

</button>

    `;

   document.getElementById("centerLaunch").onclick=()=>{

    chooseLaunchTechnique("Center");

};

document.getElementById("xrailLaunch").onclick=()=>{

    chooseLaunchTechnique(
        getXRailTechnique("player")
    );

};

document.getElementById("clashLaunch").onclick=()=>{

    chooseLaunchTechnique("Direct Clash");

};

document.getElementById("dropLaunch").onclick=()=>{

    chooseLaunchTechnique("Drop Launch");


};

document.getElementById("circleLaunch").onclick=()=>{

    chooseLaunchTechnique("Wide Circle");

};

document.getElementById("backLaunch").onclick=()=>{

    showLaunchScreen();

};

}

//=========================
// CHOOSE LAUNCH TECHNIQUE
//=========================

function chooseLaunchTechnique(technique){

    Game.player.launch.technique=technique;

    Game.player.launch.quality=rollQuality();

    showLaunchExecution();

}

//=========================
// SAFE QUALITY
//=========================

function rollQuality(){

    const roll=Math.random()*100;

    if(roll<5) return "Horrible";

    if(roll<12) return "Bad";

    if(roll<45) return "Okay";

    if(roll<90) return "Good";

    return "Perfect";

}

//=========================
// RISK QUALITY
//=========================

function rollRiskQuality(){

    const roll=Math.random()*100;

    if(roll<5) return "Horrible";

    if(roll<15) return "Bad";

    if(roll<40) return "Okay";

    if(roll<75) return "Good";

    return "Perfect";

}

//=========================
// LAUNCH MODIFIERS
//=========================

function applyLaunchQuality(blader){

    const target=Game[blader];

    target.launch.movementEfficiency=1;
    target.launch.staminaEfficiency=1;
    target.launch.controlBonus=0;

    switch(target.launch.quality){

        case "Horrible":

            target.launch.spinBonus=-15;
            target.launch.balanceBonus=-15;
            target.launch.positionBonus=-2;
            target.launch.movementEfficiency=1.18;
            target.launch.staminaEfficiency=1.28;
            target.launch.controlBonus=-10;
            break;

        case "Bad":

            target.launch.spinBonus=-8;
            target.launch.balanceBonus=-6;
            target.launch.positionBonus=-1;
            target.launch.movementEfficiency=1.10;
            target.launch.staminaEfficiency=1.12;
            target.launch.controlBonus=-5;
            break;

        case "Okay":

            target.launch.spinBonus=0;
            target.launch.balanceBonus=0;
            target.launch.positionBonus=0;
            break;

        case "Good":

            target.launch.spinBonus=5;
            target.launch.balanceBonus=4;
            target.launch.positionBonus=1;
            target.launch.movementEfficiency=0.94;
            target.launch.staminaEfficiency=0.90;
            target.launch.controlBonus=5;
            break;

        case "Perfect":

            target.launch.spinBonus=10;
            target.launch.balanceBonus=8;
            target.launch.positionBonus=2;
            target.launch.movementEfficiency=0.88;
            target.launch.staminaEfficiency=0.82;
            target.launch.controlBonus=10;
            break;
      
    }
 
//=========================
// LAUNCH ANGLE EFFECTS
//=========================

target.launch.attackBonus=0;
target.launch.burstBonus=0;
target.launch.angleSpinBonus=0;
target.launch.angleBalanceBonus=0;
target.launch.movementBonus=0;


const bitType=
    target.bit.type;


//=========================
// FLAT
//=========================

if(
    target.launch.angle==="Flat"
){

    // Safest and most stable launch.
    target.launch.angleBalanceBonus=8;


    if(bitType==="Attack"){

        target.launch.movementBonus=6;

    }

    else if(bitType==="Defense"){

        target.launch.angleBalanceBonus+=6;

    }

    else if(bitType==="Stamina"){

        target.launch.angleSpinBonus=6;

    }

    else if(bitType==="Balance"){

        target.launch.angleSpinBonus=3;
        target.launch.angleBalanceBonus+=3;

    }

}


//=========================
// SLIGHT TILT
//=========================

else if(
    target.launch.angle==="Slight Tilt"
){

    // Controlled angled launch.
    target.launch.angleBalanceBonus=-3;
    target.launch.movementBonus=5;


    if(bitType==="Attack"){

        target.launch.angleSpinBonus=8;
        target.launch.attackBonus=8;
        target.launch.burstBonus=5;

    }

    else if(bitType==="Defense"){

        target.launch.angleBalanceBonus+=3;
        target.launch.attackBonus=3;

    }

    else if(bitType==="Stamina"){

        target.launch.angleSpinBonus=4;
        target.launch.angleBalanceBonus+=2;

    }

    else if(bitType==="Balance"){

        target.launch.angleSpinBonus=4;
        target.launch.attackBonus=4;
        target.launch.angleBalanceBonus+=2;

    }

}


//=========================
// HARD TILT
//=========================

else if(
    target.launch.angle==="Hard Tilt"
){

    // Aggressive but unstable launch.
    target.launch.angleBalanceBonus=-10;
    target.launch.movementBonus=12;


    if(bitType==="Attack"){

        // More controlled aggressive movement
        // and better stamina than a flat attack launch.
        target.launch.angleSpinBonus=12;
        target.launch.attackBonus=15;
        target.launch.burstBonus=10;

    }

    else if(bitType==="Defense"){

        target.launch.attackBonus=5;
        target.launch.angleBalanceBonus+=4;

    }

    else if(bitType==="Stamina"){

        // Tilt gives movement options,
        // but costs some stability.
        target.launch.angleSpinBonus=3;

    }

    else if(bitType==="Balance"){

        target.launch.angleSpinBonus=5;
        target.launch.attackBonus=6;
        target.launch.burstBonus=4;
        target.launch.angleBalanceBonus+=4;

    }

}


//=========================
// APPLY ANGLE BONUSES
//=========================

target.launch.spinBonus=
    (target.launch.spinBonus || 0) +
    (target.launch.angleSpinBonus || 0);

target.launch.balanceBonus=
    (target.launch.balanceBonus || 0) +
    (target.launch.angleBalanceBonus || 0);
 
//=========================
// APPLY ANGLE BONUSES
//=========================

target.launch.spinBonus=
    (target.launch.spinBonus || 0) +
    (target.launch.angleSpinBonus || 0);

target.launch.balanceBonus=
    (target.launch.balanceBonus || 0) +
    (target.launch.angleBalanceBonus || 0);
 
}

//=========================
// VALIDATE LAUNCH
//=========================

function validateLaunch(blader){

    const launch = Game[blader].launch;

    const blade = Game[blader].blade;

    const side =
        blader==="player"
        ? Game.arena.playerSide
        : Game.arena.cpuSide;

    launch.success=true;
    launch.reason="";

    // Right-spin Bey cannot naturally
    // ride the left rail.

    if(
        blade.spin==="Right" &&
        side==="Left" &&
        launch.technique==="X-Rail"
    ){

        launch.success=false;

        launch.reason=
            "Right-spin cannot catch the left X-Rail.";

    }

}

//=========================
// APPLY DROP LAUNCH
//=========================

function applyDropLaunch(blader){

    const launch=Game[blader].launch;
    const battle=Game.battle[blader];

    if(!battle) return;

    battle.dropLaunch=true;
    battle.rail=false;
    battle.xExit=true;

    switch(launch.quality){

        case "Perfect":
            battle.speed=28;
            battle.balance+=8;
            battle.spin+=3;
            break;

        case "Good":
            battle.speed=35;
            battle.balance+=4;
            break;

        case "Okay":
            battle.speed=42;
            break;

        case "Bad":
            battle.speed=52;
            battle.balance-=6;
            battle.spin-=4;
            break;

        case "Horrible":
            battle.speed=60;
            battle.balance-=12;
            battle.spin-=8;
            break;

    }

}

//=========================
// GET X-RAIL TECHNIQUE
//=========================

function getXRailTechnique(blader){

    const side =
        blader === "player"
        ? Game.arena.playerSide
        : Game.arena.cpuSide;

    const spin =
        Game[blader].spin || "Right";

  const naturalSide =
    spin === "Right"
    ? "Left"
    : "Right";

    return side === naturalSide
        ? "X-Rail Dash"
        : "Reverse X-Dash";

}
 
//=========================
// APPLY REVERSE X-DASH
//=========================

function applyReverseXDash(blader){

    const launch=Game[blader].launch;
    const battle=Game.battle[blader];

    if(!battle) return;

    battle.reverseDash=true;

    switch(launch.quality){

        case "Perfect":

            battle.speed=75;
            battle.balance+=5;
            break;


        case "Good":

            battle.speed=65;
            break;


        case "Okay":

            battle.speed=52;
            battle.balance-=3;
            break;


        case "Bad":

            battle.speed=38;
            battle.balance-=8;
            battle.spin-=5;
            break;


        case "Horrible":

            battle.speed=25;
            battle.balance-=15;
            battle.spin-=10;

            // Misses the reverse rail attempt
            battle.reverseDashFailed=true;

            break;

    }

}

 //=========================
// APPLY X-RAIL DASH
//=========================

function applyXRailDash(blader){

    const launch=Game[blader].launch;
    const battle=Game.battle[blader];

    if(!battle) return;

    battle.xrailDash=true;

    switch(launch.quality){

        case "Perfect":

            battle.speed=85;
            battle.balance+=6;
            break;

        case "Good":

            battle.speed=72;
            battle.balance+=3;
            break;

        case "Okay":

            battle.speed=60;
            break;

        case "Bad":

            battle.speed=42;
            battle.balance-=6;
            battle.spin-=3;
            break;

        case "Horrible":

            battle.speed=30;
            battle.balance-=12;
            battle.spin-=7;

            battle.xrailDashFailed=true;

            break;

    }

}

//=========================
// APPLY DIRECT CLASH
//=========================

function applyDirectClash(blader){

    const launch=Game[blader].launch;
    const battle=Game.battle[blader];

    if(!battle) return;

    battle.directClash=true;

    switch(launch.quality){

        case "Perfect":

            battle.speed=75;
            battle.balance+=4;
            battle.openingHitPower=1.35;
            break;

        case "Good":

            battle.speed=65;
            battle.balance+=2;
            battle.openingHitPower=1.15;
            break;

        case "Okay":

            battle.speed=55;
            battle.openingHitPower=1;
            break;

        case "Bad":

            battle.speed=40;
            battle.balance-=6;
            battle.openingHitPower=0.75;
            battle.openingClashWeak=true;
            break;

        case "Horrible":

            battle.speed=25;
            battle.balance-=12;
            battle.spin-=8;
            battle.openingHitPower=0.35;
            battle.openingClashMiss=true;
            break;

    }

}

//=========================
// RESOLVE OPENING CLASH
//=========================

function resolveOpeningClash(){

    const player=Game.battle.player;
    const cpu=Game.battle.cpu;

    if(Game.battle.openingClashResolved) return;

    Game.battle.openingClashResolved=true;

    const playerImpact=
        player.speed *
        (Game.player.stats.attack / 100) *
        (Game.player.stats.knockback / 100) *
        (player.openingHitPower || 1);

    const cpuImpact=
        cpu.speed *
        (Game.cpu.stats.attack / 100) *
        (Game.cpu.stats.knockback / 100) *
        (cpu.openingHitPower || 1);

    const difference=
        Math.abs(playerImpact-cpuImpact);

    if(difference<8){

        player.balance-=4;
        cpu.balance-=4;

        saveBattleSequence(
            "OPENING CLASH",
            "Both Beys collide head-on!"
        );

    }
    else if(playerImpact>cpuImpact){

        cpu.balance-=Math.min(30,difference*0.5);

        saveBattleSequence(
            "OPENING CLASH",
            `${Game.player.blade.name} wins the opening clash!`
        );

    }
    else{

        player.balance-=Math.min(30,difference*0.5);

        saveBattleSequence(
            "OPENING CLASH",
            `${Game.cpu.blade.name} wins the opening clash!`
        );

    }

}

//=========================
// CHECK OPENING INTERACTION
//=========================

function checkOpeningInteraction(){

    if(Game.battle.openingInteractionResolved) return;

    Game.battle.openingInteractionResolved=true;

    const playerTech=Game.player.launch.technique;
    const cpuTech=Game.cpu.launch.technique;

    if(
        playerTech==="Direct Clash" &&
        cpuTech==="Direct Clash"
    ){

        resolveOpeningClash();
        return;

    }

    if(playerTech==="Direct Clash"){

        resolveOpeningAttack("player","cpu");

    }

    if(cpuTech==="Direct Clash"){

        resolveOpeningAttack("cpu","player");

    }

}

//=========================
// RESOLVE OPENING ATTACK
//=========================

function resolveOpeningAttack(attacker,defender){

    const attackBattle=Game.battle[attacker];
    const defendBattle=Game.battle[defender];

    if(!attackBattle || !defendBattle) return;

    const attackerImpact=
        attackBattle.speed *
        (Game[attacker].stats.attack / 100) *
        (Game[attacker].stats.knockback / 100) *
        (attackBattle.openingHitPower || 1);

    const defenderResistance=
        (Game[defender].stats.defense / 100) *
        (defendBattle.balance / 100);

    const finalImpact=
        attackerImpact -
        defenderResistance * 20;

    if(finalImpact > 25){

        defendBattle.balance-=10;

        saveBattleSequence(
            "OPENING ATTACK",
            `${Game[attacker].blade.name} lands a strong opening hit!`
        );

    }
    else if(finalImpact > 10){

        defendBattle.balance-=5;

        saveBattleSequence(
            "OPENING ATTACK",
            `${Game[attacker].blade.name} lands a glancing hit.`
        );

    }
    else{

        saveBattleSequence(
            "OPENING ATTACK",
            `${Game[attacker].blade.name} misses the opening attack!`
        );

    }

}

//=========================
// LAUNCH PATH
//=========================

function getLaunchPath(blader){

    const launch=Game[blader].launch;

    const side=
        blader==="player"
        ? Game.arena.playerSide
        : Game.arena.cpuSide;

    const spin=
        Game[blader].spin || "Right";

    const naturalSide=
        spin==="Right"
        ? "Left"
        : "Right";

    const startZone=
        side==="Left"
        ? "LeftMid"
        : "RightMid";

    if(launch.technique==="X-Rail"){
        // Flat natural-side launch commits to the X-Rail immediately.
        if(side===naturalSide){
            return side==="Left" ? ["LeftMid","LeftRail","XRailExit"] : ["RightMid","RightRail","XRailExit"];
        }
        return [startZone];
    }

    return [
        Game.battle[blader].zone
    ];

}

//=========================
// LAUNCH EXECUTION
//=========================

function showLaunchExecution(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>LAUNCH EXECUTION</h1>

            <hr>

            <h2>Predicted Quality</h2>

            <h1 id="qualityText">
                ${Game.player.launch.quality}
            </h1>

            <div style="margin:10px 0 14px;padding:11px;border-radius:10px;background:rgba(255,255,255,.05);line-height:1.4;font-size:11px;">
                <strong>🎙 LAUNCH CALL</strong>
                <p id="launchStory" style="margin:6px 0 0;opacity:.7;">Choose QUALITY to keep the predicted launch, or RISK it for a new result.</p>
            </div>

            <br>

            <button
                class="menu-btn silver"
                id="qualityBtn">

                QUALITY

            </button>

            <button
                class="menu-btn gold"
                id="riskBtn">

                RISK

            </button>

        </section>

    </main>

    `;

    // Keep the predetermined quality
    document.getElementById("qualityBtn").onclick=()=>{

        Game.player.launch.gamble=false;

        applyLaunchQuality("player");
     
validateLaunch("player");
     
    generateCPULaunch();


    };

    // Roll a new quality
    document.getElementById("riskBtn").onclick=()=>{

        Game.player.launch.gamble=true;

        Game.player.launch.quality=rollRiskQuality();

        document.getElementById("qualityText").textContent=
            Game.player.launch.quality;
        const launchStory=document.getElementById("launchStory");
        if(launchStory) launchStory.textContent="Launch locked. Executing…";

        setTimeout(()=>{

            applyLaunchQuality("player");  generateCPULaunch();

        },700);

    };

}

//=========================
// CPU LAUNCH
//=========================

function generateCPULaunch(){
    const side=Game.cpu;
    const type=side.blade?.type || "Balance";
    const stats=side.stats || getBattleCombo("cpu")?.stats || {};
    const personality=side.blade?.personality || {};
    const risk=personality.risk ?? 50;
    const roll=Math.random()*100;

    let techniques;
    if(type==="Attack"){
        techniques=stats.knockback>=88
            ? ["X-Rail","Direct Clash","X-Rail","Wide Circle"]
            : ["Direct Clash","X-Rail","Wide Circle","Center"];
    }else if(type==="Stamina"){
        techniques=["Center","Wide Circle","Center","Drop Launch"];
    }else if(type==="Defense"){
        techniques=risk>45
            ? ["Center","Drop Launch","X-Rail","Wide Circle"]
            : ["Center","Center","Drop Launch","Wide Circle"];
    }else{
        techniques=["Center","X-Rail","Wide Circle","Direct Clash"];
    }

    side.launch.technique=techniques[Math.floor(Math.random()*techniques.length)];

    const bitType=side.bit?.type || type;
    if(bitType==="Attack"){
        side.launch.angle=roll<55 ? "Flat" : roll<85 ? "Slight Tilt" : "Hard Tilt";
    }else if(bitType==="Stamina"){
        side.launch.angle=roll<70 ? "Flat" : "Slight Tilt";
    }else if(bitType==="Defense"){
        side.launch.angle=roll<75 ? "Flat" : "Slight Tilt";
    }else{
        side.launch.angle=roll<60 ? "Flat" : roll<90 ? "Slight Tilt" : "Hard Tilt";
    }

    side.launch.quality=rollQuality();
    applyLaunchQuality("cpu");
    validateLaunch("cpu");
    generateArena();
}


//=========================
// BATTLE PREVIEW
//=========================

function showLetItRip(){

    const app=document.getElementById("app");

   const player = Game.player.blade;
const cpu = Game.cpu.blade;

const playerCombo = calculateComboStats(
    Game.player.blade,
    Game.player.ratchet,
    Game.player.bit
);

const cpuCombo = calculateComboStats(
    Game.cpu.blade,
    Game.cpu.ratchet,
    Game.cpu.bit
);

const prediction = getMatchPrediction();

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>ROUND ${Game.battle.turn}</h1>

<hr>

<div style="display:flex;justify-content:space-between;text-align:center;margin-bottom:15px;">
    <div style="width:46%;">
        <strong>YOU</strong><br>
        ${Game.player.launch.technique}<br>
        <span style="opacity:.7;">${Game.player.launch.quality}</span>
        <div style="font-size:9px;opacity:.65;margin-top:4px;">${getLaunchTechniqueText("player")}</div>
    </div>
    <div style="width:46%;">
        <strong>CPU</strong><br>
        ${Game.cpu.launch.technique}<br>
        <span style="opacity:.7;">${Game.cpu.launch.quality}</span>
        <div style="font-size:9px;opacity:.65;margin-top:4px;">${getLaunchTechniqueText("cpu")}</div>
    </div>
</div>

<hr>

            <hr>

            <div style="display:flex;justify-content:space-between;text-align:left;">

                <div>

                    <strong>${player.name}</strong><br>

                    ${Game.player.ratchet.name}<br>

                    ${Game.player.bit.name}<br><br>

                    OVR ${playerCombo.ovr}<br><br>

${createStatBar("ATK",playerCombo.stats.attack)}

${createStatBar("KNO",playerCombo.stats.knockback)}

${createStatBar("DEF",playerCombo.stats.defense)}

${createStatBar("MOB",playerCombo.stats.mobility)}

${createStatBar("BAL",playerCombo.stats.balance)}

${createStatBar("STA",playerCombo.stats.stamina)}

${createStatBar("BST",playerCombo.stats.burst)}
                </div>

                <div style="text-align:right;">

                    <strong>${cpu.name}</strong><br>

                    ${Game.cpu.ratchet.name}<br>

                    ${Game.cpu.bit.name}<br><br>

                    OVR ${cpuCombo.ovr}<br><br>

${createStatBar("ATK",cpuCombo.stats.attack)}

${createStatBar("KNO",cpuCombo.stats.knockback)}

${createStatBar("DEF",cpuCombo.stats.defense)}

${createStatBar("MOB",cpuCombo.stats.mobility)}

${createStatBar("BAL",cpuCombo.stats.balance)}

${createStatBar("STA",cpuCombo.stats.stamina)}

${createStatBar("BST",cpuCombo.stats.burst)}

                </div>

            </div>

            <hr>

<div style="margin:18px 0;padding:12px;background:rgba(255,255,255,.08);border-radius:10px;">

    <strong>🎙 COMMENTATOR</strong>

    <p id="predictionText">

        ${prediction}

    </p>

</div>

            <button
                class="menu-btn gold"
                id="skipButton">

                CONTINUE

            </button>

        </section>

    </main>

    `;

  document.getElementById("skipButton").onclick=()=>{

    showLaunchScreen();

};

    // EXPLICIT VS BACK BUTTON — returns to the player's existing combo/stat screen.
    // Do not regenerate the CPU combo when going back.
    const menuCard=document.querySelector(".menu-card");
    if(menuCard){
        const vsBack=document.createElement("button");
        vsBack.type="button";
        vsBack.id="vsBackButton";
        vsBack.className="menu-btn silver";
        vsBack.textContent="← BACK TO COMBO";
        vsBack.style.cssText="display:block;width:100%;margin-top:8px;padding:9px 12px;cursor:pointer;position:relative;z-index:50;";
        vsBack.onclick=(event)=>{
            event.preventDefault();
            event.stopPropagation();
            showComboCard();
        };
        menuCard.appendChild(vsBack);
    }

}

//=========================
// BATTLE SEQUENCE SYSTEM
//=========================

function resetBattleHistory(){

    Game.battle.history=[];
    Game.battle.sequenceIndex=-1;

}

function saveBattleSequence(title,text){

    Game.battle.history.push({
        title:title,
        text:text,
        player:JSON.parse(JSON.stringify(Game.battle.player)),
        cpu:JSON.parse(JSON.stringify(Game.battle.cpu)),
        movement:Game.battle.lastMovement ? JSON.parse(JSON.stringify(Game.battle.lastMovement)) : null,
        event:Game.battle.lastEvent || null,
        round:Game.battle.round || 1,
        score:{player:Game.battle.playerScore || 0,cpu:Game.battle.cpuScore || 0},
        winner:Game.battle.winner || null,
        finish:Game.battle.finish || null,
        finishPoints:Game.battle.finishPoints || 0
    });

    Game.battle.sequenceIndex=Game.battle.history.length-1;

}

function restoreBattleSequence(index){

    const sequence=
        Game.battle.history[index];

    if(!sequence){

        return;

    }

    Game.battle.sequenceIndex=index;

    Game.battle.player=
        JSON.parse(
            JSON.stringify(sequence.player)
        );

    Game.battle.cpu=
        JSON.parse(
            JSON.stringify(sequence.cpu)
        );

    Game.battle.lastMovement=sequence.movement ? JSON.parse(JSON.stringify(sequence.movement)) : null;
    Game.battle.lastEvent=sequence.event || null;

    renderBattleSequence();

}

//=========================
// BATTLE SEQUENCE VIEWER
//=========================

function renderBattleSequence(){
    const app=document.getElementById("app");
    const history=Game.battle.history || [];
    const index=Game.battle.sequenceIndex;
    const sequence=history[index];
    if(!sequence) return;

    const previousDisabled=index<=0 ? "disabled" : "";
    const nextDisabled=index>=history.length-1 ? "disabled" : "";
    const live=index===history.length-1;
    const displayScore=sequence.score || {player:Game.battle.playerScore||0,cpu:Game.battle.cpuScore||0};
    const isResult=/^BATTLE ROUND .* RESULT$/.test(sequence.title);
    const p=Game.battle.player, c=Game.battle.cpu;

    const timeline=history.slice(Math.max(0,history.length-7)).map((entry,i)=>{
        const safeIndex=history.length-7+i < 0 ? i : history.length-7+i;
        const active=safeIndex===index;
        const label=entry.title.replace("BATTLE ROUND ","R").replace(" RESULT","");
        return `<button type="button" data-history-index="${safeIndex}" style="flex:1 1 82px;min-width:78px;padding:6px 7px;border-radius:8px;border:1px solid ${active?'rgba(255,212,59,.65)':'rgba(255,255,255,.08)'};background:${active?'rgba(255,212,59,.12)':'rgba(255,255,255,.04)'};color:inherit;text-align:left;font-size:9px;cursor:pointer;">${safeIndex+1}. ${label}</button>`;
    }).join("");

    const positionSummary=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:7px 0;">
        <div style="padding:7px 8px;border-radius:8px;background:rgba(59,168,255,.08);font-size:10px;"><strong>YOU</strong> · ${Game.player.blade.name}<br><span style="opacity:.7;">NOW · ${formatBattleZone(p.zone)}</span></div>
        <div style="padding:7px 8px;border-radius:8px;background:rgba(255,75,75,.08);font-size:10px;"><strong>CPU</strong> · ${Game.cpu.blade.name}<br><span style="opacity:.7;">NOW · ${formatBattleZone(c.zone)}</span></div>
    </div>`;

    const snapshotMove=sequence.movement;
    const movementSummary=snapshotMove ? `<div style="font-size:9px;opacity:.62;margin:4px 0 7px;">LAST MOVE · YOU ${formatBattleZone(snapshotMove.player.from)} → ${formatBattleZone(snapshotMove.player.to)} · CPU ${formatBattleZone(snapshotMove.cpu.from)} → ${formatBattleZone(snapshotMove.cpu.to)}</div>` : "";

    let decisionPanel="";
    if(live && Game.battle.decisionActive && Game.battle.pendingDecision){
        const d=Game.battle.pendingDecision;
        decisionPanel=`<div style="margin-top:8px;padding:10px;border-radius:10px;border:1px solid rgba(255,212,59,.45);background:rgba(255,212,59,.06);">
            <div style="font-weight:900;font-size:12px;">TACTICAL DECISION</div>
            <p style="line-height:1.35;font-size:11px;margin:5px 0 8px;">${d.scenario}</p>
            ${d.choices.map((choice,i)=>{
                const profile=getDecisionProfile(choice.intent);
                return `<button type="button" class="menu-btn gold tactical-choice-btn" style="margin-top:5px;padding:8px 10px;font-size:11px;text-align:left;cursor:pointer;position:relative;z-index:20;pointer-events:auto;" data-tactical-intent="${choice.intent}">
                    <div>${i+1}. ${choice.name}</div>
                    <div style="font-size:8px;opacity:.68;margin-top:3px;">RISK ${profile.risk} · REWARD ${profile.reward} · ${profile.desc}</div>
                </button>`;
            }).join("")}
        </div>`;
    }

    let resultPanel="";
    if(isResult){
        const winner=sequence.winner || (displayScore.player>displayScore.cpu ? "player" : "cpu");
        const winnerName=winner==="player" ? Game.player.blade.name : Game.cpu.blade.name;
        const points=sequence.finishPoints || 1;
        resultPanel=`<div style="margin:8px 0 9px;padding:13px;border-radius:12px;border:1px solid rgba(255,212,59,.5);background:rgba(255,212,59,.08);text-align:center;">
            <div style="font-size:10px;opacity:.7;letter-spacing:.7px;">${sequence.finish==="Xtreme Finish" ? "XTREME FINISH" : "ROUND COMPLETE"}</div>
            <h2 style="margin:4px 0 2px;font-size:20px;">${winnerName} WINS</h2>
            <div style="font-size:12px;font-weight:800;">${sequence.finish || "Spin Finish"} · +${points} POINT${points===1?'':'S'}</div>
            <div style="display:flex;justify-content:center;gap:22px;margin-top:8px;font-size:12px;"><strong>YOU ${displayScore.player}</strong><strong>CPU ${displayScore.cpu}</strong></div>
        </div>`;
    }

    const continueLabel=isResult ? (Game.battle.matchFinished ? "VIEW MATCH RESULT" : "CONTINUE TO NEXT ROUND") : "CONTINUE";
    const continueButton=(!Game.battle.decisionActive && live) ? `<button class="menu-btn gold" id="continueBattle">${continueLabel}</button>` : "";

    app.innerHTML=`
    <div class="background"></div>
    <main class="menu">
      <section class="menu-card" style="max-width:560px;">
        <h1 style="margin-bottom:2px;">ROUND ${sequence.round || Game.battle.round || 1} · BATTLE</h1>
        <div style="font-size:9px;opacity:.62;">STEP ${index+1}/${history.length} · MAP = CURRENT · LAST MOVE = PREVIOUS STEP</div>
        <div style="display:flex;justify-content:center;gap:22px;margin:6px 0;font-size:11px;"><strong>YOU ${displayScore.player}</strong><strong>CPU ${displayScore.cpu}</strong></div>
        <hr>
        ${renderStadium()}
        ${positionSummary}
        ${renderBattleStatusPanel()}
        ${movementSummary}
        <div style="display:flex;gap:5px;overflow:hidden;margin:6px 0;">${timeline}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0;gap:7px;">
          <button class="menu-btn silver" id="previousSequence" ${previousDisabled} style="padding:7px 11px;font-size:10px;">← BACK</button>
          <strong style="font-size:9px;opacity:.6;">HISTORY</strong>
          <button class="menu-btn silver" id="nextSequence" ${nextDisabled} style="padding:7px 11px;font-size:10px;">NEXT →</button>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,.07);padding-top:7px;">
          <div style="padding:7px 0 3px;white-space:pre-line;line-height:1.35;font-size:11px;max-height:150px;overflow:auto;">${sequence.text}</div>
        </div>
        ${resultPanel}
        ${decisionPanel}
        <div style="margin-top:8px;">${continueButton}</div>
      </section>
    </main>`;

    renderBeys();

    // Tactical choices are bound independently from the generic menu system.
    // They are recreated on every battle render, so bind the fresh elements here.
    document.querySelectorAll(".tactical-choice-btn[data-tactical-intent]").forEach(btn=>{
        btn.addEventListener("click", handleTacticalChoice, {once:true});
    });

    const previous=document.getElementById("previousSequence");
    const next=document.getElementById("nextSequence");
    if(previous) previous.onclick=()=>restoreBattleSequence(index-1);
    if(next) next.onclick=()=>restoreBattleSequence(index+1);
    document.querySelectorAll("[data-history-index]").forEach(btn=>btn.onclick=()=>restoreBattleSequence(Number(btn.dataset.historyIndex)));
    // Decision buttons use the delegated handler installed at startup.
    const cont=document.getElementById("continueBattle");
    if(cont) cont.onclick=()=>continueBattleSequence();
}
//=========================
// CONTINUE BATTLE
//=========================

function continueBattleSequence(){

    const latestSequence=
        Game.battle.history[
            Game.battle.history.length-1
        ];

    // A completed round is still a live result screen. Handle the result
    // before the normal finished-battle guard.
    if(
        Game.battle.finished &&
        latestSequence &&
        /^BATTLE ROUND .* RESULT$/.test(latestSequence.title)
    ){
        if(Game.battle.matchFinished){
            showMatchSummary();
            return;
        }

        Game.battle.round++;
        showLaunchScreen();
        return;
    }

    if(Game.battle.finished){
        const latest=Game.battle.history[Game.battle.history.length-1];
        if(latest && /^BATTLE ROUND .* RESULT$/.test(latest.title)){
            Game.battle.sequenceIndex=Game.battle.history.length-1;
            renderBattleSequence();
        }else{
            endBattleRound();
        }
        return;
    }

// If viewing an older sequence,
    // return to the live/latest sequence first.
    if(
        Game.battle.sequenceIndex <
        Game.battle.history.length-1
    ){

        restoreBattleSequence(
            Game.battle.history.length-1
        );

        return;

    }


    const currentSequence=
        Game.battle.history[
            Game.battle.sequenceIndex
        ];


    // If the last screen was a round result,
    // start the next launch instead of
    // simulating another battle.
    if(
        currentSequence &&
        /^BATTLE ROUND .* RESULT$/.test(currentSequence.title)
    ){

        if(Game.battle.matchFinished){
            showMatchSummary();
            return;
        }

        // A round is complete, not the match. Return to the launch phase so
        // the next round gets a fresh launch and fresh battle state.
        Game.battle.round++;
        showLaunchScreen();
        return;

    }


    // Resume through the main battle engine.
    // This is important because this path handles:
    // movement, automatic events, decisions,
    // grouped commentary, and battle finishes.
    decideNextBattleStep();

}

function showMatchSummary(){
    const app=document.getElementById("app");
    const playerWon=Game.battle.playerScore>Game.battle.cpuScore;
    const winnerName=playerWon ? Game.player.blade.name : Game.cpu.blade.name;
    app.innerHTML=`
    <div class="background"></div>
    <main class="menu"><section class="menu-card" style="max-width:560px;text-align:center;">
      <h1>MATCH COMPLETE</h1><hr>
      <div style="padding:15px 10px;border-radius:12px;background:rgba(255,212,59,.08);border:1px solid rgba(255,212,59,.45);">
        <div style="font-size:10px;opacity:.7;">WINNER</div>
        <h2 style="margin:5px 0 11px;">${winnerName}</h2>
        <div style="display:flex;justify-content:center;gap:35px;font-size:18px;"><strong>YOU ${Game.battle.playerScore}</strong><strong>CPU ${Game.battle.cpuScore}</strong></div>
        <div style="margin-top:9px;font-size:11px;opacity:.8;">The final round is complete.</div>
      </div>
      <button class="menu-btn gold" id="matchDone" style="margin-top:12px;">NEW MATCH</button>
    </section></main>`;
    document.getElementById("matchDone").onclick=()=>location.reload();
}

//=========================
// SHOW ARENA
//=========================

function showArena(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>ROUND ${Game.battle.turn}</h1>

            <hr>

${renderStadium()}

            <hr>

            <p>

                Player Side:
                <strong>${Game.arena.playerSide}</strong>

            </p>

            <p>

                CPU Side:
                <strong>${Game.arena.cpuSide}</strong>

            </p>

            <br>

            <p id="arenaText">

                Entering Stadium...

            </p>

        </section>

    </main>

    `;

   renderBeys();

resetBattleHistory();

Game.battle.phase="Opening";

saveBattleSequence(

    "ENTERING THE STADIUM",

    `${Game.player.blade.name} launches from the ${Game.arena.playerSide} side.

${Game.cpu.blade.name} launches from the ${Game.arena.cpuSide} side.`

);

renderBattleSequence();

}
 
//=========================
// OPENING COMMENTARY
//=========================

function openingCommentary(){
    const text=document.getElementById("arenaText");
    const player=Game.player.blade;
    const cpu=Game.cpu.blade;
    const pLaunch=Game.player.launch;
    const cLaunch=Game.cpu.launch;

    let lines=[];
    lines.push(`${player.name}: ${pLaunch.technique} · ${pLaunch.quality}`);
    lines.push(`${getLaunchTechniqueText("player")}.`);
    lines.push(`${cpu.name}: ${cLaunch.technique} · ${cLaunch.quality}`);
    lines.push(`${getLaunchTechniqueText("cpu")}.`);

    if(!pLaunch.success) lines.push(`⚠ ${pLaunch.reason}`);
    if(!cLaunch.success) lines.push(`⚠ ${cLaunch.reason}`);

    text.innerHTML=lines.join("<br>");
    setTimeout(()=>resolveOpening(),1800);
}


//=========================
// RESOLVE OPENING
//=========================

function resolveOpening(){

    const player = Game.player.blade;
    const cpu = Game.cpu.blade;

    let playerScore = 0;
    let cpuScore = 0;

    // Personality
    playerScore += player.personality.aggression;
    cpuScore += cpu.personality.aggression;

    // Mobility
    playerScore += player.card.mobility;
    cpuScore += cpu.card.mobility;

    // Attack
    playerScore += player.card.attack;
    cpuScore += cpu.card.attack;

   // Launch Quality

const launchBonus={

    Horrible:-15,
    Bad:-8,
    Okay:0,
    Good:8,
    Perfect:15

};

playerScore += launchBonus[Game.player.launch.quality];

cpuScore += launchBonus[Game.cpu.launch.quality];

    switch(Game.player.launch.angle){

        case "Flat":
            playerScore += 5;
            break;

        case "Slight Tilt":
            playerScore += 3;
            break;

        case "Hard Tilt":
            playerScore += 1;
            break;

    }

    switch(Game.cpu.launch.angle){

        case "Flat":
            cpuScore += 5;
            break;

        case "Slight Tilt":
            cpuScore += 3;
            break;

        case "Hard Tilt":
            cpuScore += 1;
            break;

    }

    if(playerScore > cpuScore){

        Game.battle.openingWinner = "Player";
        Game.battle.centerControl = "Player";
        Game.battle.momentum = 70;

    }else if(cpuScore > playerScore){

        Game.battle.openingWinner = "CPU";
        Game.battle.centerControl = "CPU";
        Game.battle.momentum = -70;

    }else{

        Game.battle.openingWinner = "Draw";
        Game.battle.centerControl = "Neutral";
        Game.battle.momentum = 0;

    }

    Game.battle.phase = "Opening";

    showOpeningResult();

}

//=========================
// SHOW OPENING RESULT
//=========================

function showOpeningResult(){

    let text="";

    if(Game.battle.openingWinner==="Player"){

        text=`
        ${Game.player.blade.name} wins the opening clash!

        ${Game.player.blade.name} takes center control.
        `;

    }else if(Game.battle.openingWinner==="CPU"){

        text=`
        ${Game.cpu.blade.name} wins the opening clash!

        ${Game.cpu.blade.name} controls the center.
        `;

    }else{

        text=`
        Neither Bey gains an advantage!

        Both continue circling.
        `;

    }

 document.getElementById("arenaText").innerHTML=text;

setTimeout(()=>{

    // Hand the battle directly to the unified battle engine.
    // Do not run the legacy battleTick/decision loop here.
    decideNextBattleStep();

},2500);

}

//=========================
// DECISION SCREEN
//=========================

function generateDecision(){
    // LIVE DECISIONS USE THE SAME DYNAMIC BATTLE ENGINE AS THE SIMULATION.
    // The old Brace/Counter/Dodge screen was a separate battle system and
    // could resolve collisions through legacy battleTick(), which made the
    // visible decision disagree with the actual battle state.
    generateDynamicDecision();
}

//=========================
// PLAYER MOVE
//=========================

function chooseMove(move){

    Game.player.currentMove=move;

    generateCPUMove();

}

//=========================
// CPU MOVE
//=========================

function generateCPUMove(){

    const moves=[

        "Brace",
        "Counter",
        "Dodge"

    ];

    Game.cpu.currentMove=

        moves[
            Math.floor(Math.random()*moves.length)
        ];

    resolveMoves();

}

//=========================
// RESOLVE MOVES
//=========================

function resolveMoves(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>MOVES</h1>

            <hr>

            <h2>

                You:
                ${Game.player.currentMove}

            </h2>

            <h2>

                CPU:
                ${Game.cpu.currentMove}

            </h2>

            <br>

            <button
                class="menu-btn gold"
                id="continueBtn">

                CONTINUE

            </button>

        </section>

    </main>

    `;

    document.getElementById("continueBtn").onclick=()=>{

        applyMoveEffects();

battleTick();

generateDecision();
     
    };

}

//=========================
// MOVE MODIFIERS
//=========================

function applyMoveEffects(){

    const player=Game.battle.player;
    const cpu=Game.battle.cpu;

    // Reset
    player.attackBonus=0;
    player.defenseBonus=0;
    player.evasionBonus=0;

    cpu.attackBonus=0;
    cpu.defenseBonus=0;
    cpu.evasionBonus=0;

    //-----------------
    // PLAYER
    //-----------------

    switch(Game.player.currentMove){

        case "Brace":
            player.defenseBonus=12;
            break;

        case "Counter":
            player.attackBonus=8;
            break;

        case "Dodge":
            player.evasionBonus=18;
            break;

    }

    //-----------------
    // CPU
    //-----------------

    switch(Game.cpu.currentMove){

        case "Brace":
            cpu.defenseBonus=12;
            break;

        case "Counter":
            cpu.attackBonus=8;
            break;

        case "Dodge":
            cpu.evasionBonus=18;
            break;

    }

}

//=========================
// MATCH PREDICTION
//=========================

function getMatchPrediction(){

    const player=Game.player.blade.card;
    const cpu=Game.cpu.blade.card;

    let playerScore=0;
    let cpuScore=0;

    playerScore+=player.attack;
    cpuScore+=cpu.attack;

    playerScore+=player.defense;
    cpuScore+=cpu.defense;

    playerScore+=player.stamina;
    cpuScore+=cpu.stamina;

    playerScore+=player.balance;
    cpuScore+=cpu.balance;

    playerScore+=player.mobility;
    cpuScore+=cpu.mobility;

    const diff=playerScore-cpuScore;

    let lines=[];

    if(diff>35){

        lines=[

            `I like ${Game.player.blade.name} in this matchup. It has the stronger overall stat profile.`,

            `${Game.player.blade.name} comes in as the favorite. Let's see if it lives up to expectations.`,

            `${Game.cpu.blade.name} has its work cut out for it in this one.`,

            `${Game.player.blade.name} has the edge on paper, but anything can happen in the stadium.`

        ];

    }else if(diff<-35){

        lines=[

            `${Game.cpu.blade.name} looks like the favorite going into this battle.`,

            `${Game.cpu.blade.name} has the stronger overall combo on paper.`,

            `${Game.player.blade.name} will need a great launch to pull off the upset.`,

            `The numbers favor ${Game.cpu.blade.name}, but Beyblade battles are never guaranteed.`

        ];

    }else{

        lines=[

            `This matchup looks incredibly even.`,

            `I don't see a clear favorite here. This could go either way.`,

            `These two combos match up surprisingly well against each other.`,

            `Expect a close battle. One big hit could decide everything.`,

            `Neither blader has a clear advantage entering this match.`

        ];

    }

    return lines[
        Math.floor(Math.random()*lines.length)
    ];

}

//=========================
// START GAME
//=========================

window.addEventListener("DOMContentLoaded",()=>{
    hookMenuButtons();

    // ONE dedicated battle listener. It never touches ordinary menu buttons.
    document.addEventListener("click",(event)=>{
        const target=event.target;
        const button=target && target.closest
            ? target.closest(".tactical-choice-btn[data-tactical-intent]")
            : null;
        if(!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const intent=button.getAttribute("data-tactical-intent");
        if(intent) chooseDynamicMove(intent);
    },true);
});

// Expose the resolver explicitly so inline handlers from an older cached
// battle render cannot fail with "chooseDynamicMove is not defined".
window.chooseDynamicMove=chooseDynamicMove;

