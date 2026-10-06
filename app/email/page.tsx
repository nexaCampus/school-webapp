'use client';

// Email + Google sign-in via Clerk. Replaces the retired phone-OTP screen:
// Google OAuth redirect, or email/password with an email-code stage for new
// registrations. New accounts land on onboarding (phone asked there).
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs';
import { setSession } from '@/lib/session';
import { student as mockStudent } from '@/lib/data';

type Mode = 'signin' | 'signup';

function withSignUpHint(message: string, mode: Mode): string {
  const looksUnknown = /not find|not found|does not exist/i.test(message);
  return looksUnknown && mode === 'signin'
    ? `${message} Switch to Create account if this email was never registered.`
    : message;
}

export default function EmailPage() {
  const router = useRouter();
  const clerk = useClerk();
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const [mode, setModeState] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');
  const [codeSentTo, setCodeSentTo] = useState('');
  const [codeStage, setCodeStage] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = clerk.loaded && signInLoaded && signUpLoaded;

  function requireActive() {
    if (!setActive) throw new Error('Sign-in is not ready yet. Try again.');
    return setActive;
  }

  function setMode(next: Mode) {
    setModeState(next);
    setError(null);
    setCode('');
    setCodeStage(false);
  }

  function startResendTimer() {
    setSecondsLeft(45);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) clearInterval(t);
        return Math.max(0, s - 1);
      });
    }, 1000);
  }

  async function google() {
    if (!ready || !signIn) return;
    setError(null);
    setGoogleBusy(true);
    try {
      const attempt = await signIn.create({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        actionCompleteRedirectUrl: '/',
      });
      if (attempt.status !== 'complete') {
        await attempt.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: `${window.location.origin}/sso-callback`,
          redirectUrlComplete: '/',
          continueSignUp: true,
        });
      } else {
        await requireActive()({ session: attempt.createdSessionId });
        setSession({
          clerkUserId: clerk.user?.id ?? '',
          name: 'Student',
          email: '',
          provider: 'google',
          isNewAccount: false,
          student: { ...mockStudent },
        });
        router.replace('/home');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed. Try again.');
    } finally {
      setGoogleBusy(false);
    }
  }

  async function submitEmail() {
    if (!ready) return;
    if (!email.includes('@')) return setError('Enter a valid email address');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        if (!signIn) throw new Error('Sign-in is not ready yet. Try again.');
        const attempt = await signIn.create({ identifier: email.trim(), password });
        if (attempt.status !== 'complete') {
          throw new Error(
            'This account needs an extra verification step. Finish it in the Clerk Account Portal, then sign in again.',
          );
        }
        await requireActive()({ session: attempt.createdSessionId });
        setSession({
          clerkUserId: clerk.user?.id ?? '',
          name: mockStudent.name,
          email: email.trim(),
          provider: 'email',
          isNewAccount: false,
          student: { ...mockStudent, guardianEmail: email.trim() },
        });
        router.replace('/home');
      } else {
        if (!signUp) throw new Error('Sign-up is not ready yet. Try again.');
        const created = await signUp.create({ emailAddress: email.trim(), password });
        if (created.status === 'complete') {
          await requireActive()({ session: created.createdSessionId });
          setSession({
            clerkUserId: clerk.user?.id ?? '',
            name: '',
            email: email.trim(),
            provider: 'email',
            isNewAccount: true,
            student: null,
          });
          router.replace('/onboarding');
        } else {
          await created.prepareEmailAddressVerification({ strategy: 'email_code' });
          setCode('');
          setCodeSentTo(email.trim());
          setCodeStage(true);
          startResendTimer();
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Try again.';
      setError(mode === 'signin' ? withSignUpHint(message, mode) : message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (code.replace(/\D/g, '').length !== 6) return setError('Enter the complete 6-digit code');
    if (!signUp) return setError('Your registration session expired. Go back and try again.');
    setError(null);
    setBusy(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: code.replace(/\D/g, ''),
      });
      if (attempt.status !== 'complete') {
        setCode('');
        throw new Error('That code did not complete registration. Request a new one.');
      }
      await requireActive()({ session: attempt.createdSessionId });
      setSession({
        clerkUserId: clerk.user?.id ?? '',
        name: '',
        email: email.trim(),
        provider: 'email',
        isNewAccount: true,
        student: null,
      });
      router.replace('/onboarding');
    } catch (e) {
      setCode('');
      setError(e instanceof Error ? e.message : 'Verification failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (!signUp) return;
    setError(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCode('');
      startResendTimer();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not resend the code. Try again.');
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
          CLERK
        </span>
      </div>

      <div className="flex-1 min-h-[10vh]" aria-hidden="true" />
      <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-md">Welcome back</h2>      <p className="font-body-sm text-body-sm text-on-surface-variant leading-[18px] mt-1">
        Sign in with Google, or use your email and password. New here? Switch to Create account —
        it takes a minute.
      </p>

      <button
        onClick={google}
        disabled={!ready || googleBusy || busy}
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

      {!codeStage ? (
        <>
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
                Password{mode === 'signup' ? ' (min 8 characters)' : ''}
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
            {!ready && (
              <p className="font-body-sm text-body-sm text-[#855300] leading-[15px]">
                Sign-in service is starting — the buttons enable in a moment.
              </p>
            )}
            <button
              onClick={submitEmail}
              disabled={!ready || busy || !email.includes('@') || password.length < 8}
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
        </>
      ) : (
        <div className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-space-md items-center mt-space-md">
          <p className="text-[15px] font-bold text-on-surface">Check your inbox</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-[17px]">
            We sent a 6-digit code to <span className="font-bold text-on-surface">{codeSentTo}</span>.
            Enter it below to finish creating your account.
          </p>
          <label className="flex flex-col gap-1.5 w-full">
            <span className="text-[12px] font-semibold text-on-surface">Verification code</span>
            <span className="flex items-center gap-2 bg-surface-container-low rounded-[14px] px-3 py-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') verifyCode();
                }}
                className="flex-1 min-w-0 bg-transparent outline-none text-[14px] font-semibold text-on-surface tracking-[1px] placeholder:text-outline placeholder:font-normal placeholder:tracking-normal"
              />
            </span>
          </label>
          <div className="w-full flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {secondsLeft > 0
                ? `Resend code in 00:${String(secondsLeft).padStart(2, '0')}`
                : 'You can request a new code'}
            </span>
            <button
              onClick={resendCode}
              disabled={secondsLeft > 0 || busy}
              className="text-[12px] font-bold text-primary bg-primary/10 rounded-lg px-2.5 py-[5px] disabled:opacity-50"
            >
              Resend
            </button>
          </div>
          <button
            onClick={verifyCode}
            disabled={busy || code.replace(/\D/g, '').length !== 6}
            className="w-full h-[52px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.35)] text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60"
          >
            {busy ? (
              <span className="w-[18px] h-[18px] rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              'Verify & Continue'
            )}
          </button>
        </div>
      )}

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
