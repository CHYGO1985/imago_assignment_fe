// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import typescriptParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

// turn your old .eslintrc.js into a JSON object:
const legacyConfig = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    /* … */
  },
  plugins: [
    /* … */
  ],
  extends: [
    /* … */
  ],
  settings: {
    /* … */
  },
  rules: {
    /* … */
  },
};

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: true,
});

/** @type {import('eslint').FlatConfig[]} */
export default [
  // load all of your old rules/plugins via the compat layer
  ...compat.config(legacyConfig),
];
