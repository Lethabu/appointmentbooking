import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const { hostname } = new URL(req.url);

  // hard-code the live domain
  if (hostname === 'instylehairboutique.co.za') {
    return NextResponse.rewrite(new URL('/tenants/instyle', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};