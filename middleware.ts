import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// ROUTER UNIFICATION FIX: App Router Optimized Middleware
// File: middleware.ts
// Purpose: Resolve routing conflicts and enable multi-tenant functionality
// ============================================================================

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // CRITICAL: Bypass all internal, asset, and API paths
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  const tenants: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instylehairboutique',
    'instylehairboutique.co.za': 'instylehairboutique',
    'instyle-hair-boutique.co.za': 'instylehairboutique',
    'www.instyle-hair-boutique.co.za': 'instylehairboutique',
  };
  
  const tenantSlug = tenants[hostname.replace('www.', '')];

  if (tenantSlug) {
    // Rewrite to the App Router dynamic segment path
    url.pathname = `/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // For the main domain, ensure it resolves to the platform pages
  if (hostname === 'www.appointmentbooking.co.za' || hostname === 'appointmentbooking.co.za') {
     // Route to platform pages in (main) route group
     return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
