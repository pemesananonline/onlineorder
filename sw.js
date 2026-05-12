/* ===================================================== */
/* ================= SERVICE WORKER CACHE =============== */
/* ===================================================== */

const CACHE_NAME = "order-online-cache-v7";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./size-chart.webp"
];

/* ===================================================== */
/* ================= INSTALL CACHE ====================== */
/* ===================================================== */

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

/* ===================================================== */
/* ================= ACTIVATE CACHE ===================== */
/* ===================================================== */

self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.map(function(cacheName){
                    if(cacheName !== CACHE_NAME){
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

/* ===================================================== */
/* ================= FETCH CACHE ======================== */
/* ===================================================== */

self.addEventListener("fetch", function(event){

    if(event.request.method !== "GET"){
        return;
    }

    const url = new URL(event.request.url);

    if(url.origin.includes("script.google.com")){
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function(response){
                let responseClone = response.clone();

                caches.open(CACHE_NAME).then(function(cache){
                    cache.put(event.request, responseClone);
                });

                return response;
            })
            .catch(function(){
                return caches.match(event.request);
            })
    );
});
