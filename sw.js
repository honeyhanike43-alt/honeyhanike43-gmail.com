const CACHE_NAME = 'celestial-28-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event: Cache core files immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and non-http/https
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          // For CDNs (cors/opaque), we still might want to cache if possible in a real app,
          // but strictly 'basic' type ensures we are caching our own assets safely.
          // However, for this demo to work offline with CDNs (tailwind, fonts), we relax this
          // or rely on browser disk cache. 
          // To make it robust:
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});