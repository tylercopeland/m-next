/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  /* Add any custom jest config needed for this package (e.g. coverageThreshold) */
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 55,
      lines: 55,
      statements: 55,
    },
  },
};
