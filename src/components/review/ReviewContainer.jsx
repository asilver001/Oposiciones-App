import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Eye, EyeOff, ChevronDown, ChevronUp, Keyboard, GitCompare, FileText, RotateCcw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import StatsFilter from './StatsFilter';
import ViewModeSelector from './ViewModeSelector';
import QuestionCardCompact from './QuestionCardCompact';
import QuestionDetailModal from './QuestionDetailModal';
import EmptyState from '../common/EmptyState';

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
 * ReviewContainer - Main review interface with multiple view modes
 */
export default function ReviewContainer({ showHeader = false }) {
  const { reviewQuestion, markForRefresh } = useAdmin();

  // State
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, needsRefresh: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & View
  const [activeFilter, setActiveFilter] = useState('pending');
  const [viewMode, setViewMode] = useState('grid'); // 'individual', 'grid', 'list'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0); // For individual view
  const itemsPerPage = viewMode === 'list' ? 20 : 10;

  // Modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Individual view state
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('questions')
        .select('validation_status, needs_refresh')
        .eq('is_active', true)
        .eq('is_current_version', true);

      if (data) {
        setStats({
          pending: data.filter(q => q.validation_status === 'human_pending' && !q.needs_refresh).length,
          approved: data.filter(q => q.validation_status === 'human_approved').length,
          rejected: data.filter(q => q.validation_status === 'rejected').length,
          needsRefresh: data.filter(q => q.needs_refresh).length,
          total: data.length
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load questions based on filter
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('is_current_version', true)
        .order('created_at', { ascending: true });

      switch (activeFilter) {
        case 'pending':
          query = query.eq('validation_status', 'human_pending').eq('needs_refresh', false);
          break;
        case 'approved':
          query = query.eq('validation_status', 'human_approved');
          break;
        case 'rejected':
          query = query.eq('validation_status', 'rejected');
          break;
        case 'refresh':
          query = query.eq('needs_refresh', true);
          break;
        default:
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestions(data || []);
      setCurrentPage(1);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // Initial load
  useEffect(() => {
    loadStats();
    loadQuestions();
  }, [loadStats, loadQuestions]);

  // Reload when filter changes
  useEffect(() => {
    loadQuestions();
  }, [activeFilter, loadQuestions]);

  // Pagination
  const totalPages = Math.ceil(questions.length / itemsPerPage);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Current question for individual view
  const currentQuestion = questions[currentIndex];

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    setCurrentIndex(0);
    setShowOtherOptions(false);
    setShowOriginal(false);
    setReviewComment('');
  };

  // Handle approve
  const handleApprove = async (questionId, comment = '') => {
    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_approved', comment || null);
      if (result.success) {
        await loadStats();
        await loadQuestions();
        setSelectedQuestion(null);
        setReviewComment('');
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (questionId, comment = '') => {
    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'rejected', comment || null);
      if (result.success) {
        await loadStats();
        await loadQuestions();
        setSelectedQuestion(null);
        setReviewComment('');
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle mark for refresh
  const handleMarkRefresh = async (questionId, reason = '') => {
    const finalReason = reason || prompt('Razón para reformular esta pregunta:');
    if (!finalReason) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(questionId, finalReason);
      if (result.success) {
        await loadStats();
        await loadQuestions();
        setSelectedQuestion(null);
        setReviewComment('');
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle undo (revert to pending)
  const handleUndo = async (questionId) => {
    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_pending', null);
      if (result.success) {
        await loadStats();
        await loadQuestions();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Navigation for individual view
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowOtherOptions(false);
      setShowOriginal(false);
      setReviewComment('');
    }
  }, [currentIndex, questions.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowOtherOptions(false);
      setShowOriginal(false);
      setReviewComment('');
    }
  }, [currentIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (selectedQuestion) return; // Modal handles its own shortcuts

      switch (e.key.toLowerCase()) {
        case '1':
          e.preventDefault();
          setViewMode('individual');
          break;
        case '2':
          e.preventDefault();
          setViewMode('grid');
          break;
        case '3':
          e.preventDefault();
          setViewMode('list');
          break;
        case 'arrowright':
          if (viewMode === 'individual') {
            e.preventDefault();
            goToNext();
          }
          break;
        case 'arrowleft':
          if (viewMode === 'individual') {
            e.preventDefault();
            goToPrev();
          }
          break;
        case 'a':
          if (viewMode === 'individual' && currentQuestion?.validation_status === 'human_pending') {
            e.preventDefault();
            handleApprove(currentQuestion.id, reviewComment);
          }
          break;
        case 'r':
          if (viewMode === 'individual' && currentQuestion?.validation_status === 'human_pending') {
            e.preventDefault();
            handleReject(currentQuestion.id, reviewComment);
          }
          break;
        case 'f':
          if (viewMode === 'individual' && currentQuestion) {
            e.preventDefault();
            handleMarkRefresh(currentQuestion.id, reviewComment);
          }
          break;
        case 'o':
          if (viewMode === 'individual') {
            e.preventDefault();
            setShowOriginal(prev => !prev);
          }
          break;
        case 'e':
          if (viewMode === 'individual') {
            e.preventDefault();
            setShowOtherOptions(true);
            setShowOriginal(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentQuestion, reviewComment, goToNext, goToPrev, selectedQuestion]);

  // Get correct option
  const correctOption = currentQuestion?.options?.find(opt => opt.is_correct);
  const incorrectOptions = currentQuestion?.options?.filter(opt => !opt.is_correct) || [];

  return (
    <div className="space-y-6">
      {/* Stats Filter */}
      <StatsFilter
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* View Mode Selector */}
      <ViewModeSelector
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalItems={questions.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No tienes preguntas para repasar"
          description="No hay preguntas pendientes con el filtro seleccionado. ¡Buen trabajo!"
          actionLabel={activeFilter === 'pending' ? 'Hacer un test' : null}
          onAction={activeFilter === 'pending' ? () => window.location.reload() : null}
          variant="green"
        />
      ) : (
        <>
          {/* Individual View */}
          {viewMode === 'individual' && currentQuestion && (
            <IndividualView
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              correctOption={correctOption}
              incorrectOptions={incorrectOptions}
              showOtherOptions={showOtherOptions}
              setShowOtherOptions={setShowOtherOptions}
              showOriginal={showOriginal}
              setShowOriginal={setShowOriginal}
              reviewComment={reviewComment}
              setReviewComment={setReviewComment}
              onApprove={handleApprove}
              onReject={handleReject}
              onMarkRefresh={handleMarkRefresh}
              onPrev={goToPrev}
              onNext={goToNext}
              disabled={actionLoading}
            />
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedQuestions.map((q, idx) => (
                  <QuestionCardCompact
                    key={q.id}
                    question={q}
                    index={(currentPage - 1) * itemsPerPage + idx}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={setSelectedQuestion}
                    onUndo={handleUndo}
                    disabled={actionLoading}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Tema</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pregunta</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedQuestions.map((q, idx) => (
                      <ListRow
                        key={q.id}
                        question={q}
                        index={(currentPage - 1) * itemsPerPage + idx + 1}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onView={setSelectedQuestion}
                        onUndo={handleUndo}
                        disabled={actionLoading}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="p-3 bg-gray-100 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Keyboard className="w-4 h-4" />
          <span className="font-medium">Atajos de teclado:</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">1</kbd> Individual</span>
          <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">2</kbd> Grid</span>
          <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">3</kbd> Lista</span>
          {viewMode === 'individual' && (
            <>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">A</kbd> Aprobar</span>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">R</kbd> Rechazar</span>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">F</kbd> Reformular</span>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">O</kbd> Original</span>
              <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">←</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">→</kbd> Navegar</span>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onMarkRefresh={handleMarkRefresh}
          disabled={actionLoading}
        />
      )}
    </div>
  );
}

// Individual View Component
function IndividualView({
  question,
  currentIndex,
  totalQuestions,
  correctOption,
  incorrectOptions,
  showOtherOptions,
  setShowOtherOptions,
  showOriginal,
  setShowOriginal,
  reviewComment,
  setReviewComment,
  onApprove,
  onReject,
  onMarkRefresh,
  onPrev,
  onNext,
  disabled
}) {
  const isPending = question.validation_status === 'human_pending';

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 font-medium">
          Pregunta <span className="text-brand-600">{currentIndex + 1}</span> de {totalQuestions}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
            title="Anterior [←]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
            title="Siguiente [→]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Meta tags */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
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
        <div className="p-5">
          <p className="text-gray-900 text-lg leading-relaxed">
            {question.question_text}
          </p>
        </div>

        {/* Correct Answer */}
        <div className="px-5 pb-4">
          <div className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            RESPUESTA CORRECTA:
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-sm">
            <span className="font-bold text-green-800">
              {correctOption?.id?.toUpperCase() || 'A'}.
            </span>{' '}
            <span className="text-green-900 font-medium">
              {correctOption?.text}
            </span>
          </div>
        </div>

        {/* Other Options - Collapsible */}
        <div className="px-5 pb-4">
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

          {!showOtherOptions ? (
            <div className="mt-2 space-y-1">
              {incorrectOptions.map((opt, idx) => (
                <div key={idx} className="text-sm text-gray-400 truncate pl-2">
                  {opt.id?.toUpperCase() || String.fromCharCode(66 + idx)}. {opt.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
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

        {/* Explanation */}
        {question.explanation && showOtherOptions && (
          <div className="px-5 pb-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-semibold text-blue-800 mb-1">📚 Explicación:</p>
              <p className="text-sm text-blue-700">{question.explanation}</p>
            </div>
          </div>
        )}

        {/* Compare with Original */}
        {question.original_text && (
          <div className="px-5 pb-4">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors border-t border-gray-100 pt-4"
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
        {isPending && (
          <div className="px-5 pb-4 border-t border-gray-100 pt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              💬 Comentario (opcional):
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Escribe un comentario si lo deseas..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              rows={2}
            />
          </div>
        )}

        {/* Actions */}
        {isPending && (
          <div className="px-5 pb-5">
            <div className="flex gap-3">
              <button
                onClick={() => onApprove(question.id, reviewComment)}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 font-semibold shadow-sm active:scale-[0.98]"
              >
                <CheckCircle className="w-5 h-5" />
                Aprobar
                <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">A</kbd>
              </button>
              <button
                onClick={() => onReject(question.id, reviewComment)}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 font-semibold shadow-sm active:scale-[0.98]"
              >
                <XCircle className="w-5 h-5" />
                Rechazar
                <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">R</kbd>
              </button>
            </div>

            <button
              onClick={() => onMarkRefresh(question.id, reviewComment)}
              disabled={disabled}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Marcar para reformular
              <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 rounded">F</kbd>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// List Row Component
function ListRow({ question, index, onApprove, onReject, onView, onUndo, disabled }) {
  const isPending = question.validation_status === 'human_pending';

  const statusConfig = {
    'human_pending': { icon: '⏳', class: 'text-amber-600' },
    'human_approved': { icon: '✅', class: 'text-green-600' },
    'rejected': { icon: '❌', class: 'text-red-600' },
    'auto_validated': { icon: '🤖', class: 'text-blue-600' }
  };

  const status = question.needs_refresh
    ? { icon: '🔄', class: 'text-orange-600' }
    : statusConfig[question.validation_status] || statusConfig['human_pending'];

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-500">{index}</td>
      <td className="px-4 py-3 text-sm">
        <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-medium rounded">
          T{question.tema || '?'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-md">
        {question.question_text}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-lg ${status.class}`}>{status.icon}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center gap-1">
          <button
            onClick={() => onView(question)}
            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isPending ? (
            <>
              <button
                onClick={() => onApprove(question.id)}
                disabled={disabled}
                className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                title="Aprobar"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onReject(question.id)}
                disabled={disabled}
                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Rechazar"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onUndo(question.id)}
              disabled={disabled}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Deshacer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Anterior
      </button>
      <span className="px-3 py-1.5 text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente →
      </button>
    </div>
  );
}
