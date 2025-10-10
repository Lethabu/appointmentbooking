import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single, shared client instance for browser use ONLY
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Legacy aliases for backward compatibility
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseAnonKey);
export const createTenantClient = (tenantId: string) => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

export async function setTenantContext(client: any, tenantId: string) {
  const { error } = await client.rpc('set_tenant_context', { p_tenant_id: tenantId });
  if (error) console.error('Error setting tenant context:', error);
  return !error;
}

// NOTE: createServerSupabaseClient is implemented locally in each API route
