'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import PortalShell from '@/components/PortalShell';

interface TeacherSlot {
  id: string;
  name: string;
  role: string;
  cabin: string;
  subject: string;
  avatarColor: string;
  slots: { time: string; status: 'available' | 'booked' | 'mine' }[];
}

const TEACHERS: TeacherSlot[] = [
  {
    id: 't1',
    name: 'Mrs. S. Roy',
    role: 'Mathematics & Class Incharge',
    cabin: 'Cabin 402 · Block B',
    subject: 'Maths',
    avatarColor: 'bg-primary text-white',
    slots: [
      { time: '09:00 AM', status: 'available' },
      { time: '09:15 AM', status: 'mine' },
      { time: '09:30 AM', status: 'available' },
      { time: '09:45 AM', status: 'booked' },
    ],
  },
  {
    id: 't2',
    name: 'Dr. Aris Thorne',
    role: 'Senior Physics Faculty',
    cabin: 'Cabin 304 · Block B',
    subject: 'Physics',
    avatarColor: 'bg-tertiary text-on-tertiary',
    slots: [
      { time: '10:00 AM', status: 'available' },
      { time: '10:15 AM', status: 'booked' },
      { time: '10:30 AM', status: 'available' },
    ],
  },
  {
    id: 't3',
    name: 'Mr. Vikram Mehta',
    role: 'Computer Science & AI Mentor',
    cabin: 'Tech Block Lab 2',
    subject: 'CompSci',
    avatarColor: 'bg-secondary text-white',
    slots: [
      { time: '11:00 AM', status: 'available' },
      { time: '11:15 AM', status: 'available' },
      { time: '11:30 AM', status: 'booked' },
    ],
  },
  {
    id: 't4',
    name: 'Mrs. Ananya Sen',
    role: 'English Literature & Soft Skills',
    cabin: 'Cabin 205 · Block A',
    subject: 'English',
    avatarColor: 'bg-[#5b3fb5] text-white',
    slots: [
      { time: '11:45 AM', status: 'available' },
      { time: '12:00 PM', status: 'available' },
    ],
  },
];

export default function PtmPage() {
  const [teachers, setTeachers] = useState(TEACHERS);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    const s = getSession();
    if (!s?.student) {
      window.location.replace('/chooser');
      return;
    }
    const name = s.student.displayName || s.student.name || s.name;
    if (name) {
      setStudentName(name.split(' ')[0]);
    }
  }, []);

  const handleBook = (teacherName: string, time: string) => {
    setBookingSuccess(`Successfully booked consultation with ${teacherName} at ${time}. Reminder added to your diary.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <PortalShell title="Parent Teacher Meetings" activePath="ptm">
      <div className="flex flex-col w-full relative gap-space-md">
        {/* Ambient Backdrops */}
        <div className="absolute -top-10 -left-12 w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-72 -right-16 w-72 h-72 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"></div>

        {/* Confirmed Slot Alert Banner */}
        <div className="bg-gradient-to-r from-tertiary/15 via-tertiary/10 to-primary/10 border border-tertiary/25 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center flex-shrink-0 text-tertiary">
              <span className="material-symbols-outlined text-[22px]">event_available</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-tertiary uppercase tracking-wider">Confirmed Parent Consultation</p>
              <p className="text-[14px] font-bold text-on-surface">Fri, Oct 16 · 09:15 AM · Cabin 402 with Mrs. S. Roy</p>
              <p className="text-[12px] text-on-surface-variant">Class Incharge Term 1 Review &amp; Academic Progress</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary text-[12px] font-bold shadow-sm hover:bg-surface-container transition-colors">
              Add to Calendar
            </button>
            <Link
              href="/helpdesk"
              className="px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface-variant text-[12px] font-medium hover:text-on-surface transition-colors"
            >
              Reschedule
            </Link>
          </div>
        </div>

        {bookingSuccess && (
          <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-xl text-[13px] font-semibold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{bookingSuccess}</span>
          </div>
        )}

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* Main Slots Section */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-on-surface">Available Faculty Time Slots</h2>
                <p className="text-[12px] text-on-surface-variant">Term 1 Evaluation Sessions • 10 minutes per parent slot</p>
              </div>
              <span className="text-[12px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Semester 1 Meet
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline/10 p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0 ${teacher.avatarColor}`}>
                        {teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-on-surface truncate">{teacher.name}</p>
                        <p className="text-[12px] text-on-surface-variant truncate">{teacher.role}</p>
                        <p className="text-[11px] text-outline font-medium mt-0.5">{teacher.cabin}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Available Slots</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.slots.map((s, idx) => {
                          const isMine = s.status === 'mine';
                          const isBooked = s.status === 'booked';
                          return (
                            <button
                              key={idx}
                              disabled={isBooked}
                              onClick={() => !isMine && !isBooked && handleBook(teacher.name, s.time)}
                              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                                isMine
                                  ? 'bg-tertiary/15 text-tertiary border border-tertiary/30 cursor-default'
                                  : isBooked
                                  ? 'bg-surface-container text-outline/50 line-through cursor-not-allowed'
                                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                              }`}
                            >
                              {s.time} {isMine && '· Yours'} {isBooked && '· Full'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between text-[12px]">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">check</span>
                      Instant Confirmation
                    </span>
                    <button
                      onClick={() => handleBook(teacher.name, teacher.slots[0].time)}
                      className="font-bold text-primary hover:underline"
                    >
                      Quick Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Rail: Guidelines & Venue */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            {/* Guidelines */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <h3 className="font-headline-sm text-[14px] text-on-surface font-bold">PTM Guidelines</h3>
              </div>
              <ul className="space-y-2.5 text-[12px] text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[16px] mt-0.5">schedule</span>
                  <span>Please arrive 5 minutes prior to your allocated time. Slots are fixed at 10 minutes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[16px] mt-0.5">badge</span>
                  <span>Carry the digital Student ID pass on your phone or printed hall pass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[16px] mt-0.5">place</span>
                  <span>Senior Block B, 3rd &amp; 4th Floors. Elevators reserved for senior citizens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[16px] mt-0.5">local_cafe</span>
                  <span>Tea and light refreshments served at the Central Quadrangle lounge.</span>
                </li>
              </ul>
            </div>

            {/* Preparation Checklist */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-tertiary text-[20px]">checklist</span>
                <h3 className="font-headline-sm text-[14px] text-on-surface font-bold">Meeting Preparation</h3>
              </div>
              <p className="text-[12px] text-on-surface-variant mb-3">
                Review {studentName}&apos;s latest report cards and syllabus completion tracker before attending:
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/academics"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-[12px] font-semibold text-on-surface"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">assessment</span>
                    View Term 1 Report Card
                  </span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
                <Link
                  href="/attendance"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-[12px] font-semibold text-on-surface"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary dark:text-[#ffb95f] text-[18px]">fact_check</span>
                    Attendance Log (94.2%)
                  </span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
                <Link
                  href="/helpdesk"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-[12px] font-semibold text-on-surface"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">support_agent</span>
                    Need Assistance or Reschedule?
                  </span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
