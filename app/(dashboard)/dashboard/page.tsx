'use client';
import { useAuth } from '@/app/ConvexClientProvider';
import RealtimeDashboard from '@/components/RealtimeDashboard';

export default function DashboardPage() {
  const authResult = useAuth();

  // Since Convex auth is not implemented, show login prompt
  // TODO: Implement proper auth with Clerk integration
  if (!authResult || authResult === null) {
    return <div>Please sign in to access the dashboard</div>;
  }

  return <RealtimeDashboard />;
}
