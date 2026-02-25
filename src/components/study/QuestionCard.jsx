import { BookOpen, SkipForward } from 'lucide-react';

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSkip
}) {
  // Normalize options: support both JSONB array and individual columns (option_a/b/c/d)
  let options = [];

  // Try JSONB options array first
  let rawOpts = question.options;
  if (typeof rawOpts === 'string') {
    try { rawOpts = JSON.parse(rawOpts); } catch { rawOpts = null; }
  }

  if (Array.isArray(rawOpts) && rawOpts.length > 0) {
    options = rawOpts.map((opt, idx) => ({
      key: opt.id || ['a', 'b', 'c', 'd'][idx] || `${idx}`,
      text: opt.text || '',
      isCorrect: Boolean(opt.is_correct)
    }));
  } else {
    // Fallback: individual columns (option_a, option_b, option_c, option_d)
    const keys = ['a', 'b', 'c', 'd'];
    options = keys
      .filter(k => question[`option_${k}`])
      .map(k => ({
        key: k,
        text: question[`option_${k}`],
        isCorrect: question.correct_answer === k
      }));
  }

  const correctOption = options.find(opt => opt.isCorrect);
  const correctAnswer = correctOption?.key;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        {/* Tema badge */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">Tema {question.tema}</span>
        </div>

        {/* Question text */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <p className="text-lg text-gray-800 leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => onSelectAnswer(opt.key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-gray-800'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                    isSelected ? 'border-brand-500 text-brand-600' : 'border-current'
                  }`}>
                    {opt.key.toUpperCase()}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Skip button */}
        {onSkip && (
          <button
            onClick={onSkip}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-sm font-medium">Pasar</span>
          </button>
        )}
      </div>
    </div>
  );
}
