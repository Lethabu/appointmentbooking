import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Handle Clerk Proxy Domain
  if (hostname === 'clerk.appointmentbooking.co.za') {
    const clerkUrl = `https://js.clerk.com${url.pathname}${url.search}`;
    try {
      const response = await fetch(clerkUrl, {
        method: request.method,
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
        },
      });
      
      const newResponse = new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
      });
      
      // Copy headers and add CORS
      response.headers.forEach((value, key) => {
        newResponse.headers.set(key, value);
      });
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      return newResponse;
    } catch (error) {
      return new NextResponse('Clerk proxy error', { status: 502 });
    }
  }

  // Ignore static assets and API routes
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }

  // Handle tenant domains
  const tenants: Record<string, string> = {
    'www.instylehairboutique.co.za': 'instylehairboutique',
    'instylehairboutique.co.za': 'instylehairboutique',
  };

  if (hostname in tenants) {
    const tenantSlug = tenants[hostname];
    url.pathname = `/${tenantSlug}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|api|favicon.ico|.*\\.).*)',
  ]
};