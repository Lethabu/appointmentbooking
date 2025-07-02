'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/ssr';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Your stats display components will go here, using the `stats` object */}
    </div>
  );
}