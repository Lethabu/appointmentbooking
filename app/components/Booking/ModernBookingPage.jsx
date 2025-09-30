'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ModernBookingPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [currentStep] = useState(1);
  const router = useRouter();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return <div className="text-center p-8">Loading services...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`p-4 rounded-lg border-2 transition-all
              ${
                selectedService === service.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
          >
            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
            <div className="text-gray-600">
              <p>Duration: {service.duration}</p>
              <p>Price: R{service.price}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModernBookingPage;
