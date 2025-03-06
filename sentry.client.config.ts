// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://544783164ac3be9054c936532cab32ba@o4508159350145024.ingest.us.sentry.io/4508159625134080',
  integrations: [
    Sentry.browserProfilingIntegration(),
  ],
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? 1 : 0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  debug: process.env.NEXT_PUBLIC_ENVIRONMENT === 'development',
});