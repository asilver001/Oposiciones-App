/**
 * FechaPage
 *
 * Onboarding step: Set exam date goal.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import DateStep from '../../components/onboarding/DateStep';
import { ROUTES } from '../../router/routes';

export default function FechaPage() {
  const navigate = useNavigate();
  const { setUserData } = useUserStore();

  const handleNext = (examDate) => {
    setUserData({ examDate });
    navigate(ROUTES.ONBOARDING_INTRO);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_TIEMPO);
  };

  return (
    <DateStep
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
