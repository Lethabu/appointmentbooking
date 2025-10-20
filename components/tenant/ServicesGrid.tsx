import { Service } from '../../app/[tenant]/page'; // Import type

interface ServicesGridProps {
  services: Service[];
  groupedServices: Record<string, Service[]>;
}

interface ServiceCardProps {
  service: Service;
}

function ServiceCard({ service }: ServiceCardProps) {
  const price = (service.price_cents / 100).toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      <h4 className="text-xl font-bold mb-2">{service.name}</h4>
      <p className="text-gray-600 text-sm mb-3 flex-1">{service.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-[#C0392B]">{price}</span>
        <span className="text-sm text-gray-500">
          {service.duration_minutes} min
        </span>
      </div>
    </div>
  );
}

export default function ServicesGrid({ services, groupedServices }: ServicesGridProps) {
  if (services.length === 0) {
    return <p className="text-center py-8">No services available.</p>;
  }

  return (
    <>
      {Object.entries(groupedServices).map(([category, items]) => (
        <div key={category} className="mb-10">
          <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">
            {category}
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}