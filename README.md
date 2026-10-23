# NexaCampus School — Web App

Mobile-first web twin of the [android-school-app](../) (EduPortal School), grown into a
**multi-tenant Academic Operating System**. Same screens, same Academic Fluidity tokens,
same flows — pixel-faithful to the Android app on phones, centered in a 430px phone column
on desktop, full-width executive layout for every other surface.

## Highlights

- **Cinematic boot splash** on the landing route — a deep-navy, choreographed reveal
  (Framer Motion) that replays on every reload, never on in-app navigation, collapses
  under `prefers-reduced-motion`, and unmounts cleanly (`components/SplashScreen.tsx`).
- **Canonical tenant URLs** — every school lives on its own subdomain
  (`https://<slug>.school-webapp-self.vercel.app`); the legacy `/school/<slug>` path
  form 308-redirects to it at the edge (`middleware.ts`).
- **Signed edge sessions** — `POST /api/auth/session` mints an HttpOnly
  HMAC-SHA256 cookie after verifying a Firebase ID token, an admission number against
  the Go roster, or a SchoolMaker creator token; the edge guard protects `/admin`
  and `/admin/cms` with it (`lib/auth/`, `components/common/RequireSession.tsx`).

## Stack

- **Next.js 15 App Router + TypeScript** — one `app/<route>/page.tsx` per
  screen, all UI as `.tsx` (no HTML files anywhere)
- **Tailwind CSS v4 (CSS-first)** — design tokens declared in `app/globals.css`
  (`@theme`, `@custom-variant dark`) bridged to the legacy `tailwind.config.js`
  tokens; compiled at build time, no CDN at runtime
- **Framer Motion** — boot-splash choreography (emblem, gradient wordmark,
  scan line, `fade`/`portal` exit variants)
- **Firebase JS SDK** — Email/Password + Google providers for sign-in,
  anonymous session + `students/{admissionNumber}` docs
- **Go orchestrator backend on Render** (`backend-school-go.onrender.com`,
  [schoolapp-nexacampus-maker-backend](https://github.com/nexaCampus/schoolapp-nexacampus-maker-backend))
  — reached through the typed client in `lib/api/`; every call degrades to
  bundled fixtures when the network or backend is unavailable. The backend keeps
  its master tenant catalogue in **Turso Cloud SQLite** (local SQLite fallback)
  and also serves a **gRPC** `nexacampus.v1` data plane on `GRPC_PORT`

## Tenant URL model

| Surface | URL |
|---|---|
| Student portal (canonical) | `https://<slug>.school-webapp-self.vercel.app` |
| Admin portal (canonical) | `https://<slug>.admin.school-webapp-self.vercel.app` |
| DNS-bound custom domain | `https://<slug>.nexacampus.tech` |
| Legacy path form | `/school/<slug>` → **308** to the canonical subdomain |

Single source of truth: `lib/tenantUrls.ts`; host patterns in `middleware.ts`
and `lib/context/TenantContext.tsx`. Session/tenant cookies are issued for the
shared parent domain so a signed-in visitor stays signed in across the host change.

## Architecture

Layering, dependency rules and the API contract are specified in
[ARCHITECTURE.md](./.agents/ARCHITECTURE.md). Security posture lives in
[Security.md](./.agents/Security.md) and [ThreatModel.md](./.agents/ThreatModel.md).

```
middleware (edge guard)  →  app/ & components/  →  hooks/  →  lib/services/  →  lib/api/  →  Go backend
        ↑                                                    ↓                                  (REST + gRPC, Turso)
 POST /api/auth/session  ←  lib/auth (signed cookie)    lib/state/, lib/cache/
```

## Screens

| Page | Source |
|---|---|
| `page` (executive homepage), `chooser`, `email`, `admission`, `onboarding` | Composed from the Android layouts and design tokens |
| `home`, `academics`, `diary`, `notices`, `profile`, `helpdesk` | 1:1 ports of the original Stitch `code.html` screens |
| `attendance`, `bus`, `timetable`, `library`, `exams`, `canteen`, `ptm`, `hallpass`, `health`, `merits`, `store`, `lostfound`, `gallery`, `clubs` | Token-faithful compositions (no Stitch source exists) |
| `maker` | Powered by the [SchoolMaker Extension](https://github.com/nexaCampus/schoolapp-nexacampus-maker) studio engine |

Auth pages live directly in `app/<route>/page.tsx`; shared code in `lib/`
(`api/`, `services/`, `state/`, `cache/`, `config/`, `auth/`), reusable UI in
`components/`, styling in `app/globals.css`.

## Extensions & Modular Ecosystem

### [SchoolMaker Extension (`schoolapp-nexacampus-maker`)](https://github.com/nexaCampus/schoolapp-nexacampus-maker)
- **Role**: Dedicated multi-tenant school creator studio extension mounted under `/maker`.
- **Repository**: [https://github.com/nexaCampus/schoolapp-nexacampus-maker](https://github.com/nexaCampus/schoolapp-nexacampus-maker)
- **Features**:
  - Independent creator phone authentication with OTP verification (and a signed
    creator session minted on success).
  - Institutional leadership role selection (Founder, President, Principal, Trustee, Director, IT Administrator).
  - School capacity, faculty headcount (teacher count), board affiliation (CBSE, ICSE, CISCE, State, IB, Cambridge), and campus location.
  - Selective modular access toggle engine for 15+ micro-modules (Canteen, Bus, Library, Attendance, Homework Diary, Exams, Timetable, Fees, Hallpass, Clubs, Health, Notices, PTM, Store, Lost & Found).
  - Instant generated school portal preview, launched on the tenant's own subdomain.

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
- `SESSION_SECRET` — HMAC secret (≥ 32 chars, `openssl rand -base64 32`) for the
  signed session cookie; must be identical for the app server and the edge runtime
- `NEXT_PUBLIC_CANONICAL_APP_HOST` — optional override when the webapp is served
  from a host other than `school-webapp-self.vercel.app`

> `public/firebase-messaging-sw.js` is **generated**, never committed:
> `npm run dev` / `npm run build` produce it from
> `public/firebase-messaging-sw.template.js` plus your env values, so no Firebase
> key is ever checked in.

### Console prerequisites

- Firebase Authentication → Sign-in method: enable **Email/Password** and
  **Google**. Under Authentication → Settings → Authorized domains, add every
  origin you serve from (`localhost`, your LAN IP for phone testing, and the
  production domain later) — otherwise Google sign-in fails closed.
- Firebase: Anonymous sign-in on; Firestore `students` readable/writable by
  authenticated users (rules below).
- Vercel: wildcard domain `*.school-webapp-self.vercel.app` so the canonical
  tenant subdomains resolve.

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
its own Contact Number section) → home`. The web session lives in
`localStorage`; content pages redirect to `/chooser` without one.

Email sign-up shows a verification dialog (Gmail link instruction with
Continue/Resend/Start-over) and never opens onboarding until the link is
clicked; onboarding bounces unverified password emails back to `/email`. Google uses
an interactive popup with automatic redirect fallback, ensuring instant account
selection on localhost and mobile without storage-partitioning loops; users
without a completed student profile route directly to `/onboarding` prefilled
with their Google name and email.

Alongside the web session, the edge recognises the signed `school_auth_token`
cookie (minted by `POST /api/auth/session`, verified in `middleware.ts`) — it
gates `/admin` and `/admin/cms` and anchors the shared-cookie tenant session
across tenant subdomains.
