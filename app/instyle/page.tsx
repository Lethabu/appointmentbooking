import { Metadata } from 'next';
import InstyleClientPage from '@/components/instyle/InstyleClientPage';

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique - Premium Hair Salon in Johannesburg',
  description: 'Experience luxury hair services at InStyle Hair Boutique. Specializing in balayage, highlights, cuts, and styling in the heart of Johannesburg.',
};

export default function InstylePage() {
  return <InstyleClientPage />;
}
