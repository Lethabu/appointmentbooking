
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define a map of custom domains to tenant slugs
const CUSTOM_DOMAINS: Record<string, string> = {
  'www.instylehairboutique.co.za': 'instylehairboutique',
  'instylehairboutique.co.za': 'instylehairboutique',
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Determine the tenant slug from either custom domain or subdomain
  let slug = CUSTOM_DOMAINS[hostname];
  
<<<<<<< HEAD
  // The user's instructions specify using a reverse proxy (Cloudflare/Vercel) to handle the custom domain.
  // This redirect is incorrect for the new setup and should be removed.
  // if (hostname === 'instylehairboutique.co.za' || hostname === 'www.instylehairboutique.co.za') {
  //   return NextResponse.redirect('https://instylehairboutique.appointmentbooking.co.za' + url.pathname);
  // }
=======
  if (!slug) {
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'appointmentbooking' && !hostname.includes('vercel.app')) {
      slug = subdomain;
    }
  }
>>>>>>> cf8a94a (feat: Implement full white-labeling for Instyle tenant)

  // If a tenant is identified, rewrite to their path and set context
  if (slug) {
    const res = NextResponse.next();
    
    // Set tenant context in Supabase for RLS
    const supabase = createMiddlewareClient({ req: request, res });
    try {
      await supabase.rpc('set_tenant_context', { p_tenant_id: slug });
      console.log(`Context set for tenant: ${slug}`);
    } catch (error) {
      console.error(`Failed to set tenant context for ${slug}:`, error);
    }
    
    // Set headers for frontend context
    res.headers.set('x-tenant-id', slug);

    // Rewrite to the tenant-specific path, e.g., /instylehairboutique
    // This serves the content from the directory app/[salon]
    if (!url.pathname.startsWith(`/${slug}`)) {
      url.pathname = `/${slug}${url.pathname}`;
    }
    
    console.log(`Rewriting to: ${url.pathname}`);
    return NextResponse.rewrite(url);
  }
  
  // Otherwise, it's the main marketing site
  console.log('Serving main site');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
