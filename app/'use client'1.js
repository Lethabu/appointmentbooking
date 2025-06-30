'use client'

import { useEffect } from 'react'

export default function PerformanceObserver() {
  useEffect(() => {
    if (typeof window.PerformanceObserver === 'undefined') {
      return
    }

    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        // @ts-ignore - `element` is not on the type def
        const element = entry.element
        if (element) {
          // Check if it's a Next.js Image component that is not marked as priority
          const isNextImage = element.hasAttribute('data-nimg')
          const isPriority = element.getAttribute('fetchpriority') === 'high'

          if (isNextImage && !isPriority) {
            console.warn(
              `Image with src "${element.src}" was detected as the Largest Contentful Paint (LCP). Please add the "priority" property if this image is above the fold to improve performance.
Read more: https://nextjs.org/docs/api-reference/next/image#priority`
            )
          }
        }
      }
    })

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    } catch (err) {
      // Log error but don't crash the app
      console.error('Failed to observe LCP:', err)
    }

    return () => observer.disconnect()
  }, [])

  return null
}