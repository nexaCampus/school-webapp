'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getSession, refreshSignedSession, subscribeSession } from '@/lib/state/sessionStore';

interface RequireSessionProps {
  children: React.ReactNode;
  /**
   * 'session'  -> any signed-in portal session is enough.
   * 'creator'  -> a SchoolMaker creator session (phone + OTP verified) is required.
   */
  mode?: 'session' | 'creator';
}

const CREATOR_SESSION_KEY = 'schoolmaker_creator_session';

function hasCreatorSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(CREATOR_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { token?: string; phone?: string };
    return Boolean(parsed?.token && parsed?.phone);
  } catch {
    return false;
  }
}

/**
 * Blocks a subtree until a valid session exists.
 *
 * Unlike the previous per-page useEffect guards, nothing is rendered before the
 * check completes, so protected content never flashes for an unauthenticated
 * visitor.
 */
export default function RequireSession({ children, mode = 'session' }: RequireSessionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    const evaluate = () => {
      if (mode === 'creator') {
        if (hasCreatorSession()) {
          // Make sure the edge also has a signed creator cookie.
          refreshSignedSession();
          setState('allowed');
        } else {
          setState('denied');
        }
        return;
      }

      const session = getSession();
      if (session?.student || session?.name) {
        refreshSignedSession();
        setState('allowed');
      } else {
        setState('denied');
      }
    };

    evaluate();
    const unsubscribe = subscribeSession(() => evaluate());
    return unsubscribe;
  }, [mode]);

  useEffect(() => {
    if (state !== 'denied') return;
    const params = new URLSearchParams();
    params.set('redirect', pathname);
    router.replace(`/chooser?${params.toString()}`);
  }, [state, pathname, router]);

  if (state !== 'allowed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff] dark:bg-[#12131a]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 rounded-full border-2 border-[#1c2ac8]/25 border-t-[#1c2ac8] animate-spin" />
          <p className="text-xs font-mono text-[#454655] dark:text-[#a0a4c0]">
            {state === 'denied' ? 'Redirecting to sign-in…' : 'Verifying session…'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
