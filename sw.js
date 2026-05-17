const CACHE_NAME = 'nuevavida-v1';
const ASSETS = [
  './',
  './index.html'
];

// Instalar el Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activar el Service Worker
self.addEventListener('activate', (e) => {
  console.log('Service Worker activo');
});

// Interceptar peticiones para funcionamiento básico
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
