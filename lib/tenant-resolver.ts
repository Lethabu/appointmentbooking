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
  description: string;
  openingHours: string[];
  salon_id: string;
  socials: Record<string, string>;
}

const TENANT_CONFIGURATIONS: Record<string, TenantConfig> = {
  'instylehairboutique.co.za': {
    id: 'instyle-001',
    slug: 'instyle',
    domain: 'instylehairboutique.co.za',
    name: 'InStyle Hair Boutique',
    canonical: 'instyle',
    assets: 'instyle',
    redirects: ['instylehairboutique', 'instyle-hair-boutique', 'instyle'],
    theme: {
      primaryColor: '#C0392B',
      secondaryColor: '#A93226',
      logo: '/tenants/instyle/logo.svg'
    },
    contact: {
      phone: '+27 64 769 6159',
      email: 'zanele@instyle.co.za',
      address: '4582 Block B, Mabopane, Pretoria 0190, South Africa'
    },
    description: 'Premium hair treatments, professional styling, and colour services in the heart of Johannesburg.',
    openingHours: ['Mo-Fr 09:00-18:00', 'Sa 09:00-16:00', 'Su Closed'],
    salon_id: process.env.NEXT_PUBLIC_INSTYLE_SALON_ID || 'default-instyle-id',
    socials: {
      instagram: 'https://instagram.com/instylehairboutique',
      whatsapp: 'https://wa.me/27647696159',
      facebook: 'https://facebook.com/instylehairboutique'
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
    },
    contact: {
      phone: '+27 11 123 4567',
      email: 'support@appointmentbooking.co.za',
      address: 'Johannesburg, South Africa'
    },
    description: 'Multi-tenant appointment booking platform.',
    openingHours: ['Mo-Fr 08:00-17:00'],
    salon_id: 'platform-default',
    socials: {}
  }
  // Add more tenants as needed
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

export async function resolveTenant(slug: string): Promise<TenantConfig | null> {
  // For now, use static; in future, fetch from Supabase for dynamic tenants
  let config = resolveTenantFromSlug(slug);
  if (!config) {
    // Fallback to DB fetch if static not found
    // const supabase = createServerComponentClient({ cookies });
    // const { data } = await supabase.from('tenants').select('*').eq('slug', slug).single();
    // if (data) config = { ...data, ...static overrides };
  }
  return config;
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
