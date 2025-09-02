import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // A/B Testing for pricing page
  if (request.nextUrl.pathname === '/pricing') {
    const variant = Math.random() < 0.5 ? 'control' : 'test';
    response.cookies.set('pricing-variant', variant);
    
    // You could rewrite to different pages based on variant
    // if (variant === 'test') {
    //   return NextResponse.rewrite(new URL('/pricing-v2', request.url));
    // }
  }
  
  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};