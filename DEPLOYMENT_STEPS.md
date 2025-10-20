# Immediate Deployment Steps ✅

## Current Status
- ✅ Supabase project configured: `awrnkvjitzwzojaonrzo.supabase.co`
- ✅ Environment variables set in `.env`
- ✅ InStyle tenant exists: `ccb12b4d-ade6-467d-a614-7c9d198ddc70`
- ✅ Core migrations created
- ⚠️ Network connectivity issue (likely firewall/proxy)

## Step 1: Run Core Migrations in Supabase Dashboard

Go to Supabase SQL Editor and run these in order:

### 1.1 Core Tables (if not exists)
```sql
-- Run: supabase/migrations/001_create_core_tables.sql
-- Creates: tenants, users, services, staff, working_hours, bookings
```

### 1.2 RLS Policies  
```sql
-- Run: supabase/migrations/002_rls_policies.sql
-- Enables Row Level Security for tenant isolation
```

### 1.3 Booking RPC
```sql
-- Run: supabase/migrations/003_booking_rpc.sql
-- Creates get_overlapping_bookings function with locking
```

## Step 2: Verify Schema Compatibility

Check if existing tables need migration:
```sql
-- Check existing schema
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if new tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'bookings'
);
```

## Step 3: Test API Endpoints

### 3.1 Start Development Server
```bash
npm run dev
```

### 3.2 Test Booking API
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "ccb12b4d-ade6-467d-a614-7c9d198ddc70",
    "service_id": "service-id-here",
    "start_time": "2025-01-20T10:00:00Z",
    "customer_name": "Test Customer",
    "customer_phone": "+27123456789"
  }'
```

## Step 4: Deploy to Staging

### 4.1 Create Staging Branch
```bash
git checkout -b staging
git add .
git commit -m "feat: SDD implementation ready for staging"
git push origin staging
```

### 4.2 Configure Vercel Staging
- Connect staging branch to Vercel project
- Set environment variables in Vercel dashboard
- Deploy to `staging.appointmentbooking.co.za`

## Step 5: Production Deployment

### 5.1 Merge to Main
```bash
git checkout main
git merge staging
git push origin main
```

### 5.2 Verify Production
- Check `appointmentbooking.co.za` loads
- Test booking flow on `instylehairboutique.co.za`
- Verify payment webhooks work

## Step 6: Revenue Generation

### 6.1 Configure Payment Webhooks
- Paystack: Point to `/api/webhooks/paystack`
- PayFast: Point to `/api/webhooks/payfast`

### 6.2 Onboard First Customer
```bash
# Once network is working:
node dist/scripts/bootstrapTenant.js "New Salon" newsalon admin@newsalon.com
```

## Troubleshooting

### Network Issues
- Check Windows Firewall
- Try from different network
- Use Supabase dashboard for direct DB access

### Schema Issues
- Existing tables may conflict with new schema
- May need to rename existing tables or create mapping

### Next Action
**Run the migrations in Supabase dashboard first, then test locally**