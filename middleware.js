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

  // For local development, you can use localhost:3000
  const domain = process.env.NODE_ENV === 'production' 
    ? 'appointmentbookings.co.za' 
    : 'localhost:3000';

  const subdomain = host.replace(`.${domain}`, '');

  // If it's a subdomain request, rewrite the URL to include the subdomain as a query parameter
  if (subdomain !== host && subdomain !== 'www') {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`, req.url)
    );
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