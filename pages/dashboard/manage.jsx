import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@clerk/nextjs';
import ChatWindow from '@/components/ai/ChatWindow';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DashboardManagePage = () => {
  const { user } = useUser();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async (tenantId) => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats', { p_tenant_id: tenantId });
      if (error) throw error;
      setDashboardStats(data[0]); // RPC returns an array, we need the first element
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchDashboardStats(user.id).finally(() => setLoading(false));

      const appointmentsSubscription = supabase
        .channel('appointments_channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'appointments' },
          (payload) => {
            // Re-fetch stats when a new appointment is inserted
            if (payload.new.tenant_id === user.id) {
              fetchDashboardStats(user.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(appointmentsSubscription);
      };
    }
  }, [user]);

  if (loading) return <div style={{ padding: '20px' }}>Loading dashboard data...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Salon Dashboard</h1>

      {dashboardStats && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Today's Bookings</h2>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{dashboardStats.todays_bookings}</p>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Weekly Revenue</h2>
            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>R{parseFloat(dashboardStats.weekly_revenue).toFixed(2)}</p>
          </div>
        </div>
      )}

      <div style={{ height: '500px', marginTop: '20px' }}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default DashboardManagePage;
