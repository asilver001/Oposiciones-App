import { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Eye, Edit2, History, RefreshCw,
  ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle,
  X, Save, AlertCircle, Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';

export default function PreguntasTab() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  // Filters
  const [filters, setFilters] = useState({
    tema: '',
    status: '',
    tier: '',
    search: ''
  });

  // Modals
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [page, filters]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_questions_paginated', {
        p_page: page,
        p_per_page: perPage,
        p_tema: filters.tema ? parseInt(filters.tema) : null,
        p_status: filters.status || null,
        p_tier: filters.tier || null,
        p_search: filters.search || null
      });

      if (error) throw error;

      setQuestions(data || []);
      if (data && data.length > 0) {
        setTotalCount(data[0].total_count || 0);
      } else {
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleViewDetail = (question) => {
    setSelectedQuestion(question);
    setShowDetailModal(true);
  };

  const handleViewVersions = (question) => {
    setSelectedQuestion(question);
    setShowVersionsModal(true);
  };

  const totalPages = Math.ceil(totalCount / perPage);

  const getStatusBadge = (status) => {
    const badges = {
      'human_approved': { icon: CheckCircle, class: 'bg-green-100 text-green-700', label: 'Aprobada' },
      'human_pending': { icon: Clock, class: 'bg-yellow-100 text-yellow-700', label: 'Pendiente' },
      'rejected': { icon: XCircle, class: 'bg-red-100 text-red-700', label: 'Rechazada' },
      'auto_validated': { icon: CheckCircle, class: 'bg-purple-100 text-purple-700', label: 'Auto' }
    };
    const badge = badges[status] || badges['human_pending'];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Preguntas</h2>
        </div>
        <button
          onClick={loadQuestions}
          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar pregunta..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>
          <select
            value={filters.tema}
            onChange={(e) => handleFilterChange('tema', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white"
          >
            <option value="">Todos los temas</option>
            {[...Array(30)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Tema {i + 1}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="human_approved">Aprobadas</option>
            <option value="human_pending">Pendientes</option>
            <option value="rejected">Rechazadas</option>
            <option value="auto_validated">Auto-validadas</option>
          </select>
          <select
            value={filters.tier}
            onChange={(e) => handleFilterChange('tier', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white"
          >
            <option value="">Todos los tiers</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Mostrando {((page - 1) * perPage) + 1}-{Math.min(page * perPage, totalCount)} de {totalCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-2 text-sm">
            Página {page} de {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron preguntas</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pregunta</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Vistas</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ver.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {questions.map(q => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-6 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                      {q.tema || '?'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                      {q.question_text}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(q.validation_status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium ${
                      q.tier === 'free' ? 'text-green-600' : 'text-purple-600'
                    }`}>
                      {q.tier === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {q.times_shown || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-gray-500">v{q.version || 1}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleViewDetail(q)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewDetail(q)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewVersions(q)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Ver versiones"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="text-xs text-gray-500 flex gap-4">
        <span><Eye className="w-3 h-3 inline mr-1" />Ver detalle</span>
        <span><Edit2 className="w-3 h-3 inline mr-1" />Editar</span>
        <span><History className="w-3 h-3 inline mr-1" />Ver versiones</span>
      </div>

      {/* Modals */}
      {showDetailModal && selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => { setShowDetailModal(false); setSelectedQuestion(null); }}
          onSave={() => { setShowDetailModal(false); loadQuestions(); }}
        />
      )}

      {showVersionsModal && selectedQuestion && (
        <VersionHistoryModal
          questionId={selectedQuestion.id}
          onClose={() => { setShowVersionsModal(false); setSelectedQuestion(null); }}
        />
      )}
    </div>
  );
}

// Question Detail Modal
function QuestionDetailModal({ question, onClose, onSave }) {
  const { createQuestionVersion } = useAdmin();
  const [formData, setFormData] = useState({
    question_text: question.question_text || '',
    options: question.options || [],
    explanation: question.explanation || '',
    tema: question.tema || '',
    tier: question.tier || 'premium',
    validation_status: question.validation_status || 'human_pending'
  });
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState('view'); // 'view', 'edit', 'new_version'

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'is_correct') {
      // Only one correct answer
      newOptions.forEach((opt, i) => {
        opt.is_correct = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setFormData({ ...formData, options: newOptions });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (mode === 'new_version') {
        const result = await createQuestionVersion(
          question.id,
          formData.question_text,
          formData.options,
          formData.explanation
        );
        if (!result.success) throw new Error(result.error);
      } else {
        const { error } = await supabase.rpc('update_question', {
          p_question_id: question.id,
          p_question_text: formData.question_text,
          p_options: formData.options,
          p_explanation: formData.explanation,
          p_tema: parseInt(formData.tema) || null,
          p_tier: formData.tier,
          p_validation_status: formData.validation_status
        });
        if (error) throw error;
      }
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Pregunta #{question.tema || '?'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                question.validation_status === 'human_approved' ? 'bg-green-100 text-green-700' :
                question.validation_status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {question.validation_status}
              </span>
              <span className="text-xs text-gray-500">Tier: {question.tier}</span>
              <span className="text-xs text-gray-500">Vistas: {question.times_shown || 0}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Mode selector */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'view', label: 'Ver' },
              { id: 'edit', label: 'Editar' },
              { id: 'new_version', label: 'Nueva Versión' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === m.id ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Original text (if exists) */}
          {question.original_text && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📄 Texto Original (del PDF):
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                {question.original_text}
              </div>
            </div>
          )}

          {/* Question text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ✏️ Texto de la Pregunta:
            </label>
            {mode === 'view' ? (
              <div className="p-3 bg-purple-50 rounded-lg text-sm text-gray-900 border border-purple-200">
                {formData.question_text}
              </div>
            ) : (
              <textarea
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            )}
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opciones:</label>
            <div className="space-y-2">
              {formData.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    opt.is_correct ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {mode !== 'view' && (
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={opt.is_correct}
                      onChange={() => handleOptionChange(idx, 'is_correct', true)}
                      className="text-green-600 focus:ring-green-500"
                    />
                  )}
                  <span className="font-semibold text-gray-600 w-6">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {mode === 'view' ? (
                    <span className="flex-1 text-sm">{opt.text}</span>
                  ) : (
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  {opt.is_correct && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explicación:</label>
            {mode === 'view' ? (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-200">
                {formData.explanation || 'Sin explicación'}
              </div>
            ) : (
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              />
            )}
          </div>

          {/* Metadata */}
          {mode !== 'view' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
                <input
                  type="number"
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.validation_status}
                  onChange={(e) => setFormData({ ...formData, validation_status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                  disabled={mode === 'new_version'}
                >
                  <option value="human_pending">Pendiente</option>
                  <option value="human_approved">Aprobada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          {mode !== 'view' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {mode === 'new_version' ? 'Crear Nueva Versión' : 'Guardar Cambios'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Version History Modal
function VersionHistoryModal({ questionId, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, [questionId]);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_question_versions', {
        p_question_id: questionId
      });
      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      console.error('Error loading versions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Historial de Versiones</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : versions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay versiones disponibles</p>
          ) : (
            <div className="space-y-4">
              {versions.map((v, idx) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border-2 ${
                    v.is_current_version
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">v{v.version}</span>
                      {v.is_current_version && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                          ACTUAL
                        </span>
                      )}
                      {idx === versions.length - 1 && (
                        <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                          ORIGINAL
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(v.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    "{v.question_text}"
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {v.reformulated_by && (
                      <span>Reformulada por: <strong className="text-gray-700">{v.reformulated_by}</strong></span>
                    )}
                    <span>Status: <strong className={
                      v.validation_status === 'human_approved' ? 'text-green-600' :
                      v.validation_status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }>{v.validation_status}</strong></span>
                  </div>
                  {v.reviewer_name && (
                    <div className="text-xs text-gray-500 mt-1">
                      Revisada por: {v.reviewer_name} ({formatDate(v.reviewed_at)})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
