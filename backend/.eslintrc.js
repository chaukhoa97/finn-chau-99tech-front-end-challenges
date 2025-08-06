module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
}
