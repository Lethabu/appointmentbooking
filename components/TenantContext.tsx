'use client';

import { createContext, useContext, ReactNode } from 'react';

const TenantContext = createContext<string | null>(null);

export const TenantProvider = ({
  tenantId,
  children,
}: {
  tenantId: string | null;
  children: ReactNode;
}) => {
  return <TenantContext.Provider value={tenantId}>{children}</TenantContext.Provider>;
};

export const useTenant = () => useContext(TenantContext);