# Brownfield PRD: E-commerce Platform Enhancement for Appointment Booking System

## Document Information
- **Title**: Enhancing Appointment Booking System with Robust E-commerce Platform
- **Version**: 1.0
- **Date**: 2025-09-24
- **Author**: Product Manager (BMAD Methodology)
- **Status**: Draft
- **Project Context**: Brownfield enhancement to existing Next.js-based salon/service appointment booking system. Existing features include service selection, slot booking, payments via PayStack, real-time dashboard with Convex, authentication via Clerk, Supabase for data (products table with CRUD actions), and basic e-commerce (cart, products). Goal: Expand to full e-commerce without regressing core booking functionality.

## 1. Introduction
### Overview
The existing system provides core appointment booking for salons/services, with foundational e-commerce elements (products catalog, cart, basic payments). This enhancement transforms it into a comprehensive one-stop platform for booking services and purchasing products, targeting salon customers in beauty/wellness. UVP: Seamless hybrid experience combining bookings and shopping. Monetization: Direct purchases, subscriptions for premium features (e.g., priority slots, personalized recommendations).

### Objectives
- Integrate advanced e-commerce: Product catalogs, inventory, orders, enhanced payments, search/filtering, recommendations.
- Ensure backward compatibility: Use feature flags (e.g., via Clerk or Convex) to toggle e-commerce features without impacting bookings.
- Adapt to stack: Leverage Supabase (PostgreSQL) for relational data; add Redis via Supabase for caching/inventory if needed. Retain Next.js backend/frontend, React components.

### Scope
- In: E-commerce integration with existing bookings (e.g., add products to booking cart), data models, UI/UX updates, integrations.
- Out: Full rewrite of booking core; non-e-commerce features like staff scheduling (enhance only if tied to inventory).

## 2. Market Research Summary
- **Target Audience**: Salon customers (individuals aged 18-45, urban, beauty/wellness focused) seeking convenient booking + shopping.
- **Competitors**:
  - **Shopify (E-commerce)**: Strong in product catalogs, payments, inventory; lacks integrated booking. Opportunity: Hybrid model superior for services.
  - **Mindbody (Bookings)**: Excellent for appointments/scheduling; weak e-commerce. Our UVP: Unified platform reduces friction.
- **Market Trends**: Rise in omnichannel retail (70% consumers prefer one-stop apps per Statista 2024); mobile commerce in wellness up 25% YoY. Pain Points: Fragmented experiences (separate apps for booking vs. buying products).
- **Opportunities**: AI-driven recs (e.g., suggest products post-booking); subscriptions for loyalty. Risks: Competition from integrated platforms like Booksy + Shopify plugins.

## 3. Functional Requirements (FRs)
- **FR1: Product Catalog Management**
  - Admins add/edit/delete products (extend existing products table).
  - Customers browse/search/filter products (categories, price, ratings).
- **FR2: Inventory Management**
  - Real-time stock tracking (Supabase + Convex sync).
  - Low-stock alerts via webhooks.
- **FR3: Shopping Cart & Checkout**
  - Hybrid cart: Mix services/products (integrate with existing BookingForm).
  - Guest/authenticated checkout; abandoned cart recovery via email/WhatsApp.
- **FR4: Orders & Fulfillment**
  - Order creation, status tracking (pending/shipped/delivered).
  - Integration with bookings (e.g., product delivery tied to appointment).
- **FR5: Payments Enhancement**
  - Support PayStack + Stripe/PayPal; handle subscriptions.
  - Refunds/partial payments for hybrid orders.
- **FR6: Recommendations & Search**
  - AI-based product recs (e.g., based on past bookings).
  - Full-text search with filtering (via Elasticsearch or Supabase pg_trgm).
- **FR7: Reviews & Ratings**
  - Post-purchase/order reviews; aggregate for products/services.
- **FR8: Analytics Integration**
  - Track e-commerce metrics in PostHog (conversion, AOV); tie to booking data.

## 4. Non-Functional Requirements (NFRs)
- **Performance**: Page loads <2s; real-time updates <1s latency (Convex/Supabase).
- **Scalability**: Handle 10k concurrent users; auto-scale via Vercel/Supabase.
- **Security**: Clerk auth for all actions; PCI compliance for payments; GDPR for customer data.
- **Reliability**: 99.9% uptime; feature flags prevent regressions.
- **Accessibility**: WCAG 2.1 AA; mobile-first responsive design.
- **Maintainability**: TypeScript throughout; modular components (extend existing like ProductCard.tsx).

## 5. Data Models
Extend existing Supabase schema (products table exists):
- **Products Table (Extend)**:
  - id (UUID, PK), name, description, price, stock_quantity (int), category (enum: 'haircare', 'skincare'), images (array), created_at.
  - Add: reviews_avg (float), is_active (bool, feature flag).
- **New: Orders Table**:
  - id (UUID, PK), user_id (FK to Clerk users), total_amount, status (enum: pending, paid, shipped), items (JSON: array of {product_id, quantity}), booking_id (optional FK to appointments), created_at.
- **New: Order_Items Table** (for normalization):
  - order_id (FK), product_id (FK), quantity, price_at_purchase.
- **New: Reviews Table**:
  - id (UUID, PK), product_id (FK), user_id (FK), rating (1-5), comment, created_at.
- **Inventory Logs** (Supabase table or Convex for real-time): track stock changes.
- Relationships: Orders 1:M Order_Items; Products 1:M Reviews/Order_Items; Optional link to existing appointments table for hybrid.

Use Supabase RLS for row-level security; Convex for real-time order updates.

## 6. UI/UX Goals
- **Mobile-First**: Responsive design; PWA support (extend existing manifest.ts) for offline cart viewing.
- **Hybrid Flows**: Unified cart UI (e.g., BookingWidget + ProductCard in one view); intuitive steps: Select service > Add products > Checkout.
- **Personalization**: Dashboard shows recs based on history; search autocomplete.
- **Accessibility**: ARIA labels on forms; dark mode via theme-context.tsx.
- **Metrics**: Aim for <20% cart abandonment; NPS >8 via PostHog tracking.

## 7. Integrations
- **Payments**: Enhance PayStack with Stripe/PayPal (new API routes: /api/payments/stripe).
- **Search**: Elasticsearch via Supabase (or pg_search extension); fallback to Supabase full-text.
- **AI Recommendations**: Integrate Google GenAI (via existing geminiService.ts) for simple ML recs (e.g., collaborative filtering on bookings/products).
- **Analytics**: Extend PostHog events for e-commerce (e.g., add_to_cart, purchase).
- **External**: Webhooks for inventory sync (e.g., with suppliers); WhatsApp for order notifications (existing /api/whatsapp).
- **No New DB**: Use Supabase extensions for Redis if caching needed; avoid MongoDB unless scale demands.

## 8. Epics and User Stories
Epics sharded by phases for incremental dev; use feature flags for safe rollout. Stories prioritized (MVP first: catalog + cart).

### Epic 1: Planning/Design (2-4 weeks)
- Story 1.1: As PM, define detailed wireframes for hybrid cart (integrate with BookingForm).
- Story 1.2: As Architect, design data schema extensions (Supabase migrations).
- Story 1.3: As UX, prototype mobile PWA flows.

### Epic 2: Development - Authentication & API (4-6 weeks)
- Story 2.1: As Dev, extend Clerk for e-commerce roles (e.g., buyer permissions).
- Story 2.2: As Dev, build API routes for orders/inventory (/api/orders, /api/inventory/sync; extend existing products route).
- Story 2.3: As Dev, implement search/filtering with Supabase queries.

### Epic 3: Development - Inventory & Frontend (6-8 weeks)
- Story 3.1: As Dev, add inventory tracking (Convex real-time stock updates).
- Story 3.2: As Dev, enhance Cart.tsx for hybrid items (services + products).
- Story 3.3: As Dev, create ProductCatalog page with ProductCard.tsx extensions.

### Epic 4: Development - Integrations & AI (4 weeks)
- Story 4.1: As Dev, integrate Stripe/PayPal alongside PayStack (/api/payments).
- Story 4.2: As Dev, add AI recs endpoint (/api/products/ai-recommendations) using Google GenAI.
- Story 4.3: As Dev, setup Elasticsearch via Supabase for advanced search.

### Epic 5: Development - Reviews & Analytics (2 weeks)
- Story 5.1: As Dev, implement reviews UI/form (post-checkout modal).
- Story 5.2: As Dev, track e-commerce events in PostHog.

### Epic 6: Security (Ongoing, 1 week sprint)
- Story 6.1: As Sec, audit payments for PCI; add RLS to new tables.
- Story 6.2: As Dev, implement rate limiting on APIs.

### Epic 7: Testing/Deployment (2-3 weeks)
- Story 7.1: As QA, unit/integration tests for new APIs (extend existing __tests__).
- Story 7.2: As Dev, deploy with feature flags; A/B test hybrid cart.
- Story 7.3: As Dev, monitor with existing /api/health.

### Epic 8: Post-Launch (Ongoing)
- Story 8.1: As PM, gather feedback via PostHog; iterate on recs.
- Story 8.2: As Dev, optimize performance based on metrics.

Total Estimated Effort: 20-27 weeks, sharded for parallel dev (e.g., API + Frontend).

## 9. Assumptions and Risks
- **Assumptions**: Existing Supabase schema accessible; no major Clerk/Convex limitations; team familiar with stack.
- **Risks**:
  - Integration complexity (PayStack + Stripe): Mitigate with phased rollout.
  - Data migration for products: Use existing server actions; risk of downtime (use flags).
  - Scale for real-time inventory: If Supabase limits hit, add Redis (medium risk).
  - Regression to bookings: High risk; mitigate with comprehensive tests.
  - Dependencies: Google GenAI API availability; fallback to rule-based recs.

## Approval
- PM Sign-off: Pending
- Stakeholders: Dev Lead, UX, QA
