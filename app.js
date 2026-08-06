/*==================================
 SPIN WAR X
 Version 0.5.0
==================================*/

//=========================
// GAME STATE
//=========================

const Game = {
    version: "0.5.0",
    screen: "menu",
    mode: null,

    player: {
        blade: null,
        ratchet: null,
        bit: null
    },

    cpu: {
        blade: null,
        ratchet: null,
        bit: null
    }
};

//=========================
// BLADE DATABASE
//=========================

const BLADES = [

{
name:"Knight Shield",
tier:"Bronze",
type:"Defense",
weight:34.8,

stats:{
attack:63,
knockback:64,
defense:84,
evasiveness:65,
balance:82,
stamina:74
}
},

{
name:"Arrow Wizard",
tier:"Bronze",
type:"Balance",
weight:35.0,

stats:{
attack:68,
knockback:66,
defense:70,
evasiveness:71,
balance:74,
stamina:75
}
},

{
name:"Viper Tail",
tier:"Bronze",
type:"Attack",
weight:35.2,

stats:{
attack:79,
knockback:78,
defense:64,
evasiveness:76,
balance:68,
stamina:63
}
},

{
name:"Shark Edge",
tier:"Silver",
type:"Attack",
weight:35.6,

stats:{
attack:90,
knockback:88,
defense:69,
evasiveness:87,
balance:72,
stamina:64
}
},

{
name:"Knight Mail",
tier:"Silver",
type:"Defense",
weight:36.0,

stats:{
attack:71,
knockback:72,
defense:89,
evasiveness:66,
balance:86,
stamina:77
}
},

{
name:"Dran Sword",
tier:"Silver",
type:"Attack",
weight:35.8,

stats:{
attack:88,
knockback:86,
defense:70,
evasiveness:84,
balance:73,
stamina:66
}
},

{
name:"Phoenix Wing",
tier:"Gold",
type:"Attack",
weight:38.0,

stats:{
attack:96,
knockback:95,
defense:80,
evasiveness:82,
balance:84,
stamina:75
}
},

{
name:"Wizard Rod",
tier:"Gold",
type:"Stamina",
weight:37.0,

stats:{
attack:70,
knockback:68,
defense:84,
evasiveness:70,
balance:93,
stamina:99
}
},

{
name:"Silver Wolf",
tier:"Gold",
type:"Defense",
weight:37.4,

stats:{
attack:73,
knockback:75,
defense:94,
evasiveness:68,
balance:92,
stamina:84
}
}

];

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
// START GAME
//=========================

window.onload = () => {

    hookMenuButtons();

};

const HEIGHT_ENGINE = {

    ...
    
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
            control:72,
            staminaRetention:60
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
            aggression:98,
            control:68,
            staminaRetention:56
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
            aggression:100,
            control:70,
            staminaRetention:58
        }

    }

};

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
evasiveness:3,
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
evasiveness:1,
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
evasiveness:-1,
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
evasiveness:-2,
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
evasiveness:-3,
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
evasiveness:-4,
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
            evasiveness:0,
            balance:0,
            stamina:0

        };

        if(height===60){

            modifier.attack+=2;
            modifier.evasiveness+=2;
            modifier.stamina-=2;

        }

        if(height===70){

            modifier.balance+=1;

        }

        if(height===80){

            modifier.defense+=2;
            modifier.balance+=2;
            modifier.stamina+=2;
            modifier.evasiveness-=2;

        }

        RATCHETS.push({

            name:`${base.number}-${height}`,

            number:base.number,

            height,

            stats:{

                attack:base.stats.attack+modifier.attack,

                knockback:base.stats.knockback+modifier.knockback,

                defense:base.stats.defense+modifier.defense,

                evasiveness:base.stats.evasiveness+modifier.evasiveness,

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
// BIT DATABASE
//=========================

const BITS = [

{
name:"Flat",
stats:{attack:5,knockback:3,defense:-3,evasiveness:4,balance:-2,stamina:-4},
traits:["attack","fast"]
},

{
name:"Low Flat",
stats:{attack:7,knockback:4,defense:-5,evasiveness:6,balance:-3,stamina:-5},
traits:["attack","low"]
},

{
name:"Rush",
stats:{attack:7,knockback:4,defense:-5,evasiveness:6,balance:-3,stamina:-5},
traits:["aggressive","fast"]
},

{
name:"Low Rush",
stats:{attack:8,knockback:5,defense:-6,evasiveness:7,balance:-4,stamina:-6},
traits:["aggressive","low"]
},

{
name:"Level",
stats:{attack:4,knockback:2,defense:2,evasiveness:2,balance:4,stamina:1},
traits:["balance"]
},

{
name:"Elevate",
stats:{attack:-1,knockback:0,defense:3,evasiveness:3,balance:4,stamina:5},
traits:["height","balance"]
},

{
name:"Kick",
stats:{attack:4,knockback:6,defense:-2,evasiveness:4,balance:-3,stamina:-3},
traits:["smash"]
},

{
name:"Wedge",
stats:{attack:-2,knockback:1,defense:7,evasiveness:-4,balance:7,stamina:3},
traits:["defense"]
},

{
name:"Hexa",
stats:{attack:-1,knockback:0,defense:8,evasiveness:-3,balance:8,stamina:4},
traits:["defense","antiTilt"]
},

{
name:"Needle",
stats:{attack:-4,knockback:-3,defense:7,evasiveness:-6,balance:7,stamina:3},
traits:["defense"]
},

{
name:"Ball",
stats:{attack:-5,knockback:-3,defense:4,evasiveness:-4,balance:5,stamina:8},
traits:["stamina"]
},

{
name:"Orb",
stats:{attack:-3,knockback:-2,defense:3,evasiveness:-2,balance:4,stamina:6},
traits:["stamina"]
}

];
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

    const draftBits=[...BITS]
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

function calculateComboStats(){

    const blade=Game.player.blade;
    const ratchet=Game.player.ratchet;
    const bit=Game.player.bit;

    const bladeData=getBladeEngine(blade);

    if(!bladeData){

        console.error("Blade not found.");

        return null;

    }

    const stats={

        attack:bladeData.card.attack,
        knockback:bladeData.card.knockback,
        defense:bladeData.card.defense,
        evasiveness:bladeData.card.mobility,
        balance:bladeData.card.balance,
        stamina:bladeData.card.stamina,
        burst:bladeData.card.burst

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

    stats.evasiveness+=Math.round(
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
    stats.evasiveness+=heightData.mobility;
    stats.balance+=heightData.balance;
    stats.stamina+=heightData.stamina;
    stats.burst+=heightData.burst;

    // Bit influence (old system for now)

    stats.attack+=bit.stats.attack;
    stats.knockback+=bit.stats.knockback;
    stats.defense+=bit.stats.defense;
    stats.evasiveness+=bit.stats.evasiveness;
    stats.balance+=bit.stats.balance;
    stats.stamina+=bit.stats.stamina;

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

//=========================
// COMBO CARD
//=========================

function showComboCard(){

    const combo = calculateComboStats();

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

            <p>🌀 Mobility: ${combo.stats.evasiveness}</p>
            
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

            alert("Battle Engine Coming in v0.4");

        };
const menuCard=document.querySelector(".menu-card");

menuCard.appendChild(

    createBackButton(()=>{

        showBitDraft();

    })

);
 
}
