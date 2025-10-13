import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment detection
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay (for debugging UX issues)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Privacy Protection
  beforeSend(event, hint) {
    // Remove sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.['Authorization'];
      delete event.request.headers?.['Cookie'];
    }
    
    // Scrub PII from error messages
    if (event.message) {
      event.message = event.message
        .replace(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, '[EMAIL_REDACTED]')
        .replace(/\b\d{10,}\b/g, '[PHONE_REDACTED]')
        .replace(/\b\d{16}\b/g, '[CARD_REDACTED]');
    }
    
    // Filter out known non-critical errors
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'cancelled',
    ];
    
    if (event.exception?.values?.[0]?.value) {
      const errorMessage = event.exception.values[0].value;
      if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
        return null; // Don't send to Sentry
      }
    }
    
    return event;
  },
  
  // Tag all events with tenant information
  beforeSendTransaction(event) {
    const tenantId = document.querySelector('meta[name="tenant-id"]')?.getAttribute('content');
    if (tenantId) {
      event.tags = { ...event.tags, tenant_id: tenantId };
    }
    return event;
  },
  
  // Custom integrations
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});