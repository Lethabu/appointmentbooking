import React, { useState, useCallback, useEffect } from 'react';
import SimpleCalendar from './SimpleCalendar';
import BookingForm from './BookingForm';
import { Booking, Service, RawAppointmentData, Staff } from './types';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create a QueryClient instance
const queryClient = new QueryClient();

const BookingsPage: React.FC = () => {
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

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const fetchBookings = useCallback(async (): Promise<Booking[]> => {
    if (!salonId || !selectedDate) return [];

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('appointments')
      .select(
        `
        id,
        scheduled_time,
        status,
        client_name,
        client_phone,
        recurrence_rule,
        services ( id, name, description, price, duration_minutes ),
        staff ( id, name )
      `,
      )
      .eq('salon_id', salonId)
      .gte('scheduled_time', startOfDay.toISOString())
      .lte('scheduled_time', endOfDay.toISOString())
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data.map((appt: RawAppointmentData) => {
      const mappedService: Service =
        appt.services && appt.services.length > 0
          ? appt.services[0]
          : ({} as Service); // Ensure it's a single Service object
      const mappedStaff: Staff | null =
        appt.staff && appt.staff.length > 0 ? appt.staff[0] : null; // Ensure it's a single Staff object

      return {
        id: appt.id,
        clientName: appt.client_name,
        clientPhone: appt.client_phone,
        service: mappedService,
        scheduled_time: new Date(appt.scheduled_time),
        status: appt.status as
          | 'pending'
          | 'confirmed'
          | 'cancelled'
          | 'scheduled'
          | 'in_progress'
          | 'completed'
          | 'no_show',
        staffId: mappedStaff?.id || null, // Access id from the mappedStaff object
        recurrence_rule: appt.recurrence_rule || null,
        staff: mappedStaff,
      };
    });
  }, [salonId, selectedDate, supabase]);

  const {
    isLoading,
    error,
    data: bookingsData,
    refetch,
  } = useQuery({
    queryKey: ['bookings', salonId, selectedDate?.toDateString()],
    queryFn: fetchBookings,
    enabled: !!salonId && !!selectedDate, // Only run query if salonId and selectedDate are available
    initialData: [],
  });

  // Refetch bookings when a new one is submitted
  const handleBookingSubmit = useCallback(
    async (newBookingData: Omit<Booking, 'id' | 'status'>) => {
      // This part will be handled by the agent-functions.js bookAppointment
      // and the webhook will trigger a refetch if needed.
      // For now, we'll just refetch after a simulated delay.
      await new Promise((resolve) => setTimeout(resolve, 500));
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      refetch(); // Manually refetch after a booking submission
      alert(
        `Booking for ${newBookingData.clientName} on ${newBookingData.scheduled_time.toLocaleDateString()} at ${newBookingData.scheduled_time.toLocaleTimeString()} added! Status: Pending.`,
      );
    },
    [refetch],
  );

  const bookingsForSelectedDate = selectedDate
    ? bookingsData.filter(
        (b) => b.scheduled_time.toDateString() === selectedDate.toDateString(),
      )
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SimpleCalendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
        {selectedDate && bookingsForSelectedDate.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            {isLoading && <p>Loading bookings...</p>}
            {error && <p>Error: {error.message}</p>}
            {!isLoading && !error && (
              <>
                <h3 className="text-lg font-semibold text-neutral-700 mb-3">
                  Bookings for {selectedDate.toLocaleDateString()}:
                </h3>
                <ul className="space-y-2">
                  {bookingsForSelectedDate.map((booking) => (
                    <li
                      key={booking.id}
                      className="p-3 bg-neutral-50 rounded-md shadow-sm"
                    >
                      <p className="font-medium text-neutral-800">
                        {booking.clientName} - {booking.service.name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Time:{' '}
                        {booking.scheduled_time.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        - Status: {booking.status}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        {selectedDate && bookingsForSelectedDate.length === 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            {isLoading && <p>Loading bookings...</p>}
            {error && <p>Error: {error.message}</p>}
            {!isLoading && !error && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow-lg text-center">
                <p className="text-neutral-500">
                  No bookings scheduled for {selectedDate.toLocaleDateString()}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
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
    </div>
  );
};

const BookingsPageWrapper: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <BookingsPage />
  </QueryClientProvider>
);

export default BookingsPageWrapper;
