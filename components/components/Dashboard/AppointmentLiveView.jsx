"use client";
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function AppointmentLiveView({ salonId }) {
  const supabase = useSupabaseClient();
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initial fetch
    const fetchAppointments = async () => {
      const { data } = await supabase
        .from('appointments')
        .select(`
          id, start_time, end_time, status,
          client_name, client_phone,
          service_id, staff_id
        `)
        .eq('salon_id', salonId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      setAppointments(data || []);
    };
    fetchAppointments();
    // Realtime updates
    const channel = supabase
      .channel('appointments')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `salon_id=eq.${salonId}`
      }, (payload) => {
        setAppointments(current => {
          const existing = current.find(a => a.id === payload.new.id);
          if (existing) {
            return current.map(a => a.id === payload.new.id ? payload.new : a);
          } else {
            return [...current, payload.new].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
          }
        });
      })
      .subscribe();
    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      channel.unsubscribe();
      clearInterval(timer);
    };
  }, [salonId]);

  return (
    <div className="space-y-4">
      {appointments.map(app => (
        <div key={app.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">{app.client_name}</div>
            <div className="text-gray-500 text-sm">{new Date(app.start_time).toLocaleString()} - {new Date(app.end_time).toLocaleTimeString()}</div>
            <div className="text-gray-500 text-sm">Service: {app.service_id}</div>
            <div className="text-gray-500 text-sm">Status: {app.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
