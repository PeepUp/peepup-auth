/** @type {import('eslint').Linter.Config} */
module.exports = {
	plugins: [
		"prettier",
		"simple-import-sort",
		"@typescript-eslint",
		"eslint-plugin-tsdoc",
	],
	extends: [
		"airbnb-base",
		"airbnb-typescript/base",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:prettier/recommended",
		"airbnb-base",
		"plugin:prettier/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
	],
	rules: {
		"import/extensions": "off",
		"import/order": "off",
		"prettier/prettier": "error",
		"import/prefer-default-export": "off",
		"import/no-named-as-default": "off",
		"simple-import-sort/exports": "warn",
		"no-underscore-dangle": "off",
		"simple-import-sort/imports": [
			"warn",
			{
				groups: [
					// Packages and side effect imports.
					["^@?\\w", "^\\u0000"],
					// Components and providers.
					["^@/components", "^@/providers"],
					// Hooks
					["^@/hooks"],
					// Utils, helpers, and lib
					["^@/utils", "^@/helpers", "^@/lib"],
					// Other absolute imports.
					["^@/"],
					// Relative imports.
					["^\\."],
					// Import type and types.
					["^.*\\u0000$", "^@/types"],
					// Styles.
					["^.+\\.s?css$"],
					// Anything not matched in another group.
					["^"],
				],
			},
		],
	},
	parser: "@typescript-eslint/parser",
	ignorePatterns: [
		".next",
		".turbo",
		"node_modules",
		"**/*.js",
		"**/*.mjs",
		"**/*.jsx",
	],
};
