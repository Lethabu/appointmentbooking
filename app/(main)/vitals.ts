import type { NextWebVitalsMetric } from 'next/app';
 
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    console.table(metric);
    // send to Convex or PostHog
  }
}