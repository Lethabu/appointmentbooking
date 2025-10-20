'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/nextjs';
import { createLogger } from '../logger';

const logger = createLogger();

// Include Sentry Performance Monitoring
export function usePerformanceMonitoring() {
  const router = useRouter();

  useEffect(() => {
    // Track Core Web Vitals
    const reportWebVitals = (metric: any) => {
      const { name, value, id, label } = metric;

      // Log performance metric
      logger.performance(`${name} recorded`, name, value, 'millisecond');

      // Send to Sentry (if metrics API is available)
      if ('metrics' in Sentry && (Sentry as any).metrics) {
        (Sentry as any).metrics.distribution(name, value, {
          unit: 'millisecond',
          tags: {
            label,
            route: router.pathname,
          },
        });
      }

      // Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', name, {
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js Metric',
          event_label: id,
          non_interaction: true,
        });
      }

      // Monitor for performance issues
      const thresholds = {
        FCP: 1800, // First Contentful Paint
        LCP: 2500, // Largest Contentful Paint
        INP: 200,  // Interaction to Next Paint (replaced FID)
        CLS: 0.1,  // Cumulative Layout Shift
        TTFB: 600, // Time to First Byte
      };

      const threshold = (thresholds as any)[name];
      if (name in thresholds && value > threshold) {
        logger.warn(`Poor ${name} performance: ${value}ms on ${router.pathname}`, {
          metric: name,
          value,
          threshold,
        });

        Sentry.captureMessage(`Poor ${name}: ${value}ms on ${router.pathname}`, {
          level: 'warning',
          tags: { metric: name, route: router.pathname },
          extra: { value, threshold },
        });
      }
    };

    // Dynamic import of web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals); // INP replaced FID in web-vitals v3
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);

      logger.debug('Performance monitoring initialized');
    });

    // Track route changes
    const handleRouteChange = (url: string) => {
      Sentry.setContext('navigation', {
        from: router.pathname,
        to: url,
      });

      logger.info(`Route changed: ${router.pathname} -> ${url}`, {
        from: router.pathname,
        to: url,
      });
    };

    router.events?.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
}

// Hook for tracking user interactions
export function useInteractionTracking() {
  useEffect(() => {
    const trackInteraction = (event: MouseEvent | KeyboardEvent) => {
      // Throttle interaction tracking
      const now = Date.now();
      const lastTrack = (window as any)._lastInteractionTrack || 0;

      if (now - lastTrack > 1000) { // Only track once per second
        logger.performance('User interaction recorded', 'interaction_interval', now - lastTrack, 'millisecond');
        (window as any)._lastInteractionTrack = now;
      }
    };

    // Track clicks and key presses
    document.addEventListener('click', trackInteraction);
    document.addEventListener('keydown', trackInteraction);

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, []);
}

// Hook for tracking API call performance
export function useApiPerformanceTracking() {
  const trackApiCall = async (url: string, method: string, startTime: number, status: number) => {
    const duration = Date.now() - startTime;

    logger.performance(`API call completed`, `${method}_${url}`, duration, 'millisecond');

    // Track in Sentry (if metrics API is available)
    if ('metrics' in Sentry && (Sentry as any).metrics) {
      (Sentry as any).metrics.distribution('api.duration', duration, {
        unit: 'millisecond',
        tags: {
          method,
          endpoint: url,
          status: status.toString(),
        },
      });
    }

    // Alert on slow API calls
    if (duration > 3000) {
      logger.warn(`Slow API call: ${method} ${url} took ${duration}ms`, {
        method,
        url,
        duration,
        status,
      });

      Sentry.captureMessage(`Slow API: ${method} ${url}`, {
        level: 'warning',
        tags: { method, endpoint: url },
        extra: { duration, status },
      });
    }
  };

  return { trackApiCall };
}

// Hook for monitoring memory usage
export function useMemoryMonitoring() {
  useEffect(() => {
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memInfo.totalJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024);

        // Log memory usage periodically
        logger.performance('Memory usage checked', 'heap_used', usedMB, 'MB');

        // Alert if memory usage is high
        if (usedMB > limitMB * 0.8) {
          logger.warn(`High memory usage: ${usedMB}MB of ${limitMB}MB`, {
            usedMB,
            totalMB,
            limitMB,
            usagePercent: (usedMB / limitMB) * 100,
          });
        }
      }
    };

    // Check memory every 30 seconds
    const interval = setInterval(monitorMemory, 30000);

    return () => clearInterval(interval);
  }, []);
}

// Utility function for measuring function execution time
export function measureExecutionTime<T>(
  fn: () => T,
  operation: string
): { result: T; duration: number } {
  const start = Date.now();
  const result = fn();
  const duration = Date.now() - start;

  logger.performance(`${operation} executed`, operation, duration, 'millisecond');

  // Alert on slow operations
  if (duration > 1000) {
    logger.warn(`Slow operation: ${operation} took ${duration}ms`, {
      operation,
      duration,
    });
  }

  return { result, duration };
}
