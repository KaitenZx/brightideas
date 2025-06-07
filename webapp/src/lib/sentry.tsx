import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { useMe } from './ctx'
import { type WebAppEnv } from './env'

let isSentryInitialized = false

export function initSentry(env: WebAppEnv) {
  if (isSentryInitialized) {
    console.warn('Sentry already initialized.')
    return
  }
  // Проверяем DSN из переданного env
  if (env.VITE_WEBAPP_SENTRY_DSN) {
    Sentry.init({
      dsn: env.VITE_WEBAPP_SENTRY_DSN,
      release: env.SOURCE_VERSION,
      environment: env.HOST_ENV,
      normalizeDepth: 10,
    })
    isSentryInitialized = true
    console.info('Sentry initialized.')
  } else {
    console.warn('Sentry DSN not found, Sentry not initialized.')
  }
}

export const sentryCaptureException = (error: Error) => {
  if (isSentryInitialized) {
    Sentry.captureException(error)
  }
}

export const SentryUser = () => {
  const me = useMe()
  useEffect(() => {
    if (isSentryInitialized) {
      if (me) {
        Sentry.setUser({
          email: me.email,
          id: me.id,
          ip_address: '{{auto}}',
          username: me.nick,
        })
      } else {
        Sentry.setUser(null)
      }
    }
  }, [me])
  return null
}
