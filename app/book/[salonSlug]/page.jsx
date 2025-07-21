'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient'; // This path is correct
import ModernCalendar from "@/app/components/Booking/ModernCalendar";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { salonSlug } = params;
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!salonSlug) {
        return;
      }

      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("id, name")
        .eq("subdomain", salonSlug)
        .single();

      if (salonError) {
        console.error("Error fetching salon:", salonError);
        setError("Salon not found");
        return;
      }
      
      console.log("Salon Data:", salonData);
      setSalon(salonData);

      if (salonData) {
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("id, name, price")
          .eq("salon_id", salonData.id);

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          setError("Error fetching services");
        } else {
          console.log("Services Data:", servicesData);
          setServices(servicesData || []);
        }
      }
    };

    fetchData();
  }, [salonSlug]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBookingConfirmed = (bookingData) => {
    setBooking(bookingData);
    setStep(3);
  };

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salon) return <div className="p-8 text-center">Loading salon...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book at {salon.name}</h1>
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
                  {service.name} <span className="float-right">R{service.price}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {step === 2 && selectedService && (
        <ModernCalendar
          salonId={salon.id}
          serviceId={selectedService.id}
          onBookingConfirmed={handleBookingConfirmed}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && booking && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="mb-4">Thank you for booking {selectedService.name} at {salon.name}.</p>
          <button className="btn" onClick={() => router.push("/")}>Back to Home</button>
        </div>
      )}
    </div>
  );
}
