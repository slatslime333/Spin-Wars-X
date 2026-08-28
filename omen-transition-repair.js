/* SPIN WARS X — FINAL OMEN TRANSITION REPAIR
 * Safety net only. Does not alter battle/gameplay rules.
 * If the Rogue final-boss omen remains mounted, this guarantees the
 * existing final-battle setup is reached after the intended omen beat.
 */
(function(){
    "use strict";

    var enteredAt=0;
    var lastRunId=null;
    var timer=null;

    function getRogue(){
        try{
            return window.SpinWarsRogue && typeof window.SpinWarsRogue.run === "function"
                ? window.SpinWarsRogue.run()
                : null;
        }catch(_e){ return null; }
    }

    function transition(){
        var rogue=getRogue();
        if(!rogue || rogue.matchIndex!==18) return;
        if(window.Game && window.Game.screen!=="rogueOmen") return;

        /* Use the same final-battle setup as the existing Rogue flow. */
        try{
            if(typeof window.SpinWarsRogue.generateCpu === "function"){
                window.SpinWarsRogue.generateCpu();
            }
            if(typeof window.showComboCard === "function"){
                window.showComboCard();
            }else if(typeof window.SpinWarsRogue.showComboCard === "function"){
                window.SpinWarsRogue.showComboCard();
            }
            if(window.Game) window.Game.screen="comboCheck";
            if(typeof window.SpinWarsRogue.persist === "function"){
                window.SpinWarsRogue.persist();
            }
        }catch(_e){
            /* Never let the repair layer break the game if the main flow is still loading. */
        }
    }

    function tick(){
        var game=window.Game;
        var rogue=getRogue();
        if(!game || !rogue || game.screen!=="rogueOmen" || rogue.matchIndex!==18){
            enteredAt=0;
            lastRunId=null;
            return;
        }

        var runId=rogue.startedAt || rogue.startingBeyId || "final";
        if(lastRunId!==runId){
            lastRunId=runId;
            enteredAt=Date.now();
        }
        if(!enteredAt) enteredAt=Date.now();

        if(Date.now()-enteredAt>=6100){
            transition();
        }
    }

    function start(){
        if(timer) return;
        timer=window.setInterval(tick,250);
    }

    if(document.readyState==="loading"){
        document.addEventListener("DOMContentLoaded",start,{once:true});
    }else{
        start();
    }
})();
