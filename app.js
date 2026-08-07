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

    player:{
        zone:"Center",
        previousZone:"Center",
        side:null,
        direction:"Clockwise",
        rail:false,
        xExit:false,
        speed:0,
        spin:100,
        balance:100
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
        balance:100
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

    TopLeft:{x:170,y:95},
    TopCenter:{x:250,y:70},
    TopRight:{x:330,y:95},

    LeftMid:{x:135,y:170},
    Center:{x:250,y:185},
    RightMid:{x:365,y:170},

    BottomLeft:{x:180,y:265},
    BottomCenter:{x:250,y:280},
    BottomRight:{x:320,y:265},

    LeftRail:{x:115,y:115},
    RightRail:{x:385,y:115},

    XRailExit:{x:250,y:38},

    LeftPocket:{x:155,y:320},
    XtremeZone:{x:250,y:320},
    RightPocket:{x:345,y:320}

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

</svg>

</div>

`;

}

//=========================
// RENDER BEYS
//=========================

function renderBeys(){

    const player=document.getElementById("playerBey");
    const cpu=document.getElementById("cpuBey");

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

    const data = Game.battle[bey];

    const neighbors =
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

    // Move Player
    moveBey(
        "player",
        getNaturalMovement("player")
    );

    // Move CPU
    moveBey(
        "cpu",
        getNaturalMovement("cpu")
    );

    // Check for collisions/events
    checkBattleEvents();

}

//=========================
// BATTLE EVENTS
//=========================

function checkBattleEvents(){

    const player = Game.battle.player;

    const cpu = Game.battle.cpu;

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
// COLLISION
//=========================

function resolveCollision(){

    console.log("Collision!");

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

    const playerSide=Game.arena.playerSide;
    const cpuSide=Game.arena.cpuSide;

    //-------------------------
    // PLAYER
    //-------------------------

    switch(Game.player.launch.technique){

        case "Center":

            moveBey("player","Center");
            break;

        case "X-Rail":

            moveBey(
                "player",
                playerSide==="Left"
                ? "LeftRail"
                : "RightRail"
            );
            break;

        case "Pocket Drop":

            moveBey("player","XRailExit");
            break;

        case "Wide Circle":

            moveBey(
                "player",
                playerSide==="Left"
                ? "LeftMid"
                : "RightMid"
            );
            break;

        case "Direct Clash":

            moveBey(
                "player",
                playerSide==="Left"
                ? "TopLeft"
                : "TopRight"
            );
            break;

    }

    //-------------------------
    // CPU
    //-------------------------

    switch(Game.cpu.launch.technique){

        case "Center":

            moveBey("cpu","Center");
            break;

        case "X-Rail":

            moveBey(
                "cpu",
                cpuSide==="Left"
                ? "LeftRail"
                : "RightRail"
            );
            break;

        case "Pocket Drop":

            moveBey("cpu","XRailExit");
            break;

        case "Wide Circle":

            moveBey(
                "cpu",
                cpuSide==="Left"
                ? "LeftMid"
                : "RightMid"
            );
            break;

        case "Direct Clash":

            moveBey(
                "cpu",
                cpuSide==="Left"
                ? "TopLeft"
                : "TopRight"
            );
            break;

    }

}

//=========================
// PLAY LAUNCH ANIMATION
//=========================

function playLaunchAnimation(){

    renderBeys();

    setTimeout(()=>{

        showArena();

    },1200);

}

//=========================
// GENERATE ARENA
//=========================

function generateArena(){

    setLaunchPositions();

    playLaunchAnimation();

}

//=========================
// STADIUM PREVIEW
//=========================

function getStadiumPreview(){

    return `

<pre style="font-size:17px;line-height:1.5;text-align:center;">

              X EXIT
                ▲

 ${Game.arena.playerSide.toUpperCase()} ●         ● ${Game.arena.cpuSide.toUpperCase()}

         ╲       ╱

🕳══════ X-RAIL ══════🕳
         🕳

</pre>

<p style="text-align:center;">

You are launching from the
<strong>${Game.arena.playerSide}</strong> side.

</p>

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
 
    // Compatibility

    const compatibility=getCompatibilityScore(
        blade,
        ratchet,
        bit
    );

    const modifier=Math.round(
        (compatibility-50)/10
    );

    Object.keys(stats).forEach(key=>{

        stats[key]=clamp(
            stats[key]+modifier
        );

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

}

//=========================
// VS SCREEN
//=========================

function showVS(){

   generateCPUCombo();

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

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h2>

            ROUND ${Game.match.round}

            </h2>

            <p>

            First to 7 Points

            </p>

            <hr>

            <div style="display:flex;justify-content:space-between;">

                <div>

                    <h3>PLAYER</h3>

                    <strong>${Game.player.blade.name}</strong>

                    <br>

                    ${Game.player.ratchet.name}

                    <br>

                    ${Game.player.bit.name}

                    <br><br>

                    OVR ${playerCombo.ovr}

<br><br>

ATK ${playerCombo.stats.attack}

<br>

DEF ${playerCombo.stats.defense}

<br>

STA ${playerCombo.stats.stamina}

<br>

BAL ${playerCombo.stats.balance}

<br>

MOB ${playerCombo.stats.mobility}

                </div>

                <div>

                    <h3>CPU</h3>

                    <strong>${Game.cpu.blade.name}</strong>

                    <br>

                    ${Game.cpu.ratchet.name}

                    <br>

                    ${Game.cpu.bit.name}

                    <br><br>

                    OVR ${cpuCombo.ovr}

<br><br>

ATK ${cpuCombo.stats.attack}

<br>

DEF ${cpuCombo.stats.defense}

<br>

STA ${cpuCombo.stats.stamina}

<br>

BAL ${cpuCombo.stats.balance}

<br>

MOB ${cpuCombo.stats.mobility}

                </div>

            </div>

            <br>

            <h1>

            ⚔ VS ⚔

            </h1>

            <br>

            <h3>

            PLAYER ${Game.match.playerPoints}

            -

            ${Game.match.cpuPoints} CPU

            </h3>

            <br>

            <h2 id="countdown">

            Starting in 10...

            </h2>

            <br>

<button
    class="menu-btn gold"
    id="skipVS">

    SKIP

</button>

        </section>

    </main>

    `;

    let seconds=10;

    const timer=setInterval(()=>{

        seconds--;

        document.getElementById("countdown").textContent=

        "Starting in "+seconds+"...";

        if(seconds<=0){

    clearInterval(timer);

    assignStadiumSides();

    showLaunchScreen();

}

    },1000);

 document.getElementById("skipVS").onclick = ()=>{

    clearInterval(timer);

    assignStadiumSides();

    showLaunchScreen();

};

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

                X-Rail

            </button>

            <button class="menu-btn gold" id="clashLaunch">

                Direct Clash

            </button>

            <button class="menu-btn bronze" id="pocketLaunch">

                Pocket Drop

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

        chooseLaunchTechnique("X-Rail");

    };

    document.getElementById("clashLaunch").onclick=()=>{

        chooseLaunchTechnique("Direct Clash");

    };

    document.getElementById("pocketLaunch").onclick=()=>{

        chooseLaunchTechnique("Pocket Drop");

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
        "Pocket Drop",
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

showLetItRip();

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
    let seconds=10;

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <section class="menu-card">

            <h1>ROUND ${Game.match.round}</h1>

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

<h2 id="ripText">

                Battle Begins In: 10

            </h2>

            <br>

            <button
                class="menu-btn gold"
                id="skipButton">

                SKIP

            </button>

        </section>

    </main>

    `;

    const timer=setInterval(()=>{

        seconds--;

        document.getElementById("ripText").textContent=

            "Battle Begins In: "+seconds;

        if(seconds<=0){

            clearInterval(timer);

            generateArena();

        }

    },1000);

    document.getElementById("skipButton").onclick=()=>{

        clearInterval(timer);

        generateArena();

    };

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

            <h1>ROUND ${Game.match.round}</h1>

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

setTimeout(()=>{

    openingCommentary();

},2000);

}

//=========================
// OPENING COMMENTARY
//=========================

function openingCommentary(){

    const text=document.getElementById("arenaText");

    const player=Game.player.blade;
    const cpu=Game.cpu.blade;

    let line="";

    // Player launch

    if(player.personality.aggression>=90){

        line+=`${player.name} explodes off the launcher!\n\n`;

    }else if(player.personality.control>=90){

        line+=`${player.name} launches with incredible precision.\n\n`;

    }else{

        line+=`${player.name} gets a clean launch.\n\n`;

    }

    // CPU launch

    if(cpu.personality.aggression>=90){

        line+=`${cpu.name} rushes forward looking for a knockout!\n\n`;

    }else if(cpu.personality.control>=90){

        line+=`${cpu.name} calmly takes its position.\n\n`;

    }else{

        line+=`${cpu.name} enters the stadium confidently.\n\n`;

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

    // Random launch quality
    playerScore += Math.floor(Math.random()*21);
    cpuScore += Math.floor(Math.random()*21);

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
    
renderBeys();

    <main class="menu">

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

            <button class="menu-btn bronze">

                Brace

            </button>

            <button class="menu-btn silver">

                Counter

            </button>

            <button class="menu-btn gold">

                Dodge

            </button>

        </section>

    </main>

    `;

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
