import { createClient } from '@supabase/supabase-js';

export async function getTenantBySubdomain(subdomain) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTenantByCustomDomain(customDomain) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', customDomain)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
