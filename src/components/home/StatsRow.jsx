/**
 * StatsRow - Simple stats display
 *
 * Uses design tokens. Numbers use display font, labels use body font.
 */

import { motion } from 'framer-motion';

export default function StatsRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <p
            className="stat-value mb-1"
            style={{ fontFamily: 'var(--font-display, inherit)' }}
          >
            {stat.value}
            {stat.suffix && <span className="text-muted">{stat.suffix}</span>}
          </p>
          <p className="stat-label">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * StatsRow variant: Horizontal row with separators
 */
export function StatsRowHorizontal({ stats = [] }) {
  return (
    <div className="flex items-center justify-around py-6">
      {stats.map((stat, index) => (
        <div key={stat.label} className="text-center">
          <p
            className="text-2xl font-semibold text-primary"
            style={{ fontFamily: 'var(--font-display, inherit)' }}
          >
            {stat.value}
          </p>
          <p className="text-xs text-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * StatsRow variant: Left-aligned (for serious/tool style)
 */
export function StatsRowLeftAligned({ stats = [] }) {
  return (
    <div className="space-y-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="flex items-baseline gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span
            className="text-2xl font-light text-primary"
            style={{ fontFamily: 'var(--font-display, inherit)' }}
          >
            {stat.value}
          </span>
          <span className="text-sm text-muted">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
