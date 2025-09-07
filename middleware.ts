import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const subdomain = hostname.split('.')[0];
  
  // The user's instructions specify using a reverse proxy (Cloudflare/Vercel) to handle the custom domain.
  // This redirect is incorrect for the new setup and should be removed.
  // if (hostname === 'instylehairboutique.co.za' || hostname === 'www.instylehairboutique.co.za') {
  //   return NextResponse.redirect('https://instylehairboutique.appointmentbooking.co.za' + url.pathname);
  // }

  // Multi-tenant routing with proper tenant context injection
  if (subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking') {
    const res = NextResponse.next();
    
    // Create Supabase client for middleware
    const supabase = createMiddlewareClient({ req: request, res });
    
    try {
      // Set tenant context in Supabase session for RLS
      await supabase.rpc('set_tenant_context', { p_tenant_id: subdomain });
    } catch (error) {
      console.error('Failed to set tenant context:', error);
    }
    
    // Set headers for additional context
    res.headers.set('x-tenant-id', subdomain);
    
    // Rewrite to tenant-specific path
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};