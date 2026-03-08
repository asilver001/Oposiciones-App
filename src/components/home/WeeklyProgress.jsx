/**
 * WeeklyProgress - Progress bar for weekly goal
 *
 * Uses design tokens. Progress bar uses green gradient for visual progress.
 */

import { motion } from 'framer-motion';

export default function WeeklyProgress({
  current = 0,
  goal = 75,
  label = 'Meta semanal',
}) {
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div
      className="pt-6"
      style={{ borderTop: '1px solid var(--border-default)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-secondary">{label}</p>
        <p
          className="text-sm"
          style={{
            fontFamily: 'var(--font-display, inherit)',
            color: 'var(--text-muted)',
          }}
        >
          {current}/{goal}
        </p>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--progress-track, #E8E8E8)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--progress-gradient-start, #2D6A4F), var(--progress-gradient-end, #52B788))`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/**
 * WeeklyProgress variant: With percentage label
 */
export function WeeklyProgressWithLabel({
  current = 0,
  goal = 75,
  label = 'Meta semanal',
}) {
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-primary">{label}</p>
        <p
          className="text-lg font-semibold"
          style={{
            fontFamily: 'var(--font-display, inherit)',
            color: percentage >= 100
              ? 'var(--color-success, #2D6A4F)'
              : 'var(--text-primary)',
          }}
        >
          {percentage}%
        </p>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--progress-track, #E8E8E8)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--progress-gradient-start, #2D6A4F), var(--progress-gradient-end, #52B788))`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-muted mt-2">
        {current} de {goal} preguntas esta semana
      </p>
    </div>
  );
}

/**
 * WeeklyProgress variant: Minimal line (for compact layouts)
 */
export function WeeklyProgressMinimal({
  current = 0,
  goal = 75,
}) {
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--progress-track, #E8E8E8)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, var(--progress-gradient-start, #2D6A4F), var(--progress-gradient-end, #52B788))`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span
        className="text-xs whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-display, inherit)',
          color: 'var(--text-muted)',
        }}
      >
        {current}/{goal}
      </span>
    </div>
  );
}
