const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    hideSourceMaps: false,
  },
}, { silent: true });
