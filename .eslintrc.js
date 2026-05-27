module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'airbnb',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      files: ['*.d.ts', '*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/jsx-filename-extension': [
          1,
          {
            extensions: ['.jsx', '.tsx'],
          },
        ],
      },
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: ['import', 'jest', 'jsx-a11y', 'react-hooks', 'react-perf', 'react', '@emotion'],
  rules: {
    'class-methods-use-this': 'error',
    'consistent-return': 'off',
    'dot-notation': 'off',
    'func-names': 'off',

    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',

    'import/newline-after-import': 'error',
    'import/no-cycle': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-named-default': 'error',
    'import/no-named-as-default': 0,
    'import/no-unresolved': 'error',
    'import/order': 'error',
    'import/prefer-default-export': 'error',
    'no-prototype-builtins': 'error',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-unused-expressions': 'warn',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    'no-useless-escape': 'warn',
    'no-use-before-define': 'warn',
    'object-shorthand': 'warn',
    'one-var': 'warn',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.jsx'],
      },
    ],
    radix: 'error',
    'react/destructuring-assignment': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/no-danger': 'error',
    'react/no-this-in-sfc': 'error',
    'react/require-default-props': 'off',
    'react/static-property-placement': 'error',
    'prefer-arrow-callback': 'warn',
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['css', 'method_type', 'canvas_width', 'layout_type', 'animate', 'inert'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'error',
    'react/button-has-type': 'warn',
    'react/no-array-index-key': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/jsx-uses-react': 'error',
    'react/display-name': 'error',
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/jsx-no-bind': 'error',
    'react/function-component-definition':'off',
    // Fix Performance Issues
    // (these should eventually be ENABLED and eventually changed to 'error' instead of 'warn'):
    // 'react-perf/jsx-no-new-function-as-prop': 'warn',
    // 'react-perf/jsx-no-new-object-as-prop': 'warn',
    // 'react-perf/jsx-no-new-array-as-prop': 'warn',
    //
    '@emotion/jsx-import': 'off',
    '@emotion/no-vanilla': 'error',
    '@emotion/import-from-emotion': 'error',
    '@emotion/styled-import': 'error',
    "react/jsx-no-bind": ['error', {
      "ignoreRefs": true,
      "allowArrowFunctions": true,
      "allowFunctions": true,
    }]
  },
};
