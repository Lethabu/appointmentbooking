# Production Deployment Checklist

## 🚨 Pre-Deployment (CRITICAL - Must Complete)

### Security Fixes
- [ ] **Middleware Updated**: Tenant context injection implemented
- [ ] **RLS Policies Active**: Database queries isolated by tenant
- [ ] **DNS Redirects**: Custom domains redirect to subdomains
- [ ] **Rate Limiting**: Chat API protected from abuse
- [ ] **Input Validation**: All API endpoints validate inputs

### Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `GEMINI_API_KEY` - Google Gemini AI API key
- [ ] `STRAPI_URL` - Strapi CMS URL (optional)
- [ ] `STRAPI_TOKEN` - Strapi API token (optional)
- [ ] `UPSTASH_REDIS_REST_URL` - Redis for rate limiting (optional)
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Redis token (optional)

### Database Setup
- [ ] **Migrations Applied**: `npm run db:migrate`
- [ ] **RLS Enabled**: All tables have row-level security
- [ ] **Tenant Function**: `set_tenant_context` function exists
- [ ] **Test Data**: Sample tenant and appointments created

## 🧪 Testing & Validation

### Automated Tests
- [ ] **Security Tests**: `npm run test:security`
- [ ] **Deployment Validation**: `npm run validate:deployment`
- [ ] **Build Success**: `npm run build`
- [ ] **Lint Checks**: `npm run lint`

### Manual Testing
- [ ] **Tenant Isolation**: Verify cross-tenant data blocking
- [ ] **Real-time Updates**: Dashboard updates on appointment changes
- [ ] **AI Chat**: Chat widget responds with tenant context
- [ ] **DNS Redirects**: Custom domains redirect properly
- [ ] **Mobile Responsive**: Test on mobile devices

## 🚀 Deployment Steps

### 1. Pre-Deploy Validation
```bash
# Run all validation checks
npm run validate:deployment

# If any tests fail, fix issues before proceeding
```

### 2. Deploy to Vercel
```bash
# Deploy with validation
npm run deploy

# Or manual Vercel deployment
vercel --prod
```

### 3. Post-Deploy Verification
- [ ] **Health Check**: Visit `/api/health` endpoint
- [ ] **Tenant Sites**: Test both main and tenant subdomains
- [ ] **Real-time**: Create test appointment, verify dashboard updates
- [ ] **AI Chat**: Test chat functionality on tenant site
- [ ] **Error Monitoring**: Check Vercel logs for errors

## 🔍 Production Monitoring

### Health Endpoints
- [ ] **Main Health**: `https://appointmentbooking.co.za/api/health`
- [ ] **Tenant Health**: `https://instylehairboutique.appointmentbooking.co.za/api/health`

### Key Metrics to Monitor
- [ ] **API Response Times**: <200ms average
- [ ] **Error Rates**: <1% error rate
- [ ] **Database Connections**: Monitor connection pool
- [ ] **Real-time Connections**: WebSocket connection health

### Alerting Setup
- [ ] **Vercel Alerts**: Configure for 4xx/5xx errors
- [ ] **Supabase Alerts**: Database performance monitoring
- [ ] **Uptime Monitoring**: External service monitoring

## 🚨 Emergency Procedures

### Rollback Plan
```bash
# Quick rollback to previous deployment
vercel rollback

# Database rollback (if needed)
supabase db reset --linked
npm run db:migrate
```

### Emergency Contacts
- **Technical Lead**: [Contact Info]
- **Database Admin**: [Contact Info]
- **DevOps**: [Contact Info]

### Common Issues & Solutions

#### Issue: Cross-tenant data leakage
**Solution**: 
1. Check RLS policies are active
2. Verify middleware sets tenant context
3. Test with `npm run test:security`

#### Issue: Chat API not responding
**Solution**:
1. Check `GEMINI_API_KEY` environment variable
2. Verify rate limiting configuration
3. Check API logs in Vercel dashboard

#### Issue: Real-time updates not working
**Solution**:
1. Verify Supabase real-time is enabled
2. Check WebSocket connections in browser dev tools
3. Test tenant context in real-time subscriptions

#### Issue: DNS redirects not working
**Solution**:
1. Check `vercel.json` redirect configuration
2. Verify DNS settings at domain registrar
3. Test with curl: `curl -I https://instylehairboutique.co.za`

## ✅ Go-Live Approval

### Sign-off Required From:
- [ ] **Security Team**: All security tests pass
- [ ] **QA Team**: Manual testing complete
- [ ] **Product Owner**: Features meet requirements
- [ ] **Technical Lead**: Architecture review complete

### Final Checklist
- [ ] All automated tests passing
- [ ] Manual testing complete
- [ ] Monitoring configured
- [ ] Emergency procedures documented
- [ ] Team notified of go-live

---

**⚠️ IMPORTANT**: Do not proceed with deployment until ALL items in the "Pre-Deployment (CRITICAL)" section are completed and verified.

**🎉 SUCCESS**: Once all items are checked, the platform is ready for production use with proper tenant isolation and security measures in place.