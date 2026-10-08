// NexaCampus Complete Query Key Namespace & TTL Registry
// Mirrors backend-school-go in-memory L1/L2 caching engine and hierarchical key namespaces

export const CACHE_TTLS = {
  // Ultra-fast changing (15s - 1m)
  HALLPASS_ACTIVE: 15 * 1000,          // 15 sec
  CANTEEN_WALLET: 30 * 1000,           // 30 sec
  TRANSPORT_GPS: 60 * 1000,            // 1 min
  PTM_SLOTS: 60 * 1000,                // 1 min

  // Fast changing / active student state (2m - 3m)
  STUDENT_DASHBOARD: 2 * 60 * 1000,    // 2 min
  ATTENDANCE_MONTHLY: 2 * 60 * 1000,   // 2 min
  ATTENDANCE_SUMMARY: 2 * 60 * 1000,   // 2 min
  ATTENDANCE_LEAVES: 2 * 60 * 1000,    // 2 min
  LIBRARY_BORROWED: 2 * 60 * 1000,     // 2 min
  HELPDESK_TICKETS: 2 * 60 * 1000,     // 2 min
  STORE_ORDERS: 2 * 60 * 1000,         // 2 min
  LOST_FOUND: 2 * 60 * 1000,           // 2 min
  HOMEWORK_LIST: 3 * 60 * 1000,        // 3 min

  // Standard student & campus records (5m)
  STUDENT_PROFILE: 5 * 60 * 1000,      // 5 min
  NOTICES_LIST: 5 * 60 * 1000,         // 5 min
  FEES_SUMMARY: 5 * 60 * 1000,         // 5 min
  LIBRARY_BOOKS: 5 * 60 * 1000,        // 5 min
  HEALTH_PROFILE: 5 * 60 * 1000,       // 5 min
  HEALTH_VISITS: 5 * 60 * 1000,        // 5 min
  HEALTH_CONSENTS: 5 * 60 * 1000,      // 5 min
  MERITS_SUMMARY: 5 * 60 * 1000,       // 5 min
  MERITS_RECORDS: 5 * 60 * 1000,       // 5 min
  CLUBS_ENROLLED: 5 * 60 * 1000,       // 5 min

  // Slow changing / institutional entities (10m - 15m)
  HOMEWORK_DETAIL: 10 * 60 * 1000,     // 10 min
  ACADEMICS_REPORT: 10 * 60 * 1000,    // 10 min
  PTM_SESSIONS: 10 * 60 * 1000,        // 10 min
  STORE_PRODUCTS: 10 * 60 * 1000,      // 10 min
  CLUBS_COMPETITIONS: 10 * 60 * 1000,  // 10 min
  TIMETABLE: 15 * 60 * 1000,           // 15 min
  CANTEEN_MENU: 15 * 60 * 1000,        // 15 min
  EXAMS_HALLTICKET: 15 * 60 * 1000,    // 15 min
  GALLERY_ALBUMS: 15 * 60 * 1000,      // 15 min
  GALLERY_PHOTOS: 15 * 60 * 1000,      // 15 min
} as const;

export const queryKeys = {
  student: {
    all: ['student'] as const,
    profile: (id: string) => ['student', 'profile', id] as const,
    dashboard: (id: string, grade: string, section: string) =>
      ['student', 'dashboard', id, grade, section] as const,
  },
  homework: {
    all: ['homework'] as const,
    list: (grade: string, section: string, status = 'all') =>
      ['homework', 'list', grade, section, status] as const,
    detail: (id: string) => ['homework', 'detail', id] as const,
  },
  attendance: {
    all: ['attendance'] as const,
    monthly: (id: string, month: number, year: number) =>
      ['attendance', 'monthly', id, month, year] as const,
    summary: (id: string) => ['attendance', 'summary', id] as const,
    leaves: (id: string) => ['attendance', 'leaves', id] as const,
  },
  notices: {
    all: ['notices'] as const,
    list: (category = 'all', limit = 20) => ['notices', 'list', category, limit] as const,
  },
  fees: {
    all: ['fees'] as const,
    summary: (id: string) => ['fees', 'summary', id] as const,
    history: (id: string) => ['fees', 'history', id] as const,
  },
  timetable: {
    all: ['timetable'] as const,
    schedule: (grade: string, section: string, day: string | number) =>
      ['timetable', grade, section, String(day)] as const,
    lab: () => ['timetable', 'lab'] as const,
  },
  transport: {
    all: ['transport'] as const,
    route: (routeNumber: string) => ['transport', 'route', routeNumber] as const,
  },
  library: {
    all: ['library'] as const,
    books: (query = '') => ['library', 'books', query] as const,
    borrowed: (id: string) => ['library', 'borrowed', id] as const,
  },
  exams: {
    all: ['exams'] as const,
    timetable: (grade: string) => ['exams', 'timetable', grade] as const,
    hallticket: (id: string, term = 'midterm') => ['exams', 'hallticket', id, term] as const,
    results: (id: string, term = 'quarter1') => ['exams', 'results', id, term] as const,
  },
  canteen: {
    all: ['canteen'] as const,
    wallet: (id: string) => ['canteen', 'wallet', id] as const,
    menu: (category = 'all') => ['canteen', 'menu', category] as const,
    orders: (id: string) => ['canteen', 'orders', id] as const,
  },
  helpdesk: {
    all: ['helpdesk'] as const,
    tickets: (id: string) => ['helpdesk', 'tickets', id] as const,
  },
  academics: {
    all: ['academics'] as const,
    reportcard: (id: string, term: string) => ['academics', 'reportcard', id, term] as const,
    syllabus: (grade: string) => ['academics', 'syllabus', grade] as const,
  },
  ptm: {
    all: ['ptm'] as const,
    sessions: (term: string) => ['ptm', 'sessions', term] as const,
    slots: (sessionId: string) => ['ptm', 'slots', sessionId] as const,
  },
  hallpass: {
    all: ['hallpass'] as const,
    active: (id: string) => ['hallpass', 'active', id] as const,
  },
  health: {
    all: ['health'] as const,
    profile: (id: string) => ['health', 'profile', id] as const,
    visits: (id: string) => ['health', 'visits', id] as const,
    consents: (id: string) => ['health', 'consents', id] as const,
  },
  merits: {
    all: ['merits'] as const,
    summary: (id: string) => ['merits', 'summary', id] as const,
    records: (id: string) => ['merits', 'records', id] as const,
    housePoints: () => ['merits', 'housePoints'] as const,
  },
  store: {
    all: ['store'] as const,
    products: (category = 'all') => ['store', 'products', category] as const,
    orders: (id: string) => ['store', 'orders', id] as const,
  },
  lostfound: {
    all: ['lostfound'] as const,
    items: (status = 'all') => ['lostfound', 'items', status] as const,
  },
  gallery: {
    all: ['gallery'] as const,
    albums: (year: string) => ['gallery', 'albums', year] as const,
    photos: (albumId: string) => ['gallery', 'photos', albumId] as const,
  },
  clubs: {
    all: ['clubs'] as const,
    enrolled: (id: string) => ['clubs', 'enrolled', id] as const,
    competitions: (grade: string) => ['clubs', 'competitions', grade] as const,
  },
} as const;
