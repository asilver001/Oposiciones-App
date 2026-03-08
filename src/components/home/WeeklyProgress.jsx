/**
 * WeeklyProgress - Progress bar for weekly goal
 *
 * Uses design tokens. Progress bar color uses accent color.
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
          className="text-sm text-muted"
          style={{ fontFamily: 'var(--font-display, inherit)' }}
        >
          {current}/{goal}
        </p>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-tertiary)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--color-brand-600, var(--color-success))' }}
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
            color: percentage >= 100 ? 'var(--color-success)' : 'var(--text-primary)',
          }}
        >
          {percentage}%
        </p>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-tertiary)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: percentage >= 100
              ? 'var(--color-success)'
              : 'var(--color-brand-600)',
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
 * WeeklyProgress variant: Minimal line
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
        style={{ backgroundColor: 'var(--border-default)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: 'var(--color-brand-600)' }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span
        className="text-xs text-muted whitespace-nowrap"
        style={{ fontFamily: 'var(--font-display, inherit)' }}
      >
        {current}/{goal}
      </span>
    </div>
  );
}
