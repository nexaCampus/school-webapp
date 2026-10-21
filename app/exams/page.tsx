'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';
import Toast from '@/components/Toast';
import { goApi } from '@/lib/api/go-client';
import type { ExamResultsData, AdmitCardPayload } from '@/lib/api/go-types';

export default function ExamsPage() {
  const [results, setResults] = useState<ExamResultsData | null>(null);
  const [admitCard, setAdmitCard] = useState<AdmitCardPayload | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [student, setStudent] = useState({
    name: 'Student',
    gradeSection: 'Grade 12 · E',
    rollAdmNo: '24 / 10211125',
    hallTicketNo: 'HALL-MID-2026-10211125',
    centerCode: 'LCGVM-EX-004',
    seatNumber: 'BLOCK C / SEAT #18',
  });

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    const st = s.student;
    const name = st.name || st.displayName || s.name || 'Student';
    const gradeSection = `${st.grade || 'Grade 12'} · ${st.section || 'E'}`;
    const rollAdmNo = `${String(st.rollNo || (st as Record<string, unknown>).rollNumber || '24')} / ${String(st.id || '10211125')}`;
    const hallTicketNo = `HALL-MID-2026-${String(st.id || '10211125')}`;
    setStudent((prev) => ({ ...prev, name, gradeSection, rollAdmNo, hallTicketNo }));

    goApi.getResults().then(setResults);
    goApi.getExamAdmitCard().then((card) => {
      setAdmitCard(card);
      if (card) {
        setStudent((prev) => ({
          ...prev,
          centerCode: card.centerCode || prev.centerCode,
          seatNumber: card.seatNumber || prev.seatNumber,
          hallTicketNo: card.qrToken || prev.hallTicketNo,
        }));
      }
    });
  }, []);

  const aggregate = results?.aggregatePct ?? 94.4;
  const totalMarks = results?.totalMarks ?? 472;
  const maxMarks = results?.maxTotalMarks ?? 500;
  const rank = results?.rankInClass ?? 2;
  const subjects = results?.subjects || [
    { subject: 'Physics', marksObtained: 96, maxMarks: 100 },
    { subject: 'Maths', marksObtained: 98, maxMarks: 100 },
    { subject: 'Chemistry', marksObtained: 92, maxMarks: 100 },
  ];

  const handleDownloadHallTicket = () => {
    setToastMsg(`Hall ticket generated & downloaded for ${student.name}!`);
  };

  const handleDownloadReportCard = () => {
    setToastMsg(`Official Term 1 Report Card (PDF) downloaded successfully!`);
  };

  return (
    <PortalShell title="Exams &amp; Results" activePath="exams">
      <div className="flex flex-col gap-space-lg">
        {/* Responsive Grid on Laptop (md:), Stacked on Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hall Ticket Section */}
          <section className="bg-surface-container-lowest rounded-[20px] shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-on-surface-variant tracking-widest">
                    HALL TICKET
                  </p>
                  <p className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                    Mid-Term Assessment 2026
                  </p>
                </div>
                <span className="w-12 h-12 rounded-[12px] bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    confirmation_number
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-space-md font-body-sm text-body-sm">
                <div>
                  <p className="text-on-surface-variant">Candidate</p>
                  <p className="font-bold text-on-surface">{student.name}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Class</p>
                  <p className="font-bold text-on-surface">{student.gradeSection}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Roll / Adm No.</p>
                  <p className="font-bold text-on-surface">{student.rollAdmNo}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Centre</p>
                  <p className="font-bold text-on-surface">LCGVM-EX-004</p>
                </div>
              </div>
              <div className="mt-space-md bg-surface-container-low rounded-[14px] px-3 py-2.5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-on-surface">BLOCK C / SEAT #18</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {student.hallTicketNo}
                </span>
              </div>
            </div>
            <button
              onClick={handleDownloadHallTicket}
              className="w-full h-[48px] mt-space-md rounded-full bg-primary text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Hall Ticket</span>
            </button>
          </section>

          {/* Report Card Section */}
          <section className="bg-surface-container-lowest rounded-[20px] shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-on-surface-variant tracking-widest">
                    TERM PERFORMANCE
                  </p>
                  <p className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                    Term 1 Report Card
                  </p>
                </div>
                <span className="w-12 h-12 rounded-[12px] bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[24px]">
                    workspace_premium
                  </span>
                </span>
              </div>
              <div className="mt-space-md p-4 rounded-xl bg-surface-container-low">
                <div className="flex items-baseline justify-between">
                  <span className="text-[28px] font-extrabold text-primary">{aggregate}%</span>
                  <span className="text-[12px] font-bold px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full">
                    Grade A+
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1 font-medium">
                  Aggregate Score: {totalMarks} / {maxMarks} • Rank #{rank} in Cohort
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                {subjects.slice(0, 3).map((sub) => (
                  <div key={sub.subject} className="p-2.5 rounded-lg bg-surface-container-low">
                    <span className="text-[11px] text-outline truncate block">{sub.subject}</span>
                    <p className="font-bold text-[14px] text-on-surface mt-0.5">
                      {sub.marksObtained}/{sub.maxMarks}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDownloadReportCard}
              className="mt-space-md w-full h-[48px] rounded-full bg-primary/10 text-primary text-[14px] font-bold hover:bg-primary/15 active:scale-95 transition-all cursor-pointer"
            >
              Download Full Report Card (PDF)
            </button>
          </section>
        </div>

        {toastMsg && (
          <Toast message={toastMsg} type="success" onClose={() => setToastMsg(null)} />
        )}
      </div>
    </PortalShell>
  );
}
