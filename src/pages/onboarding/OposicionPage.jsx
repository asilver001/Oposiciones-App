/**
 * OposicionPage
 *
 * Onboarding step: Select which oposicion to prepare for.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import GoalStep from '../../components/onboarding/GoalStep';
import { ROUTES } from '../../router/routes';

export default function OposicionPage() {
  const navigate = useNavigate();
  const { setUserData } = useUserStore();

  const handleNext = (oposicion) => {
    setUserData({ selectedOposicion: oposicion });
    navigate(ROUTES.ONBOARDING_TIEMPO);
  };

  const handleBack = () => {
    navigate(ROUTES.WELCOME);
  };

  return (
    <GoalStep
      step="oposicion"
      onSelect={handleNext}
      onBack={handleBack}
    />
  );
}
