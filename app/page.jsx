'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimpleCalendar from '../components/SimpleCalendar';
import BookingForm from '../components/BookingForm';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const salonId = 'instyle-hair-boutique'; // This should be dynamic in a real app

  const handleBookingSubmit = async (bookingDetails) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingDetails, salon_id: salonId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment.');
      }

      setSuccess('Appointment booked successfully! You will receive a confirmation shortly.');
      return await response.json();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Book Your Appointment
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Select a date and time that works for you.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 text-center text-red-800 bg-red-100 border border-red-200 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-8 p-4 text-center text-green-800 bg-green-100 border border-green-200 rounded-lg">
              <p>{success}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <SimpleCalendar 
                onDateSelect={setSelectedDate} 
                selectedDate={selectedDate} 
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <BookingForm 
                selectedDate={selectedDate}
                onBookingSubmit={handleBookingSubmit}
                salonId={salonId}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}