'use client';
import React, { useState } from 'react';

interface Service {
  id: string;
  name: string;
  price: number;
}

const mockServices: Service[] = [
  { id: 'svc1', name: 'Haircut', price: 5000 },
  { id: 'svc2', name: 'Coloring', price: 15000 },
  { id: 'svc3', name: 'Manicure', price: 3000 },
];

interface Step1ServicesProps {
  onNext: (data: { serviceIds: string[]; totalAmount: number }) => void;
}

export const Step1_Services: React.FC<Step1ServicesProps> = ({ onNext }) => {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const calculateTotalAmount = () => {
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = mockServices.find((svc) => svc.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const handleNext = () => {
    if (selectedServiceIds.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    onNext({
      serviceIds: selectedServiceIds,
      totalAmount: calculateTotalAmount(),
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Select Services</h2>
      {mockServices.map((service) => (
        <div
          key={service.id}
          className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
            selectedServiceIds.includes(service.id)
              ? 'bg-blue-100 border-blue-500'
              : 'bg-white'
          }`}
          onClick={() => handleServiceToggle(service.id)}
        >
          <span>{service.name}</span>
          <span>R{(service.price / 100).toFixed(2)}</span>
        </div>
      ))}
      <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
        <span>Total:</span>
        <span>R{(calculateTotalAmount() / 100).toFixed(2)}</span>
      </div>
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Next: Select Date & Time
      </button>
    </div>
  );
};
