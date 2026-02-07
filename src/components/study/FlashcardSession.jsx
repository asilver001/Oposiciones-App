/**
 * FlashcardSession
 *
 * Interactive flashcard study mode with swipe/flip interaction.
 * Based on FSRS algorithm for spaced repetition tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  Trophy, ThumbsUp, ThumbsDown, RotateCcw,
  Check, X, Brain, ArrowLeft, Loader2, XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateHybridSession, updateProgress, recordDailyStudy } from '../../services/spacedRepetitionService';

// Spring animation configs
const spring = {
  bouncy: { type: 'spring', stiffness: 400, damping: 25 },
  smooth: { type: 'spring', stiffness: 200, damping: 30 },
  snappy: { type: 'spring', stiffness: 500, damping: 35 }
};

export default function FlashcardSession({ config = {}, onClose, onComplete }) {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState({ known: [], review: [] });
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Motion values for swipe
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Load questions for flashcards
  useEffect(() => {
    async function loadCards() {
      if (!user?.id) {
        setError('Inicia sesión para usar las flashcards');
        setIsLoading(false);
        return;
      }

      try {
        const sessionConfig = {
          totalQuestions: config.totalQuestions || 20,
          tema: config.tema || config.temaId || null,
          reviewRatio: 0.3 // More review for memorization
        };

        const questions = await generateHybridSession(user.id, sessionConfig);

        if (questions.length === 0) {
          setError('No hay preguntas disponibles');
          setCards([]);
        } else {
          // Transform questions to flashcard format using options JSONB array
          const flashcards = questions.map(q => {
            // Get correct answer text from options array
            const correctOption = q.options?.find(opt => opt.is_correct === true);
            const correctAnswerText = correctOption?.text || 'Respuesta no disponible';

            return {
              id: q.id,
              front: q.question_text,
              back: correctAnswerText,
              topic: q.tema,
              explanation: q.explanation,
              isReview: q.isReview
            };
          });
          setCards(flashcards);
        }
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError('Error al cargar las flashcards');
      } finally {
        setIsLoading(false);
      }
    }

    loadCards();
  }, [user?.id, config]);

  const currentCard = cards[currentIndex];

  // Handle swipe decision
  const handleSwipe = useCallback(async (direction) => {
    if (!currentCard || !user?.id) return;

    const wasCorrect = direction === 'right';

    // Track result locally
    if (wasCorrect) {
      setResults(prev => ({ ...prev, known: [...prev.known, currentCard] }));
    } else {
      setResults(prev => ({ ...prev, review: [...prev.review, currentCard] }));
    }

    // Update progress in database
    try {
      await updateProgress(user.id, currentCard.id, wasCorrect);
    } catch (err) {
      console.error('Error updating progress:', err);
    }

    // Move to next card or finish
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      x.set(0); // Reset position
    } else {
      // Session complete
      try {
        await recordDailyStudy(user.id, cards.length, results.known.length + (wasCorrect ? 1 : 0));
      } catch (err) {
        console.error('Error recording session:', err);
      }
      setIsFinished(true);
    }
  }, [currentCard, currentIndex, cards.length, results.known.length, user?.id, x]);

  // Handle drag end
  const handleDragEnd = useCallback((event, info) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    } else {
      x.set(0); // Snap back
    }
  }, [handleSwipe, x]);

  // Reset for new session
  const resetStudy = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults({ known: [], review: [] });
    setIsFinished(false);
  }, []);

  // Study only failed cards again
  const studyReviewCards = useCallback(() => {
    if (results.review.length > 0) {
      setCards(results.review);
      resetStudy();
    }
  }, [results.review, resetStudy]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-gray-600">Preparando flashcards...</p>
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

  // Completed state
  if (isFinished) {
    const totalAnswered = results.known.length + results.review.length;
    const accuracy = totalAnswered > 0 ? Math.round((results.known.length / totalAnswered) * 100) : 0;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-medium text-gray-700">Flashcards</span>
            <div className="w-9" />
          </div>
        </div>

        <motion.div
          className="flex-1 flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.bouncy}
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-md">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Sesión completada!</h2>
          <p className="text-gray-500 mb-6">Has revisado {cards.length} tarjetas</p>

          {/* Results */}
          <div className="w-full max-w-xs space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700">Lo sé</p>
                  <p className="text-xs text-emerald-600">Bien memorizadas</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-emerald-600">{results.known.length}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-700">A repasar</p>
                  <p className="text-xs text-amber-600">Necesitan práctica</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-600">{results.review.length}</span>
            </div>

            {/* Accuracy */}
            <div className="text-center py-2">
              <span className="text-gray-500">Tasa de acierto: </span>
              <span className="font-bold text-brand-600">{accuracy}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {results.review.length > 0 && (
              <motion.button
                onClick={studyReviewCards}
                className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Repasar {results.review.length} pendientes
              </motion.button>
            )}
            <motion.button
              onClick={() => {
                onComplete?.({
                  total: cards.length,
                  known: results.known.length,
                  review: results.review.length
                });
                onClose?.();
              }}
              className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Terminar
            </motion.button>
            <motion.button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl"
              whileTap={{ scale: 0.98 }}
            >
              Volver al inicio
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active session
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium text-gray-700">
            {currentIndex + 1} / {cards.length}
          </span>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex) / cards.length) * 100}%` }}
              transition={spring.smooth}
            />
          </div>
        </div>

        {/* Swipe indicators */}
        <div className="flex justify-between mb-4 px-4">
          <motion.div
            className="flex items-center gap-2 text-amber-500"
            animate={{ opacity: x.get() < -50 ? 1 : 0.5 }}
          >
            <ThumbsDown className="w-5 h-5" />
            <span className="text-sm font-medium">No lo sé</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-emerald-500"
            animate={{ opacity: x.get() > 50 ? 1 : 0.5 }}
          >
            <span className="text-sm font-medium">Lo sé</span>
            <ThumbsUp className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Card stack */}
        <div className="relative flex-1 flex items-center justify-center min-h-[300px]" style={{ perspective: '1000px' }}>
          {/* Background cards */}
          {cards.slice(currentIndex + 1, currentIndex + 3).map((card, i) => (
            <div
              key={card.id}
              className="absolute w-full max-w-[320px] h-[280px] bg-white rounded-2xl shadow-lg border border-gray-100"
              style={{
                transform: `scale(${1 - (i + 1) * 0.05}) translateY(${(i + 1) * 8}px)`,
                zIndex: -i - 1,
              }}
            />
          ))}

          {/* Active card */}
          {currentCard && (
            <motion.div
              className="absolute w-full max-w-[320px] h-[280px] cursor-grab active:cursor-grabbing"
              style={{ x, rotate, opacity, transformStyle: 'preserve-3d' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              onClick={() => setIsFlipped(!isFlipped)}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={spring.snappy}
              >
                {/* Front - Question */}
                <div
                  className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {currentCard.topic && (
                    <span className="text-xs text-brand-500 font-medium mb-3 px-2 py-1 bg-brand-50 rounded-full">
                      {currentCard.topic}
                    </span>
                  )}
                  {currentCard.isReview && (
                    <span className="absolute top-4 right-4 text-xs text-amber-500 font-medium px-2 py-1 bg-amber-50 rounded-full">
                      Repaso
                    </span>
                  )}
                  <p className="text-center text-gray-800 font-medium leading-relaxed text-lg">
                    {currentCard.front}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">Toca para ver respuesta</p>
                </div>

                {/* Back - Answer */}
                <div
                  className="absolute inset-0 bg-brand-600 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center text-white"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <Brain className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-center text-xl font-bold leading-relaxed mb-2">
                    {currentCard.back}
                  </p>
                  {currentCard.explanation && (
                    <p className="text-center text-brand-200 text-sm mt-2 line-clamp-3">
                      {currentCard.explanation}
                    </p>
                  )}
                  <p className="text-xs text-brand-200 mt-4">Desliza para continuar</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Action buttons (alternative to swipe) */}
        <div className="flex justify-center gap-4 mt-6">
          <motion.button
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Current stats */}
        <div className="mt-6 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <span className="font-bold text-emerald-600">{results.known.length}</span>
            <p className="text-gray-500">Lo sé</p>
          </div>
          <div className="text-center">
            <span className="font-bold text-amber-600">{results.review.length}</span>
            <p className="text-gray-500">A repasar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
