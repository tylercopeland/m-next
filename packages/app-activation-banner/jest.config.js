/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
};
