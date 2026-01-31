/**
 * FirstTestPage
 *
 * Initial diagnostic test for new users after onboarding.
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

// Placeholder until first test flow is properly integrated
export default function FirstTestPage() {
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleStart = () => {
    // TODO: Start actual first test
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📝</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Test inicial
        </h2>
        <p className="text-gray-500 mb-8">
          Haremos un pequeño test para conocer tu nivel actual y personalizar tu experiencia.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleStart}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors"
          >
            Empezar test
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3 text-purple-600 font-medium"
          >
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}
