// Production sample data. Values mirror the Android MockSchoolRepository
// one-for-one (Rajen Shaw, 12-E, October 2026) so the web twin shows
// exactly what the app shows before the school backend lands.
export const student = {
  id: '10211125',
  name: 'Rajen Shaw',
  displayName: 'Rajen Shaw',
  grade: '12',
  section: 'E',
  rollNo: '20',
  academicYear: '2026-2027',
  schoolName: 'Lions Calcutta Gr Vidya Mandir',
  schoolCode: 'LCGVM-KOL',
  dob: '10-02-2007',
  gender: 'Male',
  bloodGroup: 'A +ve',
  fatherName: 'Krishna Shaw',
  motherName: 'Geeta Shaw',
  contactPhone: '+91 91798 0679513',
  emergencyPhone: '+91 91798 0679513',
  guardianEmail: 'krishnashaw2005@gmail.com',
  residentialAddress: 'Subhasgram, Manasatala Park, Chak Harinavi, Kolkata - 700147',
  busRouteNo: 'Route 14-A',
  pickupPoint: 'Ultadanga Junction (07:35 AM)',
  attendancePct: 96.2,
  streakDays: 14,
  qrToken: 'STU-LCGVM-10211125-2026',
};

export const feeSummary = {
  totalFee: 14200.0,
  paidAmount: 9750.0,
  pendingBalance: 4450.0,
  nextDueDate: 'Oct 30, 2026',
  termName: 'Term 2 - AY 2026-2027',
};

export const feeRecords = [
  { id: 'f1', title: 'Tuition Fee (Quarterly)', subtitle: 'Mandatory Academic Instruction', amount: 3100.0, due: 'Oct 30, 2026', paid: false, invoice: 'INV-2026-Q2-01' },
  { id: 'f2', title: 'STEM Robotics Lab Fee', subtitle: 'Material & Equipment Maintenance', amount: 250.0, due: 'Oct 30, 2026', paid: false, invoice: 'INV-2026-Q2-02' },
  { id: 'f3', title: 'Computer & Digital Library', subtitle: 'E-Portal License + Campus Wi-Fi', amount: 400.0, due: 'Oct 30, 2026', paid: false, invoice: 'INV-2026-Q2-03' },
  { id: 'f4', title: 'Co-curricular & Athletics', subtitle: 'Inter-school Tournaments & Arts', amount: 300.0, due: 'Oct 30, 2026', paid: false, invoice: 'INV-2026-Q2-04' },
  { id: 'f5', title: 'Annual Admission Overhead', subtitle: 'Cleared on Jul 14 · Ref #88219', amount: 4200.0, due: 'Jul 15, 2026', paid: true, invoice: 'INV-2026-ADM' },
  { id: 'f6', title: 'Quarter 1 Tuition Fee', subtitle: 'Cleared on Jul 14 · Ref #88220', amount: 3750.0, due: 'Jul 15, 2026', paid: true, invoice: 'INV-2026-Q1' },
  { id: 'f7', title: 'Transport Service Q1', subtitle: 'Cleared on Jun 02 · Ref #87102', amount: 1800.0, due: 'Jun 05, 2026', paid: true, invoice: 'INV-2026-TR-01' },
];

export const notices = [
  { id: 'n-1', tag: 'URGENT', title: 'Resumption of Regular Offline Classes & Mandatory Attendance', date: 'Thursday · 2:23 PM', author: 'Biswarup Paul', role: 'Sr. Academic Coord' },
  { id: 'n-2', tag: 'EXAM', title: 'Mid-Term Assessment Date Sheet — Classes 10 & 12', date: 'Wednesday · 11:05 AM', author: 'Exam Cell', role: 'Controller Office' },
  { id: 'n-3', tag: 'EVENT', title: 'Inter-House Science Exhibition on Oct 24 — Registration Open', date: 'Tuesday · 9:41 AM', author: 'Activity Desk', role: 'Co-curricular' },
  { id: 'n-4', tag: 'FEE', title: 'Term 2 Fee Deadline Extended to Oct 30 Without Late Fine', date: 'Monday · 4:18 PM', author: 'Accounts', role: 'Fee Office' },
];

export const homework = [
  { id: 'hw-1', subject: 'Mathematics II', unit: 'Ex 7.3', title: 'Calculus Problem Set 4', teacher: 'Dr. Aris Thorne', due: 'Tomorrow, 11:59 PM' },
  { id: 'hw-2', subject: 'Physics', unit: 'Ch 9', title: 'Ray Optics Numericals 1–15', teacher: 'Dr. Aris Thorne', due: 'Friday, 11:59 PM' },
  { id: 'hw-3', subject: 'Chemistry', unit: 'Ch 12', title: 'Aldehydes & Ketones Worksheet', teacher: 'Mrs. D. Sen', due: 'Monday, 11:59 PM' },
];

export const attendance = {
  totalWorkingDays: 24,
  daysPresent: 22,
  daysAbsent: 1,
  daysLate: 1,
  officialHolidays: 5,
  overallPercentage: 95.8,
  currentStreak: 14,
};

export const bus = {
  routeNumber: 'Route 14-A',
  vehiclePlate: 'WB-02-AK-9821',
  driverName: 'Rajeshwar Singh',
  driverPhone: '+91 98312 45890',
  nextStopName: 'Ultadanga Crossing',
  etaMinutes: 7,
  studentStopName: 'Ultadanga Junction',
  studentScheduledTime: '07:35 AM',
};

export const libraryBooks = [
  { id: 'b-1', title: 'Concepts of Physics (Vol 1 & 2)', author: 'Dr. H. C. Verma', acc: 'ACC-PHY-8842', category: 'Textbooks' },
  { id: 'b-2', title: 'Clean Code: Agile Software', author: 'Robert C. Martin', acc: 'ACC-CS-2041', category: 'Computer Science' },
  { id: 'b-3', title: 'Higher Algebra & Calculus Methods', author: 'Hall & Knight', acc: 'ACC-MTH-9021', category: 'Textbooks' },
];

export const canteen = {
  balance: 42.5,
  dailyLimit: 15.0,
  spentToday: 6.2,
  menu: [
    { id: 'c-1', name: 'Steamed Veggie Dimsums', meal: 'Lunch', price: 4.5 },
    { id: 'c-2', name: 'Club Sandwich with Mint Dip', meal: 'Breakfast', price: 3.2 },
  ],
  transactions: [
    { id: 'tx-101', when: 'Today, 11:15 AM', what: 'Cold Brew Chocolate Milk + Fruit Bowl', amount: 5.0 },
    { id: 'tx-102', when: 'Yesterday, 01:20 PM', what: 'Whole Wheat Club Wrap + Fresh Orange Juice', amount: 4.2 },
  ],
};

export const hallTicket = {
  termName: 'Mid-Term Assessment 2026',
  candidateName: 'Rajen Shaw',
  rollNo: '24',
  admNo: '10211125',
  className: 'Grade 12 · Section E',
  centerCode: 'LCGVM-EX-004',
  seatNumber: 'BLOCK C / SEAT #18',
  qrToken: 'HALL-MID-2026-10211125',
};

export const ptmTeachers = [
  { id: 't-1', name: 'Mrs. S. Roy', subject: 'Mathematics & Class Incharge', cabin: 'Cabin 402 · Academic Block' },
  { id: 't-2', name: 'Dr. Aris Thorne', subject: 'Senior Physics Faculty', cabin: 'Cabin 304 · Science Wing' },
];

export const hallPass = {
  passId: 'PASS-9042',
  destination: 'Science Lab 3 (Optics Room)',
  status: 'ACTIVE',
  issuedBy: 'Dr. Aris Thorne',
  issuedTime: '10:15 AM',
  totalMinutes: 15,
};

export const health = {
  bloodGroup: 'O +ve',
  heightCm: 176,
  weightKg: 64,
  allergies: ['Peanuts', 'Penicillin', 'Asthma Inhaler Required'],
  nurseCabinPhone: '+91 33 2456 7890 (Ext. 112)',
};

export const storeItems = [
  { id: 's-1', name: 'Senior School Blazer', price: 2850.0 },
  { id: 's-2', name: 'House T-Shirt (Blue)', price: 650.0 },
  { id: 's-3', name: 'Lab Record + Graph Bundle', price: 320.0 },
];

export const lostFound = [
  { id: 'lf-1', title: 'Black Casio Calculator', loc: 'Room 402', date: 'Oct 02' },
  { id: 'lf-2', title: 'Blue Tiffin Box (Steel)', loc: 'Canteen Counter 1', date: 'Sep 30' },
];

export const clubs = [
  { id: 'c-1', name: 'Robotics Club', members: 42 },
  { id: 'c-2', name: 'Debate Society', members: 35 },
  { id: 'c-3', name: 'Astronomy Club', members: 28 },
];
