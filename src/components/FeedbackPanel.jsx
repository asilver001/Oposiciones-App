import { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle, XCircle, MinusSquare } from 'lucide-react';
import InsightCard from './InsightCard';

/**
 * FeedbackPanel - Collapsible panel showing session stats and insights
 */

/**
 * Format date to Spanish locale string
 */
function formatDate(date) {
  if (!date) return '';
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

/**
 * Map insight type to severity
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

export default function FeedbackPanel({
  insights = [],
  sessionStats = {},
  sessionDate,
  defaultExpanded = false,
  onInsightAction
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const {
    correctas = 0,
    incorrectas = 0,
    en_blanco: enBlanco = 0,
    porcentaje_acierto: porcentaje = 0
  } = sessionStats;

  const hasDangerInsights = insights.some(
    i => getSeverityFromType(i.tipo) === 'danger'
  );

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [insights, sessionStats, isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const handleInsightAction = (insight) => {
    if (onInsightAction) {
      onInsightAction(insight);
    }
  };

  // Don't render if no stats and no insights
  if (!sessionStats.total && insights.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        rounded-2xl border-2 overflow-hidden transition-all duration-300
        ${hasDangerInsights ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200 bg-white'}
        shadow-sm hover:shadow-md
      `}
    >
      {/* Collapsible Header */}
      <button
        onClick={toggleExpanded}
        className={`
          w-full px-4 py-3 flex items-center justify-between
          transition-colors
          ${hasDangerInsights ? 'hover:bg-orange-50' : 'hover:bg-gray-50'}
        `}
        aria-expanded={isExpanded}
        aria-controls="feedback-content"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="Insights">
            💡
          </span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              Tu última sesión
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              {sessionDate && (
                <span>{formatDate(sessionDate)}</span>
              )}
              {sessionDate && porcentaje > 0 && <span>•</span>}
              {porcentaje > 0 && (
                <span className={`font-medium ${porcentaje >= 70 ? 'text-green-600' : porcentaje >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {Math.round(porcentaje)}% acierto
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Insights badge */}
          {insights.length > 0 && (
            <span className={`
              text-xs font-medium px-2 py-1 rounded-full
              ${hasDangerInsights ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}
            `}>
              {insights.length} insight{insights.length !== 1 ? 's' : ''}
            </span>
          )}

          {/* Chevron */}
          <ChevronDown
            className={`
              w-5 h-5 text-gray-400 transition-transform duration-300
              ${isExpanded ? 'rotate-180' : ''}
            `}
          />
        </div>
      </button>

      {/* Expandable Content */}
      <div
        id="feedback-content"
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div ref={contentRef} className="px-4 pb-4">
          {/* Stats Grid */}
          {sessionStats.total > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 pt-2 border-t border-gray-100">
              {/* Correctas */}
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-lg sm:text-xl font-bold text-green-700">
                    {correctas}
                  </span>
                </div>
                <p className="text-xs text-green-600 font-medium">
                  Correctas
                </p>
              </div>

              {/* Incorrectas */}
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-lg sm:text-xl font-bold text-red-700">
                    {incorrectas}
                  </span>
                </div>
                <p className="text-xs text-red-600 font-medium">
                  Errores
                </p>
              </div>

              {/* En blanco */}
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <MinusSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-lg sm:text-xl font-bold text-gray-700">
                    {enBlanco}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  En blanco
                </p>
              </div>
            </div>
          )}

          {/* Insights List */}
          {insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Insights detectados
              </h4>
              {insights.map((insight, index) => (
                <InsightCard
                  key={insight.id || index}
                  emoji={insight.emoji || '💡'}
                  titulo={insight.titulo}
                  descripcion={insight.descripcion}
                  severidad={getSeverityFromType(insight.tipo)}
                  accionable={!!insight.mensajeAccion}
                  mensajeAccion={insight.mensajeAccion}
                  onAction={() => handleInsightAction(insight)}
                  totalFalladas={insight.totalFalladas || insight.totalFailed}
                  totalVinculadas={insight.totalVinculadas}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {insights.length === 0 && sessionStats.total > 0 && (
            <div className="text-center py-4 text-gray-500">
              <span className="text-2xl mb-2 block">✨</span>
              <p className="text-sm">
                No hay insights para esta sesión.
                {porcentaje >= 80 && ' ¡Buen trabajo!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
