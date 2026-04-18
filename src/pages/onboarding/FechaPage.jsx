/**
 * FechaPage
 *
 * Onboarding step: Set exam date goal.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import DateStep from '../../components/onboarding/DateStep';
import { ROUTES } from '../../router/routes';
import SkipOnboarding from '../../components/onboarding/SkipOnboarding';
import EditorialFechaStep from '../../components/onboarding/EditorialFechaStep';

const useEditorial = () =>
  typeof window !== 'undefined' && localStorage.getItem('home-design') !== 'legacy';

export default function FechaPage() {
  const navigate = useNavigate();
  const { userData, setUserData } = useUserStore();

  const handleNext = (examDate) => {
    setUserData({ examDate });
    navigate(ROUTES.ONBOARDING_INTRO);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_TIEMPO);
  };

  if (useEditorial()) {
    return (
      <>
        <EditorialFechaStep
          dailyMinutes={userData?.dailyStudyTime || 15}
          onSelect={handleNext}
          onBack={handleBack}
        />
        <SkipOnboarding />
      </>
    );
  }

  return (
    <>
      <DateStep
        onSelect={handleNext}
        onBack={handleBack}
      />
      <SkipOnboarding />
    </>
  );
}
