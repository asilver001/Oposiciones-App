/**
 * HomeProposalC — "Dashboard + Bottom Sheet"
 *
 * Ultra-clean home: swipeable CTA + 2 stat cards.
 * Full details live in a draggable bottom sheet ("Mi progreso").
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useDragControls } from 'framer-motion';
import {
  Flame, Target, Play, Clock, RefreshCw, AlertTriangle,
  BookOpen, Zap, Calendar, Eye, ChevronUp, X, CalendarCheck
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
];

const demoTopics = [
  { id: 1, number: 1, name: 'Constitución Española', status: 'avanzando', progress: 72 },
  { id: 3, number: 3, name: 'AGE: órganos centrales', status: 'riesgo', progress: 35 },
  { id: 9, number: 9, name: 'Personal funcionario', status: 'dominado', progress: 91 },
  { id: 4, number: 4, name: 'CCAA y Administración Local', status: 'progreso', progress: 55 },
  { id: 8, number: 8, name: 'Cortes Generales', status: 'avanzando', progress: 68 },
];

const activityIcons = {
  'refresh-cw': RefreshCw,
  'alert-triangle': AlertTriangle,
  'book-open': BookOpen,
  'clock': Clock,
  'zap': Zap,
};

const activityColors = {
  'review-due': { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600', button: 'bg-amber-600' },
  'weak-topic': { bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-600', button: 'bg-red-600' },
  'new-topic': { bg: 'bg-brand-50', border: 'border-brand-200', icon: 'bg-brand-100 text-brand-600', button: 'bg-brand-600' },
};

const statusColors = {
  dominado: { bg: 'bg-emerald-500', label: 'Dominado', text: 'text-emerald-700' },
  avanzando: { bg: 'bg-blue-500', label: 'Avanzando', text: 'text-blue-700' },
  progreso: { bg: 'bg-brand-500', label: 'En progreso', text: 'text-brand-700' },
  riesgo: { bg: 'bg-red-500', label: 'En riesgo', text: 'text-red-700' },
  nuevo: { bg: 'bg-gray-300', label: 'Nuevo', text: 'text-gray-500' },
};

// ─── Swipeable CTA ──────────────────────────────────────
function SwipeableCTA({ activities, dismissed, onDismiss, onRestore }) {
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-150, 0], [0, 1]);

  if (dismissed) {
    return (
      <motion.button
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        onClick={onRestore}
        className="w-full py-2.5 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Sesión oculta · Pulsa para mostrar
      </motion.button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Reveal behind */}
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
            <span className="text-[10px] text-gray-400">← desliza</span>
          </div>

          {activities.map((activity, idx) => {
            const colors = activityColors[activity.type] || activityColors['new-topic'];
            const IconComponent = activityIcons[activity.icon] || Zap;

            return (
              <button
                key={idx}
                className={`w-full ${colors.bg} border ${colors.border} rounded-xl p-3 text-left active:scale-[0.98] transition-transform`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${colors.icon} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4" />
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
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Two Stat Cards ─────────────────────────────────────
function TwoStatCards({ streak, accuracy }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <Flame className="w-5 h-5 text-amber-500 mb-2" />
        <p className="text-3xl font-bold text-gray-900">{streak}</p>
        <p className="text-xs text-gray-500">días consecutivos</p>
      </div>
      <div className="bg-brand-50 rounded-2xl p-4 border border-brand-100">
        <Target className="w-5 h-5 text-brand-500 mb-2" />
        <p className="text-3xl font-bold text-gray-900">{accuracy}%</p>
        <p className="text-xs text-gray-500">precisión media</p>
      </div>
    </div>
  );
}

// ─── Bottom Sheet ───────────────────────────────────────
function BottomSheet({ isOpen, onToggle }) {
  const weeklyData = [8, 12, 5, 15, 3, 0, 0];
  const weeklyTotal = weeklyData.reduce((s, d) => s + d, 0);
  const weeklyGoal = 75;
  const weeklyPercent = Math.min(Math.round((weeklyTotal / weeklyGoal) * 100), 100);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const maxDay = Math.max(...weeklyData, 1);
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

  return (
    <>
      {/* Collapsed trigger */}
      {!isOpen && (
        <motion.button
          onClick={onToggle}
          className="w-full bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Mi progreso</span>
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Temas, meta semanal, nivel...</p>
        </motion.button>
      )}

      {/* Expanded bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
          >
            {/* Drag handle + header */}
            <button
              onClick={onToggle}
              className="w-full p-4 pb-2"
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Mi progreso</span>
                <X className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            <div className="px-4 pb-4 space-y-4">
              {/* Weekly goal */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-brand-500" />
                    <span className="text-xs font-semibold text-gray-700">Meta semanal</span>
                  </div>
                  <span className="text-xs text-gray-500">{weeklyTotal}/{weeklyGoal}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: weeklyPercent >= 100 ? '#10b981' : 'var(--color-brand-500)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyPercent}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <div className="flex items-end gap-1 h-10">
                  {weeklyData.map((count, idx) => {
                    const barH = maxDay > 0 ? Math.max(3, (count / maxDay) * 36) : 3;
                    const isToday = idx === todayIdx;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="w-full rounded-sm"
                          style={{
                            height: barH,
                            backgroundColor: isToday ? 'var(--color-brand-500)' : count > 0 ? 'var(--color-brand-200)' : '#f3f4f6',
                          }}
                        />
                        <span className={`text-[9px] ${isToday ? 'font-bold text-brand-600' : 'text-gray-400'}`}>
                          {days[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topic progress */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Progreso por tema</h4>
                <div className="space-y-2.5">
                  {demoTopics.map((topic) => {
                    const colors = statusColors[topic.status];
                    return (
                      <div key={topic.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-700 truncate mr-2">T{topic.number}. {topic.name}</span>
                          <span className={`text-xs font-medium ${colors.text} flex-shrink-0`}>{topic.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${colors.bg} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="mt-2.5 text-xs text-brand-600 font-medium">Ver todos los temas →</button>
              </div>

              {/* Level */}
              <div className="bg-brand-600 rounded-xl p-3.5 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <div>
                      <p className="text-sm font-bold">Nivel 3 — Estudiante</p>
                      <p className="text-[11px] text-white/70">150 preguntas respondidas</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/70 rounded-full" style={{ width: '40%' }} />
                </div>
                <p className="text-[11px] text-white/60 mt-1">150 preguntas para Nivel 4</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function HomeProposalC() {
  const [dismissed, setDismissed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

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
          45 días
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

      {/* Two stat cards */}
      <TwoStatCards streak={5} accuracy={82} />

      {/* Bottom sheet */}
      <BottomSheet
        isOpen={sheetOpen}
        onToggle={() => setSheetOpen(!sheetOpen)}
      />
    </div>
  );
}
