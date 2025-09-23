import { NextRequest } from 'next/server';

const tokenCache = new Map<string, [number, number]>();

interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

interface RateLimiter {
  check: (req: any, res?: any) => boolean;
}

function rateLimit(options: RateLimitOptions = {}): RateLimiter {
  const limit = options.limit || 10;
  const windowMs = options.windowMs || 60 * 1000; // 1 minute

  return {
    check: (req: any, res?: any) => {
      const token = getIP(req);
      const now = Date.now();
      const tokenCount = tokenCache.get(token) || [0, now];

      if (now - tokenCount[1] > windowMs) {
        tokenCount[0] = 1;
        tokenCount[1] = now;
      } else {
        tokenCount[0]++;
      }

      tokenCache.set(token, tokenCount);

      if (tokenCount[0] > limit) {
        if (res) {
          res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.round(windowMs / 1000),
          });
        }
        return false;
      }

      return true;
    },
  };
}

export function getRateLimit() {
  return {
    limit: async (identifier: string) => {
      const limiter = rateLimit({ limit: 10, windowMs: 60 * 1000 });
      const mockReq = { headers: { 'x-forwarded-for': identifier } };
      const success = limiter.check(mockReq);
      return { success };
    },
  };
}

function getIP(req: any): string {
  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    'unknown'
  );
}

export default rateLimit;
