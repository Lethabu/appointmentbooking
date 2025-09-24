# Architecture Data Models and Schema Changes

## Overview
This section details the new data models and schema modifications for the e-commerce enhancement. It extends the existing Supabase schema, aligning with the [tech stack](tech-stack.md) and [enhancement scope](enhancement-scope.md) for backward compatibility.

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

Use Supabase RLS for row-level security; Convex for real-time order updates.

## Cross-References
- **Tech Stack**: Supabase/Convex for implementation; see [docs/architecture/tech-stack.md](tech-stack.md).
- **Enhancement Scope**: Additive changes per [docs/architecture/enhancement-scope.md](enhancement-scope.md).
- **Component Architecture**: Relationships impact UI; refer to [docs/architecture/component-architecture.md](component-architecture.md).
- **PRD**: Matches data models in [docs/prd/requirements.md](../prd/requirements.md); see [Epic 1](../prd/epic-1-planning.md) for schema design story.

This ensures scalable, secure data handling for e-commerce.