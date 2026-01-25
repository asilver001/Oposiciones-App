import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, UserCheck, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, EyeOff, LogOut, AlertTriangle, FileText,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Keyboard, GitCompare, LayoutGrid, List, RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ViewModeSelector, QuestionCardCompact, QuestionDetailModal } from '../review';
import { BottomTabBar } from '../navigation';

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
  // Support both AdminContext (PIN login) and AuthContext (normal login with role)
  const { adminUser, logoutAdmin, reviewQuestion, markForRefresh } = useAdmin();
  const { user: authUser, userRole, isReviewer: isReviewerFromAuth } = useAuth();

  // Use whichever user is available
  const currentUser = adminUser || (isReviewerFromAuth ? {
    name: userRole?.name || authUser?.user_metadata?.display_name || authUser?.email,
    email: authUser?.email,
    role: userRole?.role || 'reviewer'
  } : null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  // View mode: 'individual', 'grid', 'list'
  const [viewMode, setViewMode] = useState('individual');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  // Handlers for grid/list views (accept question ID)
  const handleApproveById = useCallback(async (questionId, comment = '') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_approved', comment || null);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadStats]);

  const handleRejectById = useCallback(async (questionId, comment = '') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'rejected', comment || null);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadStats]);

  const handleMarkRefreshById = useCallback(async (questionId, reason = 'Necesita reformulación') => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(questionId, reason);

      if (result.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSelectedQuestion(null);
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, markForRefresh, loadStats]);

  const handleUndo = useCallback(async (questionId) => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, 'human_pending', null);

      if (result.success) {
        loadQuestions();
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, reviewQuestion, loadQuestions, loadStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in textarea
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

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
        case 'a':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleApprove();
          }
          break;
        case 'r':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleReject();
          }
          break;
        case 'f':
          if (viewMode === 'individual') {
            e.preventDefault();
            handleMarkRefresh();
          }
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
        case 'escape':
          if (selectedQuestion) {
            e.preventDefault();
            setSelectedQuestion(null);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleApprove, handleReject, handleMarkRefresh, goToNext, goToPrev, viewMode, selectedQuestion]);

  const handleLogout = () => {
    // Logout from AdminContext if logged in via PIN
    if (adminUser) {
      logoutAdmin();
    }
    // Just go back (don't sign out from AuthContext)
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
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
                  {currentUser?.name || 'Revisor'}
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

          {/* View Mode Selector */}
          <div className="mt-4">
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalItems={questions.length}
              currentPage={1}
              itemsPerPage={questions.length}
            />
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
            {/* Individual View */}
            {viewMode === 'individual' && (
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
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">1</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">2</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">3</kbd> Cambiar vista</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">A</kbd> Aprobar</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">R</kbd> Rechazar</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">F</kbd> Reformular</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">O</kbd> Ver original</span>
                    <span><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700">←</kbd><kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-700 ml-0.5">→</kbd> Navegar</span>
                  </div>
                </div>
              </>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions.map((question, idx) => (
                  <QuestionCardCompact
                    key={question.id}
                    question={question}
                    index={idx}
                    onApprove={handleApproveById}
                    onReject={handleRejectById}
                    onView={setSelectedQuestion}
                    onUndo={handleUndo}
                    disabled={actionLoading}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {questions.map((question, idx) => {
                  const correctOpt = question.options?.find(opt => opt.is_correct);
                  return (
                    <div
                      key={question.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Meta */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                              T{question.tema || '?'}
                            </span>
                            {question.materia && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {question.materia}
                              </span>
                            )}
                          </div>

                          {/* Question */}
                          <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                            {question.question_text}
                          </p>

                          {/* Correct answer */}
                          {correctOpt && (
                            <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                              <span className="font-bold">{correctOpt.id?.toUpperCase() || 'A'}.</span> {correctOpt.text}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setSelectedQuestion(question)}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveById(question.id)}
                            disabled={actionLoading}
                            className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectById(question.id)}
                            disabled={actionLoading}
                            className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Question Detail Modal */}
        {selectedQuestion && (
          <QuestionDetailModal
            question={selectedQuestion}
            onClose={() => setSelectedQuestion(null)}
            onApprove={handleApproveById}
            onReject={handleRejectById}
            onMarkRefresh={handleMarkRefreshById}
            disabled={actionLoading}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomTabBar
        activeTab="reviewer"
        onTabChange={() => {}}
        onPageChange={(page) => {
          if (page === 'home') onBack?.();
        }}
      />
    </div>
  );
}
