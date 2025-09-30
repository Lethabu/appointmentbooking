# 🔐 Clerk Production Setup Guide

## Critical: Update Production Keys

Your site is currently using development Clerk keys in production, which causes authentication errors.

### Step 1: Get Production Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
2. Switch to your **Production** environment
3. Copy the production keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)

### Step 2: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `appointmentbooking` project
3. Go to **Settings** → **Environment Variables**
4. Update these variables for **Production** environment:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[your_actual_production_key]
CLERK_SECRET_KEY=sk_live_[your_actual_production_secret]
```

### Step 3: Redeploy
After updating the environment variables, trigger a new deployment:
1. Go to **Deployments** tab in Vercel
2. Click **Redeploy** on the latest deployment
3. Or push a small change to trigger auto-deployment

### Step 4: Verify
After redeployment:
1. Visit `https://instylehairboutique.co.za`
2. Check browser console - the Clerk error should be gone
3. Test sign-up/sign-in functionality

## Current Status
- ✅ Site loads with styling
- ✅ Routing works correctly  
- ❌ Authentication broken (missing production keys)
- ⚠️ Minor preload warnings (fixed)

## Expected Result
After updating Clerk keys:
- ✅ Full authentication functionality
- ✅ Zero console errors
- ✅ Production-ready platform