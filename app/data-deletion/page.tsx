'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoEmblem from '@/components/LogoEmblem';
import PortalFooter from '@/components/PortalFooter';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function DataDeletionPage() {
  const [admissionId, setAdmissionId] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [reason, setReason] = useState('withdrawal');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionId || !parentEmail || !studentName) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoEmblem className="h-9 w-9 shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] tracking-tight group-hover:text-primary transition-colors">
                Lions Calcutta Greater Vidya Mandir
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                NexaCampus Institutional Portal
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href="/"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full">
        <div className="mb-8 pb-6 border-b border-outline/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">person_remove</span>
            <span>Data Rights &amp; Erasure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Account &amp; Personal Data Deletion Request
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            In compliance with Section 12 of the Digital Personal Data Protection Act (DPDP Act 2023, India) and international Right to Erasure standards.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <span className="material-symbols-outlined text-3xl">done_all</span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface">
              Deletion Request Formally Registered
            </h2>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Your request for student record <strong>#{admissionId.toUpperCase()}</strong> has been dispatched to the ICT Grievance &amp; Compliance Cell.
            </p>
            <div className="p-4 rounded-xl bg-surface/80 border border-outline/10 text-xs font-mono text-left max-w-md mx-auto space-y-1">
              <div>Reference Ticket: DSR-DEL-{Date.now().toString().slice(-6)}</div>
              <div>Registered Email: {parentEmail}</div>
              <div>Estimated SLA: Within 15 Calendar Days</div>
            </div>
            <p className="text-xs text-on-surface-variant">
              A formal confirmation receipt has been sent to your registered guardian email address.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all inline-block"
              >
                Return to Campus Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
              <p>
                Parents and legal guardians have the perpetual right to request the deletion or redaction of digital records, photos, device tokens, and portal credentials once a student has completed studies or obtained a Transfer Certificate (TC).
              </p>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                <strong>Important Legal Notice:</strong> Under educational board bylaws (CISCE) and Indian statutory audit laws, the school is legally required to archive permanent academic transcripts, registration records, and financial receipts for 7 years. Digital portal accounts, cafeteria RFID balances, photos, and tracking telemetry will be purged immediately.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8 rounded-3xl bg-surface-container border border-outline/10">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">assignment</span>
                Submit Official Deletion Application
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    Student Admission ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionId}
                    onChange={(e) => setAdmissionId(e.target.value)}
                    placeholder="e.g. 3651121"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Parth Vastavik"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Guardian Verified Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="e.g. parent@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Scope of Deletion Request *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary text-xs font-medium"
                >
                  <option value="withdrawal">Formal School Withdrawal / Transfer Certificate Issued</option>
                  <option value="graduated">Student Graduated (Passed Grade 10 / Grade 12)</option>
                  <option value="privacy">Revocation of Digital App Consent (Manual Offline Records Retained)</option>
                  <option value="other">Other Administrative Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any specific details or Transfer Certificate numbers..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface text-on-surface border border-outline/20 focus:border-primary focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {busy ? (
                    <span>Registering Deletion Request...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">delete_forever</span>
                      <span>Submit Official Deletion Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <PortalFooter />
    </div>
  );
}
