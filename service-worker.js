// METAVERSE Service Worker - improved offline behavior
const CACHE_NAME = 'metaverse-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './archive/METAVERSE_v1.4.html',
  './manifest.json',
  './runtime-foundation.js',
  './vendor/three.0.128.0.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => {
        console.warn('⚠️ Precaching failed:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => (key !== CACHE_NAME) ? caches.delete(key) : Promise.resolve())
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (req.cache === 'only-if-cached' && url.origin !== location.origin) return;

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put('./index.html', copy);
              if (url.pathname.endsWith('/archive/METAVERSE_v1.4.html')) {
                cache.put('./archive/METAVERSE_v1.4.html', copy);
              }
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./offline.html')))
    );
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;

        return fetch(req)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            if (req.destination === 'document') {
              return caches.match('./offline.html');
            }
            return Response.error();
          });
      })
    );
    return;
  }

  event.respondWith(
    fetch(req).catch(() => {
      if (req.mode === 'navigate' || req.destination === 'document') {
        return caches.match('./offline.html');
      }
      return caches.match(req).then(cached => cached || Response.error());
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
