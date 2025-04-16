declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    webappEnvFromBackend?: Record<string, string | undefined>
  }
}

/* eslint-disable no-restricted-syntax */
import { zEnvHost, zEnvNonemptyTrimmed } from '@brightideas/shared'
import { z } from 'zod'

// 1. Определяем Zod-схему ТОЛЬКО для runtime переменных фронтенда
export const webAppEnvSchema = z
  .object({
    // Переменные, которые ДОЛЖНЫ быть доступны в runtime
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvHost, // 'local' | 'production'
    SOURCE_VERSION: zEnvNonemptyTrimmed.optional(), // Может быть полезен для Sentry на фронте

    // Все VITE_ переменные, нужные в браузере
    VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed.url(),
    VITE_WEBAPP_URL: zEnvNonemptyTrimmed.url(),
    VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
    VITE_S3_URL: zEnvNonemptyTrimmed.url(),

    // Используем refine с доступом ко всему объекту для условной валидации
    VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmed.url().optional(),
    VITE_MIXPANEL_API_KEY: zEnvNonemptyTrimmed.optional(), // Сделаем пока опциональным, добавим refine ниже
  })
  .refine((data) => data.HOST_ENV === 'local' || !!data.VITE_WEBAPP_SENTRY_DSN, {
    message: 'VITE_WEBAPP_SENTRY_DSN is required in production',
    path: ['VITE_WEBAPP_SENTRY_DSN'],
  })
  .refine((data) => data.HOST_ENV === 'local' || !!data.VITE_MIXPANEL_API_KEY, {
    message: 'VITE_MIXPANEL_API_KEY is required in production',
    path: ['VITE_MIXPANEL_API_KEY'],
  })

// 2. Тип для удобства
export type WebAppEnv = z.infer<typeof webAppEnvSchema>

// 3. Переменная для хранения провалидированных значений (синглтон)
let validatedEnv: WebAppEnv | null = null

// 4. Функция инициализации (вызывается один раз в main.tsx)
export function initializeWebAppEnv(): WebAppEnv | null {
  if (validatedEnv) {
    console.warn('WebApp environment already initialized.')
    return validatedEnv // <--- Возвращаем существующий
  }

  let envSource: Record<string, string | undefined> = {}
  let sourceDescription: string = ''

  if (import.meta.env.DEV) {
    // --- Режим разработки (pnpm dev) ---
    sourceDescription = 'import.meta.env (Vite dev)'
    // Собираем переменные ИЗ import.meta.env
    envSource = {
      NODE_ENV: import.meta.env.MODE, // 'development' или 'production' в зависимости от команды Vite
      HOST_ENV: import.meta.env.VITE_HOST_ENV || 'local', // Vite не знает про HOST_ENV, берем из VITE_ или ставим local
      SOURCE_VERSION: import.meta.env.VITE_SOURCE_VERSION, // Должен быть VITE_SOURCE_VERSION в .env
      VITE_BACKEND_TRPC_URL: import.meta.env.VITE_BACKEND_TRPC_URL,
      VITE_WEBAPP_URL: import.meta.env.VITE_WEBAPP_URL,
      VITE_WEBAPP_SENTRY_DSN: import.meta.env.VITE_WEBAPP_SENTRY_DSN,
      VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      VITE_S3_URL: import.meta.env.VITE_S3_URL,
      VITE_MIXPANEL_API_KEY: import.meta.env.VITE_MIXPANEL_API_KEY,
      // Добавь сюда остальные VITE_, если они нужны
    }
    // Добавляем NODE_ENV и HOST_ENV из process.env если они там есть (на всякий случай для консистентности)
    // envSource.NODE_ENV = envSource.NODE_ENV || process.env.NODE_ENV;
    // envSource.HOST_ENV = envSource.HOST_ENV || process.env.HOST_ENV;
  } else {
    // --- Режим Production (после сборки/деплоя) ---
    sourceDescription = 'window.webappEnvFromBackend (injected by server)'
    envSource = window.webappEnvFromBackend || {}
  }

  try {
    // Приводим NODE_ENV к нужному типу перед валидацией
    if (envSource.NODE_ENV !== 'production') {
      envSource.NODE_ENV = 'development' // Или другой дефолт если надо
    }
    // Устанавливаем HOST_ENV если его нет (например, в import.meta.env)
    if (!envSource.HOST_ENV) {
      envSource.HOST_ENV = envSource.NODE_ENV === 'production' ? 'production' : 'local'
    }

    console.info(`Initializing WebApp environment from ${sourceDescription}...`)
    validatedEnv = webAppEnvSchema.parse(envSource)
    return validatedEnv
  } catch (error) {
    console.error(`FATAL: Failed to initialize WebApp environment from ${sourceDescription}!`)
    console.error('Raw values used:', envSource)
    console.error('Validation errors:', error)

    // Отображаем ошибку пользователю
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: red;">Error: Application environment failed to load. Please check the console or contact support.</div>'
    }
    return null
  }
}

// 5. Функция для получения доступа к переменным (используется везде в webapp)
export function getWebAppEnv(): WebAppEnv {
  if (!validatedEnv) {
    throw new Error('WebApp environment accessed before initialization. Call initializeWebAppEnv() first.')
  }
  return validatedEnv
}
