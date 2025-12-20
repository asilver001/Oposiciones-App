import { useState, useEffect, useCallback } from 'react';
import {
  Lightbulb, Plus, Edit2, Trash2, Link, Unlink, Search,
  CheckCircle, XCircle, AlertTriangle, Info, RefreshCw,
  ChevronDown, ChevronUp, Save, X, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Tipos de insight
const INSIGHT_TIPOS = [
  { value: 'patron_trampa', label: 'Patrón trampa', emoji: '🪤' },
  { value: 'articulo_debil', label: 'Artículo débil', emoji: '📖' },
  { value: 'concepto', label: 'Concepto', emoji: '💡' },
  { value: 'numero_confuso', label: 'Número confuso', emoji: '🔢' },
  { value: 'custom', label: 'Personalizado', emoji: '✨' }
];

// Severidades
const SEVERIDADES = [
  { value: 'info', label: 'Info', color: 'blue', icon: Info },
  { value: 'warning', label: 'Advertencia', color: 'yellow', icon: AlertTriangle },
  { value: 'danger', label: 'Peligro', color: 'red', icon: XCircle },
  { value: 'success', label: 'Éxito', color: 'green', icon: CheckCircle }
];

export default function InsightsTab() {
  const [insights, setInsights] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [expandedInsight, setExpandedInsight] = useState(null);

  // Load insights
  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('insight_templates')
        .select(`
          *,
          insight_question_links (
            id,
            question_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (err) {
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load questions for linking
  const loadQuestions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, tema')
        .eq('is_active', true)
        .order('tema', { ascending: true })
        .limit(500);

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error loading questions:', err);
    }
  }, []);

  useEffect(() => {
    loadInsights();
    loadQuestions();
  }, [loadInsights, loadQuestions]);

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = !searchTerm ||
      insight.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !filterTipo || insight.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  // Toggle insight active status
  const toggleInsightActive = async (insight) => {
    try {
      const { error } = await supabase
        .from('insight_templates')
        .update({ activo: !insight.activo })
        .eq('id', insight.id);

      if (error) throw error;
      loadInsights();
    } catch (err) {
      console.error('Error toggling insight:', err);
    }
  };

  // Delete insight
  const deleteInsight = async (insight) => {
    if (!confirm(`¿Eliminar insight "${insight.titulo}"?`)) return;

    try {
      const { error } = await supabase
        .from('insight_templates')
        .delete()
        .eq('id', insight.id);

      if (error) throw error;
      loadInsights();
    } catch (err) {
      console.error('Error deleting insight:', err);
    }
  };

  const getSeveridadStyle = (severidad) => {
    const styles = {
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      danger: 'bg-red-100 text-red-700 border-red-200',
      success: 'bg-green-100 text-green-700 border-green-200'
    };
    return styles[severidad] || styles.info;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestión de Insights</h2>
          <p className="text-sm text-gray-500 mt-1">
            {insights.length} insights configurados
          </p>
        </div>
        <button
          onClick={() => {
            setEditingInsight(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo Insight
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos los tipos</option>
          {INSIGHT_TIPOS.map(tipo => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.emoji} {tipo.label}
            </option>
          ))}
        </select>
        <button
          onClick={loadInsights}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay insights configurados</p>
          </div>
        ) : (
          filteredInsights.map(insight => (
            <div
              key={insight.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                !insight.activo ? 'opacity-60' : ''
              }`}
            >
              {/* Main row */}
              <div className="p-4 flex items-center gap-4">
                <span className="text-2xl">{insight.emoji || '💡'}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {insight.titulo}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeveridadStyle(insight.severidad)}`}>
                      {insight.severidad}
                    </span>
                    {insight.tema_id && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                        Tema {insight.tema_id}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {insight.descripcion}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{INSIGHT_TIPOS.find(t => t.value === insight.tipo)?.label || insight.tipo}</span>
                    <span>•</span>
                    <span>{insight.min_fallos_para_activar} fallos para activar</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      {insight.insight_question_links?.length || 0} preguntas
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedInsight(insight);
                      setShowLinkModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                    title="Vincular preguntas"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingInsight(insight);
                      setShowCreateModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleInsightActive(insight)}
                    className={`p-2 rounded-lg transition ${
                      insight.activo
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={insight.activo ? 'Desactivar' : 'Activar'}
                  >
                    {insight.activo ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteInsight(insight)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"
                  >
                    {expandedInsight === insight.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expandedInsight === insight.id && (
                <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Mensaje de acción:</span>
                      <p className="text-gray-700">{insight.mensaje_accion || 'Sin mensaje'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tags:</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {insight.tags?.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        )) || <span className="text-gray-400">Sin tags</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <InsightFormModal
          insight={editingInsight}
          onClose={() => {
            setShowCreateModal(false);
            setEditingInsight(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingInsight(null);
            loadInsights();
          }}
        />
      )}

      {/* Link Questions Modal */}
      {showLinkModal && selectedInsight && (
        <LinkQuestionsModal
          insight={selectedInsight}
          questions={questions}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedInsight(null);
          }}
          onSave={() => {
            setShowLinkModal(false);
            setSelectedInsight(null);
            loadInsights();
          }}
        />
      )}
    </div>
  );
}

// Modal para crear/editar insight
function InsightFormModal({ insight, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: insight?.titulo || '',
    descripcion: insight?.descripcion || '',
    tipo: insight?.tipo || 'concepto',
    severidad: insight?.severidad || 'info',
    emoji: insight?.emoji || '💡',
    min_fallos_para_activar: insight?.min_fallos_para_activar || 2,
    mensaje_accion: insight?.mensaje_accion || '',
    es_accionable: insight?.es_accionable ?? true,
    tema_id: insight?.tema_id || '',
    tags: insight?.tags?.join(', ') || '',
    activo: insight?.activo ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        tema_id: formData.tema_id ? parseInt(formData.tema_id) : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        updated_at: new Date().toISOString()
      };

      if (insight?.id) {
        // Update
        const { error } = await supabase
          .from('insight_templates')
          .update(dataToSave)
          .eq('id', insight.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('insight_templates')
          .insert(dataToSave);
        if (error) throw error;
      }

      onSave();
    } catch (err) {
      console.error('Error saving insight:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            {insight ? 'Editar Insight' : 'Nuevo Insight'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Emoji + Título */}
          <div className="flex gap-3">
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-center text-xl"
                maxLength={4}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>

          {/* Tipo + Severidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {INSIGHT_TIPOS.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.emoji} {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
              <select
                value={formData.severidad}
                onChange={(e) => setFormData({ ...formData, severidad: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {SEVERIDADES.map(sev => (
                  <option key={sev.value} value={sev.value}>
                    {sev.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Min fallos + Tema */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mín. fallos para activar
              </label>
              <input
                type="number"
                value={formData.min_fallos_para_activar}
                onChange={(e) => setFormData({ ...formData, min_fallos_para_activar: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                min={1}
                max={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tema (opcional)
              </label>
              <input
                type="number"
                value={formData.tema_id}
                onChange={(e) => setFormData({ ...formData, tema_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: 1"
              />
            </div>
          </div>

          {/* Mensaje de acción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de acción
            </label>
            <input
              type="text"
              value={formData.mensaje_accion}
              onChange={(e) => setFormData({ ...formData, mensaje_accion: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Ej: Repasa el artículo 14 CE"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (separados por coma)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="constitución, derechos, artículo 14"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.es_accionable}
                onChange={(e) => setFormData({ ...formData, es_accionable: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700">Es accionable</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {insight ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal para vincular preguntas
function LinkQuestionsModal({ insight, questions, onClose, onSave }) {
  const [linkedIds, setLinkedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTema, setFilterTema] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load current links
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('insight_question_links')
          .select('question_id')
          .eq('insight_template_id', insight.id);

        if (error) throw error;
        setLinkedIds(data?.map(l => l.question_id) || []);
      } catch (err) {
        console.error('Error loading links:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, [insight.id]);

  const toggleQuestion = (questionId) => {
    setLinkedIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete all existing links for this insight
      await supabase
        .from('insight_question_links')
        .delete()
        .eq('insight_template_id', insight.id);

      // Insert new links
      if (linkedIds.length > 0) {
        const links = linkedIds.map(qId => ({
          insight_template_id: insight.id,
          question_id: qId
        }));

        const { error } = await supabase
          .from('insight_question_links')
          .insert(links);

        if (error) throw error;
      }

      onSave();
    } catch (err) {
      console.error('Error saving links:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = !searchTerm ||
      q.question_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTema = !filterTema || q.tema === parseInt(filterTema);
    return matchesSearch && matchesTema;
  });

  // Get unique temas
  const temas = [...new Set(questions.map(q => q.tema).filter(Boolean))].sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Vincular Preguntas
            </h3>
            <p className="text-sm text-gray-500">
              {insight.emoji} {insight.titulo} — {linkedIds.length} seleccionadas
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={filterTema}
            onChange={(e) => setFilterTema(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Todos los temas</option>
            {temas.map(tema => (
              <option key={tema} value={tema}>Tema {tema}</option>
            ))}
          </select>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredQuestions.map(q => (
                <label
                  key={q.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    linkedIds.includes(q.id)
                      ? 'bg-purple-50 border-purple-300'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={linkedIds.includes(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                    className="w-4 h-4 mt-1 text-purple-600 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {q.question_text}
                    </p>
                    <span className="text-xs text-gray-400">
                      Tema {q.tema} · ID: {q.id}
                    </span>
                  </div>
                </label>
              ))}
              {filteredQuestions.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No se encontraron preguntas
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar ({linkedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
