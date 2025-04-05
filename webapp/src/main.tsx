import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { initializeWebAppEnv } from './lib/env.ts'
import { initMixpanel } from './lib/mixpanel' // <-- Импортируем новые init-функции
import { initSentry } from './lib/sentry' // <-- Импортируем новые init-функции

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Fatal: Root element 'root' not found in HTML.")
}

const webAppEnv = initializeWebAppEnv()

if (webAppEnv) {
  initSentry(webAppEnv)
  initMixpanel(webAppEnv)

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  console.warn('Application rendering aborted due to environment loading failure.')
}
