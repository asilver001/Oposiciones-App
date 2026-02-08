import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';

export default function QuestionCard({
  question,
  selectedAnswer,
  showResult,
  onSelectAnswer
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
              borderColor = 'border-brand-500';
              bgColor = 'bg-brand-50';
            }

            return (
              <button
                key={opt.key}
                onClick={() => onSelectAnswer(opt.key)}
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
        {showResult && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-blue-800 mb-1">Explicación</p>
            <p className="text-sm text-blue-700">{question.explanation}</p>
            {question.legal_reference && (
              <p className="text-xs text-blue-500 mt-2">
                📚 {question.legal_reference}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
