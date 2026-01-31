/**
 * StudyPage
 *
 * Study session page with questions.
 * Handles different study modes passed via navigation state.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Target, AlertTriangle, BookMarked, Zap } from 'lucide-react';
import { ROUTES } from '../../router/routes';

// Mode configuration with icons and descriptions
const modeConfig = {
  'test-rapido': {
    icon: Zap,
    title: 'Test Rápido',
    description: 'Un test rápido de 10 preguntas aleatorias para practicar.',
    gradient: 'from-purple-500 to-violet-600'
  },
  'repaso-errores': {
    icon: AlertTriangle,
    title: 'Repaso de Errores',
    description: 'Repasa las preguntas que has fallado anteriormente.',
    gradient: 'from-amber-500 to-orange-600'
  },
  'flashcards': {
    icon: BookMarked,
    title: 'Flashcards',
    description: 'Modo memorización con tarjetas de estudio.',
    gradient: 'from-emerald-500 to-teal-600'
  },
  'simulacro': {
    icon: Clock,
    title: 'Simulacro de Examen',
    description: '100 preguntas en 60 minutos, como el examen real.',
    gradient: 'from-rose-500 to-pink-600'
  },
  'default': {
    icon: Target,
    title: 'Sesión de Estudio',
    description: 'Practica con preguntas de tu temario.',
    gradient: 'from-blue-500 to-cyan-600'
  }
};

export default function StudyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get mode and options from navigation state
  const { mode, title, questionCount, timeLimit, topic } = location.state || {};

  // Get config for this mode
  const config = modeConfig[mode] || modeConfig.default;
  const Icon = config.icon;
  const displayTitle = title || config.title;

  const handleExit = () => {
    navigate(ROUTES.HOME);
  };

  const handleStart = () => {
    // TODO: Start actual study session with HybridSession
    // For now, just show the placeholder
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Mode Icon */}
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {displayTitle}
        </h2>

        {/* Mode details */}
        <div className="space-y-2 mb-6">
          <p className="text-gray-500">
            {config.description}
          </p>

          {/* Show specific mode parameters */}
          <div className="flex justify-center gap-4 text-sm">
            {questionCount && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {questionCount} preguntas
              </span>
            )}
            {timeLimit && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {timeLimit} min
              </span>
            )}
          </div>

          {topic && (
            <p className="text-gray-600 mt-2">
              Tema: <span className="font-medium">{topic.name || topic.id}</span>
            </p>
          )}
        </div>

        {/* Placeholder message */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-700 text-sm">
            🚧 La sesión de estudio interactiva se integrará con HybridSession próximamente.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleStart}
            className={`w-full py-4 bg-gradient-to-r ${config.gradient} text-white font-semibold rounded-2xl shadow-lg hover:opacity-90 transition-opacity`}
          >
            Comenzar sesión
          </button>
          <button
            onClick={handleExit}
            className="w-full py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
