'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient'; // This path is correct
import SimpleCalendar from "@/app/components/Booking/SimpleCalendar";
// import ModernCalendar from "@/app/components/Booking/ModernCalendar";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { salonSlug: rawSalonSlug } = params;
  const salonSlug = rawSalonSlug ? rawSalonSlug.replace(/\.+$/, '') : '';
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching salon data for salonSlug:", salonSlug);
      if (!salonSlug) {
        console.log("salonSlug is missing, cannot fetch salon data.");
        return;
      }

      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("id, name, subdomain")
        .eq("subdomain", salonSlug) // Directly query for the specific salon
        .single();

      if (salonError || !salonData) {
        console.error("Error fetching salon or salon not found:", salonError);
        setError("Salon not found");
        return;
      }
      
      console.log("Salon data fetched:", salonData);
      setSalon(salonData);

      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("id, name, price_cents")
        .eq("salon_id", salonData.id);

      if (servicesError) {
        console.error("Error fetching services:", servicesError);
        setError("Error fetching services");
      } else {
        console.log("Services data fetched:", servicesData);
        setServices(servicesData || []);
      }
    };

    fetchData();
  }, [salonSlug]);

  const handleServiceSelect = (service) => {
    console.log("handleServiceSelect called with service:", service.name);
    setSelectedService(service);
    setStep(2);
  };

  const handleBookingConfirmed = (bookingData) => {
    setBooking(bookingData);
    setStep(3);
  };

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salon) return <div className="p-8 text-center">Loading salon...</div>;

  console.log("Current Step:", step);
  console.log("Selected Service:", selectedService?.name);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book at {salon.name}</h1>
      
      {step === 1 && salon && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a Service</h2>
          <ul className="mb-6">
            {services.map((service) => (
              <li key={service.id} className="mb-2">
                <div
                  className="w-full text-left p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleServiceSelect(service)}
                >
                  {service.name} <span className="float-right">R{service.price_cents / 100}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 2 && salon && selectedService && (
        <SimpleCalendar
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
