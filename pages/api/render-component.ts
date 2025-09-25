import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

interface Component {
  comp_type: string;
  html_chunk: string;
  css: string;
}

const getTenantByHost = async (host: string, supabase: SupabaseClient) => {
  const { data: tenant, error } = await supabase
    .from('salons')
    .select('id, name')
    .or(`custom_domain.eq.${host},subdomain.eq.${host.split('.')[0]}`)
    .single();

  if (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }

  return tenant;
};

const getComponents = async (tenantId: string, supabase: SupabaseClient): Promise<{ header: { html_chunk: string; css: string } | null; footer: { html_chunk: string; css: string } | null } | null> => {
  const { data: components, error } = await supabase
    .from('tenant_components')
    .select('comp_type, html_chunk, css')
    .eq('tenant_id', tenantId);

  if (error) {
    console.error('Error fetching components:', error);
    return null;
  }

  if (!components) {
    return null;
  }

  const header = components.find((c: Component) => c.comp_type === 'header');
  const footer = components.find((c: Component) => c.comp_type === 'footer');

  return {
    header: header ? { html_chunk: header.html_chunk, css: header.css } : null,
    footer: footer ? { html_chunk: footer.html_chunk, css: footer.css } : null,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const supabase = createClient();
  try {
    const host = req.headers.host ?? '';
    const tenant = await getTenantByHost(host, supabase);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const components = await getComponents(tenant.id, supabase);

    if (!components) {
      // Return empty strings to prevent leaking platform components
      return res.status(200).json({
        header: { html_chunk: '', css: '' },
        footer: { html_chunk: '', css: '' },
      });
    }

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json(components);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
