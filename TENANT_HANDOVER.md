# Tenant Handover/Onboarding Checklist

This document provides a comprehensive, step-by-step checklist for handing over a new or completed tenant (e.g., Instyle Hair Boutique) to operations and owners in the multi-tenant appointment booking platform. It ensures verification of tenant isolation, core functionality (booking flow, payments, agents), and post-handover monitoring. The process aligns with the [Tenant Onboarding v1.0 Spec](docs/specs/tenant-onboarding-v1.0.md), [Booking Flow & Payments v1.0 Spec](docs/specs/booking-flow-payments-v1.0.md), [Agent Integration v1.0 Spec](docs/specs/agent-integration-v1.0.md), and implementation artifacts like [Stitch Setup](stitch-setup.md), [Specify Config](specify.config.json), [Firebase Migration Plan](docs/FIREBASE_MIGRATION_PLAN.md), and [Cloudflare Deployment](docs/cloudflare-deployment.md).

The checklist emphasizes freemium/open-source priorities (e.g., Supabase Spark, Clerk dev tier) and security (e.g., RLS enforcement, secrets in env vars). Timelines assume a standard tenant; adjust for complexity. Owners: Dev (setup/verification), Ops (monitoring/training), Tenant Owner (sign-off).

## Pre-Handover Verification

Perform these checks before handover to confirm isolation, functionality, and security. Run in staging first, then production. Timeline: 1-2 days. Owner: Dev.

- [ ] **Run Deployment Verification Script**  
  Execute [`scripts/verify-deployment.js`](scripts/verify-deployment.js) for the tenant domain (e.g., `instyle.appointmentbooking.com`).  
  - Expected: All critical routes (/, /book, /services) return 200 OK; no 404s; Tailwind/React markers present.  
  - Assets (e.g., logo, hero image) load successfully.  
  - If fails: Debug resolver.ts routing or Stitch-generated components.  
  *Timeline: 30 mins. Tools: Node.js, browser dev tools.*

- [ ] **Verify Tenant Isolation (RLS & Auth)**  
  In Supabase dashboard:  
  - Confirm RLS policies on tables (e.g., `bookings`, `chat_messages`): `tenant_id = auth.jwt()->>'tenant_id'`.  
  - Test cross-tenant access: Query as another tenant's user; expect empty results.  
  - Clerk: Validate tenant-specific sign-up/sign-in URLs; no auth mismatches (per Agent Integration spec).  
  - Post-Firebase migration: No remaining Firebase calls (`grep -r "firebase" .` returns 0).  
  *Timeline: 1 hour. Tools: Supabase dashboard, Clerk dev console.*

- [ ] **Test Core Functionality**  
  - **Booking Flow**: E2E test via Playwright or manual: Select service, view realtime slots (Supabase subscription), add to cart, checkout. No double-bookings; totals include taxes.  
  - **Payments**: Sandbox Paystack/Stripe transaction; confirm webhook updates Supabase (slot booked, email sent). Test refunds/cancellations.  
  - **Agents**: Trigger agent workflow (e.g., WhatsApp reminder on booking); verify tenant-isolated execution (LangChain in Supabase Edge).  
  - **UI Customization**: Load Stitch-generated components (e.g., BookingForm.tsx); apply Specify design tokens (from [`specify.config.json`](specify.config.json)). No 404s on tenant subdomain.  
  - Acceptance: No errors; WCAG AA compliant; <3s load time.  
  *Timeline: 2-4 hours. Tools: Playwright, Paystack/Stripe sandbox, Supabase logs.*

- [ ] **Security & Compliance Scan**  
  - Run `scripts/security-check.sh` (if exists) or manual: Check for exposed secrets (env vars only); validate webhook signatures.  
  - Lighthouse audit: Score >90 for performance/accessibility; no vulnerabilities.  
  - GDPR: Consent for emails/PII; audit logs in Supabase.  
  *Timeline: 1 hour. Tools: Lighthouse CLI, OWASP ZAP.*

- [ ] **Infra & Migration Checks**  
  - Cloudflare Worker: Verify routes/bindings in [`docs/cloudflare-deployment.md`](docs/cloudflare-deployment.md); test edge caching for tokens/payments.  
  - Firebase Migration: Confirm data integrity (counts match backups per [FIREBASE_MIGRATION_PLAN.md](docs/FIREBASE_MIGRATION_PLAN.md)); no realtime lag.  
  *Timeline: 30 mins. Tools: Wrangler CLI, Supabase metrics.*

## Onboarding Steps

Tie to automated provisioning from Tenant Onboarding spec. If manual, follow these. Timeline: 1 day (automated <5 mins). Owner: Dev.

- [ ] **Provision Environment**  
  - Supabase: Create schema/project; enable RLS/Auth (phone OTP). Seed data via `prisma/seed.[tenant].ts` (e.g., services/products).  
  - Clerk: Set up tenant instance; generate API keys (store in env).  
  - Next.js: Configure resolver.ts for subdomain; deploy to Vercel/Cloudflare.  
  *Tools: Supabase CLI, Clerk dashboard, Vercel deploy.*

- [ ] **UI Generation & Tokens**  
  - Run Stitch CLI for components (per [stitch-setup.md](stitch-setup.md)): `npx stitch generate --prompt "tenant-specific booking form" --output components/tenants/[tenant]/`.  
  - Apply design tokens: Build with Specify (`npx specify build` using [`specify.config.json`](specify.config.json)); integrate in theme-provider.tsx.  
  *Tools: Stitch CLI, Specify.*

- [ ] **Integrations Setup**  
  - Payments: Configure Paystack/Stripe webhooks (lib/payments/webhook-handler.ts); test idempotency.  
  - Agents: Provision in agent repo (temp-agent-repo/); sync auth with Clerk JWT.  
  - Realtime: Supabase subscriptions for availability/chat.  
  *Tools: Webhook tester (ngrok), Supabase Edge Functions.*

- [ ] **Data Seeding & Activation**  
  - Seed initial data (e.g., sample bookings); run health checks (`scripts/health-check.js`).  
  - Activate: Update DNS for subdomain; notify via email/Slack.  
  *Acceptance: Health check passes; tenant live without downtime.*

## Post-Handover Tasks

Ongoing support after handover. Timeline: 1 week initial, then monthly. Owner: Ops/Tenant Owner.

- [ ] **User Training**  
  - Conduct session: Booking flow, dashboard usage, agent interactions (e.g., reminders).  
  - Provide guides: Custom PDF from specs; access to Supabase/Clerk dashboards.  
  *Timeline: 2 hours. Tools: Zoom, shared docs.*

- [ ] **Agent Setup & Monitoring**  
  - Configure agents (e.g., smart-scheduling-agent.tsx); test workflows.  
  - Set up alerts: Integrate Sentry for errors; monitor via `scripts/post-deploy-monitor.sh`.  
  *Timeline: 1 day. Tools: Sentry dashboard, Supabase logs.*

- [ ] **Performance Monitoring**  
  - Track KPIs: Booking success rate (>99%), latency (<3s), uptime (99.9%).  
  - Monthly audit: Re-run verify-deployment.js; Lighthouse scores.  
  *Tools: Vercel analytics, Cloudflare dashboard.*

- [ ] **Rollback Preparedness**  
  - Document: If issues (e.g., payment failures), revert via Terraform destroy or feature flags. Restore from Supabase PITR (<7 days).  
  - Test rollback quarterly.  
  *Timeline: Ongoing.*

## Acceptance Sign-Off

- [ ] All pre-handover checks pass (attach verify-deployment.js output).  
- [ ] Functionality verified: Booking/payments/agents work; isolation confirmed.  
- [ ] Tenant owner trained; monitoring in place.  
- [ ] No open security issues; compliant with specs.  

**Sign-Off:**  
- Dev: ________________ Date: __________  
- Ops: ________________ Date: __________  
- Tenant Owner: ________________ Date: __________  

*If issues arise, initiate rollback per specs and re-verify.*
