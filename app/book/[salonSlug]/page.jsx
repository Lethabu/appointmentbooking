"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import Calendar from "../../../../appointmentbooking/components/components/Booking/Calendar";

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
    const fetchSalon = async () => {
      const { data, error } = await supabase
        .from("salons")
        .select("id, name")
        .eq("slug", salonSlug)
        .single();
      if (error) setError("Salon not found");
      else setSalon(data);
    };
    const fetchServices = async () => {
      const { data } = await supabase
        .from("services")
        .select("id, name, price")
        .eq("salon_slug", salonSlug);
      setServices(data || []);
    };
    if (salonSlug) {
      fetchSalon();
      fetchServices();
    }
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
        <Calendar
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
