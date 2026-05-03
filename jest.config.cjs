module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp)\\?react$': '<rootDir>/src/tests/__mocks__/svgMock.js',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'src/services/auth.js',
    'src/services/api.js',
    'src/constants/categories.js',
    'src/components/UI/Input.jsx',
    'src/components/UI/BaseModal.jsx',
    'src/components/UI/ConfirmModal.jsx',
    'src/components/UI/ErrorModal.jsx',
    'src/components/UI/CategorySelect.jsx',
    'src/components/BudgetTab/BudgetTab.jsx',
    'src/components/Widgets/NextTripWidget.jsx',
    'src/components/Widgets/MonthStrip.jsx',
  ],
  coverageThreshold: {
    global: { lines: 70 },
  },
};
