/**
 * RequireOnboarding Guard
 *
 * Ensures user has completed onboarding before accessing protected routes.
 * Redirects to welcome page if onboarding is incomplete.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../routes';

export default function RequireOnboarding({ children }) {
  const { user } = useAuth();
  const { onboardingComplete } = useUserStore();
  const location = useLocation();

  // Authenticated users skip onboarding check (they already have an account)
  if (user) {
    return children;
  }

  // Anonymous users need onboarding
  if (!onboardingComplete) {
    return <Navigate to={ROUTES.WELCOME} state={{ from: location }} replace />;
  }

  return children;
}
