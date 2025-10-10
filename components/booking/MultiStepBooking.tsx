'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SimpleCalendar from './SimpleCalendar'; // Assume this exists or create it
import BookingForm from './BookingForm'; // From app/book

interface Service {
  id: string;
  name: string;
  price_cents: number;
}

interface MultiStepBookingProps {
  services: Service[];
  salonId: string;
  tenant?: string;
  salonName: string;
}

export default function MultiStepBooking({ services, salonId, tenant, salonName }: MultiStepBookingProps) {
  const router = useRouter();
  const params = useParams();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [salonIdState, setSalonIdState] = useState(salonId);
  const supabase = createClientComponentClient();

  // Fetch salon ID if auth-gated (from app/book logic)
  useEffect(() => {
    async function getSalonId() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !salonIdState) {
        const { data: salon } = await supabase
          .from('salons')
          .select('id')
          .eq('owner_id', session.user.id)
          .single();
        if (salon) setSalonIdState(salon.id);
      }
    }
    getSalonId();
  }, [salonIdState, supabase]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBookingConfirmed = (bookingData: any) => {
    setBooking(bookingData);
    setStep(3);
  };

  const handleBack = () => setStep(1);

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salonIdState) return <div className="p-8 text-center">Loading salon...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book at {salonName || 'Your Salon'}</h1>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a Service</h2>
          <ul className="mb-6">
            {services.map((service) => (
              <li key={service.id} className="mb-2">
                <button
                  className="w-full text-left p-3 border rounded hover:bg-gray-50"
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.name}{' '}
                  <span className="float-right">
                    R{service.price_cents / 100}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 2 && selectedService && (
        <SimpleCalendar
          salonId={salonIdState}
          serviceId={selectedService.id}
          onBookingConfirmed={handleBookingConfirmed}
          onBack={handleBack}
        />
      )}
      {step === 3 && booking && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="mb-4">
            Thank you for booking {selectedService?.name} at {salonName}.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => router.push(tenant ? `/${tenant}` : '/')}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
