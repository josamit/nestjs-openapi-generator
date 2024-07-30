module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['twilio-ts'],
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  ignorePatterns: ['tsconfig.json'],

  env: {
    node: true,
  },

  rules: {
    camelcase: 0,
    'no-console': 0,
    'no-warning-comments': 0,

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-non-null-assertion': 0,

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, typedefs: false }],
  },
}
