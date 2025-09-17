import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { IconCalendar, IconChat, IconSparkles } from './icons';
import { api } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';

const DashboardPage: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    number | null
  >(null);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [host, setHost] = useState('');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const { tenant } = useTenant(host || 'localhost'); // Assuming subdomain from VERCEL_URL or localhost

  useEffect(() => {
    const fetchData = async () => {
      if (tenant?.id) {
        try {
          // Fetch upcoming appointments
          const today = new Date().toISOString().split('T')[0];
          const upcoming = await api.getAppointments(tenant.id, {
            date: today,
            status: 'PENDING',
          });
          setUpcomingAppointments(upcoming.length);

          // Fetch recent activity (e.g., last 5 appointments)
          const allAppointments = await api.getAppointments(tenant.id);
          const sortedAppointments = allAppointments.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          const latestAppointments = sortedAppointments.slice(0, 5);

          const activityMessages = latestAppointments.map(
            (app) =>
              `New booking: ${app.client_name} - ${app.service_name} - ${new Date(app.datetime).toLocaleString()}`,
          );
          setRecentActivity(activityMessages);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setUpcomingAppointments(0);
          setRecentActivity(['Failed to load recent activity.']);
        }
      }
    };

    if (host) {
      fetchData();
    }
  }, [tenant, host]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">
        Welcome to Smart Salon HQ!
      </h1>
      <p className="text-neutral-600">
        Here's a quick overview of your salon's performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={
            upcomingAppointments !== null
              ? String(upcomingAppointments)
              : 'Loading...'
          }
          icon={<IconCalendar />}
          color="text-blue-500"
        />
        <StatCard
          title="AI Interactions Today"
          value="47"
          icon={<IconChat />}
          color="text-green-500"
        />
        <StatCard
          title="Growth Opportunities"
          value="3 New"
          icon={<IconSparkles />}
          color="text-purple-500"
        />
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">
          Recent Activity
        </h2>
        {/* Placeholder for recent activity feed or charts */}
        <ul className="space-y-3">
          <li className="text-neutral-600 p-3 bg-neutral-50 rounded-md">
            New booking: Jane Doe - Ladies Cut - Tomorrow @ 2 PM
          </li>
          <li className="text-neutral-600 p-3 bg-neutral-50 rounded-md">
            AI Agent 'Blaze' suggested a new promotion.
          </li>
          <li className="text-neutral-600 p-3 bg-neutral-50 rounded-md">
            Client 'Mike R.' completed their 5th visit.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
