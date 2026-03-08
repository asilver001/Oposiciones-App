/**
 * FortalezaVisual Component - Oposita Smart
 *
 * Visual progress system showing topic mastery with animated progress bars.
 * Shows topic blocks with name, progress bar, and status indicator.
 */

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Animation presets
const spring = {
  smooth: { type: "spring", stiffness: 50, damping: 15 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
};

// Status configuration — priority only (icons removed)
const statusConfig = {
  dominado: { label: 'Dominado', priority: 4 },
  avanzando: { label: 'Avanzando', priority: 3 },
  progreso: { label: 'En progreso', priority: 2 },
  riesgo: { label: 'Repasar', priority: 1 },
  nuevo: { label: 'Nuevo', priority: 5 },
};

/**
 * AnimatedProgressBar - Green gradient progress bar
 */
function AnimatedProgressBar({ value, max = 100 }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const fillColor = percentage > 60 ? '#2D6A4F' : percentage >= 40 ? '#40916C' : '#52B788';

  return (
    <div className="w-full">
      <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#F3F3F0', borderRadius: 3 }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: fillColor, borderRadius: 3 }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/**
 * TopicBlock - Single topic with progress bar (editorial calm)
 */
function TopicBlock({ topic, onSelect, index = 0 }) {
  const percentColor = topic.progress > 60 ? '#2D6A4F' : topic.progress >= 40 ? '#40916C' : '#52B788';

  return (
    <motion.button
      onClick={() => onSelect?.(topic)}
      className="w-full py-3 border-b border-gray-50 last:border-b-0 text-left"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...spring.gentle, delay: index * 0.05 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Top row: name and percentage */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-800 truncate flex-1 min-w-0">
          <span className="text-gray-400">T{topic.id}</span> {topic.name}
        </p>
        <span className="text-[15px] font-semibold flex-shrink-0" style={{ color: percentColor }}>
          {topic.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <AnimatedProgressBar value={topic.progress} />
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
      className="rounded-[20px] overflow-hidden"
      style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.gentle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-[16px] font-semibold text-gray-900">Tu Fortaleza</h3>
        {onViewAll && (
          <motion.button
            onClick={onViewAll}
            className="text-[13px] font-medium flex items-center gap-1"
            style={{ color: '#B5B5B0' }}
            whileTap={{ scale: 0.95 }}
          >
            Ver todo <ChevronRight className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Topics with animated bars */}
      <div className="px-5 pb-2">
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
          className="w-full px-5 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1"
          style={{ color: '#B5B5B0', borderTop: '1px solid #F3F3F0' }}
          whileTap={{ scale: 0.98 }}
        >
          Ver más temas <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { statusConfig };
