'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        // Small delay to prevent layout jump on immediate load
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const handleConsent = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem('cookie_consent', choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#151622]/95 backdrop-blur-md border border-outline/20 shadow-2xl text-on-surface">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-lg">cookie</span>
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
              Cookie &amp; Session Preferences
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We use strictly necessary cookies to keep your student session authenticated and secure. We never use advertising or third-party tracking cookies. Review our{' '}
              <Link href="/cookies" className="text-primary font-semibold hover:underline">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-outline/10 text-xs">
          <button
            type="button"
            onClick={() => handleConsent('essential')}
            className="px-3.5 py-1.5 rounded-full font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleConsent('all')}
            className="px-4 py-1.5 rounded-full bg-primary text-white font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
