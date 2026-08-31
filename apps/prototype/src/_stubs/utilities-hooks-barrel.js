// Curated barrel for `utilities/hooks`. The real index.js re-exports a
// dozen hooks, several of which import lodash/isEqual, resize-observer-polyfill,
// and various state slices kit can't satisfy.
//
// Kit's transitively-pulled-in code only uses useDidUpdateEffect.

export { useDidUpdateEffect } from 'utilities/hooks/useDidUpdateEffect';
