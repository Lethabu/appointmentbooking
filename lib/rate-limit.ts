import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per minute
export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
});

// Fallback for development without Redis
export const rateLimitFallback = {
  limit: async (identifier: string) => ({ success: true })
};

export const getRateLimit = () => {
  return process.env.UPSTASH_REDIS_REST_URL ? rateLimit : rateLimitFallback;
};