# Deployment Checklist

## Database Setup
- [ ] Run `supabase/migrations/001_create_core_tables.sql`
- [ ] Run `supabase/migrations/002_rls_policies.sql`
- [ ] Verify tables created: `tenants`, `users`, `services`, `staff`, `working_hours`, `bookings`

## Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE`
- [ ] Configure Vercel secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, project IDs

## Bootstrap Tenant
```bash
npm run bootstrap-tenant "InStyle Hair" instyle admin@instyle.co.za
```

## Testing
- [ ] Run unit tests: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Verify booking flow works

## Deployment
- [ ] Push to `staging` branch for staging deployment
- [ ] Push to `main` branch for production deployment
- [ ] Verify domains: appointmentbooking.co.za, instylehairboutique.co.za

## Post-Deployment
- [ ] Test booking creation via API
- [ ] Verify tenant isolation (RLS working)
- [ ] Check monitoring/alerts