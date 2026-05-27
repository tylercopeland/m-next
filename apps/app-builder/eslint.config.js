const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const importPlugin = require('eslint-plugin-import');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const jestPlugin = require('eslint-plugin-jest');
const emotion = require('@emotion/eslint-plugin');
const reactPerf = require('eslint-plugin-react-perf');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['eslint.config.js', 'jest.config.cjs', 'babel.config.cjs', 'webpack.config.cjs'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        ResizeObserver: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
        global: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      jest: jestPlugin,
      '@emotion': emotion,
      'react-perf': reactPerf,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-constant-binary-expression': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'ban-ts-comment': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
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
      'import/no-named-default': 'error',
      'import/no-named-as-default': 0,
      'import/no-unresolved': 'error',
      'no-prototype-builtins': 'error',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-unused-expressions': 'warn',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'warn',
      'no-use-before-define': 'warn',
      'object-shorthand': 'warn',
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.jsx', '.tsx'],
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
      'react/button-has-type': 'warn',
      'react/no-array-index-key': 'warn',
      'react/react-in-jsx-scope': 'error',
      'react/jsx-uses-react': 'error',
      'react/display-name': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/function-component-definition': 'off',
      '@emotion/jsx-import': 'off',
      '@emotion/no-vanilla': 'error',
      '@emotion/import-from-emotion': 'error',
      '@emotion/styled-import': 'error',
      'react/jsx-no-bind': [
        'error',
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: true,
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        ResizeObserver: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
        global: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin, // ✅ this is the missing piece
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      jest: jestPlugin,
      '@emotion': emotion,
      'react-perf': reactPerf,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-constant-binary-expression': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],

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
      'import/no-named-default': 'error',
      'import/no-named-as-default': 0,
      'import/no-unresolved': 'error',
      'no-prototype-builtins': 'error',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      'no-unused-expressions': 'warn',
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'warn',
      'no-use-before-define': 'warn',
      'object-shorthand': 'warn',
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.jsx', '.tsx'],
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
      'react/button-has-type': 'warn',
      'react/no-array-index-key': 'warn',
      'react/react-in-jsx-scope': 'error',
      'react/jsx-uses-react': 'error',
      'react/display-name': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/function-component-definition': 'off',
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
      'react/jsx-no-bind': [
        'error',
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: true,
        },
      ],
    },
  },
];
