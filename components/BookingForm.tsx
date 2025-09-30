"use client";

import React, { useEffect, useCallback, useReducer } from 'react';
import { Booking, Service } from './types';
import { IconChat } from './icons/index';

interface BookingFormProps {
  selectedDate: Date | null;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status'>) => Promise<void>;
  salonId: string; // Add salonId prop
}

interface FormState {
  clientName: string;
  clientPhone: string;
  selectedServiceId: string;
  bookingTime: string; // This will now store the ISO string of the selected slot
  recurrenceRule: string;
  recurrenceEndDate: string;
  services: Service[];
  availableSlots: { time: string; staff_id: string }[];
  isLoadingServices: boolean;
  isLoadingSlots: boolean;
  error: string | null;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<FormState, 'services' | 'availableSlots'>; payload: any }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_AVAILABLE_SLOTS'; payload: { time: string; staff_id: string }[] }
  | { type: 'FETCH_SERVICES_START' }
  | { type: 'FETCH_SLOTS_START' }
  | { type: 'FETCH_SUCCESS' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM'; payload: { services: Service[] } };

const initialState: FormState = {
  clientName: '',
  clientPhone: '',
  selectedServiceId: '',
  bookingTime: '',
  recurrenceRule: 'none',
  recurrenceEndDate: '',
  services: [],
  availableSlots: [],
  isLoadingServices: true,
  isLoadingSlots: false,
  error: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'FETCH_SERVICES_START':
      return { ...state, isLoadingServices: true, error: null };
    case 'SET_SERVICES':
      return { ...state, services: action.payload, selectedServiceId: action.payload[0]?.id || '', isLoadingServices: false };
    case 'FETCH_SLOTS_START':
      return { ...state, isLoadingSlots: true, error: null, availableSlots: [], bookingTime: '' };
    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload, bookingTime: action.payload[0]?.time || '', isLoadingSlots: false };
    case 'FETCH_SUCCESS':
      return { ...state, isLoadingServices: false, isLoadingSlots: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoadingServices: false, isLoadingSlots: false };
    case 'RESET_FORM':
      return { ...initialState, services: action.payload.services, selectedServiceId: action.payload.services[0]?.id || '', isLoadingServices: false };
    default:
      return state;
  }
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  onBookingSubmit,
  salonId,
}: BookingFormProps) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { clientName, clientPhone, selectedServiceId, bookingTime, recurrenceRule, recurrenceEndDate, services, availableSlots, isLoadingServices, isLoadingSlots, error } = state;

  const fetchServices = useCallback(async () => {
    if (!salonId) return;
    dispatch({ type: 'FETCH_SERVICES_START' });
    try {
      const response = await fetch(`/api/services?salon_id=${salonId}`);
      if (!response.ok) {
        throw new Error(`Error fetching services: ${response.statusText}`);
      }
      const data: Service[] = await response.json();
      dispatch({ type: 'SET_SERVICES', payload: data });
    } catch (err) {
      console.error('Failed to fetch services:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Could not load services. Please try again later.' });
    }
  }, [salonId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !salonId || !selectedServiceId) {
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: [] });
      return;
    }
    dispatch({ type: 'FETCH_SLOTS_START' });
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await fetch(
        `/api/availability?salon_id=${salonId}&service_id=${selectedServiceId}&date=${formattedDate}`,
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching available slots: ${response.statusText}`,
        );
      }
      const data: { available_slots: { time: string; staff_id: string }[] } =
        await response.json();
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: data.available_slots || [] });
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Could not load available time slots.' });
    }
  }, [selectedDate, salonId, selectedServiceId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedServiceId || !bookingTime) {
      alert('Please select a date, service, and time.');
      return;
    }
    const service = services.find((s) => s.id === selectedServiceId);
    if (!service) {
      alert('Selected service not found.');
      return;
    }

    const selectedSlot = availableSlots.find((slot) => slot.time === bookingTime);
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

      dispatch({ type: 'RESET_FORM', payload: { services } });
    } catch (err) {
      console.error('Booking submission failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch({ type: 'SET_ERROR', payload: `Booking failed: ${errorMessage}` });
      alert(`Booking failed. Please try again. Error: ${errorMessage}`);
    }
  };

  const handleSimulateWhatsAppReminder = () => {
    if (!clientPhone) {
      alert(
        'Please enter a client phone number to simulate WhatsApp reminder.',
      );
      return;
    }
    alert(
      `(Simulated) WhatsApp reminder would be sent to ${clientPhone} for this booking if it were confirmed.`,
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg space-y-4"
    >
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">
        {selectedDate
          ? `Book for ${selectedDate.toLocaleDateString()}`
          : 'Select a date to book'}
      </h3>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <label
        htmlFor="clientName"
        className="block text-sm font-medium text-neutral-700"
      >
        Client Name
      </label>
      <input
        type="text"
        id="clientName"
        value={clientName}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'clientName', payload: e.target.value })}
        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        required
        disabled={!selectedDate}
      />

      <label
        htmlFor="clientPhone"
        className="block text-sm font-medium text-neutral-700"
      >
        Client Phone (for reminders)
      </label>
      <input
        type="tel"
        id="clientPhone"
        value={clientPhone}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'clientPhone', payload: e.target.value })}
        placeholder="e.g., +27821234567"
        className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        disabled={!selectedDate}
      />

      <label
        htmlFor="service"
        className="block text-sm font-medium text-neutral-700"
      >
        Service
      </label>
      <select
        id="service"
        value={selectedServiceId}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'selectedServiceId', payload: e.target.value })}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
        required
        disabled={!selectedDate || isLoadingServices || services.length === 0}
      >
        {isLoadingServices ? (
          <option>Loading services...</option>
        ) : services.length > 0 ? (
          services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.duration_minutes}min (R{service.price})
            </option>
          ))
        ) : (
          <option value="">No services available</option>
        )}
      </select>

      <label
        htmlFor="bookingTime"
        className="block text-sm font-medium text-neutral-700"
      >
        Time
      </label>
      <select
        id="bookingTime"
        value={bookingTime}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'bookingTime', payload: e.target.value })}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white"
        required
        disabled={!selectedDate || isLoadingSlots || availableSlots.length === 0}
      >
        {isLoadingSlots ? (
          <option>Loading times...</option>
        ) : availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <option
              key={slot.time}
              value={slot.time}
            >
              {new Date(slot.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              (Staff: {slot.staff_id})
            </option>
          ))
        ) : (
          <option value="">No slots available</option>
        )}
      </select>

      <label
        htmlFor="recurrenceRule"
        className="block text-sm font-medium text-neutral-700"
      >
        Recurrence
      </label>
      <select
        id="recurrenceRule"
        value={recurrenceRule}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'recurrenceRule', payload: e.target.value })}
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
          <label
            htmlFor="recurrenceEndDate"
            className="block text-sm font-medium text-neutral-700"
          >
            Recurrence End Date
          </label>
          <input
            type="date"
            id="recurrenceEndDate"
            value={recurrenceEndDate}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'recurrenceEndDate', payload: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2 ">
        <button
          className="w-full sm:w-auto flex-grow justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
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
