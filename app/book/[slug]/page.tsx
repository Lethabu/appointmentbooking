'use client';

import { useState, useEffect, use } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { checkout } from '@/lib/billing';

interface BookingData {
  services: string[];
  dateTime: Date | null;
  addOns: string[];
  total: number;
}

const steps = ['Services', 'Date & Time', 'Add-ons', 'Payment'];

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>({
    services: [],
    dateTime: null,
    addOns: [],
    total: 0,
  });

  const salon = useQuery(api.tenants.getBySlug, { slug });
  const services = useQuery(api.services.list, salon?._id ? { tenantId: salon._id } : 'skip');

  const updateData = (newData: Partial<BookingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (!salon) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Book at {salon.name}</h1>
          <Progress value={(step + 1) * 25} className="max-w-md mx-auto" />
          <p className="text-gray-600 mt-2">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 0 && <Calendar className="h-5 w-5" />}
              {step === 1 && <Clock className="h-5 w-5" />}
              {step === 2 && <Badge className="h-5 w-5" />}
              {step === 3 && <CreditCard className="h-5 w-5" />}
              {steps[step]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 && <Step1Services services={services} data={data} updateData={updateData} />}
            {step === 1 && <Step2DateTime data={data} updateData={updateData} />}
            {step === 2 && <Step3AddOns data={data} updateData={updateData} />}
            {step === 3 && <Step4Payment salon={salon} data={data} />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={nextStep}
              disabled={
                (step === 0 && data.services.length === 0) ||
                (step === 1 && !data.dateTime)
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={() => console.log('Booking confirmed!')}>
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1Services({ services, data, updateData }: { services: any[] | undefined, data: BookingData, updateData: (data: Partial<BookingData>) => void }) {
  const toggleService = (serviceId: string) => {
    const newServices = data.services.includes(serviceId)
      ? data.services.filter((id: string) => id !== serviceId)
      : [...data.services, serviceId];
    
    const total = newServices.reduce((sum: number, id: string) => {
      const service = services?.find((s) => s._id === id);
      return sum + (service?.price || 0);
    }, 0);
    
    updateData({ services: newServices, total });
  };

  return (
    <div className="space-y-4">
      {services?.map((service) => (
        <Card 
          key={service._id}
          className={`cursor-pointer transition-colors ${
            data.services.includes(service._id) ? 'border-purple-500 bg-purple-50' : ''
          }`}
          onClick={() => toggleService(service._id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.duration} minutes</p>
              </div>
              <div className="text-right">
                <p className="font-bold">R{service.price}</p>
                {data.services.includes(service._id) && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-auto mt-1" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {data.total > 0 && (
        <div className="text-right font-bold text-lg">
          Total: R{data.total}
        </div>
      )}
    </div>
  );
}

function Step2DateTime({ data, updateData }: { data: BookingData, updateData: (data: Partial<BookingData>) => void }) {
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Select Date</h3>
        <input 
          type="date" 
          className="w-full p-3 border rounded-lg"
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => updateData({ dateTime: new Date(e.target.value) })}
        />
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">Select Time</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              className="h-12"
              onClick={() => {
                const [hours, minutes] = time.split(':');
                const dateTime = new Date(data.dateTime);
                dateTime.setHours(parseInt(hours), parseInt(minutes));
                updateData({ dateTime });
              }}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3AddOns({ data, updateData }: { data: BookingData, updateData: (data: Partial<BookingData>) => void }) {
  const addOns = [
    { id: 'scalp-treatment', name: 'Scalp Treatment', price: 50 },
    { id: 'hair-mask', name: 'Deep Conditioning Mask', price: 30 },
    { id: 'styling', name: 'Premium Styling', price: 40 },
  ];

  const toggleAddOn = (addOnId: string) => {
    const newAddOns = data.addOns.includes(addOnId)
      ? data.addOns.filter((id: string) => id !== addOnId)
      : [...data.addOns, addOnId];
    
    const addOnTotal = newAddOns.reduce((sum: number, id: string) => {
      const addOn = addOns.find(a => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    
    updateData({ 
      addOns: newAddOns, 
      total: data.total - (data.addOns.length * 30) + addOnTotal // Simplified calculation
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Enhance your experience with these add-ons:</p>
      
      {addOns.map((addOn) => (
        <Card 
          key={addOn.id}
          className={`cursor-pointer transition-colors ${
            data.addOns.includes(addOn.id) ? 'border-purple-500 bg-purple-50' : ''
          }`}
          onClick={() => toggleAddOn(addOn.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{addOn.name}</h3>
                <Badge className="bg-green-100 text-green-800">20% off today</Badge>
              </div>
              <div className="text-right">
                <p className="font-bold">R{addOn.price}</p>
                {data.addOns.includes(addOn.id) && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-auto mt-1" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-right font-bold text-lg">
        Total: R{data.total}
      </div>
    </div>
  );
}

function Step4Payment({ salon, data }: { salon: any, data: BookingData }) {
  const handlePayment = () => {
    checkout({
      tier: 'booking',
      tenantId: salon._id,
      email: 'customer@example.com', // This would come from auth
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Services ({data.services.length})</span>
            <span>R{data.total}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>R{data.total}</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full bg-purple-600 hover:bg-purple-700"
        onClick={handlePayment}
      >
        Pay with Paystack
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Paystack. Your card details are never stored.
      </p>
    </div>
  );
}