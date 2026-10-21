'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function HelpdeskPage() {
  const [sent, setSent] = useState(false);
  const [chars, setChars] = useState(142);
  const [attachment, setAttachment] = useState(true);
  const [student, setStudent] = useState({
    name: 'Student',
    gradeSection: 'Class 12-E',
    section: 'Sec E',
    rollNo: '24',
    id: '10211125',
    initials: 'ST',
  });

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    const st = s.student;
    const name = st.name || st.displayName || s.name || 'Student';
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0].toUpperCase())
      .join('') || 'ST';
    setStudent({
      name,
      gradeSection: `Class ${st.grade || '12'}-${st.section || 'E'}`,
      section: `Sec ${st.section || 'E'}`,
      rollNo: String(st.rollNo || (st as Record<string, unknown>).rollNumber || '24'),
      id: String(st.id || (st as Record<string, unknown>).admissionNumber || '10211125'),
      initials,
    });
  }, []);

  return (
    <PortalShell title="Parent Desk &amp; Help" activePath="helpdesk">
      <div className="flex flex-col gap-space-md">
        {/* Student Context ID Card */}
        <div className="relative w-full bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_8px_24px_-6px_rgba(59,73,223,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="font-headline-sm text-headline-sm text-primary">{student.initials}</span>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-lg text-label-lg text-on-surface truncate">{student.name}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                  {student.section}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {student.gradeSection} • Roll No. {student.rollNo} • ID: {student.id}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed/30 px-2 py-1 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              Verified Active
            </span>
          </div>
        </div>

        {/* Responsive Layout on Laptop (lg:grid lg:grid-cols-12): Form Left (7), SLA & History Right (5) */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 flex flex-col gap-space-md">
          {/* Main Form Column (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Form */}
            <form
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h2 className="font-headline-sm text-headline-sm text-on-surface">New Inquiry / Ticket</h2>

              {/* Recipient Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                  <span>Recipient / Department</span>
                  <span className="text-error">*</span>
                </label>
                <div className="relative">
                <select
                  aria-label="Staff role"
                  className="w-full h-12 pl-11 pr-10 appearance-none bg-surface-container-low text-on-surface font-body-md text-body-md rounded-DEFAULT focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  defaultValue="teacher"
                >
                    <option value="teacher">Class Teacher (Grade 12-E • Mrs. S. Roy)</option>
                    <option value="principal">Principal Desk (Dr. M. Banerjee)</option>
                    <option value="exams">Examination &amp; Report Card Dept</option>
                    <option value="accounts">Accounts &amp; Term Fees Desk</option>
                    <option value="transport">Transport &amp; Facilities Division</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px] pointer-events-none">
                    school
                  </span>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                  <span>Subject Heading</span>
                  <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-DEFAULT placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="e.g. Request for Medical Leave"
                    required
                    type="text"
                    defaultValue="Doubt regarding Physics Practical Lab Record format"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">
                    title
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                    <span>Detailed Message</span>
                    <span className="text-error">*</span>
                  </label>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {chars} / 500
                  </span>
                </div>
                <textarea
                  className="w-full bg-surface-container-low rounded-DEFAULT p-3 resize-none font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={500}
                  onInput={(e) => setChars(e.currentTarget.value.length)}
                  placeholder="Provide context or specific questions..."
                  rows={4}
                  defaultValue="Dear Ma'am, for Experiment #4 (Optical Bench), should we attach the handwritten ray diagrams on plain interleaved sheets or directly on the ruled page?"
                />
              </div>

              {/* Attachment */}
              {attachment && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">attach_file</span>
                    <span className="text-[13px] font-semibold text-on-surface">Lab_Draft_Exp4.jpg</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachment(false)}
                    className="text-outline hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-white font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Send to Faculty Desk</span>
              </button>

              {sent && (
                <div className="p-3 rounded-xl bg-tertiary/10 text-tertiary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="text-[13px] font-bold">
                    Message sent successfully! Expected response within 24 hours.
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: SLA & History (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* SLA Guarantee Banner */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-space-md flex items-start gap-space-sm shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Official Communication Channel
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  Direct encrypted line to Principal, Grade Teachers &amp; Administrative offices. Standard
                  response SLA is under 24 school hours.
                </p>
              </div>
            </div>

            {/* Recent Thread Status */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Recent Threads</span>
                <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                  1 Active
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    Bus Route No. 14 Timing
                  </span>
                  <span className="text-[11px] font-bold text-tertiary">Resolved</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                  "Pickup at Ultadanga Junction has been rescheduled to 7:35 AM."
                </p>
                <span className="text-[11px] text-outline">Closed yesterday at 3:45 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
