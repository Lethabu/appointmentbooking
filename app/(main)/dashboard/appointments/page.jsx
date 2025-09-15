'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import AppointmentCard from './AppointmentCard';
import Cookies from 'js-cookie';

export default function AppointmentsPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);
      try {
        const testMode = Cookies.get('test_mode') === 'enabled';
        const testSalonId = Cookies.get('test_salon_id');

        let salonId;
        if (testMode && testSalonId) {
          salonId = testSalonId;
        } else {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            router.push('/login');
            return;
          }

          const { data: salonData, error: salonError } = await supabase
            .from('salons')
            .select('id')
            .eq('owner_id', user.id)
            .single();

          if (salonError || !salonData) {
            router.push('/dashboard/create-salon');
            return;
          }
          salonId = salonData.id;
        }

        // Fetch upcoming appointments
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('appointments')
          .select(`
            id,
            scheduled_time,
            status,
            clientEmail,
            services ( name, price_cents )
          `)
          .eq('salon_id', salonId)
          .gte('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: true });

        if (upcomingError) throw upcomingError;
        setUpcomingAppointments(upcomingData);

        // Fetch past appointments
        const { data: pastData, error: pastError } = await supabase
          .from('appointments')
          .select(`
            id,
            scheduled_time,
            status,
            clientEmail,
            services ( name, price_cents )
          `)
          .eq('salon_id', salonId)
          .lt('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: false });

        if (pastError) throw pastError;
        setPastAppointments(pastData);

      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [supabase, router]);

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your upcoming and past appointments.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingAppointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600 font-medium">No upcoming appointments.</p>
            <p className="text-sm text-gray-500 mt-1">New bookings will appear here.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">History</h2>
        {pastAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pastAppointments.map(app => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-600 font-medium">No past appointments.</p>
            <p className="text-sm text-gray-500 mt-1">Completed appointments will appear here.</p>
          </div>
        )}
      </section>
    </div>
  )
}