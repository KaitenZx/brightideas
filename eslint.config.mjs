import tsParser from '@typescript-eslint/parser'
import love from 'eslint-config-love'
import prettier from 'eslint-config-prettier'

export default [
  // 1. Игнорируем общие папки
  {
    ignores: ['node_modules', 'dist'],
  },

  // 2. Настраиваем бэкенд
  {
    // Разворачиваем все ключи из love
    ...love,
    // Файлы, к которым применяются эти настройки
    files: ['backend/**/*.ts', 'backend/**/*.tsx'],
    // В новом формате ESLint, чтобы заработала
    // типизированная проверка, нужно явно задать parser + project
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
  },

  // 3. Настраиваем фронтенд
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
  },

  // 4. Подключаем prettier-конфиг, чтобы отключать конфликтующие правила
  {
    ...prettier,
    files: ['**/*.ts', '**/*.tsx'],
  },

  // 5. Ваши доп. правила (перезапишут правила из love, если совпадают)
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
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@brightideas/backend/**",
                "!@brightideas/backend/**/",
                "!@brightideas/backend/**/input",
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
      'no-console': [
        'error',
        {
          allow: ['info', 'error', 'warn'],
        },
      ],
    },
  },
]
