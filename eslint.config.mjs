import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "next-env.d.ts",
    "app/generated/**",
  ]),
  ...storybook.configs["flat/recommended"],
  prettierConfig,
  {
    rules: {
      // Enforce arrow functions — no `function foo() {}`
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",

      // TypeScript strictness
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // React
      "react/self-closing-comp": "error",

      // Imports
      "import/no-duplicates": "error",
    },
  },
]);

export default eslintConfig;
