
import { Metadata } from 'next';
import { InstyleHero } from '@/components/instyle/InstyleHero';
import { InstyleServices } from '@/components/instyle/InstyleServices';
import { InstyleGallery } from '@/components/instyle/InstyleGallery';
import { InstyleBooking } from '@/components/instyle/InstyleBooking';
import { InstyleContact } from '@/components/instyle/InstyleContact';

export const metadata: Metadata = {
  metadataBase: new URL('https://your-platform-domain.com'),
  title: 'InStyle Hair Boutique - Premium Hair Salon in Johannesburg',
  description: 'Experience luxury hair services at InStyle Hair Boutique. Specializing in balayage, highlights, cuts, and styling in the heart of Johannesburg.',
  openGraph: {
    title: 'InStyle Hair Boutique - Premium Hair Salon',
    description: 'Luxury hair services in Johannesburg',
    url: 'https://instylehairboutique.co.za',
    siteName: 'InStyle Hair Boutique',
  },
};

export default function InstylePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <InstyleHero />
      <InstyleServices />
      <InstyleGallery />
      <InstyleBooking />
      <InstyleContact />
    </div>
  );
}
