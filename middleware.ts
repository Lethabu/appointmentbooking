import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily disabled - just pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\.).*)',
  ]
};