import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "tsconfig";
import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts", ".js", ".json"],
    verbose: true,
    // set only if on test environment
    /* testURL: "http://localhost:4334/", */
    testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleFileExtensions: ["js", "ts"],
    transform: {
        "^.+\\.ts?$": ["ts-jest", {}],
    },
};

export default config;
