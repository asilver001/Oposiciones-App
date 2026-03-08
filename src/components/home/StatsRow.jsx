/**
 * StatsRow - Stats display with multiple layout variants
 *
 * Variants:
 * - grid: 2x2 grid with dividers (default)
 * - row: Horizontal row with dot separators
 * - integrated: Compact stats for embedding in other cards
 *
 * Uses design tokens from ThemeContext.
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
 * StatsGrid (OPCIÓN A) - 2x2 grid with dividers
 *
 * Card with subtle border, vertical and horizontal dividers.
 * Precision stat highlighted in brand green.
 */
export default function StatsRow({ stats = defaultStats, variant = 'grid' }) {
  // Route to correct variant
  if (variant === 'row') return <StatsRowCompact stats={stats} />;
  if (variant === 'integrated') return <StatsRowIntegrated stats={stats} />;

  return (
    <div
      className="grid grid-cols-2 rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--stat-divider-color, #F0F0F0)',
      }}
    >
      {stats.map((stat, index) => {
        const isRight = index % 2 === 1;
        const isBottom = index >= 2;

        return (
          <motion.div
            key={stat.key || stat.label}
            className="flex flex-col items-center justify-center text-center"
            style={{
              padding: 'var(--stat-cell-padding, 1.25rem)',
              borderLeft: isRight ? '1px solid var(--stat-divider-color, #F0F0F0)' : 'none',
              borderTop: isBottom ? '1px solid var(--stat-divider-color, #F0F0F0)' : 'none',
            }}
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
        );
      })}
    </div>
  );
}

/**
 * StatsRowCompact (OPCIÓN B) - Horizontal row with dot separators
 *
 * No card background, just text. Compact and minimal.
 */
export function StatsRowCompact({ stats = defaultStats }) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {stats.map((stat, index) => (
        <div key={stat.key || stat.label} className="flex items-center">
          {/* Dot separator (except first item) */}
          {index > 0 && (
            <span
              className="mx-3"
              style={{ color: 'var(--text-muted, #9CA3AF)' }}
            >
              ·
            </span>
          )}

          {/* Stat */}
          <div className="text-center">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display, inherit)',
                color: stat.highlight
                  ? 'var(--stat-highlight-color, #2D6A4F)'
                  : 'var(--text-primary, #1A1A1A)',
              }}
            >
              {stat.value}
            </span>
            <span
              className="ml-1"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--stat-label-color, #9CA3AF)',
                letterSpacing: '0.02em',
              }}
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * StatsRowIntegrated (OPCIÓN C) - Compact inline stats
 *
 * For embedding inside session cards. Shows only 2 key stats.
 */
export function StatsRowIntegrated({ stats = defaultStats }) {
  // Only show precision and active days for integrated view
  const keyStats = stats.filter(s =>
    s.key === 'precision' || s.key === 'activeDays' ||
    s.label === 'Precisión' || s.label === 'Días activos'
  ).slice(0, 2);

  return (
    <div className="flex items-center gap-4">
      {keyStats.map((stat, index) => (
        <div
          key={stat.key || stat.label}
          className="flex items-center gap-1.5"
        >
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display, inherit)',
              color: stat.highlight
                ? 'var(--stat-highlight-color, #2D6A4F)'
                : 'var(--text-inverse, #ffffff)',
            }}
          >
            {stat.value}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-inverse, #ffffff)',
              opacity: 0.7,
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * StatsRowSecondary - For remaining stats when using integrated layout
 *
 * Shows less important stats in a simple row below the session card.
 */
export function StatsRowSecondary({ stats = defaultStats }) {
  // Show questions and hours (the non-key stats)
  const secondaryStats = stats.filter(s =>
    s.key === 'questions' || s.key === 'hours' ||
    s.label === 'Preguntas' || s.label === 'Horas'
  );

  if (secondaryStats.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 py-2">
      {secondaryStats.map((stat) => (
        <div
          key={stat.key || stat.label}
          className="flex items-baseline gap-1"
        >
          <span
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display, inherit)',
              color: 'var(--text-primary, #1A1A1A)',
            }}
          >
            {stat.value}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted, #9CA3AF)',
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// Legacy exports for backwards compatibility
export { StatsRowCompact as StatsRowHorizontal };
export { StatsRowCompact as StatsRowLeftAligned };
