import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createClient();

export const createServerSupabaseClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
};

export const createTenantClient = (tenantId: string) => {
  const client = createClient();
  return client;
};

export const setTenantContext = async (client: any, tenantId: string) => {
  return client;
};