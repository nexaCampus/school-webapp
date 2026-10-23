# NexaCampus Threat Model & Attack Surface Map (`ThreatModel.md`)

> **Institutional Scope**: Lions Calcutta Greater Vidya Mandir (LCGVM), WB-243  
> **Methodology**: STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)  
> **Version**: 2.6.0 | **Last Updated**: October 2026

---

## 1. System Architecture & Attack Surface Map

The NexaCampus application consists of a hybrid edge architecture interfacing with modern cloud services:

```
                      [ External Untrusted Clients / Web Browsers ]
                                          │
                        HTTPS / TLS 1.3 Strict Transport
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Next.js 15 Edge Middleware Guard   │
                      │       - Inspects session cookies      │
                      │       - Whitelists legal routes       │
                      │       - Rejects unauthenticated paths │
                      └───────────────────┬───────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Next.js App Router (React Server)  │
                      │       - Sanitizes client inputs       │
                      │       - Renders server components     │
                      │       - Dispatches secure API proxies │
                      └───────┬───────────────────────┬───────┘
                              │                       │
                              ▼                       ▼
                    [Firebase Platform]     [Render Go Backend]
                    - Firebase Auth         - Low-latency Go API
                    - Cloud Firestore       - RFID & Bus Radar
                    - Cloud Storage         - Microservice Ledger
```

---

## 2. Inventory of Entry Points

| Entry Point | Method / Type | Input Data | Target Destination |
|---|---|---|---|
| `/admission` | Form Input | Admission Number (e.g. `LCGVM-2024-8902`) | Firebase Roster & Local Session |
| `/email` | Form Input | Email, Password, Verification Token | Firebase Auth Engine |
| `/onboarding` | Form Input | Student Name, Class, Section, DOB, Contact Mobile, Guardian Info | Cloud Firestore `/students` |
| `/helpdesk` | Form Input | Subject, Description, Category, Priority | Firestore Grievance Tickets |
| `/lostfound` | Form / Modal | Item Title, Campus Location, Category (Lost/Found) | Campus Proctor Log |
| `/data-deletion` | Form Input | Admission ID, Guardian Email, Reason for Erasure | Statutory DPO Queue |
| `/api/v1/[...slug]` | HTTP REST | JSON Payloads, Auth Headers | Go Microservice Gateway |

---

## 3. Critical Assets to Protect

1. **Student Personal Identifiable Information (PII)**: Full name, residential address, emergency contact numbers, date of birth.
2. **Academic & Assessment Records**: Exam marks, report cards, class teacher observations, attendance logs.
3. **Financial & Canteen Wallets**: RFID smart canteen stored value, campus store transaction receipts.
4. **Physical Safety & Telemetry**: Live school bus GPS tracking coordinates, real-time campus clinic visits.
5. **System Credentials & Infrastructure**: Cloud project secrets, database service accounts, Vercel deployment credentials.

---

## 4. Threat Matrix (STRIDE Analysis) & Defenses

### A. Spoofing (Identity Impersonation)
- **Threat**: Attacker crafts a fake admission ID to view another student's attendance and marks.
- **Defense**:
  - Admission IDs must match verified student roster documents in Firestore.
  - Email/Google authentication enforces verified email token ownership (`user.emailVerified`).
  - Edge route guard in `middleware.ts` validates signed cookies before servicing any dashboard page.

### B. Tampering (Unauthorized Data Alteration)
- **Threat**: Malicious actor modifies exam scores, alters fee receipts, or injects malicious payloads into lost & found items.
- **Defense**:
  - Input sanitization via `sanitizeHtml()` in [`lib/security.ts`](file:///e:/nexaCampus/android-school-app/school-webapp/lib/security.ts) neutralizes HTML/script tags.
  - Server-enforced permissions prevent non-faculty accounts from updating academic marks.
  - Firestore security rules block unauthorized updates to protected student records.

### C. Repudiation (Denial of Action)
- **Threat**: User denies booking a PTM slot, submitting a deletion request, or claiming a lost item.
- **Defense**:
  - Explicit audit trails with timestamps, authenticated UIDs, and IP hash signatures are stored for all administrative requests.
  - Data deletion tickets generate permanent confirmation identifiers (`DEL-YYYYMMDD-XXXX`).

### D. Information Disclosure (Data Leaks & Exposure)
- **Threat**: Verbose error messages leak database connection strings or stack traces; student data leaked via SSRF or unauthorized API endpoints.
- **Defense**:
  - `validateSafeHttpsUrl()` prevents SSRF attacks targeting internal IPs (`127.0.0.1`, `169.254.169.254`, RFC 1918 subnets).
  - Next.js production error boundaries suppress internal error details from the browser.
  - Secrets are kept out of `NEXT_PUBLIC_` namespaces to avoid exposure in client JavaScript bundles.

### E. Denial of Service (DoS & Rate Abuse)
- **Threat**: High-frequency automated requests overwhelm the login endpoints or exhaustion of cloud database read quotas.
- **Defense**:
  - Client-side input debouncing (`debounce()`).
  - Next.js static page pre-rendering (35/35 routes statically compiled for ultra-fast CDN delivery).
  - Edge rate-limiting and payload size ceiling (10 MB upload ceiling via `validateUploadFile()`).

### F. Elevation of Privilege (Unauthorized Escalation)
- **Threat**: A student modifies their client session or token claims to gain teacher or administrative privileges.
- **Defense**:
  - Strict role checks on the backend: client session claims are validated against server-side Firestore records.
  - Firestore security rules disallow non-admin users from modifying user role flags.
