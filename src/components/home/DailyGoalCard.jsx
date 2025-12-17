import React from 'react';
import { Clock } from 'lucide-react';

const DailyGoalCard = ({ goal, progress, onContinue }) => {
  const target = goal?.target || 20;
  const completed = progress?.completed || 0;
  const percentage = Math.min(100, Math.round((completed / target) * 100));
  const remainingQuestions = Math.max(0, target - completed);
  const estimatedMinutes = Math.ceil(remainingQuestions * 0.4); // ~24 segundos por pregunta

  const isCompleted = percentage >= 100;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          🎯 META DE HOY
        </h3>
        {isCompleted && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
            ¡Completada!
          </span>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{completed}</span>/{target} preguntas
          </span>
          <span className="text-sm font-semibold text-purple-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Botón y tiempo estimado */}
      <div className="flex items-center gap-3">
        <button
          onClick={onContinue}
          className={`flex-1 py-3.5 px-6 rounded-xl font-semibold transition-all active:scale-[0.98] ${
            isCompleted
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {completed === 0 ? 'Empezar' : isCompleted ? 'Seguir practicando' : 'Continuar'} →
        </button>

        {remainingQuestions > 0 && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm whitespace-nowrap">
            <Clock className="w-4 h-4" />
            <span>~{estimatedMinutes} min</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyGoalCard;
