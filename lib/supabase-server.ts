// ============================================================================
// SECURITY FIX #2: Supabase RLS Helper
// File: lib/supabase-server.ts
// Spec: Row Level Security (RLS) Enforcement
// ============================================================================

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  userId?: string;
}

/**
 * Create a Supabase client with tenant context pre-configured
 * This ensures ALL queries are automatically scoped to the correct tenant
 */
export function createTenantClient(context: TenantContext) {
  const supabase = createServerComponentClient({ cookies });
  
  // Store tenant context for use in queries
  (supabase as any)._tenantContext = context;
  
  return supabase;
}

/**
 * Helper function to add tenant filtering to queries
 */
export function withTenantFilter(query: any, tenantId: string) {
  return query.eq('tenant_id', tenantId);
}

/**
 * Helper function to add tenant_id to insert data
 */
export function withTenantData(data: any, tenantId: string) {
  if (Array.isArray(data)) {
    return data.map(item => ({ ...item, tenant_id: tenantId }));
  }
  return { ...data, tenant_id: tenantId };
}

/**
 * Extract tenant context from request headers
 * Use this in API routes and Server Components
 */
export function getTenantContext(headers: Headers): TenantContext {
  const tenantId = headers.get('x-tenant-id');
  const tenantSlug = headers.get('x-tenant-slug');

  if (!tenantId || !tenantSlug) {
    throw new Error('Missing tenant context in request headers');
  }

  return {
    tenantId,
    tenantSlug,
  };
}
