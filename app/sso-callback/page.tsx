'use client';

// Google OAuth landing: completes the redirect, stores the session, routes
// new users to onboarding (name carried along) and returning users home.
import { Suspense, useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { setSession } from '@/lib/session';
import { student as mockStudent } from '@/lib/data';

export const dynamic = 'force-dynamic';

function CallbackRunner() {
  const clerk = useClerk();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await clerk.handleRedirectCallback({
          signInFallbackRedirectUrl: '/home',
          signUpFallbackRedirectUrl: '/onboarding',
        });
        if (cancelled) return;
        const user = clerk.user;
        if (!user) throw new Error('Google sign-in did not complete. Please try again.');
        const createdAt = user.createdAt ? new Date(user.createdAt).getTime() : 0;
        const ageMs = createdAt > 0 ? Date.now() - createdAt : Number.MAX_SAFE_INTEGER;
        const isNewAccount = ageMs < 5 * 60 * 1000;
        const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        const email =
          user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? '';
        if (isNewAccount) {
          try {
            sessionStorage.setItem('pendingProfile', JSON.stringify({ name: displayName, email }));
          } catch {
            /* storage unavailable — onboarding still works, fields stay blank */
          }
          setSession({
            clerkUserId: user.id,
            name: displayName,
            email,
            provider: 'google',
            isNewAccount: true,
            student: null,
          });
          window.location.replace('/onboarding');
        } else {
          setSession({
            clerkUserId: user.id,
            name: displayName || mockStudent.name,
            email: email || mockStudent.guardianEmail,
            provider: 'google',
            isNewAccount: false,
            student: {
              ...mockStudent,
              name: displayName || mockStudent.name,
              displayName: displayName || mockStudent.displayName,
              guardianEmail: email || mockStudent.guardianEmail,
            },
          });
          window.location.replace('/home');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Google sign-in did not complete.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clerk]);

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 py-space-xl gap-space-md">
      <div className="w-12 h-12 rounded-full border-[3px] border-surface-container-high border-t-primary animate-spin" />
      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
        Finishing Google sign-in...
      </p>
      {error && (
        <div className="w-full bg-error-container rounded-[10px] px-3 py-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-error-container text-[16px]">error</span>
          <p className="text-[12px] font-medium text-on-error-container">{error}</p>
        </div>
      )}
      <a href="/chooser" className="text-[12px] font-bold text-primary">
        Back to sign in
      </a>
    </div>
  );
}

export default function SsoCallbackPage() {
  return (
    <div className="app-column relative min-h-screen bg-surface flex flex-col w-full px-margin py-space-sm">
      <Suspense>
        <CallbackRunner />
      </Suspense>
    </div>
  );
}
