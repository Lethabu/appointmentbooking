// tenant-wrapper/components/BookingWidget.tsx
'use client';

import { useState } from 'react';

const SERVICES = [
  { id: 'cut-style', name: 'Hair Cut & Style', price: 350, duration: 90 },
  { id: 'color', name: 'Hair Color', price: 650, duration: 180 },
  { id: 'lace-wig', name: 'Lace Wig Install', price: 850, duration: 240 },
  { id: 'braids', name: 'Braids & Styling', price: 450, duration: 300 }
];

export function BookingWidget({ tenantId }: { tenantId: string }) {
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      alert('Booking failed. Please call us at +27 11 123 4567');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Submitted!</h2>
        <p className="text-gray-600">We'll contact you within 2 hours to confirm your appointment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Service
        </label>
        <select
          value={formData.service}
          onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          <option value="">Choose a service...</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - R{service.price} ({service.duration}min)
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <select
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select time...</option>
            {Array.from({ length: 10 }, (_, i) => {
              const hour = 9 + i;
              const time = `${hour.toString().padStart(2, '0')}:00`;
              return (
                <option key={time} value={time}>
                  {hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? 'Submitting...' : 'Book Appointment'}
      </button>
    </form>
  );
}
