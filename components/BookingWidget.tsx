'use client';

import { useState, useEffect } from 'react';
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
  duration: number;
}

export default function BookingWidget() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    // Mock services for InStyle Hair Boutique
    setServices([
      { id: '1', name: 'Hair Cut & Style', price: 35000, duration: 60 },
      { id: '2', name: 'Hair Wash & Blow Dry', price: 25000, duration: 45 },
      { id: '3', name: 'Hair Extensions', price: 80000, duration: 120 },
      { id: '4', name: 'Hair Coloring', price: 65000, duration: 90 },
      { id: '5', name: 'Hair Treatment', price: 45000, duration: 75 },
      { id: '6', name: 'Bridal Hair Styling', price: 120000, duration: 150 },
    ]);
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

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
          tenantId: 'instyle-boutique',
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
        alert('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    }

    setIsBooking(false);
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
          setIsBooked(true);
          setSelectedService('');
          setSelectedDate('');
          setSelectedTime('');
          setClientInfo({ name: '', phone: '', email: '' });
        });
      },
      onClose: () => {
        alert('Payment cancelled');
      },
    });
    handler.openIframe();
  };

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ];

  const today = new Date().toISOString().split('T')[0];

  if (isBooked) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="text-green-500 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your appointment has been booked successfully. You'll receive a
            WhatsApp confirmation shortly.
          </p>
          <Button onClick={() => setIsBooked(false)} variant="outline">
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
        <form onSubmit={handleBooking} className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service">Select Service *</Label>
            <Select
              value={selectedService}
              onValueChange={setSelectedService}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R{(service.price / 100).toFixed(2)} (
                    {service.duration}min)
                  </SelectItem>
                ))}
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
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Select Time *</Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a time..." />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
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
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, phone: e.target.value })
                  }
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
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, email: e.target.value })
                }
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isBooking}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isBooking ? 'Booking...' : 'Book Appointment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
