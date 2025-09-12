import { headers } from 'next/headers';
import { BookingWidget } from '@/components/booking/booking-widget';

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function BookingPage(props: PageProps) {
  const params = await props.params;
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id') || params.tenant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Book Your Appointment
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <BookingWidget tenantId={tenantId} services={[]} branding={{}} />
          </div>
        </div>
      </div>
    </div>
  );
}
