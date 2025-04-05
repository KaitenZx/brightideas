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
            if (getWebAppEnv().NODE_ENV !== 'development') {
              console.error(error)
            }
          }
          sentryCaptureException(error)
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
  // Используем useState для создания клиента ОДИН РАЗ при монтировании провайдера
  // Функция внутри useState выполнится только при первом рендере
  const [trpcClientState] = useState(() => {
    // Теперь getWebAppEnv() вызывается ЗДЕСЬ, ПОСЛЕ инициализации в main.tsx
    const env = getWebAppEnv() // Получаем env один раз

    return trpc.createClient({
      transformer: superjson,
      links: [
        customTrpcLink,
        loggerLink({
          enabled: () => env.NODE_ENV === 'development', // Используем переменную env
        }),
        httpBatchLink({
          url: env.VITE_BACKEND_TRPC_URL, // Используем переменную env
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

  // Используем созданный клиент в провайдере
  return (
    <trpc.Provider client={trpcClientState} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

//const trpcClient = trpc.createClient({
//  transformer: superjson,
//  links: [
//    customTrpcLink,
//    loggerLink({
//      enabled: () => getWebAppEnv().NODE_ENV === 'development',
//    }),
//    httpBatchLink({
//      url: getWebAppEnv().VITE_BACKEND_TRPC_URL,
//      headers: () => {
//        const token = Cookies.get('token')
//        return {
//          ...(token && { authorization: `Bearer ${token}` }),
//        }
//      },
//    }),
//  ],
//})

//export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
//  return (
//    <trpc.Provider client={trpcClient} queryClient={queryClient}>
//      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//    </trpc.Provider>
//  )
//}
