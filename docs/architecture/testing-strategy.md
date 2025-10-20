# Architecture Testing Strategy

## Overview
This section defines the testing approach for the enhancement, integrating with existing frameworks. It aligns with [coding standards](coding-standards.md) and [infrastructure deployment](infrastructure-deployment.md) for CI/CD.

### Integration with Existing Tests
**Existing Test Framework:** Jest (__tests__/); inferred Cypress.
**Test Organization:** Parallel to src (e.g., __tests__/api/orders.test.ts).
**Coverage Requirements:** >80%; extend for new code.

### New Testing Requirements

#### Unit Tests for New Components
- **Framework:** Jest + React Testing Library
- **Location:** __tests__/components/ecommerce/
- **Coverage Target:** 90% for new files
- **Integration with Existing:** Mock existing APIs (e.g., /api/products)

#### Integration Tests
- **Scope:** API endpoints + DB (Supabase test DB); hybrid cart flows
- **Existing System Verification:** Ensure booking unchanged post-ecom add
- **New Feature Testing:** Order creation to payment webhook

#### Regression Testing
- **Existing Feature Verification:** Run full Jest suite; smoke tests on bookings
- **Automated Regression Suite:** CI via GitHub; Cypress for UI regressions
- **Manual Testing Requirements:** Cross-browser; mobile PWA flows

## Cross-References
- **Coding Standards:** Testing patterns; [docs/architecture/coding-standards.md](coding-standards.md).
- **Infrastructure Deployment:** CI/CD integration; [docs/architecture/infrastructure-deployment.md](infrastructure-deployment.md).
- **Security Integration:** Security tests; [docs/architecture/security-integration.md](security-integration.md).
- **PRD**: Epic 7 testing; [docs/prd/epic-7-testing-deployment.md](../prd/epic-7-testing-deployment.md), NFRs in [requirements.md](../prd/requirements.md).

This strategy guarantees quality and no regressions.