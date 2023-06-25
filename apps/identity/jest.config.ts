import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import type { Config } from "jest";

const config: Config = {
   preset: "ts-jest",
   testEnvironment: "node",
   extensionsToTreatAsEsm: [".ts"],
   verbose: true,
   // set only if on test environment
   /* testURL: "http://localhost:4334/", */
   testRegex: ".*\\.test\\.ts$",
   modulePaths: [compilerOptions.baseUrl], // set to be 'baseUrl' value
   moduleNameMapper: pathsToModuleNameMapper(
      compilerOptions.paths /*, { prefix: '<rootDir>/' } */
   ),
   moduleFileExtensions: ["js", "ts"],
   transform: {
      "^.+\\.ts?$": [
         "ts-jest",
         {
            // ...ts-jest configuration
         },
      ],
   },
};

export default config;
