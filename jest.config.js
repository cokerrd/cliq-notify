module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",

  testMatch: ["**/test/**/*.test.js"],

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
