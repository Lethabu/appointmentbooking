import { notFound } from 'next/navigation';
import BookingWidget from '@/components/BookingWidget';

interface TenantBookPageProps {
  params: { tenant: string };
}

export default function TenantBookPage({ params }: TenantBookPageProps) {
  const { tenant } = params;

  // Validate tenant
  const validTenants = ['instyle'];
  if (!validTenants.includes(tenant)) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Book Appointment - {tenant.charAt(0).toUpperCase() + tenant.slice(1)}</h1>
      <BookingWidget tenant={tenant} salonId="instyle-boutique" />
    </div>
  );
}
