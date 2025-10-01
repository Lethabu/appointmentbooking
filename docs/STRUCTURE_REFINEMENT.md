# Project Structure Refinement Report

## Executive Summary
This report analyzes the specified directories in the multi-tenant appointment booking platform, focusing on their roles, overlaps, redundancies, and alignment with Spec-Driven Development (SDD) best practices. The analysis reveals significant redundancies in booking-related routes and components, particularly around tenant-specific implementations for "instyle" and variants like "instylehairboutique". Key issues include duplicated booking forms, inconsistent data fetching (Supabase vs. Prisma), and fragmented routing that violates modularity and DRY principles. Recommendations prioritize consolidating into a unified [tenant]/book structure, leveraging resolver.ts for dynamic loading and RLS for tenant isolation, supporting SDD specs like Tenant Onboarding (provisioning via Terraform) and UI Enhancement (Stitch for unified components). No file changes are made; this is analysis only.

## Summary of Each Directory

### 1. app/[tenant]/book
**Role**: Dynamic route for tenant-specific booking pages. Validates tenant (e.g., 'instyle') and renders a generic BookingWidget. Serves as a centralized entry for multi-tenant booking, ensuring isolation via params.

**Key Files/Functions**:
- [`page.tsx`](app/[tenant]/book/page.tsx:1): Renders `<h1>Book Appointment - {tenant}</h1>` and `<BookingWidget tenant={tenant} />`. Uses `notFound()` for invalid tenants. Simple, no layout or components directory.

### 2. tenants/instyle
**Role**: Isolated tenant codebase for "instyle", containing custom components, styles, and lib for database/payment integration. Represents a full, standalone tenant setup, potentially for deployment isolation.

**Key Files/Functions**:
- [`src/components/BookingForm.tsx`](tenants/instyle/src/components/BookingForm.tsx:1): Form using react-hook-form, submits to `/api/book` with tenantId 'instyle'.
- [`src/components/ProductCard.tsx`](tenants/instyle/src/components/ProductCard.tsx:1): Renders product details (name, price, stock).
- [`src/components/ServiceCard.tsx`](tenants/instyle/src/components/ServiceCard.tsx:1): Service UI with image, price, duration, "Book Now" link.
- [`src/lib/prisma.ts`](tenants/instyle/src/lib/prisma.ts:1): Tenant-isolated Prisma client.
- [`src/lib/paystack.ts`](tenants/instyle/src/lib/paystack.ts:1): Paystack initialization and transaction creation.

### 3. app/instylehairboutique
**Role**: Tenant-specific app routes for "instylehairboutique", handling home, services, booking (SuperSaaS integration), checkout. Full tenant site with static services data and dynamic booking.

**Key Files/Functions**:
- [`layout.tsx`](app/instylehairboutique/layout.tsx:1): Provides providers (PostHog, Convex, Cart), Toaster.
- [`page.tsx`](app/instylehairboutique/page.tsx:1): Home page with hero, services list (static data), BookingWidget, GoogleMap, ContactSection. SEO with schema.org.
- [`book/page.tsx`](app/instylehairboutique/book/page.tsx:1): Booking with SuperSaaS iframe, service selection via query params.
- [`services/page.tsx`](app/instylehairboutique/services/page.tsx:1): Services grid with cards, links to book?service=id.
- [`checkout/page.tsx`](app/instylehairboutique/checkout/page.tsx:1): CheckoutForm and Cart for tenant.

### 4. app/instyle-hair-boutique
**Role**: Variant tenant route for "instyle-hair-boutique", comprehensive single-page app with services, products, appointments history, and inline booking form using Supabase.

**Key Files/Functions**:
- [`page.jsx`](app/instyle-hair-boutique/page.jsx:1): Fetches services/products/appointments from Supabase, renders hero, services/products cards, appointments sections, booking form submitting to /api/book.
- [`data.js`](app/instyle-hair-boutique/data.js:1): Static data for services, socials.

### 5. app/instyle
**Role**: Core tenant routes for "instyle", with layout, API endpoints for booking/Paystack, error handling. Delegates UI to client component, focuses on backend integration.

**Key Files/Functions**:
- [`layout.tsx`](app/instyle/layout.tsx:1): Tenant-specific navbar/footer, metadata.
- [`page.tsx`](app/instyle/page.tsx:1): Renders InstyleClientPage.
- [`api/book/route.ts`](app/instyle/api/book/route.ts:1): POST handler with Zod validation, WhatsApp confirmation via Aisensy.
- [`api/paystack/route.ts`](app/instyle/api/paystack/route.ts:1): POST for Paystack transaction initialization.
- [`error.tsx`](app/instyle/error.tsx:1): Error boundary.

### 6. app/booking/[salonSlug]
**Role**: Salon-specific dynamic booking route, fetches salon/services from Supabase, multi-step flow (service selection, calendar).

**Key Files/Functions**:
- [`page.jsx`](app/booking/[salonSlug]/page.jsx:1): Fetches salon/services, steps for service select, SimpleCalendar, confirmation.

### 7. app/book
**Role**: General booking routes with nested dynamic segments for salon/service, plus test pages. Serves as platform-wide booking entry.

**Key Files/Functions**:
- [`page.tsx`](app/book/page.tsx:1): Likely entry/redirect (not read, but inferred as general).
- [`[salonSlug]/page.jsx`](app/book/[salonSlug]/page.jsx:1): Nested salon booking.
- [`[salonSlug]/[serviceId]/page.jsx`](app/book/[salonSlug]/[serviceId]/page.jsx:1): Service-specific booking.
- Test pages (env-test, test): Development utilities.

## Comparison Matrix

| Directory | Purpose | Key Files | Overlaps | Unique Elements | Issues |
|-----------|---------|-----------|----------|-----------------|--------|
| app/[tenant]/book | Tenant-validated booking entry | [`page.tsx`](app/[tenant]/book/page.tsx:1) | BookingWidget used in multiple (e.g., instylehairboutique) | Tenant validation logic | Limited to valid tenants; no full UI, relies on widget – potential 404s if widget fails. |
| tenants/instyle | Isolated tenant codebase | [`BookingForm.tsx`](tenants/instyle/src/components/BookingForm.tsx:1), [`prisma.ts`](tenants/instyle/src/lib/prisma.ts:1) | BookingForm similar to inline forms in instyle-hair-boutique; Paystack lib overlaps api/paystack | Standalone Prisma/Paystack, custom components (ProductCard, ServiceCard) | Duplication with app/instyle API; not integrated with dynamic routing – violates DRY, hard to scale tenants. |
| app/instylehairboutique | Full tenant site (home/services/book) | [`page.tsx`](app/instylehairboutique/page.tsx:1), [`book/page.tsx`](app/instylehairboutique/book/page.tsx:1) | SuperSaaS booking overlaps SimpleCalendar in booking/[salonSlug]; services list duplicates static data in data.js | SuperSaaS iframe, static services, GoogleMap | Redundant with [tenant]/book; hardcoded services – no RLS isolation, potential data leaks. |
| app/instyle-hair-boutique | Comprehensive tenant page with Supabase | [`page.jsx`](app/instyle-hair-boutique/page.jsx:1) | Inline booking form overlaps BookingForm; Supabase fetches duplicate services/appointments from booking/[salonSlug] | Appointments history/future, full SPA with cards | Heavy client-side, no layout – overlaps general book routes; Supabase direct access risks tenant isolation. |
| app/instyle | Core tenant backend/UI delegate | [`api/book/route.ts`](app/instyle/api/book/route.ts:1), [`layout.tsx`](app/instyle/layout.tsx:1) | API/book overlaps general /api/book; WhatsApp/Aisensy unique but could be resolver-loaded | Aisensy WhatsApp templates, Paystack init | Fragmented from tenants/instyle lib; delegate to client page – inconsistent with other variants. |
| app/booking/[salonSlug] | Dynamic salon booking flow | [`page.jsx`](app/booking/[salonSlug]/page.jsx:1) | Service selection/calendar overlaps book nested routes and SuperSaaS | Multi-step (service->calendar), Supabase salon fetch | Overlaps nested book/[salonSlug]; no tenant param – potential cross-tenant leaks without resolver.ts. |
| app/book | Platform booking hub | [`[salonSlug]/page.jsx`](app/book/[salonSlug]/page.jsx:1), test pages | Nested dynamics overlap booking/[salonSlug]; test pages redundant | General entry, service-specific nesting | Fragmented structure (page + nested) – causes routing conflicts (e.g., 404s); test dirs clutter production. |

## Merger Recommendations

### High Priority: Consolidate Tenant-Specific Booking Routes (app/instyle*, app/[tenant]/book)
**Rationale**: Multiple "instyle" variants (instylehairboutique, instyle-hair-boutique, instyle) duplicate booking UI/API, violating DRY and modularity. Merge into unified app/[tenant]/book with dynamic loading via resolver.ts for isolation (SDD: Tenant Onboarding spec for provisioning, RLS for data). Reduces 404s from conflicting routes.

**Step-by-Step Guidance**:
1. **File Migrations**: Move components (BookingForm, ServiceCard from tenants/instyle; services list from instylehairboutique) to shared lib/components/booking/. Migrate static data (data.js) to Supabase seed scripts. Delete redundant dirs (instyle*, instyle-hair-boutique) post-migration.
2. **Refactoring**: Update [`page.tsx`](app/[tenant]/book/page.tsx:1) to conditionally load tenant-specific UI via resolver.ts (e.g., `const TenantUI = await resolveTenantComponent(tenant, 'BookingPage')`). Integrate SuperSaaS/SimpleCalendar into BookingWidget with tenant prop. Use Zod for unified validation across APIs.
3. **Config Updates**: In [`next.config.js`](next.config.js:1), add rewrites for legacy routes (e.g., /instylehairboutique/book -> /[tenant]/book?tenant=instyle). Enable RLS in Supabase for tenant_id filtering.
4. **IaC & Tests**: Update Terraform (squarespace.tf) for tenant provisioning (e.g., dynamic subdomain mapping). Add Jest tests for isolation (e.g., test resolver.ts loads correct component without leaks). Use feature flags (e.g., via LaunchDarkly) for rollback.
5. **Tie to SDD**: Supports UI Enhancement (Stitch for unified component gen) by centralizing widgets; Tenant Onboarding via automated provisioning of resolver entries.

### Medium Priority: Unify General Booking Routes (app/book, app/booking/[salonSlug])
**Rationale**: Overlapping dynamic booking flows (nested [salonSlug]/[serviceId] vs. flat [salonSlug]) cause routing redundancy and maintenance overhead. Merge into app/booking/[salonSlug]/[serviceId] for scalability, ensuring tenant isolation.

**Step-by-Step Guidance**:
1. **File Migrations**: Consolidate page.jsx from both to app/booking/[salonSlug]/page.jsx, incorporating multi-step logic. Remove app/book nested dirs; migrate test pages to __tests__/.
2. **Refactoring**: Enhance page.jsx with tenant resolver for salon fetch (Supabase query with tenant filter). Standardize calendar (SimpleCalendar) across.
3. **Config Updates**: Update next.config.js rewrites for /book/* -> /booking/[salonSlug]. Add middleware for tenant header injection.
4. **IaC & Tests**: Terraform for salon subdomain infra. Jest for end-to-end booking flow, verifying no cross-tenant data.
5. **Tie to SDD**: Aligns with Booking Flow Payments spec (unified checkout post-merge); RLS prevents leaks.

### Low Priority: Integrate Isolated Tenant Codebase (tenants/instyle)
**Rationale**: Standalone codebase duplicates lib/API; migrate to shared for maintainability, but low as it's isolated.

**Step-by-Step Guidance**:
1. **File Migrations**: Move lib/paystack/prisma to lib/tenants/instyle/, reference via resolver.
2. **Refactoring**: Replace direct Prisma with tenant-scoped client in resolver.ts.
3. **Config Updates**: next.config.js for build-time tenant bundling if needed.
4. **IaC & Tests**: Terraform for tenant DB schema. Jest for component isolation.
5. **Tie to SDD**: Supports Agent Integration (WhatsApp via unified API).

**Rollback Strategy**: Use feature flags for all mergers; monitor with Sentry for errors. Post-merge, audit for isolation via resolver.ts tests.