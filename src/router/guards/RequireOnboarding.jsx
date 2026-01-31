/**
 * RequireOnboarding Guard
 *
 * Ensures user has completed onboarding before accessing protected routes.
 * Redirects to welcome page if onboarding is incomplete.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../routes';

export default function RequireOnboarding({ children }) {
  const { onboardingComplete } = useUserStore();
  const location = useLocation();

  // Redirect to welcome if onboarding not complete
  if (!onboardingComplete) {
    return <Navigate to={ROUTES.WELCOME} state={{ from: location }} replace />;
  }

  return children;
}
