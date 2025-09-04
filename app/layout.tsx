import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'AppointmentBooking - Complete Salon Management Platform',
    template: '%s | AppointmentBooking'
  },
  description: 'The complete multi-tenant salon booking and management platform. Increase bookings by 300%, reduce no-shows by 80%.',
  keywords: ['salon booking', 'appointment scheduling', 'salon management', 'beauty booking', 'South Africa'],
  authors: [{ name: 'AppointmentBooking Team' }],
  creator: 'AppointmentBooking',
  publisher: 'AppointmentBooking',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://appointmentbooking.co.za'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://appointmentbooking.co.za',
    title: 'AppointmentBooking - Complete Salon Management Platform',
    description: 'The complete multi-tenant salon booking and management platform. Increase bookings by 300%, reduce no-shows by 80%.',
    siteName: 'AppointmentBooking',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppointmentBooking - Complete Salon Management Platform',
    description: 'The complete multi-tenant salon booking and management platform.',
    creator: '@appointmentbooking',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
              <Navigation />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
              <SonnerToaster />
          </CSPostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}