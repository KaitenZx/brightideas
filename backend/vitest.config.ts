import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'backend', // Имя окружения (полезно при запуске из корня)
    environment: 'node', // Обязательно для бэкенда
    globals: true, // describe, it, expect и т.д. без импорта vi
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'], // Стандартный паттерн для поиска тестов
    passWithNoTests: true, // Игнорировать отсутствие тестов
    logHeapUsage: true, // Полезно для отслеживания утечек памяти в долгих тестах
    pool: 'threads',
    poolOptions: {
      threads: {
        isolate: false,
        singleThread: true,
      },
    },
    testTimeout: 10000, // 10 секунд на тест
    hookTimeout: 15000, // 15 секунд на beforeEach/afterAll
  },
})
