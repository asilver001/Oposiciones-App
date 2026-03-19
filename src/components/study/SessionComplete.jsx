import React, { useState } from 'react';
import {
  Target,
  Flame,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Loader2,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';
import InsightCard from '../InsightCard';
import SessionSummary from './SessionSummary';
import CorrectionView from './CorrectionView';

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
  answersHistory = [],
  triggeredInsights = [],
  insightsLoading = false,
  nextActivity = null,
  onNextActivity,
  onNewSession,
  onClose
}) {
  const [showCorrection, setShowCorrection] = useState(false);

  const accuracy = sessionStats.answered > 0
    ? Math.round((sessionStats.correct / sessionStats.answered) * 100)
    : 0;

  // Show correction view
  if (showCorrection) {
    return (
      <CorrectionView
        answersHistory={answersHistory}
        onBack={() => setShowCorrection(false)}
      />
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-950 flex items-center justify-center p-4" style={{ background: '#F3F3F0' }}>
      <div className="text-center max-w-sm w-full">
        {/* Trophy */}
        <div className="relative mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
            style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          {accuracy >= 80 && (
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: '#52B788' }}>
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
            <RotateCcw className="w-6 h-6 mx-auto mb-1" style={{ color: '#2D6A4F' }} />
            <p className="text-2xl font-bold text-gray-800">{sessionStats.reviews}</p>
            <p className="text-xs text-gray-500">Repasos</p>
          </div>
        </div>

        {/* Accuracy bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Precisión</span>
            <span className="font-bold" style={{ color: '#2D6A4F' }}>{accuracy}%</span>
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

        {/* Session Summary - Topic Analysis */}
        {answersHistory.length > 0 && (
          <div className="mb-6 text-left">
            <SessionSummary
              answers={answersHistory}
              totalQuestions={sessionStats.total || sessionStats.answered}
            />
          </div>
        )}

        {/* Next Step Recommendation */}
        {nextActivity && onNextActivity && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Siguiente paso recomendado</p>
            <button
              onClick={() => onNextActivity(nextActivity)}
              className="w-full bg-white rounded-xl p-3.5 text-left transition-colors"
              style={{ border: '1px solid rgba(82,183,136,0.3)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45,106,79,0.10)' }}>
                  <Target className="w-5 h-5" style={{ color: '#2D6A4F' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{nextActivity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{nextActivity.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#52B788' }} />
              </div>
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          {/* Correction button — primary CTA to review answers */}
          {answersHistory.length > 0 && (
            <button
              onClick={() => setShowCorrection(true)}
              className="w-full py-3 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(145deg, #1B4332 0%, #2D6A4F 60%, #3A7D5C 100%)' }}
            >
              <ClipboardCheck className="w-5 h-5" />
              Corregir
            </button>
          )}
          <button
            onClick={onNewSession}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ background: 'rgba(45,106,79,0.10)', color: '#2D6A4F' }}
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
