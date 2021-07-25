module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js"],
  roots: ["<rootDir>"],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  modulePaths: ["<rootDir>"],
  globalSetup: "<rootDir>/tests/global-setup.js",
  globalTeardown: "<rootDir>/tests/global-teardown.js",
}
