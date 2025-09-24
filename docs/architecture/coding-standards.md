# Architecture Coding Standards and Conventions

## Overview
This section outlines coding standards for the enhancement, ensuring consistency with existing code. It applies to new files in [source tree](source-tree.md) and deploys in [infrastructure-deployment](infrastructure-deployment.md).

### Existing Standards Compliance
**Code Style:** TypeScript strict; Prettier (.prettierrc); ESLint inferred.
**Linting Rules:** Match existing (no new config); TS errors as warnings.
**Testing Patterns:** Jest in __tests__/; Cypress for E2E (extend).
**Documentation Style:** JSDoc for components; Markdown in docs/.

### Enhancement-Specific Standards
- **Modularity:** New components as hooks/utils; no global state changes.
- **Error Handling:** Consistent try-catch; Clerk errors propagated.

### Critical Integration Rules
- **Existing API Compatibility:** New routes use same Clerk middleware.ts
- **Database Integration:** Supabase client with RLS; no raw SQL outside migrations
- **Error Handling:** Uniform responses {error: string, code: int}; log to PostHog
- **Logging Consistency:** Console.log for dev; structured in prod via existing utils/

## Cross-References
- **Source Tree:** Apply to new files; see [docs/architecture/source-tree.md](source-tree.md).
- **Testing Strategy:** Linting in CI; [docs/architecture/testing-strategy.md](testing-strategy.md).
- **Security Integration:** Error handling secure; [docs/architecture/security-integration.md](security-integration.md).
- **PRD**: Maintainability NFR; [docs/prd/requirements.md](../prd/requirements.md), [Epic 1](../prd/epic-1-planning.md) for standards.

This maintains code quality and ease of maintenance.