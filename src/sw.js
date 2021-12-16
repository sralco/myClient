const CACHE_NAME = 'myClient-cache' + new Date();
var url = "/myclient2";
const urlsToCache = [
    url + "/main.js",
    "/vendor.js",
    "/polyfills.js",
    "/runtime.js",
    "/browserconfig.xml",
    "/favicon.ico",
    "/index.html",
    "/generate-manifest.js",
    "/penta.jpg",
    "/styles.css",
    "/styles.css.map",
    "/assets/A.png",
    "/assets/B.png",
    "/assets/back.jpg",
    "/assets/C.png",
    "/assets/D.png",
    "/assets/delete-16.png",
    "/assets/esterno.png",
    "/assets/header.jpg",
    "/assets/img1.png",
    "/assets/imgx32.png",
    "/assets/LOGO.png",
    "/assets/mare.jpg",
    "/assets/penta.jpg",
    "/assets/pink.jpg",
    "/assets/piu.png",
    "/assets/Richiesto.png",
    "/assets/rosa.jpg",
    "/assets/sidebar-1.jpg",
    "/assets/sidebar-z.jpg",
    "/assets/verde.jpg",
    "/assets/wave-bot.png",
    "/assets/wave-mid.png",
    "/assets/wave-top.png",
    "/assets/icons/apple-touch-icon.png",
    "/assets/icons/favicon-16x16.png",
    "/assets/icons/favicon-32x32.png",
    "/assets/icons/favicon.ico",
    "/assets/icons/icon-128x128.png",
    "/assets/icons/icon-144x144.png",
    "/assets/icons/icon-152x152.png",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-384x384.png",
    "/assets/icons/icon-512x512.png",
    "/assets/icons/icon-72x72.png",
    "/assets/icons/icon-96x96.png",
    "/assets/icons/safari-pinned-tab.svg",
    "/assets/Onde/wave-bot.png",
    "/assets/Onde/wave-mid.png",
    "/assets/Onde/wave-top.png"
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });

