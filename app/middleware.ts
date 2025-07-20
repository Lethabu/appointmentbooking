import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Explicitly allow root path to bypass tenant logic
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const host = url.hostname;
  const subdomain = host.split('.')[0];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );

  let tenant = null;

  // 1. Check for custom domain
  const { data: customDomainTenant } = await supabase
    .from('salons')
    .select('*, tenant_id:id, theme, logo_url')
    .eq('custom_domain', host)
    .single();

  if (customDomainTenant) {
    tenant = customDomainTenant;
  } else if (subdomain && subdomain !== 'www') {
    // 2. Fallback to subdomain
    const { data: subdomainTenant } = await supabase
      .from('salons')
      .select('*, tenant_id:id, theme, logo_url')
      .eq('subdomain', subdomain)
      .single();
    
    if (subdomainTenant) {
      tenant = subdomainTenant;
    }
  }

  if (tenant) {
    // The tenant was found. We don't need to change the path.
    // We'll rewrite to the same URL but add the branding headers.
    // The DashboardLayout will then read these headers.
    const response = NextResponse.rewrite(request.nextUrl);

    if (tenant.theme) {
      response.headers.set('X-Tenant-Theme', JSON.stringify(tenant.theme));
    }
    if (tenant.logo_url) {
      response.headers.set('X-Tenant-Logo-Url', tenant.logo_url);
    }

    return response;
  }

  // 3. If no tenant was found, this is a request to the main marketing site
  // (e.g., appointmentbookings.co.za/login). We'll allow it to proceed.
  // The page/layout itself will handle authentication or redirection.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
