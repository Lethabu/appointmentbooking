'use client';
import React, { useState } from 'react';

interface Step2DateTimeProps {
  onNext: (data: { startTime: number }) => void;
}

export const Step2_DateTime: React.FC<Step2DateTimeProps> = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleNext = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and a time.');
      return;
    }
    // For simplicity, converting to a timestamp. In a real app, you'd handle timezones carefully.
    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    const startTime = new Date(dateTimeString).getTime();
    onNext({ startTime });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Select Date & Time</h2>
      <div>
        <label
          htmlFor="booking-date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="booking-date"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="booking-time"
          className="block text-sm font-medium text-gray-700"
        >
          Time
        </label>
        <input
          type="time"
          id="booking-time"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />
      </div>
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Next: Add-ons
      </button>
    </div>
  );
};
