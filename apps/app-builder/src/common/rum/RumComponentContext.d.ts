import { ReactNode } from 'react';

interface RumComponentContextProviderProps {
  componentName: string;
  children: ReactNode;
}

export const RumComponentContextProvider: React.FC<RumComponentContextProviderProps>; 