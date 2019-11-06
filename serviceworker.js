const CACHE_NAME="offline",INITIAL_CACHE=["/","/css/site.css","/css/home.css","/js/site.js","/img/icon-skills.svg","/img/icon-projects.svg","/img/icon-github.svg","/img/icon-linkedin.svg"];async function updateCache(e,t){await caches.open(CACHE_NAME).then(s=>{s.put(e,t)})}async function getNetworkResponse(e){return await fetch(e).then(t=>(updateCache(e,t.clone()),t))}async function getCacheResponse(e){return await caches.match(e).then(t=>{if(t)return t;throw new Error(`No cache entry for ${e.url}`)})}self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>{e.addAll(INITIAL_CACHE)}))}),self.addEventListener("activate",e=>{e.waitUntil(clients.claim())}),self.addEventListener("fetch",e=>{"GET"===e.request.method&&e.respondWith(getNetworkResponse(e.request).catch(()=>getCacheResponse(e.request)).catch(()=>new Response(null,{url:e.request.url,status:404,statusText:"Not Found"})))});