# NexaCampus WebApp CI/CD & Verification Protocol

## Overview
This document specifies the Continuous Integration and Deployment pipeline architecture for school-webapp, the Next.js multi-tenant institutional operating platform.

## Quality Gates
1. **TypeScript Type Safety**:
   `ash
   npx tsc --noEmit
   `
2. **Next.js Production Build**:
   `ash
   npm run build
   `
3. **Multi-Tenant Host Resolution Verification**:
   - Canonical tenant URL: https://<slug>.<APP_BASE_DOMAIN> (e.g. https://greenwood.school-webapp-self.vercel.app)
   - Canonical admin URL: https://<slug>.admin.<APP_BASE_DOMAIN>
   - DNS-bound custom domain: https://<slug>.nexacampus.tech
   - Legacy path form is **redirected (308)** to the canonical subdomain: /school/<slug> -> https://<slug>.<APP_BASE_DOMAIN>/
   - Local fallback: http://<slug>.localhost:3000
   - Platform Chooser: http://localhost:3000/chooser (Zero-bleed isolation)
   - Creator Studio: http://localhost:3000/maker

## Deployment Strategy
- **Edge Middleware**: Vercel Edge Runtime resolves the tenant from the host and redirects the legacy path form to the canonical subdomain.
- **Session guard**: the edge verifies the signed, HttpOnly `school_auth_token` (HMAC-SHA256, `SESSION_SECRET`); protected routes redirect to `/chooser` without it.
- **Dynamic Assets**: Supabase storage + local fallback assets.
- **Backing API**: Go Orchestrator backend running on Render (REST on `PORT`, gRPC on `GRPC_PORT`), Turso Cloud SQLite as the catalogue store.
