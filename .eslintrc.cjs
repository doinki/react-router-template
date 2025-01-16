/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['mado', 'mado/tailwindcss', 'plugin:prettier/recommended'],
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  root: true,
  rules: {
    'import/extensions': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: require.resolve('./tsconfig.json'),
      },
    },
  },
};
