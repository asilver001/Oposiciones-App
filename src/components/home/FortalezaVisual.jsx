/**
 * FortalezaVisual Component - Oposita Smart
 *
 * Visual progress system showing topic mastery with animated progress bars.
 * Shows topic blocks with name, progress bar, and status indicator.
 */

import { motion } from 'framer-motion';
import { Check, TrendingUp, BookOpen, AlertTriangle, Plus, ChevronRight } from 'lucide-react';

// Animation presets
const spring = {
  smooth: { type: "spring", stiffness: 50, damping: 15 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
};

// Status configuration with colors and icons
const statusConfig = {
  dominado: {
    label: 'Dominado',
    gradient: 'from-emerald-400 to-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: Check,
    priority: 4,
  },
  avanzando: {
    label: 'Avanzando',
    gradient: 'from-purple-400 to-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: TrendingUp,
    priority: 3,
  },
  progreso: {
    label: 'En progreso',
    gradient: 'from-blue-400 to-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: BookOpen,
    priority: 2,
  },
  riesgo: {
    label: 'Repasar',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: AlertTriangle,
    priority: 1,
    pulse: true,
  },
  nuevo: {
    label: 'Nuevo',
    gradient: 'from-gray-300 to-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    icon: Plus,
    priority: 5,
  },
};

/**
 * AnimatedProgressBar - Progress bar with shimmer animation
 */
function AnimatedProgressBar({ value, max = 100, status = 'progreso', size = 'md' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const config = statusConfig[status] || statusConfig.progreso;
  const sizes = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${config.gradient} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={spring.smooth}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-white/25"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '40%' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/**
 * TopicBlock - Single topic with progress bar
 */
function TopicBlock({ topic, onSelect, index = 0 }) {
  const config = statusConfig[topic.status] || statusConfig.nuevo;
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => onSelect?.(topic)}
      className="w-full py-3 border-b border-gray-50 last:border-b-0 text-left"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring.gentle, delay: index * 0.05 }}
      whileHover={{ x: 4, backgroundColor: 'rgba(147, 51, 234, 0.02)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Top row: name and status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <motion.div
            className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
            animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-4 h-4 ${config.text}`} />
          </motion.div>
          <p className="text-sm font-medium text-gray-800 truncate">
            <span className="text-gray-400">T{topic.id}</span> {topic.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.text} whitespace-nowrap`}>
            {topic.progress}%
          </span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </div>

      {/* Progress bar */}
      <AnimatedProgressBar value={topic.progress} status={topic.status} size="md" />
    </motion.button>
  );
}

/**
 * FortalezaVisual - Main component showing topic progress
 *
 * @param {Object} props
 * @param {Array} props.topics - Array of topic objects
 *   - id: number
 *   - name: string
 *   - progress: number (0-100)
 *   - status: 'dominado' | 'avanzando' | 'progreso' | 'riesgo' | 'nuevo'
 *   - questionsTotal: number (optional)
 *   - questionsAnswered: number (optional)
 * @param {Function} props.onTopicSelect - Callback when topic is clicked
 * @param {Function} props.onViewAll - Callback to view all topics
 * @param {number} props.maxVisible - Maximum topics to show (default: 4)
 */
export default function FortalezaVisual({
  topics = [],
  onTopicSelect,
  onViewAll,
  maxVisible = 4
}) {
  // Sort by priority (riesgo first, then by progress)
  const sortedTopics = [...topics].sort((a, b) => {
    const configA = statusConfig[a.status] || statusConfig.nuevo;
    const configB = statusConfig[b.status] || statusConfig.nuevo;
    if (configA.priority !== configB.priority) return configA.priority - configB.priority;
    return b.progress - a.progress;
  });

  const visibleTopics = sortedTopics.slice(0, maxVisible);
  const hasMore = topics.length > maxVisible;

  if (topics.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏰</span>
          <h3 className="font-semibold text-gray-900">Tu Fortaleza</h3>
        </div>
        {onViewAll && (
          <motion.button
            onClick={onViewAll}
            className="text-xs text-purple-600 font-medium flex items-center gap-1"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver todo <ChevronRight className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Topics with animated bars */}
      <div className="px-4 py-2">
        {visibleTopics.map((topic, index) => (
          <TopicBlock
            key={topic.id}
            topic={topic}
            onSelect={onTopicSelect}
            index={index}
          />
        ))}
      </div>

      {/* Show more button */}
      {hasMore && (
        <motion.button
          onClick={onViewAll}
          className="w-full px-4 py-3 text-sm text-purple-600 font-medium hover:bg-purple-50/50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
          whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
          whileTap={{ scale: 0.98 }}
        >
          Ver mas temas <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Legend */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
        {['dominado', 'avanzando', 'riesgo'].map(status => {
          const config = statusConfig[status];
          return (
            <span key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${config.gradient}`} />
              {config.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

// Export status config for external use
export { statusConfig };
