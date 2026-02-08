import { useState, useEffect } from 'react';
import {
  X, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight,
  FileText, GitCompare, Eye, EyeOff
} from 'lucide-react';

// Reformulation type labels
const reformulationLabels = {
  'inversion': 'Inversión - De afirmativa a negativa',
  'enfoque': 'Cambio de enfoque - Mismo tema, diferente ángulo',
  'comparativa': 'Comparativa - Contraste entre conceptos',
  'consecuencia': 'Consecuencia - Causa y efecto',
  'caso_practico': 'Caso práctico - Situación aplicada',
  'clarificacion': 'Clarificación - Mejora de redacción',
  'actualizacion': 'Actualización - Datos o normativa actualizada'
};

/**
 * QuestionDetailModal - Full detail modal for viewing/reviewing a question
 */
export default function QuestionDetailModal({
  question,
  onClose,
  onApprove,
  onReject,
  onMarkRefresh,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  disabled
}) {
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [comment, setComment] = useState('');

  // Reset state when question changes - keep showOriginal persistent for comparing originals
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setShowOtherOptions(false);
    setComment('');
  }, [question?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case 'escape':
          onClose();
          break;
        case 'a':
          if (!disabled && question.validation_status === 'human_pending') {
            e.preventDefault();
            onApprove(question.id, comment);
          }
          break;
        case 'r':
          if (!disabled && question.validation_status === 'human_pending') {
            e.preventDefault();
            onReject(question.id, comment);
          }
          break;
        case 'f':
          if (!disabled) {
            e.preventDefault();
            let reason = comment;
            if (!reason) {
              const artRef = question.legal_reference || '';
              reason = window.prompt(
                `Razón para reformular (Art: ${artRef || 'sin referencia'}):\n` +
                'Incluye qué mejorar: enunciado, opciones, explicación, artículo...'
              );
            }
            if (reason) onMarkRefresh(question.id, reason);
          }
          break;
        case 'o':
          e.preventDefault();
          setShowOriginal(prev => !prev);
          break;
        case 'arrowleft':
          if (hasPrev && onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
        case 'arrowright':
          if (hasNext && onNext) {
            e.preventDefault();
            onNext();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, comment, disabled, onClose, onApprove, onReject, onMarkRefresh, onPrev, onNext, hasPrev, hasNext]);

  if (!question) return null;

  const correctOption = question.options?.find(opt => opt.is_correct);
  const incorrectOptions = question.options?.filter(opt => !opt.is_correct) || [];
  const isPending = question.validation_status === 'human_pending';

  const statusConfig = {
    'human_pending': { label: 'Pendiente', icon: '⏳', color: 'text-amber-600' },
    'human_approved': { label: 'Aprobada', icon: '✅', color: 'text-green-600' },
    'rejected': { label: 'Rechazada', icon: '❌', color: 'text-red-600' },
    'auto_validated': { label: 'Auto-validada', icon: '🤖', color: 'text-blue-600' }
  };

  const status = question.needs_refresh
    ? { label: 'Necesita reformular', icon: '🔄', color: 'text-orange-600' }
    : statusConfig[question.validation_status] || statusConfig['human_pending'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Detalle de Pregunta</h2>
              <span className={`flex items-center gap-1 text-sm ${status.color}`}>
                {status.icon} {status.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {(hasPrev || hasNext) && (
                <>
                  <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Anterior [←]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Siguiente [→]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Meta tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
                Tema {question.tema || '?'}
              </span>
              {question.materia && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {question.materia}
                </span>
              )}
              {question.difficulty && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  Dificultad: {question.difficulty}/5
                </span>
              )}
            </div>

            {/* Question text */}
            <div className="mb-6">
              <p className="text-gray-900 text-lg leading-relaxed">
                {question.question_text}
              </p>
              {/* Legal reference - always visible */}
              {question.legal_reference && (
                <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg inline-flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-700">Art.</span>
                  <span className="text-sm text-amber-800">{question.legal_reference}</span>
                </div>
              )}
            </div>

            {/* Correct Answer */}
            <div className="mb-4">
              <div className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                RESPUESTA CORRECTA:
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400">
                <span className="font-bold text-green-800">
                  {correctOption?.id?.toUpperCase() || 'A'}.
                </span>{' '}
                <span className="text-green-900 font-medium">
                  {correctOption?.text}
                </span>
              </div>
            </div>

            {/* Other Options - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setShowOtherOptions(!showOtherOptions)}
                className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {showOtherOptions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Otras opciones ({incorrectOptions.length})
                </span>
                {showOtherOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showOtherOptions && (
                <div className="mt-2 space-y-2">
                  {incorrectOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
                    >
                      <span className="font-semibold text-gray-500">
                        {opt.id?.toUpperCase() || String.fromCharCode(66 + idx)}.
                      </span>{' '}
                      {opt.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explanation - always visible */}
            {question.explanation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-xs font-semibold text-blue-800 mb-1">📚 Explicación:</p>
                <p className="text-sm text-blue-700">{question.explanation}</p>
              </div>
            )}

            {/* Compare with Original */}
            {question.original_text && (
              <div className="mb-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4" />
                    Comparar con original [O]
                  </span>
                  {showOriginal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showOriginal && (
                  <>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                        <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          ORIGINAL (PDF)
                        </p>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {question.original_text}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-300">
                        <p className="text-xs font-semibold text-cyan-700 mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          REFORMULADA
                        </p>
                        <p className="text-sm text-cyan-900 leading-relaxed">
                          {question.question_text}
                        </p>
                      </div>
                    </div>

                    {question.reformulation_type && (
                      <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-600">
                          💡 <strong>Tipo de cambio:</strong>{' '}
                          {reformulationLabels[question.reformulation_type] || question.reformulation_type}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Comment */}
            <div className="border-t border-gray-100 pt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                💬 Comentario (opcional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario si lo deseas..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {isPending ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onApprove(question.id, comment)}
                  disabled={disabled}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-green-500/25"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprobar
                  <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">A</kbd>
                </button>
                <button
                  onClick={() => onReject(question.id, comment)}
                  disabled={disabled}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-red-500/25"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                  <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">R</kbd>
                </button>
                <button
                  onClick={() => {
                    let reason = comment;
                    if (!reason) {
                      const artRef = question.legal_reference || '';
                      reason = window.prompt(
                        `Razón para reformular (Art: ${artRef || 'sin referencia'}):\n` +
                        'Incluye qué mejorar: enunciado, opciones, explicación, artículo...'
                      );
                    }
                    if (reason) onMarkRefresh(question.id, reason);
                  }}
                  disabled={disabled}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reformular</span>
                  <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 rounded">F</kbd>
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
