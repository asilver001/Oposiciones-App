import React, { useState, useEffect, useRef } from 'react';
import { Loader2, XCircle } from 'lucide-react';
import { useStudySession } from '../../hooks/useSpacedRepetition';
import { useUserInsights } from '../../hooks/useUserInsights';
import SessionComplete from './SessionComplete';
import SessionHeader from './SessionHeader';
import QuestionCard from './QuestionCard';

export default function HybridSession({ config = {}, onClose, onComplete }) {
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
    completeSession
  } = useStudySession(config);

  const { saveSessionAndDetectInsights, loading: insightsLoading } = useUserInsights();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Track individual answers for insights detection
  const answersHistoryRef = useRef([]);
  const [triggeredInsights, setTriggeredInsights] = useState([]);
  const [insightsProcessed, setInsightsProcessed] = useState(false);

  // Load session on mount
  useEffect(() => {
    loadSession(config);
  }, []);

  // Handle answer selection
  const handleSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    // Determine correct answer from options array (no correct_answer column in DB)
    const correctOpt = (Array.isArray(currentQuestion.options) ? currentQuestion.options : [])
      .find(o => o.is_correct === true);
    const correctKey = correctOpt?.id || currentQuestion.correct_answer;
    const isCorrect = answer === correctKey;

    // Track this answer for insights
    answersHistoryRef.current.push({
      question_id: currentQuestion.id,
      es_correcta: isCorrect,
      respuesta_usuario: answer,
      respuesta_correcta: correctKey,
      tema: currentQuestion.tema
    });

    // Delay before recording and moving on
    setTimeout(() => {
      answerQuestion(isCorrect);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  // Handle session complete - save stats and detect insights
  useEffect(() => {
    if (isComplete && !insightsProcessed) {
      const processCompletion = async () => {
        setInsightsProcessed(true);
        await completeSession();

        if (answersHistoryRef.current.length > 0) {
          try {
            const { triggeredInsights: insights } = await saveSessionAndDetectInsights(
              answersHistoryRef.current,
              { modo: 'estudio', tema_id: config.temaId || null }
            );
            if (insights && insights.length > 0) {
              setTriggeredInsights(insights);
            }
          } catch (err) {
            console.error('Error detecting insights:', err);
          }
        }
      };
      processCompletion();
    }
  }, [isComplete, insightsProcessed, completeSession, saveSessionAndDetectInsights, config.temaId]);

  // Reset state when starting new session
  const handleNewSession = () => {
    answersHistoryRef.current = [];
    setTriggeredInsights([]);
    setInsightsProcessed(false);
    loadSession(config);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Preparando sesión de estudio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Session complete
  if (isComplete) {
    return (
      <SessionComplete
        sessionStats={sessionStats}
        triggeredInsights={triggeredInsights}
        insightsLoading={insightsLoading}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No hay preguntas</p>
      </div>
    );
  }

  // Active session
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
        showResult={showResult}
        onSelectAnswer={handleSelect}
      />

      {/* Bottom stats */}
      <div className="bg-white border-t p-4">
        <div className="max-w-lg mx-auto flex justify-around text-center">
          <div>
            <p className="text-lg font-bold text-green-600">{sessionStats.correct}</p>
            <p className="text-xs text-gray-500">Correctas</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">{sessionStats.answered - sessionStats.correct}</p>
            <p className="text-xs text-gray-500">Incorrectas</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">{sessionStats.total - sessionStats.answered}</p>
            <p className="text-xs text-gray-500">Restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
