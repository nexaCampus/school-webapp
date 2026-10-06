'use client';

// Email + Google sign-in via Firebase Authentication (Clerk retired on web).
// New Google/email registrations land on onboarding (phone asked there);
// returning users go straight to the portal.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  claimRedirectAccount,
  emailSignIn,
  emailSignUp,
  friendlyAuthError,
  googleSignIn,
  googleSignInRedirect,
  onAuthChange,
  redirectOutcome,
  reloadAuthUser,
  resendVerificationMail,
  signOutUser,
  type AuthAccount,
} from '@/lib/firebase';
import { getSession, setSession } from '@/lib/session';
import { student as mockStudent } from '@/lib/data';

const PENDING_SIGNUP_KEY = 'pendingSignupEmail';

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
  // Verification dialog: shown after email sign-up (and whenever a signed-in
  // email is still unverified). The student-info page stays closed until the
  // link in Gmail is clicked.
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [dialogBusy, setDialogBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogNote, setDialogNote] = useState<string | null>(null);

  function setMode(next: Mode) {
    setModeState(next);
    setError(null);
  }

  function routeGoogleAccount(account: AuthAccount) {
    const existing = getSession();
    // Returning user who already has an onboarded student profile
    if (existing?.student && !existing.isNewAccount) {
      setSession({
        ...existing,
        uid: account.uid,
        name: account.displayName || existing.student.name,
        email: account.email || existing.student.guardianEmail,
        provider: 'google',
      });
      router.replace('/home');
      return;
    }

    // New Google registration or user without a completed student record:
    // Route to onboarding so they can add student details and verify info.
    const q = new URLSearchParams();
    if (account.displayName) q.set('name', account.displayName);
    if (account.email) q.set('email', account.email);
    setSession({
      uid: account.uid,
      name: account.displayName,
      email: account.email,
      provider: 'google',
      isNewAccount: true,
      student: null,
    });
    router.push(`/onboarding?${q.toString()}`);
  }

  // Completes a returning Google redirect via ONE shared outcome. Calling
  // getRedirectResult separately per effect run discards the first retrieval
  // (StrictMode double-mount in dev) and strands the user on Sign in with a
  // completed sign-in nobody acted on — the account-chooser loop.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const outcome = await redirectOutcome();
        if (cancelled) return;
        if ('error' in outcome) {
          setError(friendlyAuthError(outcome.error, 'signin'));
          return;
        }
        if (!outcome.account || !claimRedirectAccount()) return;
        setGoogleBusy(true);
        routeGoogleAccount(outcome.account);
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

  // Restores the dialog for a signed-in-but-unverified email (fresh reload,
  // return visit, or bounce-back from the onboarding gate). Also heals users
  // returning from Google or email sign-ins:
  // - A Google identity without a completed student profile routes to onboarding
  // - An existing student profile routes to home
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (!user?.email) return;
      if (!user.emailVerified) {
        setVerifyEmail(user.email);
        return;
      }
      const isGoogle = user.providerData.some((p) => p.providerId === 'google.com');
      if (isGoogle) {
        const existing = getSession();
        if (existing?.student && !existing.isNewAccount) {
          router.replace('/home');
        } else {
          routeGoogleAccount({
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email || '',
            isNewAccount: false,
          });
        }
        return;
      }

      if (getSession()?.student) return;
      let pending: string | null = null;
      try {
        pending = localStorage.getItem(PENDING_SIGNUP_KEY);
      } catch {
        /* ignore */
      }
      if (pending && pending === user.email) {
        try {
          localStorage.removeItem(PENDING_SIGNUP_KEY);
        } catch {
          /* ignore */
        }
        setSession({
          uid: user.uid,
          name: '',
          email: user.email ?? '',
          provider: 'email',
          isNewAccount: true,
          student: null,
        });
        const q = new URLSearchParams({ email: user.email ?? '' });
        router.push(`/onboarding?${q.toString()}`);
      } else {
        setSession({
          uid: user.uid,
          name: mockStudent.name,
          email: user.email ?? mockStudent.guardianEmail,
          provider: 'email',
          isNewAccount: false,
          student: { ...mockStudent, guardianEmail: user.email ?? mockStudent.guardianEmail },
        });
        router.replace('/home');
      }
    });
    return unsub;
  }, [router]);

  async function google() {
    setError(null);
    setGoogleBusy(true);
    try {
      let account: AuthAccount;
      try {
        account = await googleSignIn();
      } catch (popupErr: unknown) {
        const code =
          typeof popupErr === 'object' && popupErr !== null && 'code' in popupErr
            ? String((popupErr as { code: unknown }).code)
            : '';
        // If popup was blocked or prevented by the browser, fall back to redirect
        if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
          await googleSignInRedirect();
          return;
        }
        throw popupErr;
      }
      routeGoogleAccount(account);
    } catch (e) {
      setError(friendlyAuthError(e, 'signin'));
    } finally {
      setGoogleBusy(false);
    }
  }

  async function continueVerified() {
    if (!verifyEmail) return;
    setDialogError(null);
    setDialogNote(null);
    setDialogBusy(true);
    try {
      const user = await reloadAuthUser();
      if (user?.emailVerified) {
        try {
          localStorage.removeItem(PENDING_SIGNUP_KEY);
        } catch {
          /* ignore */
        }
        const q = new URLSearchParams({ email: user.email ?? verifyEmail });
        setSession({
          uid: user.uid,
          name: '',
          email: user.email ?? verifyEmail,
          provider: 'email',
          isNewAccount: true,
          student: null,
        });
        setVerifyEmail(null);
        router.push(`/onboarding?${q.toString()}`);
      } else {
        setDialogError('Still not verified — open Gmail (check spam too), tap the link, then press Continue.');
      }
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : 'Could not check verification. Try again.');
    } finally {
      setDialogBusy(false);
    }
  }

  async function resendLink() {
    if (!verifyEmail) return;
    setDialogError(null);
    setDialogNote(null);
    setDialogBusy(true);
    try {
      await resendVerificationMail();
      setDialogNote('Verification link re-sent. Check Gmail (and spam).');
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : 'Could not resend the link. Try again.');
    } finally {
      setDialogBusy(false);
    }
  }

  async function startOver() {
    setDialogError(null);
    setDialogNote(null);
    try {
      await signOutUser();
    } catch {
      /* already signed out — just close */
    }
    try {
      localStorage.removeItem(PENDING_SIGNUP_KEY);
    } catch {
      /* ignore */
    }
    setPassword('');
    setVerifyEmail(null);
  }

  async function submitEmail() {    const cleanEmail = email.trim();
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
        // No session, no navigation: the account exists but the email is
        // unverified, so the dialog takes over and onboarding stays closed.
        try {
          localStorage.setItem(PENDING_SIGNUP_KEY, account.email);
        } catch {
          /* storage unavailable — Continue still works in this tab */
        }
        setVerifyEmail(account.email);
        setDialogError(null);
        setDialogNote(null);
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
            We&apos;ll email you a verification link. You&apos;ll verify it first — the student
            form opens only after that.
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
      {verifyEmail && (
        <div
          className="fixed inset-0 z-[90] bg-on-surface/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center sm:px-margin"
          role="dialog"
          aria-modal="true"
          aria-label="Verify your email"
        >
          <div className="w-full sm:max-w-[430px] bg-surface-container-lowest rounded-t-[28px] sm:rounded-[28px] shadow-[0_24px_64px_rgba(19,27,46,0.30)] p-5 flex flex-col gap-space-md max-h-[92dvh] overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[28px]">mark_email_read</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Verify your email
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-[18px] mt-1">
                We sent a verification link to{' '}
                <span className="font-bold text-on-surface">{verifyEmail}</span>. Open Gmail, tap
                the link, then come back here and press Continue below. The student form opens
                only after your email is verified.
              </p>
            </div>
            {dialogError && (
              <div className="w-full bg-error-container rounded-[10px] px-3 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-error-container text-[16px]">
                  error
                </span>
                <p className="text-[12px] font-medium text-on-error-container">{dialogError}</p>
              </div>
            )}
            {dialogNote && (
              <div className="w-full bg-tertiary/10 rounded-[10px] px-3 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[16px]">
                  check_circle
                </span>
                <p className="text-[12px] font-medium text-tertiary">{dialogNote}</p>
              </div>
            )}
            <button
              onClick={continueVerified}
              disabled={dialogBusy}
              className="w-full h-[52px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.35)] text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60"
            >
              {dialogBusy ? (
                <span className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  I&apos;ve verified — Continue
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-between">
              <button
                onClick={resendLink}
                disabled={dialogBusy}
                className="text-[13px] font-bold text-primary disabled:opacity-50"
              >
                Resend link
              </button>
              <button
                onClick={startOver}
                disabled={dialogBusy}
                className="text-[13px] font-bold text-on-surface-variant disabled:opacity-50"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-4" />
    </div>
  );
}
