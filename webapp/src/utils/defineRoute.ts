/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useParams as useReactRouterParams } from 'react-router-dom'
import { getWebAppEnv } from '../lib/env'

type PumpedGetRouteInputBase = {
  abs?: boolean
}

function defineRoute<T extends Record<string, boolean>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: Record<keyof T, string>) => string
): {
  (routeParams: Record<keyof T, string> & PumpedGetRouteInputBase): string
  placeholders: Record<keyof T, string>
  useParams: () => Record<keyof T, string>
  definition: string
}
function defineRoute(getRoute: () => string): {
  (routeParams?: PumpedGetRouteInputBase): string
  placeholders: {}
  useParams: () => {}
  definition: string
}
function defineRoute(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute
  const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute
  const placeholders = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
  const definition = getRoute(placeholders)
  const pumpedGetRoute = (routeParams?: PumpedGetRouteInputBase) => {
    const route = getRoute(routeParams)
    if (routeParams?.abs) {
      const webappUrl = getWebAppEnv().VITE_WEBAPP_URL
      return `${webappUrl}${route}`
    } else {
      return route
    }
  }
  pumpedGetRoute.placeholders = placeholders
  pumpedGetRoute.definition = definition
  pumpedGetRoute.useParams = useReactRouterParams as any
  return pumpedGetRoute
}

export type RouteParams<T extends { placeholders: Record<string, string> }> = T['placeholders']

export { defineRoute }
