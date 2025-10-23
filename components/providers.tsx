'use client';

import { CartProvider } from '@/app/context/CartContext';
import ConvexClientProvider from '@/app/ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { CSPostHogProvider } from './PostHogProvider';
import { Toaster } from './ui/toaster';
import { Toaster as SonnerToaster } from './ui/sonner';
import Debug from './Debug';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {children}
            <Toaster />
            <SonnerToaster />
            <Debug />
          </CartProvider>
        </ThemeProvider>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}