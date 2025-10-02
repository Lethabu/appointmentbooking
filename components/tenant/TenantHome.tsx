'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CalendarDaysIcon } from 'lucide-react';

const ServicesGrid = dynamic(() => import('./ServicesGrid'), { ssr: false });
const ProductsGrid = dynamic(() => import('./ProductsGrid'), { ssr: false });
const AppointmentHistory = dynamic(() => import('./AppointmentHistory'), { ssr: false });
const GoogleMap = dynamic(() => import('./GoogleMap'), { ssr: false });
const ContactSection = dynamic(() => import('./ContactSection'), { ssr: false });
const LCPFix = dynamic(() => import('./LCPFix'), { ssr: false });
const BookingWidget = dynamic(() => import('@/components/BookingWidget'), { ssr: false });

// Types (duplicate from page for now, ideally shared)
export interface Service {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  duration_minutes: number;
  service_categories?: { name: string };
}

export interface Product {
  id: string;
  name: string;
  price_cents: number;
  image_url: string;
}

export interface Appointment {
  id: string;
  scheduled_time: string;
  status: string;
  services: { name: string }[];
  staff: { name: string }[];
  users: { name: string; email?: string }[];
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

interface TenantHomeProps {
  config: TenantConfig;
  services: Service[];
  products: Product[];
}

export default function TenantHome({ config, services, products }: TenantHomeProps) {
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from('bookings')
        .select(`
          id, scheduled_time, status, services(name), staff(name), users(name, email)
        `)
        .eq('salon_id', config.salon_id)
        .order('scheduled_time');

      const now = new Date();
      const history = (data || []).filter((b: any) => new Date(b.scheduled_time) < now);
      const future = (data || []).filter((b: any) => new Date(b.scheduled_time) >= now);

      setAppointmentHistory(history);
      setFutureAppointments(future);
      setLoading(false);
    }
    fetchAppointments();
  }, [config.salon_id]);

  const groupedServices = services.reduce((acc: Record<string, Service[]>, service) => {
    const cat = service.service_categories?.name || 'Other';
    acc[cat] = [...(acc[cat] || []), service];
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen"
      style={{
        '--primary': config.theme?.primaryColor || '#C0392B',
        '--secondary': config.theme?.secondaryColor || '#A93226',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Image
            src={config.theme?.logo || '/placeholder-logo.svg'}
            alt={config.name}
            width={180}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <Link href="/book">
            <button className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">
              Book Now
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero with LCP Fix */}
      <LCPFix tenant={config.name} />
      <section className="text-center py-20 text-white" style={{ background: `linear-gradient(to right, var(--primary), var(--secondary))` }}>
        <h1 className="text-4xl md:text-5xl font-extrabold">Where Style is Perfected</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">{config.description}</p>
        <div className="mt-8 flex justify-center gap-4">
          {Object.entries(config.socials).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <ServicesGrid services={services} groupedServices={groupedServices} />
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Exclusive Hair Care</h2>
          <ProductsGrid products={products} />
        </div>
      </section>

      {/* Appointments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Appointments</h2>
          <AppointmentHistory
            history={appointmentHistory}
            future={futureAppointments}
            loading={loading}
          />
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Transform Your Look?</h2>
          <BookingWidget tenant={config.name} salonId={config.salon_id} />
        </div>
      </section>

      {/* Location */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
          <GoogleMap address={config.contact?.address || ''} />
        </div>
      </section>

      <ContactSection config={config} />

      {/* Business Info */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-4">📍 Location</h3>
              <p>{config.contact?.address}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">🕐 Opening Hours</h3>
              <ul>
                {config.openingHours.map((hours, i) => (
                  <li key={i}>{hours}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">📞 Contact</h3>
              <p>
                Phone: {config.contact?.phone}
                <br />
                Email: {config.contact?.email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}