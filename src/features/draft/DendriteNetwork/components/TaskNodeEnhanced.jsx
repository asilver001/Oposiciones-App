import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const priorityStyles = {
  P0: { border: 'border-red-400', bg: 'bg-gradient-to-br from-red-50 to-red-100', badge: 'bg-red-500' },
  P1: { border: 'border-orange-400', bg: 'bg-gradient-to-br from-orange-50 to-orange-100', badge: 'bg-orange-500' },
  P2: { border: 'border-yellow-400', bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', badge: 'bg-yellow-500' },
};

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'in-progress': { icon: Loader2, color: 'text-purple-600', bg: 'bg-purple-50' },
  pending: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50' },
  blocked: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export function TaskNodeEnhanced({ data, selected }) {
  const priority = priorityStyles[data.priority] || priorityStyles.P2;
  const status = statusConfig[data.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative group"
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 opacity-0" />

      <div className={`relative rounded-2xl border-2 ${priority.border} ${priority.bg} shadow-lg hover:shadow-xl transition-all`}>
        {/* Status indicator on top-right */}
        <div className={`absolute -top-2 -right-2 rounded-full p-1.5 ${status.bg} border-2 border-white shadow-md`}>
          <StatusIcon className={`w-4 h-4 ${status.color} ${data.status === 'in-progress' ? 'animate-spin' : ''}`} />
        </div>

        {/* Priority badge on top-left */}
        <div className={`absolute -top-2 -left-2 ${priority.badge} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md`}>
          {data.priority.replace('P', '')}
        </div>

        <div className="p-4 min-w-[160px] max-w-[200px]">
          {/* Task label */}
          <div className="font-semibold text-sm text-gray-900 mb-2 leading-tight pr-4">
            {data.label}
          </div>

          {/* Metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{data.estimatedHours}h</span>
            </div>

            {data.completedAt && (
              <div className="text-xs text-emerald-600 font-medium">
                ✓ {new Date(data.completedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              </div>
            )}

            {data.dependencies && data.dependencies.length > 0 && (
              <div className="text-xs text-gray-500">
                🔗 {data.dependencies.length} dep{data.dependencies.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Pulse animation for in-progress */}
        {data.status === 'in-progress' && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-purple-400"
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 opacity-0" />

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-[200px]">
          <div className="font-semibold mb-1">{data.label}</div>
          <div className="text-gray-300">{data.description}</div>
          <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
            <div>Status: {data.status}</div>
            <div>Priority: {data.priority}</div>
            {data.actualHours && <div>Time: {data.actualHours}h</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
