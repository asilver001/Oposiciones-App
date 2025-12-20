import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  Target,
  Flame,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useStudySession } from '../../hooks/useSpacedRepetition';
import { useUserInsights } from '../../hooks/useUserInsights';
import InsightCard from '../InsightCard';

/**
 * Map insight type to severity level for styling
 */
function getSeverityFromType(tipo) {
  const severityMap = {
    'error_comun': 'danger',
    'concepto_clave': 'warning',
    'tecnica_memorizacion': 'info',
    'patron_fallo': 'danger',
    'refuerzo_positivo': 'success',
    'consejo': 'info'
  };
  return severityMap[tipo] || 'info';
}

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

    const isCorrect = answer === currentQuestion.correct_answer;

    // Track this answer for insights
    answersHistoryRef.current.push({
      question_id: currentQuestion.id,
      es_correcta: isCorrect,
      respuesta_usuario: answer,
      respuesta_correcta: currentQuestion.correct_answer,
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
        // Mark as processed to prevent duplicate calls
        setInsightsProcessed(true);

        // Complete the session (records daily study)
        await completeSession();

        // Detect insights based on answered questions
        if (answersHistoryRef.current.length > 0) {
          try {
            const { triggeredInsights: insights } = await saveSessionAndDetectInsights(
              answersHistoryRef.current,
              {
                modo: 'estudio',
                tema_id: config.temaId || null
              }
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
    const accuracy = sessionStats.answered > 0
      ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          {/* Trophy */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            {accuracy >= 80 && (
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Sesión completada!
          </h2>

          <p className="text-gray-600 mb-6">
            {accuracy >= 80 ? '¡Excelente trabajo!' :
             accuracy >= 60 ? '¡Buen progreso!' :
             'Sigue practicando, mejorarás pronto'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{sessionStats.answered}</p>
              <p className="text-xs text-gray-500">Respondidas</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{sessionStats.correct}</p>
              <p className="text-xs text-gray-500">Correctas</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <RotateCcw className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{sessionStats.reviews}</p>
              <p className="text-xs text-gray-500">Repasos</p>
            </div>
          </div>

          {/* Accuracy bar */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Precisión</span>
              <span className="font-bold text-purple-600">{accuracy}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  accuracy >= 80 ? 'bg-green-500' :
                  accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          {/* Insights Section */}
          {triggeredInsights.length > 0 && (
            <div className="mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-700">Analisis de tus errores</h3>
              </div>
              <div className="space-y-3">
                {triggeredInsights.map((insight, index) => (
                  <InsightCard
                    key={insight.templateId || index}
                    emoji={insight.emoji || '💡'}
                    titulo={insight.titulo}
                    descripcion={insight.descripcion}
                    severidad={getSeverityFromType(insight.tipo)}
                    totalFalladas={insight.totalFailed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Loading insights indicator */}
          {insightsLoading && (
            <div className="mb-6 flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analizando errores...</span>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleNewSession}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Nueva sesion
            </button>
            <button
              onClick={() => {
                onComplete?.(sessionStats);
                onClose?.();
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No hay preguntas</p>
      </div>
    );
  }

  const options = [
    { key: 'a', text: currentQuestion.option_a },
    { key: 'b', text: currentQuestion.option_b },
    { key: 'c', text: currentQuestion.option_c },
    { key: 'd', text: currentQuestion.option_d }
  ];

  const correctAnswer = currentQuestion.correct_answer;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">
              {currentIndex + 1} / {sessionStats.total}
            </span>
            {currentQuestion.isReview && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                <RotateCcw className="w-3 h-3 inline mr-1" />
                Repaso
              </span>
            )}
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Tema badge */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Tema {currentQuestion.tema}</span>
          </div>

          {/* Question text */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.key;
              const isCorrect = opt.key === correctAnswer;

              let bgColor = 'bg-white hover:bg-gray-50';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-800';

              if (showResult) {
                if (isCorrect) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-800';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-50';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-800';
                }
              } else if (isSelected) {
                borderColor = 'border-purple-500';
                bgColor = 'bg-purple-50';
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgColor} ${borderColor} ${textColor} ${
                    showResult ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                      showResult && isCorrect ? 'bg-green-500 border-green-500 text-white' :
                      showResult && isSelected && !isCorrect ? 'bg-red-500 border-red-500 text-white' :
                      'border-current'
                    }`}>
                      {showResult && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                       showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                       opt.key.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-blue-800 mb-1">Explicación</p>
              <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
              {currentQuestion.legal_reference && (
                <p className="text-xs text-blue-500 mt-2">
                  📚 {currentQuestion.legal_reference}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

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
