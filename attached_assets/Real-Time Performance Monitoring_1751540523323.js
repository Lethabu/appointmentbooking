// components/Monitoring/PerformanceObserver.jsx
'use client'
import { useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function PerformanceObserver() {
  const supabase = useSupabaseClient()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // 1. Resource Timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          supabase.from('performance_metrics').insert({
            type: 'resource',
            name: entry.name,
            duration: entry.duration,
            initiator_type: entry.initiatorType,
            size: entry.decodedBodySize
          })
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })

      // 2. Navigation Timing
      const navigationObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          supabase.from('performance_metrics').insert({
            type: 'navigation',
            name: entry.name,
            duration: entry.duration,
            dom_complete: entry.domComplete,
            load_time: entry.loadEventEnd
          })
        })
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })

      // 3. User Timing
      const userObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          supabase.from('performance_metrics').insert({
            type: 'custom',
            name: entry.name,
            duration: entry.duration,
            start_time: entry.startTime
          })
        })
      })
      userObserver.observe({ entryTypes: ['measure'] })

      return () => {
        resourceObserver.disconnect()
        navigationObserver.disconnect()
        userObserver.disconnect()
      }
    }
  }, [])

  return null
}

// Custom performance marks
export function startPerfMark(name) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${name}_start`)
  }
}

export function endPerfMark(name) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${name}_end`)
    performance.measure(name, `${name}_start`, `${name}_end`)
    performance.clearMarks(`${name}_start`)
    performance.clearMarks(`${name}_end`)
  }
}