'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
  id: number;
  tagline: string;
  headline: string;
  subtext: string;
  quoteAuthor?: string;
  actionPrimary: { label: string; href: string };
  actionSecondary: { label: string; href: string };
  bgAccent: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tagline: 'ESTD 1991 • CISCE AFFILIATED (WB-243)',
    headline: 'Nurturing Intellect, Integrity & Scholastic Eminence',
    subtext:
      'Lions Calcutta Greater Vidyamandir stands as a cornerstone of rigorous academic formation, scientific temper, and ethical leadership across 35 distinguished years.',
    quoteAuthor: '“Educating the mind without educating the heart is no education at all.”',
    actionPrimary: { label: 'Apply for Admission 2026-27', href: '/apply' },
    actionSecondary: { label: 'Explore Mandatory Disclosures', href: '/disclosures' },
    bgAccent: 'from-oxford via-[#112240] to-[#0A192F]',
  },
  {
    id: 2,
    tagline: 'ICSE & ISC BOARD EXAMINATION 2026',
    headline: '100% Pass Percentage with 42 National Top Ranks',
    subtext:
      'Our scholars have consistently secured admissions into India’s premier institutions including IITs, AIIMS, National Law Universities, and top global collegiate programs.',
    quoteAuthor: '“Excellence is not an act, but a disciplined institutional habit.”',
    actionPrimary: { label: 'View Merit List & Toppers', href: '/exams' },
    actionSecondary: { label: 'Academic Curriculum', href: '/academics' },
    bgAccent: 'from-[#0C1A30] via-[#1E293B] to-[#060E1A]',
  },
  {
    id: 3,
    tagline: 'STATE-OF-THE-ART 12.5 ACRE CAMPUS',
    headline: 'Advanced Scientific Research & Robotics Center',
    subtext:
      'Equipped with 14 specialized STEM laboratories, Olympic-grade athletic complexes, and interactive digital classrooms fostering next-generation discovery.',
    quoteAuthor: '“Where curious minds transform into inventive pioneers.”',
    actionPrimary: { label: 'Explore Campus Facilities', href: '/facilities' },
    actionSecondary: { label: 'School Bus Transit Routes', href: '/facilities#transit' },
    bgAccent: 'from-[#1B382B] via-[#0A192F] to-[#060E1A]',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full bg-oxford text-white overflow-hidden font-sans border-b border-slate-800">
      {/* Background Architectural Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="300" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          <polygon points="400,100 700,700 100,700" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          <circle cx="400" cy="400" r="180" stroke="#FFFFFF" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Text Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{slide.tagline}</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight">
              {slide.headline}
            </h1>

            {/* Academic Subtext */}
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {slide.subtext}
            </p>

            {/* Scholastic Quote */}
            {slide.quoteAuthor && (
              <div className="border-l-2 border-amber-400/60 pl-4 py-1 italic font-serif text-xs md:text-sm text-slate-400">
                {slide.quoteAuthor}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={slide.actionPrimary.href}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm tracking-wide shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>{slide.actionPrimary.label}</span>
                <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href={slide.actionSecondary.href}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white/10 hover:bg-white/15 text-white font-semibold text-xs md:text-sm tracking-wide border border-white/20 transition-all hover:border-white/40"
              >
                <span>{slide.actionSecondary.label}</span>
              </Link>
            </div>
          </div>

          {/* Quick Action Institutional Cards Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 font-mono flex items-center justify-between">
              <span>Fast-Track Institutional Hub</span>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                Portal
              </span>
            </div>

            {/* Quick Card 1: Admissions */}
            <Link
              href="/apply"
              className="block bg-slate-800/80 hover:bg-slate-800 p-4 rounded-lg border border-slate-700/80 hover:border-amber-400/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      Admissions 2026-27 Open
                    </h2>
                    <p className="text-[11px] text-slate-400">Nursery to Class XI • Interactive Wizard</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Quick Card 2: Fee Portal */}
            <Link
              href="/disclosures#fees"
              className="block bg-slate-800/80 hover:bg-slate-800 p-4 rounded-lg border border-slate-700/80 hover:border-amber-400/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Fee Structure & Due Schedule
                    </h2>
                    <p className="text-[11px] text-slate-400">Class-wise breakdown & digital receipts</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Quick Card 3: Board Results */}
            <Link
              href="/exams"
              className="block bg-slate-800/80 hover:bg-slate-800 p-4 rounded-lg border border-slate-700/80 hover:border-amber-400/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-red-500/20 text-red-300 flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-white group-hover:text-red-300 transition-colors">
                      Board Results & Merit Wall
                    </h2>
                    <p className="text-[11px] text-slate-400">ICSE/ISC 100% record & topper accolades</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-red-300 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Quick Card 4: Explore Campuses */}
            <Link
              href="/explore"
              className="block bg-slate-800/80 hover:bg-slate-800 p-4 rounded-lg border border-slate-700/80 hover:border-amber-400/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-serif font-bold text-white group-hover:text-blue-300 transition-colors">
                      Explore All Campuses
                    </h2>
                    <p className="text-[11px] text-slate-400">Multi-tenant institutional directory</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-300 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="flex items-center justify-start space-x-2 pt-8">
          {SLIDES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 transition-all rounded-full ${
                currentSlide === index ? 'w-8 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
