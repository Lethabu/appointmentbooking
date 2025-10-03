<<<<<<< HEAD
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
};

export const createTenantClient = (tenantId: string) => {
  const client = createClient();
  return client;
};

export const setTenantContext = async (client: any, tenantId: string) => {
  return client;
};

// Default client for client-side usage
export const supabase = createClient();
=======
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(supabaseUrl, serviceRoleKey)
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
    p_tenant_id: tenantId
  })
  
  if (error) console.error('Error setting tenant context:', error)
  return !error
}
>>>>>>> origin/feat/instyle-whitelabel
