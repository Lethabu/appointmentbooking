'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface TimeSlot {
  time: string;
  staff_id: string;
}

type BookingState = {
  services: Service[];
  timeSlots: TimeSlot[];
  selectedService: string;
  selectedDate: string;
  selectedTime: string;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
  };
  status: 'idle' | 'loading' | 'booking' | 'booked' | 'error';
  error: string | null;
};

type BookingAction =
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_TIME_SLOTS'; payload: TimeSlot[] }
  | { type: 'SET_FIELD'; payload: { field: keyof BookingState | `clientInfo.${keyof BookingState['clientInfo']}`; value: any } }
  | { type: 'SET_STATUS'; payload: BookingState['status'] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: BookingState = {
  services: [],
  timeSlots: [],
  selectedService: '',
  selectedDate: new Date().toISOString().split('T')[0],
  selectedTime: '',
  clientInfo: { name: '', phone: '', email: '' },
  status: 'loading',
  error: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SERVICES':
      return { ...state, services: action.payload, status: 'idle' };
    case 'SET_TIME_SLOTS':
      return { ...state, timeSlots: action.payload, status: 'idle' };
    case 'SET_FIELD':
      if (action.payload.field.startsWith('clientInfo.')) {
        const field = action.payload.field.split('.')[1] as keyof BookingState['clientInfo'];
        return { ...state, clientInfo: { ...state.clientInfo, [field]: action.payload.value } };
      }
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, status: action.payload ? 'error' : 'idle' };
    case 'RESET':
      return {
        ...initialState,
        services: state.services, // Keep services loaded
        status: 'idle',
      };
    default:
      return state;
  }
}

export default function BookingWidget({ tenant, salonId }: { tenant?: string; salonId: string }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { services, timeSlots, selectedService, selectedDate, selectedTime, clientInfo, status, error } = state;
  const tenantId = 'instyle-boutique'; // This should likely come from props or context

  useEffect(() => {
    const fetchServices = async () => {
      dispatch({ type: 'SET_STATUS', payload: 'loading' });
      try {
        // Assuming a similar API structure to BookingForm.tsx
        const response = await fetch(`/api/services?salon_id=${tenantId}`);
        if (!response.ok) throw new Error('Failed to fetch services.');
        const data = await response.json();
        dispatch({ type: 'SET_SERVICES', payload: data });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'An unknown error occurred.' });
      }
    };
    fetchServices();
  }, []);

  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate || !selectedService) return;
    dispatch({ type: 'SET_STATUS', payload: 'loading' });
    try {
      const response = await fetch(`/api/availability?salon_id=${tenantId}&service_id=${selectedService}&date=${selectedDate}`);
      if (!response.ok) throw new Error('Failed to fetch time slots.');
      const data = await response.json();
      dispatch({ type: 'SET_TIME_SLOTS', payload: data.available_slots || [] });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e instanceof Error ? e.message : 'Could not load time slots.' });
    }
  }, [selectedDate, selectedService]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_STATUS', payload: 'booking' });

    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService,
          scheduledTime: `${selectedDate} ${selectedTime}`,
          clientName: clientInfo.name,
          clientPhone: clientInfo.phone,
          clientEmail: clientInfo.email,
          tenantId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Initialize Paystack payment
        const selectedServiceData = services.find(
          (s) => s.id === selectedService,
        );
        if (selectedServiceData) {
          initializePayment(result.appointmentId, selectedServiceData.price);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };

  const initializePayment = (appointmentId: string, amount: number) => {
    // @ts-ignore
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: clientInfo.email,
      amount: amount,
      currency: 'ZAR',
      callback: (response: any) => {
        // Verify payment via Cloud Function
        fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: response.reference,
            appointmentId,
          }),
        }).then(() => {
          dispatch({ type: 'SET_STATUS', payload: 'booked' });
        });
      },
      onClose: () => {
        alert('Payment cancelled');
        dispatch({ type: 'SET_STATUS', payload: 'idle' });
      },
    });
    handler.openIframe();
  };

  const today = new Date().toISOString().split('T')[0];

  if (status === 'booked') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-green-500 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your appointment has been booked successfully. You&apos;ll receive a
            WhatsApp confirmation shortly.
          </p>
          <Button onClick={() => dispatch({ type: 'RESET' })} variant="outline">
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Your Appointment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select
              value={selectedService}
              onValueChange={(value) => dispatch({ type: 'SET_FIELD', payload: { field: 'selectedService', value } })}
              required
              disabled={status === 'loading' || services.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={status === 'loading' ? 'Loading services...' : 'Choose a service...'} />
              </SelectTrigger>
              <SelectContent>
                {services.length > 0 ? (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R{(service.price / 100).toFixed(2)} ({service.duration_minutes}min)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-services" disabled>No services available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Select Date *</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'selectedDate', value: e.target.value } })}
              min={today}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Select Time *</Label>
            <Select
              value={selectedTime}
              onValueChange={(value) => dispatch({ type: 'SET_FIELD', payload: { field: 'selectedTime', value } })}
              required
              disabled={status === 'loading' || timeSlots.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={status === 'loading' ? 'Loading times...' : 'Choose a time...'} />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </SelectItem>
                  ))
                ) : (<SelectItem value="no-slots" disabled>No time slots available</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'clientInfo.name', value: e.target.value } })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'clientInfo.phone', value: e.target.value } })}
                  placeholder="+27 82 123 4567"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={clientInfo.email}
                onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'clientInfo.email', value: e.target.value } })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === 'booking' || status === 'loading'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {status === 'booking' ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
