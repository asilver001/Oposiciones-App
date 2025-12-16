import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  Gift,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  getQuestionStats,
  getQuestionsAdmin,
  updateQuestionTier,
  rotateFreeTier
} from '../../services/questionsService';

export default function QuestionTierManager() {
  const [stats, setStats] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateResult, setRotateResult] = useState(null);

  // Filters and pagination
  const [filters, setFilters] = useState({
    tier: '',
    tema: '',
    search: '',
    page: 1,
    perPage: 20
  });

  // Selected questions for bulk actions
  const [selected, setSelected] = useState(new Set());

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const data = await getQuestionStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load questions
  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, count, error } = await getQuestionsAdmin({
        page: filters.page,
        perPage: filters.perPage,
        tier: filters.tier || null,
        tema: filters.tema ? parseInt(filters.tema) : null,
        search: filters.search || null
      });

      if (error) {
        console.error('Error loading questions:', error);
      } else {
        setQuestions(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Handle tier change for single question
  const handleTierChange = async (questionId, newTier) => {
    const success = await updateQuestionTier(questionId, newTier);
    if (success) {
      // Update local state
      setQuestions(prev =>
        prev.map(q => q.id === questionId ? { ...q, tier: newTier } : q)
      );
      // Refresh stats
      loadStats();
    }
  };

  // Handle tier rotation
  const handleRotate = async (percentage) => {
    setIsRotating(true);
    setRotateResult(null);

    try {
      const result = await rotateFreeTier(percentage);
      setRotateResult(result);

      // Refresh data
      await Promise.all([loadStats(), loadQuestions()]);
    } catch (err) {
      console.error('Error rotating tiers:', err);
      setRotateResult({ error: err.message });
    } finally {
      setIsRotating(false);
    }
  };

  // Handle selection
  const toggleSelect = (questionId) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selected.size === questions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(questions.map(q => q.id)));
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / filters.perPage);

  // Available temas from stats
  const availableTemas = stats?.byTema ? Object.keys(stats.byTema).sort((a, b) => Number(a) - Number(b)) : [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Gestión de Tiers
          </h2>
          <p className="text-amber-100 text-sm mt-1">
            Administra las preguntas free y premium
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Summary */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <Gift className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-700">{stats.free}</p>
                <p className="text-sm text-green-600">Free</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                <Crown className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-amber-700">{stats.premium}</p>
                <p className="text-sm text-amber-600">Premium</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 font-bold">=</span>
                </div>
                <p className="text-3xl font-bold text-purple-700">{stats.total}</p>
                <p className="text-sm text-purple-600">Total</p>
              </div>
            </div>
          )}

          {/* Rotation Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <RotateCcw className="w-5 h-5" />
              Rotación de Preguntas
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Intercambia las preguntas free más vistas por preguntas premium menos vistas.
              Esto mantiene fresco el contenido gratuito.
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleRotate(10)}
                disabled={isRotating}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 font-medium text-sm"
              >
                Rotar 10%
              </button>
              <button
                onClick={() => handleRotate(20)}
                disabled={isRotating}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 disabled:opacity-50 font-medium text-sm"
              >
                Rotar 20%
              </button>
              <button
                onClick={() => handleRotate(30)}
                disabled={isRotating}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium text-sm flex items-center gap-2"
              >
                {isRotating && <Loader2 className="w-4 h-4 animate-spin" />}
                Rotar 30%
              </button>
            </div>

            {rotateResult && (
              <div className={`mt-3 p-3 rounded-lg ${rotateResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {rotateResult.error ? (
                  <p className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Error: {rotateResult.error}
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Rotación completada: {rotateResult.demoted} bajadas a premium, {rotateResult.promoted} subidas a free
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pregunta..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <select
              value={filters.tier}
              onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="">Todos los tiers</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            <select
              value={filters.tema}
              onChange={(e) => setFilters(prev => ({ ...prev, tema: e.target.value, page: 1 }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="">Todos los temas</option>
              {availableTemas.map(tema => (
                <option key={tema} value={tema}>Tema {tema}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setFilters({ tier: '', tema: '', search: '', page: 1, perPage: 20 });
                setSelected(new Set());
              }}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Limpiar
            </button>
          </div>

          {/* Questions Table */}
          <div className="border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={questions.length > 0 && selected.size === questions.length}
                        onChange={selectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Pregunta
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-20">
                      Tema
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-24">
                      Vistas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-32">
                      Tier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                      </td>
                    </tr>
                  ) : questions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No se encontraron preguntas
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(q.id)}
                            onChange={() => toggleSelect(q.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {q.question_text}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {q.tema}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-600">
                            {q.times_shown || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => handleTierChange(q.id, 'free')}
                              className={`px-3 py-1 rounded text-xs font-medium transition ${
                                q.tier === 'free'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              Free
                            </button>
                            <button
                              onClick={() => handleTierChange(q.id, 'premium')}
                              className={`px-3 py-1 rounded text-xs font-medium transition ${
                                q.tier === 'premium'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                              }`}
                            >
                              Premium
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {((filters.page - 1) * filters.perPage) + 1} - {Math.min(filters.page * filters.perPage, totalCount)} de {totalCount}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    {filters.page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={filters.page === totalPages}
                    className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
