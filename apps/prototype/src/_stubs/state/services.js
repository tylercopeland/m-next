// Stub for `state/services` — referenced by MethodUI's
// utilities/validation/ErrorBoundary.js, which gets pulled in transitively
// when any kit wrapper imports from MethodUI's `utilities` barrel.
//
// In the live MethodUI app, this is a Redux thunk that logs component errors
// to a backend service. In the kit prototype we have no Redux store, so we
// no-op it. The ErrorBoundary itself never renders unless a consumer wraps
// JSX with it — which kit doesn't.

export const logComponentError = () => {};

// Add other named exports here as more MethodUI components surface them.
