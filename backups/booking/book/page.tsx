'use client';

import { useState, useCallback, useEffect } from 'react';
import BookingForm from '@/components/BookingForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Booking } from '@/components/types';

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [salonId, setSalonId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getSalonId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: salon, error } = await supabase
          .from('salons')
          .select('id')
          .eq('owner_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching salon ID:', error);
        } else if (salon) {
          setSalonId(salon.id);
        }
      }
    };
    getSalonId();
  }, [supabase]);

  const handleBookingSubmit = useCallback(
    async (newBookingData: Omit<Booking, 'id' | 'status'>) => {
      console.log('New booking data:', newBookingData);
      alert(
        `Booking for ${newBookingData.clientName} on ${newBookingData.scheduled_time.toLocaleDateString()} at ${newBookingData.scheduled_time.toLocaleTimeString()} added! Status: Pending.`,
      );
    },
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Book Your Appointment</h1>
          {salonId ? (
            <BookingForm
              selectedDate={selectedDate}
              onBookingSubmit={handleBookingSubmit}
              salonId={salonId}
            />
          ) : (
            <p>Loading salon information...</p>
          )}
        </div>
      </section>
    </div>
  );
}
