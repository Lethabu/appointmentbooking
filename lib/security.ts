import { NextRequest, NextResponse } from 'next/server';
import { getRateLimit } from '@/lib/rate-limit';

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting configuration
const apiRateLimit = getRateLimit();

export async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const result = await apiRateLimit.limit(request.ip ?? 'anonymous');
      if (!result.success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
    } catch {
      // Continue without rate limiting if there's an error
    }
  }

  return response;
}

// Input validation helpers
export function validateTenantId(tenantId: string): boolean {
  return /^[a-z0-9-]+$/.test(tenantId) && tenantId.length <= 50;
}

export function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

// CSRF token validation
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token');
  const cookie = request.cookies.get('csrf-token')?.value;
  return token === cookie;
}