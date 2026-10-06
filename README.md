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
- **@clerk/nextjs** — `ClerkProvider` in the root layout, `clerkMiddleware`
  with the `/__clerk/:path*` matcher, Google OAuth via redirect callback
  route, email/password custom flow with hooks
- **Firebase JS SDK** — anonymous session + `students/{admissionNumber}` docs
- Production sample data mirrors the Android mock repository (Rajen Shaw,
  12-E) until the school backend lands

## Screens

| Page | Source |
|---|---|
| `index` (splash), `chooser`, `email`, `admission`, `onboarding`, `sso-callback` | Composed from the Android layouts, Stitch tokens |
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

### Keys (all local-only — `.env` is git-ignored, never commit it)

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — same Clerk dev app as Android
  (`pk_test_…`; the Android `local.properties` holds the same value)
- `NEXT_PUBLIC_FIREBASE_*` — the Firebase **web** config (`nexacampusschool`)
- `CLERK_SECRET_KEY` — server-side; pull with `clerk env pull` (never commit)

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
