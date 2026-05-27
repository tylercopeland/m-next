// @ts-check
import globals from 'globals';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'src/angular/old-externals',
      'src/angular/old-components',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-fallthrough': 'warn',
      'no-extra-semi': 'off',
    },
  },
  { // SETTINGS THAT ONLY APPLY TO ANGULAR LEGACY CODE
    files: ["src/angular/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        // ...globals.node,
        angular: "readonly",
        $: "readonly",
        moment: "readonly",
        glblScreenWidget: "readonly",
        mi: "readonly",
        miStore: "readonly", // only used in one place, but does .dispatch()!!
        setScreenAsDirty: "readonly", // legacy designer global function
        dsSave: "readonly", // legacy designer global function
        $selectedObj: "writable",
      },
    },
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
      'no-extra-semi': 'off',
    }
  }
);