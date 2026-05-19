const CACHE = 'nv-aa-v3';
const ARCH = ['./index.html', './manifest.json', './1-192.png', './1-512.png', './logo-aa.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCH).catch(() => {})));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => {
            return r || fetch(e.request).then(res => {
                const copia = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, copia));
                return res;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
