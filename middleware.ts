import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Skip rate limiting for webhooks
    if (pathname.includes('/webhooks/')) {
      return NextResponse.next();
    }

    // Add tenant context for multi-tenant APIs
    if (pathname.includes('/instylehairboutique') || pathname.includes('instyle')) {
      const response = NextResponse.next();
      response.headers.set('x-tenant-id', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70');
      return response;
    }
  }

  // Handle tenant domains
  const hostname = request.nextUrl.hostname;
  
  if (hostname === 'instylehairboutique.co.za' || 
      hostname === 'www.instylehairboutique.co.za' ||
      hostname === 'instyle.localhost') {
    
    // Set tenant header for proper detection
    const response = NextResponse.rewrite(new URL(`/instyle${pathname}`, request.url));
    response.headers.set('x-tenant-id', 'instyle');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
};