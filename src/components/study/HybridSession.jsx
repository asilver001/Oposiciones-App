import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, XCircle, RefreshCw, Clock, BookOpen } from 'lucide-react';
import { useStudySession } from '../../hooks/useSpacedRepetition';
import { useUserInsights } from '../../hooks/useUserInsights';
import { useAuth } from '../../hooks/useAuth';
import { generateWeaknessSummary } from '../../services/weaknessAnalyzer';
import EmptyState from '../common/EmptyState/EmptyState';
import SessionComplete from './SessionComplete';
import SessionHeader from './SessionHeader';
import QuestionCard from './QuestionCard';

export default function HybridSession({ config = {}, onClose, onComplete, onNextActivity }) {
  const {
    currentQuestion,
    currentIndex,
    isLoading,
    error,
    sessionStats,
    isComplete,
    progress,
    loadSession,
    answerQuestion,
    skipQuestion,
    completeSession
  } = useStudySession(config);

  const { saveSessionAndDetectInsights, loading: insightsLoading } = useUserInsights();
  const { user } = useAuth();
  const [, setSearchParams] = useSearchParams();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Track individual answers for insights detection
  const answersHistoryRef = useRef([]);
  const [triggeredInsights, setTriggeredInsights] = useState([]);
  const [insightsProcessed, setInsightsProcessed] = useState(false);

  // Loading timeout and retry
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const LOADING_TIMEOUT_MS = 15000;

  // Load session on mount
  useEffect(() => {
    loadSession(config);
  }, []);

  // Loading timeout
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      if (isLoading) setLoadingTimedOut(true);
    }, LOADING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Retry handler
  const handleRetry = () => {
    setRetryCount(c => c + 1);
    setLoadingTimedOut(false);
    answersHistoryRef.current = [];
    setTriggeredInsights([]);
    setInsightsProcessed(false);
    loadSession(config);
  };

  // Handle answer selection — no correct/incorrect reveal, advance quickly
  const handleSelect = (answer) => {
    if (selectedAnswer) return; // prevent double-tap
    setSelectedAnswer(answer);

    // Determine correct answer from options (JSONB array or JSON string)
    let opts = currentQuestion.options;
    if (typeof opts === 'string') {
      try { opts = JSON.parse(opts); } catch { opts = []; }
    }
    if (!Array.isArray(opts)) opts = [];
    const keys = ['a', 'b', 'c', 'd'];
    const correctIdx = opts.findIndex(o => Boolean(o.is_correct));
    const correctKey = correctIdx >= 0
      ? (opts[correctIdx]?.id || keys[correctIdx] || `${correctIdx}`)
      : null;
    const isCorrect = answer === correctKey;

    // Track this answer with full question data for correction view
    answersHistoryRef.current.push({
      question_id: currentQuestion.id,
      question: currentQuestion,
      es_correcta: isCorrect,
      respuesta_usuario: answer,
      respuesta_correcta: correctKey,
      tema: currentQuestion.tema
    });

    // Brief selection flash then advance (no correct/incorrect feedback)
    setTimeout(() => {
      answerQuestion(isCorrect);
      setSelectedAnswer(null);
    }, 250);
  };

  // Handle skip — track the question as skipped for correction view
  const handleSkip = () => {
    // Determine correct answer for tracking
    let opts = currentQuestion.options;
    if (typeof opts === 'string') {
      try { opts = JSON.parse(opts); } catch { opts = []; }
    }
    if (!Array.isArray(opts)) opts = [];
    const keys = ['a', 'b', 'c', 'd'];
    const correctIdx = opts.findIndex(o => Boolean(o.is_correct));
    const correctKey = correctIdx >= 0
      ? (opts[correctIdx]?.id || keys[correctIdx] || `${correctIdx}`)
      : null;

    answersHistoryRef.current.push({
      question_id: currentQuestion.id,
      question: currentQuestion,
      es_correcta: false,
      respuesta_usuario: null,
      respuesta_correcta: correctKey,
      tema: currentQuestion.tema,
      skipped: true
    });

    skipQuestion();
  };

  // Handle session complete - save stats and detect insights + weaknesses
  useEffect(() => {
    if (isComplete && !insightsProcessed) {
      const processCompletion = async () => {
        setInsightsProcessed(true);
        // Signal to MainLayout that session is complete so navbar becomes visible
        setSearchParams({ complete: '1' }, { replace: true });
        await completeSession();

        const allInsights = [];

        // Single-session insight detection
        if (answersHistoryRef.current.length > 0) {
          try {
            const { triggeredInsights: insights } = await saveSessionAndDetectInsights(
              answersHistoryRef.current,
              { modo: 'practica', tema_id: config.temaId || null }
            );
            if (insights && insights.length > 0) {
              allInsights.push(...insights);
            }
          } catch (err) {
            console.error('Error detecting insights:', err);
          }
        }

        // Cross-session weakness analysis (runs in parallel after session save)
        if (user?.id) {
          try {
            const weaknessInsights = await generateWeaknessSummary(user.id);
            if (weaknessInsights.length > 0) {
              allInsights.push(...weaknessInsights);
            }
          } catch (err) {
            console.error('Error analyzing weaknesses:', err);
          }
        }

        if (allInsights.length > 0) {
          setTriggeredInsights(allInsights);
        }
      };
      processCompletion();
    }
  }, [isComplete, insightsProcessed, completeSession, saveSessionAndDetectInsights, config.temaId, user?.id]);

  // Reset state when starting new session
  const handleNewSession = () => {
    answersHistoryRef.current = [];
    setTriggeredInsights([]);
    setInsightsProcessed(false);
    setSearchParams({}, { replace: true }); // Clear completion signal
    loadSession(config);
  };

  // Compute next step recommendation based on session performance
  // Must be before early returns to satisfy Rules of Hooks
  const nextActivity = useMemo(() => {
    if (!isComplete) return null;
    const accuracy = sessionStats.answered > 0
      ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
      : 0;

    if (accuracy < 60 && sessionStats.answered >= 5) {
      return {
        title: 'Repasar errores',
        description: `Has fallado ${sessionStats.answered - sessionStats.correct} preguntas. Repásalas para consolidar.`,
        config: { mode: 'repaso-errores', totalQuestions: Math.min(15, sessionStats.answered - sessionStats.correct + 5), failedOnly: true, title: 'Repaso de errores' }
      };
    }
    if (config.tema) {
      return {
        title: 'Continuar practicando',
        description: 'Sigue con más preguntas para dominar este tema.',
        config: { mode: 'practica-tema', topic: config.topic || { number: config.tema }, totalQuestions: 15, title: 'Más práctica' }
      };
    }
    return {
      title: 'Test rápido',
      description: '10 preguntas aleatorias para seguir practicando.',
      config: { mode: 'test-rapido', totalQuestions: 10, title: 'Test rápido' }
    };
  }, [isComplete, sessionStats, config.tema, config.topic]);

  // Loading state (with timeout)
  if (isLoading && !loadingTimedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F3F3F0' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#2D6A4F' }} />
          <p className="text-gray-600">Preparando sesión de estudio...</p>
        </div>
      </div>
    );
  }

  // Loading timed out or error state
  if (loadingTimedOut || error) {
    const hasRetriesLeft = retryCount < MAX_RETRIES;
    const isTimeout = loadingTimedOut && !error;

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F3F3F0' }}>
        <div className="text-center max-w-sm">
          <div className={`w-16 h-16 ${isTimeout ? 'bg-amber-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isTimeout
              ? <Clock className="w-8 h-8 text-amber-500" />
              : <XCircle className="w-8 h-8 text-red-500" />
            }
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isTimeout ? 'Carga lenta' : 'Error'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isTimeout
              ? 'La sesión está tardando más de lo esperado.'
              : error
            }
          </p>
          {hasRetriesLeft ? (
            <>
              <p className="text-sm text-gray-400 mb-4">
                Intento {retryCount + 1} de {MAX_RETRIES}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Volver
                </button>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 text-white rounded-lg flex items-center gap-2"
                  style={{ background: '#2D6A4F' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                No se pudo cargar tras {MAX_RETRIES} intentos. Vuelve a intentarlo más tarde.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Session complete
  if (isComplete) {
    return (
      <SessionComplete
        sessionStats={sessionStats}
        answersHistory={answersHistoryRef.current} // eslint-disable-line react-hooks/refs
        triggeredInsights={triggeredInsights}
        insightsLoading={insightsLoading}
        nextActivity={nextActivity}
        onNextActivity={onNextActivity}
        onNewSession={handleNewSession}
        onClose={() => {
          onComplete?.(sessionStats);
          onClose?.();
        }}
      />
    );
  }

  // No question available
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F3F3F0' }}>
        <EmptyState
          icon={BookOpen}
          title="No hay preguntas disponibles"
          description="Selecciona otro tema o modo de estudio"
          actionLabel="Volver"
          onAction={onClose}
        />
      </div>
    );
  }

  // Active session
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F3F3F0' }}>
      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Salir del test?</h3>
            <p className="text-gray-600 mb-6">Perderás el progreso de este test</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onClose?.();
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <SessionHeader
        currentIndex={currentIndex}
        total={sessionStats.total}
        progress={progress}
        isReview={currentQuestion.isReview}
        onExitClick={() => setShowExitConfirm(true)}
      />

      {/* Question */}
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelect}
        onSkip={handleSkip}
      />

      {/* Bottom stats — don't reveal correct/incorrect during session */}
      <div className="bg-white border-t p-4">
        <div className="max-w-lg mx-auto flex justify-around text-center">
          <div>
            <p className="text-lg font-bold" style={{ color: '#2D6A4F' }}>{sessionStats.answered}</p>
            <p className="text-xs text-gray-500">Respondidas</p>
          </div>
          {sessionStats.skipped > 0 && (
            <div>
              <p className="text-lg font-bold text-amber-500">{sessionStats.skipped}</p>
              <p className="text-xs text-gray-500">Saltadas</p>
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-gray-600">{sessionStats.total - sessionStats.answered - sessionStats.skipped}</p>
            <p className="text-xs text-gray-500">Restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
