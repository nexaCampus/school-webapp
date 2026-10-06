'use client';

// New-student registration: validates, merge-writes the Firestore record,
// caches the session, opens the portal. Phone lives in its own required
// Contact Number section — Google/email sign-ups never capture one.
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { normalizeAdmissionNumber, saveStudent } from '@/lib/firebase';
import { getSession, setSession } from '@/lib/session';
import { student as mockStudent } from '@/lib/data';

export const dynamic = 'force-dynamic';

const GENDERS = ['Male', 'Female', 'Other'];

/** Display/storage form is DD-MM-YYYY; the native picker speaks YYYY-MM-DD. */
function dobToISO(dob: string): string {
  const m = dob.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

function dobFromISO(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-on-surface">{label}</span>
      <span className="flex items-center gap-2 bg-surface-container-low rounded-[14px] px-3 py-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{icon}</span>
        {children}
      </span>
    </label>
  );
}

const inputCls =
  'flex-1 min-w-0 bg-transparent outline-none text-[14px] font-semibold text-on-surface placeholder:text-outline placeholder:font-normal';

function SectionHead({ title, required }: { title: string; required: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[14px] font-bold text-on-surface">{title}</h3>
      <span
        className={`text-[10px] font-bold rounded-full px-2 py-[3px] ${
          required ? 'text-primary bg-surface-container-high' : 'text-on-surface-variant bg-surface-container-high'
        }`}
      >
        {required ? 'Required' : 'Optional'}
      </span>
    </div>
  );
}

function OnboardingForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [admission, setAdmission] = useState('');
  const [admissionLocked, setAdmissionLocked] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [roll, setRoll] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [father, setFather] = useState('');
  const [mother, setMother] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalized = normalizeAdmissionNumber(params.get('admissionNumber') ?? '');
    if (normalized) {
      setAdmission(normalized);
      setAdmissionLocked(true);
    }
    const digits = (params.get('phone') ?? '').replace(/\D/g, '').slice(-10);
    if (digits) setPhone(digits);
    const pending = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('pendingProfile') || 'null') as {
          name?: string;
          email?: string;
        } | null;
      } catch {
        return null;
      }
    })();
    const session = getSession();
    if (params.get('name')) setName(params.get('name') ?? '');
    else if (pending?.name) setName(pending.name);
    if (pending?.email) setGuardianEmail(pending.email);
    else if (session?.email) setGuardianEmail(session.email);
    try {
      sessionStorage.removeItem('pendingProfile');
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit() {
    const adm = normalizeAdmissionNumber(admission);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (adm.length < 6) return setError('Enter the admission number from the ID card or fee receipt');
    if (!name.trim()) return setError("Enter the student's full name");
    if (!grade) return setError('Enter the class / grade (e.g. 12)');
    if (!section) return setError('Enter the section (e.g. E)');
    if (!gender) return setError("Select the student's gender");
    if (cleanPhone.length !== 10) return setError('Enter a valid 10-digit contact number');
    setError(null);
    setBusy(true);
    try {
      const saved = await saveStudent({
        ...mockStudent,
        id: adm,
        name: name.trim(),
        displayName: name.trim(),
        grade,
        section,
        rollNo: roll.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || mockStudent.rollNo,
        dob: dob.slice(0, 10) || mockStudent.dob,
        gender,
        contactPhone: `+91 ${cleanPhone}`,
        emergencyPhone: `+91 ${cleanPhone}`,
        fatherName: father.trim().slice(0, 60) || mockStudent.fatherName,
        motherName: mother.trim().slice(0, 60) || mockStudent.motherName,
        guardianEmail: guardianEmail.trim().slice(0, 80) || mockStudent.guardianEmail,
        residentialAddress: address.trim().slice(0, 140) || mockStudent.residentialAddress,
        qrToken: `STU-LCGVM-${adm}-2026`,
      });
      const prev = getSession() ?? {
        name: saved.name,
        provider: 'admission' as const,
        isNewAccount: true,
      };
      setSession({ ...prev, name: saved.name, student: saved, isNewAccount: false });
      router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the profile. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          New student registration
        </h1>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-md">
        Tell us about the student
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant leading-[18px] mt-1">
        This creates the school record. Details marked required cannot be skipped.
      </p>

      <section className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-space-md mt-space-md">
        <SectionHead title="Student details" required />
        <Field label="Admission Number" icon="badge">
          <input
            type="text"
            placeholder="E.G. 10211125"
            value={admission}
            readOnly={admissionLocked}
            onChange={(e) => {
              setAdmission(e.target.value.toUpperCase());
              setError(null);
            }}
            className={`${inputCls} tracking-[1px] placeholder:tracking-normal`}
          />
          {admissionLocked && (
            <span className="material-symbols-outlined text-outline text-[16px]">lock</span>
          )}
        </Field>
        <Field label="Full Name" icon="person">
          <input
            type="text"
            autoComplete="name"
            placeholder="As printed on the ID card"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className={inputCls}
          />
        </Field>
        <div className="flex gap-[10px]">
          <div className="flex-1 min-w-0">
            <Field label="Class" icon="school">
              <input
                type="text"
                inputMode="numeric"
                placeholder="12"
                value={grade}
                onChange={(e) => {
                  setGrade(e.target.value.replace(/\D/g, '').slice(0, 2));
                  setError(null);
                }}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex-1 min-w-0">
            <Field label="Section" icon="tag">
              <input
                type="text"
                placeholder="E"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2));
                  setError(null);
                }}
                className={`${inputCls} uppercase`}
              />
            </Field>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <div className="flex-1 min-w-0">
            <Field label="Roll No. (optional)" icon="tag">
              <input
                type="text"
                placeholder="20"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="flex-1 min-w-0">
            <Field label="Birth Date (optional)" icon="cake">
              <input
                type="date"
                aria-label="Birth date"
                value={dobToISO(dob)}
                max={todayISO()}
                onChange={(e) => setDob(dobFromISO(e.target.value))}
                className={`${inputCls} min-h-[20px]`}
              />
            </Field>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold text-on-surface">Gender</span>
          <div className="flex gap-2">
            {GENDERS.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => {
                  setGender(g);
                  setError(null);
                }}
                className={`flex-1 rounded-full py-[9px] text-[12px] font-bold transition-all ${
                  gender === g
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-space-md mt-space-md">
        <SectionHead title="Guardian" required={false} />
        <Field label="Father's Name (optional)" icon="family_restroom">
          <input
            type="text"
            placeholder="Full name"
            value={father}
            onChange={(e) => setFather(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Mother's Name (optional)" icon="family_restroom">
          <input
            type="text"
            placeholder="Full name"
            value={mother}
            onChange={(e) => setMother(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Guardian Email (optional)" icon="mail">
          <input
            type="email"
            placeholder="name@example.com"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Home Address (optional)" icon="home">
          <input
            type="text"
            placeholder="Street, area, city - PIN"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputCls}
          />
        </Field>
      </section>

      <section className="w-full bg-surface-container-lowest/95 rounded-[20px] shadow-[0_4px_16px_rgba(28,42,200,0.08)] p-4 flex flex-col gap-space-md mt-space-md">
        <SectionHead title="Contact Number" required />
          <Field label="Student / Guardian Mobile" icon="call">
          <>
            <span className="text-[13px] font-bold text-on-surface">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(null);
              }}
              className={`${inputCls} tracking-[1px] placeholder:tracking-normal`}
            />
          </>
        </Field>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-[15px]">
          Used for school SMS alerts and as the account contact.
        </p>
      </section>

      {error && (
        <div className="w-full bg-error-container rounded-[10px] px-3 py-2 flex items-center gap-2 mt-space-md">
          <span className="material-symbols-outlined text-on-error-container text-[16px]">error</span>
          <p className="text-[12px] font-medium text-on-error-container">{error}</p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="w-full h-[52px] rounded-full bg-gradient-to-r from-primary to-primary-container shadow-[0_10px_24px_rgba(28,42,200,0.35)] text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform disabled:opacity-60 mt-space-md"
      >
        {busy ? (
          'Creating record...'
        ) : (
          <>
            Save &amp; Enter Portal
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </>
        )}
      </button>
      <div className="min-h-4" />
    </>
  );
}

export default function OnboardingPage() {
  return (
    <div className="app-column relative min-h-screen bg-surface flex flex-col w-full px-margin py-space-sm">
      <Suspense>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}
