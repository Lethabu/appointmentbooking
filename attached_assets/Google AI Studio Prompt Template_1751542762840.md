**GOAL**: Generate a production-ready SaaS platform for appointment bookings (appointmentbookings.co.za) with:  
1. **Multi-Tenant Architecture**:  
   - PostgreSQL schema with RLS (Row-Level Security) for `salons`, `users`, `services`, `appointments`, `orders` :cite[1]:cite[5].  
   - Isolated data per tenant using `tenant_id` partitioning.  
2. **Core Features**:  
   - Next.js frontend with dynamic routing (`/[salon]/book`).  
   - Supabase Auth with OAuth, Magic Links, and RBAC (Owner/Staff roles).  
   - Stripe/Netcash integration for subscriptions + Payflex for tenant e-commerce :cite[2]:cite[7].  
   - Real-time calendar sync via WebSockets.  
3. **AI Agents**:  
   - **Nia**: Booking assistant (GPT-4o) for client queries.  
   - **Orion**: Product recommendation engine (Gemini Pro 1.5) :cite[6].  
   - WhatsApp reminders via Twilio API.  
4. **Infrastructure**:  
   - Vercel edge deployment + Cron jobs for nightly backups.  
   - Redis caching for Supabase queries.  

**TECH STACK**:  
- Frontend: Next.js 14 (App Router), Tailwind CSS  
- Backend: Supabase (PostgreSQL, Edge Functions)  
- AI: Gemini Pro 1.5, GPT-4-turbo  
- Payments: Stripe + Payflex  

**OUTPUT**: Fully runnable GitHub repo with `docker-compose.yml` and Vercel deploy button.  