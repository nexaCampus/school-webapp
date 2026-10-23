'use client';

// Cinematic boot splash for the landing route. A deep-navy cover paints with
// the very first pixel (it is part of the SSR markup) so the light page can
// never flash beneath it, choreographs the emblem and wordmark in over ~1.2s,
// then dissolves itself from the DOM entirely — no residue, no scroll lock,
// no timers left running.
//
// Replays are governed by a per-tab sessionStorage flag. Because sessionStorage
// is unreadable during SSR, the inline head script in app/layout.tsx stamps
// <html class="splash-seen"> before first paint for tabs that already watched
// the animation, and globals.css display:nones the cover for those — a repeat
// visitor never sees even one frame of it.
//
// Animation engine: Framer Motion. `prefers-reduced-motion` collapses the
// staggered choreography into a static brand frame with a short cross-fade
// exit (useReducedMotion + motion-safe variants).
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import LogoEmblem from './LogoEmblem';

/** Per-tab replay flag. Written when the splash plays, honoured until the tab closes. */
export const SPLASH_SESSION_KEY = 'hasSeenSplash';

/** Total hold before the exit transition begins. */
const HOLD_MS = 1200;
const HOLD_MS_REDUCED = 700;

/** Signature ease-out shared by every stage of the choreography. */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type SplashExitVariant = 'fade' | 'portal';

export interface SplashScreenProps {
  /** Fires once the overlay has fully left the DOM (or instantly when skipped by the replay flag). */
  onComplete?: () => void;
  /** Ignore the replay flag — always play the full choreography (debugging / previews). */
  forceShow?: boolean;
  /** Exit choreography: 'fade' zooms the cover away (default), 'portal' irises it into the centre. */
  exitVariant?: SplashExitVariant;
}

export default function SplashScreen({
  onComplete,
  forceShow = false,
  exitVariant = 'fade',
}: SplashScreenProps) {
  const reduce = !!useReducedMotion();

  /** Drives the AnimatePresence exit once the hold elapses or Skip is pressed. */
  const [visible, setVisible] = useState(true);
  /** Stops rendering the (now idle) AnimatePresence subtree altogether. */
  const [gone, setGone] = useState(false);

  // Latest-ref pattern keeps onComplete stable so parent re-renders (the home
  // page ticks every second) can never restart the hold timer.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const completedRef = useRef(false);
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === 'true';
    } catch {
      // Storage can throw in privacy modes; treat as first visit.
    }

    if (seen && !forceShow) {
      // The pre-paint CSS already hid the cover; drop it without any exit.
      setVisible(false);
      setGone(true);
      handleComplete();
      return;
    }

    try {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    } catch {
      // Replay-per-load is the graceful degradation.
    }

    const id = window.setTimeout(() => setVisible(false), reduce ? HOLD_MS_REDUCED : HOLD_MS);
    return () => window.clearTimeout(id);
  }, [forceShow, reduce, handleComplete]);

  // While the cover is up the page beneath must not scroll.
  useEffect(() => {
    if (gone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gone]);

  if (gone) return null;

  const exit =
    reduce
      ? { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' as const } }
      : exitVariant === 'portal'
        ? {
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.3, ease: EASE_OUT },
          }
        : {
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.3, ease: EASE_OUT },
          };

  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {visible && (
        <motion.div
          key="splash-overlay"
          className="splash-overlay fixed inset-0 z-[100] overflow-hidden select-none bg-[#070D18] text-white"
          style={exitVariant === 'portal' ? { clipPath: 'circle(140% at 50% 50%)' } : undefined}
          exit={exit}
          role="presentation"
        >
          {/* Ambient radial glows — the pulsing heart of the cover */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_65%)] motion-safe:animate-pulse"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_60%)]"
          />

          {/* Discreet skip — top right, fades in with the wordmark */}
          <motion.button
            type="button"
            onClick={() => setVisible(false)}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { delay: 0.8, duration: 0.4, ease: 'easeOut' }}
            className="absolute right-4 top-4 z-20 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-300/50 transition-colors hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 sm:right-6 sm:top-6"
          >
            Skip
          </motion.button>

          {/* Choreographed centre column */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            >
              <LogoEmblem className="h-20 w-20 sm:h-24 sm:w-24" />
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT }}
              className="bg-gradient-to-r from-white via-sky-200 to-blue-400 bg-clip-text text-2xl font-extrabold tracking-[0.22em] text-transparent sm:text-4xl"
            >
              NEXA CAMPUS
            </motion.p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: EASE_OUT }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300/80 sm:text-xs"
            >
              Academic Operating System
            </motion.p>

            {/* 1px scan line sweeping beneath the wordmark */}
            <div
              aria-hidden
              className="relative mt-1 h-px w-44 overflow-hidden rounded-full bg-white/10 sm:w-56"
            >
              <motion.span
                initial={reduce ? false : { x: '-110%' }}
                animate={reduce ? { x: 0 } : { x: '320%' }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { delay: 0.5, duration: 0.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.4 }
                }
                className="absolute inset-y-0 left-0 block w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent motion-reduce:hidden"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
