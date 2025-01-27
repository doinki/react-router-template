import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginSortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import pluginSortKeysFix from 'eslint-plugin-sort-keys-fix';
import pluginTrim from 'eslint-plugin-trim';
import pluginTypescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import pluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.react-router', 'build'] },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.node },
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: { '@typescript-eslint/ban-ts-comment': 'off' },
  },
  {
    extends: [
      pluginImport.flatConfigs.recommended,
      pluginImport.flatConfigs.typescript,
    ],
    rules: { 'import/no-cycle': 'error', 'import/no-unresolved': 'off' },
  },
  {
    ...pluginUnicorn.configs['flat/recommended'],
    rules: {
      ...pluginUnicorn.configs['flat/recommended'].rules,
      'unicorn/filename-case': [
        'error',
        { case: 'camelCase', ignore: ['react-router.config.ts'] },
      ],
      'unicorn/import-style': [
        'error',
        {
          styles: {
            'node:path': { default: false, named: true },
            path: { default: false, named: true },
          },
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prefer-string-slice': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      'sort-destructure-keys': pluginSortDestructureKeys,
      'sort-keys-fix': pluginSortKeysFix,
      'typescript-sort-keys': pluginTypescriptSortKeys,
    },
    rules: {
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
      'sort-destructure-keys/sort-destructure-keys': 'warn',
      'sort-keys-fix/sort-keys-fix': 'warn',
      'typescript-sort-keys/interface': 'warn',
      'typescript-sort-keys/string-enum': 'warn',
    },
  },
  {
    plugins: { trim: pluginTrim },
    rules: { 'trim/argument': 'warn', 'trim/class-name': 'warn' },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/jsx-sort-props': [
        'warn',
        { callbacksLast: true, reservedFirst: true, shorthandLast: true },
      ],
    },
    settings: { react: { version: 'detect' } },
  },
  {
    plugins: { 'react-hooks': pluginReactHooks },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  pluginReact.configs.flat['jsx-runtime'],
  pluginJsxA11y.flatConfigs.recommended,
  pluginPrettier,
);
