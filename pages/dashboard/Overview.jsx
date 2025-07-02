
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
// import { Chart } from './Chart'; // Uncomment if Chart is needed

export default function DashboardOverview({ salonId }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState('this_month');

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      // We need to get the salon_id associated with the current owner
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (salonError) throw salonError;
      if (!salonData) throw new Error("Salon not found for this user.");

      const { data, error } = await supabase.rpc('get_salon_stats', {
        p_salon_id: salonData.id, // Use a prefixed parameter name
        p_timeframe: timeframe,
      });

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }, [supabase, user, timeframe]);


  useEffect(() => {
    fetchStats();
  }, [fetchStats]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Add your content/components here */}
    </div>
  );
}


