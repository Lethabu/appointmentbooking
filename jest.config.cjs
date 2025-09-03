const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^convex/react$': '<rootDir>/__mocks__/convex/react.js',
    '^convex/_generated/api$': '<rootDir>/__mocks__/convex/_generated/api.js',
  },
};

module.exports = createJestConfig(customJestConfig);