/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Directories Jest should scan to collect coverage
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],

  // Directory where Jest should output coverage files
  coverageDirectory: "coverage",

  // Use babel instead of v8 (v8 can be buggy)
  coverageProvider: "babel",

  // Resolve @ alias imports
  moduleNameMapper: {
    "@/tests/(.*)$": "<rootDir>/tests/src/$1",
    "@/(.*)$": "<rootDir>/src/$1",
  },

  // Trigger tests when files in src or tests change
  roots: ["<rootDir>/src", "<rootDir>/tests"],

  // Transform TypeScript files using ts-jest
  transform: {
    "\\.ts$": "ts-jest",
  },
};

module.exports = config;
