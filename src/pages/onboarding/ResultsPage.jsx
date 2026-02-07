/**
 * ResultsPage
 *
 * Final onboarding step: Show personalized plan and start.
 */

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { ROUTES } from '../../router/routes';
import { CheckCircle, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { userData, completeOnboarding } = useUserStore();

  const handleStart = () => {
    completeOnboarding();
    navigate(ROUTES.FIRST_TEST);
  };

  const features = [
    { icon: Sparkles, text: 'Repeticion espaciada inteligente' },
    { icon: Calendar, text: 'Seguimiento de tu progreso' },
    { icon: Clock, text: `${userData?.dailyStudyTime || 15} min diarios` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Todo listo!
          </h2>
          <p className="text-gray-500">
            Tu plan personalizado esta preparado
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-8 space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-brand-600" />
              </div>
              <span className="text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-brand-600 text-white font-semibold rounded-2xl hover:bg-brand-700 transition-colors"
        >
          Comenzar ahora
        </button>
      </div>
    </div>
  );
}
