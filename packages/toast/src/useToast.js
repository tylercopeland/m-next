import { useContext } from 'react';
import { ToastContext } from './ToastProvider';

// Hook returning the imperative toast API: { info, success, warning, error, dismiss, dismissAll }.
// Must be called inside a <ToastProvider>. If used outside, returns a no-op
// shim — components that conditionally fire toasts (e.g. on async settle)
// shouldn't throw at render time if the provider hasn't mounted yet.
const NOOP_RESULT = '';
const noopShim = {
  info: () => NOOP_RESULT,
  success: () => NOOP_RESULT,
  warning: () => NOOP_RESULT,
  error: () => NOOP_RESULT,
  dismiss: () => undefined,
  dismissAll: () => undefined,
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (ctx === null || ctx === undefined) {
    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      // eslint-disable-next-line no-console
      console.warn(
        '[@m-next/toast] useToast() was called outside a <ToastProvider>. The hook returned a no-op shim.'
      );
    }
    return noopShim;
  }
  return ctx;
};

export default useToast;
