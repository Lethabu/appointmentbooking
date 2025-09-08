
import { createServerSupabaseClient } from '@/lib/supabase';
import { TenantHeader } from '@/components/layout/TenantHeader';
import { TenantFooter } from '@/components/layout/TenantFooter';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

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

  // If a theme exists in the array, use it. Otherwise, theme will be null.
  const theme = Array.isArray(tenant.tenant_themes) && tenant.tenant_themes.length > 0 
    ? tenant.tenant_themes[0] 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      {theme ? (
        <TenantHeader 
          salonSlug={params.salon}
          logoUrl={theme.logo_url}
          brandName={theme.brand_name || tenant.name}
          headerLinks={theme.header_links || []}
          primaryColor={theme.primary_color}
        />
      ) : (
        <Navigation />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {theme ? (
        <TenantFooter 
          brandName={theme.brand_name || tenant.name}
          footerHtml={theme.footer_html}
        />
      ) : (
        <Footer />
      )}
    </div>
  );
}
