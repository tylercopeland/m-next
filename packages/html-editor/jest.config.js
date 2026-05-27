module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '@m-next/styles': '<rootDir>/src/__mocks__/stylesMock.js',
    '@m-next/svg-icon': '<rootDir>/src/__mocks__/svgIconMock.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@m-one)/)'],
  coveragePathIgnorePatterns: ['/node_modules/', '\\.stories\\.tsx$'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
