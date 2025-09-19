import { NextRequest, NextResponse } from 'next/server';

const TENANT_MAP: Record<string, string> = {
  'instylehairboutique.co.za': 'instylehairboutique',
  'www.instylehairboutique.co.za': 'instylehairboutique',
  'instyle.localhost': 'instylehairboutique'
};

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware:', { hostname, pathname });
  }
  
  // Skip middleware for static assets and Next.js internals FIRST
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') || // Any file with extension
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Handle tenant domains
  const tenantSlug = TENANT_MAP[hostname];
  
  if (tenantSlug) {
    
    // Handle root path
    if (pathname === '/') {
      const url = new URL(`/${tenantSlug}`, request.url);
      return NextResponse.rewrite(url);
    }
    
    // Handle subdirectories that are already prefixed
    if (pathname.startsWith(`/${tenantSlug}`)) {
      return NextResponse.next();
    }
    
    // Rewrite all other paths to the tenant directory
    const url = new URL(`/${tenantSlug}${pathname}`, request.url);
    const response = NextResponse.rewrite(url);
    response.headers.set('x-tenant-slug', tenantSlug);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\.).*)',
  ]
};