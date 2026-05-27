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
  transformIgnorePatterns: [
    'node_modules/(?!(react-markdown|remark-.*|rehype-.*|unified|bail|is-plain-obj|trough|vfile.*|unist-.*|micromark.*|mdast-.*|ccount|escape-string-regexp|markdown-table|decode-named-character-reference|character-entities|property-information|hast-.*|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch|html-void-elements|devlop|longest-streak|trim-lines))',
  ],
  coverageThreshold: {
    global: {
      branches: 37,
      functions: 30,
      lines: 40,
      statements: 40,
    },
  },
};
