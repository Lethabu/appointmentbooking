# New Tenant Onboarding Checklist

## Overview
This checklist ensures consistent, reliable onboarding of new salon clients to the multi-tenant SaaS platform.

## Pre-Onboarding Requirements
- [ ] **Client Contract Signed** - Ensure all legal and payment terms are agreed
- [ ] **Domain Ownership Verified** - Client must own or control their custom domain
- [ ] **Brand Assets Collected** - Logo, hero images, color preferences, and content

---

## Technical Onboarding Steps

### 1. Database Setup
- [ ] **Create Tenant Record in Supabase**
  ```sql
  INSERT INTO tenants (name, slug, domain, status, created_at) 
  VALUES ('New Salon Name', 'newsalon', 'newsalon.com', 'active', NOW());
  ```
- [ ] **Record Tenant ID** - Save the generated UUID for subsequent steps

### 2. Code Configuration
- [ ] **Update Middleware** 
  - Add new tenant to `TENANT_MAP` in `middleware.ts`:
  ```typescript
  const TENANT_MAP: Record<string, string> = {
    'instylehairboutique.co.za': 'instylehairboutique',
    'newsalon.com': 'newsalon', // Add new tenant
    'www.newsalon.com': 'newsalon'
  };
  ```

### 3. Asset Management
- [ ] **Create Asset Directory**
  - Create `/public/tenants/[new-tenant-slug]/` directory
  - Upload client's logo as `logo.png`
  - Upload hero image as `hero.webp`
  - Optimize images for web (WebP format, <500KB)

### 4. Domain Configuration
- [ ] **Add Custom Domain in Vercel**
  - Go to Vercel project settings → Domains
  - Add `newsalon.com` and `www.newsalon.com`
  - Note the DNS records provided by Vercel

- [ ] **Configure DNS with Client**
  - Provide client with CNAME/A records
  - Verify DNS propagation (use `dig` or online tools)
  - Test domain resolution

### 5. Application Setup
- [ ] **Create Tenant Pages**
  - Copy `/app/instylehairboutique/` structure
  - Rename to `/app/[new-tenant-slug]/`
  - Update branding, colors, and content
  - Configure tenant-specific settings in `config.ts`

### 6. Data Seeding
- [ ] **Seed Initial Services**
  ```sql
  INSERT INTO services (tenant_id, name, price_cents, duration_minutes, description)
  VALUES 
    ('[tenant-id]', 'Haircut & Style', 5000, 60, 'Professional cut and styling'),
    ('[tenant-id]', 'Color Treatment', 8000, 120, 'Full color treatment and styling');
  ```

- [ ] **Seed Initial Products** (if applicable)
  ```sql
  INSERT INTO products (tenant_id, name, price_cents, category, inventory)
  VALUES ('[tenant-id]', 'Hair Care Kit', 2500, 'Care', 10);
  ```

### 7. Integration Setup
- [ ] **Configure Payment Gateway**
  - Set up Paystack/Stripe account for tenant
  - Add payment keys to environment variables
  - Test payment flow

- [ ] **Set Up WhatsApp Integration** (if required)
  - Configure AISensy webhook for tenant
  - Test booking confirmations

### 8. Testing & Verification
- [ ] **Run Full Verification Checklist**
  - Visit `https://newsalon.com/?debug=true`
  - Verify Tailwind CSS loading (purple/amber theme)
  - Test all navigation links (`/book`, `/shop`, `/services`)
  - Check browser console for errors
  - Test responsive design on mobile

- [ ] **End-to-End Testing**
  - Complete a full booking flow
  - Verify data appears in Supabase
  - Test payment processing
  - Confirm email/SMS notifications

### 9. Go-Live Preparation
- [ ] **SSL Certificate Verification**
  - Ensure HTTPS is working correctly
  - Test certificate validity

- [ ] **Performance Check**
  - Run Lighthouse audit
  - Verify Core Web Vitals scores
  - Check asset loading times

- [ ] **SEO Setup**
  - Update meta tags and descriptions
  - Submit sitemap to Google Search Console
  - Set up Google Analytics (if required)

### 10. Client Handover
- [ ] **Provide Admin Access**
  - Create admin account for client
  - Provide dashboard training
  - Share login credentials securely

- [ ] **Documentation Delivery**
  - Provide user manual
  - Share support contact information
  - Schedule follow-up training session

- [ ] **Monitoring Setup**
  - Add domain to uptime monitoring
  - Set up error tracking alerts
  - Configure backup schedules

---

## Post-Launch Checklist (48 hours after go-live)
- [ ] **Monitor Error Logs** - Check Vercel and Supabase logs for issues
- [ ] **Verify Analytics** - Confirm tracking is working correctly
- [ ] **Client Feedback** - Schedule check-in call with client
- [ ] **Performance Review** - Analyze initial usage patterns

---

## Emergency Contacts
- **Technical Issues**: [Your support email]
- **Domain/DNS Issues**: [DNS provider support]
- **Payment Issues**: [Payment gateway support]

---

## Estimated Timeline
- **Technical Setup**: 2-4 hours
- **Testing & Verification**: 1-2 hours  
- **DNS Propagation**: 24-48 hours
- **Client Training**: 1 hour
- **Total**: 3-5 business days

## Success Criteria
✅ Custom domain loads with full branding  
✅ All functionality works without errors  
✅ Client can independently manage their salon  
✅ Payment processing is functional  
✅ Performance meets quality standards