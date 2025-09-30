# Architecture Introduction: Appointment Booking System Brownfield Enhancement

## Overview
This section introduces the architectural blueprint for enhancing the existing appointment booking system with e-commerce capabilities. It supplements the existing project architecture, guiding AI-driven development while maintaining compatibility.

## Document Purpose
This document outlines the approach for brownfield e-commerce expansion, serving as a reference for developers and agents. Sharded for modularity; cross-reference other sections for details.

### Relationship to Existing Architecture
This document supplements existing project architecture by defining how new components will integrate with current systems. Where conflicts arise between new and existing patterns, this document provides guidance on maintaining consistency while implementing enhancements.

### Existing Project Analysis

#### Current Project State
- **Primary Purpose:** Core appointment booking for salons/services with foundational e-commerce elements (product catalog, basic cart, payments).
- **Current Tech Stack:** Next.js (React, TypeScript), Supabase (PostgreSQL for data including products table), Clerk for authentication, Convex for real-time updates, PayStack for payments, PostHog for analytics.
- **Architecture Style:** Server-side rendered pages with API routes for data operations; component-based React UI; hybrid client-server model with real-time sync via Convex.
- **Deployment Method:** Vercel for Next.js hosting; Supabase for managed PostgreSQL; CI/CD via GitHub Actions (inferred from .github/ directory).

#### Available Documentation
- Existing docs include ARCHITECTURE.md, DEPLOYMENT_CHECKLIST.md, SECURITY_BEST_PRACTICES.md.
- PRD: Sharded in [docs/prd/requirements.md](../prd/requirements.md) detailing e-commerce enhancement requirements.
- Schema: schema.sql for Supabase tables (products, appointments).

#### Identified Constraints
- Maintain backward compatibility for core booking flows (no regressions via feature flags).
- Leverage existing Supabase products table; avoid full schema rewrites.
- Real-time requirements limited to inventory/orders via Convex.
- Payment integrations must extend PayStack without replacing it.
- Mobile-first PWA constraints from existing manifest.

#### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial Draft | 2025-09-24 | 1.0 | Created based on PRD and existing analysis | Architect |

## Cross-References
- **Enhancement Scope**: See [docs/architecture/enhancement-scope.md](enhancement-scope.md) for integration strategy.
- **Tech Stack**: Refer to [docs/architecture/tech-stack.md](tech-stack.md) for existing and new technologies.
- **Data Models**: Align with [docs/architecture/data-models.md](data-models.md).
- **Full Architecture**: Other shards include component-architecture.md, api-design.md, etc.
- **PRD**: Ties to [docs/prd/requirements.md](../prd/requirements.md) for objectives and scope; epics in [docs/prd/epic-1-planning.md](../prd/epic-1-planning.md) et al.

This introduction provides context; proceed to scope for integration details.