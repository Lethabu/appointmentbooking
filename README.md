# AppointmentBooking — Developer Quickstart

## Purpose
Multi-tenant appointment booking SaaS. This repo follows Spec-Driven Development (SDD): specs and acceptance tests are the source of truth.

## Prereqs
- Node 20+, npm
- Supabase account and project
- Vercel account for deployment
- Optional: `ts-node`, `playwright` for E2E

## Setup
1. Clone the repo
2. Copy `.env.example` to `.env` and fill your values.
3. Create the database in Supabase and run migrations:
   ```bash
   supabase db push --project-ref your-ref
   # or run SQL files in supabase/migrations
   ```
4. Install:
   ```bash
   npm ci
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Bootstrap a tenant (dev)

* Build TS if needed, then run:
  ```bash
  node dist/scripts/bootstrapTenant.js "InStyle Hair" instyle admin@instyle.co.za
  ```
  or `ts-node scripts/bootstrapTenant.ts` in dev.

## Tests

* Unit: `npm test`
* E2E (Playwright): configure `STAGING_URL` and run `npx playwright test`.

## Contributing / SDD

* Write/expand spec in `docs/specs` before implementing features.
* Add acceptance tests that fail before implementing the feature, then implement until tests pass.

## Useful scripts

* `npm run lint` — run linters
* `npm run format` — run prettier
* `npm run build` — build for production

## Deployment
- Main platform: [appointmentbooking.co.za](https://appointmentbooking.co.za)
- Tenant example: [instylehairboutique.co.za](https://www.instylehairboutique.co.za)
