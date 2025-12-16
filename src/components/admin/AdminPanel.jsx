import { useState, useEffect } from 'react';
import {
  ArrowLeft, Shield, Users, FileText, Settings,
  CheckCircle, XCircle, Clock, RefreshCw, Download,
  Upload, Eye, Edit, Trash2, BarChart3, LogOut,
  ChevronRight, AlertTriangle, Search, Filter
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';
import QuestionImporter from './QuestionImporter';
import QuestionExporter from './QuestionExporter';
import QuestionTierManager from './QuestionTierManager';

export default function AdminPanel({ onBack }) {
  const { adminUser, logoutAdmin, isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get question stats
      const { data: questions, error: qError } = await supabase
        .from('questions')
        .select('validation_status, is_current_version, needs_refresh')
        .eq('is_active', true);

      if (qError) throw qError;

      const currentQuestions = questions?.filter(q => q.is_current_version !== false) || [];

      const questionStats = {
        total: currentQuestions.length,
        approved: currentQuestions.filter(q => q.validation_status === 'human_approved').length,
        pending: currentQuestions.filter(q => q.validation_status === 'human_pending').length,
        autoValidated: currentQuestions.filter(q => q.validation_status === 'auto_validated').length,
        rejected: currentQuestions.filter(q => q.validation_status === 'rejected').length,
        needsRefresh: currentQuestions.filter(q => q.needs_refresh).length,
      };

      // Get admin stats
      const { data: admins, error: aError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('is_active', true);

      setStats({
        questions: questionStats,
        admins: admins || []
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onBack();
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'review', label: 'Revisar', icon: CheckCircle },
    { id: 'import', label: 'Importar', icon: Upload },
    { id: 'export', label: 'Exportar', icon: Download },
    { id: 'tiers', label: 'Tiers', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
                  <Shield className="w-5 h-5" />
                  Panel de Admin
                </h1>
                <p className="text-purple-200 text-sm">
                  {adminUser?.name || adminUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-purple-200 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} loading={loading} onRefresh={loadStats} />
        )}
        {activeTab === 'review' && (
          <ReviewTab />
        )}
        {activeTab === 'import' && (
          <QuestionImporter />
        )}
        {activeTab === 'export' && (
          <QuestionExporter />
        )}
        {activeTab === 'tiers' && (
          <QuestionTierManager />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Preguntas', value: stats?.questions?.total || 0, icon: FileText, color: 'blue' },
    { label: 'Aprobadas', value: stats?.questions?.approved || 0, icon: CheckCircle, color: 'green' },
    { label: 'Pendientes', value: stats?.questions?.pending || 0, icon: Clock, color: 'yellow' },
    { label: 'Auto-validadas', value: stats?.questions?.autoValidated || 0, icon: CheckCircle, color: 'purple' },
    { label: 'Rechazadas', value: stats?.questions?.rejected || 0, icon: XCircle, color: 'red' },
    { label: 'Necesitan Refresh', value: stats?.questions?.needsRefresh || 0, icon: RefreshCw, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className="space-y-6">
      {/* Refresh button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`p-4 rounded-xl border ${colorClasses[card.color]}`}
          >
            <div className="flex items-center gap-3">
              <card.icon className="w-8 h-8 opacity-80" />
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm opacity-80">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium">Administradores Activos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {stats?.admins?.map(admin => (
            <div key={admin.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{admin.name || admin.email}</div>
                <div className="text-sm text-gray-500">{admin.email}</div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                admin.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {admin.role === 'admin' ? 'Admin' : 'Revisor'}
              </span>
            </div>
          ))}
          {(!stats?.admins || stats.admins.length === 0) && (
            <div className="px-4 py-8 text-center text-gray-500">
              No hay administradores registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Review Tab Component
function ReviewTab() {
  const { reviewQuestion, markForRefresh, adminUser } = useAdmin();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [filter]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .eq('is_current_version', true)
        .order('created_at', { ascending: true })
        .limit(50);

      if (filter === 'pending') {
        query = query.eq('validation_status', 'human_pending');
      } else if (filter === 'refresh') {
        query = query.eq('needs_refresh', true);
      } else if (filter === 'rejected') {
        query = query.eq('validation_status', 'rejected');
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (questionId, status) => {
    setActionLoading(true);
    try {
      const result = await reviewQuestion(questionId, status, reviewComment || null);
      if (result.success) {
        setSelectedQuestion(null);
        setReviewComment('');
        loadQuestions();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkRefresh = async (questionId) => {
    const reason = prompt('Razon para reformular:');
    if (!reason) return;

    setActionLoading(true);
    try {
      const result = await markForRefresh(questionId, reason);
      if (result.success) {
        loadQuestions();
      } else {
        alert('Error: ' + result.error);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'pending', label: 'Pendientes', icon: Clock },
          { id: 'refresh', label: 'Necesitan Refresh', icon: RefreshCw },
          { id: 'rejected', label: 'Rechazadas', icon: XCircle },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <f.icon className="w-4 h-4" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">No hay preguntas en esta categoria</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        Tema {q.tema || '?'}
                      </span>
                      {q.needs_refresh && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                          Necesita refresh
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium line-clamp-2">
                      {q.question_text}
                    </p>
                    {q.refresh_reason && (
                      <p className="text-sm text-orange-600 mt-1">
                        Razon: {q.refresh_reason}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(selectedQuestion?.id === q.id ? null : q)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Expanded view */}
                {selectedQuestion?.id === q.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Options */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Opciones:</p>
                      {(q.options || []).map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-sm ${
                            opt.is_correct
                              ? 'bg-green-50 border border-green-200 text-green-800'
                              : 'bg-gray-50 border border-gray-200 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{opt.id?.toUpperCase() || String.fromCharCode(65 + idx)}.</span> {opt.text}
                          {opt.is_correct && <span className="ml-2 text-green-600">(Correcta)</span>}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Explicacion:</p>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* Review comment */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Comentario (opcional):
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        rows={2}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleReview(q.id, 'human_approved')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReview(q.id, 'rejected')}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleMarkRefresh(q.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Marcar Refresh
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
