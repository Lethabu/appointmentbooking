const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://awrnkvjitzwzojaonrzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cm5rdmppdHp3em9qYW9ucnpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMzMDM4NCwiZXhwIjoyMDY1OTA2Mzg0fQ._X6Ukz5cJ3GxxZGcJq3mmmOP9egBz65QIZN0016X3p4';
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function sanityChecks() {
  try {
    console.log('Sanity Check 1: Tenant Info for instyle');
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, slug, vanity_domain, active')
      .eq('slug', 'instyle');
    if (tenantError) {
      console.error('Tenant Error:', tenantError.message);
      return;
    }
    console.table(tenant);

    if (tenant && tenant.length > 0) {
      const tenantId = tenant[0].id;

      console.log('\nSanity Check 2: Tenant Components for instyle');
      const { data: components, error: compError } = await supabase
        .from('tenant_components')
        .select('comp_type, origin, html_chunk')
        .eq('tenant_id', tenantId);
      if (compError) {
        console.error('Components Error:', compError.message);
      } else {
        console.table(components);
      }

      console.log('\nSanity Check 3: Tenant Themes for instyle');
      const { data: themes, error: themeError } = await supabase
        .from('tenant_themes')
        .select('key, value')
        .eq('tenant_id', tenantId);
      if (themeError) {
        console.error('Themes Error:', themeError.message);
      } else {
        console.table(themes);
      }
    } else {
      console.log('No tenant found for instyle');
    }
  } catch (err) {
    console.error('Overall Error:', err);
  }
}

sanityChecks();
