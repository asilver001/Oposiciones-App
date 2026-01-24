import { Handle, Position } from 'reactflow';

export function PhaseNode({ data }) {
  const statusColors = {
    completed: 'bg-emerald-500',
    'in-progress': 'bg-purple-500',
    pending: 'bg-gray-400',
    blocked: 'bg-red-500'
  };

  const statusBorders = {
    completed: 'ring-4 ring-emerald-300/50',
    'in-progress': 'ring-4 ring-purple-300/50 animate-pulse',
    pending: 'ring-2 ring-gray-300/30',
    blocked: 'ring-4 ring-red-300/50'
  };

  return (
    <div
      className={`rounded-2xl ${statusColors[data.status]} ${statusBorders[data.status]} p-6 shadow-xl min-w-[280px] text-white transition-all hover:scale-105`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white" />

      <div className="text-xs font-bold mb-2 opacity-90 uppercase tracking-wide">
        {data.name}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-4xl font-bold">{data.progress}%</div>
        <div className="text-sm opacity-75 capitalize">{data.status.replace('-', ' ')}</div>
      </div>

      <div className="space-y-1 text-xs opacity-90">
        <div className="flex justify-between">
          <span>Estimado:</span>
          <span className="font-semibold">{data.estimatedHours}h</span>
        </div>

        {data.actualHours && (
          <div className="flex justify-between">
            <span>Real:</span>
            <span className="font-semibold">{data.actualHours}h</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Duración:</span>
          <span className="font-semibold">{data.duration}</span>
        </div>

        <div className="flex justify-between pt-1 border-t border-white/20">
          <span>Tareas:</span>
          <span className="font-semibold">{data.tasks.length}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white" />
    </div>
  );
}
