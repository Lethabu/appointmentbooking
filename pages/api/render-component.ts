import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

const getTenantByHost = async (host: string) => {
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

const getComponents = async (tenantId: string) => {
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

    const header = components.find(c => c.comp_type === 'header');
    const footer = components.find(c => c.comp_type === 'footer');

    return {
        header: header ? { html_chunk: header.html_chunk, css: header.css } : null,
        footer: footer ? { html_chunk: footer.html_chunk, css: footer.css } : null,
    };
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const host = req.headers.host ?? '';
    const tenant = await getTenantByHost(host);

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const components = await getComponents(tenant.id);

    if (!components) {
      // Return empty strings to prevent leaking platform components
      return res.status(200).json({ header: { html_chunk: '', css: '' }, footer: { html_chunk: '', css: '' } });
    }

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json(components);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}