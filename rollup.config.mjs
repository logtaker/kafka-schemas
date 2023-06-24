import ts from "@rollup/plugin-typescript";

export default {
    input: "typescript/index.ts",
    output: [
        {
            file: "javascript/index.cjs",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "javascript/index.mjs",
            format: "es",
            sourcemap: true,
        }
    ],
    plugins: [ts({tsconfig: "./tsconfig.json"})]
};