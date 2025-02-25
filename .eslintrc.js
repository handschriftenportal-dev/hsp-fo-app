module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:json/recommended',
  ],
  rules: {
    'comma-dangle': 0,
    'space-before-function-paren': 0,
    'padded-blocks': 0,
    'no-multiple-empty-lines': 0,
    'import/first': 0,
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
      },
    ],

    // see: https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined/64024916#64024916
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': 1,
    'prettier/prettier': 1,
    'react/no-children-prop': 0,
  },
}
