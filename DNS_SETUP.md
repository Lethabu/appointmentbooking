# 🌐 DNS CONFIGURATION REQUIRED

## Problem
`instylehairboutique.co.za` shows main site content instead of redirecting to tenant subdomain.

## Solution

### 1. Add Custom Domain to Vercel
Go to: https://vercel.com/lethabus-projects/appointmentbooking/settings/domains

Add these domains:
- `instylehairboutique.co.za`
- `instylehairboutique.appointmentbooking.co.za`
- `appointmentbooking.co.za`

### 2. Configure DNS Records
In your DNS provider (where `instylehairboutique.co.za` is registered):

**For instylehairboutique.co.za:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**For appointmentbooking.co.za:**
```
Type: CNAME  
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: instylehairboutique
Value: cname.vercel-dns.com
```

### 3. Test Flow
Once DNS propagates:
1. `instylehairboutique.co.za` → redirects to `instylehairboutique.appointmentbooking.co.za`
2. Shows white-labeled Instyle content
3. Tenant isolation active

**The middleware is correct - DNS configuration is needed!**