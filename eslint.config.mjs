// eslint.config.mjs
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
// Если используешь 'love', оставь. Иначе можно заменить на eslint:recommended, tsPlugin.configs.recommended
import love from 'eslint-config-love';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-node';
import vitestPlugin from 'eslint-plugin-vitest';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  { // Глобальные настройки и Игноры
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.tsbuildinfo',
    ],
    settings: {
      'import/resolver': { node: { extensions: ['.js', '.ts', '.tsx'] } },
      react: { version: 'detect' },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Определяем глобальные переменные для всего проекта
      globals: {
        ...globals.node,    // Для backend, конфигов, тестов в node
        ...globals.browser, // Для webapp
      },
    },
  },

  // --- Общие правила для ВСЕХ .ts/.tsx файлов (БЕЗ проверки типов) ---
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      node: nodePlugin, // Добавляем nodePlugin здесь для правила no-process-env
    },
    languageOptions: {
      parser: tsParser, // Указываем парсер
    },
    rules: {
      // Базовые правила (из 'love' или eslint/ts рекомендуемых)
      ...love.rules, // Если используешь 'love'
      // ...tsPlugin.configs.recommended.rules, // Альтернатива/дополнение к 'love'

      // Правила, НЕ требующие типов, которые ты хочешь применить ВЕЗДЕ
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off', // Пример выключения
      // ... другие общие правила без типов ...
      'import/order': ['error', { /* твои настройки */ }],
      'node/no-process-env': 'warn', // По умолчанию предупреждаем об использовании process.env
      'no-console': 'warn', // По умолчанию предупреждаем о console
      curly: ['error', 'all'],
      // ... другие ...
    },
  },

  // --- Правила с ПРОВЕРКОЙ ТИПОВ - ТОЛЬКО для SRC файлов ---
  {
    files: [
      'backend/src/**/*.{ts,tsx}',
      'webapp/src/**/*.{ts,tsx}',
      'shared/src/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parserOptions: {
        // Указываем ВСЕ tsconfig для исходников
        project: [
          './backend/tsconfig.json',
          './webapp/tsconfig.app.json', // Или tsconfig.json, если он ссылается на app.json
          './shared/tsconfig.json',
        ],
      },
    },
    // Не нужно указывать plugins/parser здесь, они наследуются из предыдущего блока
    rules: {
      // Здесь ТОЛЬКО правила, требующие project
      // ...tsPlugin.configs['recommended-type-checked'].rules, // Можно взять отсюда нужные
      // ...tsPlugin.configs['strict-type-checked'].rules, // Или отсюда

      // Твои правила, которые ТРЕБУЮТ типов:
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      // '@typescript-eslint/no-floating-promises': 'error', // Пример полезного правила
      '@typescript-eslint/restrict-template-expressions': 'off', // Если было выключено
      '@typescript-eslint/no-restricted-imports': ["error", { patterns: [ /* ... */] }], // Может требовать типов

      // Переопределяем правила из общего блока для SRC
      'node/no-process-env': ['error', { allow: ['NODE_ENV', 'HOST_ENV'] }], // Запрещаем process.env в src, кроме разрешенных
      'no-console': 'error', // Запрещаем console в src
    },
  },

  // --- Конфигурация для React (только для webapp/src) ---
  {
    files: ['webapp/src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // Переопределяем no-console для webapp/src (если нужно иначе, чем error)
      'no-console': ['warn', { allow: ['info', 'error', 'warn'] }],
    },
  },

  // --- Конфигурация для ТЕСТОВ (без проверки типов) ---
  {
    files: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      // Ослабляем/отключаем правила для тестов
      'no-console': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off', // Отключаем правила с проверкой типов
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'node/no-process-env': 'off', // Разрешаем process.env
    },
  },

  // --- Prettier (в самом конце) ---
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    ...prettier,
  },
];