'use client';

import { useQuery } from '@tanstack/react-query';
import type { Tenant } from '@/types';

export function useTenant(subdomain: string) {
  return useQuery({
    queryKey: ['tenant', subdomain],
    queryFn: async () => {
      if (!subdomain) {
        throw new Error('Subdomain is required');
      }
      // Make direct API call to tenant resolver
      const response = await fetch(`/api/tenant-resolver?subdomain=${subdomain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tenant');
      }
      const data = await response.json();
      return data as Tenant;
    },
    enabled: !!subdomain,
    retry: 1,
  });
}
