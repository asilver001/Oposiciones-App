import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { ChevronUp } from 'lucide-react';

/**
 * PhaseNodeCompact - Nodo de fase circular más grande
 */
export function PhaseNodeCompact({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusStyles = {
    completed: { ring: 'ring-emerald-400', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50' },
    'in-progress': { ring: 'ring-purple-400', bg: 'bg-purple-500', glow: 'shadow-purple-500/50' },
    pending: { ring: 'ring-gray-300', bg: 'bg-gray-400', glow: 'shadow-gray-500/30' },
  };

  const status = statusStyles[data.status] || statusStyles.pending;
  const completedTasks = data.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = data.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="w-1 h-1 !bg-gray-400" />

      {/* Main Phase Circle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative cursor-pointer transition-all duration-300
          ${isExpanded ? 'scale-110' : 'hover:scale-105'}
        `}
      >
        {/* Glow effect */}
        <div
          className={`
            absolute inset-0 rounded-full blur-md opacity-50
            ${status.bg}
          `}
          style={{ transform: 'scale(1.3)' }}
        />

        {/* Progress ring */}
        <svg className="w-20 h-20 transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          {/* Progress ring */}
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={data.status === 'completed' ? '#10b981' : (data.color || '#9333ea')}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * 226} 226`}
            className="transition-all duration-500"
          />
        </svg>

        {/* Inner circle with phase info */}
        <div
          className={`
            absolute inset-2 rounded-full flex flex-col items-center justify-center
            ${status.bg} text-white shadow-lg ${status.glow}
          `}
        >
          <span className="text-lg font-bold">{progress}%</span>
          <span className="text-[8px] opacity-75">{data.name?.slice(0, 8)}</span>
        </div>

        {/* Phase number */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center shadow-md">
          F{data.id?.replace(/[^0-9]/g, '') || '?'}
        </div>
      </div>

      {/* Expandable Info Panel */}
      {isExpanded && (
        <div
          className={`
            absolute top-full left-1/2 transform -translate-x-1/2 mt-3
            bg-white rounded-xl shadow-2xl border border-gray-200
            w-72 p-4 z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
        >
          <h3 className="font-bold text-base text-gray-900 mb-1">{data.name}</h3>
          <p className="text-xs text-gray-500 mb-3">{data.description}</p>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progreso</span>
              <span className="font-semibold">{completedTasks}/{totalTasks} tareas</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-bold text-gray-900">{data.estimatedDays || '?'}d</div>
              <div className="text-gray-500">Estimado</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="font-bold text-emerald-600">{completedTasks}</div>
              <div className="text-gray-500">Completadas</div>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-1 h-1 !bg-gray-400" />
    </div>
  );
}
