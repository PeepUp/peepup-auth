/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

const config = {
   preset: "ts-jest",
   testEnvironment: "node",
   extensionsToTreatAsEsm: [".ts"],
   verbose: true,
   // testURL: "http://localhost:4334/",
   testRegex: ".*\\.test\\.ts$",
   modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
   moduleNameMapper: pathsToModuleNameMapper(
      compilerOptions.paths /*, { prefix: '<rootDir>/' } */
   ),
   moduleFileExtensions: ["js", "ts"],
   transform: {
      // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
      // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
      "^.+\\.ts?$": [
         "ts-jest",
         {
            // ts-jest configuration goes here
         },
      ],
   },
};

module.exports = config;
