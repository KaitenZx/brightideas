import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import mixpanel from 'mixpanel-browser'
import { useEffect } from 'react'
import { useMe } from './ctx'
import { type WebAppEnv } from './env'

let isMixpanelInitialized = false

export function initMixpanel(env: WebAppEnv) {
  if (isMixpanelInitialized) {
    console.warn('Mixpanel already initialized.')
    return
  }
  if (env.VITE_MIXPANEL_API_KEY) {
    mixpanel.init(env.VITE_MIXPANEL_API_KEY)
    isMixpanelInitialized = true // Устанавливаем флаг
    console.info('Mixpanel initialized.')
  } else {
    console.warn('Mixpanel API key not found, Mixpanel not initialized.')
  }
}

const whenEnabled = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult | void) => {
  return (...args: TArgs): TResult | void => {
    if (isMixpanelInitialized) {
      return fn(...args)
    }
  }
}

export const mixpanelIdentify = whenEnabled((userId: string) => {
  mixpanel.identify(userId)
})

export const mixpanelAlias = whenEnabled((userId: string) => {
  mixpanel.alias(userId)
})

export const mixpanelReset = whenEnabled(() => {
  mixpanel.reset()
})

export const mixpanelPeopleSet = whenEnabled((me: NonNullable<TrpcRouterOutput['getMe']['me']>) => {
  mixpanel.people.set({
    $email: me.email,
    nick: me.nick,
  })
})

export const mixpanelTrackSignUp = whenEnabled(() => {
  mixpanel.track('Sign Up')
})

export const mixpanelTrackSignIn = whenEnabled(() => {
  mixpanel.track('Sign In')
})

export const mixpanelSetIdeaLike = whenEnabled((idea: TrpcRouterOutput['setIdeaLike']['idea']) => {
  mixpanel.track('Like', { ideaId: idea.id })
})

export const MixpanelUser = () => {
  const me = useMe()
  useEffect(() => {
    if (me) {
      mixpanelPeopleSet(me)
    } else {
      mixpanelReset()
    }
  }, [me])
  return null
}
