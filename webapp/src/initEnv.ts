/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-restricted-syntax */
import { loadAndValidateSharedEnv } from '@brightideas/shared'

declare global {
  interface Window {
    webappEnvFromBackend?: Record<string, string | undefined>
  }
  // Добавим типизацию для import.meta.env, если используем TS
  interface ImportMetaEnv {
    DEV: boolean
    readonly VITE_WEBAPP_URL?: string
    readonly VITE_CLOUDINARY_CLOUD_NAME?: string
    readonly VITE_S3_URL?: string
    // Добавь сюда другие VITE_ переменные, если они нужны фронтенду
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export function initializeEnvironment(): boolean {
  let frontendEnvSource: Record<string, string | undefined> = {}
  let sourceDescription: string = ''

  // --- Условная логика ---
  if (import.meta.env.DEV) {
    // --- Режим разработки (pnpm dev) ---
    // Читаем переменные из import.meta.env, которые Vite подставляет из .env файлов
    sourceDescription = 'import.meta.env (Vite dev)'
    frontendEnvSource = {
      // Явно перечисляем переменные, ожидаемые loadAndValidateSharedEnv
      WEBAPP_URL: import.meta.env.VITE_WEBAPP_URL,
      CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      S3_URL: import.meta.env.VITE_S3_URL,
      // Добавь другие переменные, если они есть в loadAndValidateSharedEnv
    }
    // Удаляем ключи со значением undefined, чтобы не ломать Zod, если переменная не задана в .env
    Object.keys(frontendEnvSource).forEach((key) => {
      if (frontendEnvSource[key] === undefined) {
        delete frontendEnvSource[key]
      }
    })
  } else {
    // --- Режим Production (после сборки/деплоя) ---
    // Читаем из объекта, внедренного бэкендом
    sourceDescription = 'window.webappEnvFromBackend (injected by server)'
    frontendEnvSource = window.webappEnvFromBackend || {}
  }
  // ----------------------

  try {
    loadAndValidateSharedEnv(frontendEnvSource)
    return true
  } catch (error) {
    console.error(`FATAL: Failed to load shared environment variables from ${sourceDescription}!`, error)
    // Отображение ошибки в UI остается прежним
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: red;">Error: Application environment failed to load. Please check the console or contact support.</div>'
    }
    // Логируем исходные данные, которые не прошли валидацию
    console.error('Raw values used:', frontendEnvSource)
    // Логируем ошибки валидации Zod
    if (error instanceof Error && 'issues' in error) {
      // Проверяем, что это ZodError
      console.error('Validation errors:', error)
    }
    return false
  }
}
