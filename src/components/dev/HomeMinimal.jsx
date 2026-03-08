/**
 * HomeMinimal — "Calm & Clear"
 *
 * Minimalist home inspired by award-winning apps (Notion, Headspace).
 * Philosophy: Maximum whitespace, clear hierarchy, one primary action.
 * Design tokens are defined at top for easy theming.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight, BookOpen } from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────
// Change these to update the entire design system
const tokens = {
  // Spacing scale (rem)
  space: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  // Typography
  text: {
    xs: 'text-xs',           // 12px
    sm: 'text-sm',           // 14px
    base: 'text-base',       // 16px
    lg: 'text-lg',           // 18px
    xl: 'text-xl',           // 20px
    '2xl': 'text-2xl',       // 24px
    '4xl': 'text-4xl',       // 36px
  },
  // Colors (semantic)
  colors: {
    primary: 'text-gray-900',
    secondary: 'text-gray-500',
    muted: 'text-gray-400',
    accent: 'text-brand-600',
    surface: 'bg-white',
    surfaceAlt: 'bg-gray-50',
    border: 'border-gray-100',
  },
  // Radius
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
};

// ─── Demo data ────────────────────────────────────────────
const demoStats = {
  streak: 7,
  accuracy: 78,
  todayQuestions: 12,
  weeklyGoal: 75,
  weeklyProgress: 45,
};

const demoSession = {
  title: 'Continuar estudio',
  subtitle: 'Constitución Española',
  duration: '10 min',
  questionsReady: 8,
};

const demoTopics = [
  { id: 1, name: 'Constitución Española', progress: 72, status: 'avanzando' },
  { id: 3, name: 'Organización AGE', progress: 35, status: 'riesgo' },
  { id: 9, name: 'Personal funcionario', progress: 91, status: 'dominado' },
];

// ─── Main Component ───────────────────────────────────────
export default function HomeMinimal() {
  const [showAllTopics, setShowAllTopics] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Generous top padding for breathing room */}
      <div className="px-6 pt-8 pb-6">

        {/* Greeting - Simple, warm */}
        <header className="mb-12">
          <p className="text-sm text-gray-400 mb-1">Domingo</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Hola, Alberto
          </h1>
        </header>

        {/* Primary CTA - The ONE thing to do */}
        <section className="mb-12">
          <motion.button
            className="w-full bg-gray-900 text-white rounded-2xl p-6 text-left"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">Tu sesión de hoy</p>
                <h2 className="text-xl font-semibold mb-1">{demoSession.title}</h2>
                <p className="text-gray-400 text-sm">{demoSession.subtitle}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-gray-900 ml-0.5" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-800">
              <span className="text-sm text-gray-400">{demoSession.duration}</span>
              <span className="text-sm text-gray-400">·</span>
              <span className="text-sm text-gray-400">{demoSession.questionsReady} preguntas</span>
            </div>
          </motion.button>
        </section>

        {/* Stats - Minimal, just the essentials */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="py-4">
              <p className="text-4xl font-light text-gray-900 mb-1">{demoStats.streak}</p>
              <p className="text-sm text-gray-400">días de racha</p>
            </div>
            <div className="py-4">
              <p className="text-4xl font-light text-gray-900 mb-1">{demoStats.accuracy}%</p>
              <p className="text-sm text-gray-400">precisión media</p>
            </div>
          </div>

          {/* Weekly progress - Simple bar */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Meta semanal</p>
              <p className="text-sm text-gray-400">{demoStats.weeklyProgress}/{demoStats.weeklyGoal}</p>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gray-900 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(demoStats.weeklyProgress / demoStats.weeklyGoal) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </section>

        {/* Topics - Clean list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Tus temas</h3>
            <button
              onClick={() => setShowAllTopics(!showAllTopics)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Ver todos
            </button>
          </div>

          <div className="space-y-1">
            {demoTopics.map((topic) => (
              <motion.button
                key={topic.id}
                className="w-full flex items-center justify-between py-4 px-1 hover:bg-gray-50 rounded-lg transition-colors text-left"
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                    <p className="text-xs text-gray-400">{topic.progress}% completado</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </motion.button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Alternative Variant: Ultra Minimal ───────────────────
export function HomeUltraMinimal() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 pt-16 pb-8">

        {/* Just the greeting and one number */}
        <header className="mb-16">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Domingo, 8 Marzo</p>
          <h1 className="text-3xl font-light text-gray-900 leading-tight">
            7 días<br />
            <span className="text-gray-400">de racha</span>
          </h1>
        </header>

        {/* Single action */}
        <section className="mb-16">
          <motion.button
            className="group flex items-center gap-4"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
            <div className="text-left">
              <p className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                Continuar
              </p>
              <p className="text-sm text-gray-400">10 min · Constitución</p>
            </div>
          </motion.button>
        </section>

        {/* Minimal stats */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-gray-900">78%</span>
            <span className="text-sm text-gray-400">precisión</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-gray-900">45</span>
            <span className="text-sm text-gray-400">de 75 esta semana</span>
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Alternative Variant: Card Focus ──────────────────────
export function HomeCardFocus() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-5 pt-6 pb-6">

        {/* Minimal header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Domingo</p>
            <h1 className="text-lg font-semibold text-gray-900">Oposita Smart</h1>
          </div>
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
        </header>

        {/* Main card - generous padding */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-sm mb-6"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-sm text-gray-400 mb-6">Tu siguiente paso</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Constitución Española
          </h2>
          <p className="text-gray-500 mb-8">
            8 preguntas de repaso pendientes
          </p>

          <motion.button
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium"
            whileTap={{ scale: 0.98 }}
          >
            Comenzar · 10 min
          </motion.button>
        </motion.div>

        {/* Simple stats row */}
        <div className="flex justify-around py-6">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">7</p>
            <p className="text-xs text-gray-400 mt-1">racha</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">78%</p>
            <p className="text-xs text-gray-400 mt-1">precisión</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">45</p>
            <p className="text-xs text-gray-400 mt-1">esta semana</p>
          </div>
        </div>

      </div>
    </div>
  );
}
