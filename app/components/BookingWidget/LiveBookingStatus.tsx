'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface LiveBookingStatusProps {
  appointmentId: string;
  tenantId: string;
}

export function LiveBookingStatus({ appointmentId, tenantId }: LiveBookingStatusProps) {
  const updates = useQuery(api.bookings.getUpdates, { appointmentId, tenantId });
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Live Status Updates</h3>
      {updates?.map(update => (
        <div key={update._id} className="flex justify-between text-sm">
          <span>{update.status}</span>
          <span className="text-gray-500">
            {new Date(update.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}