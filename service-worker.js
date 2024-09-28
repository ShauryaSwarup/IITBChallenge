const CACHE_NAME = "chem-app-cache-v1";
const urlsToCache = [
  "/IITBChallenge/", // Homepage
  "/IITBChallenge/index.html", // Main HTML file
  "/IITBChallenge/styles.css", // CSS file
  "/IITBChallenge/app.js", // Main JavaScript file
  "/IITBChallenge/data/data.json", // Data JSON file
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
