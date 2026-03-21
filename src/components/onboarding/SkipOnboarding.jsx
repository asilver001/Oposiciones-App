import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../../router/routes';

export default function SkipOnboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUserStore();
  const isDev = import.meta.env.DEV;

  if (!isDev) return null;

  const handleSkip = () => {
    completeOnboarding();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <button
      onClick={handleSkip}
      className="fixed bottom-6 right-6 z-50 text-gray-400 hover:text-gray-500 text-xs py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
    >
      Skip todo →
    </button>
  );
}
