// Stub for components/Runtime/state — used by LeftNav's Dashboard sub-component
// to get the current "app type" (Portal vs Standard) for branching behavior.

export const getAppType = (state) => state?.runtime?.appType ?? 'Standard';
