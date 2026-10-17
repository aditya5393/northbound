// SafarOS Multi-Tenant SaaS Service Worker
const CACHE_NAME = 'safaros-saas-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Never cache Firebase Auth, Firestore, or Storage live API traffic
function isFirebaseOrApiRequest(url) {
  return (
    url.includes('firestore.googleapis.com') ||
    url.includes('identitytoolkit.googleapis.com') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('googleapis.com/identitytoolkit') ||
    url.includes('google.com/recaptcha')
  );
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const reqUrl = event.request.url || '';
  if (isFirebaseOrApiRequest(reqUrl)) {
    return; // Let Firebase SDK handle live network + IndexedDB persistence directly
  }

  // Network-first for HTML navigation so SaaS updates appear immediately
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(res => res || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate for static assets & icons
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});