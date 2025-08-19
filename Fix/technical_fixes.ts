// 1. SUPABASE DATABASE SETUP AND FIXES

// supabase/migrations/20240101_fix_instyle_setup.sql
/*
-- First, ensure the salon exists
INSERT INTO salons (id, name, domain, created_at) 
VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'InStyle Hair Boutique',
  'instylehairboutique.co.za',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain;

-- Create missing tables
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(salon_id, key)
);

CREATE TABLE IF NOT EXISTS marketing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(100) DEFAULT 'general',
    content JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    notes TEXT,
    preferences JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings for InStyle Hair Boutique
INSERT INTO settings (salon_id, key, value) VALUES
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'business_hours',
  '{
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "17:00", "closed": false},
    "saturday": {"open": "08:00", "close": "16:00", "closed": false},
    "sunday": {"open": "10:00", "close": "15:00", "closed": false}
  }'::jsonb
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'notifications',
  '{
    "email_confirmations": true,
    "sms_reminders": true,
    "email_reminders": true,
    "reminder_hours": [24, 2]
  }'::jsonb
),
(
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'booking_rules',
  '{
    "advance_booking_days": 30,
    "min_booking_notice_hours": 2,
    "max_daily_bookings": 20,
    "allow_online_cancellation": true,
    "cancellation_notice_hours": 24
  }'::jsonb
) ON CONFLICT (salon_id, key) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "salon_settings_access" ON settings
  FOR ALL USING (salon_id::text = auth.jwt() ->> 'salon_id');

CREATE POLICY "salon_marketing_access" ON marketing
  FOR ALL USING (salon_id::text = auth.jwt() ->> 'salon_id');

CREATE POLICY "salon_clients_access" ON clients
  FOR ALL USING (salon_id::text = auth.jwt() ->> 'salon_id');

-- Fix appointments table if needed
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS salon_id UUID REFERENCES salons(id),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Update existing appointments to have salon_id
UPDATE appointments 
SET salon_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
WHERE salon_id IS NULL;
*/

// 2. API ROUTES FIXES

// app/api/dashboard/services/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id') || 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    console.log(`Fetching services for salon: ${salonId}`);

    const { data: services, error } = await supabase
      .from('services')
      .select(`
        id,
        name,
        description,
        duration_minutes,
        price_cents,
        category,
        is_active,
        created_at
      `)
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch services', 
          details: error.message,
          services: [] 
        },
        { status: 500 }
      );
    }

    console.log(`Found ${services?.length || 0} services`);

    return NextResponse.json({
      success: true,
      services: services || [],
      count: services?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in services API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        services: [],
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 3. DASHBOARD COMPONENT WITH ERROR HANDLING

// components/dashboard/ServicesManager.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, Plus, Edit, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  services: Service[];
  count: number;
  error?: string;
  details?: string;
}

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchServices = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);

      const salonId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
      const response = await fetch(`/api/dashboard/services?salon_id=${salonId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error + (data.details ? ` - ${data.details}` : ''));
      }

      setServices(data.services || []);
      setRetryCount(0);
      setLastFetch(new Date());
      
      console.log(`Successfully loaded ${data.services?.length || 0} services`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to fetch services:', errorMessage);
      setError(errorMessage);

      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchServices(true);
        }, delay);
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchServices();
  }, []);

  const formatPrice = (priceCents: number): string => {
    return `R${(priceCents / 100).toFixed(2)}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  const groupedServices = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading services...</span>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Unable to load services
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            {retryCount < 3 && (
              <p className="mt-1 text-xs text-red-600">
                Retrying automatically... (attempt {retryCount + 1}/3)
              </p>
            )}
            <button
              onClick={() => {
                setRetryCount(0);
                fetchServices();
              }}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your salon services and pricing
            {lastFetch && (
              <span className="ml-2 text-xs text-gray-400">
                Last updated: {lastFetch.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchServices()}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Error Banner (if there are services but also an error) */}
      {error && services.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Warning: {error}
            </span>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {Object.keys(groupedServices).length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first service.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {category} ({categoryServices.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span className="font-medium text-green-600">
                            {formatPrice(service.price_cents)}
                          </span>
                          <span>{formatDuration(service.duration_minutes)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit service"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. BOOKING API FIX

// app/api/book/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface BookingRequest {
  clientName: string;
  email: string;
  phone: string;
  serviceId: string;
  dateTime: string;
  notes?: string;
  salonId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validate required fields
    const requiredFields = ['clientName', 'email', 'serviceId', 'dateTime', 'salonId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          missing: missingFields,
          success: false 
        },
        { status: 400 }
      );
    }

    // Validate datetime format
    const appointmentDate = new Date(body.dateTime);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format', success: false },
        { status: 400 }
      );
    }

    // Check if appointment is in the future
    if (appointmentDate <= new Date()) {
      return NextResponse.json(
        { error: 'Appointment must be in the future', success: false },
        { status: 400 }
      );
    }

    // Verify service exists and is active
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name, duration_minutes, price_cents, is_active')
      .eq('id', body.serviceId)
      .eq('salon_id', body.salonId)
      .eq('is_active', true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Service not found or inactive', success: false },
        { status: 400 }
      );
    }

    // Check for conflicts
    const endTime = new Date(appointmentDate.getTime() + service.duration_minutes * 60000);
    
    const { data: conflicts, error: conflictError } = await supabase
      .from('appointments')
      .select('id, scheduled_time, services(duration_minutes)')
      .eq('salon_id', body.salonId)
      .gte('scheduled_time', appointmentDate.toISOString())
      .lt('scheduled_time', endTime.toISOString())
      .neq('status', 'cancelled');

    if (conflictError) {
      console.error('Conflict check error:', conflictError);
      return NextResponse.json(
        { error: 'Unable to check availability', success: false },
        { status: 500 }
      );
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Time slot is not available', success: false },
        { status: 409 }
      );
    }

    // Create or get client
    let clientId: string;
    
    const { data: existingClient, error: clientFindError } = await supabase
      .from('clients')
      .select('id')
      .eq('email', body.email)
      .eq('salon_id', body.salonId)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientCreateError } = await supabase
        .from('clients')
        .insert({
          salon_id: body.salonId,
          full_name: body.clientName,
          email: body.email,
          phone: body.phone
        })
        .select('id')
        .single();

      if (clientCreateError || !newClient) {
        console.error('Client creation error:', clientCreateError);
        return NextResponse.json(
          { error: 'Failed to create client record', success: false },
          { status: 500 }
        );
      }

      clientId = newClient.id;
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        salon_id: body.salonId,
        client_id: clientId,
        service_id: body.serviceId,
        scheduled_time: appointmentDate.toISOString(),
        status: 'confirmed',
        notes: body.notes || '',
        created_at: new Date().toISOString()
      })
      .select(`
        id,
        scheduled_time,
        status,
        notes,
        clients(full_name, email, phone),
        services(name, duration_minutes, price_cents)
      `)
      .single();

    if (appointmentError || !appointment) {
      console.error('Appointment creation error:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment', success: false },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email/SMS here

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment.id,
        scheduledTime: appointment.scheduled_time,
        status: appointment.status,
        client: appointment.clients,
        service: appointment.services
      }
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 5. APPOINTMENT DASHBOARD COMPONENT

// components/dashboard/AppointmentsList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  scheduled_time: string;
  status: string;
  notes?: string;
  profiles?: {
    full_name: string;
  };
  services?: {
    name: string;
    price_cents: number;
  };
}

export const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const salonId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';
      const today = new Date().toISOString();

      const response = await fetch(
        `/api/appointments?salon_id=${salonId}&from=${today}&order=scheduled_time.asc`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAppointments(data.appointments || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments';
      console.error('Appointments fetch error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-ZA', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-ZA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-800 font-medium">Error loading appointments</span>
        </div>
        <p className="mt-1 text-sm text-red-700">{error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Upcoming Appointments ({appointments.length})
        </h2>
        <button
          onClick={fetchAppointments}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No upcoming appointments
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your schedule is clear for now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.scheduled_time);
            
            return (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {appointment.profiles?.full_name || 'Unknown Client'}
                        </span>
                      </div>
                      
                      {appointment.services && (
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">{appointment.services.name}</span>
                          <span className="ml-2 text-green-600">
                            R{(appointment.services.price_cents / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      {appointment.notes && (
                        <div className="mt-1 text-xs text-gray-500">
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 6. MAIN DASHBOARD LAYOUT

// components/dashboard/DashboardLayout.tsx
'use client';

import React from 'react';
import { ServicesManager } from './ServicesManager';
import { AppointmentsList } from './AppointmentsList';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                InStyle Hair Boutique
              </h1>
              <span className="ml-2 text-sm text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {new Date().toLocaleDateString('en-ZA', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-1">
            <AppointmentsList />
          </div>
          
          {/* Right Column - Services */}
          <div className="lg:col-span-2">
            <ServicesManager />
          </div>
        </div>
      </main>
    </div>
  );
};

// 7. ENVIRONMENT VARIABLES (.env.local)
/*
NEXT_PUBLIC_SUPABASE_URL=https://awrnkvjitzwzojaonrzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# For production
NEXT_PUBLIC_SITE_URL=https://www.instylehairboutique.co.za
NEXT_PUBLIC_APP_NAME=InStyle Hair Boutique

# Email/SMS Configuration
SENDGRID_API_KEY=your_sendgrid_key
AISENSY_API_URL=your_aisensy_api_url
AISENSY_API_KEY=your_aisensy_api_key
*/