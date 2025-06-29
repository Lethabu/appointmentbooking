import React, { useState, useEffect } from 'react';
import { Booking, Service } from '../types';
import { MockServices, IconWhatsApp } from '../constants';

interface BookingFormProps {
  selectedDate: Date | null;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, onBookingSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(MockServices[0]?.id || '');
  const [bookingTime, setBookingTime] = useState('09:00'); // Default time
  const [clientPhone, setClientPhone] = useState('');


  useEffect(() => {
    // Reset form or update based on selectedDate if needed
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedServiceId) {
      alert('Please select a date and service.');
      return;
    }
    const service = MockServices.find(s => s.id === selectedServiceId);
    if (!service) {
      alert('Selected service not found.');
      return;
    }

    const [hours, minutes] = bookingTime.split(':').map(Number);
    const bookingDateTime = new Date(selectedDate);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    onBookingSubmit({
      clientName,
      service: service.name,
      dateTime: bookingDateTime,
      clientPhone, // <-- Add this line
    });
    // Reset form (optional)
    setClientName('');
    setSelectedServiceId(MockServices[0]?.id || '');
    setBookingTime('09:00');
    setClientPhone('');
  };
  
  const handleSimulateWhatsAppReminder = () => {
    if (!clientPhone) {
        alert("Please enter a client phone number to simulate WhatsApp reminder.");
        return;
    }
    alert(`(Simulated) WhatsApp reminder would be sent to ${clientPhone} for this booking if it were confirmed.`);
  };

  const availableTimes = Array.from({ length: 18 }, (_, i) => { // 9 AM to 5:30 PM in 30 min intervals
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">
        {selectedDate ? `Book for ${selectedDate.toLocaleDateString()}` : 'Select a date to book'}
      </h3>
      
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-neutral-700">Client Name</label>
        <input
          type="text"
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
          disabled={!selectedDate}
        />
      </div>

       <div>
        <label htmlFor="clientPhone" className="block text-sm font-medium text-neutral-700">Client Phone (for reminders)</label>
        <input
          type="tel"
          id="clientPhone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="e.g., +27821234567"
          className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          disabled={!selectedDate}
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-neutral-700">Service</label>
        <select
          id="service"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
          required
          disabled={!selectedDate}
        >
          {MockServices.map(service => (
            <option key={service.id} value={service.id}>{service.name} - {service.durationMinutes}min (R{service.price})</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bookingTime" className="block text-sm font-medium text-neutral-700">Time</label>
        <select
          id="bookingTime"
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
          required
          disabled={!selectedDate}
        >
          {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
        </select>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2">
        <button
            type="submit"
            disabled={!selectedDate}
            className="w-full sm:w-auto flex-grow justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
        >
            Add Booking
        </button>
        <button
            type="button"
            onClick={handleSimulateWhatsAppReminder}
            disabled={!selectedDate || !clientPhone}
            className="w-full sm:w-auto flex-grow justify-center py-2 px-4 border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light disabled:opacity-50 flex items-center space-x-2"
        >
            <IconWhatsApp className="h-5 w-5" />
            <span>Simulate Reminder</span>
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
