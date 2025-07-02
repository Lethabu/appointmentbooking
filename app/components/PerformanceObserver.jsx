
'use client';

import { useEffect } from 'react';

export default function PerformanceObserver() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Check if PerformanceObserver is supported
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          list.getEntries().forEach((entry) => {
            console.log('Performance:', entry.name, entry.duration);
          });
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });

      return () => {
        try {
          observer.disconnect();
        } catch (e) {
          // Silently handle disconnect errors
        }
      };
    } catch (error) {
      console.warn('PerformanceObserver initialization failed:', error);
    }
  }, []);

  return null;
}
