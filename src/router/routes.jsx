/**
 * Application Routes Configuration
 *
 * Defines all routes for the application using React Router v6.
 * Routes are organized by feature/section for maintainability.
 */

import { Navigate } from 'react-router-dom';
import { lazy } from 'react';

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

// Route path constants for type-safe navigation
export const ROUTES = {
  // Onboarding
  WELCOME: '/welcome',
  ONBOARDING_OPOSICION: '/onboarding/oposicion',
  ONBOARDING_TIEMPO: '/onboarding/tiempo',
  ONBOARDING_FECHA: '/onboarding/fecha',
  ONBOARDING_INTRO: '/onboarding/intro',
  ONBOARDING_RESULTS: '/onboarding/results',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Main App
  APP: '/app',
  HOME: '/app/inicio',
  TEMAS: '/app/temas',
  ACTIVIDAD: '/app/actividad',
  RECURSOS: '/app/recursos',
  STUDY: '/app/study',
  FIRST_TEST: '/app/first-test',

  // Admin
  ADMIN: '/admin',
  REVIEWER: '/reviewer',

  // Legal
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

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
    element: <WelcomePage />,
  },
  {
    path: ROUTES.ONBOARDING_OPOSICION,
    element: <OposicionPage />,
  },
  {
    path: ROUTES.ONBOARDING_TIEMPO,
    element: <TiempoPage />,
  },
  {
    path: ROUTES.ONBOARDING_FECHA,
    element: <FechaPage />,
  },
  {
    path: ROUTES.ONBOARDING_INTRO,
    element: <IntroPage />,
  },
  {
    path: ROUTES.ONBOARDING_RESULTS,
    element: <ResultsPage />,
  },

  // Auth pages
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },

  // Main app routes
  {
    path: ROUTES.APP,
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.TEMAS,
    element: <TemasPage />,
  },
  {
    path: ROUTES.ACTIVIDAD,
    element: <ActividadPage />,
  },
  {
    path: ROUTES.RECURSOS,
    element: <RecursosPage />,
  },
  {
    path: ROUTES.STUDY,
    element: <StudyPage />,
  },
  {
    path: ROUTES.FIRST_TEST,
    element: <FirstTestPage />,
  },

  // Admin routes
  {
    path: ROUTES.ADMIN,
    element: <AdminPage />,
  },
  {
    path: ROUTES.REVIEWER,
    element: <ReviewerPage />,
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
