import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ModernSalonDashboard from '../../../components/Dashboard/ModernSalonDashboard';

async function getDashboardData() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Example: Fetch initial appointments and revenue data
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('*, services(*), staff(*)')
    .order('start_time', { ascending: false });

  // Handle errors appropriately
  if (appointmentsError)
    console.error('Error fetching appointments:', appointmentsError);

  return { initialAppointments: appointments || [], user: session.user };
}

export default async function SalonDashboardPage() {
  const { initialAppointments, user } = await getDashboardData();
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernSalonDashboard
        initialAppointments={initialAppointments}
        user={user}
      />
    </div>
  );
}
