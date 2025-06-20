// Jest config for ES Modules (ExpenseTracker backend)
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './coverage',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/jest.setup.js'],
  // Add more config as needed for ESM
};
