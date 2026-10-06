import Link from 'next/link';
import LogoEmblem from './LogoEmblem';

export default function PortalFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline/10 mt-auto pt-10 pb-28 md:pb-10 transition-colors">
      <div className="max-w-6xl mx-auto px-margin md:px-8">
        {/* Top Institutional Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-outline/10">
          <div className="flex items-start md:items-center gap-3.5">
            <LogoEmblem className="h-11 w-11 shadow-sm flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[17px] font-extrabold text-on-surface tracking-tight">
                  Lions Calcutta Greater Vidya Mandir
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  CISCE Affiliated
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">
                Affiliation No. 2430095 • School Code: 15632 • Academic Session 2026–2027
              </p>
            </div>
          </div>

          {/* Institutional Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline/10">
              <span className="material-symbols-outlined text-[15px] text-tertiary">lock</span>
              256-Bit SSL Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline/10">
              <span className="material-symbols-outlined text-[15px] text-primary">security</span>
              ISO 27001 Certified
            </span>
          </div>
        </div>

        {/* Multi-column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-outline/10 text-[13px]">
          {/* Column 1: Academics */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Academic Modules
            </span>
            <Link href="/home" className="text-on-surface-variant hover:text-primary transition-colors">
              Home Dashboard
            </Link>
            <Link href="/academics" className="text-on-surface-variant hover:text-primary transition-colors">
              Subjects &amp; Curriculum
            </Link>
            <Link href="/timetable" className="text-on-surface-variant hover:text-primary transition-colors">
              Class Timetable
            </Link>
            <Link href="/exams" className="text-on-surface-variant hover:text-primary transition-colors">
              Exams &amp; Hall Tickets
            </Link>
            <Link href="/diary" className="text-on-surface-variant hover:text-primary transition-colors">
              Student Diary &amp; Homework
            </Link>
            <Link href="/attendance" className="text-on-surface-variant hover:text-primary transition-colors">
              Monthly Attendance
            </Link>
          </div>

          {/* Column 2: Campus Facilities */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Campus &amp; Facilities
            </span>
            <Link href="/bus" className="text-on-surface-variant hover:text-primary transition-colors">
              Smart Bus Tracking
            </Link>
            <Link href="/canteen" className="text-on-surface-variant hover:text-primary transition-colors">
              Canteen &amp; Nutrition
            </Link>
            <Link href="/library" className="text-on-surface-variant hover:text-primary transition-colors">
              Digital Library
            </Link>
            <Link href="/health" className="text-on-surface-variant hover:text-primary transition-colors">
              Medical &amp; Infirmary
            </Link>
            <Link href="/hallpass" className="text-on-surface-variant hover:text-primary transition-colors">
              E-Hallpass Portal
            </Link>
            <Link href="/store" className="text-on-surface-variant hover:text-primary transition-colors">
              Uniform &amp; Book Store
            </Link>
          </div>

          {/* Column 3: Co-Curricular & Community */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Activities &amp; Community
            </span>
            <Link href="/clubs" className="text-on-surface-variant hover:text-primary transition-colors">
              Student Activity Clubs
            </Link>
            <Link href="/merits" className="text-on-surface-variant hover:text-primary transition-colors">
              Merits &amp; House Points
            </Link>
            <Link href="/gallery" className="text-on-surface-variant hover:text-primary transition-colors">
              Photo &amp; Video Gallery
            </Link>
            <Link href="/lostfound" className="text-on-surface-variant hover:text-primary transition-colors">
              Lost &amp; Found Desk
            </Link>
            <Link href="/notices" className="text-on-surface-variant hover:text-primary transition-colors">
              School Circulars &amp; Notices
            </Link>
            <Link href="/ptm" className="text-on-surface-variant hover:text-primary transition-colors">
              Parent-Teacher Meetings
            </Link>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-[12px] uppercase tracking-wider text-outline mb-1">
              Contact &amp; Help Desk
            </span>
            <div className="flex items-start gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0 mt-0.5">
                location_on
              </span>
              <span className="text-[12px] leading-relaxed">
                Subhasgram, Kolkata, West Bengal — 700147
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0">
                call
              </span>
              <span className="text-[12px]">+91 33 2437 1234 / +91 91798 0679513</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[17px] text-primary flex-shrink-0">
                mail
              </span>
              <span className="text-[12px]">office@lcgvm.edu.in</span>
            </div>
            <div className="mt-2 pt-2 border-t border-outline/10">
              <Link
                href="/helpdesk"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                <span>Open Parent Desk Ticket</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Version & Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 text-[12px] text-on-surface-variant">
          <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
            <span>© 2026 Lions Calcutta Greater Vidya Mandir. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="text-outline">Affiliated to CISCE, New Delhi</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-outline">
              <span className="material-symbols-outlined text-[13px] text-tertiary">check_circle</span>
              NexaCampus v2.5.3
            </span>
            <span>•</span>
            <Link href="/helpdesk" className="hover:text-primary transition-colors">
              Help &amp; FAQ
            </Link>
            <span>•</span>
            <span className="text-outline">Privacy &amp; Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
