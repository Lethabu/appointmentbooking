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
