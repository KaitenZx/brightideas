import './styles/global.scss'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage/Index'
import { SignUpPage } from './pages/auth/SignUpPage'
import { SignOutPage } from './pages/auth/SingOutPage'
import { AllIdeasPage } from './pages/ideas/AllIIdeasPage'
import { EditIdeaPage } from './pages/ideas/EditIdeaPage'
import { NewIdeaPage } from './pages/ideas/NewIdeaPage'
import { ViewIdeaPage } from './pages/ideas/ViewIdeaPage'
import { NotFoundPage } from './pages/other/NotFoundPage'

export const App = () => {
  return (
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute()} element={<SignInPage />} />
              <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />
              <Route path={routes.getNewIdeaRoute()} element={<NewIdeaPage />} />
              <Route path={routes.getEditProfileRoute()} element={<EditProfilePage />} />
              <Route path={routes.getEditIdeaRoute(routes.editIdeaRouteParams)} element={<EditIdeaPage />} />
              <Route path={routes.getViewIdeaRoute(routes.viewIdeaRouteParams)} element={<ViewIdeaPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  )
}
