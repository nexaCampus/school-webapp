'use client';

// Email + Google sign-in via Firebase Authentication (Clerk retired on web).
// New Google/email registrations land on onboarding (phone asked there);
// returning users go straight to the portal.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  claimRedirectAccount,
  emailSignIn,
  emailSignUp,
  friendlyAuthError,
  getStudent,
  getStudentByEmail,
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
import { authService } from '@/lib/services';
import { student as mockStudent } from '@/lib/data';
import AuthFooter from '@/components/AuthFooter';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useTenant } from '@/lib/context/TenantContext';

const PENDING_SIGNUP_KEY = 'pendingSignupEmail';

type Mode = 'signin' | 'signup';

export default function EmailPage() {
  const router = useRouter();
  const { tenant } = useTenant();
  const schoolName = tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir';

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

  async function routeGoogleAccount(account: AuthAccount) {
    await authService.handleGoogleAccount(account);
    router.replace('/home');
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = (mode === 'signup' ? 'Create Student Account' : 'Email Sign-In') + ` | ${schoolName}`;
    }
  }, [mode, schoolName]);

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
    const unsub = onAuthChange(async (user) => {
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
        const studentDoc = await getStudentByEmail(user.email ?? '');
        const derivedName =
          studentDoc?.name ||
          user.displayName ||
          (user.email ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Student');
        const studentProfile = studentDoc || {
          ...mockStudent,
          id: 'LCGVM-' + user.uid.slice(0, 6).toUpperCase(),
          name: derivedName,
          displayName: derivedName,
          guardianEmail: user.email ?? '',
          fatherName: 'Guardian of ' + derivedName,
          motherName: 'Family of ' + derivedName,
          contactPhone: 'Contact registered via ' + (user.email ?? ''),
          emergencyPhone: 'Contact registered via ' + (user.email ?? ''),
          residentialAddress: 'Address on school roster',
        };
        setSession({
          uid: user.uid,
          name: derivedName,
          email: user.email ?? '',
          provider: 'email',
          isNewAccount: false,
          student: studentProfile,
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
        const studentDoc = await getStudentByEmail(account.email);
        const derivedName =
          studentDoc?.name ||
          account.displayName ||
          cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const studentProfile = studentDoc || {
          ...mockStudent,
          id: (tenant?.subdomain_slug?.toUpperCase() || 'LCGVM') + '-' + account.uid.slice(0, 6).toUpperCase(),
          name: derivedName,
          displayName: derivedName,
          guardianEmail: account.email,
          fatherName: 'Guardian of ' + derivedName,
          motherName: 'Family of ' + derivedName,
          contactPhone: 'Contact registered via ' + account.email,
          emergencyPhone: 'Contact registered via ' + account.email,
          residentialAddress: 'Address on school roster',
        };
        setSession({
          uid: account.uid,
          name: derivedName,
          email: account.email,
          provider: 'email',
          isNewAccount: false,
          student: studentProfile,
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
    <div className="relative min-h-screen bg-surface flex flex-col justify-between w-full overflow-y-auto">
      <main id="main-content" className="contents">
      {/* Ambient Backdrop Orbs */}
      <div className="hidden md:block absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

      {/* Main Centered Content */}
      <div className="flex-1 flex items-center justify-center p-0 md:p-10 w-full relative z-10">
        {/* Main Responsive Split Card Container */}
        <div className="w-full max-w-md md:max-w-4xl mx-auto bg-surface md:bg-surface-container-lowest rounded-none md:rounded-3xl shadow-none md:shadow-[0_24px_70px_-12px_rgba(28,42,200,0.16)] border-0 md:border md:border-outline/10 overflow-hidden md:grid md:grid-cols-12 relative z-10 min-h-screen md:min-h-0 flex flex-col justify-between md:block">
        {/* Left Branding Rail on Desktop */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-primary via-[#2435df] to-[#121c88] text-white p-8 md:p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/20 blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold block">
                  Secure Access
                </span>
                <span className="text-[16px] font-extrabold text-white leading-tight block">
                  {tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir'}
                </span>
                <span className="text-[12px] font-semibold text-secondary-fixed">
                  {tenant ? `${tenant.city || ''} ${tenant.affiliation_board ? `· ${tenant.affiliation_board}` : ''}` : 'CISCE Portal'}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-[22px] font-bold leading-tight">
                Student &amp; Guardian Credentials
              </h2>
              <p className="text-[13px] text-white/80 leading-relaxed">
                Access your personalized dashboard with unified single sign-on across all devices.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 py-6 border-y border-white/10 my-4 text-[13px] text-white/90">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                verified_user
              </span>
              <span>OAuth 2.0 Secure Sign-In</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                lock
              </span>
              <span>256-Bit Cryptographic Session</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                support_agent
              </span>
              <span>24/7 Academic Admin Desk</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70">
            <span>{tenant?.affiliation_board ? `${tenant.affiliation_board} Affiliated Gateway` : 'CISCE Affiliated Gateway'}</span>
            <span>v2.5.3</span>
          </div>
        </div>

        {/* Right Form Rail */}
        <div className="md:col-span-7 p-4 sm:p-6 md:p-10 flex flex-col justify-center flex-1">
          <div className="flex items-center gap-2 mb-4">
            <button
              aria-label="Back"
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface flex-1">
              Sign In
            </h1>
            <DarkModeToggle className="mr-1" />
            <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 rounded-full px-2.5 py-1">
              SECURE
            </span>
          </div>

          <div>
            <h2 className="font-headline-lg text-[22px] md:text-[24px] font-bold text-on-surface">
              Welcome back
            </h2>
            <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed mt-1">
              Sign in with Google, or use your email and password. New here? Switch to Create account.
            </p>
          </div>

          <button
            onClick={google}
            disabled={googleBusy || busy}
            className="w-full h-[50px] mt-5 bg-surface-container-lowest rounded-full shadow-[0_4px_16px_rgba(19,27,46,0.08)] border border-outline/10 flex items-center justify-center gap-[10px] hover:shadow-md hover:border-primary/30 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {googleBusy ? (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-surface-container-high border-t-primary animate-spin" />
            ) : (
              <span className="w-6 h-6 rounded-full bg-white dark:bg-[#151622] shadow-sm flex items-center justify-center">
                <span className="text-[15px] font-extrabold" style={{ color: '#4285F4' }}>
                  G
                </span>
              </span>
            )}
            <span className="text-[14px] font-bold text-on-surface">
              {googleBusy ? 'Opening Google...' : 'Continue with Google'}
            </span>
          </button>

          <div className="flex items-center gap-3 w-full my-5">
            <span className="flex-1 h-px bg-outline/10" />
            <span className="font-body-sm text-[12px] text-outline font-medium">or continue with email</span>
            <span className="flex-1 h-px bg-outline/10" />
          </div>

          <div className="bg-surface-container-low rounded-full p-1 flex mb-4">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2 text-[12px] font-bold transition-all ${
                  mode === m
                    ? 'text-on-surface bg-surface-container-lowest shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold text-on-surface">Email Address</span>
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3.5 py-3 border border-transparent focus-within:border-primary/40 transition-colors">
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
              <span className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3.5 py-3 border border-transparent focus-within:border-primary/40 transition-colors">
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
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </span>
            </label>

            {mode === 'signup' && (
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                We&apos;ll email you a verification link. You&apos;ll verify it first — the student
                form opens only after that.
              </p>
            )}

            <button
              onClick={submitEmail}
              disabled={busy || !email.includes('@') || password.length < 6}
              className="w-full h-[50px] mt-2 rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.3)] text-white text-[14px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60"
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

            {mode === 'signup' && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed text-center mt-2 px-1">
                By creating an account, you agree to our{' '}
                <Link href="/terms" target="_blank" className="text-primary font-medium underline underline-offset-2">
                  Terms of Service
                </Link>{' '}
                and acknowledge our{' '}
                <Link href="/privacy" target="_blank" className="text-primary font-medium underline underline-offset-2">
                  Privacy Policy
                </Link>.
              </p>
            )}
          </div>

          {error && (
            <div className="w-full bg-error-container rounded-xl px-3.5 py-2.5 flex items-center gap-2 mt-4">
              <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
              <p className="text-[12px] font-medium text-on-error-container">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>

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

      {/* Institutional Public Footer */}
      <AuthFooter />
      </main>
    </div>
  );
}
