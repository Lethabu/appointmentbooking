"use client";
import { useEffect, useState } from "react";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";
import RecentBookings from "./RecentBookings"; // Import the RecentBookings component
import AdvancedDashboard from "../../../appointmentbooking/components/components/Analytics/AdvancedDashboard";
import RealTimeAnalytics from "../../../appointmentbooking/components/components/Dashboard/RealTimeAnalytics";
import AppointmentLiveView from "../../../appointmentbooking/components/components/Dashboard/AppointmentLiveView";
import ServiceForm from "../../../appointmentbooking/components/components/ServiceForm";

export default function OwnerDashboard() {
  const session = useSession();
  const [salon, setSalon] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session) return;
    // Only allow access if user is owner or admin
    const userRole = session.user?.user_metadata?.role;
    if (userRole && userRole !== 'owner' && userRole !== 'admin') {
      setError('Access denied. You do not have permission to view this dashboard.');
      setLoading(false);
      return;
    }
    const fetchSalonAndStats = async () => {
      setLoading(true);
      setError(null);
      // Fetch salon for current user
      const { data: salonData, error: salonError } = await supabase
        .from("salons")
        .select("id, name")
        .eq("owner_id", session.user.id)
        .single();
      if (salonError || !salonData) {
        // If no salon, redirect to onboarding
        window.location.replace('/dashboard/create-salon');
        return;
      }
      setSalon(salonData);
      // Fetch stats via RPC
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_salon_stats", { salon_id: salonData.id });
      if (statsError) {
        setError("Failed to fetch stats.");
      } else {
        setStats(statsData);
      }
      setLoading(false);
    };
    fetchSalonAndStats();
  }, [session]);

  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <Link href="/login" className="text-blue-600 underline">Go to Login</Link>
      </div>
    );
  }
  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  if (salon && stats?.total_bookings === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to your new dashboard!</h2>
        <p className="mb-6 text-gray-600">Get started by adding your first service, inviting staff, or sharing your booking link with clients.</p>
        <div className="flex flex-col gap-4 items-center">
          <a href="/dashboard" className="btn">Go to Dashboard</a>
          <a href="/dashboard/create-salon" className="btn btn-secondary">Edit Salon Details</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {salon.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500">Total Bookings</div>
          <div className="text-2xl font-bold">{stats?.total_bookings ?? 0}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">R{stats?.revenue ?? 0}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-gray-500">Upcoming</div>
          <div className="text-2xl font-bold">{stats?.upcoming ?? 0}</div>
        </div>
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
