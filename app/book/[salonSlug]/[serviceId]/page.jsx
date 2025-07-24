'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient';
import SimpleCalendar from "@/app/components/Booking/SimpleCalendar";

export default function ServiceBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { salonSlug: rawSalonSlug, serviceId } = params;
  const salonSlug = rawSalonSlug ? rawSalonSlug.replace(/\.+$/, '') : '';

  const [salon, setSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!salonSlug || !serviceId) {
        console.log("salonSlug or serviceId is missing.");
        setError("Invalid booking link.");
        return;
      }

      // Fetch salon data
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("id, name, subdomain")
        .eq("subdomain", salonSlug)
        .single();

      if (salonError || !salonData) {
        console.error("Error fetching salon:", salonError);
        setError("Salon not found.");
        return;
      }
      setSalon(salonData);

      // Fetch service data
      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("id, name, price_cents")
        .eq("id", serviceId)
        .eq("salon_id", salonData.id)
        .single();

      if (serviceError || !serviceData) {
        console.error("Error fetching service:", serviceError);
        setError("Service not found or does not belong to this salon.");
        return;
      }
      setSelectedService(serviceData);
    };

    fetchData();
  }, [salonSlug, serviceId]);

  const handleBookingConfirmed = (bookingData) => {
    // This function will be called by SimpleCalendar when a booking is confirmed
    // You can redirect to a success page or show a confirmation message here
    router.push(`/booking-success?bookingId=${bookingData.id}`);
  };

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salon || !selectedService) return <div className="p-8 text-center">Loading booking details...</div>;

  return (
    <SimpleCalendar
      salonId={salon.id}
      serviceId={selectedService.id}
      onBookingConfirmed={handleBookingConfirmed}
      onBack={() => router.push(`/book/${salonSlug}`)} // Go back to service selection page
    />
  );
}
