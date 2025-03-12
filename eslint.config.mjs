import tsParser from '@typescript-eslint/parser'
import love from 'eslint-config-love'
import prettier from 'eslint-config-prettier'
import nodePlugin from 'eslint-plugin-node';
import jestPlugin from 'eslint-plugin-jest';


export default [
  {
    ignores: ['node_modules', 'dist', '*.config.js'],
  },

  {
    ...love,
    // Файлы, к которым применяются эти настройки
    files: ['backend/**/*.ts', 'backend/**/*.tsx'],
    languageOptions: {
      // Ставим сам парсер
      parser: tsParser,
      // Сливаем parserOptions, если их задаёт love,
      // + указываем нужный tsconfig
      parserOptions: {
        ...love.languageOptions?.parserOptions,
        // Можно передать массив, если у вас несколько tsconfig
        project: ['./backend/tsconfig.json'],
        // Часто нужно указать корень репо для правильных путей:
        // tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
    },
    rules: {
      "no-console": "error",
    }
  },

  {
    ...love,
    files: ['webapp/**/*.ts', 'webapp/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ...love.languageOptions?.parserOptions,
        project: ['./webapp/tsconfig.json'],
        // tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
    },
    rules: {
      'no-console': [
        'error',
        {
          allow: ['info', 'error', 'warn'],
        },
      ],
    }
  },

  {
    ...love,
    files: ['shared/**/*.ts', 'shared/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ...love.languageOptions?.parserOptions,
        project: ['./shared/tsconfig.json'],
      },
    },
  },

  {
    ...prettier,
    files: ['**/*.ts', '**/*.tsx'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      'arrow-body-style': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'eslint-comments/require-description': 'off',
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@brightideas/backend/**",
                "!@brightideas/backend/**/",
                "!@brightideas/backend/**/input",
                "!@brightideas/backend/src/utils/can",
              ],
              allowTypeImports: true,
              message:
                "Only types and input schemas are allowed to be imported from backend workspace",
            },
          ],
        },
      ],
      "@typescript-eslint/prefer-destructuring": "off",
      curly: ['error', 'all'],
      'no-irregular-whitespace': [
        'error',
        {
          skipTemplates: true,
          skipStrings: true,
        },
      ],

      'node/no-process-env': "error",
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],

    },
  },

  {
    plugins: {
      node: nodePlugin,
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    extends: ['plugin:jest/recommended'],
    plugins: {
      jest: jestPlugin,
    },
  }


]
