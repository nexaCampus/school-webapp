'use client';

import React, { useState } from 'react';

export interface MediaItem {
  id: string;
  title: string;
  category: 'Sports' | 'Science & Tech' | 'Ceremonial' | 'Cultural';
  date: string;
  description: string;
  tag: string;
}

export interface MagazineItem {
  id: string;
  issueTitle: string;
  volume: string;
  date: string;
  pageCount: string;
  fileSize: string;
}

export interface AlumniProfile {
  id: string;
  name: string;
  batch: string;
  designation: string;
  organization: string;
  achievement: string;
}

const MEDIA_GALLERY: MediaItem[] = [
  {
    id: 'm-1',
    title: '34th Annual Athletic & Track Meet 2026',
    category: 'Sports',
    date: 'January 2026',
    description: 'Inter-house march past, track sprints, high jump finals and trophy conferral.',
    tag: 'Athletics Turf',
  },
  {
    id: 'm-2',
    title: 'Regional Science & Robotics Fair 2025',
    category: 'Science & Tech',
    date: 'November 2025',
    description: 'Demonstrations of automated AI rovers, drone telemetry and renewable energy grids.',
    tag: 'Ramanujan Lab',
  },
  {
    id: 'm-3',
    title: 'Annual Investiture & Student Prefectorial Council Ceremony',
    category: 'Ceremonial',
    date: 'July 2025',
    description: 'Conferring badges of office to Head Boy, Head Girl, and House Captains.',
    tag: 'Main Auditorium',
  },
  {
    id: 'm-4',
    title: '79th Independence Day Parade & Cultural Tribute',
    category: 'Cultural',
    date: 'August 2025',
    description: 'National flag unfurling, NCC contingent salute, and choir performances.',
    tag: 'Ceremonial Ground',
  },
];

const SCHOOL_MAGAZINES: MagazineItem[] = [
  {
    id: 'mag-1',
    issueTitle: 'The Vidyamandir Chronicle (Annual Issue XXXIV)',
    volume: 'Vol. 34 • 2025-26',
    date: 'May 2026',
    pageCount: '124 Pages',
    fileSize: '14.8 MB',
  },
  {
    id: 'mag-2',
    issueTitle: 'STEM Horizons Quarterly: Student Inventions & Essays',
    volume: 'Vol. 8, Issue 2',
    date: 'December 2025',
    pageCount: '48 Pages',
    fileSize: '6.2 MB',
  },
  {
    id: 'mag-3',
    issueTitle: 'Literary Echoes: Poetry & Short Stories in English & Bengali',
    volume: 'Autumn Issue 2025',
    date: 'October 2025',
    pageCount: '64 Pages',
    fileSize: '8.1 MB',
  },
];

const NOTABLE_ALUMNI: AlumniProfile[] = [
  {
    id: 'alum-1',
    name: 'Dr. Indranil Roy',
    batch: 'Class of 2004',
    designation: 'Senior Scientist & Astrobiologist',
    organization: 'ISRO Satellite Center, Bengaluru',
    achievement: 'Chandrayaan Payload Telemetry Engineering Lead',
  },
  {
    id: 'alum-2',
    name: 'Ms. Sneha Sengupta, IAS',
    batch: 'Class of 2008',
    designation: 'District Magistrate & Collector',
    organization: 'Indian Administrative Service (Govt. of India)',
    achievement: 'All India Rank 28 (UPSC Civil Services 2014)',
  },
  {
    id: 'alum-3',
    name: 'Mr. Rohan Kothari',
    batch: 'Class of 2012',
    designation: 'Co-Founder & Chief Technology Officer',
    organization: 'NextGen Quantum Compute (Bengaluru)',
    achievement: 'Forbes 30 Under 30 Asia (Enterprise Technology)',
  },
];

export default function CampusMediaGallery() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'magazines' | 'alumni'>('gallery');

  return (
    <section className="w-full bg-white py-14 px-6 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header & Sub-Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-burgundy">
              Media, Publications & Legacy
            </div>
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-oxford mt-1">
              Campus Life, Literary Chronicles & Alumni
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-oxford text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Photo & Video Gallery
            </button>
            <button
              onClick={() => setActiveTab('magazines')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'magazines'
                  ? 'bg-oxford text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Magazines & Gazettes
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'alumni'
                  ? 'bg-oxford text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Distinguished Alumni
            </button>
          </div>
        </div>

        {/* Tab 1: Campus Events Gallery */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
            {MEDIA_GALLERY.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Photo Frame Placeholder with Stately Academic Aspect Ratio */}
                  <div className="h-44 bg-oxford/90 text-slate-300 relative overflow-hidden flex items-center justify-center p-4 text-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-oxford via-oxford/70 to-transparent z-10" />
                    <div className="relative z-20 space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400 text-slate-950">
                        {item.category}
                      </span>
                      <div className="text-[11px] font-mono text-slate-300">{item.tag}</div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono">{item.date}</div>
                    <h3 className="font-serif font-bold text-sm text-oxford leading-snug group-hover:text-burgundy transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => alert(`Viewing high-res album for: ${item.title}`)}
                    className="text-xs font-bold text-oxford hover:underline flex items-center gap-1"
                  >
                    <span>View Archival Album</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: School Magazine Archive */}
        {activeTab === 'magazines' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {SCHOOL_MAGAZINES.map((mag) => (
              <div
                key={mag.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>{mag.volume}</span>
                    <span>{mag.date}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-oxford leading-snug">
                    {mag.issueTitle}
                  </h3>
                  <div className="mt-4 p-3 bg-parchment rounded border border-slate-200 text-xs text-slate-600 flex items-center justify-between font-mono">
                    <span>Format: {mag.pageCount}</span>
                    <span>Size: {mag.fileSize}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Simulated Download: ${mag.issueTitle} (${mag.fileSize})`)}
                  className="mt-6 w-full py-2.5 bg-oxford hover:bg-slate-800 text-white rounded text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Read Digital Edition (PDF)</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Notable Alumni */}
        {activeTab === 'alumni' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {NOTABLE_ALUMNI.map((alum) => (
              <div
                key={alum.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-oxford text-amber-300 flex items-center justify-center font-serif font-bold text-sm">
                    {alum.name
                      .split(' ')
                      .slice(1, 3)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-oxford">{alum.name}</h3>
                    <div className="text-[11px] font-mono text-burgundy font-semibold">
                      {alum.batch}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{alum.designation}</div>
                  <div className="text-slate-600 font-medium">{alum.organization}</div>
                </div>

                <p className="text-xs text-slate-500 italic">“{alum.achievement}”</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
