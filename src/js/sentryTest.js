// Da chiamare manualmente dalla console del browser per verificare che Sentry catturi gli errori.
window.triggerTestError = function triggerTestError() {
  throw new Error(`Sentry test error - ${new Date().toISOString()}`);
};
