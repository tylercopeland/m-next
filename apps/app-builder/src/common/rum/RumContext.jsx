import { createContext } from 'react';

export const RumComponentContext = createContext({
  componentBreadCrumbs: 'root',
  component: 'root',
  customAttributes: null,
});

export default RumComponentContext;
