/** @type {import('ts-jest').JestConfigWithTsJest} */
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
      branches: 35,
      functions: 35,
      lines: 35,
      statements: 35,
    },
  },
  testTimeout: 30000,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/../../__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-.*|rehype-.*|unist-.*|unified|bail|is-plain-obj|trough|vfile.*|mdast-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-.*|space-separated-tokens|comma-separated-tokens|zwitch|html-void-elements|ccount|escape-string-regexp|markdown-table|trim-lines|longest-streak|devlop)/)',
  ],
};
