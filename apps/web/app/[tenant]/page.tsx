import { Metadata } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { BookingFlow } from '@/components/BookingFlow';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { tenant: string } }): Promise<Metadata> {
  const tenant = await getTenant(params.tenant);
  return { title: tenant?.name ?? 'Salon' };
}

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const tenant = await getTenant(params.tenant);
  if (!tenant) {
    notFound();
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('category');

  return (
    <div className="min-h-screen bg-gray-50">
      <header style={{ backgroundColor: tenant.config?.primaryColor || '#8B5CF6' }} className="text-white p-6">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <BookingFlow services={services || []} tenantId={tenant.id} />
      </main>
    </div>
  );
}

async function getTenant(subdomain: string) {
  // This client is for server-side operations and should use the service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data } = await supabase
    .from('tenants')
    .select('*, config:tenant_config(*)')
    .eq('subdomain', subdomain)
    .single();

  return data;
}
