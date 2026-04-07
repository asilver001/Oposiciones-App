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

  // Guest Mode
  WELCOME2: '/welcome2',           // Direct to questions (no dashboard)
  GUEST_SESSION: '/guest/session',
  GUEST_RESULTS: '/guest/results',
  GUEST_SIGNUP: '/guest/signup',

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
  DIAGNOSTICO: '/app/diagnostico',

  // Admin
  ADMIN: '/admin',
  REVIEWER: '/reviewer',

  // Legal
  TERMS: '/terms',
  PRIVACY: '/privacy',

  // Lab Demo (Picto Dent)
  LAB_DEMO: '/lab-demo',
  LAB_DEMO_ORDER: '/lab-demo/order',
  LAB_DEMO_DASHBOARD: '/lab-demo/dashboard',
  LAB_DEMO_TRACK: '/lab-demo/track',
};
