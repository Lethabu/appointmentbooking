
import React, { useState } from 'react';
import SimpleCalendar from './SimpleCalendar';
import BookingForm from './BookingForm';
import { Booking } from '../types';

const BookingsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]); // To store created bookings locally

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleBookingSubmit = (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`, // Simple unique ID
      status: 'Pending', // Default status
    };
    setBookings(prevBookings => [...prevBookings, newBooking]);
    alert(`Booking for ${newBooking.clientName} on ${newBooking.dateTime.toLocaleDateString()} at ${newBooking.dateTime.toLocaleTimeString()} added! Status: Pending.`);
    // You could also clear selectedDate or give other feedback
  };
  
  const bookingsForSelectedDate = selectedDate 
    ? bookings.filter(b => b.dateTime.toDateString() === selectedDate.toDateString())
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <SimpleCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        {selectedDate && bookingsForSelectedDate.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-neutral-700 mb-3">
              Bookings for {selectedDate.toLocaleDateString()}:
            </h3>
            <ul className="space-y-2">
              {bookingsForSelectedDate.map(booking => (
                <li key={booking.id} className="p-3 bg-neutral-50 rounded-md shadow-sm">
                  <p className="font-medium text-neutral-800">{booking.clientName} - {booking.service}</p>
                  <p className="text-sm text-neutral-600">
                    Time: {booking.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Status: {booking.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
         {selectedDate && bookingsForSelectedDate.length === 0 && (
           <div className="mt-6 bg-white p-4 rounded-lg shadow-lg text-center">
             <p className="text-neutral-500">No bookings scheduled for {selectedDate.toLocaleDateString()}.</p>
           </div>
         )}

      </div>
      <div className="lg:col-span-1">
        <BookingForm selectedDate={selectedDate} onBookingSubmit={handleBookingSubmit} />
      </div>
    </div>
  );
};

export default BookingsPage;
