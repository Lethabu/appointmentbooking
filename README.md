# AppointmentBookings.co.za - AI Vertical SaaS Platform

This project is a multi-tenant AI-powered SaaS platform for appointment bookings, built with Next.js. It is designed to provide a scalable and customizable solution for businesses to manage their appointments, with each tenant operating under their own isolated environment.

## Architecture Highlights:

*   **Multi-Tenancy:** Supports tenant identification via custom domains, subdomains, or path-based routing (for development).
*   **Data Isolation:** Utilizes Supabase with Row Level Security (RLS) and tenant-specific data partitioning to ensure strict data separation between tenants.
*   **Branding & Customization:** Allows tenants to customize their branding (colors, logos) through a flexible theme management system.
*   **Tenant-Aware Authentication:** Implements a robust authentication flow with JWT claims that include tenant context, ensuring secure access and data segregation.
*   **AI Integration:** Leverages Google Generative AI and OpenAI for potential AI-driven features (e.g., smart scheduling, customer service automation).

## Technology Stack:

*   **Framework:** Next.js
*   **Database & Auth:** Supabase
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **AI:** Google Generative AI, OpenAI
*   **Payments:** Stripe
*   **Testing:** Jest

## Getting Started:

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables:

See `.env.example` for required environment variables. Never commit actual API keys to the repository.

## Roadmap:

The current focus is on implementing the core multi-tenant architecture as detailed in `ARCHITECTURE.md`.