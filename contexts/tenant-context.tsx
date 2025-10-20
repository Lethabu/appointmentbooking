"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useParams } from "next/navigation"
import type { Tenant } from "@/types"
import { useTenant } from "@/hooks/use-tenant"

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  error: string | null
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const subdomain = params?.subdomain as string
  // useTenant returns a React Query result: { data, isLoading, error, refetch }
  const { data: tenant, isLoading: loading, error, refetch } = useTenant(subdomain as string)

  const refreshTenant = async () => {
    await refetch()
  }

  // Ensure values match TenantContextType: tenant | null and error | null
  return (
    <TenantContext.Provider
      value={{ tenant: tenant ?? null, loading: !!loading, error: error ? (error as Error).message : null, refreshTenant }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}