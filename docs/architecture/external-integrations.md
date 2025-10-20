# Architecture External API Integration

## Overview
This section covers integration with external APIs for payments and AI. It extends the [api-design](api-design.md) and [tech stack](tech-stack.md), using server-side calls with secure keys.

### Stripe API
- **Purpose:** Additional payment gateway for global cards/subscriptions
- **Documentation:** https://docs.stripe.com
- **Base URL:** https://api.stripe.com/v1
- **Authentication:** API keys (env vars, extend existing secrets)
- **Integration Method:** New route /api/payments/stripe; parallel to PayStack

**Key Endpoints Used:**
- `POST /payment_intents` - Create payment session
- `POST /subscriptions` - Handle recurring

**Error Handling:** Retry on 5xx; fallback to PayStack; log to PostHog

### PayPal API
- **Purpose:** Alternative gateway for international users
- **Documentation:** https://developer.paypal.com
- **Base URL:** https://api-m.sandbox.paypal.com (prod: api-m.paypal.com)
- **Authentication:** OAuth tokens
- **Integration Method:** /api/payments/paypal; webhook for confirmations

**Key Endpoints Used:**
- `POST /v2/checkout/orders` - Create order
- `POST /v2/payments/captures` - Capture payment

**Error Handling:** Similar to Stripe; user-friendly messages

### Google GenAI API
- **Purpose:** Product recommendations based on bookings
- **Documentation:** https://ai.google.dev
- **Base URL:** https://generativelanguage.googleapis.com/v1beta
- **Authentication:** API key (existing setup)
- **Integration Method:** Server-side calls in /api/products/ai-recommendations

**Key Endpoints Used:**
- `POST /models/gemini-pro:generateContent` - Generate recs prompt

**Error Handling:** Fallback to rule-based (e.g., category match); cache responses

## Cross-References
- **API Design**: Endpoints like /api/payments/stripe; see [docs/architecture/api-design.md](api-design.md).
- **Tech Stack**: SDKs from [docs/architecture/tech-stack.md](tech-stack.md).
- **Component Architecture**: Called by CheckoutFlow; [docs/architecture/component-architecture.md](component-architecture.md).
- **PRD**: Supports integrations in [docs/prd/requirements.md](../prd/requirements.md); [Epic 4](../prd/epic-4-development-integrations-ai.md) for AI/payments.

This ensures reliable external service integration.