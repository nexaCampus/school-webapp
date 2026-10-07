/* eslint-disable no-restricted-globals */
// Firebase Cloud Messaging Background Service Worker for NexaCampus
// Handles incoming push notifications on Phone (PWA/Chrome) and Desktop browsers

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'REDACTED_GOOGLE_API_KEY',
  authDomain: 'nexacampusschool.firebaseapp.com',
  projectId: 'nexacampusschool',
  storageBucket: 'nexacampusschool.firebasestorage.app',
  messagingSenderId: '116245328238',
  appId: '1:116245328238:web:f8c93f7dfd23b982b9917f',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

let messaging = null;
try {
  messaging = firebase.messaging();
} catch (err) {
  console.warn('[FCM SW] messaging initialization note:', err);
}

// Background push notification listener
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] Received background message:', payload);

    const notificationTitle =
      payload.notification?.title || payload.data?.title || 'NexaCampus School Alert';
    const notificationOptions = {
      body:
        payload.notification?.body ||
        payload.data?.body ||
        'New academic update from school administration.',
      icon: payload.notification?.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: payload.data?.tag || 'nexacampus-broadcast',
      renotify: true,
      vibrate: [200, 100, 200],
      data: {
        url: payload.data?.url || payload.fcmOptions?.link || '/notices',
        dateOfArrival: Date.now(),
      },
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Standard Web Push Event fallback
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    // If handled by FCM onBackgroundMessage, avoid double notification
    if (data && (data.notification || data.data)) {
      const title = data.notification?.title || data.data?.title || 'NexaCampus School Notice';
      const body = data.notification?.body || data.data?.body || 'New announcement available.';
      const url = data.data?.url || data.notification?.click_action || '/notices';

      const options = {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'nexacampus-push',
        vibrate: [200, 100, 200],
        data: { url },
      };

      event.waitUntil(self.registration.showNotification(title, options));
    }
  } catch (_e) {
    // Plain text push payload
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('NexaCampus School Alert', {
        body: text,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: { url: '/notices' },
      })
    );
  }
});

// Notification click event handler - opens or focuses app window
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
