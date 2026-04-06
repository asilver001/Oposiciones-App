import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';

export default function GuestQuestion({ question, questionNumber, totalQuestions, onAnswer, onNext }) {
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
  };

  const getOptionStyle = (idx) => {
    if (!answered) return 'border-gray-200 bg-white hover:border-[#2D6A4F]/30';
    if (idx === question.correcta) return 'border-[#2D6A4F] bg-[#E8F5E9]';
    if (idx === selectedIndex && !isCorrect) return 'border-[#D4933A] bg-[#FEF3CD]';
    return 'border-gray-200 bg-white opacity-50';
  };

  const getLetterStyle = (idx) => {
    if (!answered) return 'bg-gray-100 text-gray-600';
    if (idx === question.correcta) return 'bg-[#2D6A4F] text-white';
    if (idx === selectedIndex && !isCorrect) return 'bg-[#D4933A] text-white';
    return 'bg-gray-100 text-gray-400';
  };

  return (
    <div className="flex flex-col min-h-dvh" style={{ background: '#FAFAF7' }}>
      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Pregunta {questionNumber} de {totalQuestions}</span>
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
                {answered && idx === question.correcta ? <Check className="w-4 h-4" /> : letters[idx]}
              </span>
              <span className="text-[15px] leading-snug text-gray-800">{opt}</span>
            </button>
          ))}
        </div>

        {answered && (
          <div className="mt-6 space-y-3">
            <p className={`font-semibold text-base ${isCorrect ? 'text-[#2D6A4F]' : 'text-[#D4933A]'}`}>
              {isCorrect ? 'Correcto!' : `La respuesta correcta es la ${letters[question.correcta]}`}
            </p>
            {question.referencia && <p className="text-sm text-gray-400">{question.referencia}</p>}
            <p className="text-sm text-gray-600 leading-relaxed">{question.explicacion}</p>
          </div>
        )}
      </div>

      {answered && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-100" style={{ background: '#FAFAF7' }}>
          <button onClick={onNext} className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-base active:scale-[0.98] transition-all">
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
