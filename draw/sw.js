// Solve & Draw: works offline after the first visit. Pages: network first (so updates arrive), files: cache first.
const V = 'solvedraw-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const page = r.mode === 'navigate' || /\.(html|js)$/.test(new URL(r.url).pathname);
  e.respondWith(page
    ? fetch(r).then(res => { const c = res.clone(); caches.open(V).then(ca => ca.put(r, c)); return res; }).catch(() => caches.match(r))
    : caches.match(r).then(m => m || fetch(r).then(res => { const c = res.clone(); caches.open(V).then(ca => ca.put(r, c)); return res; })));
});
