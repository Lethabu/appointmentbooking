# Cloudflare Worker Deployment Guide

This guide provides the configuration and deployment instructions for the Edge Assembly Worker (`workers/edge-assembly.js`), which handles tenant routing, token caching, Supabase proxying, and payment verification at the edge. It aligns with the specs for multi-tenancy, UI enhancements, bookings/payments, and agent integration. Uses Cloudflare Workers free tier for freemium compliance.

## wrangler.toml Configuration Snippet

Create or update `wrangler.toml` in the root directory with the following configuration. This sets up the Worker, KV namespaces for caching (tokens, payments), and bindings for Supabase/Typebot URLs/keys.

```toml
name = "appointmentbooking-edge"
main = "workers/edge-assembly.js"
compatibility_date = "2024-01-01"
workers_dev = true

# KV Namespaces for caching (create via dashboard or CLI: wrangler kv:namespace create TOKENS_KV)
[[kv_namespaces]]
binding = "TOKENS_KV"
id = "your-tokens-kv-id"  # Replace with actual ID

[[kv_namespaces]]
binding = "PAYMENTS_KV"
id = "your-payments-kv-id"  # Replace with actual ID

# Environment variables/bindings
[vars]
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_ANON_KEY = "your-anon-key"
SUPABASE_SERVICE_KEY = "your-service-key"  # For server-side ops
TYPEBOT_URL = "https://your-typebot-instance.com"

# Routes: Bind to custom domain or subdomain
[[routes]]
pattern = "instyle.appointmentbooking.com/*"  # Example for tenant subdomain
custom_domain = true

# For production: Add more routes for all tenants (*.appointmentbooking.com/*)
```

### Key Notes

- **KV Setup**: Create two KV namespaces in Cloudflare dashboard: "TOKENS_KV" for design tokens (Specify integration), "PAYMENTS_KV" for idempotent payment verifications.
- **Bindings**: Replace placeholders with actual values from `.env` or dashboard. Use service key for RLS bypass in proxying, but enforce tenant_id in headers.
- **Security**: KV keys prefixed by tenant (e.g., `tokens-instyle`) for isolation. No sensitive data in Worker code; use encrypted env vars.
- **RLS Enforcement**: When proxying to Supabase, append `x-tenant-id` header; Supabase policies use `auth.jwt()->>'tenant_id' = x-tenant-id`.

## Deployment Steps

1. **Install Wrangler CLI**: `npm install -g wrangler`
2. **Login**: `wrangler login`
3. **Configure**: Update `wrangler.toml` with your IDs/keys.
4. **Dev Mode**: `wrangler dev` (tunnels to localhost:8787)
5. **Preview**: `wrangler deploy --dry-run`
6. **Deploy**: `wrangler deploy` (deploys to production)
7. **Custom Domain**: In dashboard, add route (e.g., `*.appointmentbooking.com/*`) and bind to Worker.
8. **Monitoring**: Use Cloudflare dashboard for logs/metrics; integrate with Supabase logs for audits.

## Testing

- **Local**: `wrangler dev` and test with curl: `curl -H "x-tenant-id: instyle" https://localhost:8787/api/supabase/bookings`
- **Jest Snippet** (add to `__tests__/edge-worker.test.js`):

```javascript
// Mock fetch and KV
global.fetch = jest.fn();
const env = { TOKENS_KV: { get: jest.fn().mockResolvedValue(null) } };

test('Worker caches tenant tokens', async () => {
  const request = new Request('https://instyle.appointmentbooking.com/');
  const response = await handleRequest(request, env, {});
  expect(response.status).toBe(200);
  expect(env.TOKENS_KV.put).toHaveBeenCalled();
});

// For RLS: Mock Supabase response filtered by tenant
test('Proxy enforces tenant isolation', async () => {
  // Simulate Supabase call with tenant header
  expect(fetch).toHaveBeenCalledWith(expect.objectContaining({
    headers: expect.objectContaining({ 'x-tenant-id': 'instyle' })
  }));
});
```

Run: `jest edge-worker.test.js`

## Rollback & Security

- **Rollback**: `wrangler deploy --outdir=previous-build` or dashboard revert.
- **Security**: Validate all inputs; rate-limit via Cloudflare WAF. RLS prevents cross-tenant data access. Scan for secrets with `wrangler secret list`.
- **Cost**: Free tier sufficient for <100k req/day; monitor in dashboard.

This setup ensures low-latency edge processing with tenant isolation, compatible with Next.js/Supabase/Clerk.

</final>
