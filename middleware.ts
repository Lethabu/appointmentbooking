import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const { pathname } = req.nextUrl;
  
  console.log(`[Middleware] Processing: ${hostname}${pathname}`);
  
  // Skip static files
  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Handle apex domain redirects
  if (hostname === 'instylehairboutique.co.za' || hostname === 'www.instylehairboutique.co.za') {
    console.log(`[Middleware] Redirecting to tenant subdomain`);
    return NextResponse.redirect('https://instylehairboutique.appointmentbooking.co.za' + pathname);
  }

  // Handle InStyle tenant subdomain
  if (hostname.includes('instylehairboutique.appointmentbooking.co.za')) {
    console.log(`[Middleware] InStyle tenant detected`);
    
    if (!pathname.startsWith('/instyle')) {
      const url = req.nextUrl.clone();
      url.pathname = `/instyle${pathname}`;
      
      const response = NextResponse.rewrite(url);
      response.headers.set('x-tenant-id', 'instyle');
      response.headers.set('x-tenant', 'instyle');
      
      return response;
    } else {
      const response = NextResponse.next();
      response.headers.set('x-tenant-id', 'instyle');
      response.headers.set('x-tenant', 'instyle');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
