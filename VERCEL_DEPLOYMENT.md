# Vercel Deployment Guide

## Prerequisites
- [x] Vercel account created
- [x] Vercel CLI installed: `npm i -g vercel`
- [x] Environment variables configured in `.env`
- [x] Supabase project set up

## Quick Deploy

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Set up environment variables**
   ```bash
   npm run setup-vercel
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Manual Steps

### 1. Environment Variables
Copy from `.env.example` to `.env` and fill:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `PAYSTACK_SECRET`
- Other required vars

### 2. Build Test
```bash
npm run build
```

### 3. Deploy
```bash
vercel --prod
```

## Domain Configuration

### Main Platform
- Domain: `appointmentbooking.co.za`
- Configure in Vercel dashboard

### Tenant Domains
- Example: `instylehairboutique.co.za`
- Add as custom domain in Vercel
- Point DNS to Vercel

## Post-Deployment

1. **Test main site**: https://appointmentbooking.co.za
2. **Test tenant**: https://instylehairboutique.co.za
3. **Verify API endpoints**
4. **Check database connections**

## Troubleshooting

### Build Failures
- Check environment variables
- Verify Supabase connection
- Review build logs

### Runtime Errors
- Check Vercel function logs
- Verify API routes
- Test database queries