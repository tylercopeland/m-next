// This file is no longer needed as we've moved all types to screenLayoutTypes.ts
// and updated the imports in other files to avoid circular dependencies.
// Keeping this file as an empty declaration to maintain compatibility with existing imports.
declare module '../../../common/services/screenLayoutSlice' {
  // Re-export types from screenLayoutTypes
  export * from '../../../types/screenLayoutTypes';
}
