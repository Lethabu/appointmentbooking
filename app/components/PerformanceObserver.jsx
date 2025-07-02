
'use client';

import { useEffect } from 'react';

export default function PerformanceObserver() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log performance metrics for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Performance:', entry.name, entry.duration);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['navigation', 'paint'] });
      } catch (error) {
        console.log('PerformanceObserver not supported');
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
