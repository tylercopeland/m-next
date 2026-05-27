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
  coverageThreshold: {
    global: {
      branches: 72,
      statements: 88,
      lines: 87,
      functions: 87.5,
    },
  },
};
