'use client';

import React, { useState, useEffect, FC, useMemo } from 'react';
import StatCard from './StatCard';
import { IconCalendar, IconChat, IconSparkles } from './icons';
import { api } from '@/lib/api';
import { useTenant } from '@/hooks/use-tenant';
import { useQuery } from '@tanstack/react-query';

const DashboardPage: FC = () => {
  const [host, setHost] = useState('');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const { data: tenant } = useTenant(host || 'localhost');

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) {
        return { upcomingCount: 0, recentActivity: [] };
      }
      const today = new Date().toISOString().split('T')[0];
      const allAppointments = await api.getAppointments(tenant.id);

      const upcomingCount = allAppointments.filter(
        (app: { datetime: string; status: string }) => app.datetime.startsWith(today) && app.status === 'pending',
      ).length;

      const recentActivity = allAppointments
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(
          (app: { client_name: string; service_name: string; datetime: string }) => `New booking: ${app.client_name} - ${app.service_name} - ${new Date(app.datetime).toLocaleString()}`
        );

      return { upcomingCount, recentActivity };
    },
    enabled: !!tenant?.id,
  });

  const { upcomingCount, recentActivity } = useMemo(() => ({
    upcomingCount: dashboardData?.upcomingCount ?? null,
    recentActivity: dashboardData?.recentActivity ?? [],
  }), [dashboardData]);

  const displayValue = isLoading ? 'Loading...' : String(upcomingCount ?? 0);

  if (error) {
    // A simple error boundary or component would be better here
    return <div className="text-red-500">Error loading dashboard data: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800">
        Welcome to Smart Salon HQ!
      </h1>
      <p className="text-neutral-600">
        Here&apos;s a quick overview of your salon&apos;s performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={displayValue}
          icon={<IconCalendar />}
          color="text-blue-500"
        />
        <StatCard
          title="AI Interactions Today"
          value="47" // Placeholder
          icon={<IconChat />}
          color="text-green-500"
        />
        <StatCard
          title="Growth Opportunities"
          value="3 New" // Placeholder
          icon={<IconSparkles />}
          color="text-purple-500"
        />
      </div>

      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">
          Recent Activity
        </h2>
        {isLoading ? (
          <p>Loading activity...</p>
        ) : recentActivity.length > 0 ? (
          <ul className="space-y-3">
            {recentActivity.map((activity: string, index: number) => (
              <li key={index} className="text-neutral-600 p-3 bg-neutral-50 rounded-md">
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
};

/*
Original useEffect logic for reference:

  const [upcomingAppointments, setUpcomingAppointments] = useState<
    number | null
  >(null);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (tenant && tenant.id) {
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
          setRecentActivity(activityMessages); // This would be replaced by dashboardData.recentActivity
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setUpcomingAppointments(0);
          setRecentActivity(['Failed to load recent activity.']);
        }
      }
    };
    fetchData();
  }, [tenant, host]);
*/
