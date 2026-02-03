/**
 * SimulacroSession
 *
 * Full exam simulation mode - 100 questions, 60 minutes, real exam experience.
 * Includes timer, question navigation, and results summary.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Check, X, AlertTriangle, Trophy, ArrowLeft,
  ArrowRight, ChevronLeft, ChevronRight, Loader2, XCircle,
  Flag, ListOrdered, BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateHybridSession, updateProgress, recordDailyStudy } from '../../services/spacedRepetitionService';
import ExamTimer from './ExamTimer';

// Exam configuration
const EXAM_CONFIG = {
  totalQuestions: 100,
  timeMinutes: 60,
  // Scoring: correct = +1, incorrect = -0.25, blank = 0
  correctPoints: 1,
  incorrectPenalty: 0.25,
  passingScore: 60 // % to pass
};

export default function SimulacroSession({ config = {}, onClose, onComplete }) {
  const { user } = useAuth();

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: selectedAnswer }
  const [flagged, setFlagged] = useState(new Set()); // Flagged questions for review
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [remainingTime, setRemainingTime] = useState(EXAM_CONFIG.timeMinutes * 60);

  // Load questions
  useEffect(() => {
    async function loadExam() {
      if (!user?.id) {
        setError('Inicia sesión para realizar el simulacro');
        setIsLoading(false);
        return;
      }

      try {
        // Get 100 random questions (no review priority - simulate real exam)
        const sessionConfig = {
          totalQuestions: config.totalQuestions || EXAM_CONFIG.totalQuestions,
          reviewRatio: 0, // No reviews - fresh random questions
          adaptiveDifficulty: false // No adaptation - real exam conditions
        };

        const loadedQuestions = await generateHybridSession(user.id, sessionConfig);

        // Debug: Log question count and check for missing options
        console.log(`SimulacroSession: Loaded ${loadedQuestions.length} questions`);
        const questionsWithoutOptions = loadedQuestions.filter(q => !q.options || !Array.isArray(q.options) || q.options.length === 0);
        if (questionsWithoutOptions.length > 0) {
          console.warn(`SimulacroSession: ${questionsWithoutOptions.length} questions have no options:`, questionsWithoutOptions.map(q => q.id));
        }

        if (loadedQuestions.length === 0) {
          setError('No hay suficientes preguntas para el simulacro');
        } else {
          setQuestions(loadedQuestions);
        }
      } catch (err) {
        console.error('Error loading exam:', err);
        setError('Error al cargar el simulacro');
      } finally {
        setIsLoading(false);
      }
    }

    loadExam();
  }, [user?.id, config]);

  const currentQuestion = questions[currentIndex];

  // Helper to get correct answer from options array
  const getCorrectAnswer = (question) => {
    if (!question?.options) return null;
    const correctOption = question.options.find(opt => opt.is_correct === true);
    return correctOption?.id || null;
  };

  // Calculate stats
  const stats = useMemo(() => {
    const answered = Object.keys(answers).length;
    const correct = Object.entries(answers).filter(([qId, ans]) => {
      const q = questions.find(q => q.id === qId);
      return q && ans === getCorrectAnswer(q);
    }).length;
    const incorrect = answered - correct;

    // Exam scoring
    const rawScore = (correct * EXAM_CONFIG.correctPoints) - (incorrect * EXAM_CONFIG.incorrectPenalty);
    const maxScore = questions.length * EXAM_CONFIG.correctPoints;
    const percentage = maxScore > 0 ? Math.max(0, (rawScore / maxScore) * 100) : 0;
    const passed = percentage >= EXAM_CONFIG.passingScore;

    return { answered, correct, incorrect, rawScore, maxScore, percentage, passed };
  }, [answers, questions]);

  // Handle answer selection
  const handleAnswer = useCallback((answer) => {
    if (!currentQuestion) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [currentQuestion, currentIndex, questions.length]);

  // Navigation
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setShowNavigation(false);
    }
  }, [questions.length]);

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Toggle flag
  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  }, [currentQuestion]);

  // End exam
  const endExam = useCallback(async () => {
    setShowConfirmEnd(false);
    setIsFinished(true);

    if (!user?.id) return;

    // Save progress for each answered question
    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        const question = questions.find(q => q.id === questionId);
        if (question) {
          const correctOpt = question.options?.find(opt => opt.is_correct === true);
          const wasCorrect = answer === correctOpt?.id;
          await updateProgress(user.id, questionId, wasCorrect);
        }
      }

      // Record session
      await recordDailyStudy(user.id, questions.length, stats.correct);
    } catch (err) {
      console.error('Error saving exam results:', err);
    }
  }, [answers, questions, stats.correct, user?.id]);

  // Time's up handler
  const handleTimeUp = useCallback(() => {
    endExam();
  }, [endExam]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-600 mx-auto mb-4" />
          <p className="text-gray-600">Preparando simulacro...</p>
          <p className="text-sm text-gray-400 mt-2">Cargando {EXAM_CONFIG.totalQuestions} preguntas</p>
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

  // Results screen
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3">
          <div className="max-w-lg mx-auto text-center">
            <span className="font-medium text-gray-700">Resultados del Simulacro</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full">
          {/* Result icon */}
          <motion.div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              stats.passed
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                : 'bg-gradient-to-br from-rose-400 to-rose-600'
            } shadow-lg`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {stats.passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {stats.passed ? '¡Aprobado!' : 'No aprobado'}
          </h2>
          <p className="text-gray-500 mb-6">
            {stats.passed
              ? 'Has superado el simulacro. ¡Sigue así!'
              : 'Necesitas más práctica. ¡No te rindas!'
            }
          </p>

          {/* Score card */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Main score */}
            <div className="text-center mb-6">
              <div className={`text-5xl font-bold ${stats.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.percentage.toFixed(1)}%
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Puntuación: {stats.rawScore.toFixed(2)} / {stats.maxScore}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">{stats.correct}</div>
                <div className="text-xs text-emerald-700">Correctas</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <div className="text-2xl font-bold text-rose-600">{stats.incorrect}</div>
                <div className="text-xs text-rose-700">Incorrectas</div>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <div className="text-2xl font-bold text-gray-600">
                  {questions.length - stats.answered}
                </div>
                <div className="text-xs text-gray-700">Sin responder</div>
              </div>
            </div>

            {/* Passing threshold */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Nota de corte:</span>
                <span className="font-medium">{EXAM_CONFIG.passingScore}%</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Penalización por error:</span>
                <span className="font-medium">-{EXAM_CONFIG.incorrectPenalty} puntos</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => {
                onComplete?.(stats);
                onClose?.();
              }}
              className="w-full py-4 bg-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-colors"
            >
              Finalizar
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active exam
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Confirm end modal */}
      <AnimatePresence>
        {showConfirmEnd && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Entregar examen?</h3>
              <p className="text-gray-600 mb-4">
                Has respondido {stats.answered} de {questions.length} preguntas.
              </p>
              {stats.answered < questions.length && (
                <p className="text-amber-600 text-sm mb-4">
                  Tienes {questions.length - stats.answered} preguntas sin responder.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmEnd(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Continuar
                </button>
                <button
                  onClick={endExam}
                  className="flex-1 px-4 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition"
                >
                  Entregar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question navigation grid */}
      <AnimatePresence>
        {showNavigation && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNavigation(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Navegación</h3>
                <button
                  onClick={() => setShowNavigation(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-10 gap-2">
                  {questions.map((q, i) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isFlagged = flagged.has(q.id);
                    const isCurrent = i === currentIndex;

                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(i)}
                        className={`
                          w-8 h-8 rounded-lg text-sm font-medium transition-all
                          ${isCurrent ? 'ring-2 ring-rose-500' : ''}
                          ${isAnswered ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}
                          ${isFlagged ? 'ring-2 ring-amber-400' : ''}
                        `}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-emerald-100 rounded"></span> Respondida
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-gray-100 rounded"></span> Sin responder
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-amber-100 rounded ring-2 ring-amber-400"></span> Marcada
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setShowConfirmEnd(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Salir</span>
          </button>

          <ExamTimer
            totalMinutes={config.timeLimit || EXAM_CONFIG.timeMinutes}
            onTimeUp={handleTimeUp}
            onTick={setRemainingTime}
          />

          <button
            onClick={() => setShowConfirmEnd(true)}
            className="px-4 py-2 bg-rose-100 text-rose-600 font-semibold rounded-lg hover:bg-rose-200 transition text-sm"
          >
            Entregar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto">
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(stats.answered / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col p-4 max-w-3xl mx-auto w-full">
        {/* Question header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Pregunta {currentIndex + 1} de {questions.length}
            </span>
            {flagged.has(currentQuestion?.id) && (
              <span className="text-amber-500 text-xs font-medium px-2 py-0.5 bg-amber-50 rounded">
                Marcada
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFlag}
              className={`p-2 rounded-lg transition ${
                flagged.has(currentQuestion?.id)
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNavigation(true)}
              className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question text */}
        {currentQuestion && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-4">
            <p className="text-gray-800 text-lg leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>
        )}

        {/* Answer options */}
        {currentQuestion && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const key = opt?.id || ['a', 'b', 'c', 'd'][idx] || `opt-${idx}`;
              const optionText = opt?.text;
              if (!optionText) return null;

              const isSelected = answers[currentQuestion.id] === key;

              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all
                    ${isSelected
                      ? 'bg-rose-100 border-2 border-rose-500 text-rose-700'
                      : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0
                      ${isSelected ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {key.toUpperCase()}
                    </span>
                    <span className="flex-1">{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : currentQuestion ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700">
            <p className="font-medium">Pregunta sin opciones disponibles</p>
            <p className="text-sm mt-1">Esta pregunta no tiene opciones de respuesta. Usa los botones de navegación para continuar.</p>
          </div>
        ) : null}

        {/* Navigation buttons */}
        <div className="mt-auto pt-6 flex justify-between items-center">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition
              ${currentIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>

          <span className="text-sm text-gray-500">
            {stats.answered} / {questions.length} respondidas
          </span>

          <button
            onClick={currentIndex === questions.length - 1 ? () => setShowConfirmEnd(true) : goNext}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition
              ${currentIndex === questions.length - 1
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {currentIndex === questions.length - 1 ? 'Entregar' : 'Siguiente'}
            {currentIndex < questions.length - 1 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
