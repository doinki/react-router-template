/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['mado', 'plugin:prettier/recommended'],
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  root: true,
  rules: {
    'import/extensions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: require.resolve('./tsconfig.json'),
      },
    },
  },
};
