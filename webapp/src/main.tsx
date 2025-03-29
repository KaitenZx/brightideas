import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { initializeEnvironment } from './initEnv' // Импорт инициализатора

const isEnvReady = initializeEnvironment() // Вызов инициализации

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Fatal: Root element 'root' not found in HTML.")
}

if (isEnvReady) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  console.warn('Application rendering aborted due to environment loading failure.')
}
