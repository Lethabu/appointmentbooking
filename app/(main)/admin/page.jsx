'use client';
import AdminLayout from '@/app/components/Admin/Layout';
import DashboardStats from '@/app/components/Admin/DashboardStats';
import RecentActivity from '@/app/components/Admin/RecentActivity';
import SubscriptionReport from '@/app/components/Admin/SubscriptionReport';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Platform Overview
        </h1>
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentActivity />
          <SubscriptionReport />
        </div>
      </div>
    </AdminLayout>
  );
}
