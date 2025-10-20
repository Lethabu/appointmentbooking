# Epic 5: Development - Reviews & Analytics

## Overview
This epic develops reviews functionality and analytics tracking for e-commerce. Estimated duration: 2 weeks. Builds on integrations from [Epic 4](epic-4-development-integrations-ai.md) and frontend from [Epic 3](epic-3-development-inventory-frontend.md), implementing FR7 and FR8 per [requirements.md](requirements.md).

## Stories
- **Story 5.1**: As a Developer, I want to implement a reviews UI and form (e.g., post-checkout modal), to allow users to rate and comment on products/services, storing in Supabase reviews table.
- **Story 5.2**: As a Developer, I want to track e-commerce events in PostHog (e.g., add_to_cart, purchase, review_submitted), to monitor metrics like conversion and AOV tied to booking data.

## Acceptance Criteria
- Reviews: Modal triggers post-purchase; submits to /api/reviews; aggregates ratings in products table (reviews_avg).
- Analytics: Events fired on key actions; dashboard queries show e-commerce KPIs; privacy compliant (GDPR anonymization).
- UI integration: Reviews display on ProductCard; average rating visible in catalog.
- Tests: E2E for review flow; event verification with mocks.
- Docs: Extend [architecture/testing-strategy.md](../architecture/testing-strategy.md) with analytics tests.

## Dependencies
- Epic 4: AI recs and payments for post-purchase triggers.
- Epic 3: HybridCart for event tracking.
- Requirements: FR7 (Reviews), FR8 (Analytics), data models (Reviews table).

## Cross-References
- **Requirements**: Refer to [docs/prd/requirements.md](requirements.md) for FRs (e.g., FR7 Reviews & Ratings), NFRs (Reliability, Maintainability), and UI/UX goals (Personalization).
- **Previous Epics**: [Epic 1-4](epic-1-planning.md) - Integrate with APIs, UI, and integrations.
- **Subsequent Epics**:
  - [Epic 6: Security](epic-6-security.md)
  - [Epic 7: Testing/Deployment](epic-7-testing-deployment.md)
  - [Epic 8: Post-Launch](epic-8-post-launch.md)
- **Architecture**: Follow [docs/architecture/component-architecture.md](../architecture/component-architecture.md), [docs/architecture/data-models.md](../architecture/data-models.md), and [docs/architecture/tech-stack.md](../architecture/tech-stack.md) for PostHog and Supabase patterns.

This epic enhances user engagement and data insights for optimization.