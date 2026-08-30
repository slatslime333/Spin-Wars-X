/* SPIN WARS X — ROGUE SHOP BALANCE
 * Shop cards are owned by rogue-mode.js (makeOfferCard / generateOffers).
 * This file used to rewrite hub offers and could pair BIT REFORGE with a
 * ratchet picker. It now leaves the generated cards alone.
 */
(function(global){
"use strict";
function stamp(){
    const r=global.SpinWarsRogue?.run?.();
    if(!r) return;
    r._rogueShopStamp=Number(r.matchIndex)||1;
}
function patch(){
    if(global.__rogueShopBalancePatched) return;
    global.__rogueShopBalancePatched=true;
    const observer=new MutationObserver(()=>{
        if(!document.querySelector(".rogue-hub")) return;
        stamp();
    });
    observer.observe(document.getElementById("app")||document.body,{childList:true,subtree:true});
    global.__rogueShopObserver=observer;
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",patch,{once:true});
else patch();
})(window);
