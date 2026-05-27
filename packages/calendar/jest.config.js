/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      ...baseConfig.coverageThreshold.global,
      lines: 37,
      statements: 36,
      branches: 32,
      functions: 45,
    },
  },
};
