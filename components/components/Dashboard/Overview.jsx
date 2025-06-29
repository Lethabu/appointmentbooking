'use client';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Chart from './Chart';

export default function Overview() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('this_month');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Call the Supabase RPC function to get stats
    supabase.rpc('get_salon_stats', { timeframe })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to fetch stats:', error);
          setStats(null);
        } else {
          setStats(data);
        }
        setLoading(false);
      });
  }, [user, supabase, timeframe]);

  if (!user) return <div>Please log in to view your dashboard.</div>;
  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Salon Overview</h2>
      <Chart
        data={stats?.chart_data || []}
        title="Bookings Over Time"
        timeframe={timeframe}
        onChangeTimeframe={setTimeframe}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">{stats?.total_bookings ?? '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">R {stats?.total_revenue?.toLocaleString() ?? '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">New Clients</h3>
          <p className="text-3xl font-bold">{stats?.new_clients ?? '-'}</p>
        </div>
      </div>
    </div>
  );
}
