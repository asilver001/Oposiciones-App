import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getGuestData, initGuestData, saveSession, dismissGuestModal } from '../guestStorage';
import { selectQuestionsForSession } from '../guestQuestionSelector';
import GuestQuestion from './GuestQuestion';
import GuestResults from './GuestResults';

/**
 * GuestModal — centered popup on home for new visitors.
 * Step 1 (intro): asks if they want a level test, editorial style.
 * Step 2 (questions): 5-question mini-test, results, continue/signup.
 * Closable with X — reveals the real home underneath.
 */
export default function GuestModal({ onClose, onSignup }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'test'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startTest = async () => {
    setStep('test');
    setLoading(true);
    let guestData = getGuestData();
    if (!guestData) guestData = initGuestData('2026-06-13');
    try {
      const res = await fetch(`${import.meta.env.BASE_URL || '/'}guest-questions.json`);
      const pool = await res.json();
      const num = guestData.totalSessions + 1;
      setSessionNumber(num);
      setQuestions(selectQuestionsForSession(num, guestData, pool));
    } catch (err) {
      console.error('Failed to load guest questions:', err);
    }
    setLoading(false);
  };

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
      const res = await fetch(`${import.meta.env.BASE_URL || '/'}guest-questions.json`);
      const pool = await res.json();
      const num = (guestData?.totalSessions || 0) + 1;
      setSessionNumber(num);
      const selected = selectQuestionsForSession(num, guestData, pool);
      setQuestions(selected);
      setLoading(false);
    })();
  };

  const ink = '#1B4332';
  const inkSoft = '#2D6A4F';
  const paper = '#F3F3F0';
  const muted = '#8A8783';
  const rule = 'rgba(27,67,50,0.12)';
  const serif = '"Instrument Serif", Georgia, serif';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[520px] mx-3 sm:mx-4 overflow-hidden shadow-2xl"
        style={{ background: paper, maxHeight: 'calc(100vh - 16px)', fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: `1px solid ${rule}` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{ background: ink }}
            >
              <span style={{ color: paper, fontSize: 8, fontWeight: 700, letterSpacing: 0.5 }}>OS</span>
            </div>
            <span
              style={{
                fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                color: ink, fontWeight: 500,
              }}
            >
              OpositaSmart
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onSignup && step !== 'intro' && (
              <button
                onClick={onSignup}
                style={{
                  fontSize: 11, letterSpacing: 0.5,
                  color: ink, fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >
                Crear cuenta
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[rgba(27,67,50,0.06)]"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} style={{ color: muted }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
          {step === 'intro' ? (
            <div style={{ padding: '36px 28px 28px' }}>
              <div
                style={{
                  fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                  color: muted, fontWeight: 500, marginBottom: 14,
                }}
              >
                Bienvenida
              </div>
              <div
                style={{
                  fontFamily: serif, fontSize: 34, fontStyle: 'italic',
                  color: ink, letterSpacing: -0.8, lineHeight: 1.1,
                }}
              >
                ¿Empezamos descubriendo{' '}
                <span style={{ color: inkSoft, fontStyle: 'normal' }}>tu nivel</span>?
              </div>
              <p
                style={{
                  fontSize: 14, color: '#4B5563',
                  marginTop: 16, lineHeight: 1.55,
                }}
              >
                Cinco preguntas reales del temario de Auxiliar AGE. Unos dos minutos.
                Al final te decimos por dónde empezar.
              </p>

              <ul
                style={{
                  margin: '28px 0 0', padding: 0, listStyle: 'none',
                  display: 'flex', flexDirection: 'column', gap: 0,
                }}
              >
                {[
                  'Sin registro. Guardamos tu progreso en este navegador.',
                  'Puedes probar hasta 5 sesiones antes de crear cuenta.',
                  'Cierra el popup si prefieres explorar primero.',
                ].map((t, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'grid', gridTemplateColumns: '20px 1fr', gap: 14,
                      padding: '12px 0',
                      borderTop: i === 0 ? `1px solid ${rule}` : 'none',
                      borderBottom: `1px solid ${rule}`,
                      fontSize: 13, color: '#2A2A28', lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: serif, fontStyle: 'italic',
                        color: muted, fontSize: 13,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={startTest}
                  style={{
                    background: ink, color: paper, border: 'none',
                    padding: '16px 18px', fontSize: 13, fontWeight: 500,
                    letterSpacing: 0.3, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span>Empezar test (2 min)</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'transparent', color: ink,
                    border: `1px solid ${rule}`,
                    padding: '14px 18px', fontSize: 13, fontWeight: 500,
                    letterSpacing: 0.3, cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Explorar primero
                </button>
              </div>
            </div>
          ) : (
            <>
              {!loading && !showResults && currentIndex === 0 && sessionNumber === 1 && (
                <p
                  style={{
                    textAlign: 'center', fontSize: 10, letterSpacing: 1.5,
                    textTransform: 'uppercase', color: muted, fontWeight: 500,
                    padding: '16px 20px 4px',
                  }}
                >
                  Descubre tu nivel · 5 preguntas
                </p>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <p style={{ color: muted, fontSize: 13, fontFamily: serif, fontStyle: 'italic' }}>
                    Preparando preguntas…
                  </p>
                </div>
              ) : showResults ? (
                <div style={{ padding: 0 }}>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
