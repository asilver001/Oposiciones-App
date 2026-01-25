import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const phaseIcons = {
  'phase-0': '🔐',
  'phase-1': '🏗️',
  'phase-2': '🎨',
  'phase-3': '⚙️',
  'phase-4': '🧪',
  'phase-5': '🚀',
};

const statusColors = {
  completed: {
    bg: 'from-emerald-400 to-emerald-600',
    ring: 'ring-emerald-400',
    glow: 'shadow-emerald-500/50',
  },
  'in-progress': {
    bg: 'from-purple-400 to-purple-600',
    ring: 'ring-purple-400',
    glow: 'shadow-purple-500/50',
  },
  pending: {
    bg: 'from-gray-400 to-gray-600',
    ring: 'ring-gray-400',
    glow: 'shadow-gray-500/30',
  },
  blocked: {
    bg: 'from-red-400 to-red-600',
    ring: 'ring-red-400',
    glow: 'shadow-red-500/50',
  },
};

export function PhaseNodeEnhanced({ data }) {
  const colors = statusColors[data.status] || statusColors.pending;
  const icon = phaseIcons[data.id] || '📦';
  const progress = data.progress || 0;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 opacity-0" />

      <div className={`relative rounded-3xl bg-gradient-to-br ${colors.bg} p-1 ${colors.glow} shadow-2xl`}>
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="3"
            strokeDasharray={`${progress * 3} ${300}`}
            initial={{ strokeDasharray: "0 300" }}
            animate={{ strokeDasharray: `${progress * 3} ${300}` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[220px]">
          {/* Icon and status indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-4xl">{icon}</span>
            {data.status === 'in-progress' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            )}
            {data.status === 'completed' && (
              <CheckCircle className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Phase name */}
          <div className="text-white font-bold text-sm mb-2 leading-tight">
            {data.name.replace('Fase ', '')}
          </div>

          {/* Progress */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-white">{progress}%</span>
          </div>

          {/* Hours */}
          <div className="text-white/80 text-xs space-y-1">
            <div>⏱️ {data.estimatedHours}h estimadas</div>
            {data.actualHours && (
              <div>✓ {data.actualHours}h reales</div>
            )}
          </div>

          {/* Task count badge */}
          <div className="absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg">
            {data.tasks?.length || 0}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 opacity-0" />
    </motion.div>
  );
}
