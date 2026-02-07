import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HybridSession from '../../components/study/HybridSession';
import { ROUTES } from '../../router/routes';

export default function FirstTestPage() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);

  const handleComplete = () => {
    navigate(ROUTES.HOME, { replace: true });
  };

  if (started) {
    return (
      <HybridSession
        config={{ mode: 'first-test', totalQuestions: 10, reviewRatio: 0 }}
        onComplete={handleComplete}
        onBack={() => setStarted(false)}
      />
    );
  }

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
          Haremos un pequeno test para conocer tu nivel actual y personalizar tu experiencia.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-2xl hover:bg-purple-700 transition-colors"
          >
            Empezar test
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME, { replace: true })}
            className="w-full py-3 text-purple-600 font-medium"
          >
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}
