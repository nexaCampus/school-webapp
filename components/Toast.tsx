'use client';

import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgStyles = {
    success: 'bg-emerald-600 dark:bg-emerald-700 text-white shadow-emerald-500/25',
    error: 'bg-rose-600 dark:bg-rose-700 text-white shadow-rose-500/25',
    info: 'bg-primary dark:bg-[#2e3fc7] text-white shadow-primary/25',
  }[type];

  const iconName = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  }[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-sm pointer-events-auto select-none"
    >
      <div className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl ${bgStyles}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-[20px] flex-shrink-0">
            {iconName}
          </span>
          <p className="text-xs sm:text-[13px] font-bold leading-snug truncate">
            {message}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-90 transition-transform flex-shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
