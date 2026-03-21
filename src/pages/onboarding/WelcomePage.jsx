/**
 * WelcomePage
 *
 * Landing page for new users to start onboarding or login.
 */

import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useAuth } from '../../contexts/AuthContext';
import LandingPage from '../../components/landing/LandingPage';
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

  const handleStart = () => {
    navigate(ROUTES.ONBOARDING_OPOSICION);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSkipAll = () => {
    completeOnboarding();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <>
      <LandingPage
        onStart={handleStart}
        onLogin={handleLogin}
      />
      {devOverride && (
        <button
          onClick={handleSkipAll}
          className="fixed bottom-6 right-6 z-50 text-gray-400 hover:text-gray-500 text-xs py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
        >
          Skip todo →
        </button>
      )}
    </>
  );
}
