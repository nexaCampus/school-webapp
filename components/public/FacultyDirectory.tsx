'use client';

import React, { useState } from 'react';

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: 'Science' | 'Commerce' | 'Humanities' | 'Computer Science & AI' | 'Languages';
  qualifications: string;
  subjects: string[];
  experience: string;
  email: string;
  badge?: string;
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Ananya Roy',
    designation: 'PGT Senior Lecturer & Head of Department',
    department: 'Science',
    qualifications: 'M.Sc. (Physics, Gold Medalist), Ph.D., B.Ed.',
    subjects: ['Advanced Physics', 'Astrophysics Elective', 'Class XII ISC Lab'],
    experience: '18 Years',
    email: 'ananya.roy@lcgvm.edu.in',
    badge: 'HOD Science',
  },
  {
    id: 'fac-2',
    name: 'Prof. Debabrata Sen',
    designation: 'PGT Chemistry Lead',
    department: 'Science',
    qualifications: 'M.Sc. (Organic Chemistry), B.Ed., CSIR-NET',
    subjects: ['Inorganic & Physical Chemistry', 'CBSE/ISC Practical Lab'],
    experience: '15 Years',
    email: 'debabrata.sen@lcgvm.edu.in',
  },
  {
    id: 'fac-3',
    name: 'Mrs. Sharmila Banerjee',
    designation: 'PGT Biology & Biotechnology Lead',
    department: 'Science',
    qualifications: 'M.Sc. (Zoology), M.Ed., GATE Qualified',
    subjects: ['Human Physiology', 'Genetics', 'Senior Biology Lab'],
    experience: '14 Years',
    email: 'sharmila.b@lcgvm.edu.in',
  },
  {
    id: 'fac-4',
    name: 'Mr. Rajesh Khaitan',
    designation: 'PGT Commerce Head & Chartered Mentor',
    department: 'Commerce',
    qualifications: 'M.Com, FCA (Fellow Chartered Accountant), B.Ed.',
    subjects: ['Accountancy', 'Financial Management', 'Business Studies'],
    experience: '20 Years',
    email: 'rajesh.khaitan@lcgvm.edu.in',
    badge: 'HOD Commerce',
  },
  {
    id: 'fac-5',
    name: 'Dr. Maitreyi Sen',
    designation: 'PGT Economics Specialist',
    department: 'Commerce',
    qualifications: 'M.Sc. (Economics, DSE), Ph.D. (Applied Econometrics)',
    subjects: ['Microeconomics', 'Macroeconomics', 'Indian Economic Development'],
    experience: '12 Years',
    email: 'maitreyi.sen@lcgvm.edu.in',
  },
  {
    id: 'fac-6',
    name: 'Dr. Vikramaditya Ghosh',
    designation: 'PGT Computer Science & Artificial Intelligence Lead',
    department: 'Computer Science & AI',
    qualifications: 'M.Tech (Computer Science, JU), B.Ed., IEEE Member',
    subjects: ['Java Object-Oriented Programming', 'Python & AI Ethics', 'Data Structures'],
    experience: '11 Years',
    email: 'vikram.ghosh@lcgvm.edu.in',
    badge: 'AI Lab Lead',
  },
  {
    id: 'fac-7',
    name: 'Mrs. Madhumita Sengupta',
    designation: 'PGT English Literature & Department Head',
    department: 'Languages',
    qualifications: 'M.A. (English, CU), M.Phil., B.Ed.',
    subjects: ['Shakespearean Drama', 'ISC English Literature', 'Debating Society'],
    experience: '22 Years',
    email: 'madhumita.s@lcgvm.edu.in',
    badge: 'HOD Languages',
  },
  {
    id: 'fac-8',
    name: 'Mr. Arindam Mukherjee',
    designation: 'PGT History & Political Theory Lead',
    department: 'Humanities',
    qualifications: 'M.A. (Modern History), B.Ed., UGC-NET',
    subjects: ['World History', 'Indian Constitutional Studies', 'Sociology'],
    experience: '13 Years',
    email: 'arindam.m@lcgvm.edu.in',
    badge: 'HOD Humanities',
  },
];

export default function FacultyDirectory() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    'All',
    'Science',
    'Commerce',
    'Humanities',
    'Computer Science & AI',
    'Languages',
  ];

  const filteredFaculty = FACULTY_MEMBERS.filter((fac) => {
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.qualifications.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <section className="w-full bg-parchment dark:bg-[#101119] py-14 px-6 border-b border-slate-200 dark:border-[#222538] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-[#222538] gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy dark:text-[#f2a5b5]">
              Academics & Departmental Chairs
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-oxford dark:text-[#eaedff] mt-1">
              Faculty Directory & Pedagogical Mentors
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#a0a4c0] mt-1">
              Distinguished educators with national research credentials, university gold medals, and dedicated student mentorship.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor or subject..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#151622] border border-slate-300 dark:border-[#2b2f48] rounded-md focus:outline-hidden focus:ring-2 focus:ring-oxford dark:focus:ring-[#3b49df] text-slate-800 dark:text-[#dfe2f4]"
            />
            <svg className="w-4 h-4 text-slate-400 dark:text-[#8a8fa8] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide mb-6">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-oxford text-white shadow-xs'
                  : 'bg-white dark:bg-[#151622] text-slate-700 dark:text-[#c4c7e0] border border-slate-200 dark:border-[#222538] hover:bg-slate-100 dark:hover:bg-[#222538]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#151622] rounded-xl p-5 border border-slate-200 dark:border-[#222538] shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Avatar and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1a1c2b] border-2 border-oxford flex items-center justify-center text-oxford dark:text-[#eaedff] font-serif font-bold text-lg overflow-hidden shadow-xs">
                    {member.name
                      .split(' ')
                      .slice(1, 3)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  {member.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-burgundy/10 text-burgundy dark:text-[#f2a5b5] border border-burgundy/20">
                      {member.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-oxford dark:text-[#eaedff] leading-snug">
                  {member.name}
                </h3>
                <div className="text-xs text-slate-600 dark:text-[#a0a4c0] font-medium mt-0.5">
                  {member.designation}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300 font-mono font-semibold mt-1">
                  {member.qualifications}
                </div>

                {/* Subjects Handled */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2133]">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#8a8fa8] font-mono mb-1.5">
                    Instructional Scope
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-[#1a1c2b] text-slate-700 dark:text-[#c4c7e0] font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience and Contact */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2133] flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                <span>Exp: {member.experience}</span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-oxford dark:text-[#eaedff] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Contact</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
