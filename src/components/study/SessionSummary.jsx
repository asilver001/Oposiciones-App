/**
 * SessionSummary
 *
 * Post-session analysis showing topic breakdown, areas to improve,
 * and overall performance. Used by HybridSession and SimulacroSession.
 */

import { useMemo } from 'react';
import {
  Trophy, AlertTriangle, Target, Clock, BookOpen,
  TrendingUp, ArrowLeft, BarChart3
} from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array} props.answers - Array of { question_id, tema, es_correcta, respuesta_usuario, respuesta_correcta }
 * @param {number} props.totalQuestions - Total questions in session
 * @param {number} [props.timeSpentSeconds] - Time spent in seconds (optional)
 * @param {Function} props.onClose - Called when user wants to go back
 */
export default function SessionSummary({
  answers = [],
  totalQuestions: _totalQuestions = 0,
  timeSpentSeconds = null,
  onClose
}) {
  const analysis = useMemo(() => {
    const correct = answers.filter(a => a.es_correcta).length;
    const incorrect = answers.length - correct;
    const accuracy = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;

    // Group by tema
    const byTema = {};
    for (const a of answers) {
      const tema = a.tema || 'Sin tema';
      if (!byTema[tema]) {
        byTema[tema] = { tema, total: 0, correct: 0, incorrect: 0 };
      }
      byTema[tema].total++;
      if (a.es_correcta) {
        byTema[tema].correct++;
      } else {
        byTema[tema].incorrect++;
      }
    }

    // Sort topics by number of errors (most errors first)
    const topicBreakdown = Object.values(byTema)
      .map(t => ({
        ...t,
        accuracy: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
      }))
      .sort((a, b) => b.incorrect - a.incorrect);

    // Areas to improve: topics with < 70% accuracy and at least 1 error
    const areasToImprove = topicBreakdown.filter(t => t.accuracy < 70 && t.incorrect > 0);

    return { correct, incorrect, accuracy, topicBreakdown, areasToImprove };
  }, [answers]);

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-gray-800 text-lg">Resumen de sesion</h3>
      </div>

      {/* Score overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <p className="text-2xl font-bold text-emerald-600">{analysis.correct}</p>
          <p className="text-xs text-emerald-700">Correctas</p>
        </div>
        <div className="text-center p-3 bg-rose-50 rounded-xl">
          <p className="text-2xl font-bold text-rose-600">{analysis.incorrect}</p>
          <p className="text-xs text-rose-700">Incorrectas</p>
        </div>
        <div className="text-center p-3 bg-brand-50 rounded-xl">
          <p className="text-2xl font-bold text-brand-600">{analysis.accuracy}%</p>
          <p className="text-xs text-brand-700">Precision</p>
        </div>
      </div>

      {/* Time spent */}
      {timeSpentSeconds && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Tiempo: {formatTime(timeSpentSeconds)}</span>
        </div>
      )}

      {/* Topic breakdown */}
      {analysis.topicBreakdown.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Desglose por tema
          </h4>
          <div className="space-y-2">
            {analysis.topicBreakdown.map(topic => (
              <div key={topic.tema} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0">
                  Tema {topic.tema}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      topic.accuracy >= 80 ? 'bg-emerald-500' :
                      topic.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
                <span className={`text-xs font-medium w-14 text-right ${
                  topic.accuracy >= 80 ? 'text-emerald-600' :
                  topic.accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {topic.correct}/{topic.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas to improve */}
      {analysis.areasToImprove.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Areas a mejorar
          </h4>
          <ul className="space-y-1.5">
            {analysis.areasToImprove.map(topic => (
              <li key={topic.tema} className="text-sm text-amber-700">
                Tema {topic.tema}: fallaste {topic.incorrect} de {topic.total} preguntas ({topic.accuracy}% acierto)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Back button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>
      )}
    </div>
  );
}
