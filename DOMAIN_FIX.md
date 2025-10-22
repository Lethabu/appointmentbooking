# 404 Error Fix - Domain Not Deployed

## Issue
Domain `appointmentbooking.co.za` returns 404 because:
1. Code is pushed to GitHub but not deployed to Vercel
2. Domain DNS may not be pointing to Vercel
3. Vercel project may not be configured

## Quick Fix Steps

### 1. Deploy to Vercel (5 minutes)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from current directory
vercel --prod

# Or connect via Vercel dashboard:
# 1. Go to vercel.com
# 2. Import from GitHub: Lethabu/appointmentbooking
# 3. Set environment variables
# 4. Deploy
```

### 2. Set Environment Variables in Vercel
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Configure Domain in Vercel
1. Go to Vercel project settings
2. Add domain: `appointmentbooking.co.za`
3. Add domain: `instylehairboutique.co.za`
4. Configure DNS records as shown

### 4. Test Local First
```bash
npm run build
npm start
# Visit http://localhost:3000
```

## Expected Result
- `appointmentbooking.co.za` → Main platform
- `instylehairboutique.co.za` → InStyle tenant
- Both should load without 404

## Status
**Code is ready, just needs deployment to Vercel**