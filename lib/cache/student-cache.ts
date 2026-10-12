import type { Student } from '../data';

export const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
export const ACTIVE_STUDENT_ID_KEY = 'nexacampus.active_student_id.v1';
export const CACHE_PREFIX = 'nexacampus.student_cache.v1.';

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  tag: 'EXAM' | 'EVENT' | 'HOLIDAY' | 'FEE' | 'PTM';
  description: string;
  daysRemaining?: number;
}

export interface DiaryTask {
  id: string;
  subject: string;
  unit: string;
  title: string;
  teacher: string;
  due: string;
  status: 'Pending' | 'Submitted';
  description: string;
  fileName?: string;
  submissionDate?: string;
}

export interface TimetablePeriod {
  period: string;
  isLive: boolean;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  accent: 'primary' | 'secondary' | 'tertiary';
}

export interface StudentDataCache {
  version: number;
  studentId: string;
  userEmail?: string;
  student: Student;
  importantDates: ImportantDate[];
  diaryTasks: DiaryTask[];
  timetable: Record<string, TimetablePeriod[]>;
  cachedAt: number;
  lastActiveAt: number;
}

export const DEFAULT_IMPORTANT_DATES: ImportantDate[] = [
  {
    id: 'd-1',
    title: 'Mid-Term Assessment 2026',
    date: 'Oct 22, 2026',
    tag: 'EXAM',
    description: 'Theory papers begin for Classes 10 & 12. Hall ticket mandatory in Block C.',
    daysRemaining: 1,
  },
  {
    id: 'd-2',
    title: 'Inter-House Science Exhibition',
    date: 'Oct 24, 2026',
    tag: 'EVENT',
    description: 'Robotics, Applied AI, and Sustainable Energy project demonstrations in Central Quadrangle.',
    daysRemaining: 3,
  },
  {
    id: 'd-3',
    title: 'Parent-Teacher Meeting (PTM)',
    date: 'Oct 28, 2026',
    tag: 'PTM',
    description: 'Quarterly review & one-on-one consultation with subject faculty in Academic Block.',
    daysRemaining: 7,
  },
  {
    id: 'd-4',
    title: 'Term 2 Fee Deadline (No Fine)',
    date: 'Oct 30, 2026',
    tag: 'FEE',
    description: 'Last date to clear quarterly tuition & transport overhead without late fine.',
    daysRemaining: 9,
  },
  {
    id: 'd-5',
    title: 'Diwali & Kali Puja Vacation',
    date: 'Nov 01 - Nov 05, 2026',
    tag: 'HOLIDAY',
    description: 'School remains closed for festival break. Campus reopens on Nov 06.',
    daysRemaining: 11,
  },
  {
    id: 'd-6',
    title: 'CBSE Practical Mock Simulation',
    date: 'Nov 12, 2026',
    tag: 'EXAM',
    description: 'Physics & Chemistry laboratory viva with external evaluation criteria.',
    daysRemaining: 18,
  },
  {
    id: 'd-7',
    title: 'Annual Sports & Athletics Meet',
    date: 'Nov 18, 2026',
    tag: 'EVENT',
    description: 'Track and field championships, inter-house relay, and march past at Main Grounds.',
    daysRemaining: 24,
  },
];

export const DEFAULT_DIARY_TASKS: DiaryTask[] = [
  {
    id: 'hw-1',
    subject: 'Mathematics II',
    unit: 'Ex 7.3',
    title: 'Calculus Problem Set 4',
    teacher: 'Mrs. S. Roy',
    due: 'Tonight, 11:59 PM',
    status: 'Pending',
    description:
      'Complete questions 1 to 14 from Exercise 7.3 (Integration by Partial Fractions). Upload clean handwritten solutions as a PDF.',
  },
  {
    id: 'hw-2',
    subject: 'Physics Lab',
    unit: 'Exp #3',
    title: 'Optics & Focal Length Verification',
    teacher: 'Dr. Aris Thorne',
    due: 'Yesterday, 04:00 PM',
    status: 'Submitted',
    description:
      'Plot u-v graph for convex lens and calculate focal length error bounds. Verified by Dr. Aris Thorne.',
    fileName: 'Optics_Focal_Length_Exp3.pdf',
    submissionDate: 'Oct 21, 2026',
  },
  {
    id: 'hw-3',
    subject: 'Organic Chemistry',
    unit: 'Unit 4',
    title: 'Reaction Mechanism Notes',
    teacher: 'Mrs. D. Sen',
    due: 'Next Monday, 09:00 AM',
    status: 'Pending',
    description:
      'Prepare comparative summary on SN1 vs SN2 nucleophilic substitution kinetics. Include energy coordinate diagrams and stereochemical inversion examples.',
  },
  {
    id: 'hw-4',
    subject: 'Computer Science',
    unit: 'SQL & DB',
    title: 'Relational Database Join Queries',
    teacher: 'Mr. A. Banerjee',
    due: 'Oct 19, 2026',
    status: 'Submitted',
    description:
      'Create school schema with Students, Marks, and Attendance tables. Execute 10 nested join queries.',
    fileName: 'Database_Queries_Assignment.sql',
    submissionDate: 'Oct 19, 2026',
  },
  {
    id: 'hw-5',
    subject: 'English Core',
    unit: 'Literature',
    title: 'Character Sketch & Theme Analysis',
    teacher: 'Ms. K. Mukherjee',
    due: 'Oct 17, 2026',
    status: 'Submitted',
    description:
      'Write a 600-word critical evaluation on satirical elements in "The Tiger King".',
    fileName: 'English_Tiger_King_Analysis.docx',
    submissionDate: 'Oct 17, 2026',
  },
];

export const DEFAULT_TIMETABLE_BY_DAY: Record<string, TimetablePeriod[]> = {
  mon: [
    { period: 'P1', isLive: false, time: '08:30 – 09:30 AM', subject: 'Mathematics II (Calculus)', teacher: 'Mrs. S. Roy · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P2', isLive: false, time: '09:40 – 10:35 AM', subject: 'Physics (Optics)', teacher: 'Dr. Aris Thorne · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P3', isLive: false, time: '10:45 – 11:40 AM', subject: 'Chemistry (Aldehydes)', teacher: 'Mrs. D. Sen · Room 305', room: 'Room 305', accent: 'primary' },
    { period: 'P4', isLive: false, time: '12:00 – 12:55 PM', subject: 'Computer Science (Python)', teacher: 'Mr. A. Banerjee · Comp Lab 2', room: 'Comp Lab 2', accent: 'primary' },
    { period: 'P5', isLive: false, time: '01:00 – 01:50 PM', subject: 'English Core (Literature)', teacher: 'Ms. K. Mukherjee · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P6', isLive: false, time: '02:00 – 02:45 PM', subject: 'Library & Guided Study', teacher: 'Library Coordinator', room: 'Central Library', accent: 'secondary' },
  ],
  tue: [
    { period: 'P1', isLive: false, time: '08:30 – 09:30 AM', subject: 'Chemistry Lab (Titration)', teacher: 'Mrs. D. Sen · Chem Lab 1', room: 'Chem Lab 1', accent: 'tertiary' },
    { period: 'P2', isLive: false, time: '09:40 – 10:35 AM', subject: 'Mathematics II (Vectors)', teacher: 'Mrs. S. Roy · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P3', isLive: false, time: '10:45 – 11:40 AM', subject: 'Physics (Wave Optics)', teacher: 'Dr. Aris Thorne · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P4', isLive: false, time: '12:00 – 12:55 PM', subject: 'Physical Education', teacher: 'Coach V. Sharma · Grounds', room: 'Main Grounds', accent: 'primary' },
    { period: 'P5', isLive: false, time: '01:00 – 01:50 PM', subject: 'Computer Science (SQL)', teacher: 'Mr. A. Banerjee · Comp Lab 2', room: 'Comp Lab 2', accent: 'primary' },
    { period: 'P6', isLive: false, time: '02:00 – 02:45 PM', subject: 'Remedial Doubt Clearing', teacher: 'Senior Faculty', room: 'Room 402', accent: 'secondary' },
  ],
  wed: [
    { period: 'P1', isLive: true, time: '08:30 – 09:30 AM', subject: 'Physics Lab (Optics & Laser)', teacher: 'Dr. Aris Thorne · Physics Lab 3', room: 'Lab 3', accent: 'tertiary' },
    { period: 'P2', isLive: false, time: '09:40 – 10:35 AM', subject: 'Mathematics II (Calculus)', teacher: 'Mrs. S. Roy · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P3', isLive: false, time: '10:45 – 11:40 AM', subject: 'Chemistry (Ketones)', teacher: 'Mrs. D. Sen · Room 305', room: 'Room 305', accent: 'primary' },
    { period: 'P4', isLive: false, time: '12:00 – 12:55 PM', subject: 'Computer Science (Python & SQL)', teacher: 'Mr. A. Banerjee · Comp Lab 2', room: 'Comp Lab 2', accent: 'primary' },
    { period: 'P5', isLive: false, time: '01:00 – 01:50 PM', subject: 'English Core (Composition)', teacher: 'Ms. K. Mukherjee · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P6', isLive: false, time: '02:00 – 02:45 PM', subject: 'Sports & Athletic Elective', teacher: 'Coach V. Sharma · Grounds', room: 'Sports Complex', accent: 'primary' },
  ],
  thu: [
    { period: 'P1', isLive: false, time: '08:30 – 09:30 AM', subject: 'Computer Science Lab (Practical)', teacher: 'Mr. A. Banerjee · Lab 2', room: 'Comp Lab 2', accent: 'tertiary' },
    { period: 'P2', isLive: false, time: '09:40 – 10:35 AM', subject: 'English Core (Grammar)', teacher: 'Ms. K. Mukherjee · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P3', isLive: false, time: '10:45 – 11:40 AM', subject: 'Mathematics II (Integration)', teacher: 'Mrs. S. Roy · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P4', isLive: false, time: '12:00 – 12:55 PM', subject: 'Physics (Electromagnetism)', teacher: 'Dr. Aris Thorne · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P5', isLive: false, time: '01:00 – 01:50 PM', subject: 'Chemistry (Polymers)', teacher: 'Mrs. D. Sen · Room 305', room: 'Room 305', accent: 'primary' },
    { period: 'P6', isLive: false, time: '02:00 – 02:45 PM', subject: 'Activity Club Period', teacher: 'Club Incharges', room: 'Activity Hall', accent: 'secondary' },
  ],
  fri: [
    { period: 'P1', isLive: false, time: '08:30 – 09:30 AM', subject: 'Mathematics II (Probability)', teacher: 'Mrs. S. Roy · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P2', isLive: false, time: '09:40 – 10:35 AM', subject: 'Physics (Modern Physics)', teacher: 'Dr. Aris Thorne · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P3', isLive: false, time: '10:45 – 11:40 AM', subject: 'Chemistry (Biomolecules)', teacher: 'Mrs. D. Sen · Room 305', room: 'Room 305', accent: 'primary' },
    { period: 'P4', isLive: false, time: '12:00 – 12:55 PM', subject: 'English Core (Creative Writing)', teacher: 'Ms. K. Mukherjee · Room 402', room: 'Room 402', accent: 'primary' },
    { period: 'P5', isLive: false, time: '01:00 – 01:50 PM', subject: 'Co-Curricular Debate / Quiz', teacher: 'Debate Coordinator', room: 'Auditorium', accent: 'secondary' },
    { period: 'P6', isLive: false, time: '02:00 – 02:45 PM', subject: 'Weekly Assessment Recap', teacher: 'Class Incharge', room: 'Room 402', accent: 'primary' },
  ],
};

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getCacheStorage(): Storage | null {
  if (!isClient()) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Extracts an identifier for the student (admission number, ID, or normalized email). */
export function getStudentIdentifier(student: Partial<Student> | null | undefined, fallbackEmail?: string): string {
  if (!student) return (fallbackEmail || 'anonymous').trim().toLowerCase();
  const id = student.admissionNumber || student.id || student.rollNo;
  if (id && String(id).trim().length > 0) {
    return String(id).trim().toUpperCase();
  }
  if (student.guardianEmail) {
    return student.guardianEmail.trim().toLowerCase();
  }
  return (fallbackEmail || 'anonymous').trim().toLowerCase();
}

/** Reads the last active student identifier recorded on this device. */
export function getActiveStudentId(): string | null {
  try {
    return getCacheStorage()?.getItem(ACTIVE_STUDENT_ID_KEY) || null;
  } catch {
    return null;
  }
}

/** Sets the current active student identifier on this device. */
export function setActiveStudentId(id: string): void {
  try {
    getCacheStorage()?.setItem(ACTIVE_STUDENT_ID_KEY, id);
  } catch {
    /* ignore */
  }
}

/**
 * Purges cached student data from localStorage if someone else's account is opened.
 * Retains only the newly authenticated student's data.
 */
export function purgeOldStudentCacheExcept(currentStudentId: string): void {
  const store = getCacheStorage();
  if (!store) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const cachedId = key.replace(CACHE_PREFIX, '');
        if (cachedId !== currentStudentId) {
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((k) => store.removeItem(k));
  } catch (err) {
    console.warn('Could not purge old student caches:', err);
  }
}

/** Retrieves the cached data for a specific student. */
export function getStudentCache(studentId: string): StudentDataCache | null {
  const store = getCacheStorage();
  if (!store || !studentId) return null;
  try {
    const raw = store.getItem(`${CACHE_PREFIX}${studentId}`);
    if (!raw) return null;
    return JSON.parse(raw) as StudentDataCache;
  } catch {
    return null;
  }
}

/** Saves or updates the cache for a specific student. */
export function saveStudentCache(data: StudentDataCache): void {
  const store = getCacheStorage();
  if (!store || !data.studentId) return;
  try {
    store.setItem(`${CACHE_PREFIX}${data.studentId}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/**
 * Initializes or restores the student data cache:
 * - If this student was cached previously, loads their cached timetable, diary, and important dates.
 * - If not, generates the initial institutional cache from default school records.
 * - Handles account switching: if someone else's account was opened, purges their old data.
 */
export function initOrRestoreStudentCache(
  student: Student,
  userEmail?: string
): StudentDataCache {
  const studentId = getStudentIdentifier(student, userEmail);
  const previousActiveId = getActiveStudentId();

  // If someone else's account was opened on this device, delete the old student's cache completely!
  if (previousActiveId && previousActiveId !== studentId) {
    purgeOldStudentCacheExcept(studentId);
  }
  setActiveStudentId(studentId);

  const existing = getStudentCache(studentId);
  const now = Date.now();

  if (existing) {
    // Re-use existing cache, updating student identity details and activity timestamp
    const updated: StudentDataCache = {
      ...existing,
      student: { ...existing.student, ...student },
      userEmail: userEmail || existing.userEmail,
      lastActiveAt: now,
    };
    saveStudentCache(updated);
    return updated;
  }

  // Create fresh cache for this student
  const initialCache: StudentDataCache = {
    version: 1,
    studentId,
    userEmail,
    student,
    importantDates: DEFAULT_IMPORTANT_DATES,
    diaryTasks: DEFAULT_DIARY_TASKS,
    timetable: DEFAULT_TIMETABLE_BY_DAY,
    cachedAt: now,
    lastActiveAt: now,
  };
  saveStudentCache(initialCache);
  return initialCache;
}

/** Add a new task to the cached student diary. */
export function addCachedDiaryTask(studentId: string, task: DiaryTask): void {
  const cache = getStudentCache(studentId);
  if (!cache) return;
  const updatedTasks = [task, ...cache.diaryTasks.filter((t) => t.id !== task.id)];
  saveStudentCache({
    ...cache,
    diaryTasks: updatedTasks,
    lastActiveAt: Date.now(),
  });
}

/** Update diary task status in the cache. */
export function updateCachedDiaryTaskStatus(
  studentId: string,
  taskId: string,
  status: 'Pending' | 'Submitted',
  fileName?: string
): void {
  const cache = getStudentCache(studentId);
  if (!cache) return;
  const updatedTasks = cache.diaryTasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          status,
          fileName: fileName || t.fileName,
          submissionDate: status === 'Submitted' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : t.submissionDate,
        }
      : t
  );
  saveStudentCache({
    ...cache,
    diaryTasks: updatedTasks,
    lastActiveAt: Date.now(),
  });
}

/** Update or customize the cached timetable schedule. */
export function updateCachedTimetable(
  studentId: string,
  timetable: Record<string, TimetablePeriod[]>
): void {
  const cache = getStudentCache(studentId);
  if (!cache) return;
  saveStudentCache({
    ...cache,
    timetable,
    lastActiveAt: Date.now(),
  });
}

/** Add a new official date / reminder to the cached student records. */
export function addCachedImportantDate(studentId: string, dateItem: ImportantDate): void {
  const cache = getStudentCache(studentId);
  if (!cache) return;
  const updatedDates = [dateItem, ...cache.importantDates.filter((d) => d.id !== dateItem.id)];
  saveStudentCache({
    ...cache,
    importantDates: updatedDates,
    lastActiveAt: Date.now(),
  });
}
