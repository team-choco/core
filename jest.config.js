module.exports = {
  preset: 'ts-jest',
  cacheDirectory: './node_modules/.cache/jest',
  clearMocks: true,
  // windows ci is terribly slow, so let's not burden it with coverage
  // collectCoverage: process.env.CI && process.env.TRAVIS_OS_NAME !== 'windows',
  collectCoverageFrom: [
    'packages/**/*.ts',
  ],
  coveragePathIgnorePatterns : [
    '<rootDir>/.*/dist/',
    '<rootDir>/.*/test-helpers/',
  ],
  roots: ['<rootDir>/packages'],
  testEnvironment: 'node',
  verbose: Boolean(process.env.CI),
};
