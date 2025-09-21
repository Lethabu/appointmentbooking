import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  console.log(`[Middleware] Host: ${hostname}, Path: ${pathname}`);

  // CRITICAL: Ignore static assets, images, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // This catches files like .woff2, .ico, .png, etc.
  ) {
    console.log('[Middleware] Bypassing for static asset or API route.');
    return NextResponse.next();
  }

  // Redirect www to non-www for tenant domains
  if (hostname === 'www.instylehairboutique.co.za') {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = 'instylehairboutique.co.za';
    console.log(`[Middleware] Redirecting www to non-www`);
    return NextResponse.redirect(redirectUrl, 301);
  }

  // Tenant Routing Logic
  const tenants: Record<string, string> = {
    'instylehairboutique.co.za': 'instylehairboutique',
  };

  if (hostname in tenants) {
    const tenantSlug = tenants[hostname];
    const rewrittenPath = `/${tenantSlug}${pathname}`;
    console.log(`[Middleware] Rewriting to: ${rewrittenPath}`);
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }
  
  // If it's the main domain or another path, do nothing
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};