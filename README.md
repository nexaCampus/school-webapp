# NexaCampus School — Web App

Mobile-first web twin of the [android-school-app](../) (EduPortal School).
Same screens, same Academic Fluidity tokens, same flows — pixel-faithful to
the Android app on phones, centered in a 430px phone column on desktop.

## Stack

- **Vite** multi-page app (one HTML entry per screen, no framework)
- **Tailwind CDN + Stitch inline token config**, kept byte-identical per page
  so web rendering cannot drift from the design source
- **@clerk/clerk-js** (vanilla) — Google OAuth redirect + email/password
- **Firebase JS SDK** — anonymous session + `students/{admissionNumber}` docs
- Production sample data mirrors the Android mock repository (Rajen Shaw,
  12-E) until the school backend lands

## Screens

| Page | Source |
|---|---|
| `index` (splash), `chooser`, `email`, `admission`, `onboarding`, `sso-callback` | Composed from the Android layouts, Stitch tokens |
| `home`, `academics`, `diary`, `notices`, `profile`, `helpdesk` | 1:1 Stitch `code.html` ports (markup untouched) |
| `attendance`, `bus`, `timetable`, `library`, `exams`, `canteen`, `ptm`, `hallpass`, `health`, `merits`, `store`, `lostfound`, `gallery`, `clubs` | Token-faithful compositions (no Stitch source exists) |

`tools/pages.mjs` regenerates every page: `node tools/pages.mjs`.
Fragments live in `fragments/*.main.html`; shared logic in `src/`
(`shell.css`, `app.js`, `page.js`, `data.js`, `firebase.js`, `clerk.js`,
`session.js`, plus per-screen `splash/email/admission/onboarding/sso-callback.js`).

## Setup

```bash
npm install
cp .env.example .env   # then fill in keys (see below)
npm run dev            # http://localhost:5173
npm run build          # -> dist/
npm run preview        # serve the production build
```

### Keys (all local-only — `.env` is git-ignored, never commit it)

- `VITE_CLERK_PUBLISHABLE_KEY` — same Clerk dev app as Android
  (`pk_test_…`; the Android `local.properties` holds the same value)
- `VITE_FIREBASE_*` — the Firebase **web** config (`nexacampusschool`)

### Console prerequisites (same as Android)

- Clerk Dashboard: Native… n/a for web — enable **Google** under SSO
  connections; phone OTP stays off (Clerk blocks India SMS); email-code
  method on if sign-up must use codes
- Google OAuth on web uses the same Clerk redirect model; production needs
  the site origin allowlisted
- Firebase: Anonymous sign-in on; Firestore `students` readable/writable by
  authenticated users

## Auth flow (mirrors Android v2.5.3)

`splash → chooser → (admission → Firebase roster | email → Google/email via
Clerk) → onboarding (new accounts: phone asked here) → home`. Session lives
in `localStorage`; content pages redirect to `chooser.html` without one.
