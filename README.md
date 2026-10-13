# NexaCampus School — Web App

Mobile-first web twin of the [android-school-app](../) (EduPortal School).
Same screens, same Academic Fluidity tokens, same flows — pixel-faithful to
the Android app on phones, centered in a 430px phone column on desktop.

## Stack

- **Next.js 15 App Router + TypeScript** — one `app/<route>/page.tsx` per
  screen, all UI as `.tsx` (no HTML files anywhere)
- **Tailwind CSS v3 (compiled)** with the design tokens declared in
  `tailwind.config.js` and `app/globals.css` — no CDN at runtime
- **Firebase JS SDK** — Email/Password + Google providers for sign-in,
  anonymous session + `students/{admissionNumber}` docs
- **Go backend on Render** (`backend-school-go.onrender.com`) — reached through
  the typed client in `lib/api/`; every call degrades to bundled fixtures when
  the network or backend is unavailable
- Production sample data mirrors the Android mock repository (Rajen Shaw,
  12-E) until the school backend lands

## Architecture

Layering, dependency rules and the API contract are specified in
[ARCHITECTURE.md](./ARCHITECTURE.md). Security posture lives in
[Security.md](./Security.md) and [ThreatModel.md](./ThreatModel.md).

```
app/ & components/  →  hooks/  →  lib/services/  →  lib/api/  →  Go backend
                                    ↓
                             lib/state/, lib/cache/
```


## Screens

| Page | Source |
|---|---|
| `page` (executive homepage), `chooser`, `email`, `admission`, `onboarding` | Composed from the Android layouts and design tokens |
| `home`, `academics`, `diary`, `notices`, `profile`, `helpdesk` | 1:1 ports of the original Stitch `code.html` screens |
| `attendance`, `bus`, `timetable`, `library`, `exams`, `canteen`, `ptm`, `hallpass`, `health`, `merits`, `store`, `lostfound`, `gallery`, `clubs` | Token-faithful compositions (no Stitch source exists) |
| `maker` | Powered by the [SchoolMaker Extension](https://github.com/nexaCampus/schoolapp-nexacampus-maker) studio engine |

Auth pages live directly in `app/<route>/page.tsx`; shared code in `lib/`
(`api/`, `services/`, `state/`, `cache/`, `config/`), reusable UI in
`components/`, styling in `app/globals.css`.

## Extensions & Modular Ecosystem

### [SchoolMaker Extension (`schoolapp-nexacampus-maker`)](https://github.com/nexaCampus/schoolapp-nexacampus-maker)
- **Role**: Dedicated multi-tenant school creator studio extension mounted under `/maker`.
- **Repository**: [https://github.com/nexaCampus/schoolapp-nexacampus-maker](https://github.com/nexaCampus/schoolapp-nexacampus-maker)
- **Features**:
  - Independent creator phone authentication with OTP verification.
  - Institutional leadership role selection (Founder, President, Principal, Trustee, Director, IT Administrator).
  - School capacity, faculty headcount (teacher count), board affiliation (CBSE, ICSE, CISCE, State, IB, Cambridge), and campus location.
  - Selective modular access toggle engine for 15+ micro-modules (Canteen, Bus, Library, Attendance, Homework Diary, Exams, Timetable, Fees, Hallpass, Clubs, Health, Notices, PTM, Store, Lost & Found).
  - Instant generated school portal preview and interactive simulator.



## Setup

```bash
npm install
cp .env.example .env.local   # then fill in keys (see below)
npm run dev                  # http://localhost:3000
npm run build                # type-check + prerender (must stay green)
npm start                    # serve the production build
```

### Keys (all local-only — `.env.local` is git-ignored, never commit it)

- `NEXT_PUBLIC_FIREBASE_*` — the Firebase **web** config (`nexacampusschool`)

### Console prerequisites

- Firebase Authentication → Sign-in method: enable **Email/Password** and
  **Google**. Under Authentication → Settings → Authorized domains, add every
  origin you serve from (`localhost`, your LAN IP for phone testing, and the
  production domain later) — otherwise Google sign-in fails closed.
- Firebase: Anonymous sign-in on; Firestore `students` readable/writable by
  authenticated users (rules below).

### Firestore rules (paste in Firestore → Rules → Publish)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{admissionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Auth flow

`splash → chooser → (admission → Firebase roster | email → Google redirect or
email/password via Firebase Auth) → onboarding (new accounts: phone asked in
its own Contact Number section) → home`. Session lives in `localStorage`;
content pages redirect to `/chooser` without one.

Email sign-up shows a verification dialog (Gmail link instruction with
Continue/Resend/Start-over) and never opens onboarding until the link is
clicked; onboarding bounces unverified password emails back to `/email`. Google uses
an interactive popup with automatic redirect fallback, ensuring instant account
selection on localhost and mobile without storage-partitioning loops; users
without a completed student profile route directly to `/onboarding` prefilled
with their Google name and email.
