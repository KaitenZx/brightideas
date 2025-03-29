/* eslint-disable node/no-process-env */
import { loadAndValidateSharedEnv } from '@brightideas/shared'

export function initializeEnvironment(): boolean {
  const frontendEnvSource = {
    WEBAPP_URL: process.env.VITE_WEBAPP_URL,
    CLOUDINARY_CLOUD_NAME: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    S3_URL: process.env.VITE_S3_URL,
  }
  try {
    loadAndValidateSharedEnv(frontendEnvSource)
    return true // Успех
  } catch (error) {
    console.error('FATAL: Failed to load shared environment variables for webapp!', error)
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: red;">Error: Application environment failed to load. Please check the console or contact support.</div>'
    }
    return false // Неудача
  }
}
