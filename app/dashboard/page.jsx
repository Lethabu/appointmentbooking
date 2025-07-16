'use client';
import { useEffect, useState } from 'react';
import StatCard from '@/app/components/Dashboard/StatCard';
import { createClientComponentClient } from '@supabase/ssr';
import Link from 'next/link';
import RecentBookings from './RecentBookings'; // Import the RecentBookings component
import AdvancedDashboard from '@/app/components/Analytics/AdvancedDashboard';
import RealTimeAnalytics from '@/app/components/Dashboard/RealTimeAnalytics';
import AppointmentLiveView from '@/app/components/Dashboard/AppointmentLiveView';
import ServiceForm from '@/app/components/ServiceForm';
import { useRouter } from 'next/navigation';
import { getDashboardStats } from '../lib/services/dashboard';

export default function OwnerDashboard() {
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? createClientComponentClient() : null;
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [salon, setSalon] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        setLoading(false);
        return;
      }

      const userRole = session.user?.user_metadata?.role;
      if (userRole && userRole !== 'owner' && userRole !== 'admin') {
        setError('Access denied. You do not have permission to view this dashboard.');
      } else {
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('id, name')
          .eq('owner_id', session.user.id)
          .single();

        if (salonError || !salonData) {
          router.replace('/dashboard/create-salon');
          return; // Exit early on redirect
        }
        setSalon(salonData);

        try {
          const statsData = await getDashboardStats(salonData.id);
          setStats(statsData);
        } catch {
          setError('Failed to fetch stats.');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase, router]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!session && !loading) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  if (salon && stats?.totalBookings === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to your new dashboard!</h2>
        <p className="mb-6 text-gray-600">
          Get started by adding your first service, inviting staff, or sharing your booking link with
          clients.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Link href="/dashboard/appointments" className="btn">
            View Appointments
          </Link>
          <a href="/dashboard/create-salon" className="btn btn-secondary">
            Edit Salon Details
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {salon.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Bookings" value={stats?.totalBookings} />
        <StatCard title="Revenue" value={stats?.totalRevenue} formatAsCurrency={true} />
        <StatCard title="Upcoming" value={stats?.upcomingAppointments} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Bookings</h2>
        <RecentBookings salonId={salon.id} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
        <AdvancedDashboard salonId={salon.id} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Live Analytics</h2>
        <RealTimeAnalytics salonId={salon.id} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Live Appointments</h2>
        <AppointmentLiveView salonId={salon.id} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Manage Services</h2>
        <ServiceForm onServiceAdded={() => window.location.reload()} />
      </div>
    </div>
  );
}
