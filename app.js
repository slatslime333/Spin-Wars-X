/*
===========================
SPIN WAR X
Version 0.0.4
===========================
*/

const game = {

    version: "0.0.4",

    mode: null,

    player: {},

    cpu: {}

};

const buttons = document.querySelectorAll(".menu-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const mode = button.dataset.mode;

        startMode(mode);

    });

});

function startMode(mode){

    game.mode = mode;

    animateMenuOut();

}

function animateMenuOut(){

    const menu = document.querySelector(".menu");

    menu.style.opacity = "0";

    menu.style.transform = "translateY(-20px)";

    setTimeout(loadNextScreen,350);

}

function loadNextScreen(){

    switch(game.mode){

        case "bronze":
            alert("Bronze Mode\n\nComing Next Update");
            break;

        case "silver":
            alert("Silver Mode\n\nComing Next Update");
            break;

        case "gold":
            alert("Gold / Diamond Mode\n\nComing Next Update");
            break;

        case "custom":
            showCustomMenu();
            break;

    }

}

function showCustomMenu(){

    document.getElementById("app").innerHTML = `

    <main class="menu">

        <div class="logo">

            <div class="logo-icon">⚙</div>

            <h1>CUSTOM</h1>

            <p>Select Match Type</p>

        </div>

        <section class="menu-card">

            <button class="menu-btn custom" id="buildBoth">
                Build Both Beys
            </button>

            <button class="menu-btn silver" id="randomCPU">
                Build Mine • Random CPU
            </button>

            <button class="menu-btn bronze" id="randomBoth">
                Random Both
            </button>

            <button class="menu-btn gold" id="backButton">
                ← Back
            </button>

        </section>

    </main>

    `;

    document
    .getElementById("backButton")
    .addEventListener("click", location.reload);

    document
    .getElementById("buildBoth")
    .addEventListener("click", ()=>{

        alert("Combo Builder Coming Soon");

    });

    document
    .getElementById("randomCPU")
    .addEventListener("click", ()=>{

        alert("Random CPU Coming Soon");

    });

    document
    .getElementById("randomBoth")
    .addEventListener("click", ()=>{

        alert("Random Battle Coming Soon");

    });

}