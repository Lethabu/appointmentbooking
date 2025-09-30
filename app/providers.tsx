'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for each request on the server,
  // but a single instance for the client.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 1000 } },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}