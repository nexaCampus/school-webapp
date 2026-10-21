'use client';

import React, { useState } from 'react';

export interface CalendarEvent {
  id: string;
  date: string;
  day: string;
  month: string;
  year: string;
  title: string;
  category: 'Examination' | 'Holiday' | 'Term Event' | 'PTM & Meeting';
  targetGrades: string;
  time?: string;
  venue?: string;
}

const EVENTS_DATABASE: CalendarEvent[] = [
  {
    id: 'cal-1',
    date: '15',
    day: 'Thursday',
    month: 'Oct',
    year: '2026',
    title: 'ICSE & ISC Board Practical Mock Evaluations (Physics & Computer Science)',
    category: 'Examination',
    targetGrades: 'Classes X & XII',
    time: '08:30 AM - 01:30 PM',
    venue: 'Ramanujan STEM Complex',
  },
  {
    id: 'cal-2',
    date: '20',
    day: 'Tuesday',
    month: 'Oct',
    year: '2026',
    title: 'Commencement of Durga Puja Autumn Recess (School Office Closed)',
    category: 'Holiday',
    targetGrades: 'All Classes (Nursery - XII)',
    time: 'All Day',
    venue: 'Campus Wide',
  },
  {
    id: 'cal-3',
    date: '02',
    day: 'Monday',
    month: 'Nov',
    year: '2026',
    title: 'Reopening of School Post-Autumn Break & Winter Uniform Compliance',
    category: 'Term Event',
    targetGrades: 'All Classes',
    time: '07:45 AM Regular Bell',
    venue: 'Main Assembly Ground',
  },
  {
    id: 'cal-4',
    date: '07',
    day: 'Saturday',
    month: 'Nov',
    year: '2026',
    title: 'Quarter-2 Parent-Teacher Academic Review & Progress Card Distribution',
    category: 'PTM & Meeting',
    targetGrades: 'Classes VI to IX',
    time: '09:00 AM - 12:30 PM',
    venue: 'Auditorium Wing A',
  },
  {
    id: 'cal-5',
    date: '14',
    day: 'Saturday',
    month: 'Nov',
    year: '2026',
    title: 'Children’s Day Inter-House Cultural Gala & Exhibition of Scientific Inventions',
    category: 'Term Event',
    targetGrades: 'All Classes',
    time: '08:00 AM - 02:00 PM',
    venue: 'Open-Air Amphitheater',
  },
  {
    id: 'cal-6',
    date: '01',
    day: 'Tuesday',
    month: 'Dec',
    year: '2026',
    title: 'Pre-Board Terminal Examination Session 2026 Begins',
    category: 'Examination',
    targetGrades: 'Classes X & XII',
    time: '09:00 AM - 12:00 PM',
    venue: 'Exam Halls 1 to 6',
  },
];

export default function CalendarWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMonth, setActiveMonth] = useState<string>('Oct - Nov 2026');

  const categories = ['All', 'Examination', 'Holiday', 'Term Event', 'PTM & Meeting'];

  const filteredEvents =
    selectedCategory === 'All'
      ? EVENTS_DATABASE
      : EVENTS_DATABASE.filter((e) => e.category === selectedCategory);

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Examination':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Holiday':
        return 'bg-slate-100 dark:bg-[#1a1c2b] text-slate-700 dark:text-[#c4c7e0] border-slate-300 dark:border-[#2b2f48]';
      case 'Term Event':
        return 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-500/30';
      case 'PTM & Meeting':
        return 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-500/30';
      default:
        return 'bg-slate-50 dark:bg-[#101119] text-slate-700 dark:text-[#c4c7e0] border-slate-200 dark:border-[#222538]';
    }
  };

  return (
    <section className="w-full bg-white dark:bg-[#151622] py-14 px-6 border-b border-slate-200 dark:border-[#222538]">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-[#222538] gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
              Official Institutional Gazette
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-oxford dark:text-[#eaedff] mt-1">
              Academic Calendar & Term Dates 2026-27
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-oxford text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1a1c2b] text-slate-600 dark:text-[#a0a4c0] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-[#151622] rounded-lg p-5 border border-slate-200/90 hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Date Tag & Category Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-oxford text-white rounded-md w-12 h-12 flex flex-col items-center justify-center font-serif text-center shadow-xs">
                      <span className="text-[10px] uppercase font-bold leading-none text-amber-300">
                        {evt.month}
                      </span>
                      <span className="text-base font-extrabold leading-none mt-0.5">
                        {evt.date}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-[#dfe2f4]">{evt.day}</div>
                      <div className="text-[11px] text-slate-400 dark:text-[#8a8fa8] font-mono">{evt.year}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getCategoryBadgeClass(
                      evt.category
                    )}`}
                  >
                    {evt.category}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-[#eaedff] leading-snug line-clamp-2">
                  {evt.title}
                </h3>
              </div>

              {/* Event Metadata */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2133] space-y-1 text-[11px] text-slate-600 dark:text-[#a0a4c0]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-on-surface-variant">Target Group:</span>
                  <span className="font-semibold text-oxford dark:text-[#eaedff]">{evt.targetGrades}</span>
                </div>
                {evt.time && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-on-surface-variant">Schedule:</span>
                    <span>{evt.time}</span>
                  </div>
                )}
                {evt.venue && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-on-surface-variant">Venue:</span>
                    <span className="text-slate-700 dark:text-[#c4c7e0]">{evt.venue}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-[#222538] flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All calendar items are synchronized with CISCE & CBSE official notification dates.</span>
          </div>
          <button
            onClick={() => alert('Simulated iCal Export: Academic Calendar 2026-27 downloaded.')}
            className="text-oxford dark:text-[#eaedff] hover:text-burgundy font-bold inline-flex items-center gap-1.5 underline underline-offset-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Subscribe to Academic iCal Feed (.ics)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
