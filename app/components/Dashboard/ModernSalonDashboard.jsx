'use client';
import { useEffect, useState } from 'react';
import { fetchAppointments, fetchDashboardStats } from '@/app/lib/api/mock';

const ModernSalonDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apps, stats] = await Promise.all([
          fetchAppointments(),
          fetchDashboardStats(),
        ]);
        setAppointments(apps);
        setStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading dashboard data...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
        <div className="flex gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm text-gray-600">Total Appointments</h3>
            <p className="text-2xl font-bold">{stats?.totalAppointments}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm text-gray-600">Monthly Revenue</h3>
            <p className="text-2xl font-bold">R{stats?.revenue}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm text-gray-600">Upcoming</h3>
            <p className="text-2xl font-bold">{stats?.upcomingBookings}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}
              >
                {appointment.status}
              </span>
              <select className="text-gray-500 text-sm">
                <option>Actions</option>
                <option>Reschedule</option>
                <option>Cancel</option>
              </select>
            </div>
            <h3 className="font-semibold text-lg">{appointment.client}</h3>
            <p className="text-gray-600">{appointment.service}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(appointment.scheduled_time).toLocaleString()}
            </p>
            <div className="mt-3 flex justify-between items-center">
              <span className="font-medium">R{appointment.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernSalonDashboard;
