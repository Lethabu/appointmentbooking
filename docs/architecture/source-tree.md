# Architecture Source Tree Integration

## Overview
This section describes how new files and folders integrate with the existing project structure. It supports [api-design](api-design.md) and [external-integrations](external-integrations.md), minimizing disruption to the current Next.js app.

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

## Cross-References
- **API Design**: New routes like /api/orders; see [docs/architecture/api-design.md](api-design.md).
- **Component Architecture**: New components in ecommerce/; [docs/architecture/component-architecture.md](component-architecture.md).
- **Tech Stack**: Next.js structure; [docs/architecture/tech-stack.md](tech-stack.md).
- **PRD**: Supports source tree in [docs/prd/requirements.md](../prd/requirements.md); [Epic 2](../prd/epic-2-development-authentication-api.md) for API files.

This organization facilitates parallel development and maintenance.