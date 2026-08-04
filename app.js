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
meta:70,
avg:68,
weight:"34.8g"
},

{
name:"Arrow Wizard",
tier:"Bronze",
type:"Balance",
meta:72,
avg:70,
weight:"35.0g"
},

{
name:"Viper Tail",
tier:"Bronze",
type:"Attack",
meta:73,
avg:71,
weight:"35.2g"
},

{
name:"Shark Edge",
tier:"Silver",
type:"Attack",
meta:84,
avg:79,
weight:"35.6g"
},

{
name:"Knight Mail",
tier:"Silver",
type:"Defense",
meta:82,
avg:80,
weight:"36.0g"
},

{
name:"Dran Sword",
tier:"Silver",
type:"Attack",
meta:85,
avg:81,
weight:"35.8g"
},

{
name:"Phoenix Wing",
tier:"Gold",
type:"Attack",
meta:95,
avg:90,
weight:"38.0g"
},

{
name:"Wizard Rod",
tier:"Gold",
type:"Stamina",
meta:96,
avg:91,
weight:"37.0g"
},

{
name:"Silver Wolf",
tier:"Gold",
type:"Defense",
meta:92,
avg:88,
weight:"37.4g"
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

        button.textContent=r;

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

const BITS=[

"Flat",

"Rush",

"Needle"

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

    BITS.forEach(bit=>{

        const button=document.createElement("button");

        button.className="menu-btn bronze";

        button.textContent=bit;

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

    const blade=Game.player.blade;

    const app=document.getElementById("app");

    app.innerHTML=`

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

            <div class="blade-rating">

                META ${blade.meta}

            </div>

            <div class="blade-average">

                AVG ${blade.avg}

            </div>

            <div class="blade-type">

                ${blade.type}

            </div>

            <div class="blade-weight">

                ${blade.weight}

            </div>

            <hr>

            <h3>${Game.player.ratchet}</h3>

            <h3>${Game.player.bit}</h3>

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
    .onclick=()=>{

        alert("Battle Engine Coming Next!");

    };

}