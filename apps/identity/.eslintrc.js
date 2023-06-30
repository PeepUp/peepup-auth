module.exports = {
    extends: ["@dofavour/eslint-config-typescript"],
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    files: ["*.ts"],
    parserOptions: {
        project: ["**/tsconfig.json"],
    },
};
