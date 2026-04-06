import { useState } from 'react';
import { Check, RotateCcw, SkipForward } from 'lucide-react';

/**
 * QuestionCard — Lovable-inspired question UI with immediate feedback.
 *
 * Shows question + 4 options. On selection: reveals correct/incorrect,
 * shows explanation + legal reference, then "Siguiente →" button.
 *
 * Works with both Supabase questions (options JSONB) and guest questions.
 */
export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSkip,
  onNext,
  showFeedback = true,
  currentIndex,
  total,
  isReview,
}) {
  const [localSelected, setLocalSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  // Normalize options: support JSONB array, individual columns, and guest format
  let options = [];
  let correctKey = null;

  if (question.opciones) {
    // Guest question format: { opciones: string[], correcta: number }
    options = question.opciones.map((text, idx) => ({
      key: ['a', 'b', 'c', 'd'][idx],
      text,
      isCorrect: idx === question.correcta,
    }));
    correctKey = ['a', 'b', 'c', 'd'][question.correcta];
  } else {
    // Supabase format: { options: JSONB array }
    let rawOpts = question.options;
    if (typeof rawOpts === 'string') {
      try { rawOpts = JSON.parse(rawOpts); } catch { rawOpts = null; }
    }

    if (Array.isArray(rawOpts) && rawOpts.length > 0) {
      options = rawOpts.map((opt, idx) => ({
        key: opt.id || ['a', 'b', 'c', 'd'][idx] || `${idx}`,
        text: opt.text || '',
        isCorrect: Boolean(opt.is_correct),
      }));
    } else {
      const keys = ['a', 'b', 'c', 'd'];
      options = keys
        .filter(k => question[`option_${k}`])
        .map(k => ({
          key: k,
          text: question[`option_${k}`],
          isCorrect: question.correct_answer === k,
        }));
    }
    const correctOpt = options.find(o => o.isCorrect);
    correctKey = correctOpt?.key;
  }

  const letters = ['A', 'B', 'C', 'D'];
  const selected = localSelected || selectedAnswer;
  const isCorrect = selected === correctKey;
  const questionText = question.question_text || question.enunciado || '';
  const explanation = question.explanation || question.explicacion || '';
  const reference = question.legal_reference || question.referencia || '';
  const progressPct = total ? ((currentIndex + 1) / total) * 100 : 0;

  const handleSelect = (key) => {
    if (answered || selected) return;
    setLocalSelected(key);
    setAnswered(true);
    onSelectAnswer(key);
  };

  const getOptionStyle = (opt) => {
    if (!answered && !selected) return 'border-gray-200 bg-white hover:border-[#2D6A4F]/30';
    if (opt.isCorrect) return 'border-[#2D6A4F] bg-[#E8F5E9]';
    if (opt.key === selected && !isCorrect) return 'border-[#D4933A] bg-[#FEF3CD]';
    return 'border-gray-200 bg-white opacity-50';
  };

  const getLetterStyle = (opt) => {
    if (!answered && !selected) return 'bg-gray-100 text-gray-600';
    if (opt.isCorrect) return 'bg-[#2D6A4F] text-white';
    if (opt.key === selected && !isCorrect) return 'bg-[#D4933A] text-white';
    return 'bg-gray-100 text-gray-400';
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Progress bar */}
      {total > 0 && (
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-gray-400">Pregunta {(currentIndex || 0) + 1} de {total}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#2D6A4F] rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-5 py-4 overflow-y-auto pb-28">
        {/* Review badge */}
        {isReview && (
          <div className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-amber-50">
            <RotateCcw className="w-4 h-4 text-[#2D6A4F]" />
            <span className="text-sm text-gray-600">Repaso</span>
          </div>
        )}

        {/* Tema badge */}
        {question.tema && (
          <div className="mb-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Tema {question.tema}{question.temaName ? ` · ${question.temaName}` : ''}
            </span>
          </div>
        )}

        {/* Question text */}
        <p className="text-[17px] leading-relaxed text-gray-900 font-medium mb-6">
          {questionText}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt, idx) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              disabled={answered || !!selected}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${getOptionStyle(opt)}`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 ${getLetterStyle(opt)}`}>
                {(answered || selected) && opt.isCorrect ? <Check className="w-4 h-4" /> : letters[idx]}
              </span>
              <span className="text-[15px] leading-snug text-gray-800">{opt.text}</span>
            </button>
          ))}
        </div>

        {/* Feedback + explanation */}
        {showFeedback && (answered || selected) && (
          <div className="mt-6 space-y-3">
            <p className={`font-semibold text-base ${isCorrect ? 'text-[#2D6A4F]' : 'text-[#D4933A]'}`}>
              {isCorrect ? '¡Correcto!' : `La respuesta correcta es la ${letters[options.findIndex(o => o.isCorrect)]}`}
            </p>
            {reference && <p className="text-sm text-gray-400">{reference}</p>}
            {explanation && <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>}
          </div>
        )}

        {/* Skip button (only if not answered) */}
        {onSkip && !answered && !selected && (
          <button
            onClick={onSkip}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-sm font-medium">Dejar en blanco</span>
          </button>
        )}
      </div>

      {/* Next button — appears after answering */}
      {(answered || selected) && onNext && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-100 bg-[#FAFAF7] z-10">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-xl bg-[#2D6A4F] text-white font-semibold text-base active:scale-[0.98] transition-all"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
