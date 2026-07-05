// Config única na raiz, cobrindo todos os workspaces (backend Node/TS e
// frontend React/TS). Uso ".mjs" porque o package.json raiz não é ESM
// ("type" não é "module") — assim o ESLint carrega isso sem depender de
// mudar o resto do projeto.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "**/prisma/migrations/**",
      "**/coverage/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Backend (Node): apps/api-public, apps/api-sync, apps/gateway, packages/*
  {
    files: [
      "apps/api-public/**/*.ts",
      "apps/api-sync/**/*.ts",
      "apps/gateway/**/*.ts",
      "packages/**/*.ts",
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Frontend (React): apps/web
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // JSX runtime automático (React 18)
      "react/prop-types": "off", // tipagem já é feita via TypeScript
    },
  },

  // apps/web/src/assets/components.js é JS puro (styled-components), sem tipos
  {
    files: ["apps/web/src/assets/**/*.js"],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },

  // Regras mais permissivas em arquivo de teste (mocks costumam usar "any")
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Regras de nível de projeto
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  }
);
