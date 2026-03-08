/**
 * Route path constants
 * Separated from routes.jsx to avoid circular imports with layout components.
 */

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
