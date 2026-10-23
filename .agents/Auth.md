# NexaCampus Identity, Authentication & Role-Based Access Control (`Auth.md`)

> **Institutional Scope**: Lions Calcutta Greater Vidya Mandir (LCGVM), WB-243  
> **Target Audience**: AI Agents, System Architects, Backend & Frontend Developers  
> **Version**: 2.6.0 | **Last Updated**: October 2026

---

## 1. Authentication Architecture

NexaCampus supports three institutional authentication paths managed via Firebase Authentication with session mirroring in HTTP cookies:

```
                                  [ User Visits NexaCampus ]
                                               │
                                       [/chooser Portal]
                     ┌─────────────────────────┼─────────────────────────┐
                     ▼                         ▼                         ▼
         [Google OAuth 2.0]        [Email & Password]        [Admission ID Auth]
                 │                             │                         │
         Firebase Auth Token         Email Verification Gate    Anonymous Session +
                 │                             │                 Roster Match
                 └─────────────────────────────┼─────────────────────────┘
                                               ▼
                              [Client Session & Cookie Sync]
                                  - school_auth_token
                                  - school_session_active
                                               ▼
                                 [Next.js Edge Middleware]
                                               ▼
                                  [Protected Campus Portal]
```

### Supported Identity Providers
1. **Google OAuth 2.0**: Fast, verified sign-in for school Gmail/Google accounts.
2. **Institutional Email & Password**: Requires email verification link (`user.emailVerified === true`) before onboarding or dashboard access.
3. **CISCE Admission Number Authentication**: Validates the student's unique admission identifier against the school database roster (`normalizeAdmissionNumber()`).

---

## 2. Session Management & Lifecycle

### A. Cookies & Tokens
- **`school_auth_token`**: Secure, signed session token verified by the backend and edge middleware.
- **`school_session_active`**: Lightweight session indicator cookie used for rapid edge routing decisions.
- **`sessionStorage` / `localStorage`**:
  - `session`: Contains client display metadata (`name`, `provider`, `student`).
  - Cached tokens must expire within **7 days** or immediately on explicit logout.

### B. Session Invalidation & Revocation
- **Explicit Logout**:
  - Clear Firebase Auth: `signOutUser()`.
  - Delete session cookies: `school_auth_token` and `school_session_active` expired with `Max-Age=0`.
  - Flush `sessionStorage` and `localStorage` session keys.
  - Hard redirect to `/chooser`.
- **Edge Route Guard (`middleware.ts`)**:
  - Any request attempting to access protected corridors (`/home`, `/attendance`, `/diary`, `/exams`, `/canteen`, `/bus`, `/health`, `/helpdesk`, `/store`, `/timetable`) without valid session cookies is immediately bounced to `/chooser?redirect=<path>`.

---

## 3. Role-Based Access Control (RBAC)

NexaCampus enforces strict role separation across four distinct institutional personas:

| Persona | Identification | Primary Scope | Permitted Actions |
|---|---|---|---|
| **Student** | Verified Admission ID | Personal student records | View own timetable, attendance, marks, diary, canteen RFID balance, bus radar, file lost & found reports. |
| **Parent / Guardian** | Verified Guardian Email / Phone | Enrolled child's profile | View academic progress, fee receipts, pay school fees, book PTM slots, submit helpdesk grievance tickets. |
| **Faculty / Proctor** | Faculty School Email | Assigned classroom & courses | Mark daily attendance, publish diary assignments, log exam scores, review lost & found claims, issue hall passes. |
| **Admin / Management** | Authorized Administrator UID | Institutional Campus Operations | Manage master student roster, broadcast campus circulars, audit canteen transactions, manage data deletion requests. |

---

## 4. Permission Matrix by Route & Endpoint

| Route / Module | Public | Student | Parent | Faculty | Admin | Enforcement Mechanism |
|---|:---:|:---:|:---:|:---:|:---:|---|
| `/` (Homepage) | ✅ | ✅ | ✅ | ✅ | ✅ | Public |
| `/privacy`, `/terms`, `/refund`, `/cookies`, `/data-deletion` | ✅ | ✅ | ✅ | ✅ | ✅ | `middleware.ts` Whitelist |
| `/chooser`, `/email`, `/admission`, `/onboarding` | ✅ | ✅ | ✅ | ✅ | ✅ | Public Auth Gateway |
| `/home` (Dashboard) | ❌ | ✅ | ✅ | ✅ | ✅ | Edge Guard + Session Cache |
| `/attendance` | ❌ | ✅ (Own) | ✅ (Child) | ✅ (Class) | ✅ (All) | Edge Guard + Firestore Rules |
| `/diary` (Homework) | ❌ | ✅ (Read) | ✅ (Read) | ✅ (Write) | ✅ (Write) | Edge Guard + Firestore Rules |
| `/exams` (Report Cards) | ❌ | ✅ (Own) | ✅ (Child) | ✅ (Class) | ✅ (All) | Edge Guard + Backend JWT |
| `/canteen` (RFID Wallet) | ❌ | ✅ (Own) | ✅ (Fund) | ✅ (Read) | ✅ (Ledger) | Edge Guard + Go Microservice |
| `/bus` (Live GPS Radar) | ❌ | ✅ (Route) | ✅ (Route) | ✅ (Fleet) | ✅ (Fleet) | Edge Guard + Realtime Sync |
| `/helpdesk` | ❌ | ✅ (Own) | ✅ (Own) | ✅ (Reply) | ✅ (Resolve) | Edge Guard + Firestore Rules |
| `/data-deletion` (Erasure Ticket) | ✅ | ✅ | ✅ | ✅ | ✅ | Public Form + Admin Processing |

---

## 5. Security Rules for AI Agents Implementing Auth

1. **Never trust client-reported user IDs**: Always extract the caller's identity from `request.auth.uid` on the server or in Firestore security rules.
2. **Prevent Insecure Direct Object References (IDOR / BOLA)**:
   ```typescript
   // ❌ UNSAFE: Allows student A to view student B's report card
   export async function GET(request: NextRequest) {
     const studentId = request.nextUrl.searchParams.get('id');
     return db.getStudent(studentId);
   }

   // ✅ SAFE: Enforces that the session user matches the requested student ID or is authorized
   export async function GET(request: NextRequest) {
     const session = await getAuthenticatedSession(request);
     if (!session || (session.studentId !== requestedId && session.role !== 'admin')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
     }
     return db.getStudent(session.studentId);
   }
   ```
3. **Mandatory Parental Verification**: Under DPDP Act 2023 §9, minors cannot register accounts independently without verifiable parental/guardian consent recorded during onboarding.
4. **No Password Storage in Plaintext**: Password hashing and salting are delegated strictly to Firebase Authentication; never store raw passwords anywhere.
