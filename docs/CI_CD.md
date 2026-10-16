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
   - Subdomain mapping: https://<slug>.nexacampus.tech -> /school/<slug>
   - Local fallback: http://localhost:3000/school/<slug>
   - Platform Chooser: http://localhost:3000/chooser (Zero-bleed isolation)
   - Creator Studio: http://localhost:3000/maker

## Deployment Strategy
- **Edge Middleware**: Vercel Edge Runtime handles headers and subdomain re-writing.
- **Dynamic Assets**: Supabase storage + local fallback assets.
- **Backing API**: Go Orchestrator backend running on Render.
