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
  // что не линтим
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**", "storybook-static/**"],
  }, // базовые рекомендации ESLint
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
];

// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import { defineConfig, globalIgnores } from 'eslint/config'
//
// export default defineConfig([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs.flat.recommended,
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])
