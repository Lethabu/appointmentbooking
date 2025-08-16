// components/BookingForm.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Service {
  id: string;
  name: string;
  description: string;
  price_zar: number;
  duration_minutes: number;
}

interface BookingFormProps {
  tenantId: string;
  onBookingSuccess?: (bookingId: string) => void;
}

export default function BookingForm({ tenantId, onBookingSuccess }: BookingFormProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    service_id: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    start_time: '',
    notes: ''
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [tenantId]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services/${tenantId}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      alert('Please consent to POPIA terms before booking');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        tenant_id: tenantId,
        consent_popia: consent,
        start_time: new Date(formData.start_time).toISOString()
      };

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        alert('🎉 Booking confirmed! You will receive a WhatsApp confirmation shortly.');
        onBookingSuccess?.(booking.id);
        
        // Reset form
        setFormData({
          service_id: '',
          client_name: '',
          client_phone: '',
          client_email: '',
          start_time: '',
          notes: ''
        });
        setConsent(false);
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate time slots for today and next 30 days
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    
    for (let day = 0; day < 30; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);
      
      // Business hours: 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const slotTime = new Date(date);
          slotTime.setHours(hour, minute, 0, 0);
          
          // Only show future times
          if (slotTime > now) {
            slots.push({
              value: slotTime.toISOString().slice(0, 16),
              label: `${slotTime.toLocaleDateString('en-ZA')} ${slotTime.toLocaleTimeString('en-ZA', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}`
            });
          }
        }
      }
    }
    
    return slots.slice(0, 100); // Limit to 100 slots
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-800">Book Your Appointment</h2>
        <p className="text-gray-600 mt-2">Instyle Hair Boutique</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service *
          </label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - R{(service.price_zar / 100).toFixed(2)} ({service.duration_minutes}min)
              </option>
            ))}
          </select>
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleInputChange}
            required
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="client_phone"
            value={formData.client_phone}
            onChange={handleInputChange}
            required
            placeholder="+27 or 0..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="client_email"
            value={formData.client_email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date & Time *
          </label>
          <select
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select date and time</option>
            {timeSlots.map(slot => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any special requests or notes..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* POPIA Consent */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I consent to the processing of my personal information in accordance with the 
              <strong> Protection of Personal Information Act (POPIA)</strong>. 
              My information will be used solely for appointment booking and communication purposes.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !consent}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            loading || !consent
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>📍 Soshanguve, Pretoria</p>
        <p>📞 WhatsApp confirmations sent automatically</p>
      </div>
    </div>
  );
}

// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';

interface DashboardStats {
  todays_bookings: number;
  weekly_revenue: number;
  monthly_bookings: number;
  pending_payments: number;
}

interface DashboardProps {
  tenantId: string;
}

export function Dashboard({ tenantId }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    todays_bookings: 0,
    weekly_revenue: 0,
    monthly_bookings: 0,
    pending_payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, [tenantId]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/dashboard/${tenantId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString('en-ZA')}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Today's Bookings</p>
              <p className="text-3xl font-bold text-blue-900">{stats.todays_bookings}</p>
            </div>
            <div className="text-blue-400 text-2xl">📅</div>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Weekly Revenue</p>
              <p className="text-3xl font-bold text-green-900">
                R{stats.weekly_revenue.toFixed(2)}
              </p>
            </div>
            <div className="text-green-400 text-2xl">💰</div>
          </div>
        </div>

        {/* Monthly Bookings */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Monthly Bookings</p>
              <p className="text-3xl font-bold text-purple-900">{stats.monthly_bookings}</p>
            </div>
            <div className="text-purple-400 text-2xl">📊</div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending Payments</p>
              <p