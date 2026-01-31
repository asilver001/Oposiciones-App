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

  const handleNext = () => {
    navigate(ROUTES.ONBOARDING_RESULTS);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_FECHA);
  };

  return (
    <IntroStep
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
