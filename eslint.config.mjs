import eslint from "@eslint/js";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import ymlPlugin from "eslint-plugin-yml";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

const extensions = {
    js: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    json: ["**/*.json"],
    ts: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    yml: ["**/*.yaml", "**/*.yml"],
};

export default defineConfig([
    globalIgnores(["node_modules", "dist", "storage"]),
    {
        extends: [prettierConfig],
        files: [...extensions.js, ...extensions.ts, ...extensions.json],
        ignores: ["package-lock.json"],
        languageOptions: {
            parser: tsEslintParser,
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": "error",
        },
    },
    {
        extends: [eslint.configs.recommended],
        files: [...extensions.js, ...extensions.ts],
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
                ...globals.es2022,
            },
            sourceType: "module",
        },
        rules: {
            "block-scoped-var": "error",
            camelcase: "error",
            eqeqeq: "error",
            "prefer-arrow-callback": "error",
        },
    },
    {
        extends: ["@typescript-eslint/recommended"],
        files: [...extensions.ts],
        plugins: {
            "@typescript-eslint": tsEslintPlugin,
        },
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },
    {
        extends: [perfectionist.configs["recommended-natural"]],
        files: [...extensions.js, ...extensions.ts],
        plugins: {
            sorter: perfectionist,
        },
        rules: {
            "sorter/sort-classes": "off",
            "sorter/sort-modules": "off",
        },
    },
    {
        extends: [ymlPlugin.configs["flat/recommended"]],
        files: [...extensions.yml],
        plugins: {
            yml: ymlPlugin,
        },
        rules: {
            "yml/no-empty-mapping-value": "off",
        },
    },
]);
