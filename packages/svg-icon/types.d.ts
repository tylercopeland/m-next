// Type declarations for icon paths
declare module 'packages/svg-icon/src/icon-paths' {
  interface IconPaths {
    icons: Array<{
      name: string;
      path: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }
  const iconPaths: IconPaths;
  export default iconPaths;
}
