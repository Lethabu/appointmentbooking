import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase'; // Adjust to your Supabase types

interface StitchComponentProps {
  componentName: string;
  tenantId: string;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export function useStitchComponent({ componentName, tenantId, fallback, loading }: StitchComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function loadComponent() {
      try {
        setIsLoading(true);
        setError(null);

        // First, check if component exists in Supabase (for dynamic storage)
        const { data, error: fetchError } = await supabase
          .from('ui_components')
          .select('code, css') // Assuming table stores generated TSX/CSS
          .eq('name', componentName)
          .eq('tenant_id', tenantId)
          .single();

        if (fetchError || !data) {
          // Fallback to static file import if not in DB
          const dynamicComponent = dynamic(
            () => import(`@/components/tenants/${tenantId}/${componentName}`),
            { ssr: false }
          );
          setComponent(() => dynamicComponent);
          return;
        }

        // For dynamic: Eval code (CAUTION: Security risk; use only if sanitized)
        // Better: Store as file and import, or use a safe renderer
        // Here, assume pre-compiled or use a library like react-jsx-parser (not recommended for prod)
        // Placeholder: For now, fallback to static
        console.warn('Dynamic eval not implemented; using static fallback');
        const dynamicComponent = dynamic(
          () => import(`@/components/tenants/${tenantId}/${componentName}`),
          { ssr: false }
        );
        setComponent(() => dynamicComponent);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load component');
      } finally {
        setIsLoading(false);
      }
    }

    loadComponent();
  }, [componentName, tenantId, supabase]);

  return {
    Component,
    isLoading,
    error,
    fallback: fallback || React.createElement('div', null, 'Component not available'),
    loading: loading || React.createElement('div', null, 'Loading...'),
  };
}

// Usage example in component:
// const { Component, isLoading, loading } = useStitchComponent({
//   componentName: 'BookingForm',
//   tenantId: 'instyle',
// });
// return (
//   <div>
//     {isLoading ? loading : Component ? <Component /> : fallback}
//   </div>
// );