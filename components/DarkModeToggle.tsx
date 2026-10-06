'use client';

import React, { useEffect, useState } from 'react';

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = saved === 'dark' || (!saved && prefersDark);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 md:w-9 md:h-9 rounded-full bg-surface-container dark:bg-slate-800 opacity-60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-surface-container dark:bg-slate-800 text-on-surface hover:bg-surface-container-high dark:hover:bg-slate-700 border border-outline/15 shadow-sm active:scale-90 transition-all duration-200 group ${className}`}
    >
      {isDark ? (
        // Glowing Sun icon with warm rays in dark mode
        <span className="material-symbols-outlined text-[20px] text-amber-400 group-hover:rotate-45 transition-transform duration-300">
          light_mode
        </span>
      ) : (
        // Sleek Moon icon in light mode
        <span className="material-symbols-outlined text-[19px] text-indigo-600 dark:text-indigo-400 group-hover:-rotate-12 transition-transform duration-300">
          dark_mode
        </span>
      )}
    </button>
  );
}
