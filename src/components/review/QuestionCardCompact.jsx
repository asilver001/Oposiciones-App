import { Eye, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

/**
 * QuestionCardCompact - Compact card for grid view
 */
export default function QuestionCardCompact({
  question,
  index,
  onApprove,
  onReject,
  onView,
  onUndo,
  disabled
}) {
  const correctOption = question.options?.find(opt => opt.is_correct);

  const statusConfig = {
    'human_pending': {
      bg: 'bg-white',
      border: 'border-gray-200',
      icon: '⏳',
      label: 'Pendiente'
    },
    'human_approved': {
      bg: 'bg-green-50',
      border: 'border-green-400',
      icon: '✅',
      label: 'Aprobada'
    },
    'rejected': {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: '❌',
      label: 'Rechazada'
    },
    'auto_validated': {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      icon: '🤖',
      label: 'Auto-validada'
    }
  };

  const status = question.needs_refresh
    ? { bg: 'bg-amber-50', border: 'border-amber-400', icon: '🔄', label: 'Reformular' }
    : statusConfig[question.validation_status] || statusConfig['human_pending'];

  const isPending = question.validation_status === 'human_pending';

  return (
    <div className={`rounded-xl p-4 ${status.bg} border-2 ${status.border} transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-1">
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            T{question.tema || '?'}
          </span>
          {question.materia && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {question.materia}
            </span>
          )}
        </div>
        <span className="text-lg" title={status.label}>{status.icon}</span>
      </div>

      {/* Question text (truncated) */}
      <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-3 min-h-[2.5rem]">
        {question.question_text}
      </p>

      {/* Correct answer (truncated) */}
      {correctOption && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 px-3 py-2 rounded-r-lg mb-3">
          <p className="text-xs text-green-800 line-clamp-1">
            <span className="font-bold">{correctOption.id?.toUpperCase() || 'A'}.</span>{' '}
            {correctOption.text}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
        <button
          onClick={() => onView(question)}
          className="flex items-center gap-1 text-gray-500 hover:text-purple-600 text-sm transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Ver</span>
        </button>

        {isPending ? (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(question.id)}
              disabled={disabled}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              title="Aprobar"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onReject(question.id)}
              disabled={disabled}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              title="Rechazar"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onUndo(question.id)}
            disabled={disabled}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm transition-colors disabled:opacity-50"
            title="Deshacer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Deshacer</span>
          </button>
        )}
      </div>
    </div>
  );
}
