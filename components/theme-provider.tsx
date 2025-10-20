'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase'; // Adjust to your Supabase types

interface TenantThemeProviderProps extends ThemeProviderProps {
  tenantId?: string;
}

async function loadTenantTokens(tenantId: string) {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase
    .from('design_tokens')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  if (error) {
    console.warn('Failed to load tenant tokens, using defaults:', error);
    return null;
  }

  return (data as any)?.tokens || null;
}

export function ThemeProvider({ children, tenantId, ...props }: TenantThemeProviderProps) {
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!tenantId) return;

    loadTenantTokens(tenantId).then((tokens) => {
      if (tokens) {
        const vars: Record<string, string> = {};
        // Flatten tokens to CSS vars, e.g., tokens.colors.primary.DEFAULT -> --colors-primary
        Object.entries(tokens).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              vars[`--${key}-${subKey}`] = subValue as string;
            });
          } else if (value !== null) {
            vars[`--${key}`] = value as string;
          }
        });
        setCssVars(vars);
      }
    });
  }, [tenantId]);

  return (
    <>
      <style jsx global>{`
        :root {
          ${Object.entries(cssVars).map(([key, value]) => `${key}: ${value};`).join('\n')}
        }
      `}</style>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  );
}
