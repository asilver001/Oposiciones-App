import { Handle, Position } from 'reactflow';

export function TaskNode({ data }) {
  const priorityColors = {
    P0: 'border-red-500 bg-red-50 text-red-900',
    P1: 'border-orange-500 bg-orange-50 text-orange-900',
    P2: 'border-yellow-500 bg-yellow-50 text-yellow-900'
  };

  const priorityBadges = {
    P0: 'bg-red-500 text-white',
    P1: 'bg-orange-500 text-white',
    P2: 'bg-yellow-500 text-white'
  };

  const statusIcons = {
    completed: '✅',
    'in-progress': '🔄',
    pending: '⏳',
    blocked: '🔴'
  };

  const statusLabels = {
    completed: 'Completado',
    'in-progress': 'En progreso',
    pending: 'Pendiente',
    blocked: 'Bloqueado'
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 ${priorityColors[data.priority]} p-4 min-w-[220px] max-w-[280px] shadow-md hover:shadow-xl transition-all hover:scale-105`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{statusIcons[data.status]}</span>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-2 leading-tight">
            {data.label}
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`${priorityBadges[data.priority]} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {data.priority}
            </span>
            <span className="text-xs text-gray-500">
              {data.estimatedHours}h
            </span>
          </div>

          <div className="text-[11px] text-gray-600 mb-2 line-clamp-2">
            {data.description}
          </div>

          <div className="text-[10px] text-gray-500 capitalize">
            {statusLabels[data.status]}
          </div>

          {data.completedAt && (
            <div className="text-[10px] text-emerald-600 font-medium mt-1">
              ✓ {new Date(data.completedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              })}
              {data.actualHours && ` • ${data.actualHours}h`}
            </div>
          )}

          {data.dependencies && data.dependencies.length > 0 && (
            <div className="text-[10px] text-gray-400 mt-1">
              Deps: {data.dependencies.length}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}
