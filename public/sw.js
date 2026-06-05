const CACHE_NAME = 'forte-treining-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.jpg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Simple pass through with cache-first or network-fallback strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback or ignore
      });
    })
  );
});
