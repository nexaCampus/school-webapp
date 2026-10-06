'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default function HelpdeskPage() {
  useEffect(() => {
    const s = getSession();
    if (!s?.student) window.location.replace('/chooser');
  }, []);
  const [sent, setSent] = useState(false);
  const [chars, setChars] = useState(142);
  const [attachment, setAttachment] = useState(true);
  return (
    <div className="app-column relative min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:1024px)]:top-7"><div className="h-16 px-margin flex items-center justify-between gap-space-sm"><div className="flex items-center gap-space-sm min-w-0 flex-1"><img alt="EduPortal Emblem Logo" className="h-8 w-auto object-contain flex-shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XzchOrmrFK4e0IrFKXMuSOAQzIVLl76Oyo1eMqHBOhkSBE3tJxbJqhaJWeUubO-LOz2k8S6mkNZYqGQGOgO-sy_7g3Ng_nzGrBTR9R1WdQ7WryFFY0RE26C5gE2PqViSYilm0gDJ9AuARfpt1mtdWTOoXh9_PkdlBOhbLNfE9r8xoRb4uprzCubdRKfCMtAsrpAgEwVAOII4Jr_2t1y4qnwZN05K3k4rVmli9sQlrmUxohAGvmAFaegpRI"/><div className="flex flex-col min-w-0"><span className="font-label-sm text-label-sm text-outline uppercase tracking-wider truncate">High School Portal</span><span className="font-headline-sm text-headline-sm text-on-surface truncate">Home</span></div></div><div className="flex items-center gap-space-xs flex-shrink-0"><button aria-label="Notifications" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"><span className="material-symbols-outlined text-[22px]">notifications</span><span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container"></span></button><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs shadow-sm"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-surface"><div className="flex flex-col w-full px-margin pb-space-xl">
      {/*Atmospheric Ambient Glow Underlay*/}
      <div className="relative w-full">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-72 h-32 bg-primary-container/10 blur-3xl pointer-events-none rounded-full"></div>
      </div>
      {/*Student ID Card Badge*/}
      <div className="relative w-full bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_8px_24px_-6px_rgba(59,73,223,0.08)] flex items-center justify-between mb-space-md">
      <div className="flex items-center gap-space-sm min-w-0">
      <div className="relative w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="font-headline-sm text-headline-sm text-primary">RS</span>
      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest"></span>
      </div>
      <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-space-xs">
      <span className="font-label-lg text-label-lg text-on-surface truncate">Rajen Shaw</span>
      <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">Sec E</span>
      </div>
      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Class 12-E • Roll No. 24 • ID: 10211125</span>
      </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed/30 px-2 py-1 rounded-full font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
      Verified Active
      </span>
      </div>
      </div>
      {/*Segmented Control Switcher*/}
      <div className="w-full bg-surface-container p-1 rounded-full flex items-center mb-space-md shadow-inner">
      <button className="flex-1 py-2 px-3 rounded-full bg-primary text-on-primary font-label-md text-label-md text-center shadow-[0_4px_12px_-2px_rgba(59,73,223,0.35)] transition-all flex items-center justify-center gap-1.5" id="tab-inquiry" type="button">
      <span className="material-symbols-outlined text-[17px]">edit_note</span>
      <span>New Inquiry / Ticket</span>
      </button>
      <button className="flex-1 py-2 px-3 rounded-full text-on-surface-variant font-label-md text-label-md text-center hover:text-on-surface transition-all flex items-center justify-center gap-1.5" id="tab-history" type="button">
      <span className="material-symbols-outlined text-[17px]">history</span>
      <span>My Messages</span>
      <span className="w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center ml-0.5">3</span>
      </button>
      </div>
      {/*Trust & SLA Guarantee Banner*/}
      <div className="w-full bg-surface-container-low rounded-DEFAULT p-space-md mb-space-lg flex items-start gap-space-sm shadow-[0_4px_16px_-4px_rgba(15,23,42,0.04)]">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="material-symbols-outlined text-[19px]">verified_user</span>
      </div>
      <div className="flex flex-col">
      <span className="font-label-md text-label-md text-on-surface">Official Communication Channel</span>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
      Direct link to Principal, Grade Teacher &amp; Admin. Standard response SLA is under 24 school hours.
      </p>
      </div>
      </div>
      {/*Interactive Form Panel*/}
      <form
        className="w-full flex flex-col gap-space-lg"
        id="helpdeskForm"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
      {/*Field 1: Recipient Selector*/}
      <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
      <label className="font-label-md text-label-md text-on-surface flex items-center gap-1" htmlFor="recipientDept">
      <span>Recipient / Department</span>
      <span className="text-error">*</span>
      </label>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Class Incharge Direct</span>
      </div>
      <div className="relative">
      <select className="w-full h-12 pl-11 pr-10 appearance-none bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-DEFAULT shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,73,223,0.15)] transition-all" id="recipientDept" defaultValue="teacher">
      <option value="teacher">Class Teacher (Grade 12-E • Mrs. S. Roy)</option>
      <option value="principal">Principal Desk (Dr. M. Banerjee)</option>
      <option value="exams">Examination &amp; Report Card Dept</option>
      <option value="accounts">Accounts &amp; Term Fees Desk</option>
      <option value="transport">Transport &amp; Facilities Division</option>
      </select>
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-[20px] pointer-events-none">school</span>
      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
      </div>
      </div>
      {/*Field 2: Category Chips*/}
      <div className="flex flex-col gap-2">
      <label className="font-label-md text-label-md text-on-surface flex items-center gap-1">
      <span>Inquiry Nature</span>
      <span className="text-error">*</span>
      </label>
      <div className="flex flex-wrap gap-2" id="categoryChips">
      <button className="category-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-150 bg-primary text-on-primary shadow-sm" data-category="Academic Doubt" type="button">Academic Doubt</button>
      <button className="category-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-150 bg-surface-container text-on-surface-variant" data-category="Leave Application" type="button">Leave Application</button>
      <button className="category-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-150 bg-surface-container text-on-surface-variant" data-category="Fee Inquiry" type="button">Fee Inquiry</button>
      <button className="category-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-150 bg-surface-container text-on-surface-variant" data-category="Exam Clarification" type="button">Exam Clarification</button>
      <button className="category-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all duration-150 bg-surface-container text-on-surface-variant" data-category="General Feedback" type="button">General Feedback</button>
      </div>
      </div>
      {/*Field 3: Subject Line*/}
      <div className="flex flex-col gap-1.5">
      <label className="font-label-md text-label-md text-on-surface flex items-center gap-1" htmlFor="querySubject">
      <span>Subject Heading</span>
      <span className="text-error">*</span>
      </label>
      <div className="relative">
      <input className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-DEFAULT shadow-[0_2px_8px_rgba(0,0,0,0.04)] placeholder:text-outline/70 focus:outline-none focus:shadow-[0_0_0_3px_rgba(59,73,223,0.15)] transition-all" id="querySubject" placeholder="e.g. Request for Medical Leave from 28th to 30th Sep" required type="text" defaultValue="Doubt regarding Physics Practical Lab Record format"/>
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">title</span>
      </div>
      </div>
      {/*Field 4: Detailed Message*/}
      <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
      <label className="font-label-md text-label-md text-on-surface flex items-center gap-1" htmlFor="queryBody">
      <span>Detailed Message</span>
      <span className="text-error">*</span>
      </label>
      <span className="font-label-sm text-label-sm text-on-surface-variant" id="charCount">{chars} / 500</span>
      </div>
      <div className="relative bg-surface-container-lowest rounded-DEFAULT shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-space-sm focus-within:shadow-[0_0_0_3px_rgba(59,73,223,0.15)] transition-all">
      <textarea className="w-full bg-transparent resize-none font-body-md text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none p-1" id="queryBody" maxLength={500} onInput={(e) => setChars(e.currentTarget.value.length)} placeholder="Provide context, dates, or specific questions so the faculty can address your issue quickly..." rows={4} defaultValue="Dear Ma'am, for Experiment #4 (Optical Bench), should we attach the handwritten ray diagrams on plain interleaved sheets or directly on the ruled page?"></textarea>
      {/*Formatting helper toolbar*/}
      <div className="flex items-center justify-between pt-2 mt-1 border-t-0 bg-surface-container-low/50 -mx-2 -mb-2 p-2 rounded-b-DEFAULT">
      <div className="flex items-center gap-2 text-on-surface-variant">
      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container-highest transition-colors" title="Bold" type="button"><span className="font-bold text-xs">B</span></button>
      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container-highest transition-colors" title="Italic" type="button"><span className="italic text-xs font-serif">I</span></button>
      <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-surface-container-highest transition-colors" title="Bullet List" type="button"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
      </div>
      <span className="font-label-sm text-label-sm text-tertiary-container flex items-center gap-1">
      <span className="material-symbols-outlined text-[13px]">spellcheck</span> Spellcheck ready
      </span>
      </div>
      </div>
      </div>
      {/*Field 5: Attachment Dropzone & Attachment Preview*/}
      <div className="flex flex-col gap-1.5">
      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
      <span>Supporting Document or Photo</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional • Max 10MB</span>
      </label>
      {/*Tactile Dropzone Container*/}
      <div className="w-full rounded-DEFAULT p-space-md bg-surface-container-low flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-surface-container group" id="dropzone">
      <input accept=".pdf,image/*,.doc,.docx" className="hidden" id="fileInput" type="file"/>
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm mb-2">
      <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
      </div>
      <span className="font-label-md text-label-md text-on-surface">Tap to upload proof, note, or homework photo</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Supports PDF, JPG, PNG up to 10MB</span>
      </div>
      {/*Live Attachment Preview Chip*/}
      {attachment && (
      <div className="w-full bg-surface-container-lowest rounded-DEFAULT p-space-sm shadow-sm flex items-center justify-between mt-1" id="attachmentCard">
      <div className="flex items-center gap- space-sm min-w-0">
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-primary-fixed flex items-center justify-center">
      <img className="w-full h-full object-cover" data-alt="A clear macro photograph of a handwritten physics laboratory experiment manual page with neat blue ink formulas and diagram sketches" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC175NhW7GHtbWcS8DaPdtr4XYj1sNz28alfHsC3denDQVPvodPa_Ard_YqIZApqrb3jphrF8BSkVMi_-KeNwoiO3YUqZxnE61j7AtW-rRqFqvc0TuotHqJK16e4XGH0-E1E1Uq4A0THYDHwvcY5e1PhZdxZsEJrilHZQgIaoBJBLZkMU87O3uldmiiFIjSy1PVgSunHoQujWrAU9wUSoNFTk3GzOAz7cjA9hkfA_De9y3YjYexCIPdSA"/>
      </div>
      <div className="flex flex-col min-w-0 ml-2">
      <span className="font-label-md text-label-md text-on-surface truncate">lab_diagram_ref_exp4.jpg</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">1.4 MB • Image attached</span>
      </div>
      </div>
      <button className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error-container/30 transition-colors" onClick={() => setAttachment(false)} title="Remove file" type="button">
      <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      </div>
      )}
      </div>
      {/*Field 6: Submit Button with Security Reassurance*/}
      <div className="flex flex-col gap-2 mt-1">
      <button className="w-full h-13 py-3 px-6 rounded-full bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(59,73,223,0.4)] active:scale-[0.98] transition-all" id="submitBtn" type="submit">
      <span className="material-symbols-outlined text-[20px]">send</span>
      <span>Send Message to School</span>
      </button>
      <div className="flex items-center justify-center gap-1.5 text-center mt-1">
      <span className="material-symbols-outlined text-[15px] text-on-surface-variant">lock</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant">
      Transmitted privately and securely under Student ID #10211125
      </span>
      </div>
      </div>
      </form>
      {/*Success notice (shown after submit)*/}
      {sent && (
      <div className="w-full mt-space-md p-space-md rounded-DEFAULT bg-tertiary-fixed text-on-tertiary-fixed shadow-md flex items-center gap-space-sm" id="successNotice">
      <span className="material-symbols-outlined text-[24px] text-tertiary-container">task_alt</span>
      <div className="flex flex-col">
      <span className="font-label-md text-label-md font-bold">Ticket #TKT-8841 Dispatched</span>
      <span className="font-body-sm text-body-sm">Delivered to Mrs. S. Roy. Expected reply by 4:00 PM tomorrow.</span>
      </div>
      </div>
      )}
      {/*Divider & Section: Recent Messages & Thread Status*/}
      <div className="w-full flex items-center justify-between mt-space-xl mb-space-sm">
      <div className="flex items-center gap-1.5">
      <span className="font-headline-sm text-headline-sm text-on-surface">Recent Thread Status</span>
      <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
      </div>
      <a className="font-label-md text-label-md text-primary flex items-center gap-0.5" href="#">
      <span>View All</span>
      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
      </a>
      </div>
      {/*Recent Ticket Item Card 1*/}
      <div className="w-full bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-[0_6px_20px_-6px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-space-xs min-w-0">
      <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-[18px]">directions_bus</span>
      </div>
      <div className="flex flex-col min-w-0">
      <span className="font-label-lg text-label-lg text-on-surface truncate">Bus Route No. 14 Morning Timing</span>
      <span className="font-body-sm text-body-sm text-on-surface-variant">Ticket #TKT-7820 • Transport Desk</span>
      </div>
      </div>
      <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary-container font-label-sm text-label-sm font-bold flex items-center gap-1 flex-shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
      Resolved
      </span>
      </div>
      {/*Reply Snippet*/}
      <div className="w-full bg-surface-container-low rounded-lg p-2.5 flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
      TA
      </div>
      <p className="font-body-sm text-body-sm text-on-surface leading-snug line-clamp-2">
      <span className="font-semibold text-on-surface">Transport Admin:</span> "Pickup at Ultadanga Junction has been rescheduled to 7:12 AM due to flyover repair work."
      </p>
      </div>
      <div className="flex items-center justify-between pt-1">
      <span className="font-label-sm text-label-sm text-outline">Closed yesterday at 3:45 PM</span>
      <button className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-semibold hover:underline" type="button">
      View Full Thread
      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
      </div>
      </div>
      {/*Interactive JavaScript*/}

      </div></main><nav className="fixed bottom-0 w-full z-50 pb-safe pointer-events-none max-w-[430px] left-1/2 -translate-x-1/2 [@media(min-width:480px)]:max-w-none [@media(min-width:480px)]:left-0 [@media(min-width:480px)]:translate-x-0 [@media(min-width:480px)]:bg-surface/85 [@media(min-width:480px)]:backdrop-blur-2xl [@media(min-width:480px)]:border-t [@media(min-width:480px)]:border-outline/10 [@media(min-width:1024px)]:bottom-7" data-active-classes="text-on-surface-variant"><div className="px-margin pb-space-md pt-space-xs pointer-events-auto [@media(min-width:480px)]:px-0 [@media(min-width:480px)]:pb-0 [@media(min-width:480px)]:pt-0"><div className="bg-white/90 backdrop-blur-2xl rounded-full shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(59,73,223,0.06)] p-space-xs flex items-center justify-between [@media(min-width:480px)]:rounded-none [@media(min-width:480px)]:shadow-none [@media(min-width:480px)]:bg-transparent [@media(min-width:480px)]:backdrop-blur-none [@media(min-width:480px)]:max-w-[430px] [@media(min-width:480px)]:mx-auto"><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="home" href="/home"><span className="material-symbols-outlined text-[20px]">grid_view</span><span className="font-label-sm text-label-sm mt-0.5">Home</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="academics" href="/academics"><span className="material-symbols-outlined text-[20px]">menu_book</span><span className="font-label-sm text-label-sm mt-0.5">Academics</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="notices" href="/notices"><span className="material-symbols-outlined text-[20px]">campaign</span><span className="font-label-sm text-label-sm mt-0.5">Notices</span></Link><Link className="flex-1 min-h-[44px] flex flex-col items-center justify-center py-space-xs px-space-xs rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-200" data-path="profile" href="/profile"><span className="material-symbols-outlined text-[20px]">account_circle</span><span className="font-label-sm text-label-sm mt-0.5">Profile</span></Link></div></div></nav>
    </div>
  );
}
