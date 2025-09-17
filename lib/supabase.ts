import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServerSupabaseClient() {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}

// Tenant-aware client
export const createTenantClient = (tenantId: string) => {
  const client = createClient(supabaseUrl, supabaseAnonKey);

  // Set tenant context for RLS
  client.rpc('set_tenant_context', { p_tenant_id: tenantId });

  return client;
};

export async function setTenantContext(tenantId: string) {
  const { error } = await supabase.rpc('set_tenant_context', {
    p_tenant_id: tenantId,
  });

  if (error) console.error('Error setting tenant context:', error);
  return !error;
}
