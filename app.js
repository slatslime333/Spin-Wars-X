/*==================================
 SPIN WAR X
 Version 0.5.0
==================================*/

//=========================
// GAME STATE
//=========================

const Game = {

    version:"0.5.0",

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

    }
 
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

        knockback:-1,

        defense:3,

        mobility:-3,

        balance:3,

        stamina:3,

        burst:-4

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
            attack:97,
            knockback:90,
            defense:60,
            mobility:97,
            balance:66,
            stamina:58,
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
    }

}

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
            "BottomRight"
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
        <div style="margin-top:3px;opacity:.62;">NOW · ${formatBattleZone(b.zone)}</div>
    </div>`;
}
function renderBattleStatusPanel(){
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:7px 0;">${renderBattleStatus("player")}${renderBattleStatus("cpu")}</div>`;
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

    // Direct contact bonus
    let contactMultiplier=1;

    if(
        attackerState.zone===
        defenderState.zone
    ){

        contactMultiplier=1.15;

    }

    // Rail impact
    if(attackerState.rail){

        contactMultiplier*=1.35;

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

    if(!battle){

        return;

    }

    const opponentKey=
        bey==="player"
        ? "cpu"
        : "player";

    const opponent=
        Game.battle[opponentKey];

    const combo=
        bey==="player"
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

    const defense=
        combo.stats.defense;

    const balance=
        battle.balance;

    // Stronger momentum and lower defense
    // create longer knockback.
    const force=
        Math.abs(battle.momentum) +
        Math.max(
            0,
            100-defense
        )*0.5;

    let pushes=1;

    if(force>70){

        pushes=2;

    }

    if(force>120){

        pushes=3;

    }

    // Good defense/balance can resist
    if(
        defense>85 &&
        balance>75 &&
        pushes>1
    ){

        pushes--;

    }


    for(
        let i=0;
        i<pushes;
        i++
    ){

        const currentZone=
            battle.zone;

        const neighbors=
            STADIUM_MAP[currentZone]
            ?.neighbors;

        if(
            !neighbors ||
            neighbors.length===0
        ){

            break;

        }

        let destinations=
            neighbors.filter(
                zone=>
                zone!==battle.previousZone
            );

        if(
            destinations.length===0
        ){

            destinations=neighbors;

        }


        // Prefer movement away from opponent
        const saferDestinations=
            destinations.filter(
                zone=>
                zone!==opponent.zone
            );

        if(
            saferDestinations.length>0
        ){

            destinations=
                saferDestinations;

        }


        const oldZone=
            battle.zone;

        const destination=
            destinations[
                Math.floor(
                    Math.random()*
                    destinations.length
                )
            ];

        moveBey(
            bey,
            destination
        );

        battle.previousZone=
            oldZone;


        // Check danger after every push.
        if(
            checkStadiumDanger(bey)
        ){

            return;

        }

    }

}

 //=========================
// CHECK STADIUM DANGER
//=========================

function checkStadiumDanger(bey){

    const battle=
        Game.battle[bey];

    const zone=
        battle.zone;

    //=========================
    // POCKET
    //=========================

    if(
        zone==="LeftPocket" ||
        zone==="RightPocket"
    ){

        const recovery=
            battle.balance+
            battle.spin*0.4;

        const roll=
            Math.random()*100;

        if(
            roll>recovery
        ){

            Game.battle.finish="Over Finish";
            Game.battle.finishPoints=2;
            Game.battle.winner=bey==="player" ? "cpu" : "player";
            endBattleRound();

            return true;

        }

        return false;

    }


    //=========================
    // XTREME ZONE
    //=========================

    if(zone==="XRailExit"){

        const momentum=
            Math.abs(
                battle.momentum
            );

        if(momentum>60){

            Game.battle.finish="Xtreme Finish";
            Game.battle.finishPoints=3;
            Game.battle.winner=bey==="player" ? "cpu" : "player";
            endBattleRound();

            return true;

        }

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
    const situation=Game.battle.situation;

    if(event==="passBy"){

        return "Both Beys rush past each other without a clean hit. They quickly begin repositioning for another opening.";

    }

    if(event==="normalHit"){

        return "The Beys collide with a solid hit. Neither loses control, but the battle is starting to get physical.";

    }

    if(event==="heavyHit"){

        return "A heavy clash knocks both Beys off their lines. The next few moments could create an opening.";

    }

    if(event==="extremeImpact"){

        return "A huge impact sends the Beys flying apart. Their positions are unstable and a dangerous opportunity is developing.";

    }

    if(event==="separation"){

        return "The Beys are separated and circling the stadium, looking for the best path back into the fight.";

    }

    if(situation==="clash"){

        return "The Beys are in the same lane. Your choice matters here because the next contact could change momentum, balance, and position at once.";

    }

    if(situation==="approach"){

        return "The Beys are closing the distance and heading toward another possible clash.";

    }

    return "Both Beys continue moving through the stadium.";
}

//=========================
// GENERATE DYNAMIC DECISION
//=========================

function generateDynamicDecision(){
    if(Game.battle.decisionActive) return;
    const player=Game.battle.player, cpu=Game.battle.cpu;
    const event=Game.battle.lastEvent, situation=Game.battle.situation;
    const playerZone=player.zone, cpuZone=cpu.zone;
    const choices=[];
    let scenario="";

    const playerState=getBeyState("player");
    const cpuState=getBeyState("cpu");
    const playerName=Game.player.blade.name;
    const cpuName=Game.cpu.blade.name;

    if(["LeftPocket","RightPocket"].includes(playerZone)){
        scenario=`DANGER MOMENT — ${playerName} is at ${formatBattleZone(playerZone)}. ${cpuName} is at ${formatBattleZone(cpuZone)} and currently ${cpuState.toLowerCase()}. You need to escape the danger without giving up the whole stadium.`;
        choices.push({name:"Escape toward center",intent:"escape"},{name:"Stabilize immediately",intent:"stabilize"},{name:"Counter the pressure",intent:"counter"});
    }else if(player.balance<40 || player.spin<40){
        scenario=`RECOVERY MOMENT — ${playerName} is ${playerState.toLowerCase()} with ${Math.round(player.spin)}% stamina and ${Math.round(player.balance)}% balance. ${cpuName} is ${cpuState.toLowerCase()}. A safe choice can change the next exchange.`;
        choices.push({name:"Stabilize your Bey",intent:"stabilize"},{name:"Evade and recover",intent:"evade"},{name:"Take one last attack",intent:"attack"});
    }else if(player.rail || cpu.rail || playerZone==="XRailExit" || cpuZone==="XRailExit"){
        scenario=`X RAIL MOMENT — the rail is changing the geometry of the battle. ${playerName}: ${formatBattleZone(playerZone)}. ${cpuName}: ${formatBattleZone(cpuZone)}. The key question is whether you exploit the speed or prepare for the exit.`;
        choices.push({name:"Commit to the X Rail",intent:"attack"},{name:"Control the exit",intent:"hold"},{name:"Evade the rail line",intent:"evade"});
    }else if(situation==="clash" || situation==="crossing" || ["normalHit","glancingHit","pressure","heavyHit","extremeImpact","counterHit"].includes(event)){
        scenario=`CLASH MOMENT — ${playerName} is ${playerState.toLowerCase()} while ${cpuName} is ${cpuState.toLowerCase()}. They are close enough that your next choice can change who controls the next exchange.`;
        choices.push({name:"Brace for impact",intent:"brace"},{name:"Attempt a counter",intent:"counter"},{name:"Evade the next line",intent:"evade"});
    }else if(situation==="approach"){
        scenario=`APPROACHING — ${playerName} and ${cpuName} are closing lanes. ${playerName} has ${Math.round(player.momentum)}% momentum and ${cpuName} has ${Math.round(cpu.momentum)}%. Choose whether to meet the attack, redirect it, or change the path.`;
        choices.push({name:"Meet the attack",intent:"attack"},{name:"Prepare a counter",intent:"counter"},{name:"Change your path",intent:"evade"});
    }else{
        scenario=`POSITIONING MOMENT — the Beys are separated. ${playerName} is at ${formatBattleZone(playerZone)} and ${cpuName} is at ${formatBattleZone(cpuZone)}. No hit is guaranteed here; your choice determines what kind of opportunity you try to create.`;
        choices.push({name:"Chase the opponent",intent:"chase"},{name:"Take the center",intent:"center"},{name:"Hold your current line",intent:"hold"});
    }

    Game.battle.decisionChoices=choices;
    Game.battle.pendingDecision={scenario,choices};
    Game.battle.decisionActive=true;
    saveBattleSequence("TACTICAL DECISION",`${scenario}

Choose your move:`);
    Game.battle.sequenceIndex=Game.battle.history.length-1;
    renderBattleSequence();
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
                        class="menu-btn gold decision-btn"
                        onclick="chooseDynamicMove('${choice.intent}')"
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

}

//=========================
// CHOOSE DYNAMIC MOVE
//=========================

function chooseDynamicMove(intent){
    if(!Game.battle.decisionActive || !Game.battle.pendingDecision) return;
    const choice=Game.battle.pendingDecision.choices.find(c=>c.intent===intent);
    const label=choice ? choice.name : intent;
    const latest=Game.battle.history[Game.battle.history.length-1];
    if(latest && latest.title==="TACTICAL DECISION"){
        latest.text += `\n\nYOU CHOSE: ${label}`;
    }
    Game.battle.decisionActive=false;
    Game.battle.pendingDecision=null;
    Game.battle.player.intent=intent;
    resolvePlayerIntent();
}
//=========================
// RESOLVE PLAYER INTENT
//=========================

function resolvePlayerIntent(){

    const intent=Game.battle.player.intent;

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
//=========================
// ROLL INTENT RESULT
//=========================

function rollIntentResult(blader,intent){

    const stats=calculateComboStats(
        Game[blader].blade,
        Game[blader].ratchet,
        Game[blader].bit
    );

    const battle=Game.battle[blader];

    let chance=50;

    switch(intent){

        case "escape":
        case "evade":

            chance+=
                (stats.stats.mobility-75)*0.9;

            break;

        case "attack":
        case "chase":

            chance+=
                (stats.stats.attack-75)*0.6;

            chance+=
                (stats.stats.mobility-75)*0.3;

            break;

        case "counter":

            chance+=
                (stats.stats.attack-75)*0.5;

            chance+=
                (stats.stats.knockback-75)*0.4;

            break;

        case "brace":

            chance+=
                (stats.stats.defense-75)*0.7;

            chance+=
                (stats.stats.balance-75)*0.3;

            break;

        case "stabilize":

            chance+=
                (stats.stats.balance-75)*0.9;

            break;

        case "center":

            chance+=
                (stats.stats.mobility-75)*0.5;

            break;

        case "hold":

            chance+=
                (stats.stats.balance-75)*0.5;

            break;

    }

    if(battle.balance<40){

        chance-=12;

    }

    chance=Math.max(
        15,
        Math.min(85,chance)
    );

    const roll=Math.random()*100;

    if(roll<chance*0.30){

        return "perfect";

    }

    if(roll<chance){

        return "success";

    }

    if(roll<chance+20){

        return "partial";

    }

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

    if(result==="fail"){

        return;

    }

    const currentZone=battle.zone;

    const neighbors=
        STADIUM_MAP[currentZone].neighbors;

    if(!neighbors || neighbors.length===0){

        return;

    }

    const opponent=
        blader==="player"
        ? "cpu"
        : "player";

    const opponentZone=
        Game.battle[opponent].zone;

    let targetZone=null;


    // ESCAPE / EVADE / CENTER
    if(
        intent==="escape" ||
        intent==="evade" ||
        intent==="center"
    ){

        if(neighbors.includes("Center")){

            targetZone="Center";

        }

    }


    // CHASE / ATTACK / COUNTER
    if(
        intent==="chase" ||
        intent==="attack" ||
        intent==="counter"
    ){

        if(neighbors.includes(opponentZone)){

            targetZone=opponentZone;

        }

    }


    // STABILIZE
    if(intent==="stabilize"){

        battle.balance=
            Math.min(
                100,
                battle.balance+
                (
                    result==="perfect"
                    ? 15
                    : 8
                )
            );

    }


    // PERFECT MOVE = extra momentum
    if(result==="perfect"){

        battle.momentum+=15;

    }

    // PARTIAL MOVE = small momentum
    if(result==="partial"){

        battle.momentum+=5;

    }


    // MOVE IF A VALID ZONE EXISTS
    if(targetZone){

        moveBey(
            blader,
            targetZone
        );

    }

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

    let text="";
    let event=null;

    //=========================
    // ATTACK VS BRACE
    //=========================

    if(
        playerIntent==="attack" &&
        cpuIntent==="brace"
    ){

        if(
            playerResult==="perfect" ||
            playerResult==="success"
        ){

            text=
            "You attack, but the CPU braces for impact. The hit lands, but much of the force is absorbed.";

            event="normalHit";

        }else{

            text=
            "You try to attack, but the CPU holds its ground and your approach loses momentum.";

            event="passBy";

        }

    }


    //=========================
    // ATTACK VS EVADE / ESCAPE
    //=========================

    else if(
        playerIntent==="attack" &&
        (
            cpuIntent==="evade" ||
            cpuIntent==="escape"
        )
    ){

        if(
            playerResult==="perfect" &&
            cpuResult!=="perfect"
        ){

            text=
            "You read the escape perfectly and catch the CPU Bey with a clean hit.";
         
Game.battle.forcedWinner="player";
            event="heavyHit";

        }else if(
            cpuResult==="perfect" ||
            cpuResult==="success"
        ){

            text=
            "You attack, but the CPU slips away before you can land a clean hit.";

            event="passBy";

        }else{

            text=
            "Both Beys scramble for position, but neither gains a clean advantage.";

            event="normalHit";

        }

    }


    //=========================
    // COUNTER VS ATTACK
    //=========================

    else if(
        playerIntent==="counter" &&
        cpuIntent==="attack"
    ){

        if(
            playerResult==="perfect" &&
            cpuResult!=="perfect"
        ){

            text=
            "Perfect timing! You catch the CPU's attack and redirect the impact with a powerful counter.";

            event="heavyHit";

        }else if(
            cpuResult==="perfect"
        ){

            text=
            "You attempt the counter too early. The CPU breaks through with a powerful attack.";

Game.battle.forcedWinner="cpu";
event="heavyHit";
         
        }else{

            text=
            "The attack and counter collide in a hard clash.";

            event="normalHit";

        }

    }


    //=========================
    // CHASE VS ESCAPE
    //=========================

    else if(
        playerIntent==="chase" &&
        (
            cpuIntent==="escape" ||
            cpuIntent==="evade"
        )
    ){

        if(
            playerResult==="perfect" &&
            cpuResult!=="perfect"
        ){

            text=
            "You cut off the escape route and catch the CPU Bey.";

            event="normalHit";

        }else if(
            cpuResult==="perfect" ||
            cpuResult==="success"
        ){

            text=
            "The CPU escapes and creates space between the Beys.";

            event="passBy";

        }else{

            text=
            "You close the distance, but the CPU barely avoids a direct clash.";

            event="passBy";

        }

    }


    //=========================
    // ATTACK VS ATTACK
    //=========================

    else if(
        playerIntent==="attack" &&
        cpuIntent==="attack"
    ){

        if(
            playerResult==="perfect" &&
            cpuResult!=="perfect"
        ){

            text=
            "You win the head-on clash and drive the CPU backward.";

            event="heavyHit";

        }else if(
            cpuResult==="perfect" &&
            playerResult!=="perfect"
        ){

            text=
            "The CPU wins the head-on clash and knocks you backward.";

            event="cpuHeavyHit";

        }else{

            text=
            "Both Beys collide head-on in a violent clash.";

            event="normalHit";

        }

    }


    //=========================
    // DEFAULT
    //=========================

    else{

        if(
            playerResult==="perfect" &&
            cpuResult!=="perfect"
        ){

            text=
            "Your move works perfectly and you gain the better position.";

            event="separation";

        }else if(
            cpuResult==="perfect" &&
            playerResult!=="perfect"
        ){

            text=
            "The CPU reacts perfectly and takes control of the position.";

            event="separation";

        }else{

            text=
            "Both Beys continue battling for position.";

            event="passBy";

        }

    }


    Game.battle.lastEvent=event;

if(event){

    applyBattleEvent(event);

}

if(checkBattleFinish()){

    return;

}

showIntentResult(
    playerIntent,
    cpuIntent,
    playerResult,
    text
);

}

//=========================
// SHOW INTENT RESULT
//=========================

function showIntentResult(intent,cpuIntent,result,text){
    const p=Game.battle.player, c=Game.battle.cpu;
    const detail=`${text}

YOUR MOVE: ${intent}
CPU RESPONSE: ${cpuIntent}
RESULT: ${result.toUpperCase()}

CURRENT POSITION
${Game.player.blade.name}: ${formatBattleZone(p.zone)}
${Game.cpu.blade.name}: ${formatBattleZone(c.zone)}`;
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

    const beyName=bey==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    const combo=calculateComboStats(
        bey==="player" ? Game.player.blade : Game.cpu.blade,
        bey==="player" ? Game.player.ratchet : Game.cpu.ratchet,
        bey==="player" ? Game.player.bit : Game.cpu.bit
    );

    const exitZone="TopCenter";
    const contact=opponent.zone===exitZone || STADIUM_MAP[exitZone]?.neighbors?.includes(opponent.zone);
    const railPower=(combo.stats.attack||60)*0.35+(combo.stats.knockback||60)*0.45+(battle.momentum||0)*0.55+(battle.railSpeed||0)*0.35;

    moveBey(bey,exitZone);
    battle.railDashing=false;
    battle.xExit=false;
    battle.railSpeed=Math.max(0,(battle.railSpeed||0)-10);

    if(contact && railPower>55){
        Game.battle.forcedWinner=bey;
        return {resolved:true,event:"railImpact",side:bey};
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
    const dangerZones=["LeftPocket","RightPocket"];
    const railZones=["LeftRail","RightRail"];
    let bestZone=neighbors[0], bestScore=-Infinity;

    for(const zone of neighbors){
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

    if(
        Game.battle.turn>
        Game.battle.maxTurns
    ){

        endBattleRound();

        return;

    }


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
    const pCombo=calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit);
    const cCombo=calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit);
    const pPower=(pCombo?.stats.attack||60)*0.48+(pCombo?.stats.knockback||60)*0.32+(pCombo?.stats.mobility||60)*0.10+player.speed*0.10+player.momentum*0.30;
    const cPower=(cCombo?.stats.attack||60)*0.48+(cCombo?.stats.knockback||60)*0.32+(cCombo?.stats.mobility||60)*0.10+cpu.speed*0.10+cpu.momentum*0.30;
    const close=situation==="clash" || situation==="crossing";
    const near=situation==="approach";
    const railSide=player.rail ? "player" : cpu.rail ? "cpu" : null;
    const attacker=pPower>=cPower ? "player" : "cpu";
    const defender=attacker==="player" ? "cpu" : "player";
    const attackerCombo=attacker==="player" ? pCombo : cCombo;
    const defenderCombo=defender==="player" ? pCombo : cCombo;
    const advantage=(pPower-cPower)*0.35 + ((attackerCombo?.stats.attack||60)-(defenderCombo?.stats.defense||60))*0.20;
    const adjustedRoll=Math.max(0,Math.min(100,Math.random()*100-advantage*0.45));

    let event="separation";
    if(railSide){
        event=adjustedRoll < 48 ? "railDash" : ((attackerCombo?.stats.knockback||60)>80 ? "railImpact" : "railDash");
    }else if(situation==="separated"){
        if(adjustedRoll<38) event="reposition";
        else if(adjustedRoll<55) event="nearMiss";
        else if(adjustedRoll<72) event="separation";
        else event="pressure";
    }else if(near){
        if(adjustedRoll<14) event="nearMiss";
        else if(adjustedRoll<30) event="glancingHit";
        else if(adjustedRoll<50) event="pressure";
        else if(adjustedRoll<76) event="normalHit";
        else event="heavyHit";
    }else if(close){
        if(Game[defender].currentMove==="Counter" && adjustedRoll<35){
            Game.battle.forcedWinner=defender; event="counterHit";
        }else if(adjustedRoll<8) event="nearMiss";
        else if(adjustedRoll<24) event="glancingHit";
        else if(adjustedRoll<44) event="pressure";
        else if(adjustedRoll<72) event="normalHit";
        else if(adjustedRoll<92) event="heavyHit";
        else event="extremeImpact";
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
    const playerCombo=calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit);
    const cpuCombo=calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit);

    if(event==="passBy" || event==="nearMiss"){
        player.spin=Math.max(0,player.spin-1);
        cpu.spin=Math.max(0,cpu.spin-1);
        Game.battle.lastHitWinner=null;
        return;
    }

    if(event==="separation" || event==="reposition"){
        player.spin=Math.max(0,player.spin-1);
        cpu.spin=Math.max(0,cpu.spin-1);
        player.balance=Math.min(100,player.balance+1);
        cpu.balance=Math.min(100,cpu.balance+1);
        Game.battle.lastHitWinner=null;
        return;
    }

    if(event==="railDash"){
        const side=Game.battle.railEvent?.side || (player.rail ? "player" : "cpu");
        const b=Game.battle[side];
        b.momentum=Math.min(100,b.momentum+18);
        b.railSpeed=Math.min(100,(b.railSpeed||0)+20);
        b.spin=Math.max(0,b.spin-1);
        Game.battle.lastHitWinner=null;
        return;
    }

    let winner=Game.battle.forcedWinner;
    if(winner!="player" && winner!="cpu") winner=null;
    Game.battle.forcedWinner=null;

    const playerPower=(playerCombo.stats.attack||60)*0.55+(playerCombo.stats.knockback||60)*0.45+player.speed*0.15+player.momentum*0.30+(player.attackBonus||0);
    const cpuPower=(cpuCombo.stats.attack||60)*0.55+(cpuCombo.stats.knockback||60)*0.45+cpu.speed*0.15+cpu.momentum*0.30+(cpu.attackBonus||0);

    if(!winner){
        winner=playerPower>=cpuPower ? "player" : "cpu";
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

    let strength=1;
    if(event==="glancingHit") strength=0.65;
    if(event==="pressure") strength=0.85;
    if(event==="normalHit") strength=1.0;
    if(event==="counterHit") strength=1.25;
    if(event==="heavyHit") strength=1.7;
    if(event==="extremeImpact") strength=2.5;
    if(event==="railImpact") strength=2.15;

    const launchBonus=Game[winner].launch?.attackBonus || 0;
    const impactBase=Math.max(0,
        ((winnerCombo.stats.attack||60)*0.55+(winnerCombo.stats.knockback||60)*0.45+winnerState.momentum*0.35+winnerState.speed*0.12+launchBonus) -
        ((loserCombo.stats.defense||60)*0.55+(loserCombo.stats.balance||60)*0.45)
    );

    const defenderStaminaFactor=Math.max(0.85,Math.min(1.15,100/(loserCombo.stats.stamina||80)));
    const spinDamage=Math.max(2,Math.round((5+impactBase*0.18)*strength*defenderStaminaFactor + Math.random()*2 + Math.max(0,winnerState.momentum)*0.04));
    const balanceDamage=Math.max(2,Math.round((3+impactBase*0.10)*strength + Math.random()*3));

    loserState.spin=Math.max(0,loserState.spin-spinDamage);
    loserState.balance=Math.max(0,loserState.balance-balanceDamage);
    winnerState.spin=Math.max(0,winnerState.spin-1);
    winnerState.momentum=Math.min(100,winnerState.momentum+(event==="extremeImpact"?18:event==="heavyHit"?12:event==="railImpact"?15:5));
    loserState.momentum=Math.max(-100,loserState.momentum-(event==="extremeImpact"?22:event==="heavyHit"?15:8));

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

    Game.battle.lastHitDamage={
        spin:spinDamage,
        balance:balanceDamage,
        beforeSpin,
        beforeBalance,
        afterSpin:loserState.spin,
        afterBalance:loserState.balance,
        beforeState,
        afterState:getBeyState(loser)
    };

    if(checkStadiumDanger(loser)) return;
}
//=========================
// EVENT COMMENTARY
//=========================

function formatBattleZone(zone){
    const names={TopLeft:"Top Left",TopCenter:"Top Center",TopRight:"Top Right",LeftMid:"Left Mid",Center:"Center",RightMid:"Right Mid",BottomLeft:"Bottom Left",BottomCenter:"Bottom Center",BottomRight:"Bottom Right",LeftRail:"X Rail — Left",RightRail:"X Rail — Right",XRailExit:"X Exit",LeftPocket:"Left Pocket",RightPocket:"Right Pocket"};
    return names[zone] || zone || "Unknown";
}

function generateEventCommentary(event){
    const p=Game.battle.player, c=Game.battle.cpu;
    const winner=Game.battle.lastHitWinner, damage=Game.battle.lastHitDamage;
    const playerName=Game.player.blade.name, cpuName=Game.cpu.blade.name;
    const pos=`${playerName} is at ${formatBattleZone(p.zone)} while ${cpuName} is at ${formatBattleZone(c.zone)}.`;
    const momentumLeader=p.momentum>=c.momentum ? playerName : cpuName;
    const leaderState=getBeyState(p.momentum>=c.momentum ? "player" : "cpu");

    if(event==="nearMiss") return `Near miss! ${playerName} and ${cpuName} threaten the same line but slip past each other. ${momentumLeader} keeps the initiative (${leaderState.toLowerCase()}). ${pos}`;
    if(event==="reposition") return `${playerName} and ${cpuName} reset their lines instead of forcing contact. That pause matters: both Beys are trying to reach a better angle before committing. ${pos}`;
    if(event==="railDash") return `X RAIL! A Bey commits to the rail, building speed instead of trading a normal hit. The important change is position and momentum, not damage yet. ${pos}`;
    if(event==="separation") return `The Beys stay apart and fight for the next lane. No forced collision develops, so positioning matters more than raw impact this moment. ${pos}`;
    if(!winner || !damage) return `${playerName} and ${cpuName} make contact, but the exchange does not create a clear swing. ${pos}`;

    const winnerName=winner==="player" ? playerName : cpuName;
    const loserName=winner==="player" ? cpuName : playerName;
    const winnerCombo=winner==="player" ? calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit) : calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit);
    const loserCombo=winner==="player" ? calculateComboStats(Game.cpu.blade,Game.cpu.ratchet,Game.cpu.bit) : calculateComboStats(Game.player.blade,Game.player.ratchet,Game.player.bit);
    const difference=(winnerCombo.stats.attack+winnerCombo.stats.knockback)-(loserCombo.stats.defense+loserCombo.stats.balance);
    const reason=difference>35 ? `${winnerName} had a clear power advantage on contact.` : difference>5 ? `${winnerName} found the better angle and converted the exchange.` : `${winnerName} won a close exchange through timing and momentum.`;
    const stateLine=`${loserName} loses ${damage.spin} stamina and ${damage.balance} balance. ${loserName} shifts from ${damage.beforeState} to ${damage.afterState}.`;

    if(event==="glancingHit") return `${winnerName} clips ${loserName} rather than landing square. ${reason} It is enough to disturb the line, but not enough to decide the battle. ${stateLine}`;
    if(event==="pressure") return `${winnerName} keeps contact pressure on ${loserName} and forces a hurried recovery. ${reason} This is a positional win more than a knockout blow. ${stateLine}`;
    if(event==="counterHit") return `COUNTER! ${winnerName} reads the incoming line and turns the attack back. ${reason} ${loserName} is now giving up the initiative while ${winnerName} can press the advantage. ${stateLine}`;
    if(event==="railImpact") return `X RAIL IMPACT! ${winnerName} launches off the rail with built-up speed and catches ${loserName} at the exit. ${reason} The rail created the attack angle; the impact created the damage. ${stateLine}`;
    if(event==="normalHit") return `${winnerName} lands a clean hit. ${reason} ${stateLine}`;
    if(event==="heavyHit") return `HEAVY IMPACT! ${winnerName} breaks ${loserName}'s line with a committed strike. ${reason} The hit changes the momentum of the battle, forcing ${loserName} into recovery. ${stateLine}`;
    if(event==="extremeImpact") return `EXTREME IMPACT! ${winnerName} finds a rare high-quality collision and drives through ${loserName}. ${reason} This is a major swing, not just another hit. ${stateLine}`;
    return `${winnerName} gains the exchange. ${stateLine}`;
}
//=========================
// AFTER AUTO EVENT
//=========================

function resolveAutomaticEvent(event){
    if(!Game.battle.sequenceEvents) Game.battle.sequenceEvents=[];
    applyBattleEvent(event);
    if(checkBattleFinish()){ Game.battle.sequenceEvents=[]; return; }

    const movement=Game.battle.lastMovement;
    const playerMove=movement ? `${formatBattleZone(movement.player.from)} → ${formatBattleZone(movement.player.to)}` : formatBattleZone(Game.battle.player.zone);
    const cpuMove=movement ? `${formatBattleZone(movement.cpu.from)} → ${formatBattleZone(movement.cpu.to)}` : formatBattleZone(Game.battle.cpu.zone);
    const eventText=generateEventCommentary(event);
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

    const text=Game.battle.sequenceEvents.map((item,i)=>`${i+1}. ${item.event.replace(/([A-Z])/g," $1").toUpperCase()}
${item.move}
${item.text}`).join("\n\n");
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

   if(
    Game.battle.turn >=
    Game.battle.maxTurns
){

    Game.battle.player.spin=
        Math.max(
            0,
            Game.battle.player.spin-12
        );

    Game.battle.cpu.spin=
        Math.max(
            0,
            Game.battle.cpu.spin-12
        );

    Game.battle.player.balance=
        Math.max(
            0,
            Game.battle.player.balance-6
        );

    Game.battle.cpu.balance=
        Math.max(
            0,
            Game.battle.cpu.balance-6
        );


    if(checkBattleFinish()){

        return;

    }


    setTimeout(()=>{

        simulateBattleRound();

    },300);

    return;

}
    // Always simulate at least the first
    // two rounds before allowing a decision.
    if(Game.battle.turn < 2){

        setTimeout(()=>{

            simulateBattleRound();

        },300);

        return;

    }

    const meaningfulMoment=[
        "heavyHit","extremeImpact","counterHit","railImpact","pressure"
    ].includes(Game.battle.lastEvent);
    const scheduledMoment=Game.battle.turn>0 && Game.battle.turn%3===0;
    const dangerous=Game.battle.player.balance<45 || Game.battle.player.spin<45 || ["LeftPocket","RightPocket","LeftRail","RightRail","XRailExit"].includes(Game.battle.player.zone);

    if(meaningfulMoment || scheduledMoment || dangerous){
        generateDynamicDecision();
        return;
    }

    setTimeout(()=>{

        simulateBattleRound();

    },300);

}

//=========================
// CHECK BATTLE FINISH
//=========================

function checkBattleFinish(){

    const player=Game.battle.player;
    const cpu=Game.battle.cpu;


    if(player.spin<=0){

        Game.battle.finish="Spin Finish";
        Game.battle.finishPoints=1;
        Game.battle.winner="cpu";

        endBattleRound();

        return true;

    }


    if(cpu.spin<=0){

        Game.battle.finish="Spin Finish";
        Game.battle.finishPoints=1;
        Game.battle.winner="player";

        endBattleRound();

        return true;

    }


    if(player.balance<=0){

        Game.battle.finish="Over Finish";
        Game.battle.finishPoints=2;
        Game.battle.winner="cpu";

        endBattleRound();

        return true;

    }


    if(cpu.balance<=0){

        Game.battle.finish="Over Finish";
        Game.battle.finishPoints=2;
        Game.battle.winner="player";

        endBattleRound();

        return true;

    }


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
    const points=Game.battle.finishPoints || 1;

    if(winner==="player") Game.battle.playerScore+=points;
    else if(winner==="cpu") Game.battle.cpuScore+=points;

    const winnerName=winner==="player" ? Game.player.blade.name : Game.cpu.blade.name;
    const matchWinner=Game.battle.playerScore>=Game.battle.pointsToWin || Game.battle.cpuScore>=Game.battle.pointsToWin;
    Game.battle.matchFinished=matchWinner;

    const text=`${(Game.battle.finish || "SPIN FINISH").toUpperCase()}!

${winnerName} WINS BATTLE ROUND ${Game.battle.round}

+${points} POINT${points===1 ? "" : "S"}

SCORE AFTER ROUND
YOU: ${Game.battle.playerScore} / ${Game.battle.pointsToWin}
CPU: ${Game.battle.cpuScore} / ${Game.battle.pointsToWin}

${matchWinner ? "MATCH COMPLETE — VIEW THE FINAL RESULT." : "ROUND COMPLETE — REVIEW THE RESULT BEFORE THE NEXT LAUNCH."}`;

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
    Game.battle.maxTurns=Math.floor(Math.random()*3)+4;
    Game.battle.decisionActive=false;
    Game.battle.pendingDecision=null;
    Game.battle.decisionChoices=[];
    Game.battle.turn=0;
    Game.battle.sequenceEvents=[];
    Game.battle.sequenceTarget=null;
    Game.battle.lastEvent=null;
    Game.battle.lastHitWinner=null;
    Game.battle.lastHitDamage=null;
    Game.battle.lastMovement=null;
    Game.battle.railEvent=null;
    Game.battle.openingInteractionResolved=false;

    const pCombo=syncBattleStats("player");
    const cCombo=syncBattleStats("cpu");
    const p=Game.battle.player, c=Game.battle.cpu;

    p.spin=clampBattleValue(pCombo?.stats?.stamina ?? 80);
    p.balance=clampBattleValue(pCombo?.stats?.balance ?? 80);
    p.speed=clampBattleValue(pCombo?.stats?.mobility ?? 70);
    p.momentum=0; p.railSpeed=0; p.behavior="circling"; p.behaviorTurns=0;
    p.rail=false; p.xExit=false; p.reverseDash=false; p.xrailDash=false;

    c.spin=clampBattleValue(cCombo?.stats?.stamina ?? 80);
    c.balance=clampBattleValue(cCombo?.stats?.balance ?? 80);
    c.speed=clampBattleValue(cCombo?.stats?.mobility ?? 70);
    c.momentum=0; c.railSpeed=0; c.behavior="circling"; c.behaviorTurns=0;
    c.rail=false; c.xExit=false; c.reverseDash=false; c.xrailDash=false;

    const roundText=`BATTLE ROUND ${Game.battle.round}

MATCH SCORE

YOU: ${Game.battle.playerScore} / 7
CPU: ${Game.battle.cpuScore} / 7

${Game.player.blade.name.toUpperCase()}
VS
${Game.cpu.blade.name.toUpperCase()}

STAMINA AT LAUNCH · YOU ${Math.round(p.spin)}% · CPU ${Math.round(c.spin)}%

GET READY!`;

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

    const buttons = document.querySelectorAll(".menu-btn");

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

    Game.screen = "bladeDraft";

    const pool = Object.values(BLADE_ENGINE).filter(blade=>{

    if(Game.mode==="bronze") return blade.tier==="Bronze";

    if(Game.mode==="silver") return blade.tier==="Silver";

    if(Game.mode==="gold") return blade.tier==="Gold";

    return true;

});

    const draftBlades = [...pool]
        .sort(()=>Math.random()-0.5)
        .slice(0,3);

    renderBladeDraft(draftBlades);

}

//=========================
// RENDER DRAFT
//=========================

function renderBladeDraft(blades){

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">🎴</div>

            <h1>CHOOSE BLADE</h1>

            <p>Select your Blade</p>

        </div>

        <section class="menu-card" id="bladeContainer">

        </section>

    </main>

    `;

    const container =
    document.getElementById("bladeContainer");

    blades.forEach(blade=>{

        container.appendChild(createBladeCard(blade));

    });
container.appendChild(

    createBackButton(()=>{

        location.reload();

    })

);
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

            modifier.defense+=2;
            modifier.balance+=2;
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

    Game.screen="ratchetDraft";

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">⚙</div>

            <h1>CHOOSE RATCHET</h1>

            <p>${Game.player.blade.name}</p>

        </div>

        <section class="menu-card" id="ratchetContainer">

        </section>

    </main>

    `;

    const container=document.getElementById("ratchetContainer");

    const draftRatchets=[...RATCHETS]
.sort(()=>Math.random()-0.5)
.slice(0,3);

draftRatchets.forEach(r=>{

    const button=document.createElement("button");

    button.className="menu-btn silver";

    button.textContent=r.name;

    button.onclick=()=>{

        Game.player.ratchet=r;

        showBitDraft();
    
    };

    container.appendChild(button);

});
 container.appendChild(

    createBackButton(()=>{

        showBladeDraft();

    })

);
 
}

//=========================
// SHOW BITS
//=========================

function showBitDraft(){

    Game.screen="bitDraft";

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">💿</div>

            <h1>CHOOSE BIT</h1>

            <p>${Game.player.blade.name}</p>

        </div>

        <section class="menu-card" id="bitContainer">

        </section>

    </main>

    `;

    const container=document.getElementById("bitContainer");

    const draftBits = Object.values(BIT_ENGINE)
    .sort(()=>Math.random()-0.5)
    .slice(0,3);

draftBits.forEach(bit=>{

    const button=document.createElement("button");

    button.className="menu-btn bronze";

    button.textContent=bit.name;

    button.onclick=()=>{

        Game.player.bit=bit;
        syncBattleStats("player");

        showComboCard();

    };

    container.appendChild(button);

});

container.appendChild(

    createBackButton(()=>{

        showRatchetPlaceholder();

    })

);

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

    return bladeData.compatibility.bits[
        bit.name.replace(/ /g,"")
    ] ?? 50;

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

        synergy.attack+=8;
        synergy.knockback+=6;
        synergy.mobility+=10;
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

        synergy.attack+=9;
        synergy.knockback+=7;
        synergy.mobility+=11;
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
    // HEIGHT INTERACTION
    //=========================

    if(
        ratchet.height==="Low"
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

   const baseOVR = bladeData.card.ovr;

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

        meta:Math.round(
            (ovr+compatibility)/2
        )

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

    switch(target.launch.quality){

        case "Horrible":

            target.launch.spinBonus=-15;
            target.launch.balanceBonus=-15;
            target.launch.positionBonus=-2;
            break;

        case "Bad":

            target.launch.spinBonus=-8;
            target.launch.balanceBonus=-6;
            target.launch.positionBonus=-1;
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
            break;

        case "Perfect":

            target.launch.spinBonus=10;
            target.launch.balanceBonus=8;
            target.launch.positionBonus=2;
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

        setTimeout(()=>{

            applyLaunchQuality("player");  generateCPULaunch();

        },700);

    };

}

//=========================
// CPU LAUNCH
//=========================

function generateCPULaunch(){

    const angles=[

        "Flat",
        "Slight Tilt",
        "Hard Tilt"

    ];

   const techniques=[

    "Center",
    "X-Rail",
    "Direct Clash",
    "Drop Launch",
    "Wide Circle"

];

    Game.cpu.launch.angle=

        angles[
            Math.floor(Math.random()*angles.length)
        ];

    Game.cpu.launch.technique=

    techniques[
        Math.floor(Math.random()*techniques.length)
    ];

// Roll CPU launch quality
Game.cpu.launch.quality = rollQuality();

// Apply bonuses/penalties
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

    <div>

        <strong>YOU</strong>

        <br>

        ${Game.player.launch.quality}

    </div>

    <div>

        <strong>CPU</strong>

        <br>

        ${Game.cpu.launch.quality}

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
    const isResult=sequence.title.includes("RESULT");
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
            ${d.choices.map((choice,i)=>`<button class="menu-btn gold decision-btn" style="margin-top:5px;padding:8px 10px;font-size:11px;" onclick="chooseDynamicMove('${choice.intent}')">${i+1}. ${choice.name}</button>`).join("")}
        </div>`;
    }

    let resultPanel="";
    if(isResult){
        const winner=sequence.winner || (displayScore.player>displayScore.cpu ? "player" : "cpu");
        const winnerName=winner==="player" ? Game.player.blade.name : Game.cpu.blade.name;
        const points=sequence.finishPoints || 1;
        resultPanel=`<div style="margin:8px 0 9px;padding:13px;border-radius:12px;border:1px solid rgba(255,212,59,.5);background:rgba(255,212,59,.08);text-align:center;">
            <div style="font-size:10px;opacity:.7;letter-spacing:.7px;">ROUND COMPLETE</div>
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
          <div style="padding:7px 0 3px;white-space:pre-line;line-height:1.38;font-size:11px;">${sequence.text}</div>
        </div>
        ${resultPanel}
        ${decisionPanel}
        <div style="margin-top:8px;">${continueButton}</div>
      </section>
    </main>`;

    renderBeys();
    const previous=document.getElementById("previousSequence");
    const next=document.getElementById("nextSequence");
    if(previous) previous.onclick=()=>restoreBattleSequence(index-1);
    if(next) next.onclick=()=>restoreBattleSequence(index+1);
    document.querySelectorAll("[data-history-index]").forEach(btn=>btn.onclick=()=>restoreBattleSequence(Number(btn.dataset.historyIndex)));
    const cont=document.getElementById("continueBattle");
    if(cont) cont.onclick=()=>continueBattleSequence();
}
//=========================
// CONTINUE BATTLE
//=========================

function continueBattleSequence(){

    if(Game.battle.finished){

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
        currentSequence.title.includes("RESULT")
    ){

        if(Game.battle.matchFinished){
            showMatchSummary();
            return;
        }

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

    let line="";
 
const playerLaunch=Game.player.launch.quality;
const cpuLaunch=Game.cpu.launch.quality;
 
  if(!Game.player.launch.success){

    line+=`⚠ ${Game.player.launch.reason}\n\n`;

}

if(!Game.cpu.launch.success){

    line+=`⚠ ${Game.cpu.launch.reason}\n\n`;

}
    //=========================
// PLAYER LAUNCH
//=========================

switch(playerLaunch){

    case "Perfect":

        line+=`⭐ PERFECT LAUNCH!\n${player.name} rockets into the stadium!\n\n`;
        break;

    case "Good":

        line+=`${player.name} gets an excellent launch.\n\n`;
        break;

    case "Okay":

        line+=`${player.name} gets a solid launch.\n\n`;
        break;

    case "Bad":

        line+=`${player.name} launches awkwardly and loses momentum.\n\n`;
        break;

    case "Horrible":

        line+=`💥 HORRIBLE LAUNCH!\n${player.name} struggles immediately.\n\n`;
        break;

}

   //=========================
// CPU LAUNCH
//=========================

switch(cpuLaunch){

    case "Perfect":

        line+=`⭐ PERFECT LAUNCH!\n${cpu.name} rockets into the stadium!\n\n`;
        break;

    case "Good":

        line+=`${cpu.name} gets an excellent launch.\n\n`;
        break;

    case "Okay":

        line+=`${cpu.name} gets a solid launch.\n\n`;
        break;

    case "Bad":

        line+=`${cpu.name} launches awkwardly and loses momentum.\n\n`;
        break;

    case "Horrible":

        line+=`💥 HORRIBLE LAUNCH!\n${cpu.name} struggles immediately.\n\n`;
        break;

    }

    text.innerHTML=line;

    setTimeout(()=>{

        resolveOpening();

    },2500);

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

    battleTick();

    generateDecision();

},2500);

}

//=========================
// DECISION SCREEN
//=========================

function generateDecision(){

    const app=document.getElementById("app");

    app.innerHTML=`
    

        <section class="menu-card">
        
${renderStadium()}

            <h1>MOVE</h1>

            <hr>

            <p>

            ${
                Game.battle.centerControl==="Player"
                ? "You control the center."
                : Game.battle.centerControl==="CPU"
                ? "The CPU controls the center."
                : "Neither Bey controls the center."
            }

            </p>

            <br>

          <button
    class="menu-btn bronze"
    id="braceBtn">

    Brace

</button>

<button
    class="menu-btn silver"
    id="counterBtn">

    Counter

</button>

<button
    class="menu-btn gold"
    id="dodgeBtn">

    Dodge

</button>

            </button>

        </section>

    </main>

    `;
 
 renderBeys();

 document.getElementById("braceBtn").onclick=()=>{

    chooseMove("Brace");

};

document.getElementById("counterBtn").onclick=()=>{

    chooseMove("Counter");

};

document.getElementById("dodgeBtn").onclick=()=>{

    chooseMove("Dodge");

};

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

});
