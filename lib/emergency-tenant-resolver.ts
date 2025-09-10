import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  custom_domain: string | null;
  primary_color: string | null;
  components: {
    header: string;
    footer: string;
  };
}

export class EmergencyTenantResolver {
  private static cache = new Map<string, TenantConfig>();
  private static cacheExpiry = new Map<string, number>();

  static async resolveTenant(hostname: string): Promise<TenantConfig | null> {
    // Check cache first
    const cached = this.cache.get(hostname);
    const expiry = this.cacheExpiry.get(hostname);
    
    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    try {
      // Query database for tenant
      const { data: salon, error } = await supabase
        .from('salons')
        .select(`
          id,
          name,
          subdomain,
          custom_domain,
          primary_color,
          tenant_components!inner(
            comp_type,
            html_chunk
          )
        `)
        .or(`custom_domain.eq.${hostname},subdomain.eq.${hostname.split('.')[0]}`)
        .single();

      if (error || !salon) {
        console.warn(`Tenant not found for hostname: ${hostname}`);
        return null;
      }

      // Build tenant config
      const components = salon.tenant_components.reduce((acc: any, comp: any) => {
        acc[comp.comp_type] = comp.html_chunk;
        return acc;
      }, {});

      const config: TenantConfig = {
        id: salon.id,
        name: salon.name,
        subdomain: salon.subdomain,
        custom_domain: salon.custom_domain,
        primary_color: salon.primary_color,
        components: {
          header: components.header || '',
          footer: components.footer || ''
        }
      };

      // Cache for 5 minutes
      this.cache.set(hostname, config);
      this.cacheExpiry.set(hostname, Date.now() + (5 * 60 * 1000));

      return config;

    } catch (error) {
      console.error('Tenant resolution error:', error);
      return null;
    }
  }

  static clearCache(hostname?: string) {
    if (hostname) {
      this.cache.delete(hostname);
      this.cacheExpiry.delete(hostname);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }
}
