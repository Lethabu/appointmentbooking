# Clean Deployment Strategy 🚀

## Issue: Git History Contains Secrets
GitHub is blocking pushes due to secrets in commit history:
- `appointmentbookings-459617-firebase-adminsdk-fbsvc-ebb14130b8.json`
- `.env.production`

## Solution: Clean Repository Approach

### Option 1: New Repository (Recommended)
1. Create new GitHub repository: `appointmentbooking-clean`
2. Copy only essential files (no secrets)
3. Fresh git history without secrets

### Option 2: BFG Repo Cleaner
```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files "*.json" --delete-files ".env.production"
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

### Option 3: Manual Clean Push
```bash
# Create clean branch
git checkout --orphan clean-main
git add supabase/ src/ scripts/ .github/ *.md package.json tsconfig.json next.config.js
git commit -m "feat: SDD implementation - clean deployment"
git push origin clean-main:main --force
```

## Files to Deploy (No Secrets)
```
✅ supabase/migrations/
✅ src/lib/scheduling.ts
✅ src/pages/api/bookings.ts
✅ src/pages/api/webhooks/
✅ scripts/bootstrapTenant.ts
✅ .github/workflows/ci.yml
✅ package.json
✅ next.config.js
✅ README.md
✅ DEPLOYMENT_CHECKLIST.md
```

## Environment Variables (Set in Vercel)
```
SUPABASE_URL=https://awrnkvjitzwzojaonrzo.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://awrnkvjitzwzojaonrzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PAYSTACK_SECRET=your-paystack-secret
```

## Immediate Action
**Use Option 3 - Create clean branch and force push**

This will deploy the SDD implementation without secrets in git history.