import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, UserCheck, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, EyeOff, LogOut, AlertTriangle, FileText,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Keyboard, GitCompare
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';

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

export default function ReviewerPanel({ onBack }) {
  const { adminUser, logoutAdmin, reviewQuestion, markForRefresh } = useAdmin();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  // Collapsible states
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('left');

  // Load questions and stats
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Get pending questions with original_text
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('is_current_version', true)
        .eq('validation_status', 'human_pending')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setQuestions(data || []);
      setCurrentIndex(0);
      setShowOtherOptions(false);
      setShowOriginal(false);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats separately (for auto-refresh)
  const loadStats = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'human_pending'),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'human_approved'),
        supabase
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('validation_status', 'rejected')
      ]);

      setStats({
        pending: pendingRes.count || 0,
        approved: approvedRes.count || 0,
        rejected: rejectedRes.count || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
    loadStats();
  }, [loadQuestions, loadStats]);

  const currentQuestion = questions[currentIndex];

  // Find correct and incorrect options
  const correctOption = currentQuestion?.options?.find(opt => opt.is_correct);
  const incorrectOptions = currentQuestion?.options?.filter(opt => !opt.is_correct) || [];

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setAnimationDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowOtherOptions(false);
        setShowOriginal(false);
        setReviewComment('');
        setIsAnimating(false);
      }, 150);
    }
  }, [currentIndex, questions.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setAnimationDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setShowOtherOptions(false);
        setShowOriginal(false);
        setReviewComment('');
        setIsAnimating(false);
      }, 150);
    }
  }, [currentIndex]);

  // Handle approve
  const handleApprove = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(
        currentQuestion.id,
        'human_approved',
        reviewComment || null
      );

      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        // Remove from list
        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setShowOriginal(false);
          setIsAnimating(false);

          // Auto-refresh stats
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, reviewQuestion, loadStats]);

  // Handle reject
  const handleReject = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(
        currentQuestion.id,
        'rejected',
        reviewComment || null
      );

      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setShowOriginal(false);
          setIsAnimating(false);

          // Auto-refresh stats
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, reviewQuestion, loadStats]);

  // Handle mark for refresh
  const handleMarkRefresh = useCallback(async () => {
    if (!currentQuestion || actionLoading) return;

    const reason = reviewComment || prompt('Razón para reformular esta pregunta:');
    if (!reason) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(currentQuestion.id, reason);
      if (result.success) {
        setReviewComment('');
        setAnimationDirection('left');
        setIsAnimating(true);

        const newQuestions = questions.filter((_, i) => i !== currentIndex);

        setTimeout(() => {
          setQuestions(newQuestions);
          if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
            setCurrentIndex(newQuestions.length - 1);
          }
          setShowOtherOptions(false);
          setShowOriginal(false);
          setIsAnimating(false);
          loadStats();
        }, 200);
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [currentQuestion, actionLoading, reviewComment, questions, currentIndex, markForRefresh, loadStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in textarea
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          handleApprove();
          break;
        case 'r':
          e.preventDefault();
          handleReject();
          break;
        case 'f':
          e.preventDefault();
          handleMarkRefresh();
          break;
        case 'o':
          e.preventDefault();
          setShowOriginal(prev => !prev);
          break;
        case 'e':
          e.preventDefault();
          setShowOtherOptions(true);
          setShowOriginal(true);
          break;
        case 'arrowright':
          e.preventDefault();
          goToNext();
          break;
        case 'arrowleft':
          e.preventDefault();
          goToPrev();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleApprove, handleReject, handleMarkRefresh, goToNext, goToPrev]);

  const handleLogout = () => {
    logoutAdmin();
    onBack();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Panel de Revisión
                </h1>
                <p className="text-purple-200 text-sm">
                  {adminUser?.name || 'Revisor'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Salir"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-xl p-3 text-center transition-all duration-300">
              <div className="text-2xl font-bold tabular-nums">{stats.pending}</div>
              <div className="text-xs text-purple-200 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                Pendientes
              </div>
            </div>
            <div className="flex-1 bg-green-500/20 backdrop-blur rounded-xl p-3 text-center transition-all duration-300">
              <div className="text-2xl font-bold tabular-nums">{stats.approved}</div>
              <div className="text-xs text-green-200 flex items-center justify-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Aprobadas
              </div>
            </div>
            <div className="flex-1 bg-red-500/20 backdrop-blur rounded-xl p-3 text-center transition-all duration-300">
              <div className="text-2xl font-bold tabular-nums">{stats.rejected}</div>
              <div className="text-xs text-red-200 flex items-center justify-center gap-1">
                <XCircle className="w-3 h-3" />
                Rechazadas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Todo revisado!
            </h2>
            <p className="text-gray-600 mb-4">
              No hay preguntas pendientes de revisión.
            </p>
            <button
              onClick={() => { loadQuestions(); loadStats(); }}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </button>
          </div>
        ) : (
          <>
            {/* Progress & Navigation */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600 font-medium">
                Pregunta <span className="text-purple-600">{currentIndex + 1}</span> de {questions.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                  title="Anterior [←]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === questions.length - 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
                  title="Siguiente [→]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div
              className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-200 ${
                isAnimating
                  ? animationDirection === 'left'
                    ? 'opacity-0 translate-x-4'
                    : 'opacity-0 -translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Meta tags */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  Tema {currentQuestion?.tema || '?'}
                </span>
                {currentQuestion?.materia && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {currentQuestion.materia}
                  </span>
                )}
                {currentQuestion?.difficulty && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    Dificultad: {currentQuestion.difficulty}/5
                  </span>
                )}
              </div>

              {/* Question text */}
              <div className="p-5">
                <p className="text-gray-900 text-lg leading-relaxed">
                  {currentQuestion?.question_text}
                </p>
              </div>

              {/* Correct Answer - Always visible and highlighted */}
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
                  // Collapsed preview
                  <div className="mt-2 space-y-1">
                    {incorrectOptions.map((opt, idx) => (
                      <div key={idx} className="text-sm text-gray-400 truncate pl-2">
                        {opt.id?.toUpperCase() || String.fromCharCode(66 + idx)}. {opt.text}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Expanded view
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

              {/* Explanation if available */}
              {currentQuestion?.explanation && showOtherOptions && (
                <div className="px-5 pb-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs font-semibold text-blue-800 mb-1">📚 Explicación:</p>
                    <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}

              {/* Legal reference if available */}
              {currentQuestion?.legal_reference && showOtherOptions && (
                <div className="px-5 pb-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-semibold text-amber-800 mb-1">📜 Referencia legal:</p>
                    <p className="text-sm text-amber-700">{currentQuestion.legal_reference}</p>
                  </div>
                </div>
              )}

              {/* Compare with Original - Collapsible */}
              {currentQuestion?.original_text && (
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
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {/* Original */}
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                        <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          ORIGINAL (PDF)
                        </p>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {currentQuestion.original_text}
                        </p>
                      </div>
                      {/* Reformulated */}
                      <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-300">
                        <p className="text-xs font-semibold text-cyan-700 mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          REFORMULADA
                        </p>
                        <p className="text-sm text-cyan-900 leading-relaxed">
                          {currentQuestion.question_text}
                        </p>
                      </div>
                    </div>
                  )}

                  {showOriginal && currentQuestion?.reformulation_type && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                      <p className="text-xs text-gray-600">
                        💡 <strong>Tipo de cambio:</strong>{' '}
                        {reformulationLabels[currentQuestion.reformulation_type] || currentQuestion.reformulation_type}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Comment input */}
              <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  💬 Comentario (opcional):
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Escribe un comentario si lo deseas..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                  rows={2}
                />
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5">
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-green-500/25 active:scale-[0.98]"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Aprobar
                    <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">A</kbd>
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 font-semibold shadow-lg shadow-red-500/25 active:scale-[0.98]"
                  >
                    <XCircle className="w-5 h-5" />
                    Rechazar
                    <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">R</kbd>
                  </button>
                </div>

                <button
                  onClick={handleMarkRefresh}
                  disabled={actionLoading}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Marcar para reformular
                  <kbd className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 rounded">F</kbd>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="mt-4 p-3 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Keyboard className="w-4 h-4" />
                <span className="font-medium">Atajos de teclado:</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">A</kbd> Aprobar</span>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">R</kbd> Rechazar</span>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">F</kbd> Reformular</span>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">O</kbd> Ver original</span>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">E</kbd> Expandir todo</span>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">←</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">→</kbd> Navegar</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
