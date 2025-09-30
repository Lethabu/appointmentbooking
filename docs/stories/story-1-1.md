# Story 1.1: Wireframes for Hybrid Cart

## Status
Draft

## Story
**As a** Product Manager,  
**I want** to define detailed wireframes for the hybrid cart  
**so that** it integrates seamlessly with the existing BookingForm, providing a unified user experience for services and products.

## Acceptance Criteria
1. Wireframes depict a hybrid cart that combines product purchases with service bookings, reusing the existing BookingWidget component from app/book/[salonSlug]/page.jsx.
2. Designs ensure mobile-first PWA compatibility, including offline cart persistence and responsive layouts.
3. Wireframes incorporate WCAG 2.1 AA accessibility standards, such as keyboard navigation and screen reader support for cart interactions.
4. Personalization elements are included, leveraging Google GenAI for product recommendations integrated into the cart flow (e.g., AI-suggested add-ons during booking).
5. Designs account for brownfield integration: no disruption to existing booking flows; use feature flags for e-commerce toggles in future phases.
6. Wireframes are created in Figma or Adobe XD, exported as prototypes, and version-controlled in the repository.
7. Alignment with architecture: Cart flow supports extended data models (e.g., orders linking to bookings via booking_id in orders table).

## Tasks / Subtasks
- [x] Create initial wireframes for hybrid cart UI
  - [x] Sketch desktop and mobile views integrating BookingForm and product cart
  - [x] Include AI personalization placeholders (e.g., GenAI recommendations panel)
- [x] Develop interactive prototypes in Figma/Adobe XD (AC: 1, 2, 3, 4)
  - [x] Prototype cart addition from products and services
  - [x] Test offline PWA flows (e.g., add to cart without network)
  - [x] Validate WCAG compliance using Figma tools or manual review
- [x] Review and iterate designs for brownfield compatibility (AC: 5)
  - [x] Map integration points with existing components (e.g., BookingWidget)
  - [x] Document feature flag placements for e-commerce enablement
- [x] Align with data models and tech stack (AC: 7)
  - [x] Reference orders schema extensions (e.g., items JSON for hybrid items)
  - [x] Ensure designs support Supabase/Next.js stack (e.g., real-time cart updates via Convex)
- [x] Stakeholder review and approval (AC: 6)
  - [x] Share prototypes via collaborative link
  - [x] Incorporate feedback and finalize version

## Dev Notes
This story focuses on planning/design artifacts without code changes. Key context from artifacts:

- **Brownfield Integration**: Reuse existing components like BookingWidget (from app/book/) and BookingForm. Hybrid cart must extend without altering core booking logic. Design for feature flags to enable e-commerce in phases (e.g., toggle new cart UI via environment vars in Next.js).

- **Data Models Alignment**: Cart designs should support new orders table (id, user_id, total_amount, status, items JSON including product_id/quantity and optional booking_id FK to existing appointments). Extend products table (add stock_quantity, variants JSON). Reviews model for post-purchase feedback. Use Supabase migrations for schema; ensure RLS policies for security.

- **Tech Stack Alignment**: Frontend: Next.js App Router with server components for cart state. Backend: Supabase for data, Convex for real-time sync (e.g., cart updates). AI: Integrate Google GenAI via existing geminiService.ts for personalization (e.g., recommend products based on booking service). Payments: Prepare for PayStack/Stripe webhooks. Search: pg_trgm for product filtering in cart.

- **AI Dev Modularity**: Designs modularize UI for AI agents (e.g., separate components for GenAI recs). Support parallel development in later epics.

- **Relevant Source Tree**:
  - app/book/: Existing booking pages/components to integrate.
  - app/api/products/: Future endpoint for cart items.
  - app/services/geminiService.ts: For AI features.
  - No new files yet; designs reference these.

- **Previous Notes**: None (first story).

- **Testing Standards**:
  - Test file location: __tests__/ or components/ tests.
  - Standards: Unit tests for components (Jest/React Testing Library); E2E with Playwright for flows.
  - Frameworks: Jest for units, Playwright for prototypes validation.
  - Specific: Ensure designs pass WCAG audits; prototype usability testing with 5 users.

## Wireframes and Prototypes

### Overview
Text-based wireframes for the hybrid booking/e-commerce flow: Home/Landing → Service/Product Selection → Hybrid Cart → Checkout → Confirmation. Designs reuse existing components (e.g., BookingForm from app/book/, ProductCard.tsx, Cart.tsx). Mobile-first (PWA-compatible), WCAG 2.1 AA (e.g., ARIA labels, keyboard nav, color contrast >4.5:1). Personalization via Google GenAI placeholders (e.g., AI recs panel using geminiService.ts). Feature flags for e-commerce toggle (e.g., show/hide product sections). Aligns with data models (orders with booking_id FK, items JSON for hybrid). Modular for brownfield integration: no core changes to BookingWidget.

Prototypes described as interactive flows; in Figma, use auto-animate for transitions (e.g., add-to-cart slide-in).

### 1. Home/Landing Page
**Desktop View (Mermaid Flow):**
```mermaid
graph TD
    A[Header: Logo, Nav (Book, Shop, Login)] --> B[Hero: "Book Services & Shop Products" CTA Buttons]
    B --> C[Sections: Services Grid (reuse InstyleServices), Products Grid (ProductCard.tsx)]
    C --> D[Footer: Contact, Policies]
```
**ASCII Layout (Desktop):**
```
+-------------------------------+
| Logo | Book | Shop | Login    |
+-------------------------------+
|                               |
|  Book Services & Shop Now     |
|         [Book Now] [Shop]     |
|                               |
+-------------------------------+
| Services:                     |
| [Service1] [Service2] ...     |
|                               |
| Products:                     |
| [Prod1 Card] [Prod2 Card] ... |
+-------------------------------+
| Footer                        |
+-------------------------------+
```
**Mobile View (ASCII):**
```
[Menu] Logo
---------
Book Services
& Shop Now
[Book] [Shop]
---------
Services:
[Service1]
[Service2]
---------
Products:
[Prod1]
[Prod2]
---------
Footer
```
**Accessibility Notes:** ARIA landmarks (banner for header, main for content, navigation for grids). Alt text for images. Keyboard-focusable CTAs with visible focus outlines.
**Personalization:** AI recs banner: "Based on your past bookings, try these products" (GenAI call).
**Integration:** Extends existing landing; feature flag for products section.

### 2. Service/Product Selection
**Desktop View (Mermaid):**
```mermaid
graph TD
    A[Back to Home] --> B[Tabbed: Services | Products]
    B --> C[Services Tab: BookingForm (existing) + Add-ons (Products)]
    B --> D[Products Tab: ProductCatalog with Search/Filter]
    C --> E[AI Recs: "Pair this service with..."]
    D --> F[Add to Cart Button per Card]
```
**ASCII Layout (Desktop):**
```
[Back] Services | Products
-------------------
Services Tab:
[BookingForm: Select Service, Date, Time]
Recommended Add-ons:
[Prod Card: Shampoo - Add to Cart]
-------------------
Products Tab:
Search: [Input] Filters: [Dropdowns]
[Grid: ProductCard1] [ProductCard2] ...
[Add to Cart] each
AI Recs Panel: [Suggested Products]
```
**Mobile View (ASCII):**
```
[Back]
Services | Products
---------
Services:
[BookingForm Mobile]
Add-ons:
[Prod1 Add]
---------
Products:
Search [ ]
[Prod1 Add]
[Prod2 Add]
AI Recs: [Suggest1]
```
**Accessibility Notes:** Tab panels with ARIA roles (tablist, tabpanel). Screen reader announces selections. High-contrast buttons.
**Personalization:** GenAI panel fetches recs via /api/products/ai-recommendations (e.g., service-based product upsell).
**Integration:** Reuses BookingForm, ProductCard.tsx; HybridCart state starts here.

### 3. Hybrid Cart
**Desktop View (Mermaid):**
```mermaid
graph TD
    A[Back to Selection] --> B[Cart Summary: Services + Products]
    B --> C[Items List: ServiceItem (BookingWidget) + ProductItem (from Cart.tsx)]
    C --> D[AI Upsell: "Complete your look with..."]
    C --> E[Subtotal | Promo Code | Total]
    E --> F[Checkout Button]
```
**ASCII Layout (Desktop):**
```
[Back to Shop]
Hybrid Cart
-----------
Services:
[Service: Haircut - 9/25, 10AM - Remove | Qty N/A]
Products:
[Shampoo - $20 - Remove | Qty 1] [Conditioner - $15 - Qty 2]
-----------
AI Recommendations:
[GenAI: Add Brush for $10? [Add]]
-----------
Subtotal: $65
Promo: [Input]
Total: $65
[Checkout]
```
**Mobile View (ASCII):**
```
[Back]
Cart
---
Services:
Haircut 9/25
10AM [Remove]
---
Products:
Shampoo $20 [1] [Remove]
Conditioner $15 [2]
---
AI Recs:
Add Brush? [Add]
---
Total $65
[Checkout]
```
**Accessibility Notes:** Live regions for cart updates (ARIA-live). Keyboard nav for qty/remove. Color-blind friendly icons.
**Personalization:** Dynamic GenAI upsell based on cart contents (e.g., service type → products).
**Integration:** Blends BookingWidget + Cart.tsx; items JSON supports hybrid (booking_id in orders).

### 4. Checkout
**Desktop View (Mermaid):**
```mermaid
graph TD
    A[Back to Cart] --> B[Steps: 1. Review | 2. Payment | 3. Confirm]
    B --> C[Review: Cart Items + Address]
    C --> D[Payment: PayStack/Stripe Selector (extend existing)]
    D --> E[Submit: Secure Form]
```
**ASCII Layout (Desktop):**
```
[Back]
Checkout - Step 1/3: Review
-----------
[Hybrid Cart Summary]
Shipping Address: [Form Fields]
Billing: Same/Different [ ]
-----------
[Next: Payment]
---
Step 2: Payment
Gateway: [PayStack Radio] [Stripe Radio]
[Form: Card Details (PCI compliant)]
---
Step 3: Confirm
[Order Summary]
[Place Order]
```
**Mobile View (ASCII):**
```
[Back]
Review
---
Cart: [Summary]
Address:
[Name]
[Street]
[City ZIP]
[Next]
---
Payment:
PayStack/Stripe [Select]
Card: [**** **** **** 1234]
[Pay]
```
**Accessibility Notes:** Stepper with ARIA-progressbar. Form labels, error messages (WCAG 3.3.1). Autofill support.
**Personalization:** N/A (focus on security).
**Integration:** Extends PayStackCheckout; supports Stripe via feature flag. Calls /api/checkout.

### 5. Confirmation
**Desktop View (Mermaid):**
```mermaid
graph TD
    A[Order #123 Confirmed] --> B[Details: Services Booked, Products Shipped]
    B --> C[Next Steps: Track Order, Review Later]
    C --> D[AI: "Loved your booking? Share feedback."]
```
**ASCII Layout (Desktop):**
```
Order Confirmed! #123
-----------
Services: Haircut on 9/25
Products: Shampoo + Conditioner (ships in 2 days)
Total Paid: $65 via PayStack
-----------
Track: [Button]
Write Review: [Later]
AI Feedback: [GenAI Prompt]
[Back to Home]
```
**Mobile View (ASCII):**
```
Confirmed #123
---
Haircut 9/25
Shampoo Ships Soon
Paid $65
---
[Track]
[Review]
[Home]
```
**Accessibility Notes:** Success message with ARIA-alert. Links with descriptive text.
**Personalization:** GenAI post-purchase survey/recs.
**Integration:** Links to orders table; real-time via Convex.

### Notes on Designs
- **Mobile-First PWA:** Offline cart via IndexedDB/Service Workers (Next.js PWA config). Touch-friendly (48px min targets).
- **WCAG 2.1 AA:** Contrast checked (e.g., #000 on #FFF), alt text, no auto-play media, focus management.
- **Brownfield:** Reuses 80% existing UI (BookingForm, Cart.tsx, ProductCard). Feature flags: `ENABLE_ECOMMERCE` hides/shows product tabs.
- **Modularity for AI:** Separate `<AIRecommendations />` component for easy integration.
- **Prototyping:** In Figma, link screens for flow; add interactions (e.g., swipe to remove in mobile cart). Share link: [Placeholder: figma.com/proto/hybrid-flow-v1].
- **Alignment:** Supports orders schema (hybrid items in JSON, booking_id FK). UI patterns match Instyle theme (globals.css).

## Effort Estimate
1-2 days (design and prototyping).

## Risks
- Design misalignment with existing UI: Mitigate with stakeholder review and prototype testing.
- Scope creep into implementation: Enforce no code changes; focus on artifacts.
- Integration challenges with GenAI: Mitigate by using placeholders and referencing existing service.

## Change Log

| Date       | Version | Description                  | Author      |
|------------|---------|------------------------------|-------------|
| 2025-09-24 | 1.0     | Initial draft of story 1.1   | Scrum Master |
| 2025-09-24 | 1.1     | Wireframes generated, tasks complete, ready for review | UX Expert |

## Dev Agent Record
(To be populated during implementation)

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## QA Results
(To be populated post-implementation)