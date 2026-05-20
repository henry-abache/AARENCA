const CACHE_NAME = 'nueva-vida-aa-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './1-192.png',
  './1-512.png',
  'https://unpkg.com/@supabase/supabase-js@2.39.3/dist/umd/supabase.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Error cacheando:', err);
        return Promise.resolve();
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('supabase.co') || event.request.url.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('Sin conexión', {status: 503}))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => new Response('Sin conexión', {status: 503}));
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-diary') {
    event.waitUntil(syncDiary());
  }
});

async function syncDiary() {
  try {
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    for (let entry of diaryEntries) {
      if (!entry.synced) {
        // Sincronizar con Supabase si es necesario
        entry.synced = true;
      }
    }
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  } catch (e) {
    console.error('Error en sync:', e);
  }
}

self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: './1-192.png',
    badge: './1-192.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false
  };
  event.waitUntil(
    self.registration.showNotification('Nueva Vida AA', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
