'use client';

import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export default function AppointmentCard({ appointment }) {
  const { scheduled_time, status, profiles, services } = appointment;

  const clientName = profiles?.full_name || 'Unknown Client';
  const serviceName = services?.name || 'Unknown Service';
  const servicePrice = services?.price
    ? new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(services.price / 100)
    : 'N/A';
  const appointmentDate = new Date(scheduled_time).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const appointmentTime = new Date(scheduled_time).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center text-sm text-gray-500">
        <UserIcon className="h-4 w-4 mr-2" /> {clientName}
      </div>
      <div className="font-semibold text-gray-800 flex items-center">
        <TagIcon className="h-4 w-4 mr-2 text-gray-500" /> {serviceName} -{' '}
        {servicePrice}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <CalendarIcon className="h-4 w-4 mr-2" /> {appointmentDate}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <ClockIcon className="h-4 w-4 mr-2" /> {appointmentTime}
      </div>
      <div className="pt-2">
        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {status}
        </span>
      </div>
    </div>
  );
}
