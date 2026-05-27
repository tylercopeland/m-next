import { createContext, useContext } from 'react';
import type { SizeObserverContextValue } from './types';

/**
 * Default no-op context value used when the provider is not mounted
 * (i.e. designer mode). The no-op reportSize avoids null checks in consumers.
 */
const defaultValue: SizeObserverContextValue = {
  observedSizes: {},
  reportSize: () => {
    /* no-op when outside provider */
  },
};

const SizeObserverContext = createContext<SizeObserverContextValue>(defaultValue);

/**
 * Hook to access the size observer context.
 * Returns the default no-op value when outside a RuntimeLayoutProvider
 * (e.g. in designer mode), so consumers don't need null checks.
 */
export const useSizeObserverContext = (): SizeObserverContextValue => {
  return useContext(SizeObserverContext);
};

export { SizeObserverContext };
