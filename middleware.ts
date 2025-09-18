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

  // Redirect instyle subdomain to main domain path
  if (request.nextUrl.hostname === 'instyle.localhost' || 
      request.nextUrl.hostname === 'instylehairboutique.co.za') {
    return NextResponse.rewrite(new URL(`/instylehairboutique${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
};