import React from 'react';
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Loader2
} from 'lucide-react';
import InsightCard from '../InsightCard';

/**
 * Map insight type to severity level for styling
 */
function getSeverityFromType(tipo) {
  const severityMap = {
    'error_comun': 'danger',
    'concepto_clave': 'warning',
    'tecnica_memorizacion': 'info',
    'patron_fallo': 'danger',
    'refuerzo_positivo': 'success',
    'consejo': 'info'
  };
  return severityMap[tipo] || 'info';
}

export default function SessionComplete({
  sessionStats,
  triggeredInsights = [],
  insightsLoading = false,
  onNewSession,
  onClose
}) {
  const accuracy = sessionStats.answered > 0
    ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        {/* Trophy */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          {accuracy >= 80 && (
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Sesión completada!
        </h2>

        <p className="text-gray-600 mb-6">
          {accuracy >= 80 ? '¡Excelente trabajo!' :
           accuracy >= 60 ? '¡Buen progreso!' :
           'Sigue practicando, mejorarás pronto'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{sessionStats.answered}</p>
            <p className="text-xs text-gray-500">Respondidas</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{sessionStats.correct}</p>
            <p className="text-xs text-gray-500">Correctas</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <RotateCcw className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{sessionStats.reviews}</p>
            <p className="text-xs text-gray-500">Repasos</p>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Precisión</span>
            <span className="font-bold text-purple-600">{accuracy}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                accuracy >= 80 ? 'bg-green-500' :
                accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Insights Section */}
        {triggeredInsights.length > 0 && (
          <div className="mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-gray-700">Analisis de tus errores</h3>
            </div>
            <div className="space-y-3">
              {triggeredInsights.map((insight, index) => (
                <InsightCard
                  key={insight.templateId || index}
                  emoji={insight.emoji || '💡'}
                  titulo={insight.titulo}
                  descripcion={insight.descripcion}
                  severidad={getSeverityFromType(insight.tipo)}
                  totalFalladas={insight.totalFailed}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading insights indicator */}
        {insightsLoading && (
          <div className="mb-6 flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analizando errores...</span>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewSession}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Nueva sesión
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
