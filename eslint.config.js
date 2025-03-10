import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginSortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import pluginSortKeysFix from 'eslint-plugin-sort-keys-fix';
import pluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { config, configs } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gitignorePath = path.resolve(__dirname, '.gitignore');
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

export default config(
  includeIgnoreFile(gitignorePath),
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended,
  configs.recommended,
  {
    rules: { '@typescript-eslint/ban-ts-comment': 'off' },
  },
  {
    extends: [pluginImport.flatConfigs.recommended, pluginImport.flatConfigs.typescript],
    rules: { 'import/no-cycle': 'error', 'import/no-unresolved': 'off' },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: tsconfigPath,
        },
      },
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/function-component-definition': ['warn', { namedComponents: 'function-declaration' }],
      'react/jsx-boolean-value': 'warn',
      'react/jsx-sort-props': [
        'warn',
        { callbacksLast: true, reservedFirst: true, shorthandLast: true },
      ],
      'react/prop-types': 'off',
      'react/self-closing-comp': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    plugins: { 'react-hooks': pluginReactHooks },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: 'useIsomorphicLayoutEffect' }],
    },
  },
  pluginReact.configs.flat['jsx-runtime'],
  {
    ...pluginJsxA11y.flatConfigs.recommended,
    rules: {
      ...pluginJsxA11y.flatConfigs.recommended.rules,
      'jsx-a11y/anchor-is-valid': ['warn', { specialLink: ['to'] }],
    },
    settings: { 'jsx-a11y': { components: { Link: 'a' } } },
  },
  {
    ...pluginUnicorn.configs.recommended,
    rules: {
      ...pluginUnicorn.configs.recommended.rules,
      'unicorn/better-regex': 'warn',
      'unicorn/filename-case': ['warn', { case: 'kebabCase' }],
      'unicorn/no-null': 'off',
      'unicorn/prefer-string-slice': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/require-post-message-target-origin': 'warn',
    },
  },
  {
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      'sort-destructure-keys': pluginSortDestructureKeys,
      'sort-keys-fix': pluginSortKeysFix,
    },
    rules: {
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
      'sort-destructure-keys/sort-destructure-keys': 'warn',
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  pluginPrettier,
);
