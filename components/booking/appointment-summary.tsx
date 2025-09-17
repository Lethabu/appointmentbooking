'use client';

import type { Service } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, User, Phone } from 'lucide-react';

interface AppointmentSummaryProps {
  selectedServices: Service[];
  formData: {
    full_name: string;
    phone_number: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export function AppointmentSummary({
  selectedServices,
  formData,
  onFormChange,
  onSubmit,
}: AppointmentSummaryProps) {
  const totalPrice = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0,
  );

  const isFormValid =
    selectedServices.length > 0 &&
    formData.full_name.trim() !== '' &&
    formData.phone_number.trim() !== '';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Your Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Services */}
        <div>
          <h4 className="font-medium mb-3">Selected Services</h4>
          {selectedServices.length === 0 ? (
            <p className="text-gray-500 text-sm">No services selected</p>
          ) : (
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700">{service.name}</span>
                  <span className="font-medium">R {service.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedServices.length > 0 && (
          <>
            <Separator />

            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Total Duration</span>
                </div>
                <span className="font-medium">{totalDuration} min</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Total Price</span>
                </div>
                <span className="font-bold text-lg">R {totalPrice}</span>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Contact Form */}
        <div className="space-y-4">
          <h4 className="font-medium">Contact Information</h4>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => onFormChange('full_name', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={(e) => onFormChange('phone_number', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={!isFormValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          size="lg"
        >
          Request My Booking
        </Button>

        {!isFormValid && (
          <p className="text-xs text-gray-500 text-center">
            Please select at least one service and fill in your contact details
          </p>
        )}
      </CardContent>
    </Card>
  );
}
