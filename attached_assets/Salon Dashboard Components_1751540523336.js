// components/Dashboard/Overview.jsx
'use client'
import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Chart } from './Chart'

export default function DashboardOverview({ salonId }) {
  const supabase = useSupabaseClient()
  const [stats, setStats] = useState(null)
  const [timeframe, setTimeframe] = useState('this_month')

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .rpc('get_salon_stats', {
          salon_id: salonId,
          timeframe
        })
        .single()
      
      setStats(data)
    }
    
    fetchStats()
  }, [salonId, timeframe])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-600">Bookings</h3>
        <p className="text-3xl font-bold mt-2">
          {stats?.bookings || '0'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {timeframe === 'this_month' ? 'This Month' : 'Last 30 Days'}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
        <p className="text-3xl font-bold mt-2">
          R{(stats?.revenue || 0) / 100}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {timeframe === 'this_month' ? 'This Month' : 'Last 30 Days'}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-600">Products Sold</h3>
        <p className="text-3xl font-bold mt-2">
          {stats?.products_sold || '0'}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {timeframe === 'this_month' ? 'This Month' : 'Last 30 Days'}
        </p>
      </div>
      
      <div className="col-span-full">
        <Chart 
          data={stats?.chart_data || []} 
          title="Booking Trends"
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
        />
      </div>
    </div>
  )
}

// PostgreSQL RPC for stats
CREATE OR REPLACE FUNCTION get_salon_stats(salon_id uuid, timeframe text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'bookings', COUNT(DISTINCT appointments.id),
    'revenue', COALESCE(SUM(services.price), 0),
    'products_sold', COALESCE(SUM(order_items.quantity), 0),
    'chart_data', COALESCE((
      SELECT json_agg(json_build_object(
        'date', date_series::date,
        'bookings', COALESCE(booking_count, 0),
        'revenue', COALESCE(revenue, 0)
      ))
      FROM generate_series(
        CASE 
          WHEN timeframe = 'this_week' THEN date_trunc('week', CURRENT_DATE)
          WHEN timeframe = 'this_month' THEN date_trunc('month', CURRENT_DATE)
          ELSE CURRENT_DATE - interval '30 days'
        END,
        CURRENT_DATE,
        '1 day'
      ) AS date_series
      LEFT JOIN (
        SELECT 
          DATE(appointments.start_time) AS booking_date,
          COUNT(*) AS booking_count,
          SUM(services.price) AS revenue
        FROM appointments
        JOIN services ON services.id = appointments.service_id
        WHERE appointments.salon_id = salon_id
          AND appointments.status = 'completed'
          AND appointments.start_time >= 
            CASE 
              WHEN timeframe = 'this_week' THEN date_trunc('week', CURRENT_DATE)
              WHEN timeframe = 'this_month' THEN date_trunc('month', CURRENT_DATE)
              ELSE CURRENT_DATE - interval '30 days'
            END
        GROUP BY booking_date
      ) bookings ON bookings.booking_date = date_series::date
    ), '[]'::json)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;