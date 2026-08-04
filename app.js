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
// RATCHET DATABASE
//=========================

const RATCHETS = [

{
name:"1-60",

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
name:"3-60",

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
name:"5-60",

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
name:"6-60",

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
name:"7-60",

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
name:"9-60",

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
// SHOW BLADE DRAFT
//=========================

function showBladeDraft(){

    Game.screen = "bladeDraft";

    const pool = BLADES.filter(blade => {

        if(Game.mode==="bronze") return blade.tier==="Bronze";
        if(Game.mode==="silver") return blade.tier==="Silver";
        if(Game.mode==="gold") return blade.tier==="Gold";

        return true;

    });

    renderBladeDraft(pool);

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

}

//=========================
// CREATE CARD
//=========================

function createBladeCard(blade){

    const card=document.createElement("div");

    card.className="blade-card";

    card.innerHTML=`

        <div class="blade-name">

            ${blade.name}

        </div>

        <div class="blade-type">

            ${blade.type}

        </div>

        <div class="blade-rating">

            META ${blade.meta}

        </div>

        <div class="blade-average">

            AVG ${blade.avg}

        </div>

        <div class="blade-weight">

            ${blade.weight}

        </div>

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
// NEXT SCREEN
//=========================

function showRatchetPlaceholder(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <div class="background"></div>

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">⚙</div>

            <h1>RATCHETS</h1>

            <p>Coming Next Update</p>

        </div>

        <section class="menu-card">

            <h2>

            Selected Blade

            </h2>

            <h3>

            ${Game.player.blade.name}

            </h3>

            <br>

            <button class="menu-btn silver">

                Continue

            </button>

        </section>

    </main>

    `;

}
//=========================
// RATCHET DATABASE
//=========================

const RATCHETS = [
"1-60",
"3-60",
"5-60"
];

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

    RATCHETS.forEach(r=>{

        const button=document.createElement("button");

        button.className="menu-btn silver";

        button.textContent=r.name;

        button.onclick=()=>{

            Game.player.ratchet=r;

            showBitDraft();

        };

        container.appendChild(button);

    });

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

            <h3>AVG ${combo.avg}</h3>

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

}