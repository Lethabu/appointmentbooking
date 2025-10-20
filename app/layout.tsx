import './globals.css';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/components/providers';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import ChatWindow from '@/components/ChatWindow';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: 'AppointmentBooking SaaS Platform',
  description: 'Multi-tenant booking and commerce platform for salon businesses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <AppProviders>
          <Navigation />
          <main className="min-h-screen flex-grow">{children}</main>
          <Footer />
          <ChatWindow tenantId={'default'} />
          <CookieConsentBanner />
        </AppProviders>
      </body>
    </html>
  );
}
