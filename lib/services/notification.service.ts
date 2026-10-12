/**
 * NexaCampus Push Notification Service
 */

import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  sendTestNotification,
  type PushPermissionStatus,
  type NotificationResult,
} from '../firebaseNotifications';

export const notificationService = {
  isSupported: isNotificationSupported,

  getPermission: getNotificationPermission,

  async requestPermission(): Promise<NotificationResult> {
    return await requestNotificationPermission();
  },

  async sendTest(): Promise<boolean> {
    return await sendTestNotification();
  },
};

export default notificationService;
