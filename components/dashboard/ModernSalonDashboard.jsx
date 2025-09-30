'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

export default function ModernSalonDashboard({ initialAppointments, user }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Set initial data
    setAppointments(initialAppointments);

    // Listen for real-time changes
    const channel = supabase
      .channel('realtime-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Change received!', payload);
          // Refetch or update state based on the payload
          // A simple refetch is often easiest to implement correctly
          supabase
            .from('appointments')
            .select('*, services(*), staff(*)')
            .order('start_time', { ascending: false })
            .then(({ data }) => {
              if (data) setAppointments(data);
            });
        },
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, initialAppointments]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Salon Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appt) => (
              <li key={appt.id} className="border-b py-3 last:border-none">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">
                      {appt.services.name} with {appt.staff.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: {appt.customer_name} ({appt.customer_phone})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {format(new Date(appt.start_time), 'PP')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appt.start_time), 'p')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
}
