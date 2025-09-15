const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  {
    allowedDevOrigins: ["http://localhost:3001", "https://3001-firebase-appointmentbooking-1751686522286.cluster-c23mj7ubf5fxwq6nrbev4ugaxa.cloudworkstations.dev"],
  },
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "YOUR_ORG_SLUG",
    project: "YOUR_PROJECT_SLUG",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
