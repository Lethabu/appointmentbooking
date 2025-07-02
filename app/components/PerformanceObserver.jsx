'use client';

import { useEffect } from 'react';

export default function PerformanceObserver() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Log performance metrics for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('Performance:', entry);
            }
          });
        });

        observer.observe({ entryTypes: ['navigation', 'paint'] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }, []);

  return null;
}