import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');

  if (!hostname) {
    // This should not happen in a normal HTTP request
    return new Response('Hostname not found', { status: 400 });
  }

  // Avoid running the middleware for the API route itself
  if (url.pathname.startsWith('/api/tenant-resolver')) {
    return NextResponse.next();
  }

  try {
    // The URL for the fetch request needs to be absolute,
    // so we construct it based on the request's URL.
    const resolverUrl = new URL('/api/tenant-resolver', url);
    resolverUrl.searchParams.set('hostname', hostname);

    const response = await fetch(resolverUrl);

    if (response.ok) {
      const { tenantId } = await response.json();
      if (tenantId) {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-tenant-id', tenantId);

        return NextResponse.rewrite(url, {
          request: {
            headers: requestHeaders,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error calling tenant resolver:', error);
  }

  // If anything goes wrong, just proceed without tenant context
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
