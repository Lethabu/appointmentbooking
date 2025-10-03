'use client';

<<<<<<< HEAD
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Tenant } from '@/types';

export function useTenant(subdomainOrHost: string) {
  // If it's a host like 'example.com', extract subdomain if needed
  // For simplicity, assume subdomainOrHost is the subdomain
  const subdomain = subdomainOrHost.includes('.') ? subdomainOrHost.split('.')[0] : subdomainOrHost;
=======
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Tenant } from "@/types"

export function useTenant(subdomain: string) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use imported supabase client
>>>>>>> origin/feat/instyle-whitelabel

  return useQuery({
    queryKey: ['tenant', subdomain],
    queryFn: async () => {
      if (!subdomain) {
        throw new Error('Subdomain is required');
      }
      // Assuming api has a method to get tenant, or use fetch
      // For now, use fetch to /api/tenant-resolver
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