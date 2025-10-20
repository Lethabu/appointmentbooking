'use client';
import { useState } from 'react';

export default function BookingWidget({ salon }) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const services = [
    { id: 1, name: 'Middle & Side Installation', price: 1500, duration: 60 },
    { id: 2, name: 'Maphondo & Lines Installation', price: 1500, duration: 60 },
  ];

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Service
          </label>
          <select
            value={selectedService?.id || ''}
            onChange={(e) =>
              setSelectedService(
                services.find((s) => s.id === parseInt(e.target.value)),
              )
            }
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - R{service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Time</label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-2 border rounded ${
                  selectedTime === time
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!selectedService || !selectedDate || !selectedTime}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
