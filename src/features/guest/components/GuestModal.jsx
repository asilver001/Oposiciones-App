import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getGuestData, initGuestData, saveSession, dismissGuestModal } from '../guestStorage';
import { selectQuestionsForSession } from '../guestQuestionSelector';
import GuestQuestion from './GuestQuestion';
import GuestResults from './GuestResults';

/**
 * GuestModal — fullscreen overlay with guest questions.
 * Shows directly on home page for new visitors.
 * Closable with X — reveals the real home underneath.
 */
export default function GuestModal({ onClose, onSignup }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function load() {
      let guestData = getGuestData();
      if (!guestData) {
        guestData = initGuestData('2026-06-13');
      }
      const res = await fetch('/guest-questions.json');
      const pool = await res.json();
      const num = guestData.totalSessions + 1;
      setSessionNumber(num);
      const selected = selectQuestionsForSession(num, guestData, pool);
      setQuestions(selected);
      setLoading(false);
    }
    load();
  }, []);

  const handleAnswer = (correct, timeMs) => {
    const q = questions[currentIndex];
    setAnswers(prev => [...prev, { questionId: q.id, correct, timeMs, isReview: !!q.isReview }]);
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      const score = answers.filter(a => a.correct).length;
      saveSession({
        number: sessionNumber,
        completedAt: new Date().toISOString(),
        answers,
        score,
        total: questions.length,
      });
      setShowResults(true);
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const handleClose = () => {
    dismissGuestModal();
    onClose();
  };

  const handleNextSession = () => {
    // Reset for next session
    setShowResults(false);
    setAnswers([]);
    setCurrentIndex(0);
    setLoading(true);
    // Reload questions
    (async () => {
      const guestData = getGuestData();
      if (guestData && guestData.totalSessions >= guestData.maxSessions) {
        onSignup?.();
        return;
      }
      const res = await fetch('/guest-questions.json');
      const pool = await res.json();
      const num = (guestData?.totalSessions || 0) + 1;
      setSessionNumber(num);
      const selected = selectQuestionsForSession(num, guestData, pool);
      setQuestions(selected);
      setLoading(false);
    })();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal card — margin on mobile for overlay effect */}
      <div
        className="relative w-full max-w-[500px] mx-2 sm:mx-4 overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: '#FAFAF7', maxHeight: 'calc(100vh - 16px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2D6A4F] flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">OS</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">OpositaSmart</span>
          </div>
          <div className="flex items-center gap-3">
            {onSignup && (
              <button onClick={onSignup} className="text-xs text-[#2D6A4F] font-medium hover:underline">
                Crear cuenta
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
          {/* Subtitle — only on first question of first session */}
          {!loading && !showResults && currentIndex === 0 && sessionNumber === 1 && (
            <p className="text-center text-sm text-gray-400 pt-3 pb-1 px-4">Descubre tu nivel en 2 minutos</p>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400">Cargando...</p>
            </div>
          ) : showResults ? (
            <div className="p-4">
              <GuestResults
                embedded={true}
                onNext={handleNextSession}
                onClose={handleClose}
                onSignup={onSignup}
              />
            </div>
          ) : (
            <GuestQuestion
              key={questions[currentIndex]?.id + currentIndex}
              question={questions[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
