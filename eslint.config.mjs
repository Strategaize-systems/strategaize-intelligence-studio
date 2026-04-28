// ESLint v9 flat config — minimal Setup, kompatibel mit Next 16.
// next-eslint-plugin hat noch keinen flat-config-Support fuer Next 16,
// daher hier nur TS-Recommended + projektspezifische Regeln.

import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "node_modules/**",
      "next-env.d.ts",
      "reference/**",
      "scripts/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Skeleton-Adapter haben unbenutzte Imports (per spec, throw not implemented).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Skeleton-Module nutzen `void X` zur Compile-Zeit-Verifikation
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
