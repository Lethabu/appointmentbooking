'use client';

import type { Service } from '@/types';
import { ServiceCard } from './service-card';

interface ServiceListProps {
  services: Service[];
  selectedServices: Service[];
  onServiceToggle: (service: Service) => void;
}

export function ServiceList({
  services,
  selectedServices,
  onServiceToggle,
}: ServiceListProps) {
  // Group services by category
  const servicesByCategory = services.reduce(
    (acc, service) => {
      const category = service.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>,
  );

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
        <p className="text-gray-600">Choose from our premium hair services</p>
      </div>

      {Object.entries(servicesByCategory).map(
        ([category, categoryServices]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServices.some((s) => s.id === service.id)}
                  onToggle={() => onServiceToggle(service)}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </section>
  );
}
