/**
 * FortressPreview - Topic progress preview for home page
 *
 * Uses design tokens. Shows top topics with progress indicators.
 */

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function FortressPreview({
  topics = [],
  onTopicClick,
  onViewAll,
  maxVisible = 3,
}) {
  const visibleTopics = topics.slice(0, maxVisible);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-primary">Tus temas</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-muted hover:text-secondary transition-colors"
          >
            Ver todos
          </button>
        )}
      </div>

      <div className="space-y-1">
        {visibleTopics.map((topic) => (
          <motion.button
            key={topic.id}
            onClick={() => onTopicClick?.(topic)}
            className="w-full flex items-center justify-between py-4 px-1 hover:bg-surface-secondary rounded-lg transition-colors text-left"
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface-tertiary)' }}
              >
                <BookOpen className="w-4 h-4 text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{topic.name}</p>
                <p
                  className="text-xs text-muted"
                  style={{ fontFamily: 'var(--font-display, inherit)' }}
                >
                  {topic.progress}% completado
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/**
 * FortressPreview variant: With linear progress bars
 */
export function FortressPreviewLinear({
  topics = [],
  onTopicClick,
  onViewAll,
  maxVisible = 3,
}) {
  const visibleTopics = topics.slice(0, maxVisible);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-primary">Tus temas</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-muted hover:text-secondary transition-colors"
          >
            Ver todos
          </button>
        )}
      </div>

      <div
        className="space-y-0"
        style={{ borderTop: '1px solid var(--border-default)' }}
      >
        {visibleTopics.map((topic, index) => (
          <motion.button
            key={topic.id}
            onClick={() => onTopicClick?.(topic)}
            className="w-full py-4 text-left"
            style={{
              borderBottom: index < visibleTopics.length - 1
                ? '1px solid var(--border-light)'
                : 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-primary">{topic.name}</p>
              <span
                className="text-xs text-muted"
                style={{ fontFamily: 'var(--font-display, inherit)' }}
              >
                {topic.progress}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--border-default)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--color-brand-600)' }}
                initial={{ width: 0 }}
                animate={{ width: `${topic.progress}%` }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/**
 * FortressPreview variant: With circular progress
 */
export function FortressPreviewCircular({
  topics = [],
  onTopicClick,
  onViewAll,
  maxVisible = 4,
}) {
  const visibleTopics = topics.slice(0, maxVisible);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-primary">Tus temas</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-muted hover:text-secondary transition-colors"
          >
            Ver todos
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {visibleTopics.map((topic, index) => {
          const circumference = 2 * Math.PI * 28;
          const offset = circumference - (topic.progress / 100) * circumference;

          return (
            <motion.button
              key={topic.id}
              onClick={() => onTopicClick?.(topic)}
              className="card flex flex-col items-center py-5 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative w-16 h-16 mb-3">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--border-default)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--color-brand-600)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
                  style={{ fontFamily: 'var(--font-display, inherit)' }}
                >
                  {topic.progress}%
                </span>
              </div>
              <p className="text-xs font-medium text-primary line-clamp-2">
                {topic.name}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
