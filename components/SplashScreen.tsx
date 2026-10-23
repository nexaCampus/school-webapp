'use client';

// Cinematic book-opening boot splash for the landing route.
// Renders the signature "Your University, Reimagined" cover for exactly 2 seconds,
// then opens smoothly in 3D perspective like the front cover of a hardcover book,
// revealing the / route (the first page of the book) beneath it.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, TargetAndTransition } from 'framer-motion';
import LogoEmblem from './LogoEmblem';

/** True once the splash has played in this document load; resets on every reload. */
let playedThisLoad = false;

/** Total hold before the exit transition begins — 2 seconds sharp. */
const HOLD_MS = 2000;
const HOLD_MS_REDUCED = 1000;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const BOOK_EASE = [0.25, 0.1, 0.25, 1.0] as const;

export type SplashExitVariant = 'book' | 'fade' | 'portal';

export interface SplashScreenProps {
  /** Fires once the overlay has fully left the DOM. */
  onComplete?: () => void;
  /** Always play the full choreography (for previews / debug). */
  forceShow?: boolean;
  /** Exit choreography: 'book' (default), 'fade', or 'portal'. */
  exitVariant?: SplashExitVariant;
}

export default function SplashScreen({
  onComplete,
  forceShow = false,
  exitVariant = 'book',
}: SplashScreenProps) {
  const reduce = !!useReducedMotion();

  const [visible, setVisible] = useState(() => forceShow || !playedThisLoad);
  const [gone, setGone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const completedRef = useRef(false);
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setGone(true);
    onCompleteRef.current?.();
  }, []);

  // 2-second hold timer
  useEffect(() => {
    if (!visible) {
      handleComplete();
      return;
    }
    playedThisLoad = true;
    const id = window.setTimeout(
      () => setVisible(false),
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

  if (gone) return null;

  // Book-opening exit transition: pivots around the left spine in 3D space
  const exitAnimation: TargetAndTransition = reduce
    ? { opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }
    : exitVariant === 'portal'
      ? { clipPath: 'circle(0% at 50% 50%)', transition: { duration: 0.4, ease: EASE_OUT } }
      : exitVariant === 'fade'
        ? { opacity: 0, scale: 1.05, transition: { duration: 0.35, ease: EASE_OUT } }
        : {
            rotateY: -110,
            x: '-8%',
            opacity: [1, 1, 0.85, 0],
            transition: {
              duration: 0.85,
              ease: BOOK_EASE,
              times: [0, 0.35, 0.7, 1],
            },
          };

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      style={{ perspective: '2200px', perspectiveOrigin: 'left center' }}
    >
      <AnimatePresence onExitComplete={handleComplete}>
        {visible && (
          <motion.div
            key="book-underlay-shadow"
            initial={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: BOOK_EASE }}
            className="pointer-events-none fixed inset-0 z-[95] bg-gradient-to-r from-black/70 via-black/20 to-transparent"
            aria-hidden
          />
        )}
        {visible && (
          <motion.div
            key="book-splash-cover"
            initial={{ rotateY: 0, opacity: 1, x: 0 }}
            exit={exitAnimation}
            className="splash-book-cover pointer-events-auto fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto select-none bg-[#070D18] text-white origin-left"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              boxShadow:
                '-12px 0 40px rgba(0,0,0,0.9), inset 20px 0 35px rgba(0,0,0,0.7)',
            }}
            role="presentation"
          >
            {/* Spine Highlight / Crease along the left edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-30 bg-gradient-to-r from-black/80 via-black/40 to-transparent border-l border-white/10"
            />

            {/* Diagonal Geometric Corner Accent: Top-Left */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -left-12 sm:-top-16 sm:-left-16 w-64 sm:w-80 h-64 sm:h-80 z-10"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                background: 'linear-gradient(135deg, #e8f3ff 0%, #cce4ff 60%, #99ccff 100%)',
                boxShadow: '0 10px 40px rgba(0, 150, 255, 0.3)',
              }}
            >
              <div className="absolute top-16 left-16 sm:top-20 sm:left-20 flex flex-col items-start gap-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 shadow-md flex items-center justify-center p-2 border border-sky-200">
                  <LogoEmblem className="w-full h-full" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#0c2340] uppercase mt-1">
                  FUTURE OF ACADEMIC TECHNOLOGY
                </span>
              </div>
            </div>

            {/* Diagonal Geometric Corner Accent: Bottom-Right */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 w-72 sm:w-96 h-72 sm:h-96 z-10"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(135deg, #cce4ff 0%, #e8f3ff 70%, #ffffff 100%)',
                boxShadow: '-10px -10px 40px rgba(0, 150, 255, 0.25)',
              }}
            >
              <div className="absolute bottom-20 right-20 sm:bottom-24 sm:right-24 text-right flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <LogoEmblem className="w-7 h-7 sm:w-8 sm:h-8" />
                  <span className="font-black text-sm sm:text-base tracking-[0.2em] text-[#0c2340]">
                    NEXA CAMPUS
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] text-sky-800 uppercase mt-0.5">
                  ACADEMIC OPERATING SYSTEM
                </span>
              </div>
            </div>

            {/* Ambient Background Glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/4 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(0,180,255,0.18),transparent_65%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-1/4 bottom-1/4 h-[24rem] w-[24rem] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14),transparent_60%)]"
            />

            {/* Top Navigation Bar */}
            <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 sm:py-5 flex items-center justify-between">
              <div className="w-24 sm:w-40" /> {/* Spacer for top-left triangle */}

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                <span className="hover:text-white transition-colors cursor-default">Home</span>
                <span className="hover:text-white transition-colors cursor-default">About</span>
                <span className="hover:text-white transition-colors cursor-default">Features</span>
                <span className="hover:text-white transition-colors cursor-default">Contact</span>
              </nav>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#0070f3] to-[#00c6ff] text-white text-xs font-bold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Sign In</span>
                  <span className="text-sm">→</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer hover:border-white/50"
                  aria-label="Skip splash screen"
                >
                  SKIP
                </button>
              </div>
            </header>

            {/* Center Hero Layout */}
            <main className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 sm:py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline & Value Prop */}
              <div className="lg:col-span-7 flex flex-col justify-center text-left">
                <div className="space-y-1">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
                    Your University,
                  </h1>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#0091FF] drop-shadow-[0_0_30px_rgba(0,229,255,0.45)]">
                      Reimagined
                    </span>
                  </h1>
                </div>

                <p className="mt-5 text-sm sm:text-base text-slate-300/85 leading-relaxed max-w-xl font-normal">
                  The first truly integrated operating system designed for modern universities.
                  Simplify operations, empower students, and elevate academic excellence.
                </p>

                {/* Primary CTAs */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0070f3] hover:bg-[#0060df] text-white text-sm font-bold shadow-xl shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Get Started</span>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-md transition-all cursor-pointer hover:border-white/40"
                  >
                    Explore Features
                  </button>
                </div>

                {/* 3 Pillar Cards in a Row */}
                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10">
                    <div className="text-xs font-bold text-white tracking-wide">
                      All-in-One Platform
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Everything in one place.
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10">
                    <div className="text-xs font-bold text-white tracking-wide">
                      Secure &amp; Reliable
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Built for performance.
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10">
                    <div className="text-xs font-bold text-white tracking-wide">
                      Smart &amp; Scalable
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Grow without limits.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Graduate Card with 3 Floating Badges */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900">
                  {/* Photo of graduates celebrating */}
                  <img
                    src="/images/graduates.jpg"
                    alt="University graduates celebrating academic success"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Gradient Overlay for Depth and Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-black/30" />

                  {/* 3 Floating Glassmorphism Metric Badges */}
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex flex-col gap-2.5 z-10 w-44 sm:w-48">
                    {/* Badge 1: Active Users */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0e172a]/75 backdrop-blur-xl border border-white/15 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        👥
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          ACTIVE USERS
                        </span>
                        <span className="text-sm font-extrabold text-white tracking-tight">
                          2.5K+
                        </span>
                      </div>
                    </div>

                    {/* Badge 2: Verified Network */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0e172a]/75 backdrop-blur-xl border border-white/15 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        🛡️
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          VERIFIED NETWORK
                        </span>
                        <span className="text-sm font-extrabold text-white tracking-tight">
                          100+
                        </span>
                      </div>
                    </div>

                    {/* Badge 3: Courses Available */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0e172a]/75 backdrop-blur-xl border border-white/15 shadow-lg">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        📖
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          COURSES AVAILABLE
                        </span>
                        <span className="text-sm font-extrabold text-white tracking-tight">
                          500+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Bottom Statistics Bar */}
            <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-6 sm:gap-10">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏛️</span>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      INSTITUTIONS
                    </span>
                    <span className="font-extrabold text-white">100+</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base">👥</span>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      STUDENTS
                    </span>
                    <span className="font-extrabold text-white">50K+</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base">📖</span>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      COURSES
                    </span>
                    <span className="font-extrabold text-white">500+</span>
                  </div>
                </div>
              </div>

              <div className="w-48 sm:w-72" /> {/* Spacer for bottom-right corner triangle */}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
