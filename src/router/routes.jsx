/**
 * Application Routes Configuration
 *
 * Defines all routes for the application using React Router v6.
 * Routes are organized by feature/section for maintainability.
 */

import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import RequireAuth from './guards/RequireAuth';
import RequireOnboarding from './guards/RequireOnboarding';
import RequireAdmin from './guards/RequireAdmin';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { MainLayout } from '../layouts/MainLayout';

// Lazy load pages for code splitting
const WelcomePage = lazy(() => import('../pages/onboarding/WelcomePage'));
const OposicionPage = lazy(() => import('../pages/onboarding/OposicionPage'));
const TiempoPage = lazy(() => import('../pages/onboarding/TiempoPage'));
const FechaPage = lazy(() => import('../pages/onboarding/FechaPage'));
const IntroPage = lazy(() => import('../pages/onboarding/IntroPage'));
const ResultsPage = lazy(() => import('../pages/onboarding/ResultsPage'));

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

const HomePage = lazy(() => import('../pages/app/HomePage'));
const TemasPage = lazy(() => import('../pages/app/TemasPage'));
const ActividadPage = lazy(() => import('../pages/app/ActividadPage'));
const RecursosPage = lazy(() => import('../pages/app/RecursosPage'));
const StudyPage = lazy(() => import('../pages/app/StudyPage'));
const FirstTestPage = lazy(() => import('../pages/app/FirstTestPage'));

const AdminPage = lazy(() => import('../pages/admin/AdminPage'));
const ReviewerPage = lazy(() => import('../pages/admin/ReviewerPage'));

const TermsPage = lazy(() => import('../pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/legal/PrivacyPage'));

// Re-export route path constants from paths.js (separate file to avoid circular imports)
export { ROUTES } from './paths';
import { ROUTES } from './paths';

/**
 * Route configuration array
 * Used by createBrowserRouter or useRoutes
 */
export const routeConfig = [
  // Root redirect
  {
    path: '/',
    element: <Navigate to={ROUTES.WELCOME} replace />,
  },

  // Onboarding flow
  {
    path: ROUTES.WELCOME,
    element: <ErrorBoundary><WelcomePage /></ErrorBoundary>,
  },
  {
    path: ROUTES.ONBOARDING_OPOSICION,
    element: <ErrorBoundary><OposicionPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.ONBOARDING_TIEMPO,
    element: <ErrorBoundary><TiempoPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.ONBOARDING_FECHA,
    element: <ErrorBoundary><FechaPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.ONBOARDING_INTRO,
    element: <ErrorBoundary><IntroPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.ONBOARDING_RESULTS,
    element: <ErrorBoundary><ResultsPage /></ErrorBoundary>,
  },

  // Auth pages
  {
    path: ROUTES.LOGIN,
    element: <ErrorBoundary><LoginPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.SIGNUP,
    element: <ErrorBoundary><SignupPage /></ErrorBoundary>,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ErrorBoundary><ForgotPasswordPage /></ErrorBoundary>,
  },

  // Main app routes (protected: require auth + onboarding)
  // Wrapped in MainLayout for TopBar + BottomTabBar
  {
    path: ROUTES.APP,
    element: <RequireAuth><RequireOnboarding><MainLayout /></RequireOnboarding></RequireAuth>,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.HOME} replace />,
      },
      {
        path: 'inicio',
        element: <ErrorBoundary><HomePage /></ErrorBoundary>,
      },
      {
        path: 'temas',
        element: <ErrorBoundary><TemasPage /></ErrorBoundary>,
      },
      {
        path: 'actividad',
        element: <ErrorBoundary><ActividadPage /></ErrorBoundary>,
      },
      {
        path: 'recursos',
        element: <ErrorBoundary><RecursosPage /></ErrorBoundary>,
      },
      {
        path: 'study',
        element: <ErrorBoundary><StudyPage /></ErrorBoundary>,
      },
      {
        path: 'first-test',
        element: <ErrorBoundary><FirstTestPage /></ErrorBoundary>,
      },
    ],
  },

  // Admin routes (protected: require admin role)
  {
    path: ROUTES.ADMIN,
    element: <RequireAdmin><ErrorBoundary><AdminPage /></ErrorBoundary></RequireAdmin>,
  },
  {
    path: ROUTES.REVIEWER,
    element: <RequireAdmin><ErrorBoundary><ReviewerPage /></ErrorBoundary></RequireAdmin>,
  },

  // Legal pages
  {
    path: ROUTES.TERMS,
    element: <TermsPage />,
  },
  {
    path: ROUTES.PRIVACY,
    element: <PrivacyPage />,
  },

  // Fallback - redirect unknown routes
  {
    path: '*',
    element: <Navigate to={ROUTES.WELCOME} replace />,
  },
];

export default routeConfig;
