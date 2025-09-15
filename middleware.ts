import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log(`[Middleware] ${req.method} ${req.nextUrl.pathname}`);
  
  try {
    const { pathname } = req.nextUrl;
    const hostname = req.headers.get('host') || '';
    
    // Skip static files and API routes that don't need processing
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/_vercel/') ||
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
      return NextResponse.next();
    }

    // Handle InStyle Hair Boutique domain
    if (hostname.includes('instylehairboutique.co.za')) {
      // Only rewrite if not already on /instyle path
      if (!pathname.startsWith('/instyle')) {
        const url = req.nextUrl.clone();
        url.pathname = `/instyle${pathname === '/' ? '' : pathname}`;
        
        console.log(`[Middleware] Rewriting ${pathname} to ${url.pathname}`);
        
        const response = NextResponse.rewrite(url);
        response.headers.set('x-tenant', 'instyle');
        response.headers.set('x-original-host', hostname);
        
        return response;
      }
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error('[Middleware] Error:', error);
    
    // Always return a valid response, never throw
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
