import { Metadata } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import BookingFlow from '@/components/BookingFlow';
import { notFound } from 'next/navigation';
import { Tenant } from '@/types';
import { Database } from '@/types/database';

// Helper to create a server client for components
function createServerSupabaseClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

async function getTenant(subdomain: string): Promise<Tenant | null> {
  // This client is for server-side operations and should use the service role key
  const supabase = createClient<Database>(
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

  return data as Tenant | null;
}

export async function generateMetadata({ params }: { params: { tenant: string } }): Promise<Metadata> {
  const tenant = await getTenant(params.tenant);
  return { title: tenant?.name ?? 'Salon' };
}

export default async function TenantHome({ params }: { params: { tenant: string } }) {
  const cookieStore = cookies();
  const supabase = createServerSupabaseClient(cookieStore);
  const tenant = await getTenant(params.tenant);

  if (!tenant) {
    notFound();
  }

  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('category');

  // BUG FIX: Supabase foreign table queries return an array. Access the first element.
  const primaryColor = tenant.config?.[0]?.primaryColor || '#8B5CF6';

  return (
    <div className="min-h-screen bg-gray-50">
      <header style={{ backgroundColor: primaryColor }} className="text-white p-6">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {servicesError ? (
          <p className="text-red-500">Could not load services. Please try again later.</p>
        ) : (
          <BookingFlow services={services || []} tenantId={tenant.id} />
        )}
      </main>
    </div>
  );
}
