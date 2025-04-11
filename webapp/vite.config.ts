import { parsePublicEnv } from '@brightideas/shared'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const publicEnv = parsePublicEnv(env)

  if (env.HOST_ENV !== 'local') {
    if (!env.SENTRY_AUTH_TOKEN) {
      throw new Error('SENTRY_AUTH_TOKEN is not defined')
    }
    if (!env.SOURCE_VERSION) {
      throw new Error('SOURCE_VERSION is not defined')
    }
  }

  return {
    plugins: [
      react(),
      // Твой плагин Sentry (убедись, что он определен корректно)
      env.SENTRY_AUTH_TOKEN && env.SOURCE_VERSION
        ? sentryVitePlugin({
            org: 'brightideas',
            project: 'webapp',
            authToken: env.SENTRY_AUTH_TOKEN,
            release: { name: env.SOURCE_VERSION },
          })
        : undefined,

      visualizer({
        open: true, // Автоматически открыть отчет в браузере
        gzipSize: true, // Показать размер после gzip
        filename: 'dist/stats.html',
      }),
    ].filter(Boolean),

    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },

    build: {
      sourcemap: true,
    },
    server: {
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
    test: {
      name: 'webapp', // Имя окружения
      globals: true, // describe, it, expect и т.д. без импорта vi
      environment: 'jsdom', // Обязательно для тестов, которым нужен DOM/браузерные API
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],

      // --- Очистка моков ---
      mockReset: true, // Сбрасывает моки до пустой функции (без реализации)

      // --- Таймауты ---
      testTimeout: 5000, // Стандартный таймаут
      hookTimeout: 10000,
    },
  }
})
