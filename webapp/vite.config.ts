import { parsePublicEnv } from '@brightideas/shared'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'
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
      !env.SENTRY_AUTH_TOKEN
        ? undefined
        : sentryVitePlugin({
            org: 'brightideas',
            project: 'webapp',
            authToken: env.SENTRY_AUTH_TOKEN,
            release: { name: env.SOURCE_VERSION },
          }),
    ],

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
  }
})
