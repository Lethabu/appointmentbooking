import React from 'react';
import { Service } from './types';

interface BookingFlowProps {
  services: Service[];
  tenantId: string;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ services, tenantId }) => {
  if (services.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-neutral-700">Our Services</h2>
        <p className="mt-2 text-neutral-500">No services are currently available. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6 text-center">Select a Service</h2>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-neutral-700">{service.name}</h3>
              <p className="text-sm text-neutral-500 max-w-md">{service.description}</p>
              <p className="text-sm text-neutral-600 mt-1">{service.duration_minutes} minutes</p>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <p className="text-lg font-bold text-primary">R{service.price}</p>
              <button className="mt-2 w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingFlow;
