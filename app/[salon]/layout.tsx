
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

  // Fetch tenant and theme data in one go
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

  // Default to an empty object if no theme is found
  const theme = tenant.tenant_themes || {};

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
