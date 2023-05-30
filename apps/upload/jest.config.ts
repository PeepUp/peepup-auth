import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
	/* Preference settings */
	verbose: true, // verbose enabled
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js", "json"],
	testRegex: ".*\\.test\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	/* Global test preference */
	collectCoverageFrom: ["**/*.(t|j)s"],
	clearMocks: true,
	coveragePathIgnorePatterns: ["/node_modules"],
	collectCoverage: true,
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/src/**/*.ts",
	}),
};

export default config;
