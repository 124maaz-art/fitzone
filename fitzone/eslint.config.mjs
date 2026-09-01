import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone DB seed script (Node/CommonJS, outside the app bundle).
    "prisma/**",
  ]),
  {
    rules: {
      // Admin CRUD actions deliberately accept flexible payloads (input: any).
      "@typescript-eslint/no-explicit-any": "off",
      // Allow punctuation/apostrophes in JSX content.
      "react/no-unescaped-entities": "off",
      // New React Compiler rule; some setup patterns are intentionally synchronous.
      "react-hooks/set-state-in-effect": "off",
      // Framework-required unused callback props (e.g. Error Boundary `error`).
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
]);

export default eslintConfig;
