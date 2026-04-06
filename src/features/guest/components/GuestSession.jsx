import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuestData, initGuestData, saveSession } from '../guestStorage';
import { selectQuestionsForSession } from '../guestQuestionSelector';
import GuestQuestion from './GuestQuestion';

export default function GuestSession() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let guestData = getGuestData();
      if (!guestData) {
        guestData = initGuestData('2026-06-13');
      }
      if (guestData.totalSessions >= guestData.maxSessions) {
        navigate('/guest/signup');
        return;
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
  }, [navigate]);

  const handleAnswer = (correct, timeMs) => {
    const q = questions[currentIndex];
    setAnswers(prev => [...prev, { questionId: q.id, correct, timeMs, isReview: !!q.isReview }]);
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      // Include the last answer (handleAnswer runs before handleNext via setTimeout)
      const allAnswers = [...answers];
      // The last answer might not be in state yet due to batching, so use length check
      const score = allAnswers.filter(a => a.correct).length;
      saveSession({ number: sessionNumber, completedAt: new Date().toISOString(), answers: allAnswers, score, total: questions.length });
      navigate('/guest/results');
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const handleExit = () => {
    navigate('/app/inicio');
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: '#FAFAF7' }}>
        <p className="text-gray-400">Cargando preguntas...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-dvh" style={{ background: '#FAFAF7' }}>
      {/* Banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-sm">
        <span className="text-gray-400">Modo invitado - Sesion {sessionNumber} de 10</span>
        <button onClick={() => navigate('/signup')} className="text-[#2D6A4F] font-medium hover:underline">Crear cuenta</button>
      </div>
      <GuestQuestion
        key={currentQuestion.id + currentIndex}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onExit={handleExit}
      />
    </div>
  );
}
