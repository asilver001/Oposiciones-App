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

// Status configuration — Phase 3: uniform gray, no color coding
const statusConfig = {
  dominado: {
    label: 'Dominado',
    solid: 'bg-gray-900',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: Check,
    priority: 4,
  },
  avanzando: {
    label: 'Avanzando',
    solid: 'bg-gray-900',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: TrendingUp,
    priority: 3,
  },
  progreso: {
    label: 'En progreso',
    solid: 'bg-gray-900',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: BookOpen,
    priority: 2,
  },
  riesgo: {
    label: 'Repasar',
    solid: 'bg-gray-900',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: AlertTriangle,
    priority: 1,
  },
  nuevo: {
    label: 'Nuevo',
    solid: 'bg-gray-200',
    bg: 'bg-gray-100',
    text: 'text-gray-500',
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
          className={`h-full ${config.solid} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
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
      whileTap={{ scale: 0.99 }}
    >
      {/* Top row: name and status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${config.text}`} />
          </div>
          <p className="text-sm font-medium text-gray-800 truncate">
            <span className="text-gray-400">T{topic.id}</span> {topic.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
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
            className="text-xs text-gray-500 font-medium flex items-center gap-1"
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
          className="w-full px-4 py-3 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-1"
          whileTap={{ scale: 0.98 }}
        >
          Ver mas temas <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {/* Legend */}
      <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-2 justify-center">
        {['dominado', 'avanzando', 'riesgo', 'nuevo'].map(status => {
          const config = statusConfig[status];
          return (
            <span key={status} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {config.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { statusConfig };
