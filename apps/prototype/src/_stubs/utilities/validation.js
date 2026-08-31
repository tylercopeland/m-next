// Stub for MethodUI's `utilities/validation` barrel. The real module
// re-exports ErrorBoundary, which imports `uuid` as a default export.
// uuid@9 only ships named exports, so the default import resolves to
// undefined and crashes at module init.
//
// Kit doesn't render ErrorBoundary anywhere (we have our own at App.jsx
// level), so we replace it with a no-op pass-through. withTryCatch is
// the only export from validation that's actually invoked transitively
// (via javaScriptUtils), so we keep that real.

import React from 'react';

export class ErrorBoundary extends React.Component {
  render() {
    return this.props.children ?? null;
  }
}

export const withTryCatch =
  (fn) =>
  (...args) => {
    try {
      return fn(...args);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };
