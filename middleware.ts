import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Define the condition for the 'instyle' tenant
    // This now checks for the custom domain OR any subdomain starting with 'instyle.'
    const isInstyletenant = hostname.includes('instylehairboutique.co.za') || hostname.startsWith('instyle.');

    // Skip static files and internal Next.js paths to avoid unnecessary processing
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/_vercel/') ||
      pathname.startsWith('/api/') ||
      pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
      return NextResponse.next();
    }

    // If it's the InStyle tenant, rewrite the path
    if (isInstyletenant) {
      // Check if the path already starts with /instyle to prevent redirect loops
      if (!pathname.startsWith('/instyle')) {
        const url = req.nextUrl.clone();
        // Prepend /instyle to the path, preserving the rest of the URL
        url.pathname = `/instyle${pathname === '/' ? '' : pathname}`;

        console.log(`[Middleware] Rewriting for InStyle. Host: ${hostname}, Path: ${pathname}, New Path: ${url.pathname}`);

        // Rewrite the request to the new URL
        return NextResponse.rewrite(url);
      }
    }

    // For all other cases, continue without rewriting
    return NextResponse.next();

  } catch (error) {
    console.error('[Middleware] Error:', error);

    // In case of an unexpected error, bypass the middleware to prevent the site from crashing
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
