/**
 * NexaCampus API Endpoints Catalog
 *
 * Single source of truth for every route exposed by the Go backend
 * (https://backend-school-go.onrender.com). Consumed by `lib/api/go-client.ts`
 * so that no endpoint path is hardcoded inside business logic.
 *
 * Paths are relative to `apiEnv.apiBaseUrl`. Query parameters are expressed as
 * `(query)` builders to keep encoding concerns out of call sites.
 */

export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/api/v1/auth/session',
    REFRESH: '/v1/auth/refresh',
  },
  STUDENTS: {
    PROFILE: '/api/v1/studentData',
    PROFILE_FOR: (admissionId: string) => `/api/v1/studentData?admissionId=${encodeURIComponent(admissionId)}`,
    CREATE: '/api/v1/newStudentData',
    UPDATE: '/api/v1/updateStudentData',
  },
  ACADEMICS: {
    TIMETABLE: '/api/v1/timeTable',
    TIMETABLE_FOR: (classGrade: string, section: string) =>
      `/api/v1/timeTable?classGrade=${encodeURIComponent(classGrade)}&section=${encodeURIComponent(section)}`,
    LAB_TIMETABLE: '/api/v1/labTimeTable',
    SYLLABUS: '/api/v1/syllabus',
    DIARY: '/api/v1/dairy',
    HOMEWORK: '/api/v1/homework',
    HOMEWORK_SUBMIT: '/api/v1/homework/submit',
  },
  ATTENDANCE: {
    LOG: '/api/v1/attendance',
    LEAVE_REQUESTS: '/api/v1/leaveRequest',
  },
  EXAMS: {
    TIMETABLE: '/api/v1/examTimeTable',
    ADMIT_CARD: '/api/v1/exam',
    RESULTS: '/api/v1/results',
  },
  FEES: {
    SUMMARY: '/api/v1/fees/summary',
    CREATE_ORDER: '/api/v1/payment',
    VERIFY_PAYMENT: '/api/v1/payment/verify',
    HISTORY: '/api/v1/paymentHistory',
    TAX_RECEIPT: '/api/v1/taxReceipt',
  },
  TRANSPORT: {
    BUS_GPS: '/api/v1/busTravel',
  },
  CANTEEN: {
    WALLET: '/api/v1/canteenWallet',
    RECHARGE: '/api/v1/canteenWallet/recharge',
    ORDER_HISTORY: '/api/v1/canteenFoodOrdered',
  },
  HALLPASS: {
    GET: '/api/v1/hallPass',
  },
  HEALTH: {
    STUDENT: '/api/v1/studentHealthInfo',
    SYSTEM: '/api/v1/health',
  },
  STORE: {
    CATALOG: '/api/v1/schoolStoreItems',
  },
  LIBRARY: {
    CATALOG: '/api/v1/library',
  },
  CLUBS: {
    ACTIVITIES: '/api/v1/clubsAndActivities',
    HOUSE_POINTS: '/api/v1/housePoints',
  },
  LOST_FOUND: {
    ITEMS: '/api/v1/lostItems',
  },
  GALLERY: {
    ALBUMS: '/api/v1/photoGalleryAlbums',
  },
  PARENT_DESK: {
    THREADS: '/api/v1/parentDesk',
  },
  PTM: {
    SEARCH_TEACHERS: '/api/v1/ptmSearchTeachers',
  },
  NOTICES: {
    LIST: '/api/v1/notices',
  },
} as const;

export type ApiEndpointGroup = keyof typeof API_ENDPOINTS;

export default API_ENDPOINTS;
