declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    webappEnvFromBackend?: Record<string, string | undefined>
  }
}

/* eslint-disable no-restricted-syntax */
import { zEnvHost, zEnvNonemptyTrimmed } from '@brightideas/shared'
import { z } from 'zod'

export const webAppEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvHost,
    SOURCE_VERSION: zEnvNonemptyTrimmed.optional(),

    VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed.url(),
    VITE_WEBAPP_URL: zEnvNonemptyTrimmed.url(),
    VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
    VITE_S3_URL: zEnvNonemptyTrimmed.url(),

    VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmed.url().optional(),
    VITE_MIXPANEL_API_KEY: zEnvNonemptyTrimmed.optional(),
  })
  .refine((data) => data.HOST_ENV === 'local' || !!data.VITE_WEBAPP_SENTRY_DSN, {
    message: 'VITE_WEBAPP_SENTRY_DSN is required in production',
    path: ['VITE_WEBAPP_SENTRY_DSN'],
  })
  .refine((data) => data.HOST_ENV === 'local' || !!data.VITE_MIXPANEL_API_KEY, {
    message: 'VITE_MIXPANEL_API_KEY is required in production',
    path: ['VITE_MIXPANEL_API_KEY'],
  })

export type WebAppEnv = z.infer<typeof webAppEnvSchema>

let validatedEnv: WebAppEnv | null = null

export function initializeWebAppEnv(): WebAppEnv | null {
  if (validatedEnv) {
    console.warn('WebApp environment already initialized.')
    return validatedEnv // <--- Возвращаем существующий
  }

  let envSource: Record<string, string | undefined> = {}
  let sourceDescription: string = ''

  if (import.meta.env.DEV) {
    sourceDescription = 'import.meta.env (Vite dev)'
    envSource = {
      NODE_ENV: import.meta.env.MODE,
      HOST_ENV: import.meta.env.VITE_HOST_ENV || 'local',
      SOURCE_VERSION: import.meta.env.VITE_SOURCE_VERSION,
      VITE_BACKEND_TRPC_URL: import.meta.env.VITE_BACKEND_TRPC_URL,
      VITE_WEBAPP_URL: import.meta.env.VITE_WEBAPP_URL,
      VITE_WEBAPP_SENTRY_DSN: import.meta.env.VITE_WEBAPP_SENTRY_DSN,
      VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      VITE_S3_URL: import.meta.env.VITE_S3_URL,
      VITE_MIXPANEL_API_KEY: import.meta.env.VITE_MIXPANEL_API_KEY,
    }
  } else {
    sourceDescription = 'window.webappEnvFromBackend (injected by server)'
    envSource = window.webappEnvFromBackend || {}
  }

  try {
    if (envSource.NODE_ENV !== 'production') {
      envSource.NODE_ENV = 'development'
    }
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

export function getWebAppEnv(): WebAppEnv {
  if (!validatedEnv) {
    throw new Error('WebApp environment accessed before initialization. Call initializeWebAppEnv() first.')
  }
  return validatedEnv
}
