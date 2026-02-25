/**
 * HomeProposalA — "Focus Mode"
 *
 * Simplified home: swipeable CTA + compact 3-stat row + expandable details.
 * Philosophy: The main action occupies most of the screen. Stats are compact.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Flame, Target, CalendarCheck, ChevronDown, ChevronUp,
  Play, Clock, RefreshCw, AlertTriangle, BookOpen, Zap, Calendar, Eye
} from 'lucide-react';

// ─── Demo data ───────────────────────────────────────────
const demoActivities = [
  {
    type: 'review-due',
    title: 'Repaso: Constitución',
    description: '8 preguntas pendientes de repaso',
    icon: 'refresh-cw',
    estimatedMinutes: 5,
  },
  {
    type: 'weak-topic',
    title: 'Reforzar Tema 3: AGE',
    description: 'Precisión baja en últimas sesiones',
    icon: 'alert-triangle',
    estimatedMinutes: 10,
  },
  {
    type: 'new-topic',
    title: 'Tema nuevo: Ley 39/2015',
    description: 'Siguiente tema en tu plan',
    icon: 'book-open',
    estimatedMinutes: 15,
  },
];

const demoTopics = [
  { id: 1, number: 1, name: 'Constitución Española', status: 'avanzando', progress: 72 },
  { id: 3, number: 3, name: 'AGE: órganos centrales', status: 'riesgo', progress: 35 },
  { id: 9, number: 9, name: 'Personal funcionario', status: 'dominado', progress: 91 },
  { id: 4, number: 4, name: 'CCAA y Administración Local', status: 'progreso', progress: 55 },
];

const activityIcons = {
  'refresh-cw': RefreshCw,
  'alert-triangle': AlertTriangle,
  'book-open': BookOpen,
  'clock': Clock,
  'zap': Zap,
};

const activityColors = {
  'review-due': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'bg-amber-100 text-amber-600', button: 'bg-amber-600' },
  'weak-topic': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'bg-red-100 text-red-600', button: 'bg-red-600' },
  'new-topic': { bg: 'bg-brand-50', border: 'border-brand-200', text: 'text-brand-700', icon: 'bg-brand-100 text-brand-600', button: 'bg-brand-600' },
};

const statusColors = {
  dominado: { bg: 'bg-emerald-500', text: 'text-emerald-700' },
  avanzando: { bg: 'bg-blue-500', text: 'text-blue-700' },
  progreso: { bg: 'bg-brand-500', text: 'text-brand-700' },
  riesgo: { bg: 'bg-red-500', text: 'text-red-700' },
  nuevo: { bg: 'bg-gray-300', text: 'text-gray-500' },
};

// ─── Swipeable CTA ──────────────────────────────────────
function SwipeableCTA({ activities, dismissed, onDismiss, onRestore }) {
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-150, 0], [0, 1]);
  const constraintRef = useRef(null);

  if (dismissed) {
    return (
      <motion.button
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        onClick={onRestore}
        className="w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Sesión oculta · Mostrar
      </motion.button>
    );
  }

  return (
    <div ref={constraintRef} className="relative overflow-hidden rounded-2xl">
      {/* Background hint */}
      <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-end pr-6">
        <span className="text-sm text-gray-400">← Ocultar</span>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        dragElastic={0.1}
        style={{ x: dragX, opacity }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) {
            onDismiss();
          }
        }}
        className="relative bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900">Tu sesión de hoy</h3>
            <span className="text-[10px] text-gray-400">← desliza para ocultar</span>
          </div>

          {activities.map((activity, idx) => {
            const colors = activityColors[activity.type] || activityColors['new-topic'];
            const IconComponent = activityIcons[activity.icon] || Zap;

            return (
              <motion.button
                key={idx}
                className={`w-full ${colors.bg} border ${colors.border} rounded-xl p-3 text-left active:scale-[0.98] transition-transform`}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + idx * 0.06 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <span className="text-xs text-gray-400 ml-2">{activity.estimatedMinutes} min</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-lg ${colors.button} flex items-center justify-center flex-shrink-0`}>
                    <Play className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Compact Stats Row ──────────────────────────────────
function CompactStatsRow({ streak, accuracy, weeklyTotal, weeklyGoal }) {
  const weeklyPercent = Math.min(Math.round((weeklyTotal / weeklyGoal) * 100), 100);

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <p className="text-xl font-bold text-gray-900">{streak}</p>
        <p className="text-[10px] text-gray-500">días racha</p>
      </div>

      <div className="bg-brand-50 rounded-xl p-3 text-center border border-brand-100">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Target className="w-4 h-4 text-brand-500" />
        </div>
        <p className="text-xl font-bold text-gray-900">{accuracy}%</p>
        <p className="text-[10px] text-gray-500">precisión</p>
      </div>

      <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <CalendarCheck className="w-4 h-4 text-emerald-500" />
        </div>
        <p className="text-xl font-bold text-gray-900">{weeklyPercent}%</p>
        <p className="text-[10px] text-gray-500">{weeklyTotal}/{weeklyGoal} sem.</p>
      </div>
    </div>
  );
}

// ─── Expandable Details ─────────────────────────────────
function ExpandableDetails({ topics }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3 overflow-hidden"
    >
      {/* Topic progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Progreso por tema</h4>
        <div className="space-y-3">
          {topics.map((topic) => {
            const colors = statusColors[topic.status] || statusColors.nuevo;
            return (
              <div key={topic.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700">T{topic.number}. {topic.name}</span>
                  <span className={`text-xs font-medium ${colors.text}`}>{topic.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors.bg} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-3 text-xs text-brand-600 font-medium">Ver todos los temas →</button>
      </div>

      {/* Weekly breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Esta semana</h4>
        <div className="flex items-end gap-1 h-12">
          {[8, 12, 5, 15, 0, 0, 0].map((count, idx) => {
            const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
            const maxH = 15;
            const barH = maxH > 0 ? Math.max(3, (count / maxH) * 40) : 3;
            const isToday = idx === new Date().getDay() - 1 || (new Date().getDay() === 0 && idx === 6);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm transition-all"
                  style={{
                    height: barH,
                    backgroundColor: isToday ? 'var(--color-brand-500)' : count > 0 ? 'var(--color-brand-200)' : '#f3f4f6',
                  }}
                />
                <span className={`text-[10px] ${isToday ? 'font-bold text-brand-600' : 'text-gray-400'}`}>
                  {days[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level */}
      <div className="bg-brand-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <div>
              <p className="font-bold">Nivel 3 — Estudiante</p>
              <p className="text-xs text-white/70">150 preguntas respondidas</p>
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/70 rounded-full" style={{ width: '40%' }} />
        </div>
        <p className="text-xs text-white/60 mt-1">150 preguntas para Nivel 4</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function HomeProposalA() {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Greeting + Exam countdown */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-brand-500 font-medium uppercase tracking-wider">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long' })}
          </p>
          <h2 className="text-xl font-bold text-gray-900">Hola, Juan</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
          <Calendar className="w-3.5 h-3.5" />
          45 días para el examen
        </div>
      </div>

      {/* Swipeable CTA */}
      <AnimatePresence mode="wait">
        <SwipeableCTA
          key={dismissed ? 'dismissed' : 'visible'}
          activities={demoActivities}
          dismissed={dismissed}
          onDismiss={() => setDismissed(true)}
          onRestore={() => setDismissed(false)}
        />
      </AnimatePresence>

      {/* Compact Stats Row */}
      <CompactStatsRow
        streak={5}
        accuracy={82}
        weeklyTotal={43}
        weeklyGoal={75}
      />

      {/* Expand/Collapse toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
      >
        {expanded ? (
          <>Ocultar detalles <ChevronUp className="w-4 h-4" /></>
        ) : (
          <>Ver detalles <ChevronDown className="w-4 h-4" /></>
        )}
      </button>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && <ExpandableDetails topics={demoTopics} />}
      </AnimatePresence>
    </div>
  );
}
