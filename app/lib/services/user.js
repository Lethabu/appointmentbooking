import { createClient } from '@supabase/supabase-js';

export async function getUserByEmail(email) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createUser(email, tenantId) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase
    .from('users')
    .insert({ email, tenant_id: tenantId })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
