# Epic 3: Development - Inventory & Frontend

## Overview
This epic addresses inventory tracking and frontend components for e-commerce. Estimated duration: 6-8 weeks. Leverages APIs from [Epic 2](epic-2-development-authentication-api.md) and designs from [Epic 1](epic-1-planning.md), implementing real-time stock and UI for catalog and cart per [requirements.md](requirements.md).

## Stories
- **Story 3.1**: As a Developer, I want to add inventory tracking with Convex for real-time stock updates, so that low-stock alerts trigger via webhooks and sync with Supabase products table.
- **Story 3.2**: As a Developer, I want to enhance Cart.tsx to support hybrid items (services + products), integrating with existing BookingForm for seamless addition during booking flows.
- **Story 3.3**: As a Developer, I want to create a ProductCatalog page using extensions of ProductCard.tsx, to display browsable products with search and filters from Epic 2 APIs.

## Acceptance Criteria
- Inventory sync: Stock updates reflect in <1s; low-stock webhook sends alerts (e.g., email/Slack).
- Hybrid cart: Add service/product items; total calculation includes both; persists via localStorage/Convex.
- Catalog page: Renders products grid; integrates search/filter; mobile-responsive per UI/UX goals.
- Integration tests: Verify no conflicts with existing booking UI; performance <2s load.
- Code reviewed for modularity; docs updated in [architecture/component-architecture.md](../architecture/component-architecture.md).

## Dependencies
- Epic 2: Functional /api/inventory/sync and /api/products.
- Epic 1: Wireframes for catalog and cart UI.
- Requirements: FR2 (Inventory), FR3 (Cart), FR1 (Catalog).

## Cross-References
- **Requirements**: Refer to [docs/prd/requirements.md](requirements.md) for FRs (e.g., FR6 Recommendations & Search), data models (Products extensions), and NFRs (Performance, Accessibility).
- **Previous Epics**: [Epic 1: Planning/Design](epic-1-planning.md), [Epic 2: Development - Authentication & API](epic-2-development-authentication-api.md) - Use APIs and designs.
- **Subsequent Epics**:
  - [Epic 4: Development - Integrations & AI](epic-4-development-integrations-ai.md)
  - [Epic 5: Development - Reviews & Analytics](epic-5-development-reviews-analytics.md)
  - ... (full list in requirements.md)
- **Architecture**: Follow [docs/architecture/component-architecture.md](../architecture/component-architecture.md), [docs/architecture/tech-stack.md](../architecture/tech-stack.md), and [docs/architecture/data-models.md](../architecture/data-models.md) for Convex/Supabase frontend patterns.

This epic delivers user-facing e-commerce core, enabling testing in later phases.