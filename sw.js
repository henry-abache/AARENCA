const CACHE_NAME = 'nueva-vida-aa-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './1-192.png',
  './1-512.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://unpkg.com/@supabase/supabase-js@2'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando v5...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Error cacheando algunos recursos:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando v5...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Eliminando caché viejo:', k);
          return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Solo cachear GET
  if (event.request.method !== 'GET') return;

  // No interceptar peticiones a Supabase (siempre deben ir a la red)
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(fetch(event.request).catch(() =>
      new Response(JSON.stringify({ error: 'Sin conexión' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    ));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() =>
        new Response('Sin conexión — Por favor revisa tu red', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        })
      );
    })
  );
});
