import * as Sentry from '@sentry/browser';

// Da chiamare manualmente dalla console del browser per verificare che Sentry catturi gli errori.
window.triggerTestError = function triggerTestError() {
  const error = new Error(`Sentry test error - ${new Date().toISOString()}`);
  Sentry.captureException(error);
  throw error;
};
