import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { resolveTenant } from '@/lib/tenant-resolver';
import TenantHome from '@/components/tenant/TenantHome';
import type { Database } from '@/types/supabase';

// Types
type ServiceRow = Database['public']['Tables']['services']['Row'] & {
  description?: string | null;
  service_category: { name: string } | null | any[]; // Handle join result
};

export interface Service {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  duration_minutes: number;
  service_category?: { name: string } | null;
}

type ProductRow = Database['public']['Tables']['products']['Row'];

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price_cents: number;
  image_url: string;
}

interface TenantConfig {
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

interface TenantPageProps {
  params: { tenant: string };
}

// Generate dynamic metadata
export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const { tenant } = params;
  const config = await resolveTenant(tenant);

  if (!config) {
    return {
      title: 'Tenant Not Found',
      description: 'The requested tenant could not be found.',
    };
  }

  // Schema.org for HairSalon (adapt for other types)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: config.name,
    description: config.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.contact?.address?.split(',')[0] || '',
      addressLocality: config.contact?.address?.split(',')[1]?.trim() || '',
      addressRegion: 'Gauteng',
      postalCode: '0190',
      addressCountry: 'ZA',
    },
    telephone: config.contact?.phone || '',
    url: `https://${tenant}.example.com`, // Adapt to actual domain
    openingHours: config.openingHours,
    priceRange: 'R300-R950',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
  };

  return {
    title: `${config.name} - Premium Hair Services`,
    description: config.description,
    openGraph: {
      images: [config.theme?.logo || ''],
      title: config.name,
      description: config.description,
    },
    other: {
      'application/ld+json': JSON.stringify(schema),
    },
  };
}

// Server component to fetch data
async function getTenantData(tenant: string): Promise<{ config: TenantConfig; services: Service[]; products: Product[] }> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const config = await resolveTenant(tenant);
  if (!config) notFound();

  // Fetch services dynamically
  const { data: services } = await supabase
    .from('services')
    .select('id, name, description, duration_minutes, price, service_category(name)')
    .eq('salon_id', config.salon_id)
    .eq('is_active', true)
    .order('name', { ascending: true });

  // Fetch products
  const { data: productsData } = await supabase
    .from('products')
    .select('id, name, description, price, image_urls, is_active')
    .eq('salon_id', config.salon_id)
    .eq('is_active', true)
    .limit(6);

  const servicesTyped: Service[] = (services as ServiceRow[] | null)?.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description || '',
    price_cents: (service.price as number) || 0,
    duration_minutes: service.duration_minutes || 0,
    service_category: Array.isArray(service.service_category)
      ? service.service_category[0]?.name ? { name: service.service_category[0].name as string } : null
      : service.service_category?.name ? { name: service.service_category.name as string } : null,
  })) || [];

  const products: Product[] = (productsData as ProductRow[] | null)?.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price_cents: product.price || 0,
    image_url: (product.image_urls as string[] | null)?.[0] || '/placeholder-product-image.svg',
  })) || [];

  return {
    config,
    services: servicesTyped,
    products,
  };
}

// Main page component
export default async function TenantPage({ params }: TenantPageProps) {
  const { tenant } = params;
  const { config, services, products } = await getTenantData(tenant);

  return <TenantHome config={config} services={services} products={products} />;
}
