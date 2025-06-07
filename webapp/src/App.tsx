import '@mantine/core/styles.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import '@mantine/tiptap/styles.css'

import {
  MantineProvider,
  Center,
} from '@mantine/core'
import { Suspense, lazy } from 'react' // Добавляем Suspense и lazy
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Loader } from './components/Loader'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import { MixpanelUser } from './lib/mixpanel'
import * as routes from './lib/routes'
import { SentryUser } from './lib/sentry'
import { theme } from './lib/theme'
import { TrpcProvider } from './lib/trpc'
// --- Убираем прямые импорты ---
// import EditProfilePage from './pages/auth/EditProfilePage'
// import SignInPage from './pages/auth/SignInPage/Index'
// import SignUpPage from './pages/auth/SignUpPage'
// import SignOutPage from './pages/auth/SingOutPage'
// import AllIdeasPage from './pages/ideas/AllIdeasPage'
// import EditIdeaPage from './pages/ideas/EditIdeaPage'
// import NewIdeaPage from './pages/ideas/NewIdeaPage'
// import ViewIdeaPage from './pages/ideas/ViewIdeaPage'
// import NotFoundPage from './pages/other/NotFoundPage'

// --- Динамические импорты для всех страниц ---
const EditProfilePage = lazy(() => import('./pages/auth/EditProfilePage'))
const SignInPage = lazy(() => import('./pages/auth/SignInPage/Index'))
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const SignOutPage = lazy(() => import('./pages/auth/SingOutPage'))
const AllIdeasPage = lazy(() => import('./pages/ideas/AllIdeasPage'))
const EditIdeaPage = lazy(() => import('./pages/ideas/EditIdeaPage'))
const NewIdeaPage = lazy(() => import('./pages/ideas/NewIdeaPage'))
const ViewIdeaPage = lazy(() => import('./pages/ideas/ViewIdeaPage'))
const NotFoundPage = lazy(() => import('./pages/other/NotFoundPage'))
const LikedIdeasPage = lazy(() => import('./pages/ideas/LikedIdeasPage'))
const MyIdeasPage = lazy(() => import('./pages/ideas/MyIdeasPage'))

const SuspenseLoaderWrapper = () => (
  <Center style={{ height: '100vh', width: '100vw' }}>
    <Loader type="page" />
  </Center>
)

export const App = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <HelmetProvider>
        <TrpcProvider>
          <AppContextProvider>
            <BrowserRouter>
              <SentryUser />
              <MixpanelUser />
              <NotAuthRouteTracker />
              <Suspense fallback={<SuspenseLoaderWrapper />}>
                <Routes>
                  <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />

                  <Route element={<Layout />}>
                    <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                    <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                    <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                    <Route path={routes.getAllIdeasRoute.definition} element={<AllIdeasPage />} />
                    <Route path={routes.getViewIdeaRoute.definition} element={<ViewIdeaPage />} />
                    <Route path={routes.getEditIdeaRoute.definition} element={<EditIdeaPage />} />
                    <Route path={routes.getNewIdeaRoute.definition} element={<NewIdeaPage />} />
                    <Route path={routes.getMyIdeasRoute.definition} element={<MyIdeasPage />} />
                    <Route path={routes.getLikedIdeasRoute.definition} element={<LikedIdeasPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AppContextProvider>
        </TrpcProvider>
      </HelmetProvider>
    </MantineProvider>
  )
}
