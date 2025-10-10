'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Phone, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Appointment } from '@/types';

interface AppointmentLiveViewProps {
  tenantId: string;
}

// Mock appointments data (fallback)
const mockAppointments: Appointment[] = [
  {
    id: '1',
    client_name: 'Sarah Johnson',
    client_phone: '(021) 123-4567',
    service_name: 'Signature Cut & Style',
    datetime: '2024-01-16T09:00:00',
    time: '09:00',
    status: 'confirmed',
    tenant_id: '1',
    service_id: '1',
    price: 100,
    created_at: '2024-01-16T09:00:00',
    updated_at: '2024-01-16T09:00:00',
  },
  {
    id: '2',
    client_name: 'Emma Wilson',
    client_phone: '(021) 234-5678',
    service_name: 'Full Color Transformation',
    datetime: '2024-01-16T10:30:00',
    time: '10:30',
    status: 'pending',
    tenant_id: '1',
    service_id: '1',
    price: 100,
    created_at: '2024-01-16T10:30:00',
    updated_at: '2024-01-16T10:30:00',
  },
  {
    id: '3',
    client_name: 'Lisa Chen',
    client_phone: '(021) 345-6789',
    service_name: 'Luxury Blowout',
    datetime: '2024-01-16T14:00:00',
    time: '14:00',
    status: 'confirmed',
    tenant_id: '1',
    service_id: '1',
    price: 100,
    created_at: '2024-01-16T14:00:00',
    updated_at: '2024-01-16T14:00:00',
  },
  {
    id: '4',
    client_name: 'Maria Garcia',
    client_phone: '(021) 456-7890',
    service_name: 'Keratin Treatment',
    datetime: '2024-01-17T09:30:00',
    time: '09:30',
    status: 'pending',
    tenant_id: '1',
    service_id: '1',
    price: 100,
    created_at: '2024-01-17T09:30:00',
    updated_at: '2024-01-17T09:30:00',
  },
];

export function AppointmentLiveView({ tenantId }: AppointmentLiveViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time subscription
  useEffect(() => {
    // Fetch appointments with tenant isolation
    const fetchAppointments = async () => {
      try {
        // Set tenant context for RLS
        await supabase.rpc('set_tenant_context', { p_tenant_id: tenantId });

        const { data, error } = await supabase
          .from('appointments')
          .select(
            `
            *,
            clients(name, phone),
            services(name, price)
          `,
          )
          .order('datetime', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          setAppointments(mockAppointments); // Fallback to mock data
        } else {
          setAppointments(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Set up real-time subscription
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchAppointments(); // Refresh data
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterAppointments = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.datetime);

      switch (period) {
        case 'today':
          return (
            appointmentDate >= today &&
            appointmentDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
          );
        case 'week':
          const weekStart = new Date(
            today.getTime() - today.getDay() * 24 * 60 * 60 * 1000,
          );
          const weekEnd = new Date(
            weekStart.getTime() + 7 * 24 * 60 * 60 * 1000,
          );
          return appointmentDate >= weekStart && appointmentDate < weekEnd;
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            1,
          );
          return appointmentDate >= monthStart && appointmentDate < monthEnd;
        default:
          return true;
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Live Appointments
        </CardTitle>
        <CardDescription>
          Real-time view of your upcoming appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <TabsList className="mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPeriod}>
            <div className="space-y-4">
              {filterAppointments(selectedPeriod).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mb-1" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {appointment.client_name}
                        </span>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {appointment.service_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{appointment.client_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Confirm
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}