import * as Sentry from "@sentry/nextjs";

export function register() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

export async function onRequestError({ error }: { error: any }) {
  Sentry.captureException(error);
  await Sentry.flush(2000);
}
