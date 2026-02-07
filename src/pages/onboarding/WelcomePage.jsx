/**
 * WelcomePage
 *
 * Landing page for new users to start onboarding or login.
 */

import { useNavigate, Navigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useAuth } from '../../contexts/AuthContext';
import WelcomeScreen from '../../components/onboarding/WelcomeScreen';
import { ROUTES } from '../../router/routes';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { onboardingComplete } = useUserStore();
  const { user, isAnonymous } = useAuth();

  // Redirect to app if user is authenticated and onboarding already complete
  if ((user || isAnonymous) && onboardingComplete) {
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
