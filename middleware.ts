import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const hostHeader = req.headers.get('host'); // Get the Host header

  // For local testing, use localhost:3003 to simulate instylehairboutique.co.za
  // Check both url.hostname and hostHeader for the target domain
  if (url.hostname === 'localhost:3003' || hostHeader === 'instylehairboutique.co.za') {
    url.pathname = '/instyle'; // Rewrite to /instyle instead of /tenants/instyle
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};