import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // CRITICAL: If the path includes a file extension, or is a Next.js internal path,
  // do not rewrite it. This protects CSS, JS, fonts (.woff2), images, etc.
  if (url.pathname.includes('.') || url.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Your existing tenant routing logic
  const tenants: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instylehairboutique',
    'instylehairboutique.co.za': 'instylehairboutique',
  };

  if (hostname in tenants) {
    const tenantSubpath = tenants[hostname];
    url.pathname = `/${tenantSubpath}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|api|favicon.ico|.*\\.).*)',
  ]
};