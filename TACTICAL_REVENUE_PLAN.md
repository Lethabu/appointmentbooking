# Tactical Revenue Plan 💸

## Immediate Actions (Day 0-2) - P0

### 1. Database Setup
```bash
# Run in Supabase SQL Editor:
# 1. supabase/migrations/001_create_core_tables.sql
# 2. supabase/migrations/002_rls_policies.sql  
# 3. supabase/migrations/003_booking_rpc.sql
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Fill in your Supabase URL and service role key
```

### 3. Bootstrap First Tenant
```bash
npm run bootstrap-tenant "InStyle Hair" instyle admin@instyle.co.za
```

### 4. Deploy Staging
```bash
git checkout -b staging
git push origin staging
# Configure Vercel staging deployment
```

## Revenue Generation (Day 2-7) - P1

### 5. Payment Integration
- Configure Paystack webhook: `/api/webhooks/paystack`
- Test payment flow with R10 test transaction
- Add payment buttons to booking flow

### 6. Billing Plans
```sql
-- Add to tenants table
ALTER TABLE tenants ADD COLUMN plan_expires_at timestamptz;
ALTER TABLE tenants ADD COLUMN monthly_bookings_limit int DEFAULT 50;
```

### 7. WhatsApp Notifications
- Integrate AiSensy API for booking confirmations
- Send 24h and 1h reminders
- Reduce no-shows by 40%

## Scale & Trust (Day 7-21) - P2

### 8. Production Hardening
- Enable all RLS policies
- Add rate limiting (100 req/min per tenant)
- Rotate all API keys

### 9. Onboarding Funnel
- Create `/signup` page that runs bootstrap script
- 14-day free trial with automatic billing
- Conversion rate target: 25%

### 10. Local Partnerships
- Sign 10 salons at R299/month
- Revenue share: 70/30 split
- Target: R21,000 MRR by month 2

## Revenue Targets

### Month 1: R5,000 MRR
- 5 paying tenants @ R299/month
- 2 enterprise @ R1,500/month

### Month 3: R50,000 MRR  
- 50 basic tenants @ R299/month
- 20 pro tenants @ R799/month
- 5 enterprise @ R2,999/month

### Month 6: R150,000 MRR
- 150 basic tenants
- 100 pro tenants  
- 20 enterprise tenants

## Key Metrics to Track
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate (target: <5%)
- Bookings per tenant per month
- Payment success rate (target: >95%)

## Git Commands for Deployment
```bash
# Create feature branch
git checkout -b feature/revenue-ready

# Add all SDD files
git add supabase/ src/ scripts/ .github/ *.md

# Commit
git commit -m "feat: SDD implementation - revenue ready"

# Push and create PR
git push origin feature/revenue-ready
gh pr create --title "SDD: Revenue-ready implementation" --body "Core booking platform with payments, RLS, and automation"
```

## Success Criteria
- [ ] First paying customer within 7 days
- [ ] R5,000 MRR within 30 days
- [ ] 95%+ uptime on production
- [ ] <2s booking creation time
- [ ] Zero data breaches (RLS working)

**Next Action: Run the database migrations and bootstrap your first tenant!**