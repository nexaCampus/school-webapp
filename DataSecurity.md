# NexaCampus Data Classification, Encryption & Lifecycle Policy (`DataSecurity.md`)

> **Institutional Scope**: Lions Calcutta Greater Vidya Mandir (LCGVM), WB-243  
> **Target Audience**: AI Agents, Cloud Architects, Database Administrators, Compliance Officers  
> **Version**: 2.6.0 | **Last Updated**: October 2026

---

## 1. Data Classification Framework

All information processed, stored, or transmitted by NexaCampus must be classified into one of four sensitivity tiers:

```
┌─────────────────────────────────────────────────────────────────┐
│ Tier 4: Restricted Educational & Health Records                │
│ (Clinic Vitals, Biometric/RFID Ledgers, Disciplinary Records)  │
├─────────────────────────────────────────────────────────────────┤
│ Tier 3: Confidential Personal Identifiable Information (PII)    │
│ (Student Full Name, DOB, Residential Address, Parent Contacts)  │
├─────────────────────────────────────────────────────────────────┤
│ Tier 2: Internal Campus Operations Data                        │
│ (Class Timetables, Room Assignments, House Points, Merits)      │
├─────────────────────────────────────────────────────────────────┤
│ Tier 1: Public Institutional Information                        │
│ (School Calendar, CISCE Affiliation Notices, Fees Schedule)     │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Classification Table

| Tier | Category | Examples | Access Controls | Retention Mandate |
|---|---|---|---|---|
| **Tier 1: Public** | Institutional Notices | Academic calendar, fee structure, holiday notices | Public read access, no authentication required | Retained indefinitely or archived annually |
| **Tier 2: Internal** | School Logistics | Bell schedules, teacher room rosters, house merit tallies | Authenticated school students and faculty only | Retained for current academic session |
| **Tier 3: Confidential** | Personal Identifiable Information | Student admission number, date of birth, home address, parent mobile, guardian email | Restricted to verified student, their legal guardian, and school administration | Retained throughout student tenure + 3 years post-graduation |
| **Tier 4: Restricted** | High-Sensitivity Records | Medical clinic vitals, emergency allergies, smart canteen RFID balances, exam marks | Enforced encryption, strict RBAC, no client-side caching | Retained per CISCE statutory academic guidelines |

---

## 2. Encryption Standards

### A. Encryption in Transit (Data on the Wire)
1. **Enforce HTTPS / TLS 1.3**: All communication between the browser, Vercel edge, Firebase services, and Render Go backend (`backend-school-go.onrender.com`) must use TLS 1.2+ (preferred TLS 1.3).
2. **HTTP Strict Transport Security (HSTS)**:
   - Configured in `next.config.mjs` with `max-age=63072000; includeSubDomains; preload`.
   - Insecure HTTP requests are automatically upgraded and rejected at the edge.
3. **API & Microservice Communication**:
   - Backend calls between Next.js server actions and the Go microservice must transmit over encrypted HTTPS with mutual shared secret or bearer token headers.

### B. Encryption at Rest (Data Stored)
1. **Database Encryption**: All Firestore collections and PostgreSQL database volumes are encrypted using **AES-256** encryption keys managed by Google Cloud Platform / AWS.
2. **Local Storage & Cache Storage**:
   - Client-side storage (`localStorage`, `sessionStorage`) must only hold minimal session metadata.
   - **Never store sensitive PII** (e.g., medical allergies, full payment card numbers, plaintext passwords) in unencrypted browser storage.
3. **Backup Encryption**:
   - Institutional database backups must be encrypted with separate key sets before being stored in cold cloud storage.

---

## 3. Access Limitation & Processing Boundaries

1. **Principle of Need-to-Know**:
   - Background workers and cron jobs have scoped credentials limited exclusively to their functional task.
   - Firestore security rules restrict reads: students cannot query the global `/students` collection.
2. **No Data Commercialization**:
   - NexaCampus enforces a strict non-commercialization pledge: student, parent, and faculty data is never sold, licensed, or shared with third-party marketing brokers or advertising networks.
3. **Parental Super-Consent for Minors**:
   - Aligned with the **Digital Personal Data Protection Act (DPDP Act 2023, Section 9)**, processing minor data requires verifiable parental consent recorded during initial profile creation.

---

## 4. Data Retention & Automated Deletion Lifecycle

### A. Retention Schedule
- **Active Enrolled Students**: Records maintained for the full duration of school enrollment.
- **Graduated / Transferred Students**: CISCE core transcripts archived for 7 years; operational tokens, canteen wallets, and RFID tags decommissioned within 90 days.
- **Temporary Uploads**: Exam revision drafts, lost & found photo submissions are automatically purged after 180 days.

### B. Right to Erasure (Statutory Deletion)
- Users and parents may request complete record erasure at any time via the self-service portal at [`/data-deletion`](file:///e:/nexaCampus/android-school-app/school-webapp/app/data-deletion/page.tsx).
- Deletion requests generate an audit ticket with a formal fulfillment SLA of **30 calendar days**.
- Deletion workflow:
  1. Administrative review against statutory CISCE archive requirements.
  2. Removal of personal identifiers (name, address, phone number, DOB) from active operational collections.
  3. Purge of cached tokens and sessions.
  4. Confirmation receipt dispatched to the guardian's verified email.
