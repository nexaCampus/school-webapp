'use client';

// Email + Google sign-in via Firebase Authentication (Clerk retired on web).
// New Google/email registrations land on onboarding (phone asked there);
// returning users go straight to the portal.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  completeGoogleRedirect,
  emailSignIn,
  emailSignUp,
  friendlyAuthError,
  googleSignInRedirect,
  type AuthAccount,
} from '@/lib/firebase';
import { setSession } from '@/lib/session';
import { student as mockStudent } from '@/lib/data';

type Mode = 'signin' | 'signup';

export default function EmailPage() {
  const router = useRouter();

  const [mode, setModeState] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setMode(next: Mode) {
    setModeState(next);
    setError(null);
  }

  function routeGoogleAccount(account: AuthAccount) {
    if (account.isNewAccount) {
      const q = new URLSearchParams({ name: account.displayName, email: account.email });
      setSession({
        uid: account.uid,
        name: account.displayName,
        email: account.email,
        provider: 'google',
        isNewAccount: true,
        student: null,
      });
      router.push(`/onboarding?${q.toString()}`);
    } else {
      setSession({
        uid: account.uid,
        name: account.displayName || mockStudent.name,
        email: account.email || mockStudent.guardianEmail,
        provider: 'google',
        isNewAccount: false,
        // Same projection as before: Firebase owns identity, the seeded
        // profile feeds every downstream screen until a Firebase-backed
        // student record exists for this user.
        student: {
          ...mockStudent,
          name: account.displayName || mockStudent.name,
          displayName: account.displayName || mockStudent.displayName,
          guardianEmail: account.email || mockStudent.guardianEmail,
        },
      });
      router.replace('/home');
    }
  }

  // Completes a returning Google redirect (the browser left for Google and
  // came back here). No pending redirect → null → nothing happens.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const account = await completeGoogleRedirect();
        if (!account || cancelled) return;
        setGoogleBusy(true);
        routeGoogleAccount(account);
      } catch (e) {
        if (!cancelled) setError(friendlyAuthError(e, 'signin'));
      } finally {
        if (!cancelled) setGoogleBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function google() {
    setError(null);
    setGoogleBusy(true);
    try {
      // Redirect leaves this page; errors here are launch failures only
      // (e.g. unauthorized-domain). The success path resumes above.
      await googleSignInRedirect();
    } catch (e) {
      setError(friendlyAuthError(e, 'signin'));
      setGoogleBusy(false);
    }
  }

  async function submitEmail() {
    const cleanEmail = email.trim();
    if (!cleanEmail.includes('@')) return setError('Enter a valid email address');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const account = await emailSignIn(cleanEmail, password);
        setSession({
          uid: account.uid,
          name: mockStudent.name,
          email: account.email,
          provider: 'email',
          isNewAccount: false,
          student: { ...mockStudent, guardianEmail: account.email },
        });
        router.replace('/home');
      } else {
        const account = await emailSignUp(cleanEmail, password);
        const q = new URLSearchParams({ email: account.email });
        setSession({
          uid: account.uid,
          name: '',
          email: account.email,
          provider: 'email',
          isNewAccount: true,
          student: null,
        });
        router.push(`/onboarding?${q.toString()}`);
      }
    } catch (e) {
      setError(friendlyAuthError(e, mode));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-column relative min-h-screen bg-surface flex flex-col w-full px-margin py-space-sm">
      <div className="flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface flex-1">Sign in</h1>
        <span className="text-[9px] font-bold text-tertiary bg-tertiary/10 rounded-full px-2 py-1">
          SECURE
        </span>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-md">Welcome back</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-[18px] mt-1">
        Sign in with Google, or use your email and password. New here? Switch to Create account —
        it takes a minute.
      </p>

      <button
        onClick={google}
        disabled={googleBusy || busy}
        className="w-full h-[52px] mt-space-md bg-surface-container-lowest rounded-full shadow-[0_8px_20px_rgba(19,27,46,0.12)] flex items-center justify-center gap-[10px] active:scale-[0.99] transition-transform disabled:opacity-60"
      >
        {googleBusy ? (
          <span className="w-[18px] h-[18px] rounded-full border-2 border-surface-container-high border-t-primary animate-spin" />
        ) : (
          <span className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
            <span className="text-[15px] font-extrabold" style={{ color: '#4285F4' }}>
              G
            </span>
          </span>
        )}
        <span className="text-[14px] font-bold text-on-surface">
          {googleBusy ? 'Opening Google...' : 'Continue with Google'}
        </span>
      </button>

      <div className="flex items-center gap-[10px] w-full mt-space-md">
        <span className="flex-1 h-px bg-surface-container-high" />
        <span className="font-body-sm text-body-sm text-on-surface-variant">or continue with email</span>
        <span className="flex-1 h-px bg-surface-container-high" />
      </div>

      <div className="bg-surface-container-low rounded-full p-1 flex mt-space-md">
        {(['signin', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-[9px] text-[12px] font-bold transition-all ${
              mode === m
                ? 'text-on-surface bg-surface-container-lowest shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            {m === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <div className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-space-md mt-space-md">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold text-on-surface">Email</span>
          <span className="flex items-center gap-2 bg-surface-container-low rounded-[14px] px-3 py-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="flex-1 min-w-0 bg-transparent outline-none text-[14px] font-semibold text-on-surface placeholder:text-outline placeholder:font-normal"
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold text-on-surface">
            Password{mode === 'signup' ? ' (min 6 characters)' : ''}
          </span>
          <span className="flex items-center gap-2 bg-surface-container-low rounded-[14px] px-3 py-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitEmail();
              }}
              className="flex-1 min-w-0 bg-transparent outline-none text-[14px] font-semibold text-on-surface placeholder:text-outline placeholder:font-normal"
            />
            <button
              type="button"
              aria-label="Show password"
              onClick={() => setShowPassword((s) => !s)}
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </span>
        </label>
        {mode === 'signup' && (
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-[15px]">
            We&apos;ll email you a verification link. Your account opens right away so you can
            complete registration.
          </p>
        )}
        <button
          onClick={submitEmail}
          disabled={busy || !email.includes('@') || password.length < 6}
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.35)] text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          {busy ? (
            <span className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            <>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="w-full bg-error-container rounded-[10px] px-3 py-2 flex items-center gap-2 mt-space-md">
          <span className="material-symbols-outlined text-on-error-container text-[16px]">error</span>
          <p className="text-[12px] font-medium text-on-error-container">{error}</p>
        </div>
      )}
      <div className="flex-1 min-h-4" />
    </div>
  );
}
