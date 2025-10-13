import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback for development without Redis
export const rateLimitFallback = {
  limit: async (identifier: string) => ({ success: true })
};

// Create a new ratelimiter that allows 10 requests per minute
let rateLimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    rateLimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    });
  } catch (error) {
    console.warn('Failed to initialize Redis rate limiter:', error);
  }
}

export const getRateLimit = () => {
  return rateLimit || rateLimitFallback;
};

export { rateLimit };