"use client";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// You must implement RealtimeChart or use your preferred chart library
// const RealtimeChart = dynamic(() => import('./RealtimeChart'), { ssr: false });

export default function RealTimeAnalytics({ salonId }) {
  const supabase = useSupabaseClient();
  const [metrics, setMetrics] = useState({
    currentVisitors: 0,
    bookingsToday: 0,
    conversionRate: 0,
    revenue: 0
  });
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // 1. Initial metrics
    const fetchMetrics = async () => {
      const { data } = await supabase
        .rpc('get_realtime_metrics', { salon_id: salonId });
      setMetrics(data);
    };
    fetchMetrics();

    // 2. Realtime subscription
    const channel = supabase
      .channel('realtime-analytics')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analytics_events',
        filter: `salon_id=eq.${salonId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTimelineData(prev => [
            ...prev.slice(-59),
            {
              time: new Date().toISOString(),
              value: payload.new.event_type === 'booking' ? 1 : 0
            }
          ]);
          setMetrics(prev => ({
            ...prev,
            currentVisitors: payload.new.event_type === 'visit'
              ? prev.currentVisitors + 1
              : prev.currentVisitors,
            bookingsToday: payload.new.event_type === 'booking'
              ? prev.bookingsToday + 1
              : prev.bookingsToday,
            revenue: payload.new.event_type === 'purchase'
              ? prev.revenue + payload.new.value
              : prev.revenue
          }));
        }
      })
      .subscribe();

    // 3. Simulate visitor activity
    const visitorInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        currentVisitors: Math.max(0, prev.currentVisitors + (Math.random() > 0.7 ? 1 : -1))
      }));
    }, 5000);

    return () => {
      channel.unsubscribe();
      clearInterval(visitorInterval);
    };
  }, [salonId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Current Visitors</h3>
        <p className="text-3xl font-bold mt-2">{metrics.currentVisitors}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Bookings Today</h3>
        <p className="text-3xl font-bold mt-2">{metrics.bookingsToday}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Conversion Rate</h3>
        <p className="text-3xl font-bold mt-2">{metrics.conversionRate?.toFixed(1) ?? 0}%</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Revenue</h3>
        <p className="text-3xl font-bold mt-2">R{(metrics.revenue / 100).toFixed(2)}</p>
      </div>
      {/* <div className="col-span-full">
        <RealtimeChart data={timelineData} />
      </div> */}
    </div>
  );
}
