import '@mantine/core/styles.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider, createTheme, type MantineTheme } from '@mantine/core';
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
import { TrpcProvider } from './lib/trpc'

// --- Динамические импорты страниц ---
const EditProfilePage = lazy(() => import('./pages/auth/EditProfilePage'))
const SignInPage = lazy(() => import('./pages/auth/SignInPage/Index')) // Оставляем /Index если он есть
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const SignOutPage = lazy(() => import('./pages/auth/SingOutPage'))
const AllIdeasPage = lazy(() => import('./pages/ideas/AllIdeasPage')) // Исправлено: AllIdeasPage
const EditIdeaPage = lazy(() => import('./pages/ideas/EditIdeaPage'))
const NewIdeaPage = lazy(() => import('./pages/ideas/NewIdeaPage'))
const ViewIdeaPage = lazy(() => import('./pages/ideas/ViewIdeaPage'))
const NotFoundPage = lazy(() => import('./pages/other/NotFoundPage'))

const theme = createTheme({
  /** Шрифты */
  fontFamily: 'Helvetica, Arial, sans-serif', // Из $defaultFontFamily
  fontSizes: { md: '14px' }, // Из $defaultFontSize

  primaryColor: 'blue',
  lineHeights: { sm: '1.2' }, // Из $defaultLineHeight
  radius: { sm: '3px' }, // Из $borderRadiusSmall

  headings: {
    fontFamily: 'Helvetica, Arial, sans-serif', // Из $defaultFontFamily
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      }
    },
    Anchor: {
      defaultProps: (theme: MantineTheme) => ({
        color: theme.primaryColor,
      }),
    },
  },
});

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

              <Suspense fallback={<Loader type="section" />}>
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
