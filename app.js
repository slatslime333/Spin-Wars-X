/*=========================================
        SPIN WAR X
        Game Engine v0.1.1
=========================================*/

//==============================
// GAME STATE
//==============================

const game = {

    version: "0.1.1",

    mode: null,

    draft: {

        blade: null,
        ratchet: null,
        bit: null

    }

};

//==============================
// DATABASE
//==============================

const blades = [

{
    name:"Knight Shield",
    type:"Defense",
    tier:"Bronze",
    meta:70,
    avg:69,
    weight:"34.8g"
},

{
    name:"Arrow Wizard",
    type:"Balance",
    tier:"Bronze",
    meta:72,
    avg:71,
    weight:"35.0g"
},

{
    name:"Viper Tail",
    type:"Attack",
    tier:"Bronze",
    meta:73,
    avg:72,
    weight:"35.2g"
},

{
    name:"Shark Edge",
    type:"Attack",
    tier:"Silver",
    meta:84,
    avg:79,
    weight:"35.6g"
},

{
    name:"Knight Mail",
    type:"Defense",
    tier:"Silver",
    meta:82,
    avg:80,
    weight:"36.0g"
},

{
    name:"Dran Sword",
    type:"Attack",
    tier:"Silver",
    meta:85,
    avg:81,
    weight:"35.9g"
},

{
    name:"Wizard Rod",
    type:"Stamina",
    tier:"Gold",
    meta:96,
    avg:90,
    weight:"37.0g"
},

{
    name:"Phoenix Wing",
    type:"Attack",
    tier:"Gold",
    meta:95,
    avg:89,
    weight:"38.0g"
},

{
    name:"Silver Wolf",
    type:"Defense",
    tier:"Gold",
    meta:92,
    avg:88,
    weight:"37.4g"
}

];

//==============================
// START
//==============================

const menuButtons = document.querySelectorAll(".menu-btn");

menuButtons.forEach(button=>{

button.addEventListener("click",()=>{

game.mode = button.dataset.mode;

beginDraft();

});

});

//==============================
// DRAFT
//==============================

function beginDraft(){

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

<h2 id="loadingText">
Preparing Cards...
</h2>

<div class="loadingBar">

<div id="loadingFill"></div>

</div>

</section>

</main>

`;

animateLoading();

}

//==============================
// LOADING
//==============================

function animateLoading(){

const fill=document.getElementById("loadingFill");

let progress=0;

const timer=setInterval(()=>{

progress+=4;

fill.style.width=progress+"%";

if(progress>=100){

clearInterval(timer);

setTimeout(showBladeDraft,400);

}

},40);

}

//==============================
// BLADE DRAFT
//==============================

function showBladeDraft(){

const pool=blades.filter(

blade=>blade.tier===game.mode.charAt(0).toUpperCase()+game.mode.slice(1)

);

const choices=[...pool];

document.getElementById("app").innerHTML=`

<div class="background"></div>

<main class="menu">

<div class="logo">

<div class="logo-icon">🎴</div>

<h1>CHOOSE BLADE</h1>

<p>Swipe support coming soon</p>

</div>

<section class="menu-card">

${choices.map(blade=>`

<button class="menu-btn silver bladeCard">

${blade.name}<br>

META ${blade.meta}

</button>

`).join("")}

</section>

</main>

`;

}