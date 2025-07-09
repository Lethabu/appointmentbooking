import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    .from('tenants')
    .select('*, tenant_id:id')
    .eq('custom_domain', host)
    .single();

  if (customDomainTenant) {
    tenant = customDomainTenant;
  } else if (subdomain && subdomain !== 'www') {
    // 2. Fallback to subdomain
    const { data: subdomainTenant } = await supabase
      .from('tenants')
      .select('*, tenant_id:id')
      .eq('subdomain', subdomain)
      .single();
    
    if (subdomainTenant) {
      tenant = subdomainTenant;
    }
  }

  if (tenant) {
    // Rewrite the URL to the tenant-specific page
    const newUrl = new URL(`/${tenant.subdomain}${pathname}`, request.url);
    return NextResponse.rewrite(newUrl);
  }

  // 3. If no tenant found, redirect to a generic page or show an error
  // For now, we'll just continue to the requested path.
  // This could be a marketing page, a 404, or a tenant signup page.
  if (pathname === '/') {
     return NextResponse.next();
  }

  // Avoid redirect loops for non-existent tenants
  if (!pathname.startsWith('/_tenant')) {
      const notFoundUrl = new URL('/404', request.url); // Or a dedicated "tenant not found" page
      return NextResponse.rewrite(notFoundUrl);
  }

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