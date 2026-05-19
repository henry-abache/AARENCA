const CACHE_NAME = 'nueva-vida-aa-v4';
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
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        // Continuar aunque algún recurso falle
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Solo cachear GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el recurso está en caché, retornarlo
      if (response) {
        return response;
      }

      // Si no está en caché, intentar obtenerlo de la red
      return fetch(event.request).then(response => {
        // No cachear respuestas no-exitosas
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clonar la respuesta
        const responseToCache = response.clone();

        // Cachear la respuesta para futuros usos
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Si ambos fallan (caché y red), retornar una respuesta offline
        return new Response('Offline - Por favor revisa tu conexión', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});
