// Firebase Cloud Messaging client utilities for Web Push Notifications
// Works on Mobile Phones (Android Chrome, PWA standalone) and Desktop Laptops

import { firebase } from './firebase';
import { firebaseEnv } from './config/env';
import { getSession } from './session';
import { doc, setDoc } from 'firebase/firestore';

export type PushPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface NotificationResult {
  success: boolean;
  permission: PushPermissionStatus;
  token?: string;
  error?: string;
}

/** Check if Web Push Notifications and Service Workers are supported in current browser */
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/** Get the current notification permission state */
export function getNotificationPermission(): PushPermissionStatus {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as PushPermissionStatus;
}

/**
 * Register the Firebase Cloud Messaging Service Worker
 */
export async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    console.log('[FCM] Messaging Service Worker registered with scope:', registration.scope);
    return registration;
  } catch (err) {
    console.warn('[FCM] /firebase-messaging-sw.js registration failed, falling back to /sw.js:', err);
    try {
      const fallbackReg = await navigator.serviceWorker.ready;
      return fallbackReg;
    } catch (_fallbackErr) {
      return null;
    }
  }
}

/**
 * Request notification permission from the user, initialize FCM token, and sync with Firestore.
 */
export async function requestNotificationPermission(): Promise<NotificationResult> {
  if (!isNotificationSupported()) {
    return {
      success: false,
      permission: 'unsupported',
      error: 'Push notifications are not supported in this browser.',
    };
  }

  try {
    // 1. Request Browser Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        permission: permission as PushPermissionStatus,
        error:
          permission === 'denied'
            ? 'Notifications are blocked in your browser settings. Please allow notifications for this site to receive campus updates.'
            : 'Notification permission request was dismissed.',
      };
    }

    // 2. Register Service Worker
    const swRegistration = await registerMessagingServiceWorker();

    let token: string | undefined = undefined;

    // 3. Attempt FCM Token Generation
    try {
      const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
      const supported = await isSupported().catch(() => false);

      if (supported) {
        const { app } = firebase();
        const messaging = getMessaging(app);

        // Optional VAPID key from environment, or default FCM registration
        const vapidKey = firebaseEnv.vapidKey;

        token = await getToken(messaging, {
          serviceWorkerRegistration: swRegistration || undefined,
          vapidKey,
        });

        if (token) {
          localStorage.setItem('nexacampus_fcm_token', token);
          console.log('[FCM] Device registered with FCM token:', token);

          // 4. Persist Token in Firestore for backend broadcasts
          try {
            const { db } = firebase();
            const session = getSession();
            const studentId = session?.student?.id || session?.uid || 'anonymous';
            const studentName = session?.student?.name || session?.name || 'Student';

            // Sanitize token for doc ID
            const tokenDocId = token.slice(-40);
            await setDoc(
              doc(db, 'fcm_tokens', tokenDocId),
              {
                token,
                studentId,
                studentName,
                platform: 'web',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                updatedAt: new Date().toISOString(),
                active: true,
              },
              { merge: true }
            );
          } catch (firestoreErr) {
            console.warn('[FCM] Could not sync token to Firestore:', firestoreErr);
          }
        }
      }
    } catch (fcmErr) {
      console.warn('[FCM] FCM getToken note (standard notifications still work):', fcmErr);
    }

    // 5. Send an immediate Welcome Notification to verify activation on device
    try {
      if (swRegistration && 'showNotification' in swRegistration) {
        await swRegistration.showNotification('NexaCampus Notifications Active 🔔', {
          body: 'You will now receive instant notices, fee alerts, and class updates directly on your device.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: 'nexacampus-welcome',
          data: { url: '/notices' },
        });
      } else {
        new Notification('NexaCampus Notifications Active 🔔', {
          body: 'You will now receive instant notices and class updates on your device.',
          icon: '/icons/icon-192x192.png',
        });
      }
    } catch (notifErr) {
      console.warn('[FCM] Initial notification popup note:', notifErr);
    }

    return {
      success: true,
      permission: 'granted',
      token,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to request notification permission.';
    return {
      success: false,
      permission: getNotificationPermission(),
      error: errorMsg,
    };
  }
}

/**
 * Dispatch a direct test notification to verify device receipt.
 */
export async function sendTestNotification(
  title = 'NexaCampus Notice Alert 📢',
  body = 'Term 1 Parent-Teacher Meeting slots and examination dates are published.',
  targetUrl = '/notices'
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  let permission = Notification.permission;
  if (permission !== 'granted') {
    const res = await requestNotificationPermission();
    if (!res.success) return false;
    permission = 'granted';
  }

  try {
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (reg && 'showNotification' in reg) {
      await reg.showNotification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: `nexacampus-test-${Date.now()}`,
        data: { url: targetUrl },
      } as NotificationOptions);
      return true;
    }

    // Browser Notification fallback
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png',
    });
    return true;
  } catch (err) {
    console.error('[FCM] Failed to dispatch test notification:', err);
    return false;
  }
}

/**
 * Listen for foreground push messages when the web app is open.
 */
export async function listenToForegroundMessages(
  onMessageReceived: (payload: { title?: string; body?: string; data?: Record<string, unknown> }) => void
): Promise<(() => void) | null> {
  if (typeof window === 'undefined' || !isNotificationSupported()) return null;

  try {
    const { getMessaging, onMessage, isSupported } = await import('firebase/messaging');
    const supported = await isSupported().catch(() => false);
    if (!supported) return null;

    const { app } = firebase();
    const messaging = getMessaging(app);

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground message received:', payload);
      const title = payload.notification?.title || payload.data?.title;
      const body = payload.notification?.body || payload.data?.body;
      onMessageReceived({
        title,
        body,
        data: payload.data as Record<string, unknown>,
      });
    });

    return unsubscribe;
  } catch (err) {
    console.warn('[FCM] listenToForegroundMessages note:', err);
    return null;
  }
}
