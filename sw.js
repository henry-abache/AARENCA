const CACHE_NAME = 'nueva-vida-aa-v2.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo-aa.png',
  './1-192.png',
  './1-512.png',
];

// Try to cache supabase but don't fail if unavailable
const externalToCache = [
  'https://unpkg.com/@supabase/supabase-js@2.39.3/dist/umd/supabase.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache core files first (must succeed)
      return cache.addAll(urlsToCache).then(() => {
        // Cache external files (optional, don't fail)
        return Promise.allSettled(
          externalToCache.map(url => cache.add(url).catch(() => {}))
        );
      });
    }).catch(err => {
      console.warn('[SW] Cache install error:', err);
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

  const url = event.request.url;

  // For Supabase API calls: network-first, fail gracefully
  if (url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() => 
        new Response(JSON.stringify({ data: null, error: { message: 'Sin conexión' } }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // For googleapis and other external
  if (url.includes('googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('', {status: 503}))
    );
    return;
  }

  // For app files: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Return cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Sin conexión', { status: 503 });
      });
    })
  );
});

// Background sync for diary
self.addEventListener('sync', event => {
  if (event.tag === 'sync-diary') {
    event.waitUntil(syncDiary());
  }
});

async function syncDiary() {
  // Diary is local-only; no server sync needed
  console.log('[SW] Diary sync skipped — local only');
}

// Push notifications
self.addEventListener('push', event => {
  let title = 'Nueva Vida AA';
  let body = '¿Cómo vas hoy? Abre la app y registra tu progreso.';
  
  try {
    if (event.data) {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
    }
  } catch(e) {
    if (event.data) body = event.data.text() || body;
  }

  const options = {
    body,
    icon: './1-192.png',
    badge: './1-192.png',
    vibrate: [200, 100, 200],
    tag: 'nvaa-notification',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Abrir app' },
      { action: 'dismiss', title: 'Ignorar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
