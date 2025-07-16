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
  const { tenant, loading, error, refetch } = useTenant(subdomain)

  const refreshTenant = async () => {
    await refetch()
  }

  return <TenantContext.Provider value={{ tenant, loading, error, refreshTenant }}>{children}</TenantContext.Provider>
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenantContext must be used within a TenantProvider")
  }
  return context
}
