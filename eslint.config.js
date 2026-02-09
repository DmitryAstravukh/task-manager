// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "storybook-static/**"],
  },
  js.configs.recommended, // рекомендации для TypeScript
  ...tseslint.configs.recommended, // правила для React-проекта
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React 17+ JSX runtime — react/react-in-jsx-scope не нужен
      "react/react-in-jsx-scope": "off",

      // хуки
      ...reactHooks.configs.recommended.rules,

      // Vite HMR
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  }, // отключает правила ESLint, которые конфликтуют с Prettier

  prettier,
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.stories.@(ts|tsx)"],
    rules: {
      "storybook/no-global-expect": "off",
      "storybook/no-renderer-packages": "off",
    },
  },
  {
    files: [".storybook/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "storybook/no-global-expect": "off",
      "storybook/no-renderer-packages": "off",
    },
  },
];
