'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/ssr';
import StatCard from './StatCard';

const TimeframeSelector = ({ timeframe, setTimeframe }) => {
  const options = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_year', label: 'This Year' },
  ];

  return (
    <div className="flex justify-end mb-4">
      <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm">
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
};

export default function DashboardOverview({ salonId }) {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('this_month');

  const fetchStats = useCallback(async () => {
    if (!salonId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('get_salon_stats', {
        p_salon_id: salonId,
        p_timeframe: timeframe,
      });

      if (rpcError) throw rpcError;
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Could not load salon statistics.");
    } finally {
      setLoading(false);
    }
  }, [supabase, salonId, timeframe]);


  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Bookings" value={stats?.total_bookings} />
        <StatCard title="Total Revenue" value={stats?.revenue} formatAsCurrency />
        <StatCard title="Upcoming Appointments" value={stats?.upcoming} />
      </div>
    </>
  );
}