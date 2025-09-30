# Epic 2: Development - Authentication & API

## Overview
This epic covers the development of authentication extensions and core API routes for e-commerce features. Estimated duration: 4-6 weeks. Builds on planning from [Epic 1](epic-1-planning.md) and requirements in [requirements.md](requirements.md), focusing on secure, extensible APIs for orders and inventory.

## Stories
- **Story 2.1**: As a Developer, I want to extend Clerk authentication for e-commerce-specific roles (e.g., buyer permissions) so that users can securely access shopping features without affecting booking auth.
- **Story 2.2**: As a Developer, I want to build API routes for orders and inventory management (/api/orders, /api/inventory/sync) extending the existing products route, to handle CRUD operations with Supabase integration.
- **Story 2.3**: As a Developer, I want to implement search and filtering capabilities using Supabase queries, to enable efficient product discovery aligned with FR6 in requirements.

## Acceptance Criteria
- Clerk roles extended and tested for e-commerce actions (e.g., create order requires auth).
- API routes functional: POST /api/orders creates records in Supabase; /api/inventory/sync updates stock_quantity in real-time via Convex.
- Search API returns filtered results (<500ms); integrated with existing auth middleware.
- Unit tests cover 80% of new code; no regressions in existing booking APIs.
- Documentation updated in [architecture/api-design.md](../architecture/api-design.md).

## Dependencies
- Epic 1: Schema designs and wireframes for API integration points.
- Requirements: FR4 (Orders), FR2 (Inventory), FR6 (Search).

## Cross-References
- **Requirements**: See [docs/prd/requirements.md](requirements.md) for FRs (e.g., FR5 Payments Enhancement), data models (Orders table), and NFRs (Security, Performance).
- **Previous Epic**: [Epic 1: Planning/Design](epic-1-planning.md) - Use designed schema for API implementations.
- **Subsequent Epics**:
  - [Epic 3: Development - Inventory & Frontend](epic-3-development-inventory-frontend.md)
  - [Epic 4: Development - Integrations & AI](epic-4-development-integrations-ai.md)
  - ... (full list in requirements.md)
- **Architecture**: Implement per [docs/architecture/api-design.md](../architecture/api-design.md), [docs/architecture/data-models.md](../architecture/data-models.md), and [docs/architecture/tech-stack.md](../architecture/tech-stack.md) for Supabase/Clerk patterns.

This epic enables backend foundations for frontend integration in Epic 3.