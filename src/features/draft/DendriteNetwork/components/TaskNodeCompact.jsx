import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronDown, ChevronUp, Clock, Link } from 'lucide-react';

/**
 * TaskNodeCompact - Nodo circular compacto con info desplegable
 * Diseñado para visualizar conexiones más claramente
 */
export function TaskNodeCompact({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityColors = {
    P0: { bg: 'bg-red-500', ring: 'ring-red-300', text: 'text-white' },
    P1: { bg: 'bg-orange-500', ring: 'ring-orange-300', text: 'text-white' },
    P2: { bg: 'bg-yellow-500', ring: 'ring-yellow-300', text: 'text-gray-900' },
  };

  const statusStyles = {
    completed: { overlay: 'bg-emerald-500', icon: '✓', pulse: false },
    'in-progress': { overlay: 'bg-purple-500', icon: '▶', pulse: true },
    pending: { overlay: 'bg-gray-400', icon: '○', pulse: false },
    blocked: { overlay: 'bg-red-600', icon: '!', pulse: true },
  };

  const colors = priorityColors[data.priority] || priorityColors.P2;
  const status = statusStyles[data.status] || statusStyles.pending;
  const taskNumber = data.id?.replace(/[^0-9]/g, '') || '?';

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-1 h-1 !bg-gray-400" />

      {/* Main Circle Node */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative cursor-pointer transition-all duration-300
          ${isExpanded ? 'scale-110' : 'hover:scale-105'}
        `}
      >
        {/* Outer ring for status */}
        <div
          className={`
            absolute inset-0 rounded-full
            ${status.pulse ? 'animate-ping opacity-30' : ''}
            ${status.overlay}
          `}
          style={{ transform: 'scale(1.2)' }}
        />

        {/* Main circle */}
        <div
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center
            ${colors.bg} ${colors.text} font-bold text-sm
            ring-4 ${colors.ring}
            shadow-lg hover:shadow-xl transition-shadow
          `}
        >
          {/* Priority badge */}
          <span className="text-xs font-bold">{data.priority}</span>

          {/* Status indicator */}
          <div
            className={`
              absolute -bottom-1 -right-1 w-5 h-5 rounded-full
              ${status.overlay} flex items-center justify-center
              text-white text-[10px] font-bold shadow-md
            `}
          >
            {status.icon}
          </div>
        </div>

        {/* Task number badge */}
        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gray-800 text-white text-[9px] font-bold flex items-center justify-center shadow">
          {taskNumber.slice(-2)}
        </div>
      </div>

      {/* Expandable Info Panel */}
      {isExpanded && (
        <div
          className={`
            absolute top-full left-1/2 transform -translate-x-1/2 mt-2
            bg-white rounded-xl shadow-2xl border border-gray-200
            w-64 p-3 z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
        >
          {/* Title */}
          <h4 className="font-semibold text-sm text-gray-900 mb-2 leading-tight">
            {data.label}
          </h4>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-3">
            {data.description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{data.estimatedHours}h</span>
            </div>
            {data.dependencies?.length > 0 && (
              <div className="flex items-center gap-1">
                <Link className="w-3 h-3" />
                <span>{data.dependencies.length} deps</span>
              </div>
            )}
          </div>

          {/* Completion info */}
          {data.completedAt && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-emerald-600">
              ✓ Completado: {new Date(data.completedAt).toLocaleDateString('es-ES')}
              {data.actualHours && ` • ${data.actualHours}h`}
            </div>
          )}

          {/* Close hint */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-1 h-1 !bg-gray-400" />
    </div>
  );
}
