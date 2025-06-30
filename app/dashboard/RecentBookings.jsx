"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { subscribeToAppointments } from "../utils/realtime";

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
        .select("id, user_id, start_time, service_id, services(name), profiles(full_name)")
        .leftJoin("profiles", "user_id", "profiles.id")
        .eq("salon_id", salonId)
        .order("start_time", { ascending: false })
        .limit(5);
      if (error) setError("Failed to load bookings");
      else setBookings(data || []);
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
    <ul>
      {bookings.map((b) => (
        <li key={b.id} className="mb-2 flex justify-between items-center">
          <span>{b.profiles?.full_name || b.user_id} ({b.services?.name || b.service_id})</span>
          <span className="text-sm text-gray-500">{new Date(b.start_time).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
