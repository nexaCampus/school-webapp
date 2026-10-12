// NexaCampus Core System API - Type Definitions
// Corresponds 1:1 with the Go (Fiber/Chi) Backend Route Matrix (72 Core Endpoints + Essential Companions)

export interface AuditReference {
  auditRef: string; // NEXA-YYYYMMDD-XXXX
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REJECTED';
  message?: string;
}

// -------------------------------------------------------------
// 1. Auth & Security
// -------------------------------------------------------------
export interface AuthSessionRequest {
  clientToken: string;
  provider?: 'firebase' | 'email' | 'google' | 'admission';
  deviceInfo?: string;
}

export interface AuthSessionResponse {
  jwt: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    uid: string;
    admissionId?: string;
    role: 'student' | 'parent' | 'teacher' | 'admin' | 'superadmin';
    name: string;
    email?: string;
    classGrade?: string;
    section?: string;
  };
  auditRef: string;
}

// -------------------------------------------------------------
// 2. Student Records
// -------------------------------------------------------------
export interface StudentProfileData {
  id: string;
  admissionId: string;
  rollNo: string;
  name: string;
  displayName: string;
  grade: string;
  section: string;
  academicYear: string;
  schoolName: string;
  schoolCode: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  contactPhone: string;
  emergencyPhone: string;
  guardianEmail: string;
  residentialAddress: string;
  busRouteNo?: string;
  pickupPoint?: string;
  attendancePct?: number;
  streakDays?: number;
  photoUrl?: string;
  qrToken?: string;
  healthNotes?: string[];
  auditRef?: string;
}

export interface NewStudentRequest {
  admissionId: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  contactPhone: string;
  guardianEmail: string;
  residentialAddress: string;
}

export interface UpdateStudentRequest {
  residentialAddress?: string;
  emergencyPhone?: string;
  contactPhone?: string;
  photoUrl?: string;
}

// -------------------------------------------------------------
// 3. Academics & Timetable
// -------------------------------------------------------------
export interface TimetablePeriod {
  periodNo: number;
  timeSlot: string;
  subject: string;
  teacherName: string;
  roomNo: string;
  isLab?: boolean;
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface TimeTableResponse {
  classGrade: string;
  section: string;
  academicTerm: string;
  weeklySchedule: DayTimetable[];
  auditRef: string;
}

export interface LabSessionItem {
  id: string;
  subject: string;
  labName: string;
  instructorName: string;
  roomNo: string;
  day: string;
  timing: string;
  safetyGuidelines: string[];
}

export interface SyllabusChapter {
  chapterNo: number;
  title: string;
  topics: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  targetDate: string;
  referencePdfUrl?: string;
}

export interface SubjectSyllabus {
  subject: string;
  code: string;
  totalChapters: number;
  completedChapters: number;
  completionPct: number;
  chapters: SyllabusChapter[];
}

export interface SyllabusResponse {
  classGrade: string;
  academicYear: string;
  subjects: SubjectSyllabus[];
  auditRef: string;
}

// -------------------------------------------------------------
// 4. Academics & Conduct (Diary & Homework)
// -------------------------------------------------------------
export interface DiaryEntryItem {
  id: string;
  date: string;
  category: 'REMARK' | 'ALERT' | 'OBSERVATION' | 'ACADEMIC';
  teacherName: string;
  subject?: string;
  title: string;
  content: string;
  isRead?: boolean;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface CreateDiaryRequest {
  studentId?: string;
  grade: string;
  section: string;
  category: 'REMARK' | 'ALERT' | 'OBSERVATION' | 'ACADEMIC';
  title: string;
  content: string;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface HomeworkItemData {
  id: string;
  subject: string;
  unit: string;
  title: string;
  description: string;
  teacherName: string;
  dueDate: string;
  assignedDate: string;
  referencePdfUrl?: string;
  submissionStatus?: 'PENDING' | 'SUBMITTED' | 'EVALUATED';
  submissionGrade?: string;
}

export interface SubmitHomeworkRequest {
  homeworkId: string;
  notes?: string;
  fileUrl?: string;
  submissionDate?: string;
}

// -------------------------------------------------------------
// 5. Attendance & Leaves
// -------------------------------------------------------------
export interface AttendanceLogRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HOLIDAY' | 'EXCUSED';
  remarks?: string;
}

export interface AttendanceResponseData {
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  officialHolidays: number;
  overallPercentage: number;
  currentStreak: number;
  monthlyLogs: AttendanceLogRecord[];
  auditRef: string;
}

export interface LeaveRequestItemData {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  category: 'MEDICAL' | 'FAMILY' | 'PLANNED' | 'EMERGENCY';
  documentUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewerNotes?: string;
  submittedAt: string;
  auditRef: string;
}

export interface CreateLeaveRequestPayload {
  startDate: string;
  endDate: string;
  reason: string;
  category: 'MEDICAL' | 'FAMILY' | 'PLANNED' | 'EMERGENCY';
  documentUrl?: string;
}

// -------------------------------------------------------------
// 6. Examinations
// -------------------------------------------------------------
export interface ExamDateSlot {
  examId: string;
  termName: string;
  subject: string;
  date: string;
  sessionTime: string;
  roomNo: string;
  syllabusRange: string;
  maxMarks: number;
}

export interface ExamTimetableResponseData {
  termName: string;
  classGrade: string;
  rules: string[];
  slots: ExamDateSlot[];
  auditRef: string;
}

export interface AdmitCardPayload {
  termName: string;
  candidateName: string;
  rollNo: string;
  admissionId: string;
  classGrade: string;
  centerCode: string;
  seatNumber: string;
  qrToken: string;
  examSlots: ExamDateSlot[];
  auditRef: string;
}

export interface SubjectMarksRecord {
  subject: string;
  maxMarks: number;
  marksObtained: number;
  gradePoint: number;
  letterGrade: string;
  percentile: number;
  teacherRemarks?: string;
}

export interface ExamResultsData {
  termName: string;
  studentName: string;
  rollNo: string;
  totalMarks: number;
  maxTotalMarks: number;
  aggregatePct: number;
  gpa: number;
  rankInClass?: number;
  rankInSection?: number;
  subjects: SubjectMarksRecord[];
  principalRemarks: string;
  auditRef: string;
}

// -------------------------------------------------------------
// 7. Finance & Fees
// -------------------------------------------------------------
export interface FeeSummaryData {
  totalFee: number;
  paidAmount: number;
  pendingBalance: number;
  nextDueDate: string;
  termName: string;
  currency: string;
  dueObligations: FeeRecordItem[];
  auditRef: string;
}

export interface FeeRecordItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  due: string;
  paid: boolean;
  invoice: string;
  category?: string;
}

export interface CreateFeePaymentRequest {
  feeRecordIds: string[];
  amount: number;
  studentId: string;
  paymentMethod?: 'razorpay' | 'upi' | 'netbanking';
}

export interface FeePaymentOrderResponse {
  orderId: string;
  checkoutToken: string;
  amount: number;
  currency: string;
  keyId: string;
  auditRef: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  auditRef?: string;
}

export interface PaymentReceiptData {
  transactionId: string;
  orderId: string;
  amountPaid: number;
  settledAt: string;
  paymentMethod: string;
  invoiceNo: string;
  receiptPdfUrl?: string;
  auditRef: string;
}

export interface TaxReceiptRequest {
  paymentId: string;
  parentGstin?: string;
  billingName: string;
  billingAddress: string;
}

export interface TaxReceiptResponse {
  taxInvoiceNo: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  pdfUrl?: string;
  auditRef: string;
}

// -------------------------------------------------------------
// 8. Logistics & Transport (Bus)
// -------------------------------------------------------------
export interface BusTravelData {
  routeNumber: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  conductorName?: string;
  conductorPhone?: string;
  nextStopName: string;
  etaMinutes: number;
  studentStopName: string;
  studentScheduledTime: string;
  telemetry: {
    lat: number;
    lng: number;
    speedKmH: number;
    heading: number;
    lastUpdated: string;
  };
  auditRef: string;
}

// -------------------------------------------------------------
// 9. Campus Services (Canteen)
// -------------------------------------------------------------
export interface CanteenWalletData {
  balance: number;
  dailyLimit: number;
  spentToday: number;
  studentCardId: string;
  recentTransactions: {
    id: string;
    timestamp: string;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
  }[];
  menu: CanteenMenuItem[];
  auditRef: string;
}

export interface CanteenMenuItem {
  id: string;
  name: string;
  mealCategory: 'Breakfast' | 'Lunch' | 'Snacks' | 'Beverage';
  price: number;
  calories?: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface CanteenOrderRecord {
  orderId: string;
  timestamp: string;
  items: { itemId: string; name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  collectionToken: string;
  qrCodeToken: string;
  status: 'PREPARING' | 'READY_FOR_PICKUP' | 'COLLECTED' | 'EXPIRED';
  auditRef: string;
}

// -------------------------------------------------------------
// 10. Campus Safety (Hall Pass)
// -------------------------------------------------------------
export interface HallPassData {
  passId: string;
  studentId: string;
  studentName: string;
  destination: 'Restroom' | 'Library' | 'Clinic' | 'Administrative Office' | 'Lab';
  issuedBy: string;
  issuedTime: string;
  expiresTime: string;
  validityMinutes: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  qrToken: string;
  auditRef: string;
}

// -------------------------------------------------------------
// 11. Health & Infirmary
// -------------------------------------------------------------
export interface StudentHealthInfoData {
  bloodGroup: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  chronicConditions: string[];
  emergencyCarePlan?: string;
  nurseCabinPhone: string;
  clinicVisits: {
    id: string;
    visitDate: string;
    complaint: string;
    treatmentGiven: string;
    nurseName: string;
    vitalSigns?: { bp?: string; temp?: string; pulse?: number };
  }[];
  auditRef: string;
}

// -------------------------------------------------------------
// 12. School Store
// -------------------------------------------------------------
export interface StoreCatalogItemData {
  id: string;
  name: string;
  category: 'Uniform' | 'Stationery' | 'Books' | 'Lab Equipment';
  price: number;
  availableSizes?: string[];
  inStock: boolean;
  stockCount?: number;
  imageUrl?: string;
}

export interface StoreCartItem {
  itemId: string;
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StoreCartData {
  items: StoreCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface StoreOrderResult {
  orderId: string;
  items: StoreCartItem[];
  totalAmount: number;
  orderStatus: 'PENDING_PAYMENT' | 'CONFIRMED' | 'PACKED' | 'DELIVERED';
  pickupCode: string;
  auditRef: string;
}

// -------------------------------------------------------------
// 13. Digital Library
// -------------------------------------------------------------
export interface LibraryBookItem {
  id: string;
  title: string;
  author: string;
  accessionNumber: string;
  category: string;
  isbn?: string;
  shelfLocation: string;
  isAvailable: boolean;
  dueDate?: string;
  isBorrowedByMe?: boolean;
}

// -------------------------------------------------------------
// 14. Extracurricular (Clubs & Houses)
// -------------------------------------------------------------
export interface ClubActivityData {
  id: string;
  name: string;
  description: string;
  facultyLead: string;
  meetingSchedule: string;
  memberCount: number;
  isEnrolled?: boolean;
}

export interface HouseDirectoryItem {
  houseName: 'Phoenix' | 'Falcon' | 'Hercules' | 'Orion' | string;
  colorHex: string;
  houseCaptain: string;
  staffPatron: string;
  totalPoints: number;
  rank: number;
}

export interface HousePointsLeaderboardData {
  academicYear: string;
  houses: HouseDirectoryItem[];
  recentPointEvents: {
    id: string;
    houseName: string;
    eventName: string;
    pointsAwarded: number;
    awardedBy: string;
    awardedAt: string;
    justification: string;
    auditRef: string;
  }[];
  auditRef: string;
}

// -------------------------------------------------------------
// 15. Campus Support (Lost & Found)
// -------------------------------------------------------------
export interface LostItemRecordData {
  id: string;
  title: string;
  category: 'Electronics' | 'Stationery' | 'Clothing' | 'Containers' | 'Valuables';
  locationFound: string;
  dateReported: string;
  status: 'UNCLAIMED' | 'CLAIM_PENDING' | 'RETURNED';
  photoUrl?: string;
  description?: string;
}

// -------------------------------------------------------------
// 16. Media & Events (Photo Gallery)
// -------------------------------------------------------------
export interface PhotoGalleryAlbumData {
  albumId: string;
  title: string;
  eventYear: string;
  date: string;
  coverPhotoUrl: string;
  photoCount: number;
  photos: {
    photoId: string;
    url: string;
    caption: string;
  }[];
}

// -------------------------------------------------------------
// 17. Communications (Parent Desk / Helpdesk)
// -------------------------------------------------------------
export interface ParentDeskMessageData {
  messageId: string;
  senderRole: 'parent' | 'teacher' | 'admin';
  senderName: string;
  content: string;
  sentAt: string;
  attachments?: string[];
}

export interface ParentDeskThreadData {
  threadId: string;
  studentId: string;
  studentName: string;
  subject: string;
  assignedTeacher: string;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  lastUpdated: string;
  unreadCount: number;
  messages: ParentDeskMessageData[];
  auditRef: string;
}

// -------------------------------------------------------------
// 18. PTM Management
// -------------------------------------------------------------
export interface PtmTeacherSlotData {
  teacherId: string;
  teacherName: string;
  subject: string;
  cabin: string;
  ptmDate: string;
  timeSlots: {
    slotId: string;
    window: string;
    isBooked: boolean;
    bookedByMe?: boolean;
  }[];
}

// -------------------------------------------------------------
// 19. Notifications & Broadcasts
// -------------------------------------------------------------
export interface NoticeItemData {
  id: string;
  tag: 'URGENT' | 'EXAM' | 'EVENT' | 'FEE' | 'GENERAL';
  title: string;
  date: string;
  issuedAt: string;
  author: string;
  role: string;
  content?: string;
  attachmentPdfUrl?: string;
  isUrgent?: boolean;
}

// -------------------------------------------------------------
// 20. Staff Administration & System Health
// -------------------------------------------------------------
export interface StaffMemberData {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'coordinator' | 'accountant' | 'nurse' | 'driver' | 'admin';
  designation: string;
  department: string;
  assignedClass?: string;
  phone: string;
  active: boolean;
}

export interface GoSystemHealthData {
  status: 'UP' | 'HEALTHY';
  uptimeSeconds: number;
  goVersion: string;
  memoryMb: number;
  activeGoroutines: number;
  dbPingMs: number;
  timestamp: string;
}
