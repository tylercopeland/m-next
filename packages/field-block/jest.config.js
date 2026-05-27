/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  /* Add any custom jest config needed for this package (e.g. coverageThreshold) */
  coverageThreshold: {
    global: {
      ...baseConfig.coverageThreshold.global,
      branches: 68,
      functions: 69,
      lines: 76,
      statements: 76,
    },
  },
};
