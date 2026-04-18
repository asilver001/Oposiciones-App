/**
 * OposicionPage
 *
 * Onboarding step: Select which oposicion to prepare for.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import GoalStep from '../../components/onboarding/GoalStep';
import { ROUTES } from '../../router/routes';
import SkipOnboarding from '../../components/onboarding/SkipOnboarding';
import EditorialOposicionStep from '../../components/onboarding/EditorialOposicionStep';

const useEditorial = () =>
  typeof window !== 'undefined' && localStorage.getItem('home-design') !== 'legacy';

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

  if (useEditorial()) {
    return (
      <>
        <EditorialOposicionStep
          onSelect={handleNext}
          onBack={handleBack}
        />
        <SkipOnboarding />
      </>
    );
  }

  return (
    <>
      <GoalStep
        step="oposicion"
        onSelect={handleNext}
        onBack={handleBack}
      />
      <SkipOnboarding />
    </>
  );
}
