import type { TrpcRouter } from '@brightideas/backend/src/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink, type TRPCLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { observable } from '@trpc/server/observable'
import Cookies from 'js-cookie'
import { useState } from 'react'
import superjson from 'superjson'
import { getWebAppEnv } from './env'
import { sentryCaptureException } from './sentry'

export const trpc = createTRPCReact<TrpcRouter>()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value)
        },
        error(error) {
          if (!error.data?.isExpected) {
            sentryCaptureException(error)
          }
          observer.error(error)
        },
        complete() {
          observer.complete()
        },
      })
      return unsubscribe
    })
  }
}

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const [trpcClientState] = useState(() => {
    const env = getWebAppEnv()

    return trpc.createClient({
      transformer: superjson,
      links: [
        customTrpcLink,
        loggerLink({
          enabled: () => env.NODE_ENV === 'development',
        }),
        httpBatchLink({
          url: env.VITE_BACKEND_TRPC_URL,
          headers: () => {
            const token = Cookies.get('token')
            return {
              ...(token && { authorization: `Bearer ${token}` }),
            }
          },
        }),
      ],
    })
  })

  return (
    <trpc.Provider client={trpcClientState} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
