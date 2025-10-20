// scripts/bootstrapTenant.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE must be set in env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

export async function bootstrapTenant({ name, slug, adminEmail }: { name: string; slug: string; adminEmail: string }) {
  // Wrap in transaction if your Supabase/Postgres supports it.
  const { data: tenant, error: tErr } = await supabase
    .from('tenants')
    .insert({ name, slug })
    .select()
    .single();
  if (tErr) throw tErr;
  const tenantId = tenant.id;

  // default services
  const { error: sErr } = await supabase.from('services').insert([
    { tenant_id: tenantId, name: 'Consultation', duration_minutes: 30, price_cents: 0 },
    { tenant_id: tenantId, name: 'Full Service', duration_minutes: 60, price_cents: 0 }
  ]);
  if (sErr) throw sErr;

  // default working hours Mon-Fri 09:00-17:00
  const wh = [] as any[];
  for (let d = 1; d <= 5; d++) {
    wh.push({ tenant_id: tenantId, day_of_week: d, start_time: '09:00:00', end_time: '17:00:00' });
  }
  const { error: wErr } = await supabase.from('working_hours').insert(wh);
  if (wErr) throw wErr;

  // create admin user row (does not create auth user; you should invite or create via Supabase Auth separately)
  const { data: user, error: uErr } = await supabase.from('users').insert({ tenant_id: tenantId, email: adminEmail, role: 'tenant_admin' }).select().single();
  if (uErr) throw uErr;

  return { tenantId, adminUserId: user.id };
}

if (require.main === module) {
  (async () => {
    const name = process.argv[2];
    const slug = process.argv[3];
    const adminEmail = process.argv[4];
    if (!name || !slug || !adminEmail) {
      console.error('Usage: node dist/scripts/bootstrapTenant.js "Name" slug admin@example.com');
      process.exit(1);
    }
    try {
      const out = await bootstrapTenant({ name, slug, adminEmail });
      console.log('Bootstrapped tenant:', out);
    } catch (e) {
      console.error('Error bootstrapping tenant', e);
      process.exit(1);
    }
  })();
}