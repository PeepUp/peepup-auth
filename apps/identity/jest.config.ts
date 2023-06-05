import { Config } from "jest";

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
   moduleNameMapper: {
      "/^(.*)$/":
         "/home/tortuga/Documents/project/doFavour/apps/identity/src/lib/$1",
   },
};

export default config;
