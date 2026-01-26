import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { 
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            // Add these common, stricter rules:
            //"no-console": "warn",           // Warn on console statements
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn on unused vars
            "semi": ["error", "always"],    // Require semicolons
            "quotes": ["error", "double"],  // Double quotes
            "indent": ["error", 4],         // 4-space indentation
            "comma-dangle": ["error", "always-multiline"], // Trailing commas
            "prefer-const": "error",        // Prefer const over let
            "arrow-parens": ["error", "always"], // Always use parens in arrow functions
            "object-curly-spacing": ["error", "always"], // Spaces inside braces
            "array-bracket-spacing": ["error", "never"], // No spaces in array brackets
        },
    },
]);