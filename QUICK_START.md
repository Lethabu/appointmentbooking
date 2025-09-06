# Quick Start - Production Deployment

## 🚨 Critical: Run This First

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Apply security fixes
npm run db:migrate

# 4. Validate security
npm run test:security

# 5. Deploy to production
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

## ⚡ 5-Minute Security Fix

If you need to fix security issues immediately:

```bash
# Apply RLS migration
npx supabase db push

# Test tenant isolation
psql $DATABASE_URL -c "SET ROLE anon; SELECT count(*) FROM appointments;"
# Should return 0

# Deploy middleware fix
vercel --prod
```

## 🔧 Environment Setup

Required variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
```

## ✅ Validation Commands

```bash
# Security check
npm run validate:deployment

# Health check
curl https://appointmentbooking.co.za/api/health

# Tenant check  
curl https://instylehairboutique.appointmentbooking.co.za/api/health
```

## 🚀 Success Indicators

- ✅ Health endpoints return 200
- ✅ Security tests pass
- ✅ Tenant isolation working
- ✅ Real-time updates active
- ✅ AI chat responding

**Platform is production ready when all indicators show ✅**