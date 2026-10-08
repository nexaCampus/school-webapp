const CACHE_NAME = 'nexacampus-pwa-v2.6.0';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache optional items warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle http(s) GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Network-first for navigation requests with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = (await caches.match('/')) || (await caches.match('/home'));
          return fallback || Response.error();
        })
    );
    return;
  }

  // Cache-first for icons and static assets
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.url.includes('/icons/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for generic scripts & stylesheets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification handling in PWA Service Worker
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.notification?.title || data.title || 'NexaCampus School Alert';
    const body = data.notification?.body || data.body || 'New campus circular or update available.';
    const icon = data.notification?.icon || '/icons/icon-192x192.png';
    const url = data.data?.url || data.url || '/notices';

    const options = {
      body,
      icon,
      badge: '/icons/icon-192x192.png',
      tag: 'nexacampus-notice',
      vibrate: [200, 100, 200],
      data: { url },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (_e) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('NexaCampus School Alert', {
        body: text || 'New update from school administration.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: { url: '/notices' },
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/notices';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            if (client.url.includes(self.location.origin)) {
              client.navigate(targetUrl);
              return client.focus();
            }
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
