'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

export default function ExamsPage() {
  const [student, setStudent] = useState({
    name: 'Student',
    gradeSection: 'Grade 12 · E',
    rollAdmNo: '24 / 10211125',
    hallTicketNo: 'HALL-MID-2026-10211125',
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
    setStudent({ name, gradeSection, rollAdmNo, hallTicketNo });
  }, []);

  return (
    <PortalShell title="Exams & Results" activePath="exams">
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
            <button className="w-full h-[48px] mt-space-md rounded-full bg-primary text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all">
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
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    workspace_premium
                  </span>
                </span>
              </div>
              <div className="mt-space-md p-4 rounded-xl bg-surface-container-low">
                <div className="flex items-baseline justify-between">
                  <span className="text-[28px] font-extrabold text-primary">94.4%</span>
                  <span className="text-[12px] font-bold px-2.5 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full">
                    Grade A+
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant mt-1 font-medium">
                  Aggregate Score: 472 / 500 • Rank #2 in Cohort
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="text-[11px] text-outline">Physics</span>
                  <p className="font-bold text-[14px] text-on-surface">96/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="text-[11px] text-outline">Maths</span>
                  <p className="font-bold text-[14px] text-on-surface">98/100</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-low">
                  <span className="text-[11px] text-outline">Chemistry</span>
                  <p className="font-bold text-[14px] text-on-surface">91/100</p>
                </div>
              </div>
            </div>
            <button className="mt-space-md w-full h-[48px] rounded-full bg-primary/10 text-primary text-[14px] font-bold hover:bg-primary/15 transition-all">
              Download Full Report Card (PDF)
            </button>
          </section>
        </div>
      </div>
    </PortalShell>
  );
}
