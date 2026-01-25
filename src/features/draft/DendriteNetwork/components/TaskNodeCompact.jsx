import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronUp, Clock, Link } from 'lucide-react';

/**
 * TaskNodeCompact - Nodo circular compacto con info desplegable
 * Color principal basado en STATUS (verde=completado, purple=progreso, gris=pendiente)
 * Badge pequeño muestra prioridad (P0, P1, P2)
 */
export function TaskNodeCompact({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Status-based main colors (primary visual indicator)
  const statusColors = {
    completed: { bg: 'bg-emerald-500', ring: 'ring-emerald-300', glow: 'shadow-emerald-500/40' },
    'in-progress': { bg: 'bg-purple-500', ring: 'ring-purple-300', glow: 'shadow-purple-500/40' },
    pending: { bg: 'bg-gray-400', ring: 'ring-gray-300', glow: 'shadow-gray-500/20' },
    blocked: { bg: 'bg-red-500', ring: 'ring-red-300', glow: 'shadow-red-500/40' },
  };

  // Priority badge colors (small indicator)
  const priorityBadge = {
    P0: { bg: 'bg-red-600', text: 'text-white' },
    P1: { bg: 'bg-orange-500', text: 'text-white' },
    P2: { bg: 'bg-yellow-400', text: 'text-gray-900' },
  };

  const statusIcons = {
    completed: '✓',
    'in-progress': '▶',
    pending: '○',
    blocked: '!',
  };

  const colors = statusColors[data.status] || statusColors.pending;
  const priority = priorityBadge[data.priority] || priorityBadge.P2;
  const icon = statusIcons[data.status] || '○';
  const isActive = data.status === 'in-progress';

  return (
    <div
      className="relative"
      onMouseEnter={() => !isExpanded && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} className="w-1 h-1 !bg-gray-400" />

      {/* Main Circle Node */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative cursor-pointer transition-all duration-300
          ${isExpanded ? 'scale-125 z-10' : 'hover:scale-110'}
        `}
      >
        {/* Pulse animation for in-progress */}
        {isActive && (
          <div
            className={`absolute inset-0 rounded-full ${colors.bg} animate-ping opacity-30`}
            style={{ transform: 'scale(1.3)' }}
          />
        )}

        {/* Main circle - STATUS colored */}
        <div
          className={`
            relative w-10 h-10 rounded-full flex items-center justify-center
            ${colors.bg} text-white font-bold text-sm
            ring-2 ${colors.ring}
            shadow-lg ${colors.glow} hover:shadow-xl transition-all
          `}
        >
          <span className="text-sm">{icon}</span>
        </div>

        {/* Priority badge (small, top-right) */}
        <div
          className={`
            absolute -top-1 -right-1 w-4 h-4 rounded-full
            ${priority.bg} ${priority.text}
            text-[8px] font-bold flex items-center justify-center
            shadow-md border border-white/50
          `}
        >
          {data.priority?.slice(1) || '?'}
        </div>
      </div>

      {/* Hover Tooltip - Quick preview without click */}
      {showTooltip && !isExpanded && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-[180px]">
            <p className="font-semibold truncate">{data.label}</p>
            <div className="flex items-center gap-2 mt-1 text-[10px] opacity-75">
              <span>{data.priority}</span>
              <span>•</span>
              <span>{data.estimatedHours}h</span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Expandable Info Panel */}
      {isExpanded && (
        <div
          className={`
            absolute top-full left-1/2 transform -translate-x-1/2 mt-3
            bg-white rounded-xl shadow-2xl border border-gray-200
            w-56 p-3 z-50
          `}
        >
          {/* Status badge + Title */}
          <div className="flex items-start gap-2 mb-2">
            <span className={`
              shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold
              ${colors.bg} text-white
            `}>
              {data.status === 'completed' ? 'Hecho' :
               data.status === 'in-progress' ? 'En curso' :
               data.status === 'blocked' ? 'Bloqueado' : 'Pendiente'}
            </span>
            <span className={`
              px-1.5 py-0.5 rounded text-[9px] font-bold
              ${priority.bg} ${priority.text}
            `}>
              {data.priority}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-sm text-gray-900 mb-1 leading-tight">
            {data.label}
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {data.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{data.estimatedHours}h est.</span>
            </div>
            {data.dependencies?.length > 0 && (
              <div className="flex items-center gap-1">
                <Link className="w-3 h-3" />
                <span>{data.dependencies.length}</span>
              </div>
            )}
          </div>

          {/* Completion info */}
          {data.completedAt && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-emerald-600 font-medium">
              ✓ {new Date(data.completedAt).toLocaleDateString('es-ES')}
              {data.actualHours && ` • ${data.actualHours}h real`}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-1 h-1 !bg-gray-400" />
    </div>
  );
}
