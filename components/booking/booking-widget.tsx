<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface BookingWidgetProps {
  tenant: string;
}

export default function BookingWidget({ tenant }: BookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [service, setService] = useState('');
  const [time, setTime] = useState('');

  const availableServices = [
    { value: 'haircut', label: 'Haircut' },
    { value: 'coloring', label: 'Hair Coloring' },
    { value: 'extensions', label: 'Hair Extensions' },
    { value: 'treatment', label: 'Hair Treatment' },
  ];

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log({ tenant, date, service, time });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {availableServices.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="relative">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              initialFocus
            />
          </div>
          {date && <p className="text-sm text-gray-500 mt-1">Selected: {format(date, 'PPP')}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Book Now
        </Button>
      </form>
    </div>
  );
}
=======
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

interface BookingWidgetProps {
  tenantId: string
  services: Service[]
  branding: any
}

export function BookingWidget({ tenantId, services, branding }: BookingWidgetProps) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState('')
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleDateTimeSelect = (datetime: string) => {
    setSelectedDateTime(datetime)
    setStep(3)
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDateTime) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          serviceId: selectedService.id,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          datetime: selectedDateTime
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Redirect to payment
        window.location.href = result.paymentUrl
      } else {
        alert('Booking failed: ' + result.error)
      }
    } catch (error) {
      alert('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      <p className="text-sm text-gray-500">{service.duration} minutes</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">R{(service.price / 100).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <p className="text-sm text-gray-600">
              Service: {selectedService.name} - R{(selectedService.price / 100).toFixed(2)}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="datetime">Preferred Date & Time</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={selectedDateTime}
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => handleDateTimeSelect(selectedDateTime)}
                  disabled={!selectedDateTime}
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Customer Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  required
                />
              </div>
              
              {/* POPIA Consent */}
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                By booking this appointment, you consent to the processing of your personal data 
                in accordance with POPIA (Protection of Personal Information Act). 
                Your data will only be used for appointment management and service delivery.
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleBooking}
                  disabled={!customerData.name || !customerData.email || loading}
                  className="flex-1"
                  style={{ backgroundColor: branding.primaryColor || '#6366f1' }}
                >
                  {loading ? 'Processing...' : `Book & Pay R${(selectedService?.price || 0) / 100}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
>>>>>>> origin/feat/instyle-whitelabel
