/* eslint-disable @typescript-eslint/no-unused-vars */
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      [key: string]: string;
    };
  }

  export type ThemedStyledFunction<T, U> = {
    <P extends object>(
      props: P & { theme?: U }
    ): React.ComponentType<P & { theme?: U }>;
  };

  export function styled<T extends keyof JSX.IntrinsicElements>(
    element: T
  ): ThemedStyledFunction<T, DefaultTheme>;
} 