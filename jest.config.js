module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^data-source$": "<rootDir>/src/data-source.ts",
    "^modules/(.*)$": "<rootDir>/src/modules/$1",
    "^infra/(.*)$": "<rootDir>/src/infra/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleDirectories: ["node_modules", "src"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
