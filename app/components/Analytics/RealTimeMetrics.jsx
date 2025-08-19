'use client';
import { useState, useEffect } from 'react';

export default function RealTimeMetrics({ tenantId = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70' }) {
  const [metrics, setMetrics] = useState({
    currentVisitors: 0,
    bookingsToday: 3,
    conversionRate: 12.5,
    revenue: 450000
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        currentVisitors: Math.max(0, prev.currentVisitors + (Math.random() > 0.6 ? 1 : -1)),
        bookingsToday: prev.bookingsToday + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Real-Time Metrics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-600">Live Visitors</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{metrics.currentVisitors}</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <span className="text-sm text-gray-600">Today's Bookings</span>
          <p className="text-2xl font-bold text-green-600">{metrics.bookingsToday}</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <span className="text-sm text-gray-600">Conversion Rate</span>
          <p className="text-2xl font-bold text-purple-600">{metrics.conversionRate}%</p>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <span className="text-sm text-gray-600">Revenue</span>
          <p className="text-2xl font-bold text-yellow-600">R{(metrics.revenue/100).toFixed(0)}</p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Recent Activity</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>New booking: Zanele L.</span>
            <span className="text-gray-500">2 min ago</span>
          </div>
          <div className="flex justify-between">
            <span>Page view: Services</span>
            <span className="text-gray-500">5 min ago</span>
          </div>
          <div className="flex justify-between">
            <span>Booking completed: Lilly R.</span>
            <span className="text-gray-500">12 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}