/**
 * IntroPage
 *
 * Onboarding step: Asks for name + brief intro to how the app works.
 * Saves name to Supabase user_metadata if provided.
 */

import { useNavigate } from 'react-router-dom';
import IntroStep from '../../components/onboarding/IntroStep';
import EditorialIntroStep from '../../components/onboarding/EditorialIntroStep';
import { ROUTES } from '../../router/routes';
import SkipOnboarding from '../../components/onboarding/SkipOnboarding';
import { supabase } from '../../lib/supabase';

const useEditorial = () =>
  typeof window !== 'undefined' && localStorage.getItem('home-design') !== 'legacy';

export default function IntroPage() {
  const navigate = useNavigate();

  const handleStart = async (nombre) => {
    if (nombre) {
      supabase.auth.updateUser({
        data: { name: nombre }
      }).catch(() => {});
    }
    navigate(ROUTES.ONBOARDING_RESULTS);
  };

  const handleSkip = () => {
    navigate(ROUTES.HOME);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_FECHA);
  };

  const Step = useEditorial() ? EditorialIntroStep : IntroStep;

  return (
    <>
      <Step
        onStart={handleStart}
        onSkip={handleSkip}
        onBack={handleBack}
      />
      <SkipOnboarding />
    </>
  );
}
