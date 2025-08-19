'use client';
import { useState, useEffect } from 'react';

export default function InstyleDashboard() {
  const [stats, setStats] = useState({
    todays_bookings: 0,
    weekly_revenue: 0,
    total_clients: 0,
    avg_rating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard-stats?tenant_id=ccb12b4d-ade6-467d-a614-7c9d198ddc70');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instyle Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Today's Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.todays_bookings}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Weekly Revenue</h3>
            <p className="text-3xl font-bold text-green-600">R{(stats.weekly_revenue/100).toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.total_clients}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.avg_rating}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                View Appointments
              </button>
              <button className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                Manage Services
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
            <div className="h-64 bg-gray-50 rounded p-4 flex items-center justify-center">
              <p className="text-gray-500">AI Chat Widget will be integrated here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}