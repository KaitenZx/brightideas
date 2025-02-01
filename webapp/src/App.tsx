import './styles/global.scss'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllIdeasPage } from './pages/AllIIdeasPage'
import { NewIdeaPage } from './pages/NewIdeaPage'
import { SignInPage } from './pages/SignInPage/Index'
import { SignUpPage } from './pages/SignUpPage'
import { SignOutPage } from './pages/SingOutPage'
import { ViewIdeaPage } from './pages/ViewIdeaPage'



export const App = () => {
  return (
    <TrpcProvider>
      <BrowserRouter>
        <Routes>
          <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
          <Route element={<Layout />}>
            <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
            <Route path={routes.getSignInRoute()} element={<SignInPage />} />
            <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
            <Route path={routes.getNewIdeaRoute()} element={<NewIdeaPage />} />
            <Route path={routes.getViewIdeaRoute(routes.viewIdeaRouteParams)} element={<ViewIdeaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrpcProvider>
  )
}
