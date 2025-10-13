import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  
  // Server-side specific options
  beforeSend(event) {
    // Never log environment variables
    if (event.contexts?.runtime?.env) {
      event.contexts.runtime.env = '[REDACTED]';
    }
    
    // Sanitize database queries
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(crumb => {
        if (crumb.category === 'query') {
          return { ...crumb, data: { query: '[REDACTED]' } };
        }
        return crumb;
      });
    }
    
    return event;
  },
});