import { NextRequest, NextResponse } from 'next/server';
import { firebaseAuthMiddleware } from './lib/firebase/middleware';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  let response: NextResponse;

  // Protect API routes with Firebase Auth
  if (pathname.startsWith('/api/')) {
    response = await firebaseAuthMiddleware(request);
  } else {
    response = NextResponse.next();
  }

  // Ignore static assets
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return response;
  }

  // Handle tenant domains - route to tenant pages
  if (hostname === 'instylehairboutique.co.za' || hostname === 'www.instylehairboutique.co.za') {
    const rewrittenPath = `/instylehairboutique${pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.).*)',
  ]
};
