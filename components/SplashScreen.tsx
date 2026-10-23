'use client';

/**
 * NexaCampus Diagonal-Opening Boot Splash
 *
 * 1. Restores the iconic, branded splash UI (LogoEmblem, "NEXA CAMPUS",
 *    "Academic Operating System", sweeping scan line beam, and ambient radial glow).
 * 2. Dynamically follows Light Mode and Dark Mode, with instant theme synchronization
 *    and a top-right DarkModeToggle.
 * 3. Holds for exactly 2 seconds (HOLD_MS = 2000), then executes a cinematic
 *    diagonal split opening from the middle outwards.
 * 4. Animates the / route emerging from the center into full clarity and focus.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import LogoEmblem from './LogoEmblem';
import DarkModeToggle from './DarkModeToggle';

/** True once the splash has played in this document load; resets on hard reload. */
let playedThisLoad = false;

/** Exact 2-second hold before the diagonal opening animation begins. */
const HOLD_MS = 2000;
const HOLD_MS_REDUCED = 1000;

/** Cinematic academic ease shared by all motion stages. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export interface SplashScreenProps {
  /** Fires once the overlay has fully left the DOM. */
  onComplete?: () => void;
  /** Always play the full choreography (for previews / debug). */
  forceShow?: boolean;
}

export default function SplashScreen({
  onComplete,
  forceShow = false,
}: SplashScreenProps) {
  const reduce = !!useReducedMotion();

  const [visible, setVisible] = useState(() => forceShow || !playedThisLoad);
  const [gone, setGone] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Sync with current theme (Light/Dark mode)
  useEffect(() => {
    const checkTheme = () => {
      const isHtmlDark = document.documentElement.classList.contains('dark');
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isHtmlDark || saved === 'dark' || (!saved && prefersDark));
    };

    checkTheme();

    // Listen for class changes on <html> (e.g. DarkModeToggle clicked)
    const observer = new MutationObserver(() => checkTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMedia = () => checkTheme();
    mql.addEventListener?.('change', handleMedia);

    window.addEventListener('storage', checkTheme);

    return () => {
      observer.disconnect();
      mql.removeEventListener?.('change', handleMedia);
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const completedRef = useRef(false);
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setGone(true);

    // Clean up body classes and restored styles
    document.body.classList.remove('splash-active', 'splash-exiting');
    document.body.style.overflow = '';

    onCompleteRef.current?.();
  }, []);

  // 2-second hold timer
  useEffect(() => {
    if (!visible) {
      handleComplete();
      return;
    }
    playedThisLoad = true;

    // Set splash active class to prime the / main page underneath
    document.body.classList.add('splash-active');

    const id = window.setTimeout(
      () => {
        // Trigger diagonal opening animation
        document.body.classList.remove('splash-active');
        document.body.classList.add('splash-exiting');
        setVisible(false);
      },
      reduce ? HOLD_MS_REDUCED : HOLD_MS
    );

    return () => window.clearTimeout(id);
  }, [visible, reduce, handleComplete]);

  // Lock body scroll while splash is active
  useEffect(() => {
    if (gone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gone]);

  const handleSkip = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!visible) return;
    document.body.classList.remove('splash-active');
    document.body.classList.add('splash-exiting');
    setVisible(false);
  };

  if (gone) return null;

  // The inner content rendered identically inside both diagonal shutter leaves
  const renderContent = () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Ambient Radial Glows */}
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(28,42,200,0.10),transparent_65%)]'
        } motion-safe:animate-pulse`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_60%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_60%)]'
        }`}
      />

      {/* Choreographed Center Column */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className={
            isDark
              ? 'drop-shadow-[0_0_24px_rgba(56,189,248,0.55)]'
              : 'drop-shadow-[0_6px_22px_rgba(28,42,200,0.25)]'
          }
        >
          <LogoEmblem className="h-20 w-20 sm:h-24 sm:w-24" />
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
          className={`bg-clip-text text-2xl sm:text-4xl font-extrabold tracking-[0.22em] text-transparent ${
            isDark
              ? 'bg-gradient-to-r from-white via-sky-200 to-blue-400'
              : 'bg-gradient-to-r from-[#0A192F] via-[#1c2ac8] to-[#3b49df]'
          }`}
        >
          NEXA CAMPUS
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT }}
          className={`text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] ${
            isDark ? 'text-blue-300/85' : 'text-[#454655]'
          }`}
        >
          Academic Operating System
        </motion.p>

        {/* 1px Animated Scanning Line */}
        <div
          aria-hidden
          className={`relative mt-1 h-px w-44 sm:w-56 overflow-hidden rounded-full ${
            isDark ? 'bg-white/10' : 'bg-indigo-950/10'
          }`}
        >
          <motion.span
            initial={reduce ? false : { x: '-110%' }}
            animate={reduce ? { x: 0 } : { x: '320%' }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    delay: 0.45,
                    duration: 0.75,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 1.3,
                  }
            }
            className={`absolute inset-y-0 left-0 block w-1/3 bg-gradient-to-r from-transparent to-transparent motion-reduce:hidden ${
              isDark ? 'via-sky-400' : 'via-[#1c2ac8]'
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Dynamic inline styles ensuring the / page emerges smoothly from the center */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body.splash-active #main-content {
            transform: scale(0.95);
            opacity: 0.85;
            filter: blur(4px);
            transform-origin: center center;
            transition: none;
          }
          body.splash-exiting #main-content {
            transform: scale(1);
            opacity: 1;
            filter: blur(0px);
            transform-origin: center center;
            transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.75s ease-out,
                        filter 0.65s ease-out;
          }
        `,
      }} />

      <AnimatePresence onExitComplete={handleComplete}>
        {visible && (
          <div
            key="splash-overlay-wrapper"
            className="fixed inset-0 z-[100] pointer-events-auto select-none overflow-hidden"
          >
            {/* Top Navigation Bar: Dark Mode Toggle + Discreet Skip Button */}
            <motion.header
              key="splash-top-bar"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[120] flex items-center gap-3"
            >
              <DarkModeToggle className="shadow-md" />

              <button
                type="button"
                onClick={handleSkip}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] transition-all backdrop-blur-md border ${
                  isDark
                    ? 'text-blue-300/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                    : 'text-[#1c2ac8]/80 hover:text-[#1c2ac8] bg-[#1c2ac8]/5 hover:bg-[#1c2ac8]/15 border-[#1c2ac8]/20'
                }`}
                title="Skip splash and reveal landing page"
              >
                Skip
              </button>
            </motion.header>

            {/* Neon Seam Light Streak along the diagonal dividing line */}
            <motion.div
              key="splash-diagonal-beam"
              initial={{ opacity: 0.4 }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
              className="pointer-events-none fixed inset-0 z-[115]"
              aria-hidden
            >
              <svg className="w-full h-full" preserveAspectRatio="none">
                <line
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                  stroke={isDark ? '#38bdf8' : '#1c2ac8'}
                  strokeWidth="2"
                  strokeOpacity={isDark ? 0.6 : 0.4}
                  className={isDark ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]' : 'drop-shadow-[0_0_8px_rgba(28,42,200,0.4)]'}
                />
              </svg>
            </motion.div>

            {/* Diagonal Leaf 1: Top-Left Half */}
            <motion.div
              key="splash-leaf-tl"
              initial={{ x: 0, y: 0 }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.25 } }
                  : {
                      x: '-105%',
                      y: '-105%',
                      transition: { duration: 0.85, ease: EASE_OUT },
                    }
              }
              style={{
                clipPath: 'polygon(0 0, 100.3% 0, 0 100.3%)',
              }}
              className={`fixed inset-0 z-[100] overflow-hidden transition-colors duration-200 ${
                isDark ? 'bg-[#070D18] text-white' : 'bg-[#faf8ff] text-[#131b2e]'
              }`}
              role="presentation"
            >
              {renderContent()}
            </motion.div>

            {/* Diagonal Leaf 2: Bottom-Right Half */}
            <motion.div
              key="splash-leaf-br"
              initial={{ x: 0, y: 0 }}
              exit={
                reduce
                  ? { opacity: 0, transition: { duration: 0.25 } }
                  : {
                      x: '105%',
                      y: '105%',
                      transition: { duration: 0.85, ease: EASE_OUT },
                    }
              }
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
              className={`fixed inset-0 z-[100] overflow-hidden transition-colors duration-200 ${
                isDark ? 'bg-[#070D18] text-white' : 'bg-[#faf8ff] text-[#131b2e]'
              }`}
              role="presentation"
            >
              {renderContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
