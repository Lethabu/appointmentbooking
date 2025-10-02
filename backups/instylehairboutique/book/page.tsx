'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const services = {
  'middle-side-install': { name: 'Middle & Side Installation', price: 'R300', duration: '60 min' },
  'maphondo-lines': { name: 'Maphondo & Lines Installation', price: 'R350', duration: '90 min' },
  'hair-treatment': { name: 'Deep Hair Treatment', price: 'R250', duration: '45 min' },
  'gel-maphondo': { name: 'Gel Maphondo Styling', price: 'R350', duration: '60 min' },
  'frontal-ponytail': { name: 'Frontal Ponytail Installation', price: 'R950', duration: '2.5 hours' },
  'soft-glam-makeup': { name: 'Soft Glam Makeup', price: 'R450', duration: '90 min' },
  'wash-blowdry': { name: 'Wash & Blow Dry', price: 'R180', duration: '45 min' },
  'braids-cornrows': { name: 'Braids & Cornrows', price: 'R400', duration: '2 hours' },
  'wig-install': { name: 'Wig Installation & Styling', price: 'R650', duration: '2 hours' },
};

export default function BookInstylePage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams?.get('service');
  const selectedService = serviceId ? services[serviceId as keyof typeof services] : null;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load SuperSaaS booking widget
    const script = document.createElement('script');
    script.src = 'https://www.supersaas.com/js/booking.js';
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-gray-600">
              Schedule your appointment with InStyle Hair Boutique
            </p>
          </div>

          {selectedService && (
            <Card className="mb-8 border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-purple-600">Selected Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                    <p className="text-gray-600">Duration: {selectedService.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{selectedService.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading booking calendar...</p>
              </div>
            ) : (
              <div className="supersaas-booking-widget">
                <iframe
                  src={`https://www.supersaas.com/schedule/instyle/Hair_Appointments${selectedService ? `?service=${encodeURIComponent(selectedService.name)}` : ''}`}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  className="rounded-lg"
                  title="InStyle Hair Boutique Booking"
                ></iframe>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/instylehairboutique/services">View All Services</Link>
              </Button>
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/instylehairboutique">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
