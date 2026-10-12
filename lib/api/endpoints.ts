/**
 * NexaCampus API Endpoints Catalog
 * Centralizes all 72 API endpoint paths for the Next.js frontend <-> Go backend connection.
 */

export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/api/v1/auth/session',
    REFRESH: '/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  },
  STUDENTS: {
    PROFILE: '/api/v1/studentData',
    ROSTER: '/api/v1/students',
    UPDATE: (id: string) => `/api/v1/students/${id}`,
  },
  TIMETABLE: {
    GET: '/api/v1/timeTable',
    LAB_SESSIONS: '/api/v1/timeTable/labs',
    SYLLABUS: '/api/v1/timeTable/syllabus',
  },
  DIARY: {
    ENTRIES: '/api/v1/dairy',
    CREATE: '/api/v1/dairy/entry',
  },
  HOMEWORK: {
    LIST: '/api/v1/homework',
    SUBMIT: '/api/v1/homework/submit',
  },
  ATTENDANCE: {
    LOG: '/api/v1/attendance',
    LEAVE_REQUESTS: '/api/v1/leaveRequest',
    APPLY_LEAVE: '/api/v1/leaveRequest/apply',
  },
  EXAMS: {
    TIMETABLE: '/api/v1/exam/timetable',
    HALL_TICKET: '/api/v1/exam/hallticket',
    RESULTS: '/api/v1/exam/results',
  },
  FEES: {
    SUMMARY: '/api/v1/fees',
    ORDERS: '/api/v1/payment/order',
    VERIFY: '/api/v1/payment/verify',
    RECEIPTS: '/api/v1/fees/receipts',
    TAX_RECEIPT: '/api/v1/fees/taxReceipt',
  },
  TRANSPORT: {
    BUS_GPS: '/api/v1/busTravel',
  },
  CANTEEN: {
    WALLET: '/api/v1/canteenWallet',
    ORDERS: '/api/v1/canteen/order',
  },
  HALLPASS: {
    GET: '/api/v1/hallPass',
    REQUEST: '/api/v1/hallPass/request',
  },
  HEALTH: {
    PROFILE: '/api/v1/health',
  },
  STORE: {
    CATALOG: '/api/v1/store/catalog',
    CART: '/api/v1/store/cart',
    CHECKOUT: '/api/v1/store/checkout',
  },
  LIBRARY: {
    CATALOG: '/api/v1/library',
    BORROW: '/api/v1/library/borrow',
  },
  CLUBS: {
    LIST: '/api/v1/clubs',
    POINTS: '/api/v1/clubs/points',
  },
  NOTICES: {
    LIST: '/api/v1/notices',
  },
  PARENT_DESK: {
    THREADS: '/api/v1/parentDesk',
    MESSAGES: (threadId: string) => `/api/v1/parentDesk/${threadId}/messages`,
    POST_MESSAGE: '/api/v1/parentDesk/send',
  },
  PTM: {
    SLOTS: '/api/v1/ptm/slots',
    BOOK: '/api/v1/ptm/book',
  },
  LOST_FOUND: {
    LIST: '/api/v1/lostFound',
    REPORT: '/api/v1/lostFound/report',
  },
  GALLERY: {
    ALBUMS: '/api/v1/photoGallery',
  },
  SYSTEM: {
    HEALTH: '/api/v1/health/system',
  },
} as const;

export default API_ENDPOINTS;
