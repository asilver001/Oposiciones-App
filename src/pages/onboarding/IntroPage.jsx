/**
 * IntroPage
 *
 * Onboarding step: Brief intro to how the app works.
 */

import { useNavigate } from 'react-router-dom';
import IntroStep from '../../components/onboarding/IntroStep';
import { ROUTES } from '../../router/routes';

export default function IntroPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(ROUTES.ONBOARDING_RESULTS);
  };

  const handleSkip = () => {
    navigate(ROUTES.HOME);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_FECHA);
  };

  return (
    <IntroStep
      onStart={handleStart}
      onSkip={handleSkip}
      onBack={handleBack}
    />
  );
}
