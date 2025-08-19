import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Handle custom domains for tenants
  if (hostname.includes('instylehairboutique.co.za')) {
    return NextResponse.rewrite(new URL('/instyle', request.url));
  }
  
  // Handle subdomain routing
  if (hostname.includes('.appointmentbookings.co.za')) {
    const subdomain = hostname.split('.')[0];
    return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};