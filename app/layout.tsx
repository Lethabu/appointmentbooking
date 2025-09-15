"use client";
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { Inter } from 'next/font/google';
const ConvexClientProvider = dynamic(() => import('./ConvexClientProvider'), { ssr: false });
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/tenants/instyle/hero.webp"
          as="image"
        />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <CSPostHogProvider>
            <ConvexClientProvider>
              <CartProvider>
                {children}
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
