export interface TenantConfig {
  id: string;
  slug: string;
  domain: string;
  name: string;
  canonical: string;
  assets: string;
  redirects: string[];
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
// ...existing code...
}

const TENANT_CONFIGURATIONS: Record<string, TenantConfig> = {
  'instylehairboutique.co.za': {
    id: 'instyle-001',
    slug: 'instyle',
    domain: 'instylehairboutique.co.za',
    name: 'InStyle Hair Boutique',
    canonical: 'instyle',
    assets: 'instyle',
    redirects: ['instylehairboutique', 'instyle-hair-boutique'],
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#DAA520',
      logo: '/tenants/instyle/logo.png'
    },
    contact: {
      phone: '+27123456789',
      email: 'info@instylehairboutique.co.za',
      address: 'Pretoria, South Africa'
    }
  },
  'www.appointmentbooking.co.za': {
    id: 'platform-001',
    slug: 'platform',
    domain: 'www.appointmentbooking.co.za',
    name: 'AppointmentBooking Platform',
    canonical: 'platform',
    assets: 'platform',
    redirects: [],
    theme: {
      primaryColor: '#0070f3',
      secondaryColor: '#00d9ff',
      logo: '/platform/logo.png'
    }
  }
};

export function resolveTenantFromHostname(hostname: string): TenantConfig | null {
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, '');
  if (TENANT_CONFIGURATIONS[hostname]) {
    return TENANT_CONFIGURATIONS[hostname];
  }
  if (TENANT_CONFIGURATIONS[normalizedHostname]) {
    return TENANT_CONFIGURATIONS[normalizedHostname];
  }
  const wwwHostname = `www.${normalizedHostname}`;
  if (TENANT_CONFIGURATIONS[wwwHostname]) {
    return TENANT_CONFIGURATIONS[wwwHostname];
  }
  return null;
}

export function resolveTenantFromSlug(slug: string): TenantConfig | null {
  return Object.values(TENANT_CONFIGURATIONS).find(tenant => 
    tenant.canonical === slug || 
    tenant.redirects.includes(slug)
  ) || null;
}

export function getAllTenants(): TenantConfig[] {
  return Object.values(TENANT_CONFIGURATIONS);
}

export function getTenantAssetPath(tenant: string, asset: string): string {
  const tenantConfig = resolveTenantFromSlug(tenant);
  if (!tenantConfig) {
    throw new Error(`Tenant configuration not found for: ${tenant}`);
  }
  return `/tenants/${tenantConfig.assets}/${asset}`;
}
