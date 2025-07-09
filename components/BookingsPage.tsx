
import React, { useState, useCallback } from 'react';
import SimpleCalendar from './SimpleCalendar';
import BookingForm from './BookingForm';
import { Booking, Service } from './types';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Create a QueryClient instance
const queryClient = new QueryClient();


const BookingsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  // Mock API call to fetch bookings
  const fetchBookings = async (): Promise<Booking[]> => {
    // Replace this with your actual API call
    console.log("Fetching bookings...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    return []; // Return an empty array or fetch from a mock data source
  };

  const { isLoading, error, data: bookingsData } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    initialData: [], // Provide an initial empty array to avoid loading states on initial mount
    // TanStack Query automatically retries failed requests 3 times with exponential backoff.
    // You can customize this. For example, to retry only once:
    retry: 1,
  });


  const handleBookingSubmit = useCallback(async (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`, // Simple unique ID
      status: 'pending',
    };
    // Simulate adding booking to the server
    await new Promise(resolve => setTimeout(resolve, 500));
    // Update the local state
    // Invalidate and refetch bookings
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    alert(`Booking for ${newBooking.clientName} on ${newBooking.dateTime.toLocaleDateString()} at ${newBooking.dateTime.toLocaleTimeString()} added! Status: Pending.`);
    // You could also clear selectedDate or give other feedback
  }, []);

  const bookingsForSelectedDate = selectedDate 
    ? bookingsData.filter(b => b.dateTime.toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SimpleCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
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
              {bookingsForSelectedDate.map(booking => (
                <li key={booking.id} className="p-3 bg-neutral-50 rounded-md shadow-sm">
                  <p className="font-medium text-neutral-800">{booking.clientName} - {booking.service.name}</p>
                  <p className="text-sm text-neutral-600">
                    Time: {booking.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Status: {booking.status}
                  </p>
                </li>
              ))}
            </ul></>
            )}
          </div>
        )}
          {selectedDate && bookingsForSelectedDate.length === 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            {isLoading && <p>Loading bookings...</p>}
            {error && <p>Error: {error.message}</p>}
            {!isLoading && !error && (
           <div className="mt-6 bg-white p-4 rounded-lg shadow-lg text-center">
             <p className="text-neutral-500">No bookings scheduled for {selectedDate.toLocaleDateString()}.</p>
           </div>
         )}
          </div> 
      )}
      </div>
      <div className="lg:col-span-1">
        <BookingForm selectedDate={selectedDate} onBookingSubmit={handleBookingSubmit} />
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
