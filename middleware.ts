import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

// Initialize the Redis client
// The client will automatically use the REDIS_URL from the environment variables
const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// We need to connect to the client outside of the middleware function
// to avoid connecting on every request.
// The `connect` method is async, but we can't use top-level await here.
// So we will connect inside the middleware and check the connection status.
let isRedisConnected = false;

async function getRedisClient() {
    if (!isRedisConnected) {
        await redisClient.connect();
        isRedisConnected = true;
    }
    return redisClient;
}


export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host');

  if (!hostname) {
    return new Response('Hostname not found', { status: 400 });
  }

  try {
    const client = await getRedisClient();
    const tenantId = await client.get(hostname);

    if (!tenantId) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-id', tenantId);

    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Redis error in middleware:', error);
    // Fallback to allow the request to go through without tenant context
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
