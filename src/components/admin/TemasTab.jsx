import { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit2, Trash2, RefreshCw, CheckCircle,
  Clock, X, Save, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TemasTab() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMateria, setEditingMateria] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({ questions: 0, approved: 0 });

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_materias_with_stats');

      if (error) throw error;

      setMaterias(data || []);

      // Calculate totals
      const totalQuestions = data?.reduce((sum, m) => sum + (m.total_questions || 0), 0) || 0;
      const totalApproved = data?.reduce((sum, m) => sum + (m.approved_questions || 0), 0) || 0;
      setTotals({ questions: totalQuestions, approved: totalApproved });
    } catch (err) {
      console.error('Error loading materias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (materia) => {
    setEditingMateria(materia);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingMateria(null);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingMateria) {
        const { error } = await supabase.rpc('update_materia', {
          p_id: editingMateria.id,
          p_tema_numero: parseFloat(formData.tema_numero),
          p_codigo: formData.codigo,
          p_nombre: formData.nombre,
          p_descripcion: formData.descripcion || null,
          p_bloque: formData.bloque || null,
          p_orden: parseInt(formData.orden) || 0
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc('create_materia', {
          p_tema_numero: parseFloat(formData.tema_numero),
          p_codigo: formData.codigo,
          p_nombre: formData.nombre,
          p_descripcion: formData.descripcion || null,
          p_bloque: formData.bloque || null,
          p_orden: parseInt(formData.orden) || 0
        });
        if (error) throw error;
      }

      setShowModal(false);
      loadMaterias();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (materia) => {
    if (!confirm(`¿Eliminar "${materia.nombre}"?`)) return;

    try {
      const { error } = await supabase.rpc('delete_materia', { p_id: materia.id });
      if (error) throw error;
      loadMaterias();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    );
  }

  // Group by bloque
  const bloques = ['I', 'II', 'III', 'IV'];
  const materiasByBloque = bloques.reduce((acc, bloque) => {
    acc[bloque] = materias.filter(m => m.bloque === bloque);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Temas y Materias</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadMaterias}
            className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Añadir Materia
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Table by Bloque */}
      {bloques.map(bloque => {
        const bloqueMaterias = materiasByBloque[bloque];
        if (bloqueMaterias.length === 0) return null;

        return (
          <div key={bloque} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
              <h3 className="font-semibold text-brand-900">Bloque {bloque}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tema</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materia</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Preguntas</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aprobadas</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pendientes</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bloqueMaterias.map(materia => (
                    <tr key={materia.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-10 h-8 bg-brand-100 text-brand-700 text-sm font-semibold rounded">
                          {materia.tema_numero % 1 === 0 ? Math.floor(materia.tema_numero) : materia.tema_numero}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{materia.nombre}</div>
                          {materia.descripcion && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{materia.descripcion}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-gray-900 font-medium">{materia.total_questions || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          {materia.approved_questions || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {materia.pending_questions > 0 ? (
                          <span className="inline-flex items-center gap-1 text-yellow-600">
                            <Clock className="w-3 h-3" />
                            {materia.pending_questions}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(materia)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(materia)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Totals */}
      <div className="bg-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total: <strong className="text-gray-900">{totals.questions}</strong> preguntas
          </span>
          <span className="text-gray-600">
            Aprobadas: <strong className="text-green-600">{totals.approved}</strong>
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <MateriaModal
          materia={editingMateria}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}

// Modal Component
function MateriaModal({ materia, onSave, onClose, saving }) {
  const [formData, setFormData] = useState({
    tema_numero: materia?.tema_numero || '',
    codigo: materia?.codigo || '',
    nombre: materia?.nombre || '',
    descripcion: materia?.descripcion || '',
    bloque: materia?.bloque || 'I',
    orden: materia?.orden || 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tema_numero || !formData.codigo || !formData.nombre) {
      alert('Completa los campos obligatorios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            {materia ? 'Editar Materia' : 'Añadir Nueva Materia'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Tema *
              </label>
              <input
                type="text"
                value={formData.tema_numero}
                onChange={(e) => setFormData({ ...formData, tema_numero: e.target.value })}
                placeholder="8.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              <p className="text-xs text-gray-500 mt-1">Puede ser decimal: 8.1, 8.2</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bloque
              </label>
              <select
                value={formData.bloque}
                onChange={(e) => setFormData({ ...formData, bloque: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="I">Bloque I</option>
                <option value="II">Bloque II</option>
                <option value="III">Bloque III</option>
                <option value="IV">Bloque IV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="tribunal_constitucional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Tribunal Constitucional"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Breve descripción del tema..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={formData.orden}
              onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
