import React, { useState, useEffect } from 'react';
import { Booking, Service } from './types';
import { IconChat } from './icons/index';

interface BookingFormProps {
  selectedDate: Date | null;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status'>) => Promise<void>;
  salonId: string; // Add salonId prop
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, onBookingSubmit, salonId }) => {
  const [clientName, setClientName] = useState('');
  const [services, setServices] = useState<Service[]>([]); // State to store fetched services
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [bookingTime, setBookingTime] = useState(''); // Initialize with empty string
  const [clientPhone, setClientPhone] = useState('');
  const [recurrenceRule, setRecurrenceRule] = useState<string>('none'); // 'none', 'daily', 'weekly', 'monthly'
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; staff_id: string }[]>([]); // State to store available slots with staff_id

  useEffect(() => {
    const fetchServices = async () => {
      if (!salonId) return;
      try {
        const response = await fetch(`/api/services?salon_id=${salonId}`);
        if (!response.ok) {
          throw new Error(`Error fetching services: ${response.statusText}`);
        }
        const data: Service[] = await response.json();
        setServices(data);
        if (data.length > 0) {
          setSelectedServiceId(data[0].id); // Select the first service by default
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // Handle error (e.g., display a message to the user)
      }
    };

    fetchServices();
  }, [salonId]); // Re-fetch services when salonId changes

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !salonId || !selectedServiceId) {
        setAvailableSlots([]);
        return;
      }
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const response = await fetch(`/api/availability?salon_id=${salonId}&service_id=${selectedServiceId}&date=${formattedDate}`);
        if (!response.ok) {
          throw new Error(`Error fetching available slots: ${response.statusText}`);
        }
        const data: { available_slots: { time: string; staff_id: string }[] } = await response.json();
        setAvailableSlots(data.available_slots);
        if (data.available_slots.length > 0) {
          setBookingTime(new Date(data.available_slots[0].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setBookingTime('');
        }
      } catch (error) {
        console.error("Failed to fetch available slots:", error);
        setAvailableSlots([]);
        setBookingTime('');
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, salonId, selectedServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedServiceId || !bookingTime) {
      alert('Please select a date, service, and time.');
      return;
    }
    const service = services.find(s => s.id === selectedServiceId);
    if (!service) {
      alert('Selected service not found.');
      return;
    }

    const selectedSlot = availableSlots.find(slot => new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === bookingTime);
    if (!selectedSlot) {
      alert('Selected time slot is invalid.');
      return;
    }

    const bookingDateTime = new Date(selectedSlot.time);

    try {
      if (recurrenceRule !== 'none') {
        // Handle recurring appointment submission
        const response = await fetch('/api/recurring-appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseAppointment: {
              salon_id: salonId,
              service_id: selectedServiceId,
              scheduled_time: bookingDateTime.toISOString(),
              client_name: clientName,
              client_phone: clientPhone,
              staff_id: selectedSlot.staff_id,
            },
            recurrenceRule,
            endDate: recurrenceEndDate,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create recurring appointments.');
        }
        alert('Recurring appointments created successfully!');
      } else {
        // Handle single appointment submission
        await onBookingSubmit({
          clientName,
          service,
          scheduled_time: bookingDateTime,
          clientPhone,
          staffId: selectedSlot.staff_id,
        });
        alert('Appointment booked successfully!');
      }

      // Reset form (optional)
      setClientName('');
      setSelectedServiceId(services[0]?.id || '');
      setBookingTime('');
      setClientPhone('');
      setRecurrenceRule('none');
      setRecurrenceEndDate('');
    } catch (error) {
      console.error("Booking submission failed:", error);
      // Handle error appropriately, e.g., display an error message to the user.
    }
  };

  const handleSimulateWhatsAppReminder = () => {
    if (!clientPhone) {
      alert("Please enter a client phone number to simulate WhatsApp reminder.");
      return;
    }
    alert(`(Simulated) WhatsApp reminder would be sent to ${clientPhone} for this booking if it were confirmed.`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">
        {selectedDate ? `Book for ${selectedDate.toLocaleDateString()}` : 'Select a date to book'}
      </h3>
     
      
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
      

      
        <label htmlFor="service" className="block text-sm font-medium text-neutral-700">Service</label>
        <select
          id="service"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
          required
          disabled={!selectedDate || services.length === 0}
        >
          {services.length > 0 ? (
            services.map(service => (
              <option key={service.id} value={service.id}>{service.name} - {service.duration_minutes}min (R{service.price})</option>
            ))
          ) : (
            <option value="">Loading services...</option>
          )}
        </select>
      

      
        <label htmlFor="bookingTime" className="block text-sm font-medium text-neutral-700">Time</label>
        <select
          id="bookingTime"
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
          required
          disabled={!selectedDate || availableSlots.length === 0}
        >
          {availableSlots.length > 0 ? (
            availableSlots.map(slot => (
              <option key={slot.time + slot.staff_id} value={new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}>
                {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Staff: {slot.staff_id})
              </option>
            ))
          ) : (
            <option value="">No slots available</option>
          )}
        </select>
      

      <label htmlFor="recurrenceRule" className="block text-sm font-medium text-neutral-700">Recurrence</label>
      <select
        id="recurrenceRule"
        value={recurrenceRule}
        onChange={(e) => setRecurrenceRule(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
        disabled={!selectedDate}
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      {recurrenceRule !== 'none' && (
        <div className="mt-4">
          <label htmlFor="recurrenceEndDate" className="block text-sm font-medium text-neutral-700">Recurrence End Date</label>
          <input
            type="date"
            id="recurrenceEndDate"
            value={recurrenceEndDate}
            onChange={(e) => setRecurrenceEndDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2 ">
        <button className="w-full sm:w-auto flex-grow justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
            type="submit"
            disabled={!selectedDate || availableSlots.length === 0}
        >
            Add Booking
        </button>
        <button
            type="button"
            onClick={handleSimulateWhatsAppReminder}
            disabled={!selectedDate || !clientPhone}
            className="w-full sm:w-auto flex-grow justify-center py-2 px-4 border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light disabled:opacity-50 flex items-center space-x-2"
        >
            <IconChat />
            <span>Simulate Reminder</span>
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
