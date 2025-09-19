import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Tenant mapping
const TENANT_MAP: Record<string, string> = {
  'instylehairboutique.co.za': 'instylehairboutique',
  'www.instylehairboutique.co.za': 'instylehairboutique',
  'instyle.localhost': 'instylehairboutique'
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  // Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // Any file with extension
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Handle tenant domains
  const tenantSlug = TENANT_MAP[hostname];
  
  if (tenantSlug) {
    // Rewrite URL to tenant path
    const response = NextResponse.rewrite(
      new URL(`/${tenantSlug}${pathname}`, request.url)
    );
    
    // Add tenant header for identification
    response.headers.set('x-tenant-slug', tenantSlug);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ]
};