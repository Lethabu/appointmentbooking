import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { resolveTenant } from '@/lib/tenant-resolver';
import TenantHome from '@/components/tenant/TenantHome';
import type { Database } from '@/types/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AIChat from '../instylehairboutique/ai-chat';
import { inStyleBrand } from '../instylehairboutique/config';

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

// Generate dynamic metadata (Remains the same, handled in layout)

// In-Style Page Component
function InStylePageComponent() {
  const services = [
    {
      name: "Middle & Side Installation",
      price: "R450",
      duration: "60 minutes",
      description: "Professional installation of middle and side part weaves for a natural, elegant look."
    },
    {
      name: "Maphondo & Lines Installation",
      price: "R600",
      duration: "90 minutes",
      description: "Intricate Maphondo and lines installation creating stunning geometric patterns."
    },
    {
      name: "Hair Treatment",
      price: "R250",
      duration: "30 minutes",
      description: "Rejuvenating hair treatment to restore health, shine and vitality to your hair."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">InStyle Hair Boutique</h1>
              <p className="text-gray-600">Premium Hair Services</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/book/instylehairboutique">Book Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Look
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional hair installations, treatments and styling services.
            Experience the art of beautiful hair at InStyle Hair Boutique.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/book/instylehairboutique">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link href="/instylehairboutique/shop">Shop Products</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="#services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-purple-600">{service.name}</CardTitle>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{service.duration}</span>
                    <span className="font-bold text-amber-600">{service.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/book/instylehairboutique">Book This Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">Chat with Nia</h3>
          <p className="text-center text-gray-600 mb-8">
            Have questions? Chat with our AI assistant Nia about services, pricing, and bookings.
          </p>
          <AIChat />
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Follow Us</h3>
          <div className="flex justify-center gap-6">
            {Object.entries(inStyleBrand.socials).map(([platform, url]) => (
              <Button key={platform} variant="outline" asChild>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 InStyle Hair Boutique. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Premium hair services in South Africa</p>
        </div>
      </footer>
    </div>
  );
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

  // Conditional rendering based on tenant
  if (tenant === 'instylehairboutique') {
    return <InStylePageComponent />;
  }

  // Default data-driven component for other tenants
  const { config, services, products } = await getTenantData(tenant);
  return <TenantHome config={config} services={services} products={products} />;
}
