import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import ConvexClientProvider from './ConvexClientProvider';
import dynamic from 'next/dynamic';
import ChatWindow from '@/components/ChatWindow';

const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), {
  ssr: false,
});

const SonnerToaster = dynamic(() => import('@/components/ui/sonner').then(mod => mod.Toaster), {
  ssr: false,
});

const CartProvider = dynamic(() => import('@/app/context/CartContext').then(mod => mod.CartProvider), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: { default: 'The Platform - Complete Salon Management Solution',
    template: '%s | The Platform'
  },
  description: 'The complete multi-tenant salon management solution. Increase bookings by 300%, reduce no-shows by 80%.',
  keywords: ['salon booking', 'appointment scheduling', 'salon management', 'beauty booking', 'South Africa'],
  authors: [{ name: 'Your Platform Team' }],
  creator: 'The Platform',
  publisher: 'The Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://your-platform-domain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://your-platform-domain.com',
    title: 'The Platform - Complete Salon Management Solution',
    description: 'The complete multi-tenant salon management solution. Increase bookings by 300%, reduce no-shows by 80%.',
    siteName: 'The Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Platform - Complete Salon Management Solution',
    description: 'The complete multi-tenant salon management solution.',
    creator: '@yourplatform',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
            <ConvexClientProvider>
              <CartProvider>
                <Navigation />
                <main className="min-h-screen flex-grow">
                  {children}
                </main>
                <Footer />
                <ChatWindow tenantId={'default'} />
                <Toaster />
                <SonnerToaster />
              </CartProvider>
            </ConvexClientProvider>
          </CSPostHogProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
