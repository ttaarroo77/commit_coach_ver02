/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/frontend/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
  },
  testMatch: [
    '<rootDir>/apps/frontend/__tests__/**/*.test.{ts,tsx}',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { configFile: './.babelrc' }],
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  transformIgnorePatterns: [
    'node_modules/(?!(@radix-ui)/)',
  ],
}