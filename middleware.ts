import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

// Initialize the Redis client outside the middleware for connection pooling
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis once
let isRedisConnected = false;
async function getRedisClient() {
    if (!isRedisConnected) {
        await redisClient.connect();
        isRedisConnected = true;
    }
    return redisClient;
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.toLowerCase() || '';
  const url = request.nextUrl.clone();

  // Avoid running the middleware for the API route itself
  if (url.pathname.startsWith('/api/tenant-resolver')) {
    return NextResponse.next();
  }

  let tenantId = 'default'; // Default tenant

  try {
    const client = await getRedisClient();
    // Attempt to get tenantId from Redis using hostname
    const resolvedTenantId = await client.get(hostname);
    if (resolvedTenantId) {
      tenantId = resolvedTenantId;
    }
  } catch (error) {
    console.error('Error fetching tenant from Redis:', error);
    // Fallback to default if Redis lookup fails
  }

  console.log('🚨 TENANT RESOLUTION (Redis):', { hostname, tenantId });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenantId);

  // Rewrite based on tenantId
  if (tenantId !== 'default') {
    // Example: Rewrite to a tenant-specific path if needed, or just set headers
    // For now, we'll just set the header and let the routing handle it.
    // If you have tenant-specific app directories (e.g., app/[tenantId]/),
    // you might need to rewrite the URL here.
    // url.pathname = `/${tenantId}${url.pathname}`;
  } else {
    // If tenantId is 'default', rewrite to the default landing page
    url.pathname = '/'; // Assuming '/' is your default landing page
  }

  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};