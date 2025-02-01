import { type inferAsyncReturnType, initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import type { Express } from 'express'
import superjson from 'superjson'
import type { TrpcRouter } from '../router'
import type { ExpressRequest } from '../utils/types'
import type { AppContext } from './ctx'

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) => ({
    ...appContext,
    me: (req as ExpressRequest).user || null,
  })

type TrpcContext = inferAsyncReturnType<ReturnType<typeof getCreateTrpcContext>>

export const trpc = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
})

export const applyTrpcToExpressApp = (expressApp: Express, appContext: AppContext, trpcRouter: TrpcRouter) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  )
}
