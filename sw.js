const CACHE_NAME = 'wakemon-cache-v55';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data/waste.js',
  './js/data/monsters.js',
  './js/data/i18n.js',
  './js/data/i18n-content.js',
  './js/data/dictionary.js',
  './js/data/ecoactions.js',
  './js/ui/search.js',
  './js/storage.js',
  './js/game.js',
  './js/render.js',
  './js/ui/modal.js',
  './js/ui/raise.js',
  './js/ui/dex.js',
  './js/main.js',
  './assets/ui/icon-feed.png',
  './assets/ui/icon-dex.png',
  './assets/ui/icon-log.png',
  './assets/ui/icon-search.png',
  './assets/ui/icon-eco.png',
  './assets/ui/icon-settings.png',
  './assets/art/slot-1.png',
  './assets/art/slot-2.png',
  './assets/art/slot-3.png',
  './assets/art/slot-4.png',
  './assets/art/slot-5.png',
  './assets/art/slot-6.png',
  './assets/art/slot-7.png',
  './assets/art/slot-8.png',
  './assets/art/slot-9.png',
  './assets/art/slot-10.png',
  './assets/art/slot-11.png',
  './assets/art/slot-12.png',
  './assets/art/slot-13.png',
  './assets/art/slot-14.png',
  './assets/art/slot-15.png',
  './assets/art/slot-16.png',
  './assets/art/slot-17.png',
  './assets/art/slot-18.png',
  './assets/art/slot-19.png',
  './assets/art/slot-20.png',
  './assets/art/slot-21.png',
  './assets/art/slot-22.png',
  './assets/art/slot-23.png',
  './assets/art/slot-24.png',
  './assets/art/slot-25.png',
  './assets/art/slot-26.png',
  './assets/art/slot-27.png',
  './assets/art/slot-28.png',
  './assets/art/slot-29.png',
  './assets/art/slot-30.png',
  './assets/art/slot-31.png',
  './assets/art/slot-32.png',
  './assets/art/slot-33.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// App-shell files: cache-first (so the game boots offline).
// Everything else (e.g. Google Fonts): network-first, falling back to
// cache, so a missing connection never blocks rendering.
self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isShellRequest = url.origin === self.location.origin;

  if (isShellRequest){
    event.respondWith(
      caches.match(event.request).then(function(cached){
        return cached || fetch(event.request);
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).then(function(res){
        const clone = res.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone); });
        return res;
      }).catch(function(){ return caches.match(event.request); })
    );
  }
});
