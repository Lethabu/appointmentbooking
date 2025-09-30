# Epic 4: Development - Integrations & AI

## Overview
This epic implements key integrations for payments, AI recommendations, and search. Estimated duration: 4 weeks. Depends on frontend from [Epic 3](epic-3-development-inventory-frontend.md) and APIs from [Epic 2](epic-2-development-authentication-api.md), fulfilling FR5, FR6 per [requirements.md](requirements.md).

## Stories
- **Story 4.1**: As a Developer, I want to integrate Stripe and PayPal alongside PayStack in /api/payments routes, to support multiple gateways for global payments and subscriptions.
- **Story 4.2**: As a Developer, I want to add an AI recommendations endpoint (/api/products/ai-recommendations) using Google GenAI, to suggest products based on user bookings and history.
- **Story 4.3**: As a Developer, I want to set up Elasticsearch via Supabase for advanced product search, enhancing filtering beyond basic Supabase queries.

## Acceptance Criteria
- Payments: Successful test transactions via Stripe/PayPal; webhooks handle confirmations; fallback to PayStack.
- AI endpoint: Returns personalized recs (e.g., 3-5 products); integrates with catalog UI; <2s response.
- Search: Full-text with filters; supports categories/prices; accuracy >90% on test queries.
- Security: API keys secured; rate limiting on AI/search; integration tests with existing WhatsApp notifications.
- Docs: Update [architecture/external-integrations.md](../architecture/external-integrations.md) with endpoint specs.

## Dependencies
- Epic 3: ProductCatalog and HybridCart for recs integration.
- Epic 2: Auth for payment APIs.
- Requirements: FR5 (Payments), FR6 (Recommendations & Search), Integrations section.

## Cross-References
- **Requirements**: See [docs/prd/requirements.md](requirements.md) for FRs (e.g., FR4 Orders & Fulfillment), integrations (Google GenAI, Elasticsearch), and NFRs (Scalability, Security).
- **Previous Epics**: [Epic 1: Planning/Design](epic-1-planning.md), [Epic 2: Development - Authentication & API](epic-2-development-authentication-api.md), [Epic 3: Development - Inventory & Frontend](epic-3-development-inventory-frontend.md) - Integrate with APIs and UI.
- **Subsequent Epics**:
  - [Epic 5: Development - Reviews & Analytics](epic-5-development-reviews-analytics.md)
  - [Epic 6: Security](epic-6-security.md)
  - ... (full list in requirements.md)
- **Architecture**: Align with [docs/architecture/external-integrations.md](../architecture/external-integrations.md), [docs/architecture/api-design.md](../architecture/api-design.md), and [docs/architecture/tech-stack.md](../architecture/tech-stack.md) for SDKs and extensions.

This epic adds advanced features, preparing for reviews and deployment.