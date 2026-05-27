/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  /* Add any custom jest config needed for this package (e.g. coverageThreshold) */
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@m-one)/)'],
  // Configure test environment for consistent Emotion behavior in CI/CD
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Ensure consistent DOM environment
    url: 'http://localhost',
  },
};
