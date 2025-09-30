# Appointment Booking System Brownfield Enhancement Architecture

## Introduction

This document outlines the architectural approach for enhancing the Appointment Booking System with a comprehensive e-commerce platform. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development of new features while ensuring seamless integration with the existing system.

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
- PRD: docs/brownfield-prd.md detailing e-commerce enhancement requirements.
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

## Enhancement Scope and Integration Strategy

### Enhancement Overview
**Enhancement Type:** Brownfield e-commerce expansion (catalog, inventory, orders, payments, AI recs).
**Scope:** Extend existing booking system to hybrid services+products platform; includes data models, UI integration, APIs, without rewriting core booking.
**Integration Impact:** Medium—targeted extensions to DB, APIs, components; use feature flags for safe rollout.

### Integration Approach
**Code Integration Strategy:** Modular additions (e.g., new components in components/ecommerce/); extend existing like Cart.tsx for hybrid support; feature flags via Convex/Clerk to toggle e-commerce.
**Database Integration:** Extend Supabase schema (add tables/columns); use migrations for zero-downtime; Convex for real-time sync on inventory/orders.
**API Integration:** New routes under app/api/ (e.g., /api/orders); consistent with existing server actions (e.g., extend /api/products).
**UI Integration:** Integrate new catalog/search into existing BookingFlow; reuse ProductCard.tsx; mobile-first updates to pages like dashboard/products.

### Compatibility Requirements
- **Existing API Compatibility:** New endpoints follow existing patterns (async server actions, Clerk auth); no deprecation of current routes.
- **Database Schema Compatibility:** Additive changes only (new tables/columns); RLS policies extended for security.
- **UI/UX Consistency:** Match existing theme-context.tsx; ARIA compliance; hybrid cart blends with BookingWidget.
- **Performance Impact:** Caching via Supabase/Redis if needed; real-time limited to critical paths (<1s latency).

## Tech Stack Alignment

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

## Data Models and Schema Changes

### New Data Models

#### Orders Model
**Purpose:** Track e-commerce transactions, including hybrid with bookings.
**Integration:** Links to existing users (Clerk) and appointments; extends products.

**Key Attributes:**
- id: UUID - Primary key
- user_id: UUID - FK to Clerk users
- total_amount: decimal - Order total
- status: enum (pending, paid, shipped, delivered) - Order lifecycle
- items: JSON - Array of {product_id, quantity, price}
- booking_id: UUID (optional) - FK to existing appointments for hybrid
- created_at: timestamp - Creation time

**Relationships:**
- **With Existing:** 1:M with products (via items); optional 1:1 with appointments
- **With New:** 1:M with Order_Items; 1:M with Reviews

#### Order_Items Model
**Purpose:** Normalized line items for orders.
**Integration:** References existing products table.

**Key Attributes:**
- id: UUID - Primary key
- order_id: UUID - FK to orders
- product_id: UUID - FK to products
- quantity: int - Item count
- price_at_purchase: decimal - Price snapshot

**Relationships:**
- **With Existing:** M:1 with products
- **With New:** M:1 with orders

#### Reviews Model
**Purpose:** User feedback on products/services.
**Integration:** Aggregates for product ratings; ties to orders.

**Key Attributes:**
- id: UUID - Primary key
- product_id: UUID - FK to products
- user_id: UUID - FK to Clerk users
- rating: int (1-5) - Star rating
- comment: text - Review text
- created_at: timestamp - Review time

**Relationships:**
- **With Existing:** M:1 with products
- **With New:** M:1 with orders (via purchase verification)

### Schema Integration Strategy
**Database Changes Required:**
- **New Tables:** orders, order_items, reviews
- **Modified Tables:** products (add: variants JSON, images array, seo JSON, stock_quantity int, reviews_avg float)
- **New Indexes:** On orders.user_id, products.category, reviews.product_id for query perf
- **Migration Strategy:** Supabase migrations (SQL scripts); run in staging; use feature flags for new fields

**Backward Compatibility:**
- Default values/nulls for new columns in products
- RLS policies exclude new tables from existing queries until flagged on
- No DROP/ALTER on existing tables; only ADD COLUMN

## Component Architecture

### New Components

#### ProductCatalog
**Responsibility:** Display searchable product grid with filters; integrates with existing dashboard.
**Integration Points:** Fetches from /api/products; uses ProductCard.tsx for items.

**Key Interfaces:**
- onSearch: (query: string) => void - Triggers search API
- onFilter: (filters: object) => void - Applies category/price filters

**Dependencies:**
- **Existing Components:** ProductCard.tsx, theme-context.tsx
- **New Components:** SearchBar, FilterPanel
- **Technology Stack:** React/TS; Tailwind for styling (match existing)

#### HybridCart
**Responsibility:** Manage cart with services + products; extends existing Cart.tsx.
**Integration Points:** Add to BookingFlow; sync with Convex for real-time.

**Key Interfaces:**
- addItem: (item: Service|Product) => void - Hybrid add
- checkout: () => Promise<Order> - Triggers payment

**Dependencies:**
- **Existing Components:** Cart.tsx, BookingForm
- **New Components:** ProductItem (extends), ServiceItem
- **Technology Stack:** React/TS; Zustand for state (if existing cart uses it)

#### CheckoutFlow
**Responsibility:** Multi-step checkout with payment selection.
**Integration Points:** From HybridCart; calls /api/checkout.

**Key Interfaces:**
- onPaymentSelect: (gateway: 'paystack'|'stripe') => void
- onSubmit: (orderData: object) => Promise<Status>

**Dependencies:**
- **Existing Components:** Payment forms from /api/paystack
- **New Components:** PaymentGatewaySelector
- **Technology Stack:** React/TS; Formik for validation

### Component Interaction Diagram
```mermaid
graph TD
    A[Existing BookingFlow] --> B[HybridCart]
    B --> C[ProductCatalog]
    C --> D[SearchBar]
    B --> E[CheckoutFlow]
    E --> F[Payment APIs<br/>(PayStack/Stripe)]
    G[Convex Real-time] --> B
    H[Supabase DB] --> C
    B --> I[Orders API]
    I --> H
    J[AI Recs API] --> C
```

## API Design and Integration

### API Integration Strategy
**API Integration Strategy:** Extend Next.js API routes; use server actions for mutations; consistent auth via Clerk middleware.
**Authentication:** Clerk sessions; extend roles for buyer actions.
**Versioning:** No versioning needed; use feature flags for new endpoints.

### New API Endpoints

#### /api/orders
- **Method:** POST
- **Endpoint:** /api/orders
- **Purpose:** Create new order (hybrid with booking_id optional)
- **Integration:** Extends existing /api/products; uses Supabase insert

**Request:**
```json
{
  "user_id": "clerk_user_uuid",
  "items": [{"product_id": "uuid", "quantity": 1}],
  "booking_id": "optional_uuid",
  "total_amount": 99.99
}
```

**Response:**
```json
{
  "order_id": "uuid",
  "status": "pending",
  "webhook_url": "/api/webhooks/order"
}
```

#### /api/inventory/sync
- **Method:** POST
- **Endpoint:** /api/inventory/sync
- **Purpose:** Real-time stock update via Convex trigger
- **Integration:** Syncs with existing products stock_quantity

**Request:**
```json
{
  "product_id": "uuid",
  "delta": -1
}
```

**Response:**
```json
{
  "success": true,
  "new_stock": 10
}
```

#### /api/products/ai-recommendations
- **Method:** GET
- **Endpoint:** /api/products/ai-recommendations?user_id=uuid&booking_id=uuid
- **Purpose:** AI-based product suggestions
- **Integration:** Uses Google GenAI; ties to user history

**Request:** Query params only

**Response:**
```json
{
  "recommendations": [{"id": "uuid", "name": "Product", "reason": "Based on booking"}]
}
```

## External API Integration

#### Stripe API
- **Purpose:** Additional payment gateway for global cards/subscriptions
- **Documentation:** https://docs.stripe.com
- **Base URL:** https://api.stripe.com/v1
- **Authentication:** API keys (env vars, extend existing secrets)
- **Integration Method:** New route /api/payments/stripe; parallel to PayStack

**Key Endpoints Used:**
- `POST /payment_intents` - Create payment session
- `POST /subscriptions` - Handle recurring

**Error Handling:** Retry on 5xx; fallback to PayStack; log to PostHog

#### PayPal API
- **Purpose:** Alternative gateway for international users
- **Documentation:** https://developer.paypal.com
- **Base URL:** https://api-m.sandbox.paypal.com (prod: api-m.paypal.com)
- **Authentication:** OAuth tokens
- **Integration Method:** /api/payments/paypal; webhook for confirmations

**Key Endpoints Used:**
- `POST /v2/checkout/orders` - Create order
- `POST /v2/payments/captures` - Capture payment

**Error Handling:** Similar to Stripe; user-friendly messages

#### Google GenAI API
- **Purpose:** Product recommendations based on bookings
- **Documentation:** https://ai.google.dev
- **Base URL:** https://generativelanguage.googleapis.com/v1beta
- **Authentication:** API key (existing setup)
- **Integration Method:** Server-side calls in /api/products/ai-recommendations

**Key Endpoints Used:**
- `POST /models/gemini-pro:generateContent` - Generate recs prompt

**Error Handling:** Fallback to rule-based (e.g., category match); cache responses

## Source Tree Integration

### Existing Project Structure
```
app/
├── api/
│   ├── products/route.ts  # Existing CRUD
│   ├── checkout/paystack/route.ts  # Existing payments
│   └── orders/route.js  # Partial existing
├── dashboard/
│   └── products/page.tsx  # Existing product view
components/
├── Cart.tsx  # Existing cart
└── ProductCard.tsx  # Existing card
```

### New File Organization
```
project-root/
├── app/
│   ├── api/
│   │   ├── orders/route.ts           # New: Full orders CRUD
│   │   ├── inventory/sync/route.ts   # New: Stock updates
│   │   ├── products/ai-recommendations/route.ts  # New: AI recs
│   │   └── payments/stripe/route.ts  # New: Extend payments
│   └── ecommerce/
│       ├── catalog/page.tsx          # New: Product catalog page
│       └── checkout/page.tsx         # New: Checkout flow
│   └── dashboard/products/page.tsx   # Existing: Add search/filter
├── components/
│   └── ecommerce/                    # New folder for modularity
│       ├── ProductCatalog.tsx        # New
│       ├── HybridCart.tsx            # Extend existing Cart.tsx
│       ├── SearchBar.tsx             # New
│       └── FilterPanel.tsx           # New
└── lib/                              # Existing: Add utils
    └── ai-recs.ts                    # New: GenAI helpers
```

### Integration Guidelines
- **File Naming:** Kebab-case for routes/files; match existing (e.g., route.ts)
- **Folder Organization:** Group new under ecommerce/; extend app/api/ for consistency
- **Import/Export Patterns:** Relative imports; export from components/ index.ts

## Infrastructure and Deployment Integration

### Existing Infrastructure
**Current Deployment:** Vercel for Next.js; Supabase for DB/real-time.
**Infrastructure Tools:** GitHub Actions (.github/); Docker for local (docker-compose.yml).
**Environments:** Staging/prod via Vercel branches; Supabase projects.

### Enhancement Deployment Strategy
**Deployment Approach:** Incremental via feature flags; blue-green on Vercel for zero-downtime.
**Infrastructure Changes:** Add Supabase extensions (Elasticsearch, Redis if needed); no new infra.
**Pipeline Integration:** Extend existing CI/CD; add tests for new routes; deploy flags via env vars.

### Rollback Strategy
**Rollback Method:** Feature flag toggle; Vercel rollbacks for deploys.
**Risk Mitigation:** Canary releases (10% traffic); monitor with /api/health.
**Monitoring:** PostHog for errors; Supabase logs; Convex queries.

## Coding Standards and Conventions

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

## Testing Strategy

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

## Security Integration

### Existing Security Measures
**Authentication:** Clerk sessions/middleware.ts
**Authorization:** Role-based via Clerk; Supabase RLS on tables
**Data Protection:** HTTPS; env secrets; GDPR via data anonymization (/api/data/anonymize)
**Security Tools:** OWASP via linting; rate limiting inferred

### Enhancement Security Requirements
**New Security Measures:** PCI for payments (Stripe/PayPal compliant); input validation on orders
**Integration Points:** Extend RLS to new tables (e.g., user owns orders); Clerk webhooks
**Compliance Requirements:** GDPR for reviews; PCI-DSS for carts

### Security Testing
**Existing Security Tests:** Extend __tests__ for auth
**New Security Test Requirements:** Jest for RLS; OWASP ZAP scans in CI
**Penetration Testing:** Manual audit post-MVP; focus on payments/integrations

## Checklist Results Report
- [x] Analyzed existing codebase (API routes, components, schema)
- [x] Validated integration points (no breaking changes)
- [x] Tech alignment (extend, no major new stack)
- [x] Data models backward compatible
- [x] Component modularity ensured
- [x] API patterns consistent
- [x] Source tree minimal disruption
- [x] Deployment safe (flags, blue-green)
- [x] Standards matched (TS/React)
- [x] Testing extended (Jest/Cypress)
- [x] Security (RLS, OWASP)

## Next Steps

### Story Manager Handoff
Reference this architecture for e-commerce stories. Key integrations: Extend Supabase products/orders with RLS; hybrid Cart.tsx with BookingForm; feature flags for no-regression. Constraints: Real-time via Convex only for inventory. Start with Epic 2: Auth/API extensions—implement /api/orders first, validate with existing products flow.

### Developer Handoff
Follow this architecture and existing TS/React patterns (server actions, Clerk auth). Integrations: New components depend on existing (e.g., ProductCard in Catalog); verify compatibility via tests. Sequence: DB migrations > APIs > Frontend > Integrations. Checkpoints: Unit tests pass; no booking regressions; monitor health endpoint.