module.exports =
{
  "env": {
    "browser": true
  },
  "extends": [ 
    "eslint:recommended", 
    "airbnb", 
    "airbnb-typescript",
    "prettier", 
    "plugin:jest/recommended", 
    "plugin:jsx-a11y/strict",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "experimentalObjectRestSpread": true
    },
    "tsconfigRootDir": __dirname,
    "project": "tsconfig.json"
  },
  "plugins": ["import", "jest", "jsx-a11y", "@typescript-eslint"],
  "reportUnusedDisableDirectives": true,
  "rules": {
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "@typescript-eslint/dot-notation": "off",
    "@typescript-eslint/no-explicit-any": "error",
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src/**"]
      }
    }
  },
  "overrides": [
    {
      "files": ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"]
    }
  ],
};