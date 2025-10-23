# Automated Tenant Onboarding: Technical Specification

## 1. Overview

This document outlines the technical implementation for a fully automated, self-service tenant onboarding system. The goal is to eliminate manual developer intervention, improve scalability, and provide a seamless sign-up experience for new salon clients. This specification is guided by the principles of Spec-Driven Development.

## 2. Core Components

The automated system will consist of four main components:
1.  **Dynamic Middleware:** The routing layer will be updated to fetch tenant information from the database in real-time.
2.  **Public Landing Page:** The main marketing site will be enhanced to drive conversions to the new sign-up flow.
3.  **Sign-Up Page:** A new, self-service page where prospective tenants can create an account.
4.  **Tenant Creation API:** A secure backend endpoint to handle the logic of creating a new tenant.

---

## 3. Database Schema

### `tenants` Table

No major changes are required to the existing `tenants` table structure. We will, however, ensure the following fields are populated by the new automated system:

| Column        | Type      | Description                                                                 |
| ------------- | --------- | --------------------------------------------------------------------------- |
| `id`          | `uuid`    | **Primary Key.** Auto-generated.                                            |
| `name`        | `text`    | The full name of the salon (e.g., "InStyle Hair Boutique").                 |
| `slug`        | `text`    | A URL-friendly identifier (e.g., "instylehairboutique"). **Must be unique.** |
| `custom_domain`| `text`   | The tenant's custom domain (e.g., "instylehairboutique.co.za").            |
| `status`      | `text`    | The status of the tenant account (e.g., `pending`, `active`, `suspended`).  |
| `created_at`  | `timestamp`| The timestamp of when the tenant was created.                               |

---

## 4. API Endpoint: Tenant Creation

A new API endpoint will be created to handle the creation of new tenants.

-   **Route:** `POST /api/tenants/create`
-   **Authentication:** Public, with rate-limiting and security checks.

### Request Body

```json
{
  "salonName": "The Glam Room",
  "requestedSlug": "theglamroom",
  "customDomain": "theglamroom.com",
  "ownerEmail": "owner@theglamroom.com",
  "ownerPassword": "a-strong-password"
}
```

### Success Response (201 Created)

```json
{
  "status": "success",
  "message": "Tenant created successfully.",
  "tenantId": "a-uuid-string",
  "domainSetupInstructions": {
    "type": "CNAME",
    "host": "www",
    "value": "cname.appointmentbooking.co.za"
  }
}
```

### Error Responses

-   **409 Conflict:** If the `requestedSlug` or `customDomain` already exists.
-   **400 Bad Request:** For invalid input data (e.g., missing fields, weak password).
-   **500 Internal Server Error:** For unexpected server-side issues.

---

## 5. User Flow: New Tenant Sign-Up

1.  **Landing Page:** A prospective tenant visits `appointmentbooking.co.za` and clicks a prominent "Get Started" or "Sign Up" call-to-action button.
2.  **Sign-Up Form:** They are directed to `/onboarding/signup`, where they fill out the following fields:
    -   Salon Name
    -   Desired Subdomain (`[slug].appointmentbooking.co.za`)
    -   Custom Domain (optional at this stage)
    -   Admin Email
    -   Password
3.  **Form Submission:** Upon submission, the frontend sends a `POST` request to the `/api/tenants/create` endpoint.
4.  **Account Creation:** The API processes the request, creates the new tenant record in the database, and sets the initial status to `pending`.
5.  **Confirmation & Next Steps:** The user is redirected to a success page that provides:
    -   Confirmation that their account is created.
    -   Clear instructions for configuring their DNS to point their custom domain to the platform.
    -   A link to their new admin dashboard.

---

## 6. Middleware Refactoring

The `middleware.ts` file will be refactored to remove the hardcoded `tenants` object. Instead, it will perform a real-time lookup from the database to identify the tenant based on the incoming hostname.

### Pseudocode for the New Middleware Logic:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Bypass internal and API paths
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Fetch tenant from Supabase based on hostname
  const supabase = createSupabaseClient(request);
  const { data: tenant } = await supabase
    .from('tenants')
    .select('slug')
    .eq('custom_domain', hostname)
    .single();

  if (tenant) {
    // Rewrite to the dynamic tenant path
    url.pathname = `/${tenant.slug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // If no tenant is found, it's a request for the main platform
  return NextResponse.next();
}
```

This specification provides a clear blueprint for building a scalable, automated onboarding system. By following these guidelines, we can ensure a consistent and high-quality implementation.
