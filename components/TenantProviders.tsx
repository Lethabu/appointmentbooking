'use client';

import ConvexClientProvider from '@/app/ConvexClientProvider';
import { CartProvider } from '@/app/context/CartContext';
import { ReactNode } from 'react';

export function TenantProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexClientProvider>
      {children}
    </ConvexClientProvider>
  );
}
