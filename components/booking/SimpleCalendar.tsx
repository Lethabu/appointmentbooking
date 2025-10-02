'use client';

import { useState } from 'react';

interface SimpleCalendarProps {
  salonId: string;
  serviceId: string;
  onBookingConfirmed: (data: any) => void;
  onBack: () => void;
  loading?: boolean;
}

export default function SimpleCalendar({ salonId, serviceId, onBookingConfirmed, onBack, loading }: SimpleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onBookingConfirmed({
        scheduled_time: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`),
        serviceId,
        salonId,
      });
    }
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-500">Back to Services</button>
      <h2 className="text-lg font-semibold mb-2">Select Date and Time</h2>
      <input
        type="date"
        value={selectedDate?.toISOString().split('T')[0] || ''}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="mb-4 p-2 border rounded"
      />
      <input
        type="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <button 
        onClick={handleSubmit} 
        disabled={loading || !selectedDate || !selectedTime}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </div>
  );
}