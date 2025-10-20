import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import ConvexClientProvider from '../ConvexClientProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { CartProvider } from '@/app/context/CartContext';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function InstyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Instyle Hair Boutique</title>
      </head>
      <body className={inter.className}>
        <CSPostHogProvider>
          <ConvexClientProvider>
            <CartProvider>
              {children}
              <Toaster />
              <SonnerToaster />
            </CartProvider>
          </ConvexClientProvider>
        </CSPostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}