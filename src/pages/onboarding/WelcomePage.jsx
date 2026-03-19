/**
 * WelcomePage
 *
 * Landing page for new users to start onboarding or login.
 */

import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useAuth } from '../../contexts/AuthContext';
import WelcomeScreen from '../../components/onboarding/WelcomeScreen';
import { ROUTES } from '../../router/routes';

export default function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingComplete } = useUserStore();
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

  const handleStart = () => {
    navigate(ROUTES.ONBOARDING_OPOSICION);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <WelcomeScreen
      onStart={handleStart}
      onLogin={handleLogin}
    />
  );
}
