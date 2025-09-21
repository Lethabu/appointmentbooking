import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Only handle tenant domains, ignore everything else
  if (hostname === 'instylehairboutique.co.za' || hostname === 'www.instylehairboutique.co.za') {
    const rewrittenPath = `/instylehairboutique${pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\.).*)',
  ]
};