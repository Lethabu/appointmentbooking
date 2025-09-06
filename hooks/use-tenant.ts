"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Tenant } from "@/types"

export function useTenant(subdomain: string) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use imported supabase client

  const fetchTenant = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase.from("tenants").select("*").eq("subdomain", subdomain).single()

      if (fetchError) throw fetchError

      setTenant(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tenant")
      setTenant(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subdomain) {
      fetchTenant()
    }
  }, [subdomain])

  return { tenant, loading, error, refetch: fetchTenant }
}
