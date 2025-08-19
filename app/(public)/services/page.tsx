'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ServiceCard } from '@/components/service/ServiceCard';
import { BundleSelector } from '@/components/service/BundleSelector';

export default function ServicesPage() {
  const services = useQuery(api.services.list, { tenantName: 'instyle' });
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services?.map(s => <ServiceCard key={s._id} service={s} />)}
      
    </section>
  );
}
