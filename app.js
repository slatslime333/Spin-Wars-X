/*==================================
 SPIN WAR X
 Version 0.2.0
==================================*/

//=========================
// GAME STATE
//=========================

const Game = {
    version: "0.2.0",
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

        //=========================
        // BASIC INFO
        //=========================

        name:"Silver Wolf",

        type:"Defense",

        tier:"Gold",

        spin:"Right",

        weight:37.4,

        //=========================
        // VISIBLE CARD
        //=========================

        card:{

            attack:35,

            knockback:48,

            defense:96,

            mobility:56,

            balance:95,

            stamina:97,

            burst:94

        },

        //=========================
        // PHYSICS
        //=========================

        physics:{

            weightClass:"Heavy",

            centerOfGravity:"Low",

            contactShape:"Round",

            recoil:"Very Low",

            lockStrength:94,

            weightDistribution:"Outer"

        },

        //=========================
        // BEHAVIOR
        //=========================

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

        //=========================
        // COMPATIBILITY
        //=========================

        compatibility:{

            heights:{

                60:90,

                70:90,

                80:55

            },

            bits:{

                Hexa:100,

                Wedge:95,

                Ball:91,

                Orb:88,

                Level:72,

                Elevate:76,

                Flat:28,

                LowFlat:12,

                Rush:18,

                LowRush:8,

                Kick:22,

                Needle:84

            }

        },

        //=========================
        // TRAITS
        //=========================

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

    //=========================
    // BASIC INFO
    //=========================

    name:"Phoenix Wing",

    type:"Attack",

    tier:"Gold",

    spin:"Right",

    weight:38.0,

    //=========================
    // VISIBLE CARD
    //=========================

    card:{

        attack:94,

        knockback:92,

        defense:84,

        mobility:84,

        balance:87,

        stamina:75,

        burst:87

    },

    //=========================
    // PHYSICS
    //=========================

    physics:{

        weightClass:"Very Heavy",

        centerOfGravity:"Medium",

        contactShape:"Smash",

        recoil:"Medium",

        lockStrength:87,

        weightDistribution:"Outer"

    },

    //=========================
    // BEHAVIOR
    //=========================

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

    //=========================
    // COMPATIBILITY
    //=========================

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

    //=========================
    // TRAITS
    //=========================

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

},

wizard_rod:{

    //=========================
    // BASIC INFO
    //=========================

    name:"Wizard Rod",

    type:"Stamina",

    tier:"Gold",

    spin:"Right",

    weight:37.0,

    //=========================
    // VISIBLE CARD
    //=========================

    card:{

        attack:52,

        knockback:58,

        defense:88,

        mobility:44,

        balance:97,

        stamina:99,

        burst:92

    },

    //=========================
    // PHYSICS
    //=========================

    physics:{

        weightClass:"Heavy",

        centerOfGravity:"Very Low",

        contactShape:"Round",

        recoil:"Very Low",

        lockStrength:92,

        weightDistribution:"Outer"

    },

    //=========================
    // BEHAVIOR
    //=========================

    behavior:{

        attackStyle:"Stamina",

        smashPower:22,

        upperPower:14,

        barragePower:35,

        counterPower:70,

        movementControl:97,

        spinRetention:100,

        lad:100,

        burstResistance:92
     
winConditions:{

    spin:100,

    burst:52,

    knockout:18,

    counter:60

}
     
},

    //=========================
    // COMPATIBILITY
    //=========================

    compatibility:{

        heights:{

            60:95,

            70:90,

            80:72

        },

        bits:{

            Ball:96,

            Orb:92,

            Hexa:98,

            Needle:85,

            Wedge:88,

            Elevate:74,

            Level:75,

            Flat:40,

            LowFlat:40,

            Rush:84,

            LowRush:76,

            Kick:77

        }

    },

    //=========================
    // TRAITS
    //=========================

    traits:[

        "Stamina",

        "LAD",

        "Stable",

        "Heavy",

        "Spin Finish"

    ]
     
personality:{

    aggression:9,

    control:99,

    consistency:99,

    risk:4

}
     
},

//=========================
// ENGINE 2.0 RATCHETS
//=========================

const RATCHET_ENGINE = {

    "1-60":{

        weight:1,
        height:60,
        stability:72,
        burstResistance:82,
        attackBias:96,
        defenseBias:45,
        staminaBias:52,
        mobilityBias:92

    },

    "7-60":{

        weight:7,
        height:60,
        stability:94,
        burstResistance:94,
        attackBias:58,
        defenseBias:94,
        staminaBias:92,
        mobilityBias:66

    },

    "9-60":{

        weight:9,
        height:60,
        stability:99,
        burstResistance:98,
        attackBias:46,
        defenseBias:99,
        staminaBias:98,
        mobilityBias:54

    }

};

//=========================
// START GAME
//=========================

window.onload = () => {

    hookMenuButtons();

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
container.appendChild(

    createBackButton(()=>{

        showRatchetPlaceholder();

    })

);
 
}

//=========================
// SHOW BLADE DRAFT
//=========================

function showBladeDraft(){

    Game.screen = "bladeDraft";

    const pool = BLADES.filter(blade=>{

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

    const ovr=Math.round(

        (

            blade.stats.attack+
            blade.stats.knockback+
            blade.stats.defense+
            blade.stats.evasiveness+
            blade.stats.balance+
            blade.stats.stamina

        )/6

    );

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

        <div>Attack ............. ${blade.stats.attack}</div>

        <div>Knockback ...... ${blade.stats.knockback}</div>

        <div>Defense .......... ${blade.stats.defense}</div>

        <div>Evasiveness ... ${blade.stats.evasiveness}</div>

        <div>Balance .......... ${blade.stats.balance}</div>

        <div>Stamina ......... ${blade.stats.stamina}</div>

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

function evaluateBladeRatchet(){

    return 0;

}

function evaluateBladeBit(){

    return 0;

}

function evaluateFullCombo(){

    return 0;

}

const CARD_STATS=[

"attack",

"knockback",

"defense",

"mobility",

"balance",

"stamina",

"burst"

];

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

    let stats={

        attack:clamp(blade.stats.attack+ratchet.stats.attack+bit.stats.attack),

        knockback:clamp(blade.stats.knockback+ratchet.stats.knockback+bit.stats.knockback),

        defense:clamp(blade.stats.defense+ratchet.stats.defense+bit.stats.defense),

        evasiveness:clamp(blade.stats.evasiveness+ratchet.stats.evasiveness+bit.stats.evasiveness),

        balance:clamp(blade.stats.balance+ratchet.stats.balance+bit.stats.balance),

        stamina:clamp(blade.stats.stamina+ratchet.stats.stamina+bit.stats.stamina)

    };

    // Attack Synergies

    if(blade.type==="Attack" && bit.name==="Low Rush"){

        stats.attack=clamp(stats.attack+3);
        stats.knockback=clamp(stats.knockback+2);

    }

    if(blade.type==="Attack" && bit.name==="Kick"){

        stats.knockback=clamp(stats.knockback+4);

    }

    if(blade.type==="Attack" && bit.name==="Low Flat"){

        stats.attack=clamp(stats.attack+2);
        stats.evasiveness=clamp(stats.evasiveness+2);

    }

    // Defense Synergies

    if(blade.type==="Defense" && bit.name==="Hexa"){

        stats.defense=clamp(stats.defense+5);
        stats.balance=clamp(stats.balance+3);

    }

    if(blade.type==="Defense" && bit.name==="Wedge"){

        stats.defense=clamp(stats.defense+4);

    }

    // Balance

    if(blade.type==="Balance" && bit.name==="Level"){

        stats.balance=clamp(stats.balance+3);

    }

    // Stamina

    if(blade.type==="Stamina" && bit.name==="Ball"){

        stats.stamina=clamp(stats.stamina+5);

    }

    if(blade.type==="Stamina" && bit.name==="Orb"){

        stats.stamina=clamp(stats.stamina+3);

    }

    const ovr=Math.round(

        (

            stats.attack+
            stats.knockback+
            stats.defense+
            stats.evasiveness+
            stats.balance+
            stats.stamina

        )/6

    );

    let meta=ovr;

    if(blade.type==="Attack")
        meta+=2;

    if(blade.type==="Defense")
        meta+=1;

    if(blade.type==="Stamina")
        meta+=1;

    return{

        stats,

        ovr:clamp(ovr),

        meta:clamp(meta)

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

            <p>🌀 Evasiveness: ${combo.stats.evasiveness}</p>

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
