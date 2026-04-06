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

  // Authenticated users skip onboarding check
  if (user) {
    return children;
  }

  // Allow unauthenticated users on all /app pages (guest browsing)
  if (location.pathname.startsWith('/app')) {
    return children;
  }

  // Other routes: need onboarding or redirect to home
  if (!onboardingComplete) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}
