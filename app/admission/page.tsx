'use client';

// Admission number via Firebase roster. Unknown numbers route to onboarding
// (locked) instead of dead-ending — mirrors AdmissionLoginViewModel.
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStudent, normalizeAdmissionNumber } from '@/lib/firebase';
import { setSession } from '@/lib/session';

export default function AdmissionPage() {
  const router = useRouter();
  const [admission, setAdmission] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const normalized = normalizeAdmissionNumber(admission);
    if (normalized.length < 6) return setError('Enter the admission number from your ID card');
    setError(null);
    setBusy(true);
    try {
      const profile = await getStudent(normalized);
      if (profile) {
        setSession({
          provider: 'admission',
          isNewAccount: false,
          name: profile.name,
          student: profile,
        });
        router.replace('/home');
      } else {
        router.push(`/onboarding?admissionNumber=${encodeURIComponent(normalized)}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not verify that admission number');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-column relative min-h-screen bg-surface flex flex-col items-center w-full px-margin py-space-sm">
      <div className="w-full flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Admission number
        </h1>
      </div>

      <div className="w-[68px] h-[68px] rounded-full bg-surface-container-lowest shadow-[0_8px_20px_rgba(28,42,200,0.12)] p-1.5 mt-space-md">
        <div className="w-full h-full rounded-full bg-gradient-to-b from-primary to-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[28px]">badge</span>
        </div>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-on-surface text-center mt-space-md">
        Sign in with admission number
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-[18px] mt-1">
        The number issued by the school on your ID card or fee receipt.
      </p>

      <div className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-[14px] mt-space-lg">
        <span className="text-[12px] font-semibold text-on-surface">
          Admission Number / Registration ID
        </span>
        <label className="flex items-center gap-[10px] bg-surface-container-low rounded-[14px] px-3.5 py-3.5">
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
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-semibold text-on-surface tracking-[1px] placeholder:text-outline placeholder:font-normal placeholder:tracking-normal uppercase"
          />
        </label>
        {error && (
          <div className="bg-error-container rounded-[10px] px-3 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-on-error-container text-[16px]">error</span>
            <p className="text-[12px] font-medium text-on-error-container">{error}</p>
          </div>
        )}
        <button
          onClick={submit}
          disabled={busy}
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.35)] text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          {busy ? (
            'Checking roster...'
          ) : (
            <>
              Continue
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>

      <div className="w-full bg-surface-container-low/70 rounded-[14px] p-3 flex gap-[10px] mt-space-md">
        <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">info</span>
        <div className="flex flex-col gap-1">
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-[15px]">
            Verified against the live Firebase roster.
          </p>
          <span className="self-start text-[9px] text-primary bg-primary-fixed rounded-full px-2 py-[3px]">
            Admission numbers are matched without spaces or dashes
          </span>
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
}
