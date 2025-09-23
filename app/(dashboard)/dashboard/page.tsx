'use client';
import { useAuth } from '@/app/ConvexClientProvider';
import RealtimeDashboard from '@/components/RealtimeDashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <RealtimeDashboard />;
}
