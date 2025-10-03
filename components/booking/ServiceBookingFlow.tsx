'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    id: 'service_1',
    name: 'Middle & Side Installation',
    price_cents: 45000, // R450
    duration: 60,
<<<<<<< HEAD
    description: 'Professional installation of middle and side part weaves',
  },
  {
    id: 'service_2',
    name: 'Maphondo & Lines Installation',
    price_cents: 60000, // R600
    duration: 90,
    description: 'Intricate Maphondo and lines installation',
=======
    description: 'Professional installation of middle and side part weaves'
  },
  {
    id: 'service_2',
    name: 'Maphondo & Lines Installation', 
    price_cents: 60000, // R600
    duration: 90,
    description: 'Intricate Maphondo and lines installation'
>>>>>>> origin/feat/instyle-whitelabel
  },
  {
    id: 'service_3',
    name: 'Hair Treatment',
    price_cents: 25000, // R250
    duration: 30,
<<<<<<< HEAD
    description: 'Rejuvenating hair treatment for healthy hair',
  },
=======
    description: 'Rejuvenating hair treatment for healthy hair'
  }
>>>>>>> origin/feat/instyle-whitelabel
];

export default function ServiceBookingFlow() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>({
    name: '',
    email: '',
<<<<<<< HEAD
    phone: '',
=======
    phone: ''
>>>>>>> origin/feat/instyle-whitelabel
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (cents: number) => `R${(cents / 100).toFixed(0)}`;

  interface Service {
    id: string;
    name: string;
    price_cents: number;
    duration: number;
    description: string;
  }

  const handleBookingPayment = async () => {
<<<<<<< HEAD
    if (
      !selectedService ||
      !customerDetails.name ||
      !customerDetails.email ||
      !selectedDate ||
      !selectedTime
    ) {
=======
    if (!selectedService || !customerDetails.name || !customerDetails.email || !selectedDate || !selectedTime) {
>>>>>>> origin/feat/instyle-whitelabel
      alert('Please fill in all details');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/paystack/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedService.price_cents,
          email: customerDetails.email,
          phone: customerDetails.phone,
<<<<<<< HEAD
          items: [
            {
              id: selectedService.id,
              name: selectedService.name,
              price_cents: selectedService.price_cents,
              quantity: 1,
              type: 'service',
            },
          ],
=======
          items: [{
            id: selectedService.id,
            name: selectedService.name,
            price_cents: selectedService.price_cents,
            quantity: 1,
            type: 'service'
          }],
>>>>>>> origin/feat/instyle-whitelabel
          tenantId: 'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
          bookingDetails: {
            service_id: selectedService.id,
            customer: customerDetails,
            date: selectedDate,
<<<<<<< HEAD
            time: selectedTime,
          },
=======
            time: selectedTime
          }
>>>>>>> origin/feat/instyle-whitelabel
        }),
      });

      const data = await response.json();
<<<<<<< HEAD

=======
      
>>>>>>> origin/feat/instyle-whitelabel
      if (data.url) {
        // Redirect to PayStack
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Booking payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold text-purple-600">
          Book Your Service
        </h1>
        <p className="text-gray-600">
          Choose a service and pay securely with PayStack
        </p>
=======
        <h1 className="text-3xl font-bold text-purple-600">Book Your Service</h1>
        <p className="text-gray-600">Choose a service and pay securely with PayStack</p>
>>>>>>> origin/feat/instyle-whitelabel
      </div>

      {/* Service Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
<<<<<<< HEAD
                selectedService?.id === service.id
                  ? 'border-purple-500 bg-purple-50'
=======
                selectedService?.id === service.id 
                  ? 'border-purple-500 bg-purple-50' 
>>>>>>> origin/feat/instyle-whitelabel
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedService(service)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <Badge variant="outline">{service.duration} minutes</Badge>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-600">
                    {formatPrice(service.price_cents)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Customer Details */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>2. Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              value={customerDetails.name}
<<<<<<< HEAD
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
=======
              onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
>>>>>>> origin/feat/instyle-whitelabel
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={customerDetails.email}
<<<<<<< HEAD
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  email: e.target.value,
                })
              }
=======
              onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
>>>>>>> origin/feat/instyle-whitelabel
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={customerDetails.phone}
<<<<<<< HEAD
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  phone: e.target.value,
                })
              }
=======
              onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
>>>>>>> origin/feat/instyle-whitelabel
            />
          </CardContent>
        </Card>
      )}

      {/* Date & Time Selection */}
      {selectedService && customerDetails.name && (
        <Card>
          <CardHeader>
            <CardTitle>3. Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <select
              className="w-full p-2 border rounded-md"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      {selectedService && selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>4. Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
<<<<<<< HEAD
                <span className="text-purple-600">
                  {formatPrice(selectedService.price_cents)}
                </span>
              </div>
            </div>

            <Button
=======
                <span className="text-purple-600">{formatPrice(selectedService.price_cents)}</span>
              </div>
            </div>
            
            <Button 
>>>>>>> origin/feat/instyle-whitelabel
              onClick={handleBookingPayment}
              disabled={isProcessing}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
<<<<<<< HEAD
              {isProcessing
                ? 'Processing...'
                : `Pay ${formatPrice(selectedService.price_cents)} with PayStack`}
=======
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(selectedService.price_cents)} with PayStack`}
>>>>>>> origin/feat/instyle-whitelabel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/feat/instyle-whitelabel
