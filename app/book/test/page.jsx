'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/utils/supabaseClient';

export default function TestPage() {
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const salonSlug = 'instylehairboutique';

      console.log('Fetching data for slug:', salonSlug);

      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('id, name')
        .eq('subdomain', salonSlug)
        .single();

      if (salonError) {
        console.error('Error fetching salon:', salonError);
        setError(`Salon not found: ${salonError.message}`);
        setLoading(false);
        return;
      }

      console.log('Salon data:', salonData);
      setSalon(salonData);

      if (salonData) {
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name, price')
          .eq('salon_id', salonData.id);

        if (servicesError) {
          console.error('Error fetching services:', servicesError);
          setError(`Error fetching services: ${servicesError.message}`);
        } else {
          console.log('Services data:', servicesData);
          setServices(servicesData || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!salon) return <div className="p-8 text-center">Salon not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <h2 className="text-xl font-semibold mt-4">
        Salon: {salon.name} (ID: {salon.id})
      </h2>
      <h3 className="text-lg font-semibold mt-4">Services:</h3>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} - R{service.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
