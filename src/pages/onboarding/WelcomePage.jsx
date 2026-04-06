/**
 * WelcomePage
 *
 * Landing page for new users to start onboarding or login.
 */

import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useAuth } from '../../contexts/AuthContext';
import GuestWelcome from '../../features/guest/components/GuestWelcome';
import { ROUTES } from '../../router/routes';

export default function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingComplete, completeOnboarding } = useUserStore();
  const { user, isAnonymous, loading } = useAuth();
  const devOverride = location.state?.devOverride;

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  // Authenticated users (with account) always go to app — they already onboarded
  // Unless navigating from DevPanel (devOverride flag)
  if (user && !isAnonymous && !devOverride) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Anonymous users who completed onboarding also go to app
  if (isAnonymous && onboardingComplete && !devOverride) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Guest-first flow: show GuestWelcome for unauthenticated users
  // This sends them directly to questions without long onboarding
  const handleGuestStart = () => {
    navigate(ROUTES.GUEST_SESSION);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <GuestWelcome />
  );
}
