import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const res = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createMiddlewareClient({ req: request, res });
  
  let tenant: { id: string; slug: string } | null = null;

  // 1. Try to find tenant by custom domain
  const { data: customDomainTenant } = await supabase
    .from('tenants')
    .select('id, slug')
    .eq('custom_domain', hostname)
    .single();

  if (customDomainTenant) {
    tenant = customDomainTenant;
  } else {
    // 2. Fallback to subdomain logic
    const subdomain = hostname.split('.')[0];
    const mainDomain = 'appointmentbooking.co.za'; // Configure this as needed
    
    if (hostname.endsWith(mainDomain) && subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking') {
        const { data: subdomainTenant } = await supabase
            .from('tenants')
            .select('id, slug')
            .eq('slug', subdomain)
            .single();

        if (subdomainTenant) {
            tenant = subdomainTenant;
        }
    }
  }

  if (tenant) {
    // Set tenant context in Supabase session for RLS using the tenant's UUID
    try {
      const { error } = await supabase.rpc('set_tenant_context', { p_tenant_id: tenant.id });
      if (error) throw error;
    } catch (error) {
      console.error(`Failed to set tenant context for tenant ${tenant.id}:`, error);
    }

    // Set headers for additional context for the application
    res.headers.set('x-tenant-id', tenant.slug);

    // Rewrite to tenant-specific path if not already there
    if (!url.pathname.startsWith(`/${tenant.slug}`)) {
      url.pathname = `/${tenant.slug}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};