import { ChevronRight } from 'lucide-react';

/**
 * Fortaleza Component
 * Shows topic progress visually with dots representing mastery level
 */

// Estado labels and colors
const estadoConfig = {
  nuevo: {
    label: 'Nuevo',
    textColor: 'text-gray-500',
    dotColor: 'bg-purple-500'
  },
  progresando: {
    label: 'Progresando',
    textColor: 'text-purple-600',
    dotColor: 'bg-purple-500'
  },
  solido: {
    label: 'Sólido',
    textColor: 'text-green-600',
    dotColor: 'bg-green-500',
    icon: '✓'
  },
  peligro: {
    label: 'Repasar',
    textColor: 'text-amber-600',
    dotColor: 'bg-amber-500',
    animation: 'animate-pulse'
  },
  critico: {
    label: 'Urgente',
    textColor: 'text-red-600',
    dotColor: 'bg-red-500',
    animation: 'animate-pulse'
  }
};

/**
 * Progress dots component
 */
function ProgressDots({ progreso, estado, maxDots = 6 }) {
  const config = estadoConfig[estado] || estadoConfig.nuevo;
  const filledDots = Math.min(progreso, maxDots);

  return (
    <div className="flex gap-1.5">
      {Array.from({ length: maxDots }).map((_, index) => {
        const isFilled = index < filledDots;
        return (
          <div
            key={index}
            className={`
              w-2.5 h-2.5 rounded-full transition-all
              ${isFilled ? config.dotColor : 'bg-gray-200'}
              ${isFilled && config.animation ? config.animation : ''}
            `}
          />
        );
      })}
    </div>
  );
}

/**
 * Single topic row - vertical layout for full name visibility
 */
function TemaRow({ tema }) {
  const config = estadoConfig[tema.estado] || estadoConfig.nuevo;

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      {/* Top row: Topic name and status */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-medium text-gray-800 leading-tight">
          <span className="text-gray-400 mr-1">T{tema.id}</span>
          {tema.nombre}
        </p>
        <span className={`text-xs font-medium whitespace-nowrap ${config.textColor}`}>
          {config.label} {config.icon || ''}
        </span>
      </div>

      {/* Bottom row: Progress dots */}
      <ProgressDots progreso={tema.progreso} estado={tema.estado} />
    </div>
  );
}

/**
 * Main Fortaleza component
 */
export default function Fortaleza({
  temas = [],
  onVerTodo,
  maxVisible = 3
}) {
  // Filter and sort temas - prioritize peligro/critico, then by progreso
  const sortedTemas = [...temas].sort((a, b) => {
    const priorityOrder = { critico: 0, peligro: 1, progresando: 2, nuevo: 3, solido: 4 };
    const priorityA = priorityOrder[a.estado] ?? 5;
    const priorityB = priorityOrder[b.estado] ?? 5;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return b.progreso - a.progreso;
  });

  const visibleTemas = sortedTemas.slice(0, maxVisible);
  const remainingCount = temas.length - maxVisible;

  if (temas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏰</span>
          <h3 className="font-semibold text-gray-900">Tu Fortaleza</h3>
        </div>
        {onVerTodo && (
          <button
            onClick={onVerTodo}
            className="flex items-center gap-1 text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            Ver todo
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Temas list */}
      <div className="px-4 py-2">
        {visibleTemas.map((tema) => (
          <TemaRow key={tema.id} tema={tema} />
        ))}
      </div>

      {/* Show more indicator */}
      {remainingCount > 0 && (
        <button
          onClick={onVerTodo}
          className="w-full px-4 py-2.5 text-sm text-gray-500 hover:text-purple-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
        >
          +{remainingCount} tema{remainingCount !== 1 ? 's' : ''} más
        </button>
      )}
    </div>
  );
}
