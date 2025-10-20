# DNS Configuration Diagnosis

## Current DNS Status

### appointmentbooking.co.za
- **Root domain**: Points to `216.198.79.1` (NOT Vercel)
- **www subdomain**: Points to `74a2b81c6316184c.vercel-dns-017.com` ✅ (Correct Vercel CNAME)

### instylehairboutique.co.za  
- **Root domain**: Points to `216.198.79.1` (NOT Vercel)
- **www subdomain**: Not checked, likely similar issue

## The Problem
- Root domains point to wrong IP (`216.198.79.1`)
- Only www subdomains have correct Vercel CNAME
- This causes 404 errors when Vercel can't find the project

## Required DNS Fixes

### 1. Fix Root Domain Records
Change these A records to point to Vercel:

**appointmentbooking.co.za:**
```
Type: A
Name: @ (root)
Value: 76.76.19.61
TTL: 3600
```

**instylehairboutique.co.za:**
```
Type: A  
Name: @ (root)
Value: 76.76.19.61
TTL: 3600
```

### 2. Verify www CNAME Records
Ensure these exist (they appear correct):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## Vercel Project Configuration
After DNS fixes, ensure domains are added in Vercel Dashboard:
- `appointmentbooking.co.za`
- `www.appointmentbooking.co.za` 
- `instylehairboutique.co.za`
- `www.instylehairboutique.co.za`

## Verification
After changes, these should resolve to Vercel IPs:
```bash
nslookup appointmentbooking.co.za        # Should show 76.76.19.61
nslookup www.appointmentbooking.co.za    # Should show Vercel CNAME
curl -I https://appointmentbooking.co.za # Should return 200, not 404
```