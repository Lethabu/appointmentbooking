'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { LoyaltyWidget } from '@/components/dashboard/LoyaltyWidget';
import { InAppChecklist } from '@/components/dashboard/InAppChecklist';
import { useAuth } from '@clerk/nextjs';

export default function DashboardPage() {
  const { userId } = useAuth();
  const bookings = useQuery(api.bookings.byUser, userId ? { userId } : "skip");
  const points = useQuery(api.loyalty.get, userId ? { userId } : "skip");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2">
        <CalendarView bookings={bookings} />
        <div className="mt-6">
          <InAppChecklist />
        </div>
      </section>
      <aside className="space-y-6">
        <StatsCards bookings={bookings} />
        <LoyaltyWidget points={points} />
      </aside>
    </div>
  );
}