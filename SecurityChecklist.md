# NexaCampus Operational Security Checklist (`SecurityChecklist.md`)

> **Institutional Scope**: Lions Calcutta Greater Vidya Mandir (LCGVM), WB-243  
> **Target Audience**: AI Agents, Code Reviewers, Release Engineers, DevOps  
> **Version**: 2.6.0 | **Last Updated**: October 2026

---

## 1. Purpose & Enforcement

This document defines the mandatory gatekeeping checklists that must be satisfied before any branch is merged into `main` and before any build is deployed to production. **Every checkbox must be verified and checked.**

---

## 2. Phase 1: Local Development & Pre-Commit Checklist

Prior to creating any Git commit:

- [ ] **No Hardcoded Secrets**:
  - Run `git diff` to ensure no API keys, private tokens, passwords, or service account JSON files are staged.
  - Verify `.env.local` is untouched in Git staging.
- [ ] **Input Sanitization**:
  - Every form input and text field accepts sanitized values using `sanitizeHtml()`.
  - Date inputs validate format using `validateDateFormatYYYYMMDD()`.
- [ ] **Defensive Error Handling**:
  - All asynchronous promises and API calls are wrapped in `try/catch` blocks.
  - User-facing error messages are sanitized and do not reveal server stack traces or database connection details.
- [ ] **Accessibility & Alt Text**:
  - All interactive buttons have visible or `aria-label` accessible text.
  - Images and SVG emblems carry descriptive `alt` or `role="img"` attributes.
- [ ] **Type Safety & Build Cleanliness**:
  - Run `npx tsc --noEmit` locally with zero TypeScript errors.

---

## 3. Phase 2: Pull Request & Pre-Merge Checklist

Prior to approving or merging any PR into `main`:

- [ ] **Dependency Audit**:
  - Run `npm audit` to verify no newly introduced dependencies contain critical or high severity vulnerabilities.
  - Package versions strictly pinned in `package-lock.json`.
- [ ] **Route Guard & Authorization Coverage**:
  - Verify that any new page or API route is either:
    - Added to `middleware.ts` under `publicPaths` (if intentionally public, such as legal or splash pages), OR
    - Protected by the edge authentication check requiring `school_auth_token` or `school_session_active`.
  - Verify Firestore security rules cover newly introduced collections or document fields.
- [ ] **Statutory & Form Consent Compliance**:
  - Any form collecting student or parent data contains an explicit opt-in checkbox.
  - Registration flows enforce verifiable parental consent (DPDP Act 2023 §9).
  - No dark patterns (no forced opt-ins, pre-checked marketing boxes, or hidden charges).
- [ ] **Production Build Verification**:
  - Execute `npm run build` and ensure all static pages (35/35 routes) compile cleanly.
- [ ] **Squash Merge Workflow**:
  - PR title follows conventional commits (e.g. `feat(security): ...`, `fix(auth): ...`).
  - Merge performed via `gh pr merge <id> --squash --delete-branch`.

---

## 4. Phase 3: Pre-Deploy Checklist

Prior to deploying to Vercel or Render production:

- [ ] **Environment Variable Parity**:
  - Verify all required environment variables (`NEXT_PUBLIC_FIREBASE_*`, `RENDER_BACKEND_URL`, etc.) are configured in Vercel project settings.
  - Production secrets match live cloud infrastructure keys.
- [ ] **HTTPS & HSTS Enforcement**:
  - Verify `next.config.mjs` enforces HSTS (`max-age=63072000; includeSubDomains; preload`).
  - Verify Content Security Policy and frame-ancestors headers are intact.
- [ ] **Safe Production Logging**:
  - Verify `console.log` statements do not dump user credentials, session tokens, or student phone numbers.
- [ ] **Cookie Security Flags**:
  - Authentication cookies must have `SameSite=Lax` or `SameSite=Strict`, `Secure` (HTTPS only), and `HttpOnly` where applicable.

---

## 5. Phase 4: Post-Deploy Verification

Immediately following production deployment:

- [ ] **Live Health Check**:
  - Inspect production deployment status: must report `READY`.
  - Verify homepage (`/`) loads with 200 OK.
- [ ] **Legal & Statutory Route Check**:
  - Verify public access to `/privacy`, `/terms`, `/refund`, `/cookies`, and `/data-deletion`.
  - Confirm the Cookie Consent Banner displays and persists consent choices.
- [ ] **Authentication Flow Check**:
  - Test `/chooser`, `/admission`, and `/email` entry points.
  - Verify unauthenticated deep-links to `/home` or `/attendance` redirect appropriately to `/chooser`.
- [ ] **Backend Connectivity Check**:
  - Verify Go microservice connectivity at `https://backend-school-go.onrender.com/health` or `/api/v1/health`.

---

## 6. Emergency Incident Response

In the event of an identified security vulnerability or leaked credential:
1. **Immediate Revocation**: Invalidate the compromised key immediately in Firebase Console or cloud provider.
2. **Session Flush**: Force-expire all active `school_auth_token` cookies.
3. **Emergency Patch**: Deploy hotfix branch directly to `main` with expedited review.
4. **Audit Logging**: Notify the Data Protection Officer (DPO) at `privacy@lcgvm.edu.in` within 72 hours per DPDP Act guidelines.
