import { Metadata } from 'next';
import CustomerJourney from '@/components/CustomerJourney';

export const metadata: Metadata = {
  title: 'InStyle Hair Boutique - Premium Hair Services & Products',
  description: 'Professional hair installations, treatments, and premium products in South Africa. Book appointments and shop online with ZAR payments.',
  keywords: 'hair salon, hair extensions, maphondo, hair treatment, south africa, hair products, booking',
  openGraph: {
    title: 'InStyle Hair Boutique - Premium Hair Services',
    description: 'Professional hair services and premium products. Book online or shop our collection.',
    url: 'https://instylehairboutique.co.za',
    siteName: 'InStyle Hair Boutique',
    images: [
      {
        url: '/tenants/instyle/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InStyle Hair Boutique',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InStyle Hair Boutique',
    description: 'Premium hair services and products in South Africa',
    images: ['/tenants/instyle/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function InStyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CustomerJourney tenantId="instylehairboutique" />
    </>
  );
}
