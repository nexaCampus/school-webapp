'use client';

import React, { useState } from 'react';

interface ApplicationData {
  // Step 1: Candidate
  studentName: string;
  dob: string;
  gender: string;
  gradeApplying: string;
  bloodGroup: string;
  motherTongue: string;

  // Step 2: Parent KYC
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  primaryPhone: string;
  primaryEmail: string;
  residentialAddress: string;

  // Step 3: Academic & Documents
  previousSchool: string;
  previousGradePercent: string;
  hasBirthCert: boolean;
  hasTransferCert: boolean;
  hasAadhaarCard: boolean;

  // Step 4: Declaration
  agreedToBylaws: boolean;
}

const INITIAL_DATA: ApplicationData = {
  studentName: '',
  dob: '',
  gender: 'Female',
  gradeApplying: 'Class I',
  bloodGroup: 'B+',
  motherTongue: 'Bengali',
  fatherName: '',
  fatherOccupation: 'Senior Engineer',
  motherName: '',
  motherOccupation: 'Professor',
  primaryPhone: '',
  primaryEmail: '',
  residentialAddress: 'Kolkata, West Bengal',
  previousSchool: 'St. Xavier’s Pre-Primary Section',
  previousGradePercent: '94%',
  hasBirthCert: true,
  hasTransferCert: true,
  hasAadhaarCard: true,
  agreedToBylaws: false,
};

export default function AdmissionWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>(INITIAL_DATA);
  const [generatedRefId, setGeneratedRefId] = useState<string | null>(null);

  // Status Tracker State
  const [trackSearchId, setTrackSearchId] = useState('LCGVM-2026-ADM-0842');
  const [trackedStatus, setTrackedStatus] = useState<{
    id: string;
    student: string;
    grade: string;
    stage: number;
    statusText: string;
    lastUpdated: string;
  } | null>(null);

  const steps = [
    { num: 1, title: 'Applicant Details', desc: 'Candidate credentials & grade choice' },
    { num: 2, title: 'Parent KYC', desc: 'Guardian identity & contact channels' },
    { num: 3, title: 'Academic Dockets', desc: 'Prior school transcripts & proofs' },
    { num: 4, title: 'Attestation & Fee', desc: 'Formal declaration & slip generation' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate realistic reference ID
      const newRef = `LCGVM-2026-ADM-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedRefId(newRef);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackSearchId.trim()) return;
    setTrackedStatus({
      id: trackSearchId.toUpperCase(),
      student: 'Aryaveer Roy',
      grade: 'Class VI',
      stage: 3,
      statusText: 'Verification Approved • Interaction Slot Allotted (24 Oct 2026, 10:30 AM)',
      lastUpdated: '12 Oct 2026 at 04:30 PM',
    });
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Top Banner */}
      <div className="bg-oxford text-white p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-amber-400 font-mono text-xs uppercase font-bold tracking-widest">
              Session 2026-27 Registrations Open
            </div>
            <h2 className="font-serif font-bold text-2xl text-white mt-1">
              Online Admission Portal & Verification Center
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Strictly non-discriminatory admission process as mandated by CISCE & Right to Education (RTE) guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold rounded border border-amber-500/40">
              Form 1A • Accredited
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Desktop 4-step wizard with persistent left-hand progress tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Progress Sidebar (Desktop) */}
        <div className="lg:col-span-4 bg-slate-50 p-6 border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
              Registration Progress
            </div>

            <div className="space-y-4">
              {steps.map((st) => {
                const isActive = currentStep === st.num;
                const isDone = currentStep > st.num || generatedRefId !== null;
                return (
                  <div
                    key={st.num}
                    onClick={() => !generatedRefId && setCurrentStep(st.num)}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white shadow-xs border border-slate-300'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-700 text-white'
                          : isActive
                          ? 'bg-oxford text-amber-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone ? '✓' : st.num}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{st.title}</div>
                      <div className="text-[11px] text-slate-500">{st.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Helpline Box */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-oxford">Admission Help Desk:</div>
            <div className="font-mono text-slate-500">+91 (033) 2442-8000 (Ext. 204)</div>
            <div className="text-[11px] text-slate-400">Mon - Sat: 09:00 AM to 03:30 PM</div>
          </div>
        </div>

        {/* Right Interactive Form Area */}
        <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
          {generatedRefId ? (
            /* Submission Success State */
            <div className="space-y-6 text-center my-auto py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
                ✓
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800">
                  Dockets Submitted Successfully
                </span>
                <h3 className="font-serif font-bold text-2xl text-oxford mt-1">
                  Application Ref: {generatedRefId}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2">
                  Your formal registration docket has been recorded into the Admissions Registry. An SMS acknowledgement and verification slip have been dispatched to {formData.primaryPhone || '+91 98301-XXXXX'}.
                </p>
              </div>

              <div className="bg-slate-50 max-w-md mx-auto p-4 rounded-lg border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-oxford">{formData.studentName || 'Devina Sen'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Class Grade:</span>
                  <span className="font-bold">{formData.gradeApplying}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Verification:</span>
                  <span className="text-emerald-700 font-bold">Slot Pending (24h)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setGeneratedRefId(null);
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Submit Another Form
                </button>
                <button
                  onClick={() => alert(`Simulated PDF Slip: Generated for ${generatedRefId}`)}
                  className="px-5 py-2 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md shadow-sm"
                >
                  Download Formal Slip (PDF)
                </button>
              </div>
            </div>
          ) : (
            /* Step Form Wizard */
            <div className="space-y-6">
              {/* Step 1: Candidate Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-oxford pb-2 border-b border-slate-200">
                    Step 1: Candidate Demographic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name of Candidate *
                      </label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="e.g. Sagnik Banerjee"
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-[#c4c7e0] mb-1">
                        Grade Applying For *
                      </label>
                      <select
                        aria-label="Grade applying for"
                        value={formData.gradeApplying}
                        onChange={(e) => setFormData({ ...formData, gradeApplying: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df]"
                      >
                        <option>Nursery</option>
                        <option>Lower KG</option>
                        <option>Upper KG</option>
                        <option>Class I</option>
                        <option>Class V</option>
                        <option>Class IX (ICSE)</option>
                        <option>Class XI (Science)</option>
                        <option>Class XI (Commerce)</option>
                        <option>Class XI (Humanities)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-[#c4c7e0] mb-1">
                        Date of Birth (as per Municipal Cert) *
                      </label>
                      <input
                        type="date"
                        aria-label="Date of birth (as per Municipal Certificate)"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-[#c4c7e0] mb-1">
                        Blood Group & Rh Factor
                      </label>
                      <select
                        aria-label="Blood group"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-[#101119] border border-slate-300 dark:border-[#2b2f48] rounded focus:bg-white focus:ring-1 focus:ring-oxford dark:focus:ring-[#3b49df]"
                      >
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Parent KYC */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-oxford pb-2 border-b border-slate-200">
                    Step 2: Parent / Legal Guardian KYC
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Father’s / Guardian’s Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        placeholder="e.g. Dr. Subir Banerjee"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mother’s Name *
                      </label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        placeholder="e.g. Mrs. Mala Banerjee"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Primary SMS Notification Mobile *
                      </label>
                      <input
                        type="tel"
                        value={formData.primaryPhone}
                        onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                        placeholder="+91 98300 00000"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Parent Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.primaryEmail}
                        onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Residential Postal Address in Kolkata / Suburbs *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.residentialAddress}
                        onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Academic Records & Document Checklist */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-oxford pb-2 border-b border-slate-200">
                    Step 3: Academic History & Attested Document Dockets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Last Institution Attended
                      </label>
                      <input
                        type="text"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Previous Term Marks / Aggregate Score %
                      </label>
                      <input
                        type="text"
                        value={formData.previousGradePercent}
                        onChange={(e) => setFormData({ ...formData, previousGradePercent: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <div className="font-bold text-xs text-slate-800">
                      Mandatory Document Upload Checklist (Self-Attested Scans):
                    </div>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasBirthCert}
                          onChange={(e) => setFormData({ ...formData, hasBirthCert: e.target.checked })}
                          className="rounded text-oxford"
                        />
                        <span>Municipal Birth Certificate (Form 5 / 9) Attached (PDF/JPG)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasTransferCert}
                          onChange={(e) => setFormData({ ...formData, hasTransferCert: e.target.checked })}
                          className="rounded text-oxford"
                        />
                        <span>Transfer Certificate (TC) & Previous Year Progress Report</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasAadhaarCard}
                          onChange={(e) => setFormData({ ...formData, hasAadhaarCard: e.target.checked })}
                          className="rounded text-oxford"
                        />
                        <span>Candidate & Parent Aadhaar Card / Passport KYC Scans</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Formal Declaration & Fee Slip */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-oxford pb-2 border-b border-slate-200">
                    Step 4: Institutional Declaration & Registration Fee Slip
                  </h3>

                  <div className="bg-parchment p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <div className="font-bold text-oxford uppercase tracking-wide">
                      Solemn Declaration by Parent / Legal Guardian:
                    </div>
                    <p>
                      I hereby solemnly certify that the information entered in this application is accurate and verified against municipal registers. I undertake to abide by the disciplinary charter, attendance thresholds (75% minimum), and fee schedules promulgated by Lions Calcutta Greater Vidyamandir.
                    </p>
                    <label className="flex items-center gap-2 pt-2 cursor-pointer font-bold text-oxford">
                      <input
                        type="checkbox"
                        checked={formData.agreedToBylaws}
                        onChange={(e) => setFormData({ ...formData, agreedToBylaws: e.target.checked })}
                        className="rounded text-oxford"
                      />
                      <span>I agree to the Institutional Charter and Regulations.</span>
                    </label>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block">Registration Processing Fee:</span>
                      <span className="font-serif font-bold text-base text-oxford">₹1,200.00</span>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-mono text-[11px] font-bold">
                      Payable via NetBanking / UPI / Card
                    </span>
                  </div>
                </div>
              )}

              {/* Stepper Navigation Buttons */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 text-xs font-semibold rounded-md border border-slate-300 ${
                    currentStep === 1
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>{currentStep === 4 ? 'Confirm & Generate Slip' : 'Save & Continue →'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* LIVE APPLICATION STATUS TRACKER (SEARCH BY APPLICATION ID)    */}
      {/* ============================================================ */}
      <div id="track" className="p-6 md:p-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy">
              Real-Time Verification Engine
            </span>
            <h3 className="font-serif font-bold text-xl text-oxford mt-0.5">
              Track Registered Admission Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your Application ID issued at the time of online or offline submission.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <input
              type="text"
              value={trackSearchId}
              onChange={(e) => setTrackSearchId(e.target.value)}
              placeholder="e.g. LCGVM-2026-ADM-0842"
              className="flex-1 px-4 py-2 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-oxford text-slate-900 uppercase font-bold"
            />
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-oxford hover:bg-slate-800 rounded-md shadow-xs transition-colors"
            >
              Check Status
            </button>
          </form>

          {trackedStatus && (
            <div className="mt-5 bg-white p-5 rounded-lg border border-slate-200 shadow-xs animate-in fade-in space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Docket ID: </span>
                  <span className="font-mono font-bold text-oxford">{trackedStatus.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Candidate: </span>
                  <span className="font-bold text-slate-800">
                    {trackedStatus.student} ({trackedStatus.grade})
                  </span>
                </div>
              </div>

              {/* Multi-Stage Visual Stepper */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs">
                    ✓
                  </div>
                  <span className="text-emerald-700">Received</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs">
                    ✓
                  </div>
                  <span className="text-emerald-700">Verified</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-oxford text-amber-300 flex items-center justify-center mx-auto text-xs animate-pulse">
                    3
                  </div>
                  <span className="text-oxford">Interview</span>
                </div>
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-xs">
                    4
                  </div>
                  <span className="text-slate-400">Merit List</span>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-900 p-3 rounded text-xs border border-emerald-200 font-medium">
                {trackedStatus.statusText}
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                Last System Audit: {trackedStatus.lastUpdated}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
