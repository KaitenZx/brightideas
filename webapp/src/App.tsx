import '@mantine/core/styles.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import '@mantine/tiptap/styles.css'

import {
  MantineProvider,
  createTheme,
  type MantineTheme,
  Paper,
  Input,
  NavLink,
  Textarea,
  InputWrapper,
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
import { TrpcProvider } from './lib/trpc'
import SignInPage from './pages/auth/SignInPage/Index'
import SignUpPage from './pages/auth/SignUpPage'
import SignOutPage from './pages/auth/SingOutPage'
import AllIdeasPage from './pages/ideas/AllIdeasPage'
import ViewIdeaPage from './pages/ideas/ViewIdeaPage'
import NotFoundPage from './pages/other/NotFoundPage'

// --- Динамические импорты страниц ---
const EditProfilePage = lazy(() => import('./pages/auth/EditProfilePage'))
const EditIdeaPage = lazy(() => import('./pages/ideas/EditIdeaPage'))
const NewIdeaPage = lazy(() => import('./pages/ideas/NewIdeaPage'))
const LikedIdeasPage = lazy(() => import('./pages/ideas/LikedIdeasPage'))
const MyIdeasPage = lazy(() => import('./pages/ideas/MyIdeasPage'))

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  lineHeights: { sm: '1.4', md: '1.5', lg: '1.6' }, // Slightly increased line height
  radius: { xs: '2px', sm: '4px', md: '8px', lg: '16px' }, // Defined radii
  defaultRadius: 'md', // Set default radius

  primaryColor: 'teal', // Changed primary color to teal
  // primaryShade: 6, // Optionally specify the shade for dark/light modes

  headings: {
    fontFamily: 'Helvetica, Arial, sans-serif',
    sizes: {
      h1: { fontSize: '2.2rem', lineHeight: '1.3' }, // Example heading sizes
      h2: { fontSize: '1.8rem', lineHeight: '1.35' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4' },
    },
  },

  components: {
    Paper: Paper.extend({
      // Extended Paper styles
      defaultProps: {
        shadow: 'xs', // Add a subtle shadow by default
        withBorder: false, // Remove border by default, can be added explicitly
      },
    }),
    NavLink: NavLink.extend({
      // Extended NavLink styles
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.sm, // Consistent radius with theme
        },
        label: {
          fontSize: theme.fontSizes.sm, // Slightly smaller font for nav links
        },
      }),
    }),
    Input: Input.extend({
      // Ensure inputs use default radius
      defaultProps: {
        radius: 'md',
      },
    }),
    Textarea: Textarea.extend({
      // Ensure textareas use default radius
      defaultProps: {
        radius: 'md',
      },
    }),
    InputWrapper: InputWrapper.extend({
      styles: (theme) => ({
        error: {
          fontSize: theme.fontSizes.md,
          color: theme.colors.red[6],
        },
      }),
    }),
    Anchor: {
      defaultProps: (theme: MantineTheme) => ({
        c: theme.primaryColor, // Use 'c' prop instead of 'color'
      }),
    },
  },
})

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
