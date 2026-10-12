'use client';

import React, { useState, useEffect } from 'react';

/**
 * 7 Two-Word Institutional Phrases capturing the core pillars of NexaCampus:
 * 1. Empowering Campus (Identity & Vision)
 * 2. Smart Academics (Timetable, Syllabus & Exams)
 * 3. Instant Attendance (Biometric & RFID Attendance Tracking)
 * 4. Digital Diary (Assignments & Teacher Communications)
 * 5. RFID Canteen (Smart Dining & Tap-and-Pay Wallet)
 * 6. Bus Radar (Live Fleet GPS & Transit ETA)
 * 7. Connected Community (Students, Parents & Faculty Desk)
 */
const HERO_PHRASES = [
  'Empowering Campus',
  'Smart Academics',
  'Instant Attendance',
  'Digital Diary',
  'RFID Canteen',
  'Bus Radar',
  'Connected Community',
];

const TYPING_SPEED_MS = 50; // Fast and snappy character typing delay
const DELETING_SPEED_MS = 25; // Quick backspace delay
const DISPLAY_PAUSE_MS = 3000; // Exact 3-second dwell time requested by user
const CYCLE_PAUSE_MS = 220; // Short breath before typing the next phrase

export default function HeroTypewriter({ className = '' }: { className?: string }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(HERO_PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = HERO_PHRASES[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase: append 1 character at a time
      if (displayText.length < targetPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(targetPhrase.slice(0, displayText.length + 1));
        }, TYPING_SPEED_MS);
      } else {
        // Complete 2-word phrase rendered: hold for 3 seconds
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, DISPLAY_PAUSE_MS);
      }
    } else {
      // Deleting phase: backspace 1 character at a time
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, DELETING_SPEED_MS);
      } else {
        // Fully cleared: advance to the next phrase in the 7-item loop
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        }, CYCLE_PAUSE_MS);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <span
      className={`inline-flex items-baseline min-w-[260px] sm:min-w-[380px] md:min-w-[460px] lg:min-w-[560px] ${className}`}
      aria-label={displayText || HERO_PHRASES[phraseIndex]}
    >
      <span className="inline-block">{displayText}</span>
      <span
        className="inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.82em] ml-1.5 sm:ml-2 bg-[#1c2ac8] dark:bg-[#bdc2ff] rounded-[1px] align-baseline animate-pulse select-none"
        aria-hidden="true"
      />
    </span>
  );
}
