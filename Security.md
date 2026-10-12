# NexaCampus Security Architecture & Defensive Coding Standards (`Security.md`)

> **Institutional Scope**: Lions Calcutta Greater Vidya Mandir (LCGVM), WB-243  
> **Target Audience**: AI Agents, Vibe Coders, Core Contributors, Code Reviewers  
> **Version**: 2.6.0 | **Last Updated**: October 2026

---

## 1. Executive Security Mission

NexaCampus manages the academic, logistical, financial, and personal records of over 2,400 students and their families. When generating or modifying code within this repository, **defensive engineering must take precedence over convenience**. Every AI model or developer contributing code must adhere strictly to these core rules before proposing or merging changes.

---

## 2. The Four Cardinal Rules

### 1. Protect Secrets & Credentials
- **Never hardcode secrets**: API keys, private certificates, service account tokens, database passwords, or JWT secrets must never exist in repository code, Git history, commit messages, or PR descriptions.
- **Strict Environment Segregation**:
  - Public browser keys must use the `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`) and must never possess administrative or service-role write permissions.
  - Server-only secrets (e.g., Firebase Admin private keys, Go microservice tokens, encryption salts) must **never** carry the `NEXT_PUBLIC_` prefix and must never be imported into client components (`'use client'`).
- **Secret Verification**: Always verify `.gitignore` excludes `.env`, `.env.local`, `.env.production`, and credential JSON files.

### 2. Validate & Sanitize All Input
- **Zero Trust on Incoming Data**: Treat every URL parameter, search query, JSON body, file upload, header, and cookie as potentially hostile.
- **Mandatory Sanitization**:
  - Use `sanitizeHtml()` from [`lib/security.ts`](file:///e:/nexaCampus/android-school-app/school-webapp/lib/security.ts) to escape strings before rendering or storing in databases.
  - Use `validateDateFormatYYYYMMDD()` for all calendar dates to prevent invalid or out-of-bounds dates.
  - Reject numeric inputs that exceed reasonable school boundaries (e.g., grades must be 1–12, roll numbers must be alphanumeric 1–8 chars).
- **Prevent XSS (Cross-Site Scripting)**:
  - Never use `dangerouslySetInnerHTML` unless explicitly sanitized via DOMPurify with whitelisted tags.
  - React JSX escaping is necessary but not sufficient for user-crafted URLs (e.g., `javascript:...` links must be blocked).

### 3. Enforce Least Privilege
- **Scoped Database Access**:
  - Firestore security rules ([`firestore.rules`](file:///e:/nexaCampus/android-school-app/school-webapp/firestore.rules)) must enforce identity match checks: users may only read and mutate their own student or guardian profile.
  - Backend Go microservices (`backend-school-go`) connect with scoped database users, not superuser/root credentials.
- **Edge Route Guards**:
  - Next.js edge middleware ([`middleware.ts`](file:///e:/nexaCampus/android-school-app/school-webapp/middleware.ts)) gates all private corridor routes (`/home`, `/attendance`, `/diary`, `/exams`, etc.) before rendering any page components.
  - Public legal routes (`/privacy`, `/terms`, `/refund`, `/cookies`, `/data-deletion`) and auth routes (`/chooser`, `/email`, `/admission`, `/onboarding`) remain accessible without redirection.

### 4. Audit Dependencies & Third-Party Packages
- **Dependency Hygiene**:
  - Run `npm audit` prior to any new library introduction.
  - Avoid unmaintained or single-maintainer packages for cryptography or auth.
  - Lock versions strictly using `package-lock.json`.
- **SDK Boundaries**:
  - Only vetted SDKs (Firebase Client SDK v11, Next.js v15, Tailwind CSS) are authorized for client execution.
  - Do not introduce client-side analytics or tracking pixels that exfiltrate student telemetry.

---

## 3. Web Application Hardening Standards

### A. Server-Side Request Forgery (SSRF) Defense
When fetching remote media, preview images, or external webhooks:
- Enforce `validateSafeHttpsUrl()` from [`lib/security.ts`](file:///e:/nexaCampus/android-school-app/school-webapp/lib/security.ts):
  - Scheme must be `https:` (no `file:`, `ftp:`, `http:`, `gopher:`).
  - Reject loopback addresses (`127.0.0.1`, `localhost`, `::1`).
  - Reject cloud metadata endpoints (`169.254.169.254`).
  - Reject RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).

### B. Secure File Uploads
- Whitelist extensions strictly: `.pdf`, `.jpg`, `.jpeg`, `.png`, `.webp`.
- Enforce size ceiling: Max `10 MB` (`MAX_UPLOAD_FILE_BYTES` in `lib/security.ts`).
- Validate MIME type on both client and server before storing in Firebase Storage or S3.
- Generate cryptographically random filenames on the server (`crypto.randomUUID()`) to prevent directory traversal or file overwrites.

### C. Cross-Site Request Forgery (CSRF) & State Mutations
- Sensitive state changes (reporting items, booking PTMs, updating student profile) require:
  - Custom header verification: `X-Requested-With: XMLHttpRequest` via `getCsrfHeaders()`.
  - SameSite cookie policies (`SameSite=Lax` or `SameSite=Strict`).

### D. Security Headers Configuration
The application enforces HTTP security headers in `next.config.mjs`:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## 4. Defensive Coding Checklist for AI Agents

Whenever an AI agent writes code for this repo:
1. **Did you add a new endpoint or route?** Add authentication verification and authorize user access.
2. **Did you create a form?** Sanitize inputs with `sanitizeHtml` and provide accessible labels.
3. **Did you consume an API?** Implement timeouts, error boundaries, and debounce utilities (`debounce()`).
4. **Did you write logs?** Never log passwords, tokens, full student names, or contact phone numbers.
