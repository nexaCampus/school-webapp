# NexaCampus School — Web App

Mobile-first web twin of the [android-school-app](../) (EduPortal School).
Same screens, same Academic Fluidity tokens, same flows — pixel-faithful to
the Android app on phones, centered in a 430px phone column on desktop.

## Stack

- **Next.js 15 App Router + TypeScript** — one `app/<route>/page.tsx` per
  screen, all UI as `.tsx` (no HTML files anywhere)
- **Tailwind CSS v3 (compiled)** with the Stitch Academic Fluidity tokens
  extracted verbatim into `tailwind.config.cjs` — same classes, same look,
  no CDN at runtime
- **Firebase JS SDK** — Email/Password + Google providers for sign-in,
  anonymous session + `students/{admissionNumber}` docs (Clerk was retired on
  web: it does not deliver SMS to India)
- Production sample data mirrors the Android mock repository (Rajen Shaw,
  12-E) until the school backend lands

## Screens

| Page | Source |
|---|---|
| `index` (splash), `chooser`, `email`, `admission`, `onboarding` | Composed from the Android layouts, Stitch tokens |
| `home`, `academics`, `diary`, `notices`, `profile`, `helpdesk` | 1:1 Stitch `code.html` ports (markup untouched) |
| `attendance`, `bus`, `timetable`, `library`, `exams`, `canteen`, `ptm`, `hallpass`, `health`, `merits`, `store`, `lostfound`, `gallery`, `clubs` | Token-faithful compositions (no Stitch source exists) |

`tools/html-to-tsx.mjs` converted the Stitch screens and composed module
fragments into `app/` pages (since removed along with all HTML once the
conversion was verified). Hand-written auth pages live directly in
`app/<route>/page.tsx`; shared code in `lib/` (`data`, `firebase`,
`session`), styling in `app/globals.css`.

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
