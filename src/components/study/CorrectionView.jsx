/**
 * CorrectionView
 *
 * Post-session correction screen that shows each question with the user's answer
 * and the correct answer. Allows the user to review what they got right/wrong.
 */

import { CheckCircle2, XCircle, ArrowLeft, BookOpen, SkipForward } from 'lucide-react';

/**
 * Normalize question options (same logic as QuestionCard)
 */
function getOptions(question) {
  let rawOpts = question.options;
  if (typeof rawOpts === 'string') {
    try { rawOpts = JSON.parse(rawOpts); } catch { rawOpts = null; }
  }

  if (Array.isArray(rawOpts) && rawOpts.length > 0) {
    return rawOpts.map((opt, idx) => ({
      key: opt.id || ['a', 'b', 'c', 'd'][idx] || `${idx}`,
      text: opt.text || '',
      isCorrect: Boolean(opt.is_correct)
    }));
  }

  const keys = ['a', 'b', 'c', 'd'];
  return keys
    .filter(k => question[`option_${k}`])
    .map(k => ({
      key: k,
      text: question[`option_${k}`],
      isCorrect: question.correct_answer === k
    }));
}

export default function CorrectionView({ answersHistory = [], onBack }) {
  const correctCount = answersHistory.filter(a => a.es_correcta).length;
  const incorrectCount = answersHistory.filter(a => !a.es_correcta).length;
  const skippedCount = answersHistory.filter(a => !a.respuesta_usuario).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F3F3F0' }}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-semibold text-gray-800 text-lg">Corrección</h1>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-green-600 font-medium">{correctCount} correctas</span>
            <span className="text-red-600 font-medium">{incorrectCount} incorrectas</span>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          {answersHistory.map((entry, index) => {
            const question = entry.question;
            if (!question) return null;

            const options = getOptions(question);
            const wasCorrect = entry.es_correcta;
            const userAnswer = entry.respuesta_usuario;
            const correctAnswer = entry.respuesta_correcta;
            const wasSkipped = !userAnswer;

            return (
              <div
                key={entry.question_id || index}
                className={`bg-white rounded-2xl border-2 overflow-hidden ${
                  wasSkipped ? 'border-amber-200' :
                  wasCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                {/* Question header */}
                <div className={`px-4 py-2.5 flex items-center gap-2 ${
                  wasSkipped ? 'bg-amber-50' :
                  wasCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <span className="text-sm font-medium text-gray-500">
                    Pregunta {index + 1}
                  </span>
                  {question.tema && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Tema {question.tema}
                    </span>
                  )}
                  <span className="ml-auto">
                    {wasSkipped ? (
                      <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                        <SkipForward className="w-4 h-4" /> Saltada
                      </span>
                    ) : wasCorrect ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Correcta
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle className="w-4 h-4" /> Incorrecta
                      </span>
                    )}
                  </span>
                </div>

                {/* Question text */}
                <div className="px-4 py-3">
                  <p className="text-gray-800 leading-relaxed text-sm">
                    {question.question_text}
                  </p>
                </div>

                {/* Options */}
                <div className="px-4 pb-3 space-y-2">
                  {options.map((opt) => {
                    const isUserAnswer = opt.key === userAnswer;
                    const isCorrectAnswer = opt.key === correctAnswer;

                    let optionStyle = 'border-gray-100 bg-gray-50 text-gray-600';
                    let circleStyle = 'border-gray-300 text-gray-400';

                    if (isCorrectAnswer) {
                      optionStyle = 'border-green-300 bg-green-50 text-green-800';
                      circleStyle = 'border-green-500 bg-green-500 text-white';
                    } else if (isUserAnswer && !wasCorrect) {
                      optionStyle = 'border-red-300 bg-red-50 text-red-800';
                      circleStyle = 'border-red-500 bg-red-500 text-white';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-semibold text-xs flex-shrink-0 ${circleStyle}`}>
                          {isCorrectAnswer ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           isUserAnswer && !wasCorrect ? <XCircle className="w-3.5 h-3.5" /> :
                           opt.key.toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="mx-4 mb-3 p-3 rounded-xl" style={{ background: 'rgba(45,106,79,0.07)', border: '1px solid rgba(82,183,136,0.25)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#1B4332' }}>Explicación</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#2D6A4F' }}>{question.explanation}</p>
                    {question.legal_reference && (
                      <p className="text-xs mt-1.5" style={{ color: '#52B788' }}>
                        Ref: {question.legal_reference}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
