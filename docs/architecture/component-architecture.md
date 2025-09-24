# Architecture Component Architecture

## Overview
This section describes the new and extended React components for the e-commerce enhancement. It builds on [data models](data-models.md) and [tech stack](tech-stack.md), focusing on modular UI integration with existing components like Cart.tsx.

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

## Cross-References
- **Data Models**: Components interact with Orders, Reviews; see [docs/architecture/data-models.md](data-models.md).
- **Tech Stack**: React/TS patterns; refer to [docs/architecture/tech-stack.md](tech-stack.md).
- **API Design**: Interfaces call endpoints in [docs/architecture/api-design.md](api-design.md).
- **PRD**: Supports UI/UX goals in [docs/prd/requirements.md](../prd/requirements.md); see [Epic 3](../prd/epic-3-development-inventory-frontend.md) for frontend stories.

This architecture promotes reusability and consistency with existing UI.