import { ChevronRight } from 'lucide-react';

/**
 * InsightCard - Displays a single insight with contextual styling
 */

const severityStyles = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    titleColor: 'text-amber-800',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700'
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700'
  }
};

export default function InsightCard({
  emoji = '💡',
  titulo,
  descripcion,
  severidad = 'info',
  accionable = false,
  mensajeAccion,
  onAction,
  totalFalladas,
  totalVinculadas
}) {
  const styles = severityStyles[severidad] || severityStyles.info;

  const handleActionClick = () => {
    if (accionable && onAction) {
      onAction();
    }
  };

  return (
    <div
      className={`
        rounded-xl p-4 border-2 transition-all
        ${styles.bg} ${styles.border}
        ${accionable ? 'hover:shadow-md cursor-pointer' : ''}
      `}
      onClick={accionable ? handleActionClick : undefined}
    >
      {/* Header with emoji and title */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
          {emoji}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${styles.titleColor} text-base leading-tight`}>
            {titulo}
          </h4>
        </div>
      </div>

      {/* Description */}
      {descripcion && (
        <p className={`text-sm ${styles.textColor} ml-9 mb-3 leading-relaxed`}>
          {descripcion}
        </p>
      )}

      {/* Stats badge - failed questions count */}
      {totalFalladas != null && (
        <div className="ml-9 mb-3">
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${styles.badgeBg} ${styles.badgeText}`}>
            Fallaste {totalFalladas}
            {totalVinculadas != null && ` de ${totalVinculadas}`}
            {' '}pregunta{totalFalladas !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Action link */}
      {accionable && mensajeAccion && (
        <div className="ml-9 pt-2 border-t border-gray-200/50">
          <button
            onClick={handleActionClick}
            className={`
              flex items-center gap-1 text-sm font-medium
              ${styles.titleColor} hover:underline
              transition-colors
            `}
          >
            {mensajeAccion}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
