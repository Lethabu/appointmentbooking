'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/app/ConvexClientProvider';

interface Appointment {
  id: string;
  clientName: string;
  scheduledTime: any;
  status: string;
  paymentStatus?: string;
}

export default function RealtimeDashboard() {
  const authResult = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authResult || !authResult.user) return;

    authResult.user.getIdTokenResult().then((tokenResult: any) => {
      const tenantId = tokenResult.claims.tenantId;

      if (!tenantId) return;

      const q = query(
        collection(db, 'appointments'),
        where('tenantId', '==', tenantId),
        orderBy('scheduledTime', 'desc'),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const appointmentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];

        setAppointments(appointmentData);
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, [authResult]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Appointments</h2>
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{appointment.clientName}</h3>
                <p className="text-gray-600">
                  {appointment.scheduledTime?.toDate?.()?.toLocaleString() ||
                    'Invalid date'}
                </p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {appointment.status}
                </span>
                {appointment.paymentStatus && (
                  <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {appointment.paymentStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
