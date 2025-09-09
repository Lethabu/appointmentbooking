import { GetStaticPaths, GetStaticProps } from 'next';
import TenantShell from '../../components/TenantShell';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { BookingWidget } from '../../components/booking/booking-widget';
import { TypebotWidget } from '../../components/typebot/typebot-widget';
import fs from 'fs';
import path from 'path';
import useSWR from 'swr';

const listAllTenantsSlugs = async () => {
  const { data, error } = await supabase
    .from('salons')
    .select('subdomain');

  if (error) {
    console.error('Error fetching tenant slugs:', error);
    return [];
  }

  return data.map(t => ({ slug: t.subdomain }));
};

const getTenantBySlug = async (slug: string) => {
    const { data: tenant, error } = await supabase
        .from('salons')
        .select('*')
        .eq('subdomain', slug)
        .single();

    if (error) {
        console.error('Error fetching tenant by slug:', error);
        return null;
    }

    return tenant;
};

const fileExistsForPath = async (salon: string, pagePath: string) => {
    // This function determines if a specific page path exists for a given salon.
    // In a real application, this would involve:
    // 1. Checking for static files (e.g., pages/[salon]/about.tsx)
    // 2. Querying a CMS or database for dynamic pages.

    // For now, we assume only the root path ('/') exists as a "hard" page.
    // All other paths will trigger the soft 404 unless explicitly handled elsewhere.
    return pagePath === '/';
}


export const getStaticPaths: GetStaticPaths = async () => {
  const tenants = await listAllTenantsSlugs();
  const paths = tenants.map((t: any) => ({ params: { salon: t.slug, slug: [] } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { salon, slug = [] } = params as any;
  const pagePath = '/' + slug.join('/');
  const tenant = await getTenantBySlug(salon);

  if (!tenant) {
    return { notFound: true };
  }

  const fileExists = await fileExistsForPath(salon, pagePath);

  if (!fileExists && pagePath !== '/') {
    return {
      props: { tenant, is404: true, services: [], branding: {}, tokens: {} },
      revalidate: 30,
    };
  }

  // Get services for this tenant
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', tenant.id)
    .eq('is_active', true)
    .order('name');

  const branding = tenant.branding || {};

  // Load design tokens
  let tokens = {};
  try {
    const tokenFilePath = path.join(process.cwd(), 'tokens', `${tenant.subdomain}.json`);
    const tokenFileContent = await fs.promises.readFile(tokenFilePath, 'utf-8');
    tokens = JSON.parse(tokenFileContent);
  } catch (error) {
    console.error(`Error loading tokens for ${tenant.subdomain}:`, error);
    // Fallback to platform tokens if tenant-specific tokens not found
    try {
      const platformTokenFilePath = path.join(process.cwd(), 'tokens', 'platform.json');
      const platformTokenFileContent = await fs.promises.readFile(platformTokenFilePath, 'utf-8');
      tokens = JSON.parse(platformTokenFileContent);
    } catch (platformError) {
      console.error('Error loading platform tokens:', platformError);
    }
  }

  return { props: { tenant, is404: false, services: services || [], branding, tokens }, revalidate: 300 };
};

const TenantPage = ({ tenant, is404, services, branding, tokens }: { tenant: any, is404: boolean, services: any[], branding: any, tokens: any }) => {
  const fetcher = (url: string, body: any) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

  const { data: suggestionsData } = useSWR(
    is404 ? ['/api/suggest-page', { path: window.location.pathname, tenantId: tenant.id, services }] : null,
    fetcher
  );

  if (is404) {
    return (
      <TenantShell tokens={tokens}>
        <h1>Page not found</h1>
        <p>We couldn't find the page you were looking for.</p>
        {suggestionsData && suggestionsData.suggestions && suggestionsData.suggestions.length > 0 && (
          <div>
            <h2>Perhaps you were looking for:</h2>
            <ul>
              {suggestionsData.suggestions.map((s: any) => (
                <li key={s.url}>
                  <Link href={s.url}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href="/">← Back to Home</Link>
      </TenantShell>
    );
  }

  return (
    <TenantShell tokens={tokens}>
        <div className="flex flex-col" style={{ backgroundColor: branding.backgroundColor || '#f9fafb' }}>

            {/* Booking Widget */}
            <main className="max-w-4xl mx-auto px-4 py-8 w-full">
                <BookingWidget
                    tenantId={tenant.id}
                    services={services || []}
                    branding={branding}
                />
            </main>

            {/* Typebot Chat Widget */}
            <TypebotWidget
                typebotId={process.env.NEXT_PUBLIC_TYPEBOT_ID || 'instyle-booking-flow'}
                tenantId={tenant.id}
                theme={{
                    button: { backgroundColor: branding.primaryColor || '#6366f1' }
                }}
            />
        </div>
    </TenantShell>
  );
};

export default TenantPage;