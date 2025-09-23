'use client';
'use client';
import { useEffect } from 'react';

export default function PerformanceObserver() {
  useEffect(() => {
    // Only run in production and if PerformanceObserver is supported
    if (
      typeof window !== 'undefined' &&
      'PerformanceObserver' in window &&
      process.env.NODE_ENV === 'production'
    ) {
      try {
        // Simple performance monitoring without database calls
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.duration > 1000) {
              // Log slow operations
              console.warn(
                `Slow operation detected: ${entry.name} took ${entry.duration}ms`,
              );
            }
          });
        });

        observer.observe({ entryTypes: ['measure', 'navigation'] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn('PerformanceObserver setup failed:', error);
      }
    }
  }, []);

  return null;
}
