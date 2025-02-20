module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**'],
  coverageDirectory: './test-reports',
  coverageReporters: ['lcov'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-reports',
        suiteName: 'hsp-fo-app',
      },
    ],
  ],
  testMatch: ['**/test/**/*.spec.ts', '**/test/**/*.spec.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/test/testutils/mockPersist.ts'],
  moduleNameMapper: {
    '@fontsource/*': '<rootDir>/test/testutils/fontMock.ts',
    // see https://github.com/uuidjs/uuid/issues/451#issuecomment-1112328417
    // this can be removed, when all modules (mirador & up) depend on uuid >= 9
    "uuid": require.resolve('uuid'),
    "url-join": require.resolve('proper-url-join'),
    'redux-persist': '<rootDir>test/testutils/mockPersist.ts'
  },
}
