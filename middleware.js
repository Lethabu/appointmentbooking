import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname, searchParams } = req.nextUrl;
  const host = req.headers.get('host');

  // Handle multiple domains
  let salonSlug = null;
  
  if (process.env.NODE_ENV === 'production') {
    // Handle custom domains (like instylehairboutique.co.za)
    if (host !== 'appointmentbookings.co.za' && !host.includes('appointmentbookings.co.za')) {
      // This is a custom domain, treat as salon
      salonSlug = host.replace('.co.za', '').replace('.com', ''); // Extract salon name from domain
      return NextResponse.rewrite(
        new URL(`/${salonSlug}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`, req.url)
      );
    }
    
    // Handle subdomains on main platform (salon.appointmentbookings.co.za)
    const subdomain = host.replace('.appointmentbookings.co.za', '');
    if (subdomain !== host && subdomain !== 'www') {
      return NextResponse.rewrite(
        new URL(`/${subdomain}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`, req.url)
      );
    }
  } else {
    // Development: handle Replit domains
    if (host.includes('replit.dev') || host.includes('repl.co')) {
      // Check if there's a salon parameter or use a default for testing
      const testSalon = searchParams.get('salon') || 'instylehairboutique';
      if (pathname === '/' && !pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(
          new URL(`/${testSalon}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`, req.url)
        );
      }
    }
  }

  // Standard auth protection for dashboard routes
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  // Matcher to run middleware on all requests except for static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};