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
    color: 'bg-gray-100',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 10, reviewRatio: 0.2 }
  },
  'practica-tema': {
    icon: Target,
    title: 'Práctica por Tema',
    description: 'Practica preguntas de un tema específico.',
    color: 'bg-gray-100',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, reviewRatio: 0.25 }
  },
  'repaso-errores': {
    icon: AlertTriangle,
    title: 'Repaso de Errores',
    description: 'Repasa las preguntas que has fallado anteriormente.',
    color: 'bg-gray-100',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, failedOnly: true }
  },
  'flashcards': {
    icon: BookMarked,
    title: 'Flashcards',
    description: 'Modo memorización con tarjetas de estudio interactivas.',
    color: 'bg-gray-100',
    sessionType: 'flashcard',
    defaultConfig: { questionCount: 20 }
  },
  'simulacro': {
    icon: Clock,
    title: 'Simulacro de Examen',
    description: '100 preguntas en 60 minutos, como el examen real.',
    color: 'bg-gray-100',
    sessionType: 'simulacro',
    defaultConfig: { questionCount: 100, timeLimit: 60 }
  },
  'lectura': {
    icon: BookOpen,
    title: 'Modo Lectura',
    description: 'Lee las preguntas y respuestas sin presión.',
    color: 'bg-gray-100',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, readOnly: true }
  },
  'default': {
    icon: Target,
    title: 'Sesión de Estudio',
    description: 'Practica con preguntas de tu temario usando repetición espaciada.',
    color: 'bg-gray-100',
    sessionType: 'hybrid',
    defaultConfig: { totalQuestions: 20, reviewRatio: 0.25 }
  }
};

export default function StudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Auto-start when coming from daily plan activities (skip preview)
  const { autoStart, ...navState } = location.state || {};
  const [sessionStarted, setSessionStarted] = useState(!!autoStart);

  // Get mode and options from navigation state
  const { mode, title, questionCount, timeLimit, topic, temaId } = navState;

  // Get config for this mode
  const config = modeConfig[mode] || modeConfig.default;
  const Icon = config.icon;
  const displayTitle = title || config.title;

  // Build session config from mode defaults and navigation state
  const sessionConfig = {
    ...config.defaultConfig,
    ...(questionCount && { totalQuestions: questionCount, questionCount }),
    ...(timeLimit && { timeLimit }),
    ...(topic && { tema: topic.number, temaId: topic.id }),
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
  }, []);

  // Handle "next activity" from post-session recommendation
  const handleNextActivity = useCallback((activity) => {
    if (!activity?.config) return;
    // Reset session and navigate to the recommended activity
    setSessionStarted(false);
    // Small delay to let state reset, then start with new config
    setTimeout(() => {
      navigate(ROUTES.STUDY, { state: activity.config, replace: true });
      setSessionStarted(true);
    }, 50);
  }, [navigate]);

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
            onNextActivity={handleNextActivity}
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <div className="text-center max-w-md w-full">
          {/* Mode Icon */}
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6" style={{ background: '#F3F3F0', borderRadius: 20 }}>
            <Icon className="w-10 h-10" style={{ color: '#2D6A4F' }} />
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
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
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {questionCount || config.defaultConfig.totalQuestions || config.defaultConfig.questionCount} preguntas
                </span>
              )}
              {(timeLimit || config.defaultConfig.timeLimit) && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {timeLimit || config.defaultConfig.timeLimit} min
                </span>
              )}
              {mode === 'repaso-errores' && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  Solo errores
                </span>
              )}
              {mode === 'flashcards' && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">
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
            <div className="rounded-xl p-4 mb-6 text-left" style={{ background: '#F3F3F0', border: '1px solid #E8E8E4' }}>
              <p className="text-gray-600 text-sm font-medium mb-2">Condiciones de examen real:</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Respuestas correctas: +1 punto</li>
                <li>• Respuestas incorrectas: -0.25 puntos</li>
                <li>• Preguntas sin responder: 0 puntos</li>
                <li>• Nota de corte: 60%</li>
              </ul>
            </div>
          )}

          {mode === 'flashcards' && (
            <div className="rounded-xl p-4 mb-6 text-left" style={{ background: '#F3F3F0', border: '1px solid #E8E8E4' }}>
              <p className="text-gray-600 text-sm font-medium mb-2">Cómo usar las flashcards:</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Toca la tarjeta para ver la respuesta</li>
                <li>• Desliza a la derecha si lo sabes</li>
                <li>• Desliza a la izquierda para repasar</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 space-y-3">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={handleStart}
            className="w-full py-4 text-white font-semibold rounded-[24px] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
          >
            <Play className="w-5 h-5" />
            Comenzar sesión
          </button>
          <button
            onClick={handleExit}
            className="w-full py-3 text-gray-500 font-medium transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
