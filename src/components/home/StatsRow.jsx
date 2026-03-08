/**
 * StatsRow - Simple stats display
 *
 * Uses design tokens. Numbers use display font, labels use body font.
 * "Días activos" instead of "Racha" (wellness philosophy).
 */

import { motion } from 'framer-motion';

/**
 * Default stats data with "Días activos" instead of "Racha"
 * (wellness philosophy: celebrate active days, don't penalize misses)
 */
export const defaultStats = [
  { key: 'questions', value: 247, label: 'Preguntas' },
  { key: 'precision', value: '82%', label: 'Precisión', highlight: true },
  { key: 'activeDays', value: 15, label: 'Días activos' },
  { key: 'hours', value: 4, label: 'Horas' },
];

/**
 * StatsRow - 2x2 grid without dividers
 *
 * Gray card background, no internal lines.
 * Precision stat highlighted in brand green.
 */
export default function StatsRow({ stats = defaultStats }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 rounded-xl p-4"
      style={{
        backgroundColor: 'var(--surface-secondary, #f9fafb)',
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.key || stat.label}
          className="flex flex-col items-center justify-center text-center py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <p
            style={{
              fontSize: 'var(--stat-value-size, 1.75rem)',
              fontWeight: 700,
              fontFamily: 'var(--font-display, inherit)',
              color: stat.highlight
                ? 'var(--stat-highlight-color, #2D6A4F)'
                : 'var(--text-primary, #1A1A1A)',
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              fontSize: 'var(--stat-label-size, 0.75rem)',
              fontWeight: 'var(--stat-label-weight, 500)',
              color: 'var(--stat-label-color, #9CA3AF)',
              letterSpacing: 'var(--stat-label-spacing, 0.02em)',
              marginTop: 'var(--stat-gap, 0.25rem)',
            }}
          >
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * StatsRowHorizontal - Horizontal row layout
 */
export function StatsRowHorizontal({ stats = defaultStats }) {
  return (
    <div className="flex items-center justify-around py-6">
      {stats.map((stat) => (
        <div key={stat.key || stat.label} className="text-center">
          <p
            className="text-2xl font-semibold"
            style={{
              fontFamily: 'var(--font-display, inherit)',
              color: stat.highlight
                ? 'var(--stat-highlight-color, #2D6A4F)'
                : 'var(--text-primary)',
            }}
          >
            {stat.value}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * StatsRowLeftAligned - Left-aligned (for serious/tool style)
 */
export function StatsRowLeftAligned({ stats = defaultStats }) {
  return (
    <div className="space-y-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.key || stat.label}
          className="flex items-baseline gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span
            className="text-2xl font-light"
            style={{
              fontFamily: 'var(--font-display, inherit)',
              color: stat.highlight
                ? 'var(--stat-highlight-color, #2D6A4F)'
                : 'var(--text-primary)',
            }}
          >
            {stat.value}
          </span>
          <span
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
