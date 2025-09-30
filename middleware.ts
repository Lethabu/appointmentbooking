export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { resolveTenantFromHostname } from './lib/tenant-resolver';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Resolve tenant configuration
  const tenant = resolveTenantFromHostname(hostname);

  if (tenant) {
    // Create new headers with tenant context
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenant.id);
    requestHeaders.set('x-tenant-slug', tenant.canonical);
    requestHeaders.set('x-tenant-name', tenant.name);
    requestHeaders.set('x-tenant-domain', tenant.domain);

    // Handle redirect slugs
    const currentSlug = pathname.split('/')[1];
    if (tenant.redirects.includes(currentSlug)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${currentSlug}`, `/${tenant.canonical}`);
      return NextResponse.redirect(url, 301); // Permanent redirect
    }

    // Rewrite to tenant-specific path
    const url = request.nextUrl.clone();
    if (!pathname.startsWith(`/${tenant.canonical}`)) {
      url.pathname = `/${tenant.canonical}${pathname}`;
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders
        }
      });
    }

    // Pass through with tenant headers
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  // Default platform routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)' 
  ]
};
