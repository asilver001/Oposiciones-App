import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';

export default function GuestQuestion({ question, questionNumber, totalQuestions, onAnswer, onNext, onExit }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const isCorrect = selectedIndex === question.correcta;
  const progressPct = (questionNumber / totalQuestions) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedIndex(idx);
    setAnswered(true);
    onAnswer(idx === question.correcta, Date.now() - startTime);
    // Auto-advance after brief selection flash
    setTimeout(() => onNext(), 250);
  };

  const getOptionStyle = (idx) => {
    if (!answered) return 'border-gray-200 bg-white hover:border-[#2D6A4F]/30';
    // Brief flash: only highlight the selected option
    if (idx === selectedIndex) return 'border-gray-900 bg-gray-900/5';
    return 'border-gray-200 bg-white opacity-50';
  };

  const getLetterStyle = (idx) => {
    if (!answered) return 'bg-gray-100 text-gray-600';
    if (idx === selectedIndex) return 'bg-gray-900 text-white';
    return 'bg-gray-100 text-gray-400';
  };

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#FAFAF7' }}>
      {/* Progress + exit */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Pregunta {questionNumber} de {totalQuestions}</span>
          {onExit && (
            <button onClick={onExit} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#2D6A4F] rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto pb-32">
        {question.isReview && (
          <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-amber-50">
            <RotateCcw className="w-4 h-4 text-[#2D6A4F]" />
            <span className="text-sm text-gray-600">Repaso — Fallaste esta pregunta antes</span>
          </div>
        )}

        <p className="text-[17px] leading-relaxed text-gray-900 font-medium mb-6">{question.enunciado}</p>

        <div className="space-y-3">
          {question.opciones.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${getOptionStyle(idx)}`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 ${getLetterStyle(idx)}`}>
                {letters[idx]}
              </span>
              <span className="text-[15px] leading-snug text-gray-800">{opt}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
