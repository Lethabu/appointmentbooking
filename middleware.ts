import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/salon/(.*)/dashboard',
]);

const isTenantRoute = createRouteMatcher(['/salon/(.*)']);

export default clerkMiddleware((auth, req) => {
  // require auth for protected routes
  if (isProtectedRoute(req)) auth().protect();

  // inject tenant slug into header for downstream use
  const tenantMatch = req.nextUrl.pathname.match(/\/salon\/([^\/]+)/);
  if (tenantMatch) {
    req.headers.set('x-tenant-slug', tenantMatch[1]);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
