import { TrpcProvider } from './lib/trpc'
import { AllIdeasPage } from './pages/AllIIdeasPage'

export const App = () => {
  return (
    <TrpcProvider>
      <AllIdeasPage />
    </TrpcProvider>
  )
}
