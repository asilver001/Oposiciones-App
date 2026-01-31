/**
 * WelcomePage
 *
 * Landing page for new users to start onboarding or login.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import WelcomeScreen from '../../components/onboarding/WelcomeScreen';
import { ROUTES } from '../../router/routes';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { onboardingComplete } = useUserStore();

  // Redirect to app if onboarding already complete
  if (onboardingComplete) {
    navigate(ROUTES.HOME, { replace: true });
    return null;
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
