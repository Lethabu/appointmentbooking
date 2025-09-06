import { Metadata } from 'next';
import ServiceBookingFlow from '@/components/booking/ServiceBookingFlow';

export const metadata: Metadata = {
  title: 'Book Service - InStyle Hair Boutique',
  description: 'Book your hair service appointment with secure PayStack payment',
};

export default function BookInstylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50">
      <ServiceBookingFlow />
    </div>
  );
}