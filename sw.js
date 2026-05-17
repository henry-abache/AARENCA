// 1. Nombre del caché para el control de versiones de tu PWA
const CACHE_NAME = 'nueva-vida-aa-v1';

// 2. Archivos locales mínimos que la aplicación necesita para cargar incluso sin internet
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// 3. Lógica para generar la URL correcta de Google Maps basada en tus datos de Supabase
// Esta función estará disponible globalmente en el fondo del Service Worker si se llega a requerir,
// aunque recuerda que ya la dejamos integrada directamente en las tarjetas de tu index.html.
function obtenerUrlMapa(ev) {
  if (!ev) return 'https://www.google.com/maps';
  
  return ev.latitud && ev.longitud
    ? `https://www.google.com/maps/search/?api=1&query=${ev.latitud},${ev.longitud}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.lugar)}`;
}

// 4. Evento 'install': Guarda los archivos principales en el almacenamiento del celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 5. Evento 'activate': Limpia cachés antiguos cuando actualices la aplicación en el futuro
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 6. Evento 'fetch': Intercepta las peticiones de red para cargar la app instantáneamente (Modo Offline)
self.addEventListener('fetch', (event) => {
  // Solo interceptamos peticiones locales (no llamadas externas a Supabase o CDN de React)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
