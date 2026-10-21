# NexaCampus Architecture & Systems Specification

## 1. System Overview

**NexaCampus School Webapp** is an institutional academic portal built on Next.js 14 (App Router), TypeScript, Tailwind CSS, Firebase Authentication & Firestore, and a distributed Go backend deployed on Render (`https://backend-school-go.onrender.com`).

The application adheres to a clean, layered architecture with strict separation of concerns, defensive error boundaries, reactive state management, and unified design token adherence (Executive Midnight Obsidian palette).

---

## 2. Layered Architecture

```mermaid
graph TD
    subgraph Presentation ["Presentation Layer (UI)"]
        Pages["App Router Pages (/home, /academics, /profile...)"]
        Common["Modular UI Components (Modal, Badge, Button, RevealMore)"]
        Feedback["Feedback Systems (ErrorBoundary, Toast)"]
    end

    subgraph DomainServices ["Domain Services Layer"]
        AuthService["AuthService (Google, Admission, Email)"]
        StudentService["StudentService (Roster, Profiles, Cache)"]
        NotifService["NotificationService (Push, In-App)"]
        AuthHook["useAuth Reactive Hook"]
    end

    subgraph StateManagement ["State Management Layer"]
        SessionStore["sessionStore (Observable, Cross-Tab Sync)"]
        LegacyFacade["lib/session.ts (Backward-Compatible Facade)"]
    end

    subgraph Infrastructure ["Infrastructure & Resilience Layer"]
        ApiClient["Resilient ApiClient (Retries, Timeouts, Envelopes)"]
        Endpoints["Endpoints Catalog (lib/api/endpoints.ts)"]
        ErrorDomain["AppError Hierarchy (lib/errors/)"]
        EnvConfig["Type-Safe Config (lib/config/env.ts)"]
    end

    subgraph External ["External Services"]
        Firebase["Firebase Auth & Firestore"]
        GoBackend["Go Academic Backend (Render)"]
    end

    Pages --> Common
    Pages --> Feedback
    Pages --> AuthHook
    AuthHook --> AuthService
    Pages --> AuthService
    Pages --> StudentService
    Pages --> NotifService

    AuthService --> SessionStore
    AuthService --> ApiClient
    AuthService --> Firebase
    StudentService --> ApiClient
    StudentService --> Firebase
    NotifService --> Firebase

    LegacyFacade --> SessionStore
    SessionStore --> EnvConfig

    ApiClient --> Endpoints
    ApiClient --> ErrorDomain
    ApiClient --> EnvConfig
    ApiClient --> GoBackend
```

---

## 3. Directory & Module Organization

```
school-webapp/
├── app/                          # Next.js App Router (one page per route)
│   ├── api/v1/[...slug]/         # Cached Go-backend proxy (GET cache + mutation passthrough)
│   ├── layout.tsx                # Root layout: fonts, metadata, providers, ErrorBoundary
│   ├── page.tsx                  # Executive campus homepage + 16-module directory
│   ├── home/ academics/ …        # Portal feature screens (one directory per module)
│   └── globals.css               # Design tokens & global styles
├── components/
│   ├── common/                   # UI primitives: Modal, Badge, Button, RevealMore (+ index barrel)
│   ├── directory/                # Campus directory: ExploreCampusesGrid, SchoolShowcaseCard,
│   │                             #   DirectoryFilterDrawer, SharePortalModal
│   ├── feedback/                 # ErrorBoundary and other resilience surfaces
│   ├── public/                   # Public chrome: PublicHeader, SchoolNavDrawer, hero carousel,
│   │                             #   marquee, faculty & transit directories
│   ├── PortalShell.tsx           # Institutional portal chrome (desktop nav, mobile tabs)
│   └── QueryProvider.tsx         # TanStack Query provider, BootSplash, Toasts, PWA
├── hooks/                        # Feature-scoped React Query hooks (useAttendance, useAuth, …)
├── lib/
│   ├── api/                      # Scalable API layer — the only place HTTP lives
│   │   ├── client.ts             # Hardened fetch: retries, timeouts, CSRF, 401 refresh
│   │   ├── endpoints.ts          # Single source of truth for every Go backend route
│   │   ├── go-client.ts          # Domain client (72 routes) with offline fallback data
│   │   ├── go-types.ts           # Response contracts for the Go backend
│   │   └── types.ts              # ApiResponse envelope & request options
│   ├── cache/                    # student-cache: TTL student record memoization
│   ├── config/                   # Centralized type-safe environment configuration
│   │   └── env.ts                # firebaseEnv, apiEnv, appEnv (no raw process.env elsewhere)
│   ├── errors/                   # AppError hierarchy + toAppError translation
│   ├── security.ts               # CSRF header helpers, cookie & token hygiene
│   ├── server/                   # Server-only helpers (LRU proxy cache)
│   ├── services/                 # Pure domain services (decoupled from UI)
│   │   ├── auth.service.ts       # Authentication workflows & session setup
│   │   ├── student.service.ts    # Student roster retrieval & updates
│   │   └── notification.service.ts # Push notification dispatch & permissions
│   ├── state/                    # Reactive state management
│   │   └── sessionStore.ts       # Observable session store with cross-tab sync
│   ├── data.ts                   # Offline fallback fixtures for the Go client
│   ├── firebase.ts               # Firebase SDK initialization
│   ├── firebase-notifications.ts # FCM registration & permission plumbing
│   ├── query-client.ts           # React Query client defaults
│   ├── query-keys.ts             # Query key factory + per-resource cache TTLs
│   └── session.ts                # Thin backward-compatible session facade
├── ARCHITECTURE.md               # This document
├── Auth.md  Security.md  DataSecurity.md  ThreatModel.md  SecurityChecklist.md
└── firestore.rules  firebase.json  middleware.ts  next.config.mjs
```

## 3.1 Documentation Set

| Document | Covers |
|---|---|
| `README.md` | Setup, stack, auth flow, page inventory |
| `ARCHITECTURE.md` | Layers, dependency rules, API contract, state management |
| `Auth.md` | Identity, providers, session lifecycle, role-based access |
| `Security.md` | Defensive coding standards and hardening baseline |
| `DataSecurity.md` | Data classification, encryption and retention lifecycle |
| `ThreatModel.md` | Attack surface map and mitigations |
| `SecurityChecklist.md` | Pre-deploy and ongoing operational checks |


### Dependency rules

1. `app/` and `components/` never call `fetch` — they go through `lib/api/`.
2. `lib/api/` never imports from `app/` or `components/`.
3. `lib/services/` holds domain logic; `hooks/` adapts it to React; pages only consume hooks.
4. `process.env` is read exclusively in `lib/config/env.ts`.


---

## 4. Key Architectural Pillars

### 4.1. Separation of Business Logic from UI
- **Zero Firebase imports in UI views**: Pages consume high-level services (`authService`, `studentService`, `notificationService`) or the reactive `useAuth()` hook.
- **Pure domain operations**: Session provisioning, admission normalization, and profile synthesis reside in domain services.

### 4.2. Reactive State Management (`lib/state/sessionStore.ts`)
- Implements an **Observer / Subscriber pattern**:
  - `subscribeSession(listener)` allows components and hooks to re-render immediately upon session transitions.
  - `storage` event listeners provide multi-tab synchronization across browser windows.
  - Decoupled from React internals, usable in vanilla TypeScript, server helpers, or hooks.

### 4.3. Scalable API Architecture (`lib/api/`)
- **Centralized Catalog (`endpoints.ts`)**: every Go backend route is declared once and consumed by
  `go-client.ts` as `API_ENDPOINTS.<GROUP>.<ACTION>`. No endpoint string is hardcoded in business
  logic, so a backend route change is a single-file edit.
- **Hardened HTTP Client (`client.ts`)**:
  - Exponential backoff retries on 5xx and network blips for idempotent requests.
  - Automatic CSRF header injection (`X-CSRF-Token`).
  - Standardized JSON envelope parsing (`ApiResponse<T>`).
  - Strict timeout guards and silent HttpOnly token rotation on `401`.
- **Domain Client (`go-client.ts`)**: exposes the full 72-route surface as typed methods and always
  resolves to a usable payload — live data when the backend answers, offline fixtures otherwise.
- **Proxy Route Handlers (`app/api/v1/[...slug]/route.ts`)**: same-origin proxy with per-resource TTLs
  and prefix invalidation on mutation, so the browser never calls the Go backend cross-origin.


### 4.4. Domain Error System (`lib/errors/AppError.ts`)
- Strongly typed error subclasses:
  - `NetworkError` (status code, endpoint)
  - `AuthenticationError`
  - `AuthorizationError`
  - `ValidationError` (field-level violation mapping)
  - `RateLimitError` (retryAfterMs support)
  - `NotFoundError`
- **React `ErrorBoundary` (`components/feedback/ErrorBoundary.tsx`)**:
  - Mounted once in `app/layout.tsx`, so any render crash anywhere in the portal tree is trapped.
  - Catches render crashes in child trees; can also be mounted locally with a custom `fallback`.
  - Provides a dignified Obsidian Midnight recovery UI with a retry trigger and diagnostic reference.

### 4.5. Centralized Configuration (`lib/config/env.ts`)
- All environment variables are extracted, validated with defaults, and strictly typed.
- Prevents raw `process.env` references scattered across the codebase.

### 4.6. Modular UI Primitives (`components/common/`)
- Reusable, accessible, keyboard-interactive components:
  - `<Modal />`: Accessible dialog with ESC dismissal, backdrop blur, and primary/danger variants.
  - `<Badge />`: Semantic status and count pills.
  - `<Button />`: Standardized button variants with loading indicators.
  - `<RevealMore />`: Phone-only progressive-reveal control (`Showing X of Y` + expand/collapse arrow) driving the micro-module directory and the security matrix.
- Homepage-local constants (`MODULES_DATA`, `SECURITY_AUDIT_CHECKS`, `buildMonthCalendar`) live in `app/page.tsx` beside the grids that consume them; shared interactive controls live here.

### 4.7. Tailwind Token Caveat (opacity modifiers)

Surface tokens are defined as `background-color: var(--color-surface, #faf8ff)` with **no `--tw-bg-opacity`**, so Tailwind cannot apply an opacity modifier to them — `bg-surface/90` silently generates no CSS and the element ships with no background at all (this once made the cookie panel fully transparent). When transparency is needed, spell out a colour Tailwind can decompose, e.g. `bg-[#faf8ff]/90`. After any change involving `/opacity` utilities, confirm the rule exists in the built stylesheet; a missing rule produces no build error.

### 4.8. Public Header Navigation & Campus Directory

- **Header nav is tenant-derived** (`components/public/PublicHeader.tsx`): the same `NAV_ITEMS` array drives the desktop nav and the mobile drawer. Platform root renders `Platform Overview` + `Academics`; a school tenant renders `About School` + `Academics` with module-aware sub-items.
- **The `Explore Campuses` entry is no longer part of the header.** The `/explore` route stays public and unchanged — it is reachable from the landing-page top bar and module grid, the `SchoolNavDrawer` ("Section 4: Explore Campuses"), the hero carousel, the portal footer, and by direct URL.
- **Campus cards (`components/directory/SchoolShowcaseCard.tsx`)** are laid out in two header rows:
  1. crest + board badge + `Estd. <year>` on the left, `Active Tenant` pill on the right;
  2. the institution name on its **own full-width row**, at `text-lg` with `break-words` and **no line clamp**.
  The name is deliberately never truncated: long institution names (e.g. "Lions Calcutta Greater Vidyamandir", "Delhi Public Academy & Senior Secondary") wrap to two lines and stay fully legible instead of collapsing to "Lions…" / "Delhi…". `Estd. <year>` carries `whitespace-nowrap` so the year never wraps away from its label.

### 4.9. Phone-First Navigation Surfaces

Every hamburger opens a **full-screen** surface on phones — no half-height sheet, no narrow side strip.

| Surface | Phone (< `sm`) | `sm` and up |
|---|---|---|
| Landing drawer (`app/page.tsx`) | `w-full max-w-none` | `max-w-sm` right-hand sheet |
| `PublicHeader` drawer (`components/public/PublicHeader.tsx`) | `h-full`, no bottom rounding | `max-h-[85vh]` bottom sheet |
| `SchoolNavDrawer` (`components/public/SchoolNavDrawer.tsx`) | `w-full max-w-none` | `max-w-md`/`max-w-lg` side sheet |
| `PortalShell` services menu (`components/PortalShell.tsx`) | already `fixed inset-0` | n/a (mobile-only) |

- **Stacking contract**: nav drawers render at `z-[60]`; the cookie banner (`components/CookieConsentBanner.tsx`) and the PWA install prompt (`components/PWARegistration.tsx`) sit at `z-40` so they can never float on top of an open menu; toasts stay at `z-50` so notifications remain visible. A drawer rendered inside a stacking context (e.g. the header) cannot out-rank a root-level overlay unless the overlay's `z` is lowered — that is why the banner and the install prompt were dropped to `z-40`.
- **Phone-only type scale**: inside the drawers, labels use the larger phone size and fall back to the compact size from `sm:` up (section headings `text-xs sm:text-[11px]`, item titles `text-sm sm:text-xs`, sub-items `text-sm sm:text-xs`, CTA buttons `text-sm sm:text-xs`). Icon tiles grow to `w-9 h-9 sm:w-8 sm:h-8` and link rows to `p-3 sm:p-2.5`.
- **Tap targets**: every hamburger is at least 40×40 px (`w-11 h-11` on phones, `w-10 h-10` on `sm` and up).
- **Header rows never overflow**: brand blocks are `min-w-0` with `truncate` so the school name yields space instead of pushing the menu button off-screen; the landing header drops the duplicate platform menu button for school tenants (the school drawer button already covers it) and shortens `Enter Portal` to `Portal` on phones.

---

## 5. Security & Defensive Design
- **Color Consistency**: Strict adherence to the Executive Midnight Obsidian theme (`#12131a`, `#151622`, `#1a1c2b`, `#222538`, `#3b49df`, `#eaedff`).
- **Defensive Fallbacks**: Google auth synthesizes a complete student profile if Firestore roster queries fail or records are missing, ensuring students are never stranded.
- **CSRF & Token Integrity**: All API mutations pass through validated tokens and session storage caches.
