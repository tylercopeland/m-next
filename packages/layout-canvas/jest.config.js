/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  /* Add any custom jest config needed for this package (e.g. coverageThreshold) */
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  // Remove coverage requirements
  collectCoverage: false,
  coverageThreshold: undefined,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^.*runtimeApi$': '<rootDir>/src/__mocks__/runtimeApi.ts',
    '^.*tagsApi$': '<rootDir>/src/__mocks__/tagsApi.ts',
  },
};
