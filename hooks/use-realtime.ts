"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtime<T>(table: string, filter?: string, tenantId?: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use imported supabase client

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      try {
        // Initial data fetch
        let query = supabase.from(table).select("*")

        if (tenantId) {
          query = query.eq("tenant_id", tenantId)
        }

        if (filter) {
          // Apply additional filters
          query = query.eq(filter.split("=")[0], filter.split("=")[1])
        }

        const { data: initialData, error: fetchError } = await query

        if (fetchError) throw fetchError

        setData(initialData || [])
        setLoading(false)

        // Set up real-time subscription
        channel = supabase
          .channel(`${table}_changes`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: table,
              filter: tenantId ? `tenant_id=eq.${tenantId}` : undefined,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setData((prev) => [...prev, payload.new as T])
              } else if (payload.eventType === "UPDATE") {
                setData((prev) => prev.map((item) => ((item as any).id === payload.new.id ? (payload.new as T) : item)))
              } else if (payload.eventType === "DELETE") {
                setData((prev) => prev.filter((item) => (item as any).id !== payload.old.id))
              }
            },
          )
          .subscribe()
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, filter, tenantId, supabase])

  return { data, loading, error }
}
