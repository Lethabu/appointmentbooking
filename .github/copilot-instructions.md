
# Copilot Instructions for AI Coding Agents

## Project Overview
Multi-tenant appointment booking SaaS built with **Next.js**, **Supabase**, **AWS RDS**, and AI agent integration. Two main repos: `your-platform-repo` (core app) and `your-platform-agent` (AI automations). Tenants have custom domains (see `DEPLOYMENT_CHECKLIST.md`, `DOMAIN_CONFIGURATION_FIX.md`).

## Architecture & Key Components
- **Frontend:** Next.js app in `/app`, UI in `/components`, `/dashboard`, `/tenants`.
- **Backend:** API endpoints, serverless functions, and integrations in `/services`, `/lib`, `/booking-api-lambda.js`, `/payment-lambda.js`.
- **Database:** Supabase for core data, AWS RDS for tenant isolation. See `schema.sql`, `run-migrations.sql`, migration scripts.
- **AI Agents:** Defined in `agents.md` (Repo Guardian, Deployment, Database, Doc, AI Ops). Each agent has a specific role and mapping.

## Developer Workflows
- **Build:** Use Docker (`docker-compose.yml`, `Dockerfile`). Tasks: `docker-build`, `docker-run: debug/release`. See `.cline/tasks.json` for custom commands.
- **Test:** Run `jest` (see `jest.config.js`, `jest.setup.js`). E2E via Cypress (`test:e2e`).
- **Deploy:** Scripts in `deploy-master.sh`, `deploy-platform.sh`, and guides in `DEPLOYMENT_CHECKLIST.md`, `FINAL_DEPLOYMENT_GUIDE.md`. Vercel build and deploy supported.
- **Migrations:** SQL scripts (`run-migrations.sql`, `instyle_final_migration.sql`). Supabase migration: `npx supabase db push --linked`.
- **Debug:** Use environment variables (`.env.local`, `touch .env.local`), enable debug mode via Docker task.
- **Lint/Format:** `eslint`, `prettier`, and `lint-staged` (see `.husky/pre-commit`).

## Project-Specific Conventions
- All agent personas and workflows are defined in `.clinerules/` (see `08-dev.md` for developer agent standards).
- Only load dependency files when explicitly requested by the user or required for a task.
- When presenting options, always use numbered lists for user selection.
- Update only the relevant Dev Agent Record sections when implementing stories.
- Do not begin development until a story is out of draft mode and user instructs to proceed.
- Use structured logging and PII redaction in Lambda functions (`booking-api-lambda.js`, `payment-lambda.js`).
- Zod schemas for payload validation in API/Lambda handlers.

## Integration Points
- Supabase and AWS RDS: Sync and migrations managed by Database Agent.
- Clerk: Config in `/app/clerk.config.ts`.
- Firestore: Indexes in `firestore.indexes.json`.
- Payment gateways: Paystack, PayFast, Yoco (see environment variables and Lambda handlers).
- WhatsApp: AiSensy integration, catalog sync via API.
- Social media: Facebook/Instagram shop integration, Meta Commerce.
- AI automations: Managed by `your-platform-agent` repo and described in `agents.md`.

## Key Files & Directories
- `/app`, `/components`, `/dashboard`, `/tenants`: Main app structure.
- `/services`, `/lib`: Backend logic and integrations.
- `/agents.md`, `/README.md`, `/DEPLOYMENT_CHECKLIST.md`, `/FINAL_DEPLOYMENT_GUIDE.md`: Architecture, agent roles, and deployment guides.
- `.clinerules/`: Project-specific agent and workflow rules.
- `.cline/tasks.json`: Custom workflow commands.
- `booking-api-lambda.js`, `payment-lambda.js`: Lambda handlers with validation and logging.

## Example Patterns
- Use Docker tasks for all builds and debugging.
- SQL migrations are run via provided scripts, not ORM.
- AI agents follow strict persona and workflow rules from `.clinerules/`.
- All onboarding and deployment steps are documented in markdown guides.
- Lambda/API handlers use Zod for validation and redact PII in logs.

---

For unclear or missing conventions, consult `.clinerules/`, `agents.md`, or ask for clarification. Always follow explicit project rules over generic best practices.
