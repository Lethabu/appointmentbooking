
import { createServerSupabaseClient } from '@/lib/supabase';
import { TenantHeader } from '@/components/layout/TenantHeader';
import { TenantFooter } from '@/components/layout/TenantFooter';
import { notFound } from 'next/navigation';

interface TenantLayoutProps {
  params: { salon: string };
  children: React.ReactNode;
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
    .eq('subdomain', params.salon)
    .single();

  if (error || !tenant) {
    console.error(`Tenant not found for slug: ${params.salon}`, error);
    notFound();
  }

  let theme = Array.isArray(tenant.tenant_themes) ? tenant.tenant_themes[0] || {} : tenant.tenant_themes || {};

  // HARDCODED FALLBACK: If no theme is found in the database for Instyle, use this to ensure the site works.
  if (params.salon === 'instylehairboutique' && (!theme || Object.keys(theme).length === 0)) {
    theme = {
      brand_name: 'Instyle Hair Boutique',
      logo_url: null, // Add the path to your logo here once uploaded, e.g., '/instyle-logo.png'
      primary_color: '#000000',
      header_links: [],
      footer_html: '<p>&copy; 2024 Instyle Hair Boutique. All rights reserved.</p>'
    };
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TenantHeader 
        salonSlug={params.salon}
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
    </div>
  );
}
