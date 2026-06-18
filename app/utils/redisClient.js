// utils/redisClient.js
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

export const redis = createClient({ url: redisUrl });
redis.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}

// Helper: get or set cache
export async function cacheQuery(key, fetchFn, ttl = 60) {
  await connectRedis();
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const result = await fetchFn();
  await redis.set(key, JSON.stringify(result), { EX: ttl });
  return result;
}
