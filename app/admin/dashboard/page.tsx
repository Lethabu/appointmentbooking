'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/ConvexClientProvider';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
} from 'firebase/firestore';

interface Metrics {
  todayBookings: number;
  pendingDemos: number;
  totalRevenue: number;
  conversionRate: number;
}

interface Activity {
  id: string;
  type: string;
  clientName: string;
  createdAt: any;
  amount?: number;
}

export default function AdminDashboard() {
  // Call ALL hooks first - must be in same order every render
  const authResult = useAuth();
  const [metrics, setMetrics] = useState<Metrics>({
    todayBookings: 0,
    pendingDemos: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    // Function defined inside useEffect to avoid dependency issues
    const fetchDashboardData = async () => {
      if (!authResult || !authResult.user) return;

      try {
        // Fetch today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('createdAt', '>=', today),
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const todayBookings = appointmentsSnapshot.docs;

        // Fetch pending demos
        const demosQuery = query(
          collection(db, 'demo_requests'),
          where('status', '==', 'pending'),
        );
        const demosSnapshot = await getDocs(demosQuery);
        const pendingDemos = demosSnapshot.docs;

        // Calculate revenue (mock calculation)
        const totalRevenue = todayBookings.length * 500; // Average booking value

        // Recent activity
        const recentQuery = query(
          collection(db, 'appointments'),
          orderBy('createdAt', 'desc'),
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentActivity = recentSnapshot.docs.slice(0, 10).map((doc) => ({
          id: doc.id,
          type: 'booking',
          clientName: doc.data().clientName || 'Unknown',
          createdAt: doc.data().createdAt,
          amount: 500,
        }));

        setMetrics({
          todayBookings: todayBookings.length,
          pendingDemos: pendingDemos.length,
          totalRevenue,
          conversionRate: 85, // Mock conversion rate
        });

        setRecentActivity(recentActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    // Handle auth checks inside the effect
    if (!authResult || !authResult.user || authResult.loading) return;

    fetchDashboardData();

    // Set up real-time subscriptions
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      console.log('New appointment activity detected');
      fetchDashboardData(); // Refresh metrics
    });

    return () => unsubscribe();
  }, [authResult]); // No more dependency issues

  // Handle loading and authentication states after all hooks
  if (!authResult || authResult === null) {
    return <div>Please sign in to access admin dashboard</div>;
  }
  if (authResult.loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (!authResult.user) {
    return <div className="p-6">Please sign in to access admin dashboard.</div>;
  }

  const { user } = authResult; // Destructure after null checks

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Salon Management Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Today&apos;s Bookings
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {metrics.todayBookings}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Pending Demos
          </h3>
          <div className="text-3xl font-bold text-yellow-600">
            {metrics.pendingDemos}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Today&apos;s Revenue
          </h3>
          <div className="text-3xl font-bold text-green-600">
            R{metrics.totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Conversion Rate
          </h3>
          <div className="text-3xl font-bold text-purple-600">
            {metrics.conversionRate}%
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </div>
        <div className="p-6">
          {recentActivity.length === 0 ? (
            <p className="text-gray-500">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.clientName}</p>
                      <p className="text-sm text-gray-500">
                        {activity.createdAt?.toDate?.()?.toLocaleString() ||
                          'Recent'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R{activity.amount}</p>
                    <p className="text-sm text-gray-500">Booking</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
