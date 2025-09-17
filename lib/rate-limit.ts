import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback for development or build time without Redis
export const rateLimitFallback = {
  limit: async (identifier: string) => ({ success: true }),
};

// Use a singleton pattern to ensure the Redis client is created only once.
let rateLimitSingleton: Ratelimit | null = null;

export const getRateLimit = () => {
  // During build, the UPSTASH_REDIS_REST_URL is not set.
  // This will ensure we use the fallback during the build process.
  if (rateLimitSingleton) {
    return rateLimitSingleton;
  }

  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    rateLimitSingleton = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    });

    return rateLimitSingleton;
  }

  // If env vars are not set (e.g., during build or local dev), return the fallback.
  return rateLimitFallback;
};
