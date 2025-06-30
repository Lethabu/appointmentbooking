"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabaseClient";
import { subscribeToAppointments } from "@/app/utils/realtime";

export default function RecentBookings({ salonId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("appointments")
        .select("id, scheduled_time, services(name), profiles(full_name)")
        .eq("salon_id", salonId)
        .order("scheduled_time", { ascending: false })
        .limit(5);
      if (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings. Please try again.");
      } else setBookings(data || []);
      setLoading(false);
    };
    if (salonId) {
      fetchBookings();
      // Subscribe to real-time updates
      subscription = subscribeToAppointments(salonId, () => {
        fetchBookings();
      });
    }
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [salonId]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bookings.length) return <div className="text-gray-500">No recent bookings.</div>;

  return (
    <ul className="space-y-3">
      {bookings.map((b) => (
        <li key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium text-gray-900">{b.profiles?.full_name || 'Unknown Client'}</p>
            <p className="text-sm text-gray-600">{b.services?.name || 'Unknown Service'}</p>
          </div>
          <span className="text-sm text-gray-500">{new Date(b.scheduled_time).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}</span>
        </li>
      ))}
    </ul>
  );
}
