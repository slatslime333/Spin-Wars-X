/* Spin Wars X — offline cache for Safari home-screen / PWA */
const CACHE='spin-wars-x-9.27';
const PRECACHE=[
  './','./index.html','./manifest.webmanifest',
  './style.css?v=9.27','./movement-engine.js?v=9.23','./xrail-engine.js?v=9.23',
  './vs-commentary.js?v=9.23','./abilities.js?v=9.26','./scoreboard.js?v=9.26','./app.js?v=9.27',
  './rogue-mode.js?v=9.27','./rogue-balance-bridge.js?v=1.0','./rogue-balance.js?v=1.0','./rogue-shop-balance.js?v=1.0',
  './rogue-balance-final.js?v=1.1','./omen-transition-repair.js?v=1.1','./sw.js',
  './assets/blades/Aeropegasus.png','./assets/blades/Dransword%20%281%29.png','./assets/blades/KnightMail.png',
  './assets/blades/Leoncrest.png','./assets/blades/Leonfang.png','./assets/blades/Sharkedge.png',
  './assets/blades/Silverwolf.png','./assets/blades/Unicornsting.png','./assets/blades/Vipertail.png',
  './assets/blades/Wizard%20arrow.png','./assets/blades/Wizardrod.png','./assets/blades/knight%20shield.png',
  './assets/blades/phienix_wing1.png','./assets/blades/png%20bit/Flat.png','./assets/blades/png%20bit/Hexa.png',
  './assets/blades/png%20bit/Level.png','./assets/blades/png%20bit/Point.png','./assets/blades/png%20bit/Rush.png',
  './assets/blades/png%20bit/Wedge.png','./assets/blades/png%20bit/ball.png','./assets/blades/png%20bit/kick.png',
  './assets/blades/png%20bit/lowflat.png','./assets/blades/png%20bit/needle.png','./assets/blades/png%20bit/orb.png',
  './assets/blades/png%20bit/quake.png','./assets/blades/png%20bit/rush.png',
  './assets/blades/ratchets/1-60.png','./assets/blades/ratchets/1-70.png','./assets/blades/ratchets/1-80.png',
  './assets/blades/ratchets/3-60.png','./assets/blades/ratchets/3-70.png','./assets/blades/ratchets/3-80.png',
  './assets/blades/ratchets/4-60.png','./assets/blades/ratchets/4-70.png','./assets/blades/ratchets/4-80.png',
  './assets/blades/ratchets/5-60.png','./assets/blades/ratchets/5-70.png','./assets/blades/ratchets/5-80.png',
  './assets/blades/ratchets/6-60.png','./assets/blades/ratchets/6-70.png','./assets/blades/ratchets/6-80.png',
  './assets/blades/ratchets/7-60.png','./assets/blades/ratchets/7-70.png','./assets/blades/ratchets/7-80.png',
  './assets/blades/ratchets/9-60.png','./assets/blades/ratchets/9-70.png','./assets/blades/ratchets/9-80.png',
  './assets/blades/sharkscale.png','./assets/blades/shelterdrake.png','./assets/blades/tyrannoBeat.png',
  './assets/fonts/kanit-500.woff2','./assets/fonts/kanit-700.woff2','./assets/fonts/kanit-800.woff2','./assets/fonts/kanit-900.woff2',
  './assets/fonts/staatliches-400.woff2','./assets/icons/apple-touch-icon.png','./assets/icons/icon-180.png',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request,{ignoreSearch:false});if(cached)return cached;
    try{const res=await fetch(event.request);if(res&&res.ok){const copy=res.clone();const cache=await caches.open(CACHE);cache.put(event.request,copy);}return res;}
    catch(_err){if(event.request.mode==='navigate'){const page=await caches.match('./index.html')||await caches.match('./');if(page)return page;}const fallback=await caches.match(event.request,{ignoreSearch:true});if(fallback)return fallback;return new Response('Offline',{status:503,statusText:'Offline'});}
  })());
});
