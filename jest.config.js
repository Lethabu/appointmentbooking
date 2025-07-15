/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
    '^.+\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/**/*.test.{ts,tsx}',
    '!components/**/index.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};