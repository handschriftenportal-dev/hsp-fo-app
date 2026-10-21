module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'plugin:json/recommended',
  ],
  rules: {
    'comma-dangle': 0,
    'space-before-function-paren': 0,
    'padded-blocks': 0,
    'no-multiple-empty-lines': 0,
    'import/first': 0,

    // see: https://stackoverflow.com/questions/63818415/react-was-used-before-it-was-defined/64024916#64024916
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': 1,
    'react/no-children-prop': 0,
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material/Tooltip',
            message:
              'Use the shared Tooltip wrapper from src/utils/Tooltip instead of MUI Tooltip directly.',
          },
          {
            name: '@mui/material',
            importNames: ['Tooltip'],
            message:
              'Use the shared Tooltip wrapper from src/utils/Tooltip instead of MUI Tooltip directly.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['test/**/*.{ts,tsx,js,jsx}'],
      extends: ['plugin:testing-library/react', 'plugin:jest/recommended'],
    },
  ],
}
