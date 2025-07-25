// pages/book/instylehairboutique.js

import React, { useState } from 'react';

const InstyleBookingPage = () => {
  const [bookingStatus, setBookingStatus] = useState(null);

  const handleBookNow = async () => {
    setBookingStatus('loading');
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salon_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Placeholder salon_id
          client_id: 'some-client-uuid', // Placeholder client_id
          service_id: 'some-service-uuid', // Placeholder service_id
          scheduled_time: new Date().toISOString(), // Current time as example
          status: 'pending',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingStatus('success');
        console.log('Booking successful:', data);
      } else {
        const errorData = await response.json();
        setBookingStatus('error');
        console.error('Booking failed:', errorData);
      }
    } catch (error) {
      setBookingStatus('error');
      console.error('Network error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Book Your Appointment at Instyle Hair Boutique</h1>
      <p>Click the button below to request your booking.</p>
      <button
        onClick={handleBookNow}
        disabled={bookingStatus === 'loading'}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: bookingStatus === 'success' ? '#4CAF50' : (bookingStatus === 'error' ? '#f44336' : '#008CBA'),
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {bookingStatus === 'loading' ? 'Requesting Booking...' : 'Request My Booking'}
      </button>
      {bookingStatus === 'success' && <p style={{ color: 'green' }}>Booking requested successfully!</p>}
      {bookingStatus === 'error' && <p style={{ color: 'red' }}>Failed to request booking. Please try again.</p>}
    </div>
  );
};

export default InstyleBookingPage;
