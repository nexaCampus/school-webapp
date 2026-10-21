'use client';

// Admission number via Firebase roster. Unknown numbers route to onboarding
// (locked) instead of dead-ending — mirrors AdmissionLoginViewModel.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeAdmissionNumber } from '@/lib/firebase';
import { authService } from '@/lib/services';
import DarkModeToggle from '@/components/DarkModeToggle';
import AuthFooter from '@/components/AuthFooter';
import { useTenant } from '@/lib/context/TenantContext';

export default function AdmissionPage() {
  const router = useRouter();
  const { tenant } = useTenant();
  const schoolName = tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir';
  const [admission, setAdmission] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Admission Number Sign-In | ${schoolName}`;
    }
  }, [schoolName]);

  async function submit() {
    const normalized = normalizeAdmissionNumber(admission);
    if (normalized.length < 5) return setError('Enter the admission number from your ID card');
    setError(null);
    setBusy(true);
    try {
      const result = await authService.loginWithAdmissionNumber(normalized);
      if (result.success && result.redirectUrl) {
        router.replace(result.redirectUrl);
      } else if (result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not verify that admission number');
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
                <span className="material-symbols-outlined text-[24px]">badge</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold block">
                  Student Verification
                </span>
                <span className="text-[16px] font-extrabold text-white leading-tight block">
                  {tenant?.school_name || 'Lions Calcutta Greater Vidya Mandir'}
                </span>
                <span className="text-[12px] font-semibold text-secondary-fixed">
                  {tenant?.affiliation_board || 'CISCE'} Portal
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-[22px] font-bold leading-tight">
                Admission Number Portal Sign-In
              </h2>
              <p className="text-[13px] text-white/80 leading-relaxed">
                Enter your permanent school registration number to access your academic records instantly.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 py-6 border-y border-white/10 my-4 text-[13px] text-white/90">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                search_check
              </span>
              <span>Matched Against Live School Roster</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                lock
              </span>
              <span>Encrypted Student Session Token</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
                credit_card
              </span>
              <span>Printed on ID Card &amp; Fee Receipts</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70">
            <span>{tenant?.subdomain_slug?.toUpperCase() || 'LCGVM'} Gateway · {tenant?.affiliation_board || 'CISCE'}</span>
            <span>v2.5.3</span>
          </div>
        </div>

        {/* Right Action Rail */}
        <div className="md:col-span-7 p-4 sm:p-6 md:p-10 flex flex-col justify-center flex-1">
          <div className="w-full flex items-center gap-2 mb-4">
            <button
              aria-label="Back"
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface flex-1">
              Admission Number
            </h1>
            <DarkModeToggle className="mr-1" />
            <span className="text-[10px] font-bold text-tertiary bg-tertiary/10 rounded-full px-2.5 py-1">
              ROSTER VERIFIED
            </span>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
            <div className="w-[64px] h-[64px] rounded-full bg-surface-container-lowest shadow-[0_8px_20px_rgba(28,42,200,0.12)] p-1.5 mb-3 border border-outline/10">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[28px]">badge</span>
              </div>
            </div>

            <h2 className="text-[22px] md:text-[24px] font-bold text-on-surface tracking-tight">
              Sign in with admission number
            </h2>
            <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed mt-1">
              The number issued by the school administration on your physical ID card or fee receipt.
            </p>
          </div>

          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline/10 p-5 flex flex-col gap-4">
            <span className="text-[12px] font-semibold text-on-surface">
              Admission Number / Registration ID
            </span>
            <label className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3.5 border border-transparent focus-within:border-primary/40 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">school</span>
              <input
                type="text"
                autoComplete="off"
                placeholder="E.G. 10211125"
                value={admission}
                onChange={(e) => {
                  setAdmission(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
                className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-bold text-on-surface tracking-[1px] placeholder:text-outline placeholder:font-normal placeholder:tracking-normal uppercase"
              />
            </label>

            {error && (
              <div className="bg-error-container rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-error-container text-[18px]">error</span>
                <p className="text-[12px] font-medium text-on-error-container">{error}</p>
              </div>
            )}

            <button
              onClick={submit}
              disabled={busy}
              className="w-full h-[50px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.3)] text-white text-[15px] font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {busy ? (
                'Checking roster...'
              ) : (
                <>
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>

          <div className="w-full bg-surface-container-low/70 rounded-2xl p-3.5 flex gap-3 mt-5 border border-outline/5">
            <span className="material-symbols-outlined text-primary text-[20px] flex-shrink-0 mt-0.5">info</span>
            <div className="flex flex-col gap-1">
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
                Verified against the live institutional database.
              </p>
              <span className="self-start text-[10px] text-[#1c2ac8] font-bold bg-primary-fixed rounded-full px-2.5 py-0.5">
                Admission numbers match automatically without spaces or dashes
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
      </main>

      {/* Institutional Public Footer */}
      <AuthFooter />
    </div>
  );
}
