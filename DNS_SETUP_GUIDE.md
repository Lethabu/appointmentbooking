# DNS CNAME Records Setup Guide

## What are CNAME Records?
CNAME (Canonical Name) records point your domain to another domain. For Vercel, they redirect traffic from your custom domain to Vercel's servers.

## Required DNS Records

### For Domain Registrar (e.g., Namecheap, GoDaddy, etc.)

**Add these CNAME records:**

| Type  | Name/Host | Value/Target           | TTL  |
|-------|-----------|------------------------|------|
| CNAME | www       | cname.vercel-dns.com   | 3600 |
| CNAME | @         | cname.vercel-dns.com   | 3600 |

**For tenant domains (if separate registrar):**

| Type  | Name/Host | Value/Target           | TTL  |
|-------|-----------|------------------------|------|
| CNAME | www       | cname.vercel-dns.com   | 3600 |
| CNAME | @         | cname.vercel-dns.com   | 3600 |

## Step-by-Step Instructions

### 1. Access DNS Management
- Log into your domain registrar (where you bought the domain)
- Find "DNS Management" or "DNS Settings"

### 2. Add CNAME Records
For **appointmentbooking.co.za**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)

Type: CNAME  
Name: @ (or leave blank for root)
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

For **instylehairboutique.co.za**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)

Type: CNAME
Name: @ (or leave blank for root)  
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### 3. Verify DNS Propagation
After adding records, test with:
```bash
nslookup appointmentbooking.co.za
nslookup www.appointmentbooking.co.za
nslookup instylehairboutique.co.za
nslookup www.instylehairboutique.co.za
```

Should return Vercel IP addresses.

## Common Issues

**Root Domain (@) Issues:**
- Some registrars don't allow CNAME for root domain
- Use A record instead: `76.76.19.61` (Vercel's IP)
- Or use ALIAS/ANAME record pointing to `cname.vercel-dns.com`

**Propagation Time:**
- DNS changes take 5-60 minutes to propagate
- Use online DNS checker tools to verify

## Verification Commands
```bash
# Check DNS resolution
dig appointmentbooking.co.za
dig www.appointmentbooking.co.za

# Test HTTP response (should be 200, not 404)
curl -I https://appointmentbooking.co.za
curl -I https://www.appointmentbooking.co.za
```