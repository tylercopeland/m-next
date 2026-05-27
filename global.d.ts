// Global type declarations for the project

declare module '*.jsx' {
  import * as React from 'react';
  
  interface ComponentProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    fill?: string;
    stroke?: string;
    viewBox?: string;
    [key: string]: unknown;
  }
  
  const Component: React.ComponentType<ComponentProps>;
  export default Component;
}

declare module '*.js' {
  const content: any;
  export default content;
}
