import { useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export interface BookingData {
  clientName: string;
  scheduled_time: Date;
  serviceId: string;
  salonId: string;
  tenant?: string;
}

export function useBooking(salonId: string, tenant?: string) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = useCallback(async (data: Omit<BookingData, 'id' | 'status'>) => {
    setLoading(true);
    setError(null);

    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ...data,
          status: 'pending',
          salon_id: salonId,
          tenant,
        });

      if (bookingError) throw bookingError;

      // Success - redirect or update UI
      router.push(tenant ? `/${tenant}` : '/');
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Booking failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [salonId, tenant, supabase, router]);

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price_cents')
      .eq('salon_id', salonId)
      .order('name');

    if (error) {
      setError(error.message);
      return [];
    }
    return data || [];
  }, [salonId, supabase]);

  return {
    submitBooking,
    fetchServices,
    loading,
    error,
  };
}