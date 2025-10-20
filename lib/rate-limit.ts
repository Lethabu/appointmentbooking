// Simple in-memory rate limiting (no Redis required)
const requests = new Map<string, number[]>();

export const rateLimitFallback = {
  limit: async (identifier: string) => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier)!;
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return { success: false };
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return { success: true };
  }
};

export const getRateLimit = () => rateLimitFallback;
export const rateLimit = rateLimitFallback;