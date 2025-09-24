# Architecture API Design and Integration

## Overview
This section outlines the API design for e-commerce features, including new endpoints and integration strategy. It supports [component architecture](component-architecture.md) and [data models](data-models.md), using Next.js routes with Clerk auth.

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

## Cross-References
- **Component Architecture**: Endpoints called by HybridCart, CheckoutFlow; see [docs/architecture/component-architecture.md](component-architecture.md).
- **Data Models**: Handles Orders, Order_Items; refer to [docs/architecture/data-models.md](data-models.md).
- **Tech Stack**: Next.js/Clerk patterns; [docs/architecture/tech-stack.md](tech-stack.md).
- **External Integrations**: Ties to payments/AI; see [docs/architecture/external-integrations.md](external-integrations.md).
- **PRD**: Supports FR4 (Orders), FR2 (Inventory), FR6 (Recommendations); [docs/prd/requirements.md](../prd/requirements.md), [Epic 2](../prd/epic-2-development-authentication-api.md).

This design ensures consistent, secure APIs for e-commerce.