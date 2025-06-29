'use client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

function StatCard({ title, value, change, isCurrency }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-semibold mt-1 ${isCurrency ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
      {change !== undefined && change !== null && (
        <p className={`text-xs mt-1 ${parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {parseFloat(change) >= 0 ? '+' : ''}{change}{parseFloat(change) >= 0 ? '%' : ''} vs last period
        </p>
      )}
    </div>
  );
}

export default function DashboardStats() {
  const supabase = useSupabaseClient();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: rpcError } = await supabase
          .rpc('get_platform_stats')
          .single();
        if (rpcError) throw rpcError;
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [supabase]);

  if (loading) return <div className="text-center p-4">Loading platform stats...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!stats) return <div className="text-center p-4">No stats data available.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Active Salons" value={stats.active_salons ?? 'N/A'} change={stats.salon_growth ?? null} />
      <StatCard title="Monthly Revenue (MRR)" value={stats.mrr !== null && stats.mrr !== undefined ? `R${(stats.mrr / 100).toFixed(2)}` : 'N/A'} isCurrency />
      <StatCard title="Total Bookings (Last 30d)" value={stats.total_bookings ?? 'N/A'} change={stats.booking_growth ?? null} />
      <StatCard title="Booking Conversion Rate" value={stats.conversion_rate !== null && stats.conversion_rate !== undefined ? `${parseFloat(stats.conversion_rate).toFixed(1)}%` : 'N/A'} />
    </div>
  );
}
