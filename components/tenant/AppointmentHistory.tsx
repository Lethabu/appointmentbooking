'use client';

import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

interface Appointment {
  id: string;
  scheduled_time: string;
  status: string;
  services: { name: string }[];
  staff: { name: string }[];
  users: { name: string; email?: string }[];
}

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  const scheduledTime = new Date(appointment.scheduled_time);
  const formattedDate = scheduledTime.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = scheduledTime.toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="bg-purple-100 p-3 rounded-lg">
          <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
        </div>
        <div>
<h4 className="text-lg font-bold">
  {appointment.services[0]?.name || 'N/A'}
</h4>
<p className="text-sm text-gray-500">
  With {appointment.staff[0]?.name || 'N/A'}
</p>
<p className="text-sm text-gray-500">
  Booked by: {appointment.users[0]?.name || appointment.users[0]?.email || 'N/A'}
</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formattedDate}</p>
        <p className="font-semibold">{formattedTime}</p>
        <p className="text-sm text-gray-500">{appointment.status}</p>
      </div>
    </div>
  );
}

interface AppointmentHistoryProps {
  history: Appointment[];
  future: Appointment[];
  loading: boolean;
}

export default function AppointmentHistory({ history, future, loading }: AppointmentHistoryProps) {
  if (loading) {
    return <p className="text-center py-8">Loading appointments...</p>;
  }

  return (
    <>
      {/* Future Appointments */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">
          Upcoming Appointments
        </h3>
        {future.length === 0 ? (
          <p>You have no upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {future.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>

      {/* Appointment History */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-[#1B1B1B]">
          Past Appointments
        </h3>
        {history.length === 0 ? (
          <p>You have no past appointments.</p>
        ) : (
          <div className="space-y-4">
            {history.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
