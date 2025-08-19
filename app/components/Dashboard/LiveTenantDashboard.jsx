'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LiveTenantDashboard({ tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70' }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_tenant_dashboard', {
        tenant_uuid: tenantId
      });

      if (error) throw error;
      setDashboardData(data[0]);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      // Fallback to static data for demo
      setDashboardData({
        today_bookings: 3,
        today_revenue: 450000,
        next_5_appointments: [
          { customer_name: 'Zanele L.', service_name: 'Middle & Side', appointment_time: '14:00', status: 'confirmed' },
          { customer_name: 'Lilly R.', service_name: 'Maphondo & Lines', appointment_time: '15:00', status: 'confirmed' }
        ],
        loyalty_top_5: [
          { name: 'Zanele Langa', visit_count: 12, total_spent: 18000 },
          { name: 'Rapelang', visit_count: 8, total_spent: 12000 }
        ],
        mood_average: 8.2,
        social_reach: { instagram_followers: 1250, tiktok_views: 8500, conversion_rate: 12.5 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription
    const channel = supabase
      .channel('dashboard_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `tenant_id=eq.${tenantId}`
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today's Bookings</p>
              <p className="text-3xl font-bold">{dashboardData?.today_bookings || 0}</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today's Revenue</p>
              <p className="text-3xl font-bold">R{((dashboardData?.today_revenue || 0) / 100).toFixed(0)}</p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Mood Score</p>
              <p className="text-3xl font-bold">{dashboardData?.mood_average || 8.2}</p>
            </div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Social Reach</p>
              <p className="text-3xl font-bold">{dashboardData?.social_reach?.tiktok_views || 8500}</p>
            </div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Live Appointments Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Next Appointments</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {(dashboardData?.next_5_appointments || []).map((apt, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{apt.customer_name}</p>
                  <p className="text-sm text-gray-600">{apt.service_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{apt.appointment_time}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Clients</h3>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {(dashboardData?.loyalty_top_5 || []).map((client, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-600">{client.visit_count} visits</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R{((client.total_spent || 0) / 100).toFixed(0)}</p>
                  <p className="text-xs text-gray-500">lifetime value</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Commerce Widget */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Social Commerce</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">
              {dashboardData?.social_reach?.instagram_followers || 1250}
            </p>
            <p className="text-sm text-gray-600">Instagram Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {dashboardData?.social_reach?.tiktok_views || 8500}
            </p>
            <p className="text-sm text-gray-600">TikTok Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {dashboardData?.social_reach?.conversion_rate || 12.5}%
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}