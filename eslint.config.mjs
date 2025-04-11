// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  ignores: [
    "node_modules/**/*.*",
    "support/**/*.*",
    "build/**/*.*",
    "test/.mocharc.js",
  ],
},
{
  files: [
    "**/*.js",
    "**/*.cjs",
    "**/*.mjs",
    "**/*.ts",
  ],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    stylistic.configs.recommended,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@stylistic/brace-style": ["error", "1tbs"],
    "@stylistic/semi-style": ["error", "last"],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/quotes": ["error", "double"],
  },
},
{
  files: ["eslint.config.mjs"],
  extends: [tseslint.configs.disableTypeChecked],
},
);
