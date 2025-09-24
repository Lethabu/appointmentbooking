# Architecture Tech Stack Alignment

## Overview
This section aligns the technology stack for the e-commerce enhancement, detailing existing technologies and new additions. It builds on the [introduction](introduction.md) and [enhancement scope](enhancement-scope.md), ensuring compatibility with the current Next.js-based system.

### Existing Technology Stack

| Category | Current Technology | Version | Usage in Enhancement | Notes |
|----------|--------------------|---------|----------------------|-------|
| Frontend | Next.js/React/TS | Latest (14+) | Extend pages/components for catalog/checkout | App Router with server components |
| Backend/DB | Supabase (PostgreSQL) | Latest | Extend products table; new orders/reviews | RLS, real-time via pg_notify |
| Auth | Clerk | Latest | Extend for e-commerce roles | Session-based, no changes |
| Real-time | Convex | Latest | Inventory/order sync | Hybrid with Supabase |
| Payments | PayStack | Latest | Extend with Stripe/PayPal | Webhooks for all |
| Analytics | PostHog | Latest | E-commerce events | Extend existing tracking |
| AI | Google GenAI | Latest | Product recommendations | Via existing geminiService.ts |
| Search | Supabase pg_trgm | Built-in | Full-text; optional Elasticsearch | Via Supabase extension |

### New Technology Additions

| Technology | Version | Purpose | Rationale | Integration Method |
|------------|---------|---------|-----------|--------------------|
| Stripe/PayPal SDKs | Latest | Additional payment gateways | PRD requirement for global support | New API routes (/api/payments/stripe); parallel to PayStack |
| Redis (via Supabase) | Latest | Caching for inventory/search | Scale real-time; optional if Supabase limits hit | Supabase add-on; client-side cache in Next.js |
| Elasticsearch (via Supabase) | Latest | Advanced product search | PRD for filtering/recs | Supabase vector extension; fallback to pg_search |

## Cross-References
- **Introduction**: See [docs/architecture/introduction.md](introduction.md) for current project state and constraints.
- **Enhancement Scope**: Align additions with [docs/architecture/enhancement-scope.md](enhancement-scope.md) integration strategy.
- **Data Models**: Tech choices impact schema in [docs/architecture/data-models.md](data-models.md).
- **PRD**: Supports FR5 (Payments), FR6 (Search), integrations in [docs/prd/requirements.md](../prd/requirements.md); see [Epic 4](../prd/epic-4-development-integrations-ai.md) for implementation.

This stack minimizes disruption, leveraging Supabase extensions for new needs.