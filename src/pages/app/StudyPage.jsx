/**
 * StudyPage
 *
 * Study session page with different modes.
 * Routes to the appropriate session component based on mode.
 */

import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Target, AlertTriangle, BookMarked, Zap, BookOpen, ArrowLeft, Play } from 'lucide-react';
import { ROUTES } from '../../router/routes';
import HybridSession from '../../components/study/HybridSession';
import FlashcardSession from '../../components/study/FlashcardSession';
import SimulacroSession from '../../components/study/SimulacroSession';

// Mode configuration with icons, descriptions and session components
const modeConfig = {
  'test-rapido': {
    icon: Zap,
    title: 'Test Rápido',
    description: 'Un test rápido de 10 preguntas aleatorias para practicar.',
    color: 'bg-brand-600',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 10, reviewRatio: 0.2 }
  },
  'practica-tema': {
    icon: Target,
    title: 'Práctica por Tema',
    description: 'Practica preguntas de un tema específico.',
    color: 'bg-blue-600',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, reviewRatio: 0.25 }
  },
  'repaso-errores': {
    icon: AlertTriangle,
    title: 'Repaso de Errores',
    description: 'Repasa las preguntas que has fallado anteriormente.',
    color: 'bg-amber-600',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, failedOnly: true }
  },
  'flashcards': {
    icon: BookMarked,
    title: 'Flashcards',
    description: 'Modo memorización con tarjetas de estudio interactivas.',
    color: 'bg-emerald-600',
    sessionType: 'flashcard',
    defaultConfig: { questionCount: 20 }
  },
  'simulacro': {
    icon: Clock,
    title: 'Simulacro de Examen',
    description: '100 preguntas en 60 minutos, como el examen real.',
    color: 'bg-rose-600',
    sessionType: 'simulacro',
    defaultConfig: { questionCount: 100, timeLimit: 60 }
  },
  'lectura': {
    icon: BookOpen,
    title: 'Modo Lectura',
    description: 'Lee las preguntas y respuestas sin presión.',
    color: 'bg-indigo-600',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, readOnly: true }
  },
  'default': {
    icon: Target,
    title: 'Sesión de Estudio',
    description: 'Practica con preguntas de tu temario usando repetición espaciada.',
    color: 'bg-brand-600',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, reviewRatio: 0.25 }
  }
};

export default function StudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionStarted, setSessionStarted] = useState(false);

  // Get mode and options from navigation state
  const { mode, title, questionCount, timeLimit, topic, temaId } = location.state || {};

  // Get config for this mode
  const config = modeConfig[mode] || modeConfig.default;
  const Icon = config.icon;
  const displayTitle = title || config.title;

  // Build session config from mode defaults and navigation state
  const sessionConfig = {
    ...config.defaultConfig,
    ...(questionCount && { totalQuestions: questionCount, questionCount }),
    ...(timeLimit && { timeLimit }),
    ...(topic && { tema: topic.id || topic.name, temaId: topic.id }),
    ...(temaId && { temaId }),
    mode: mode || 'default'
  };

  // Handle exit
  const handleExit = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  // Handle session complete
  const handleComplete = useCallback((stats) => {
    console.log('Session completed:', stats);
    // Could show a summary or navigate somewhere
  }, []);

  // Start session
  const handleStart = useCallback(() => {
    setSessionStarted(true);
  }, []);

  // Render the appropriate session component
  const renderSession = () => {
    switch (config.sessionType) {
      case 'flashcard':
        return (
          <FlashcardSession
            config={sessionConfig}
            onClose={handleExit}
            onComplete={handleComplete}
          />
        );

      case 'simulacro':
        return (
          <SimulacroSession
            config={sessionConfig}
            onClose={handleExit}
            onComplete={handleComplete}
          />
        );

      case 'hybrid':
      default:
        return (
          <HybridSession
            config={sessionConfig}
            onClose={handleExit}
            onComplete={handleComplete}
          />
        );
    }
  };

  // If session has started, render the session component
  if (sessionStarted) {
    return renderSession();
  }

  // Pre-session preview screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center">
          <button
            onClick={handleExit}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          {/* Mode Icon */}
          <div className={`w-20 h-20 rounded-2xl ${config.color} flex items-center justify-center mx-auto mb-6 shadow-md`}>
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
            <div className="flex justify-center gap-3 flex-wrap mt-4">
              {(questionCount || config.defaultConfig.totalQuestions || config.defaultConfig.questionCount) && (
                <span className="bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {questionCount || config.defaultConfig.totalQuestions || config.defaultConfig.questionCount} preguntas
                </span>
              )}
              {(timeLimit || config.defaultConfig.timeLimit) && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {timeLimit || config.defaultConfig.timeLimit} min
                </span>
              )}
              {mode === 'repaso-errores' && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Solo errores
                </span>
              )}
              {mode === 'flashcards' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Desliza tarjetas
                </span>
              )}
            </div>

            {topic && (
              <p className="text-gray-600 mt-3 bg-gray-100 inline-block px-4 py-2 rounded-xl">
                Tema: <span className="font-medium">{topic.name || topic.id}</span>
              </p>
            )}
          </div>

          {/* Mode-specific tips */}
          {mode === 'simulacro' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-rose-700 text-sm font-medium mb-2">Condiciones de examen real:</p>
              <ul className="text-rose-600 text-sm space-y-1">
                <li>• Respuestas correctas: +1 punto</li>
                <li>• Respuestas incorrectas: -0.25 puntos</li>
                <li>• Preguntas sin responder: 0 puntos</li>
                <li>• Nota de corte: 60%</li>
              </ul>
            </div>
          )}

          {mode === 'flashcards' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-emerald-700 text-sm font-medium mb-2">Cómo usar las flashcards:</p>
              <ul className="text-emerald-600 text-sm space-y-1">
                <li>• Toca la tarjeta para ver la respuesta</li>
                <li>• Desliza a la derecha si lo sabes</li>
                <li>• Desliza a la izquierda para repasar</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleStart}
              className={`w-full py-4 ${config.color} text-white font-semibold rounded-2xl shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
            >
              <Play className="w-5 h-5" />
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
    </div>
  );
}
