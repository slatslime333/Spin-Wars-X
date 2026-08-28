/* SPIN WARS X — ROGUE SHOP BALANCE */
(function(global){
"use strict";
const STATS=["attack","knockback","defense","mobility","balance","stamina"];
const LABEL={attack:"ATK",knockback:"KB",defense:"DEF",mobility:"MOB",balance:"BAL",stamina:"STA"};
const R=()=>global.SpinWarsRogue?.run?.()||null;
const pick=a=>a[Math.floor(Math.random()*a.length)];
function tier(){const t=String(R()?.startingTier||"Silver").toLowerCase();return t==="bronze"?"Bronze":t==="gold"?"Gold":"Silver";}
function match(){return Number(R()?.matchIndex)||1;}
function weights(){
    const t=tier(),m=match();
    let w;
    if(t==="Bronze"){
        w=m<3?{common:50,uncommon:28,rare:14,legendary:7,evolve:1}:
          m<6?{common:50,uncommon:28,rare:17,legendary:7,evolve:1}:
          m<12?{common:50,uncommon:28,rare:17,legendary:9,evolve:2}:
          {common:50,uncommon:28,rare:19,legendary:9,evolve:2};
    }else if(t==="Silver"){
        w=m<6?{common:50,uncommon:28,rare:16,legendary:7,evolve:1}:
          m<12?{common:50,uncommon:28,rare:16,legendary:8,evolve:2}:
          {common:50,uncommon:28,rare:18,legendary:8,evolve:2};
    }else{
        w=m<6?{common:50,uncommon:28,rare:14,legendary:7,evolve:2}:
          m<12?{common:55,uncommon:30,rare:13,legendary:6,evolve:2}:
          m<18?{common:55,uncommon:30,rare:12,legendary:5,evolve:2}:
          {common:52,uncommon:30,rare:14,legendary:7,evolve:2};
    }
    return w;
}
function rarity(){
    const w=weights(),total=Object.values(w).reduce((a,b)=>a+b,0);let x=Math.random()*total;
    for(const k of ["common","uncommon","rare","legendary","evolve"]){x-=w[k];if(x<0)return k;}
    return "common";
}
function focused(blade){
    const t=String(blade?.type||"Balance");
    if(t==="Attack")return pick(["attack","knockback","mobility"]);
    if(t==="Defense")return pick(["defense","balance","stamina"]);
    if(t==="Stamina")return pick(["stamina","balance","defense"]);
    return pick(STATS);
}
function statCard(rarity,stat,amount,downStat,downAmt){
    const title=downStat?`${LABEL[stat]} +${amount}  /  ${LABEL[downStat]} ${downAmt}`:`${LABEL[stat]} +${amount}`;
    return {id:`shop-${rarity}-${Math.random().toString(16).slice(2)}`,rarity,kind:"stat",stat,amount,downStat,downAmt:downAmt||0,title,kicker:rarity.toUpperCase(),body:downStat?`Tradeoff. ${LABEL[stat]} climbs, ${LABEL[downStat]} pays.`:`Clean ${LABEL[stat]} bump. Safe growth.`};
}
function makeCard(rar){
    const r=R(),blade=r.blade;
    if(rar==="common")return statCard(rar,Math.random()<.65?focused(blade):pick(STATS),2);
    if(rar==="uncommon"){
        const up=focused(blade),down=pick(STATS.filter(k=>k!==up));
        return statCard(rar,up,Math.random()<.5?4:3,down,Math.random()<.5?-2:-1);
    }
    if(rar==="rare"){
        const roll=Math.random();
        if(roll<.22)return {id:"shop-reforge-"+Math.random().toString(16).slice(2),rarity:"rare",kind:"reforge",part:Math.random()<.5?"bit":"ratchet",title:`${Math.random()<.5?"BIT":"RATCHET"} REFORGE`,kicker:"RARE",body:"Offer three parts. Pick one and change the physics."};
        if(roll<.42){const a=focused(blade),b=pick(STATS.filter(k=>k!==a));return {id:"shop-pair-"+Math.random().toString(16).slice(2),rarity:"rare",kind:"stat",stat:a,amount:2,secondStat:b,secondAmt:2,title:`${LABEL[a]} +2 · ${LABEL[b]} +2`,kicker:"RARE",body:"Two lines move together. No downside."};}
        return statCard("rare",Math.random()<.75?focused(blade):pick(STATS),4);
    }
    if(rar==="legendary"){
        const mods=global.SpinWarsRogue?.MODIFIERS||[];
        const current=r.activeModifier?.id;
        const pool=mods.filter(m=>m.id!==current);
        const mod=pick(pool.length?pool:mods);
        return {id:"shop-mod-"+Math.random().toString(16).slice(2),rarity:"legendary",kind:"modifier",modifierId:mod?.id,title:mod?.name||"ROGUE MODIFIER",kicker:"LEGENDARY",body:(mod?.blurb||"")+" Only one modifier can be active."};
    }
    return null;
}
function rerollOffers(){
    const r=R();if(!r||!document.querySelector(".rogue-hub"))return;
    if(r._rogueShopStamp===match())return;
    const old=r.offers||[];
    const form=old.find(c=>c?.kind==="evolve");
    const cards=[];const used=new Set();let guard=0;
    while(cards.length<3&&guard++<30){
        let card=makeCard(rarity());
        if(!card){if(form&&!cards.some(c=>c.kind==="evolve"))cards.push(form);continue;}
        const key=card.kind+card.title;
        if(used.has(key))continue;
        used.add(key);cards.push(card);
    }
    if(form){
        const idx=Math.min(cards.length-1,2);
        if(!cards.some(c=>c.kind==="evolve"))cards[idx]=form;
    }
    while(cards.length<3)cards.push(makeCard("common"));
    r.offers=cards.slice(0,3);r._rogueShopStamp=match();
    const box=document.getElementById("rogueOffers");if(!box)return;
    box.innerHTML="";
    r.offers.forEach((card,i)=>{
        const btn=document.createElement("button");btn.type="button";btn.className=`rogue-offer ${card.rarity}`;
        btn.innerHTML=`<span class="rogue-offer-kicker">${card.kicker}</span><strong>${card.title}</strong><small>${card.body}</small>`;
        btn.onclick=()=>global.__rogueChooseOffer?.(i);
        box.appendChild(btn);
    });
}
function patch(){
    if(global.__rogueShopBalancePatched)return;global.__rogueShopBalancePatched=true;
    /* chooseOffer is inside rogue-mode's IIFE, so expose a tiny bridge by using the
       same click behavior through the DOM: temporarily dispatch to the original button
       handler after we replace only the visible card data. */
    const observer=new MutationObserver(()=>{
        const r=R();
        if(!r||!document.querySelector(".rogue-hub"))return;
        const box=document.getElementById("rogueOffers");
        if(!box)return;
        if(r._rogueShopStamp!==match()){
            // Keep the existing DOM handler contract: after replacing r.offers, the
            // original rogue buttons are rebuilt so their local chooseOffer(i) closure remains valid.
            const oldButtons=[...box.querySelectorAll("button.rogue-offer")];
            rerollOffers();
            const newButtons=[...box.querySelectorAll("button.rogue-offer")];
            newButtons.forEach((btn,i)=>{
                const old=oldButtons[i];
                if(old&&old.onclick){
                    const handler=old.onclick;
                    btn.onclick=()=>handler.call(btn,{type:"click",target:btn});
                }else btn.onclick=()=>{};
            });
        }
    });
    observer.observe(document.getElementById("app")||document.body,{childList:true,subtree:true});
    global.__rogueShopObserver=observer;
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",patch,{once:true});else patch();
})(window);
