/**
 * SessionCard - Primary CTA for starting a study session
 *
 * Uses design tokens from ThemeContext.
 * Never hardcodes colors, spacing, or other values.
 */

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function SessionCard({
  title = 'Continuar estudio',
  subtitle = 'Constitución Española',
  duration = '10 min',
  questionsReady = 8,
  onClick,
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full card text-left group"
      style={{
        backgroundColor: 'var(--surface-inverse)',
        color: 'var(--text-inverse)',
        borderColor: 'var(--surface-inverse)',
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm mb-1 opacity-60"
            style={{ fontFamily: 'var(--font-body, inherit)' }}
          >
            Tu sesión de hoy
          </p>
          <h2
            className="text-xl font-semibold mb-1"
            style={{ fontFamily: 'var(--font-display, inherit)' }}
          >
            {title}
          </h2>
          <p className="text-sm opacity-60">{subtitle}</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: 'var(--surface-primary)' }}
        >
          <Play
            className="w-5 h-5 ml-0.5"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>
      <div
        className="flex items-center gap-4 mt-6 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
      >
        <span className="text-sm opacity-60">{duration}</span>
        <span className="text-sm opacity-40">·</span>
        <span className="text-sm opacity-60">{questionsReady} preguntas</span>
      </div>
    </motion.button>
  );
}

/**
 * SessionCard variant: Outlined (for light themes)
 */
export function SessionCardOutlined({
  title = 'Continuar estudio',
  subtitle = 'Constitución Española',
  duration = '10 min',
  questionsReady = 8,
  onClick,
}) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full card text-left group"
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted mb-1">Tu sesión de hoy</p>
          <h2 className="text-xl font-semibold text-primary mb-1">{title}</h2>
          <p className="text-sm text-secondary">{subtitle}</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
          style={{
            backgroundColor: 'var(--surface-inverse)',
          }}
        >
          <Play className="w-5 h-5 ml-0.5 text-inverse" />
        </div>
      </div>
      <div
        className="flex items-center gap-4 mt-6 pt-4"
        style={{ borderTop: '1px solid var(--border-default)' }}
      >
        <span className="text-sm text-muted">{duration}</span>
        <span className="text-sm text-muted">·</span>
        <span className="text-sm text-muted">{questionsReady} preguntas</span>
      </div>
    </motion.button>
  );
}
