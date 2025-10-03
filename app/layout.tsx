import './globals.css';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
<<<<<<< HEAD
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';

// Import components directly for server components
import ConvexClientProvider from './ConvexClientProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { CartProvider } from '@/app/context/CartContext';
import Providers from './providers';
import Debug from '@/components/Debug';
=======
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
>>>>>>> origin/feat/instyle-whitelabel

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering to ensure headers() is available
export const dynamic = 'force-dynamic';

<<<<<<< HEAD
// Helper function to detect tenant from headers
async function getTenantFromHeaders(): Promise<string | null> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const xTenant = headersList.get('x-tenant-id');

  // Check x-tenant header first (set by middleware)
  if (xTenant) {
    return xTenant;
  }

  // Check hostname for tenant domains
  if (host.includes('instylehairboutique.co.za') || 
      host.includes('instylehairboutique') ||
      host === 'www.instylehairboutique.co.za') {
    return 'instyle';
  }

  return null;
}

=======
>>>>>>> origin/feat/instyle-whitelabel
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenantFromHeaders();

  // For tenant domains, use minimal wrapper without platform branding
  if (tenant) {
    return (
      <html lang="en">
        <head>
          <meta name="referrer" content="strict-origin-when-cross-origin" />
        </head>
        <body className={inter.className}>
          <ClerkProvider>
            <CSPostHogProvider>
              <Providers>
                <ConvexClientProvider>
                  <CartProvider>
                    {/* NO PLATFORM HEADER/FOOTER FOR TENANTS */}
                    {children}
                    <Toaster />
                    <SonnerToaster />
                    <Debug />
                  </CartProvider>
                </ConvexClientProvider>
              </Providers>
            </CSPostHogProvider>
            <Analytics />
          </ClerkProvider>
        </body>
      </html>
    );
  }

  // For main platform domain, use full platform layout
  return (
    <html lang="en">
      <head>
          <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
<<<<<<< HEAD
            <Providers>
              <ConvexClientProvider>
                <CartProvider>
                  {children}
                  <Toaster />
                  <SonnerToaster />
                  <Debug />
                </CartProvider>
              </ConvexClientProvider>
            </Providers>
=======
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
>>>>>>> origin/feat/instyle-whitelabel
          </CSPostHogProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
