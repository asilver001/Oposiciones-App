import { useState, useEffect } from 'react';
import {
  ArrowLeft, UserCheck, CheckCircle, XCircle, Clock,
  RefreshCw, Eye, LogOut, AlertTriangle, FileText,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';

export default function ReviewerPanel({ onBack }) {
  const { adminUser, logoutAdmin, reviewQuestion, markForRefresh } = useAdmin();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [stats, setStats] = useState({ reviewed: 0, pending: 0 });
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Get pending questions
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('is_current_version', true)
        .or('validation_status.eq.human_pending,needs_refresh.eq.true')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setQuestions(data || []);
      setCurrentIndex(0);

      // Get stats
      const { count: pendingCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('validation_status', 'human_pending');

      const { count: reviewedCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('reviewed_by', adminUser?.id);

      setStats({
        pending: pendingCount || 0,
        reviewed: reviewedCount || 0
      });
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleReview = async (status) => {
    if (!currentQuestion) return;

    setActionLoading(true);
    try {
      const result = await reviewQuestion(
        currentQuestion.id,
        status,
        reviewComment || null
      );

      if (result.success) {
        setReviewComment('');
        setShowOptions(false);

        // Remove from list and move to next
        const newQuestions = questions.filter((_, i) => i !== currentIndex);
        setQuestions(newQuestions);

        if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
          setCurrentIndex(newQuestions.length - 1);
        }

        // Update stats
        setStats(prev => ({
          ...prev,
          reviewed: prev.reviewed + 1,
          pending: Math.max(0, prev.pending - 1)
        }));
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkRefresh = async () => {
    if (!currentQuestion) return;

    const reason = prompt('Razon para reformular esta pregunta:');
    if (!reason) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(currentQuestion.id, reason);
      if (result.success) {
        // Remove from list
        const newQuestions = questions.filter((_, i) => i !== currentIndex);
        setQuestions(newQuestions);
        if (currentIndex >= newQuestions.length && newQuestions.length > 0) {
          setCurrentIndex(newQuestions.length - 1);
        }
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onBack();
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowOptions(false);
      setReviewComment('');
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowOptions(false);
      setReviewComment('');
    }
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Panel de Revision
                </h1>
                <p className="text-blue-200 text-sm">
                  {adminUser?.name || 'Revisor'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-xs text-blue-200">Pendientes</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.reviewed}</div>
              <div className="text-xs text-blue-200">Revisadas por ti</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{questions.length}</div>
              <div className="text-xs text-blue-200">En cola</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Todo revisado!
            </h2>
            <p className="text-gray-600">
              No hay preguntas pendientes de revision.
            </p>
            <button
              onClick={loadQuestions}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Recargar
            </button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === questions.length - 1}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-30 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Meta */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  Tema {currentQuestion?.tema || '?'}
                </span>
                {currentQuestion?.materia && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {currentQuestion.materia}
                  </span>
                )}
                {currentQuestion?.needs_refresh && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Necesita refresh
                  </span>
                )}
              </div>

              {/* Question text */}
              <div className="p-4">
                <p className="text-gray-900 font-medium leading-relaxed">
                  {currentQuestion?.question_text}
                </p>

                {currentQuestion?.refresh_reason && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                    <strong>Razon del refresh:</strong> {currentQuestion.refresh_reason}
                  </div>
                )}
              </div>

              {/* Toggle options */}
              <div className="px-4 pb-2">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  {showOptions ? 'Ocultar opciones' : 'Ver opciones'}
                </button>
              </div>

              {/* Options */}
              {showOptions && (
                <div className="px-4 pb-4 space-y-2">
                  {(currentQuestion?.options || []).map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-sm ${
                        opt.is_correct
                          ? 'bg-green-50 border-2 border-green-300 text-green-800'
                          : 'bg-gray-50 border border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="font-semibold">
                        {opt.id?.toUpperCase() || String.fromCharCode(65 + idx)}.
                      </span>{' '}
                      {opt.text}
                      {opt.is_correct && (
                        <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />
                      )}
                    </div>
                  ))}

                  {currentQuestion?.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-800 mb-1">Explicacion:</p>
                      <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Comment input */}
              <div className="px-4 pb-4">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Comentario opcional..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => handleReview('human_approved')}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprobar
                </button>
                <button
                  onClick={() => handleReview('rejected')}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>
              </div>

              {/* Secondary action */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleMarkRefresh}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Marcar para reformular
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
