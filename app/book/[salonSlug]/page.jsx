'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import { useParams } from 'next/navigation';
import { supabase } from '@/app/utils/supabaseClient';

export default function BookingPage() {
  const params = useParams();
  const { salonSlug: rawSalonSlug } = params;
  const salonSlug = rawSalonSlug ? rawSalonSlug.replace(/\.+$/, '') : '';
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
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
        .eq("subdomain", salonSlug)
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

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salon) return <div className="p-8 text-center">Loading salon...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book at {salon.name}</h1>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Select a Service</h2>
        <ul className="mb-6">
          {services.map((service) => (
            <li key={service.id} className="mb-2">
              <Link 
                href={`/book/${salonSlug}/${service.id}`}
                className="block w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
              >
                {service.name} <span className="float-right">R{service.price_cents / 100}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
