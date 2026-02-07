/**
 * TiempoPage
 *
 * Onboarding step: Select daily study time.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../../router/routes';

// Temporary inline component until extracted from OpositaApp
function TiempoStep({ onNext, onBack }) {
  const times = [
    { value: 10, label: '10 min', desc: 'Perfecto para empezar' },
    { value: 20, label: '20 min', desc: 'Equilibrio ideal' },
    { value: 30, label: '30 min', desc: 'Progreso constante' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¿Cuánto tiempo al día puedes estudiar?
        </h2>
        <p className="text-gray-500 mb-8">
          Elige lo que sea sostenible para ti
        </p>

        <div className="space-y-3 mb-8">
          {times.map((time) => (
            <button
              key={time.value}
              onClick={() => onNext(time.value)}
              className="w-full p-4 bg-white rounded-2xl border-2 border-brand-100 hover:border-brand-400 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-800">{time.label}</span>
              <span className="text-gray-500 ml-2">· {time.desc}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onBack}
          className="text-brand-600 font-medium"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default function TiempoPage() {
  const navigate = useNavigate();
  const { setUserData } = useUserStore();

  const handleNext = (dailyTime) => {
    setUserData({ dailyStudyTime: dailyTime });
    navigate(ROUTES.ONBOARDING_FECHA);
  };

  const handleBack = () => {
    navigate(ROUTES.ONBOARDING_OPOSICION);
  };

  return (
    <TiempoStep
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
