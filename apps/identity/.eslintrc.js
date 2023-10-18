module.exports = {
    ...require("../../packages/config/eslint-server"),
    parserOptions: {
        root: true,
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.lint.json"],
    },
    rules: {
        "import/prefer-default-export": ["off" | "warn" | "error", { target: "single" }],
        "no-console": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "no-restricted-syntax": [
            "off",
            {
                selector:
                    "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                message: "Unexpected property on console object was called",
            },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/naming-convention": "off",
        "import/no-extraneous-dependencies": [
            "off",
            {
                devDependencies: false,
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
    },
};
