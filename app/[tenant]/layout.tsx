import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { TenantHeader } from '@/components/layout/TenantHeader';
import { TenantFooter } from '@/components/layout/TenantFooter';
import { notFound } from 'next/navigation';
import CustomerJourney from '@/components/CustomerJourney';

interface TenantLayoutProps {
  params: { tenant: string };
  children: React.ReactNode;
}

// Create server-side Supabase client
function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
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

// Generate metadata for tenant pages
export async function generateMetadata({ params }: TenantLayoutProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, description') // Add other metadata fields as needed
    .eq('slug', params.tenant)
    .single();

  if (params.tenant === 'instylehairboutique') {
    return {
      title: 'InStyle Hair Boutique - Premium Hair Services & Products',
      description: 'Professional hair installations, treatments, and premium products in South Africa. Book appointments and shop online with ZAR payments.',
      keywords: 'hair salon, hair extensions, maphondo, hair treatment, south africa, hair products, booking',
      openGraph: {
        title: 'InStyle Hair Boutique - Premium Hair Services',
        description: 'Professional hair services and premium products. Book online or shop our collection.',
        url: 'https://instylehairboutique.co.za',
        siteName: 'InStyle Hair Boutique',
        images: [
          {
            url: '/tenants/instyle/og-image.png',
            width: 1200,
            height: 630,
            alt: 'InStyle Hair Boutique',
          },
        ],
        locale: 'en_ZA',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'InStyle Hair Boutique',
        description: 'Premium hair services and products in South Africa',
        images: ['/tenants/instyle/og-image.png'],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  if (!tenant) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    title: `${tenant.name} - Book Appointments`,
    description: tenant.description || `Book your next appointment with ${tenant.name}.`,
  };
}

export default async function TenantLayout({ params, children }: TenantLayoutProps) {
  const supabase = createServerSupabaseClient();

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      subdomain,
      custom_domain,
      tenant_themes (*)
    `)
    .eq('slug', params.tenant) // Assuming slug for tenant
    .single();

  if (error || !tenant) {
    console.error(`Tenant not found for slug: ${params.tenant}`, error);
    notFound();
  }

  let theme = Array.isArray(tenant.tenant_themes) ? tenant.tenant_themes[0] || {} : tenant.tenant_themes || {};

  // HARDCODED FALLBACK: If no theme is found in the database for Instyle, use this to ensure the site works.
  if (params.tenant === 'instylehairboutique' && (!theme || Object.keys(theme).length === 0)) {
    theme = {
      brand_name: 'Instyle Hair Boutique',
      logo_url: null, // Add the path to your logo here once uploaded, e.g., '/instyle-logo.png'
      primary_color: '#000000',
      header_links: [],
      footer_html: '<p>&copy; 2024 Instyle Hair Boutique. All rights reserved.</p>'
    };
  }

import { TenantProviders } from '@/components/TenantProviders';

  return (
    <TenantProviders>
    <div className="flex flex-col min-h-screen">
      <TenantHeader 
        salonSlug={params.tenant}
        logoUrl={theme.logo_url}
        brandName={theme.brand_name || tenant.name}
        headerLinks={theme.header_links || []}
        primaryColor={theme.primary_color}
      />
      <main className="flex-grow">
        {children}
      </main>
      <TenantFooter 
        brandName={theme.brand_name || tenant.name}
        footerHtml={theme.footer_html}
      />
      <CustomerJourney tenantId={params.tenant} />
    </div>
    </TenantProviders>
  );
}
