import React, { useState, useEffect } from 'react';
import { Download, Filter, Loader2, RefreshCw, FileJson } from 'lucide-react';
import { exportQuestions, getQuestionStats, downloadAsJSON } from '../../services/questionImportService';

export default function QuestionExporter() {
  const [filters, setFilters] = useState({
    tema: '',
    tier: '',
    validation_status: '',
    materia: '',
    difficulty: ''
  });
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [previewQuestions, setPreviewQuestions] = useState([]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await getQuestionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setExportResult(null);
    setPreviewQuestions([]);
  };

  // Preview export (fetch without download)
  const handlePreview = async () => {
    setIsExporting(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      // Parse numeric values
      if (cleanFilters.tema) cleanFilters.tema = parseInt(cleanFilters.tema);
      if (cleanFilters.difficulty) cleanFilters.difficulty = parseInt(cleanFilters.difficulty);

      const result = await exportQuestions({ ...cleanFilters, limit: 100 });
      if (result.success) {
        setExportResult(result);
        setPreviewQuestions(result.questions.slice(0, 5));
      } else {
        setExportResult({ error: result.error });
      }
    } catch (error) {
      setExportResult({ error: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  // Export and download
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      // Parse numeric values
      if (cleanFilters.tema) cleanFilters.tema = parseInt(cleanFilters.tema);
      if (cleanFilters.difficulty) cleanFilters.difficulty = parseInt(cleanFilters.difficulty);

      const result = await exportQuestions(cleanFilters);

      if (result.success && result.questions.length > 0) {
        const filterLabel = Object.keys(cleanFilters).length > 0
          ? '_' + Object.entries(cleanFilters).map(([k, v]) => `${k}-${v}`).join('_')
          : '';
        downloadAsJSON(result.questions, `preguntas${filterLabel}`);
        setExportResult({ ...result, downloaded: true });
      } else {
        setExportResult(result);
      }
    } catch (error) {
      setExportResult({ error: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      tema: '',
      tier: '',
      validation_status: '',
      materia: '',
      difficulty: ''
    });
    setExportResult(null);
    setPreviewQuestions([]);
  };

  // Get available temas from stats
  const availableTemas = stats?.byTema ? Object.keys(stats.byTema).sort((a, b) => Number(a) - Number(b)) : [];
  const availableMaterias = stats?.byMateria ? Object.keys(stats.byMateria).sort() : [];
  const availableValidationStatuses = stats?.byValidation ? Object.keys(stats.byValidation).sort() : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-6 h-6" />
            Exportar Preguntas
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            Descarga preguntas de Supabase en formato JSON
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Summary */}
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-brand-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-brand-700">{stats.total}</p>
                <p className="text-sm text-brand-600">Total</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-700">{stats.byTier?.free || 0}</p>
                <p className="text-sm text-green-600">Free</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-700">{stats.byTier?.premium || 0}</p>
                <p className="text-sm text-amber-600">Premium</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">{Object.keys(stats.byTema || {}).length}</p>
                <p className="text-sm text-blue-600">Temas</p>
              </div>
            </div>
          ) : null}

          {/* Filters */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Tema */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tema</label>
                <select
                  value={filters.tema}
                  onChange={(e) => handleFilterChange('tema', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todos</option>
                  {availableTemas.map(tema => (
                    <option key={tema} value={tema}>
                      Tema {tema} ({stats?.byTema[tema] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tier</label>
                <select
                  value={filters.tier}
                  onChange={(e) => handleFilterChange('tier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todos</option>
                  <option value="free">Free ({stats?.byTier?.free || 0})</option>
                  <option value="premium">Premium ({stats?.byTier?.premium || 0})</option>
                </select>
              </div>

              {/* Validation Status */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Estado validación</label>
                <select
                  value={filters.validation_status}
                  onChange={(e) => handleFilterChange('validation_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todos</option>
                  {availableValidationStatuses.map(status => (
                    <option key={status} value={status}>
                      {status} ({stats?.byValidation[status] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Materia */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Materia</label>
                <select
                  value={filters.materia}
                  onChange={(e) => handleFilterChange('materia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todas</option>
                  {availableMaterias.map(materia => (
                    <option key={materia} value={materia}>
                      {materia} ({stats?.byMateria[materia] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Dificultad</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Todas</option>
                  <option value="1">1 - Muy fácil</option>
                  <option value="2">2 - Fácil</option>
                  <option value="3">3 - Media</option>
                  <option value="4">4 - Difícil</option>
                  <option value="5">5 - Muy difícil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold rounded-xl transition disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              Vista previa
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileJson className="w-5 h-5" />
              )}
              Exportar a JSON
            </button>
          </div>

          {/* Export Result */}
          {exportResult && (
            <div className={`p-4 rounded-xl ${exportResult.error ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
              {exportResult.error ? (
                <p className="text-red-700">{exportResult.error}</p>
              ) : (
                <div>
                  <p className="font-semibold text-emerald-800">
                    {exportResult.downloaded ? '✓ Archivo descargado' : `${exportResult.count} preguntas encontradas`}
                  </p>
                  {exportResult.count === 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      No hay preguntas que coincidan con los filtros seleccionados
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview Questions */}
          {previewQuestions.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-600">
                  Vista previa (mostrando {previewQuestions.length} de {exportResult?.count || 0})
                </p>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {previewQuestions.map((q, i) => (
                  <div key={i} className="p-4">
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      {i + 1}. {q.question_text}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, j) => (
                        <div
                          key={j}
                          className={`p-2 rounded ${opt.is_correct ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                        >
                          {['A', 'B', 'C', 'D'][j]}. {opt.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-700 rounded">
                        Tema {q.tema}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${q.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {q.tier}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        {q.validation_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
