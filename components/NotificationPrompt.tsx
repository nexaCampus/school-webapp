'use client';

import React, { useEffect, useState } from 'react';
import {
  getNotificationPermission,
  isNotificationSupported,
  requestNotificationPermission,
  sendTestNotification,
  type PushPermissionStatus,
} from '@/lib/firebaseNotifications';

interface NotificationPromptProps {
  className?: string;
  variant?: 'banner' | 'card' | 'inline';
}

export default function NotificationPrompt({
  className = '',
  variant = 'banner',
}: NotificationPromptProps) {
  const [permission, setPermission] = useState<PushPermissionStatus>('default');
  const [supported, setSupported] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const isSupp = isNotificationSupported();
    setSupported(isSupp);
    if (isSupp) {
      setPermission(getNotificationPermission());
    }

    // Check if dismissed in this browser session
    if (typeof sessionStorage !== 'undefined') {
      const isDismissed = sessionStorage.getItem('nexacampus_notif_prompt_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    }
  }, []);

  const handleAllowNotifications = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const result = await requestNotificationPermission();
      setPermission(result.permission);
      if (result.success) {
        setFeedback('Notifications enabled! A confirmation alert was sent.');
        setTimeout(() => setFeedback(null), 5000);
      } else if (result.error) {
        setFeedback(result.error);
      }
    } catch (err) {
      setFeedback('Could not enable notifications. Check browser permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const sent = await sendTestNotification(
        'NexaCampus Alert 📢',
        'Term practical exams & circulars are live! Web push notification test successful.',
        '/notices'
      );
      if (sent) {
        setFeedback('Test notification sent to your device!');
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback('Notification blocked or not supported on this device.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('nexacampus_notif_prompt_dismissed', 'true');
    }
  };

  if (!supported) return null;

  // If already granted and not specifically in inline/card mode, no need to show the banner
  if (permission === 'granted' && variant === 'banner' && !feedback) {
    return null;
  }

  // If user dismissed in this session and permission is default
  if (dismissed && permission !== 'granted' && !feedback) {
    return null;
  }

  // If permanently denied in browser and banner mode
  if (permission === 'denied' && variant === 'banner' && !feedback) {
    return null;
  }

  // INLINE / SETTINGS CARD VARIANT
  if (variant === 'inline' || variant === 'card') {
    return (
      <div
        className={`rounded-2xl p-4 bg-white dark:bg-[#252526] border border-outline/10 dark:border-[#3c3c3c] shadow-sm flex flex-col gap-3 ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-on-surface">Web Push Notifications</h3>
              <p className="text-[12px] text-on-surface-variant">
                Receive live circulars, timetable changes, and fee dues.
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
              permission === 'granted'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : permission === 'denied'
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                permission === 'granted'
                  ? 'bg-emerald-500'
                  : permission === 'denied'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
            ></span>
            {permission === 'granted'
              ? 'Active'
              : permission === 'denied'
              ? 'Blocked'
              : 'Action Required'}
          </span>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary text-[12px] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>{feedback}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {permission !== 'granted' ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleAllowNotifications}
              className="flex-1 py-2 px-3 rounded-full bg-primary text-white text-[12px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>{loading ? 'Activating...' : 'Allow Notifications'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSendTest}
              className="flex-1 py-2 px-3 rounded-full bg-surface-container hover:bg-surface-container-high dark:bg-[#333333] text-on-surface text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{loading ? 'Sending...' : 'Send Test Notification'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT FLOATING OR TOP BANNER VARIANT (Shows on home / notices / portal)
  return (
    <div
      className={`rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-primary/10 via-surface-container-lowest to-surface-container-lowest border border-primary/25 dark:border-primary/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications_active</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-[13px] sm:text-[14px] font-bold text-on-surface leading-tight">
              Enable School Notifications
            </h4>
            <span className="px-2 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              Firebase Push
            </span>
          </div>
          <p className="text-[11.5px] sm:text-[12px] text-on-surface-variant mt-0.5 leading-snug">
            {feedback ||
              'Receive instant notice circulars, attendance alerts, and exam updates directly on your phone or laptop.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
        <button
          type="button"
          disabled={loading}
          onClick={handleAllowNotifications}
          className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-primary text-white text-[12px] font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{loading ? 'Enabling...' : 'Allow Notifications'}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          title="Maybe Later"
          aria-label="Dismiss notification prompt"
          className="px-3 py-2 rounded-full bg-surface-container dark:bg-[#333333] text-on-surface-variant hover:text-on-surface text-[12px] font-medium transition-all active:scale-95 cursor-pointer"
        >
          Later
        </button>
      </div>
    </div>
  );
}
