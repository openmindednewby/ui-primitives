/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // RN components render on the web via react-native-web in tests. Pin every
    // react / react-dom / react-native-web import (INCLUDING subpaths like
    // `react-dom/client`) to THIS package's own copies. The `file:` link to
    // @dloizides/ui-feedback ships its own react/react-dom/react-native-web; if
    // those leak in we get two React copies ("invalid hook call") and, when the
    // two copies differ by a patch, an "Incompatible React versions" crash.
    '^react-native$': '<rootDir>/node_modules/react-native-web',
    '^react-native-web$': '<rootDir>/node_modules/react-native-web',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react$': '<rootDir>/node_modules/react',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  }
};
