import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { createContext, useContext } from 'react'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { Loader } from '../components/Loader'
import { trpc } from './trpc'

export type AppContext = {
  me: TrpcRouterOutput['getMe']['me']
}

const AppReactContext = createContext<AppContext>({
  me: null,
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery()
  return (
    <AppReactContext.Provider
      value={{
        me: data?.me || null,
      }}
    >
      {isLoading || isFetching ? (
        <Loader type="page" />
      ) : isError ? (
        <ErrorPageComponent title="Could not load user data" message={error.message || 'An unknown error occurred'} />
      ) : (
        children
      )}
    </AppReactContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}
