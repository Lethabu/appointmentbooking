import './globals.css';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';

// Import components directly for server components
import ConvexClientProvider from './ConvexClientProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { CartProvider } from '@/app/context/CartContext';
import Debug from '@/components/Debug';

const inter = Inter({ subsets: ['latin'] });

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
        <head />
        <body className={inter.className}>
          <ClerkProvider>
            <CSPostHogProvider>
              <ConvexClientProvider>
                <CartProvider>
                  {/* NO PLATFORM HEADER/FOOTER FOR TENANTS */}
                  {children}
                  <Toaster />
                  <SonnerToaster />
                  <Debug />
                </CartProvider>
              </ConvexClientProvider>
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
      <head />
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
            <ConvexClientProvider>
              <CartProvider>
                {children}
                <Toaster />
                <SonnerToaster />
                <Debug />
              </CartProvider>
            </ConvexClientProvider>
          </CSPostHogProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
