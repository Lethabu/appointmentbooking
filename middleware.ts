import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Extract tenant from subdomain
  const subdomain = hostname.split('.')[0];
  
  // Handle apex domain redirects (security fix #3)
  if (hostname === 'instylehairboutique.co.za') {
    return NextResponse.redirect('https://instylehairboutique.appointmentbooking.co.za' + url.pathname);
  }

  // Multi-tenant routing
  if (subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking') {
    // Inject tenant_id into headers for RLS
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', subdomain);
    
    // Rewrite to tenant-specific path
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};