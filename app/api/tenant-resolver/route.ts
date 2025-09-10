import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hostname = searchParams.get('hostname');

  if (!hostname) {
    return NextResponse.json({ error: 'Hostname is required' }, { status: 400 });
  }

  const redisClient = createClient({
    url: process.env.REDIS_URL
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  try {
    await redisClient.connect();
    const tenantId = await redisClient.get(hostname);
    await redisClient.disconnect();

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ tenantId });
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
